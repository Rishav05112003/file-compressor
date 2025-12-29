"use client";

import { saveAs } from 'file-saver';
import { formatBytes } from "../(utils)/sizeFormatter";

type ResultCardProps = {
  originalSize: number;
  compressedSize: number;
  fileName: string;
  compressedBlob: Blob;
  onReset: () => void;
};

export default function ResultCard({
  originalSize,
  compressedSize,
  fileName,
  compressedBlob,
  onReset
}: ResultCardProps) {
  const reduction =
    originalSize > 0
      ? (((originalSize - compressedSize) / originalSize) * 100).toFixed(1)
      : "0";

  const handleDownload = () => {
    const newName = `compressed-${fileName}`;
    saveAs(compressedBlob, newName);
  };

  return (
    <div className="mt-6 w-full max-w-xl p-6 border rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Compression Successful 🎉</h2>

      <div className="flex justify-between text-sm">
        <p>Original Size:</p>
        <p>{formatBytes(originalSize)}</p>
      </div>

      <div className="flex justify-between text-sm">
        <p>Compressed Size:</p>
        <p>{formatBytes(compressedSize)}</p>
      </div>

      <div className="flex justify-between text-sm font-semibold mt-2">
        <p>Space Saved:</p>
        <p>{reduction}%</p>
      </div>

      <div className="flex items-center gap-4 mt-6">
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Download File
        </button>

        <button
          onClick={onReset}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Compress Another File
        </button>
      </div>
    </div>
  );
}
