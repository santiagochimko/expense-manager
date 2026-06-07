import multer from "multer";
import createError from "../utils/createError.js";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(createError("Formato de imagen no permitido", 400));
    }

    cb(null, true);
};

export const uploadReceiptImage = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024
    }
}).single("image");