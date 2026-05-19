//DTO para no devolver campos sensibles como password, etc

export const userResponseDTO = (user) => ({
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    plan: user.plan,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});