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
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    onFileSelected(file);
  };

  return (
    <div
      onClick={() => {
        inputRef.current?.click();
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="
        group
        w-full h-full min-h-[320px]
        border-2 border-dashed border-slate-700/50
        rounded-2xl
        flex flex-col items-center justify-center
        bg-[#111827]
        hover:bg-[#161f32] hover:border-blue-500/30
        transition-all duration-300 ease-in-out
        cursor-pointer
        relative
      "
    >
      {/* Icon Circle */}
      <div className="w-20 h-20 bg-[#0F1623] rounded-full flex items-center justify-center mb-6 shadow-inner border border-slate-800 group-hover:scale-110 transition-transform duration-300">
        <svg 
          className="w-10 h-10 text-blue-500" 
          fill="currentColor" 
          viewBox="0 0 20 20" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
          <path d="M9 13h2v5a1 1 0 11-2 0v-5z" />
        </svg>
      </div>

      {/* Main Text */}
      <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
        Upload File
      </h3>

      {/* Subtext */}
      <p className="text-slate-400 text-sm mb-8 font-medium">
        Drag & drop your .txt file here, or click to browse
      </p>

      {/* Button Visual */}
      <button
        type="button" // Prevent form submission if inside a form
        className="
          bg-[#1F2937] 
          text-white 
          text-xs font-bold 
          uppercase tracking-wider
          py-3 px-8 
          rounded-lg 
          border border-slate-700
          shadow-lg
          group-hover:bg-[#2d3b4e] group-hover:border-slate-600
          transition-all
        "
      >
        Select File
      </button>

      {/* Hidden Input */}
      <input
        ref={inputRef}
        type="file"
        accept=".txt,text/plain, .deflate"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}