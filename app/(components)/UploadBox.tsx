"use client";

import { useRef } from "react";

type UploadBoxProps = {
  onFileSelected: (file: File) => void;
};

export default function UploadBox({ onFileSelected }: UploadBoxProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onFileSelected(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    onFileSelected(file);
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="
        w-full max-w-xl h-48 border-2 border-dashed border-gray-400 
        rounded-lg flex flex-col justify-center items-center cursor-pointer 
        hover:bg-gray-100 transition
      "
    >
      <p className="text-lg font-medium">Drag & Drop your file here</p>
      <p className="text-sm text-gray-500 mt-2">or click to browse</p>

      <input
        ref={inputRef}
        type="file"
        onChange={handleFileChange}
        hidden
        accept=".txt,text/plain"
      />
    </div>
  );
}
