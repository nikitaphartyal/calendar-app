import { cloudinary } from "./cloudinary";
import { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

//Delete content from cloudinary
export const deleteFromCloudinary = async (publicId: string) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader
        .destroy(publicId)
        .then((result) => {
            resolve({ success: true, result });
        })
        .catch((error) => {
            reject({ success: false, error });
        });
    });
};