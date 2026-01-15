"use client";

type LoaderProps = {
  message?: string;
};

export default function Loader({ message = "Processing..." }: LoaderProps) {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>

      {/* Loader Card */}
      <div className="relative z-10 w-[320px] bg-[#0f172a] px-8 py-6 rounded-2xl shadow-2xl border border-slate-700">
        <p className="text-slate-300 text-sm font-medium mb-4 text-center">
          {message}
        </p>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full w-[40%] bg-blue-500 rounded-full animate-loader-slide"></div>
        </div>

        <p className="mt-3 text-xs text-slate-400 text-center">
          Please do not refresh
        </p>
      </div>

      {/* Animation */}
      <style jsx>{`
        @keyframes loaderSlide {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(250%);
          }
        }

        .animate-loader-slide {
          animation: loaderSlide 1.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
