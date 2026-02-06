import cloudinary from "../config/cloudinary.js";
import fs from "fs/promises";
import path from "path";
import cloudinaryDelete from "./cloudinaryDelete.js";


export async function cleanupLocalFiles(files) {
    if (!files || files.length === 0) return;

    for (const file of files) {
        try {
            await fs.access(file.path);
            await fs.unlink(file.path);
        } catch (error) {
            // File does not exist or cannot be accessed, ignore
            // console.warn(`Failed to delete local file: ${file.path}`, error);
        }
    }
}


export async function uploadMedia(images = [], videos = []) {
    const imgs = [];
    const vids = [];

    try {
        // Upload images
        for (const image of images) {
            const uploadData = await cloudinary.uploader.upload(image.path, {
                resource_type: "image"
            });
            imgs.push({ url: uploadData.secure_url, publicId: uploadData.public_id });
        }

        // Upload videos
        // Upload videos
        for (const video of videos) {
            // Ensure absolute path for videos to match previous behavior
            const videoPath = path.join(process.cwd(), video.path);

            const uploadData = await cloudinary.uploader.upload(videoPath, {
                resource_type: "video"
            });
            vids.push({ url: uploadData.secure_url, publicId: uploadData.public_id });
        }

        return { imgs, vids };

    } catch (error) {
        // Cleanup cloud uploads on failure
        if (imgs.length > 0 || vids.length > 0) {
            await cloudinaryDelete(
                imgs.map(img => img.publicId),
                vids.map(video => video.publicId)
            );
        }
        // Cleanup local files should be handled by the caller in a finally block
        throw error;
    }
}
