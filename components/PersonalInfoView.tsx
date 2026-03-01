// components/PersonalInfoView.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { User, Camera, Trash2 } from "lucide-react";
import GlassCard from "./GlassCard";
import ImageCropper from "./ImageCropper";
import { AppSettings } from "@/hooks/useAppSettings";

interface PersonalInfoViewProps {
  settings: AppSettings;
  updateSettings: (s: Partial<AppSettings>) => void;
}

export default function PersonalInfoView({
  settings,
  updateSettings,
}: PersonalInfoViewProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [imageToCrop, setImageToCrop] = React.useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageToCrop(reader.result as string);
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6 max-w-2xl mx-auto pb-8"
      dir="rtl"
    >
      {/* Section title */}
      <div className="flex items-center gap-2 px-1 pt-2">
        <User size={14} className="text-blue-400" />
        <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
          المعلومات الشخصية
        </h2>
      </div>

      {/* Profile Picture Card */}
      <GlassCard className="p-6 flex flex-col items-center gap-5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

        <span className="self-start text-[10px] font-black text-slate-500 uppercase tracking-widest">
          صورة الملف الشخصي
        </span>

        <div className="relative group w-28 h-28">
          <div className="w-full h-full rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 overflow-hidden shadow-xl shadow-blue-500/5 relative">
            {settings.profileImage ? (
              <img
                src={settings.profileImage}
                alt="Profile"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <User size={48} className="absolute" />
            )}
          </div>

          {/* Hover overlay (desktop) & tap overlay (mobile) */}
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full z-10">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-all active:scale-95"
              title="تغيير الصورة"
            >
              <Camera size={18} />
            </button>
            {settings.profileImage && (
              <button
                onClick={() => updateSettings({ profileImage: null })}
                className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-full text-red-400 backdrop-blur-sm transition-all active:scale-95"
                title="حذف الصورة"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-5 py-2.5 mt-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black hover:bg-blue-500/20 active:scale-95 transition-all shadow-lg shadow-blue-500/5"
        >
          {settings.profileImage ? "تغيير الصورة" : "رفع صورة"}
        </button>
      </GlassCard>

      {/* Username Card */}
      <GlassCard className="p-6 flex flex-col gap-3">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
          اسم المستخدم
        </label>
        <div className="relative">
          <User
            size={14}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
          />
          <input
            type="text"
            placeholder="أدخل اسمك..."
            value={settings.userName}
            onChange={(e) => updateSettings({ userName: e.target.value })}
            className="w-full bg-[#0f172a] border border-white/5 rounded-xl pl-4 pr-11 py-3.5 text-sm font-bold text-slate-100 outline-none focus:border-blue-500/50 focus:bg-blue-500/5 focus:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all"
          />
        </div>
        <p className="text-[9px] font-bold text-slate-600 mr-1">
          يظهر اسمك في الترحيب وصفحة التقرير الشخصي
        </p>
      </GlassCard>

      {/* Image Cropper Modal */}
      {imageToCrop && (
        <ImageCropper
          image={imageToCrop}
          onCropComplete={(cropped) => {
            updateSettings({ profileImage: cropped });
            setImageToCrop(null);
          }}
          onCancel={() => setImageToCrop(null)}
        />
      )}
    </motion.div>
  );
}
