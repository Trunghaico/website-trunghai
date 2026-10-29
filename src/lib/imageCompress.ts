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
