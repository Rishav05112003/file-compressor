"use client";

import { useState } from "react";
import UploadBox from "./(components)/UploadBox";
import ResultCard from "./(components)/ResultCard";
import Loader from "./(components)/Loader";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleFileUpload = async (file: File) => {
    if (!file.name.endsWith(".txt")) {
      alert("Only .txt files are allowed");
      return;
    }

    try {
      setIsLoading(true);
      setOriginalSize(file.size);
      setFileName(file.name);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/compress", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error("Compression failed");
      }

      const blob = await response.blob();

      // Force the compressed file to download as .txt
      const compressedTxtBlob = new Blob([blob], {
        type: "text/plain"
      });

      setCompressedBlob(compressedTxtBlob);
      setCompressedSize(compressedTxtBlob.size);
    } catch (err) {
      console.error(err);
      alert("Something went wrong while compressing the file.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">
        TXT File Compressor (DEFLATE)
      </h1>

      {!compressedBlob && !isLoading && (
        <UploadBox onFileSelected={handleFileUpload} />
      )}

      {isLoading && <Loader message="Applying DEFLATE Compression..." />}

      {compressedBlob && originalSize && compressedSize && (
        <ResultCard
          originalSize={originalSize}
          compressedSize={compressedSize}
          fileName={fileName.replace(".txt", "-deflated.txt")}
          compressedBlob={compressedBlob}
          onReset={() => {
            setCompressedBlob(null);
            setCompressedSize(null);
            setOriginalSize(null);
            setFileName("");
          }}
        />
      )}
    </main>
  );
}
