"use client";

import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

interface TinyMCEEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number;
}

export default function TinyMCEEditor({
  value,
  onChange,
  placeholder,
  height = 520,
}: TinyMCEEditorProps) {
  const editorRef = useRef<any>(null);

  return (
    <div className="tinymce-wrapper rounded-[3px] overflow-hidden border border-slate-200 bg-white shadow-2xs">
      <Editor
        tinymceScriptSrc="https://cdn.jsdelivr.net/npm/tinymce@7/tinymce.min.js"
        onInit={(_evt, editor) => {
          editorRef.current = editor;
        }}
        value={value}
        onEditorChange={(newContent) => {
          onChange(newContent);
        }}
        init={{
          height: height,
          menubar: "file edit view insert format tools table",
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks fontfamily fontsize | " +
            "bold italic underline strikethrough | forecolor backcolor | " +
            "alignleft aligncenter alignright alignjustify | " +
            "bullist numlist outdent indent | link image media table | " +
            "removeformat | code fullscreen preview",
          content_style: `
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              font-size: 14px;
              line-height: 1.65;
              color: #1e293b;
              padding: 16px;
              margin: 0;
            }
            img {
              max-width: 100%;
              height: auto;
              border-radius: 3px;
            }
            figure.image {
              display: inline-block;
              border: 1px solid #e2e8f0;
              margin: 12px auto;
              padding: 4px;
              border-radius: 3px;
              text-align: center;
            }
            figure.image figcaption {
              font-size: 12px;
              color: #64748b;
              font-style: italic;
              margin-top: 4px;
            }
          `,
          placeholder: placeholder || "Nhập nội dung chi tiết bài viết tại đây...",
          branding: false,
          promotion: false,
          elementpath: true,
          resize: true,
          object_resizing: true, // 8 điểm neo kéo thu nhỏ phóng to ảnh & bảng biểu mượt mà
          image_caption: true,   // Cho phép thêm chú thích ảnh bên dưới
          image_advtab: true,    // Tab căn chỉnh chi tiết (khoảng cách, viền)
          image_title: true,
          automatic_uploads: true,
          file_picker_types: "image",
          images_upload_handler: async (blobInfo: any) => {
            try {
              const formData = new FormData();
              formData.append("file", blobInfo.blob(), blobInfo.filename());
              const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
              });
              if (!res.ok) {
                throw new Error("Lỗi khi tải ảnh lên máy chủ");
              }
              const data = await res.json();
              return data.url;
            } catch (err: any) {
              throw new Error(err.message || "Upload ảnh thất bại");
            }
          },
        }}
      />
    </div>
  );
}
