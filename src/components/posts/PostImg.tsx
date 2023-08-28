import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Quill from "quill";
import ImageResize from "@looop/quill-image-resize-module-react";
import { supabase } from "../../supabase"; // Supabase 클라이언트 설정 파일

Quill.register("modules/ImageResize", ImageResize);

interface PostImgProps {
  onContentChange: (newContent: string) => void;
  initialContent: string;
}

async function uploadImageToSupabase(imageFile: File): Promise<string> {
  try {
    // 이미지 파일의 이름을 고유하게 만듭니다. 예를 들어 현재 시간을 사용할 수 있습니다.
    const uniqueName = `${Date.now()}_${imageFile.name}`;

    const { data, error } = await supabase.storage
      .from("image")
      .upload("images/" + uniqueName, imageFile, { cacheControl: "3600" });

    if (error) {
      throw error;
    }

    // 이미지 URL을 가져오는 방법
    const imageUrlObject = supabase.storage
      .from("image")
      .getPublicUrl("images/" + uniqueName);

    if (imageUrlObject && imageUrlObject.data) {
      const imageUrl = imageUrlObject.data.publicUrl;
      return imageUrl;
    } else {
      throw new Error("Failed to obtain the image URL");
    }
  } catch (error) {
    console.error("Error uploading image to Supabase:", error);
    throw error;
  }
}

export default function PostImg({
  onContentChange,
  initialContent,
}: PostImgProps) {
  const [content, setContent] = useState(initialContent);
  const quillRef = useRef<ReactQuill | null>(null);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    onContentChange(newContent);
  };

  const handleImage = async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];

      if (file) {
        try {
          const imageUrl = await uploadImageToSupabase(file);
          console.log("URL 이름 :", imageUrl);

          const quillEditor = quillRef.current?.getEditor();
          const range = quillEditor?.getSelection();

          if (quillEditor && range) {
            const index = range.index || 0;
            quillEditor.insertEmbed(index, "image", imageUrl);
            const newIndex = index + 1 + imageUrl.length;
            quillEditor.setSelection(newIndex, 0);
          }
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }
    };
  };

  useEffect(() => {
    if (quillRef.current) {
      const toolbar = quillRef.current.getEditor().getModule("toolbar");
      toolbar.addHandler("image", handleImage);
    }
  }, []);

  return (
    <div>
      <h2>텍스트 에디터</h2>
      <ReactQuill
        style={{
          width: "1000px",
          height: "400px",
          marginBottom: "50px",
        }}
        value={content}
        onChange={handleContentChange}
        ref={(el) => {
          if (el) {
            quillRef.current = el;
          }
        }}
        modules={{
          toolbar: [
            [{ header: "1" }, { header: "2" }, { font: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["bold", "italic", "underline"],
            [{ align: [] }, { color: [] }, { background: [] }],
            ["image"],
          ],
          ImageResize: {
            parchment: Quill.import("parchment"),
          },
        }}
        formats={[
          "header",
          "font",
          "size",
          "list",
          "bold",
          "italic",
          "underline",
          "align",
          "color",
          "background",
          "image",
        ]}
      />
    </div>
  );
}