"use client";

import { useRef } from "react";

type UploadBoxProps = {
  onFileSelected: (file: File) => void;
};

export default function UploadBox({ onFileSelected }: UploadBoxProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    console.log("HANDLE FILE CHANGE FIRED");

    if (!file) return;

    console.log("SELECTED FILE:", file);

    onFileSelected(file);

    // reset so selecting same file fires again
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];

    console.log("FILE DROPPED:", file);

    if (!file) return;

    onFileSelected(file);
  };

  return (
    <div
      onClick={() => {
        console.log("UPLOAD BOX CLICKED");
        inputRef.current?.click();
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="
        text-black w-[500px] h-[250px] 
        border-2 border-dashed border-gray-500 
        rounded-lg 
        flex flex-col items-center justify-center 
        bg-[#faf8db]
        hover:bg-gray-100
        transition
        shadow-lg
      "
    >
      <p className="text-xl text-black font-semibold mb-3">
        Upload a Text File
      </p>

      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='w-20 h-20 text-blue-900'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        strokeWidth={1.5}
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M9 12h6m-8 4h8M9 8h6m5 12H4a2 2 0 01-2-2V6a2 2 0 012-2h8l6 6v10a2 2 0 01-2 2z'
        />
      </svg>

      <input
        ref={inputRef}
        type="file"
        accept=".txt,text/plain"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
