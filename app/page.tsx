"use client";

import { useState } from "react";
import UploadBox from "./(components)/UploadBox";
import Loader from "./(components)/Loader";

// --- ICONS ---
const CloudIcon = () => (
  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const MagicWandIcon = () => (
  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
  </svg>
);

// ... (Other icons: LockIcon, BoltIcon, FolderIcon remain the same) ...
const LockIcon = () => (<svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>);
const BoltIcon = () => (<svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>);
const FolderIcon = () => (<svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" /></svg>);

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [mode, setMode] = useState<"compress" | "decompress">("compress");

  const handleFileUpload = async (file: File) => {
    setCompressedBlob(null);
    setCompressedSize(null);
    setIsLoading(false);

    // If text file -> Compress Mode. Anything else (presumably base64 encoded text) -> Decompress
    if (file.name.endsWith(".txt") && !file.name.includes("-compressed")) {
      setMode("compress");
    } else {
      setMode("decompress");
    }

    setSelectedFile(file);
    setFileName(file.name);
    setOriginalSize(file.size);
  };

  const handleProcess = async () => {
    if (!selectedFile) return;

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);

      const apiEndpoint = mode === "compress" ? "/api/compress" : "/api/decompress";
      
      const response = await fetch(apiEndpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Processing Failed");
      }

      const blob = await response.blob();
      setCompressedBlob(blob);
      setCompressedSize(blob.size);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Operation failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!compressedBlob) return;

    const url = URL.createObjectURL(compressedBlob);
    const a = document.createElement("a");
    a.href = url;

    // Naming Logic
    if (mode === "compress") {
       // Input: "notes.txt" -> Output: "notes-compressed.txt"
       const baseName = fileName.replace(/\.txt$/i, "");
       a.download = `${baseName}-compressed.txt`;
    } else {
       // Input: "notes-compressed.txt" -> Output: "notes-restored.txt"
       let baseName = fileName;
       if (baseName.includes("-compressed")) {
           baseName = baseName.replace("-compressed", "");
       }
       baseName = baseName.substring(0, baseName.lastIndexOf('.')) || baseName;
       a.download = `${baseName}-restored.txt`;
    }
    
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setCompressedBlob(null);
    setCompressedSize(null);
    setOriginalSize(null);
    setFileName("");
    setMode("compress");
  };

  const ratio =
    originalSize && compressedSize
      ? ((1 - compressedSize / originalSize) * 100).toFixed(2)
      : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1120] text-slate-300 font-sans selection:bg-blue-500 selection:text-white">
      {/* NAVBAR */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600/20 p-2 rounded-lg border border-blue-500/30">
            <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <span className="text-white font-bold text-xl tracking-tight">Deflate.io</span>
        </div>
        <div className="flex items-center gap-8 text-sm font-medium">
          <a href="https://github.com/Rishav05112003/file-compressor" className="hover:text-white transition-colors">GitHub</a>
        </div>
      </nav>

      {/* HERO */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 pt-12 pb-20">
        <div className="text-center space-y-6 mb-12 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wide">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Version 2.0 (Base64 Mode)
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            High-Speed Text <br />
            <span className="text-gray-400">Compression</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Upload a .txt file. We compress it and give you a portable text code. 
            Upload that code back to restore your original file instantly.
          </p>
        </div>

        {/* UI CARD */}
        <div className="w-full max-w-2xl relative z-10">
          
          {/* STEP 1: UPLOAD */}
          {!selectedFile && !isLoading && !compressedBlob && (
            <div className="bg-[#111827] border border-dashed border-slate-700 rounded-2xl p-2 shadow-2xl">
              <div className="bg-[#111827] rounded-xl overflow-hidden min-h-[200px] flex flex-col items-center justify-center relative">
                <UploadBox onFileSelected={handleFileUpload} />
              </div>
            </div>
          )}

          {/* STEP 2: CONFIRM */}
          {selectedFile && !compressedBlob && !isLoading && (
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-8 shadow-2xl text-center">
              <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CloudIcon />
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">
                Ready to {mode === "compress" ? "Compress" : "Decompress"}
              </h2>
              <p className="text-slate-400 mb-6">
                File: <span className="text-white font-medium">{fileName}</span>
                <span className="mx-2">•</span>
                Size: <span className="text-white font-medium">{(originalSize! / 1024).toFixed(2)} KB</span>
              </p>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleProcess}
                  className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-500 hover:scale-105 transition-all duration-200 shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)]"
                >
                  <MagicWandIcon />
                  {mode === "compress" ? "Compress Now" : "Restore File"}
                </button>
                <button onClick={handleReset} className="bg-slate-800 text-slate-300 px-6 py-3 rounded-lg font-medium hover:bg-slate-700 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: RESULT */}
          {compressedBlob && (
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-8 shadow-2xl text-center relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50"></div>

              <h2 className="text-2xl font-bold text-white mb-6">
                 {mode === "compress" ? "Compression Successful 🎉" : "Restoration Successful 🎉"}
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-8 max-w-sm mx-auto">
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">{mode === "compress" ? "Original" : "Compressed"}</p>
                  <p className="text-white font-mono">{(originalSize! / 1024).toFixed(2)} KB</p>
                </div>
                <div className="bg-blue-900/10 p-4 rounded-xl border border-blue-500/20">
                  <p className="text-xs text-blue-400 uppercase font-bold mb-1">{mode === "compress" ? "Compressed" : "Restored"}</p>
                  <p className="text-white font-mono">{(compressedSize! / 1024).toFixed(2)} KB</p>
                </div>
              </div>
              
              <div className="flex gap-4 justify-center">
                <button onClick={handleDownload} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-500 transition-all shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)]">
                  Download .txt File
                </button>
                <button onClick={handleReset} className="bg-slate-800 text-slate-300 px-6 py-3 rounded-lg font-medium hover:bg-slate-700 transition-colors">
                  Start Over
                </button>
              </div>
            </div>
          )}
        </div>

        {/* FEATURES ... */}
        {/* (Keep Feature Grid and Footer from your previous code) */}
        {isLoading && <Loader message={mode === "compress" ? "Compressing file..." : "Restoring file..."} />}

      </main>
    </div>
  );
}