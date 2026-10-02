// Cloudinary Helper Service
export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "trunghai_uploads",
  apiKey: process.env.CLOUDINARY_API_KEY || "",
  apiSecret: process.env.CLOUDINARY_API_SECRET || "",
};

export function isCloudinaryConfigured(): boolean {
  return Boolean(cloudinaryConfig.cloudName);
}

/**
 * Upload an image file or base64 directly to Cloudinary
 */
export async function uploadToCloudinary(fileDataUrl: string, folder = "trunghai_media"): Promise<string> {
  if (!cloudinaryConfig.cloudName) {
    console.warn("Cloudinary is not configured. Returning the provided URL/data.");
    return fileDataUrl;
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`;

  const formData = new FormData();
  formData.append("file", fileDataUrl);
  formData.append("upload_preset", cloudinaryConfig.uploadPreset);
  formData.append("folder", folder);

  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.error?.message || "Failed to upload image to Cloudinary");
  }

  return resData.secure_url;
}
