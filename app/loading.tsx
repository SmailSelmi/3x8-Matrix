// app/loading.tsx
import React from "react";

export default function Loading() {
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-950 p-6 flex flex-col gap-6"
    >
      {/* Header Skeleton (وهمي لشريط التنقل العلوي) */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex flex-col gap-2">
          <div className="h-3 w-16 bg-slate-800 rounded-full animate-pulse"></div>
          <div className="h-5 w-32 bg-slate-800 rounded-full animate-pulse"></div>
        </div>
        <div className="h-12 w-12 bg-slate-800 rounded-full animate-pulse"></div>
      </div>

      {/* Main Card Skeleton (وهمي للبطاقة الرئيسية للوردية) */}
      <div className="h-48 w-full bg-slate-800/80 rounded-[2rem] animate-pulse"></div>

      {/* Grid Cards Skeleton (وهمي لبطاقات الإحصائيات الصغيرة) */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="h-36 w-full bg-slate-800/60 rounded-3xl animate-pulse"></div>
        <div className="h-36 w-full bg-slate-800/60 rounded-3xl animate-pulse"></div>
      </div>

      {/* List Skeletons (وهمي لقائمة الأيام القادمة) */}
      <div className="flex flex-col gap-3 mt-6">
        <div className="h-16 w-full bg-slate-800/50 rounded-2xl animate-pulse"></div>
        <div className="h-16 w-full bg-slate-800/50 rounded-2xl animate-pulse"></div>
        <div className="h-16 w-full bg-slate-800/50 rounded-2xl animate-pulse"></div>
      </div>
    </div>
  );
}
