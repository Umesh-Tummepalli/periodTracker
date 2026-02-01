import cloudinary from "../config/cloudinary.js";

export default function cloudinaryDelete(publicIdsImgs, publicIdsVideos) {
    try{
        publicIdsImgs.forEach((publicId) => {
            cloudinary.uploader.destroy(publicId);
        });
        publicIdsVideos.forEach((publicId) => {
            cloudinary.uploader.destroy(publicId);
        });
    }catch(error){
        console.log("Error deleting images from Cloudinary:", error);
    }
}