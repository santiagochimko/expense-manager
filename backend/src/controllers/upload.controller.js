import { uploadImageToCloudinary } from "../services/upload.service.js";

export const uploadReceipt = async (req, res, next) => {
    try {
        const uploadedImage = await uploadImageToCloudinary(req.file?.buffer);

        res.status(201).json({
            message: "Imagen subida correctamente",
            data: uploadedImage
        });
    } catch (error) {
        next(error);
    }
};