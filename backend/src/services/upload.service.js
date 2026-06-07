import cloudinary from "../config/cloudinary.js";
import createError from "../utils/createError.js";

export const uploadImageToCloudinary = (fileBuffer) => {
    if (!fileBuffer) {
        throw createError("No se recibió ninguna imagen", 400);
    }

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "expense-manager/receipts",
                resource_type: "image",
                transformation: [
                    {
                        quality: "auto",
                        fetch_format: "auto"
                    }
                ]
            },
            (error, result) => {
                if (error) {
                    reject(createError("No se pudo subir la imagen", 500));
                    return;
                }

                resolve({
                    url: result.secure_url,
                    publicId: result.public_id,
                    width: result.width,
                    height: result.height,
                    format: result.format,
                    bytes: result.bytes
                });
            }
        );

        uploadStream.end(fileBuffer);
    });
};