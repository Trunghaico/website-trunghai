/**
 * Nén và giảm kích thước ảnh ngay tại trình duyệt trước khi tải lên Cloudinary.
 * Đảm bảo mọi ảnh gốc từ máy ảnh / flycam (10MB - 30MB) đều được tự động tối ưu
 * xuống dưới 1MB, giải quyết triệt để giới hạn 10MB của Cloudinary Free Plan.
 */
export async function compressImageClientSide(
  file: File | Blob,
  maxWidth = 2048,
  quality = 0.85
): Promise<Blob> {
  // Chỉ áp dụng với ảnh (bỏ qua SVG, GIF động)
  if (
    !file.type.startsWith("image/") ||
    file.type === "image/gif" ||
    file.type === "image/svg+xml"
  ) {
    return file;
  }

  // Nếu ảnh đã nhỏ hơn 1.2MB thì không cần nén thêm
  if (file.size < 1.2 * 1024 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;

      // Giới hạn chiều rộng / chiều cao tối đa (chuẩn Full HD / 2K)
      if (width > maxWidth || height > maxWidth) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxWidth) / height);
          height = maxWidth;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob && blob.size < file.size) {
            resolve(blob);
          } else {
            resolve(file);
          }
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}

/**
 * Tải ảnh trực tiếp lên Cloudinary từ trình duyệt (hoặc fallback qua /api/upload)
 * Giải quyết triệt để lỗi 413 Payload Too Large của Vercel (giới hạn 4.5MB).
 */
export async function uploadImageDirectly(
  file: File | Blob,
  fileName?: string
): Promise<string> {
  const name = fileName || (file instanceof File ? file.name : "image.jpg");

  // 1. Tự động nén ảnh tại client nếu dung lượng lớn
  let blobToUpload: Blob = file;
  try {
    blobToUpload = await compressImageClientSide(file, 2048, 0.85);
  } catch (err) {
    console.warn("Client compress error, using original file:", err);
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "syjvx1ly";
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "trunghai_uploads";

  // 2. Ưu tiên tải trực tiếp từ trình duyệt lên Cloudinary (bỏ qua máy chủ Vercel)
  if (cloudName && uploadPreset) {
    try {
      const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      const formData = new FormData();
      formData.append("file", blobToUpload, name);
      formData.append("upload_preset", uploadPreset);
      formData.append("folder", "trunghai_media");

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const resData = await response.json();
        if (resData.secure_url) {
          return resData.secure_url;
        }
      }
    } catch (directErr) {
      console.warn("Direct upload to Cloudinary failed, falling back to /api/upload:", directErr);
    }
  }

  // 3. Fallback: Nếu upload trực tiếp không thành công, gửi qua API nội bộ /api/upload
  const formData = new FormData();
  formData.append("file", blobToUpload, name);
  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  if (res.ok && data.url) {
    return data.url;
  }
  throw new Error(data.error || (res.status === 413 ? "Ảnh quá lớn (vượt quá 4.5MB của Vercel)" : `Tải ảnh thất bại (${res.status})`));
}
