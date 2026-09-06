import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FFFDF7] text-slate-900 flex items-center justify-center p-4 text-center font-sans">
      <div className="max-w-md bg-white p-8 rounded-3xl border-2 border-amber-300 shadow-xl space-y-4">
        <span className="text-4xl">🌸</span>
        <h2 className="text-2xl font-bold text-slate-950">Page Not Found</h2>
        <p className="text-xs text-slate-600">
          The requested page could not be found. Please return to the BroomBoom Cabs Kolkata Durga Puja homepage.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow hover:scale-105 transition-all"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}

