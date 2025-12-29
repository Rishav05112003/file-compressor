"use client";

type LoaderProps = {
  message?: string;
};

export default function Loader({ message = "Processing..." }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center mt-6">
      <div className="h-10 w-10 border-4 border-gray-400 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="mt-3 text-gray-600">{message}</p>
    </div>
  );
}
