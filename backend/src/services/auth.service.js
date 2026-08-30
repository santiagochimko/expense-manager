import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import createError from "../utils/createError.js";

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            username: user.username,
            role: user.role,
            plan: user.plan
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
};

export const registerUser = async (userData) => {
    const { username, email, password } = userData;

    // Verifico si ya existe username
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
        throw createError("El nombre de usuario ya existe", 409);
    }

    // Verifico si ya existe email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
        throw createError("El email ya está registrado", 409);
    }

    // Hasheo password antes de guardar
    const hashedPassword = await bcrypt.hash(password, 10);

    // El registro público siempre crea usuarios comunes premium.
    // Los administradores se inicializan desde variables de entorno en backend.
    const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        role: "user",
        plan: "premium"
    });

    const token = generateToken(newUser);

    return { user: newUser, token };
};

export const loginUser = async ({ username, password }) => {
    const user = await User.findOne({ username });

    if (!user) {
        throw createError("Credenciales incorrectas", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw createError("Credenciales incorrectas", 401);
    }

    const token = generateToken(user);

    return { user, token };
};