import bcrypt from "bcryptjs";
import User from "../models/User.js";

const hasAnyAdminConfig = () => {
    return Boolean(
        process.env.ADMIN_USERNAME ||
        process.env.ADMIN_EMAIL ||
        process.env.ADMIN_PASSWORD
    );
};

export const ensureAdminUser = async () => {
    if (!hasAnyAdminConfig()) {
        console.warn(
            "Admin inicial no configurado. Definí ADMIN_USERNAME, ADMIN_EMAIL y ADMIN_PASSWORD en el .env si necesitás crear un administrador."
        );
        return;
    }

    const username = process.env.ADMIN_USERNAME?.trim();
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    if (!username || !email || !password) {
        throw new Error(
            "ADMIN_USERNAME, ADMIN_EMAIL y ADMIN_PASSWORD deben estar definidos para crear el administrador inicial"
        );
    }

    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
        console.log("Administrador inicial ya existe. No se crea uno nuevo.");
        return;
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
        throw new Error("ADMIN_USERNAME ya está en uso por otro usuario");
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
        throw new Error("ADMIN_EMAIL ya está en uso por otro usuario");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
        username,
        email,
        password: hashedPassword,
        role: "admin",
        plan: "premium"
    });

    console.log("Administrador inicial creado correctamente desde variables de entorno");
};