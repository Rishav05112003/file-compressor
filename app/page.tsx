"use client";

import { useState } from "react";
import UploadBox from "./(components)/UploadBox";
import Loader from "./(components)/Loader";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);

  const handleFileUpload = async (file: File) => {
    console.log("FILE RECEIVED IN PAGE", file);

    if (!file.name.endsWith(".txt")) {
      alert("Only .txt files allowed");
      return;
    }

    try {
      setIsLoading(true);
      setOriginalSize(file.size);
      setFileName(file.name);

      const formData = new FormData();
      formData.append("file", file);

      console.log("FINAL DATA TO SEND:");
      for (const p of formData.entries()) {
        console.log(p[0], p[1]);
      }

      const response = await fetch("/api/compress", {
        method: "POST",
        body: formData
      });

      if (!response.ok) throw new Error("Compression Failed");

      const blob = await response.blob();
      console.log("RECEIVED COMPRESSED BLOB:", blob);

      setCompressedBlob(blob);
      setCompressedSize(blob.size);

    } catch (err) {
      console.error(err);
      alert("Compression failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!compressedBlob) return;

    const url = URL.createObjectURL(compressedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName.replace(".txt", "-deflated.txt");
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setCompressedBlob(null);
    setCompressedSize(null);
    setOriginalSize(null);
    setFileName("");
  };

  const ratio =
    originalSize && compressedSize
      ? ((1 - compressedSize / originalSize) * 100).toFixed(2)
      : null;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-green-200">

      <h1 className="text-4xl font-bold mb-10">
        TXT File Compressor (DEFLATE)
      </h1>

      {!compressedBlob && !isLoading && (
        <UploadBox onFileSelected={handleFileUpload} />
      )}

      {isLoading && (
        <Loader message="Compressing your text file..." />
      )}

      {compressedBlob && (
        <div className="bg-white p-8 rounded-xl shadow-xl text-center">
          <h2 className="text-2xl font-bold mb-4">
            Compression Successful 🎉
          </h2>

          <p className="mb-2">
            Original Size: <b>{(originalSize! / 1024).toFixed(2)} KB</b>
          </p>

          <p className="mb-2">
            Compressed Size: <b>{(compressedSize! / 1024).toFixed(2)} KB</b>
          </p>

          <p className="mb-4 text-green-700 font-semibold">
            Compression Ratio: {ratio}% smaller
          </p>

          <div className="flex gap-4 justify-center mt-4">
            <button
              onClick={handleDownload}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Download
            </button>

            <button
              onClick={handleReset}
              className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500"
            >
              Upload Another File
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
