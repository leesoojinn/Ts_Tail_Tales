import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Quill from "quill";
import ImageResize from "@looop/quill-image-resize-module-react";
import { supabase } from "../../supabase";
import Swal from "sweetalert2";
import * as S from "../../styles/components/postimg/style.postimg";

Quill.register("modules/ImageResize", ImageResize);

interface PostImgProps {
  onContentChange: (newContent: string) => void;
  initialContent: string;
}

async function uploadImageToSupabase(imageFile: File): Promise<string> {
  try {
    const uniqueName = `${Date.now()}_${imageFile.name}`;

    const { data, error } = await supabase.storage.from("image").upload("images/" + uniqueName, imageFile, { cacheControl: "3600" });

    if (error) {
      throw error;
    }

    const imageUrlObject = supabase.storage.from("image").getPublicUrl("images/" + uniqueName);

    if (imageUrlObject && imageUrlObject.data) {
      const imageUrl = imageUrlObject.data.publicUrl;
      return imageUrl;
    } else {
      throw new Error("Failed to obtain the image URL");
    }
  } catch (error) {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "이미지 업로드 중 오류 발생",
      showConfirmButton: false,
      timerProgressBar: true,
      timer: 1200,
    });
    throw error;
  }
}

function PostImg({ onContentChange, initialContent }: PostImgProps) {
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

          const quillEditor = quillRef?.current?.getEditor();
          const range = quillEditor?.getSelection();

          if (quillEditor && range) {
            const index = range.index || 0;
            quillEditor.insertEmbed(index, "image", imageUrl);
            const newIndex = index + 1 + imageUrl.length;
            quillEditor.setSelection(newIndex, 0);
          }
        } catch (error) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "이미지 업로드 중 오류 발생",
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 1200,
          });
        }
      }
    };
  };

  useEffect(() => {
    if (quillRef?.current) {
      const toolbar = quillRef?.current.getEditor().getModule("toolbar");
      toolbar.addHandler("image", handleImage);
    }
  }, []);

  return (
    <S.PostImgContainer>
      <S.StReactQuill
        value={content}
        onChange={handleContentChange}
        placeholder="내용을 입력해주세요"
        ref={(el) => {
          if (el) {
            quillRef.current = el;
          }
        }}
        modules={{
          toolbar: [[{ header: "1" }, { header: "2" }, { font: [] }], [{ list: "ordered" }, { list: "bullet" }], ["bold", "italic", "underline"], [{ align: [] }, { color: [] }, { background: [] }], ["image"]],
          ImageResize: {
            parchment: Quill.import("parchment"),
          },
        }}
        formats={["header", "font", "size", "list", "bold", "italic", "underline", "align", "color", "background", "image"]}
      />
    </S.PostImgContainer>
  );
}

export default PostImg;
