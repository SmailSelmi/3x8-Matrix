// components/SettingsForm.tsx
"use client";

import React, { useState } from "react";
import { AppSettings } from "@/hooks/useAppSettings";
import { SystemType } from "@/lib/shiftPatterns";
import GlassCard from "./GlassCard";

interface SettingsFormProps {
  onSave: (settings: AppSettings) => void;
  onCancel?: () => void;
  initialData: AppSettings;
}

export default function SettingsForm({
  onSave,
  onCancel,
  initialData,
}: SettingsFormProps) {
  const [formData, setFormData] = useState<AppSettings>(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      <GlassCard className="p-6">
        <h2 className="text-xl font-black mb-6">إعدادات النظام</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black text-slate-500 uppercase">
              الاسم
            </label>
            <input
              type="text"
              value={formData.userName}
              onChange={(e) =>
                setFormData({ ...formData, userName: e.target.value })
              }
              className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-slate-100 outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black text-slate-500 uppercase">
              نظام الدوام
            </label>
            <select
              value={formData.systemType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  systemType: e.target.value as SystemType,
                })
              }
              className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-slate-100 outline-none focus:border-blue-500"
            >
              <option value="3x8_industrial">نظام (3×8) الصناعي</option>
              <option value="5x2_admin">نظام (5×2) الإداري</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black text-slate-500 uppercase">
              تاريخ بداية الدورة
            </label>
            <input
              type="date"
              value={formData.cycleStartDate}
              onChange={(e) =>
                setFormData({ ...formData, cycleStartDate: e.target.value })
              }
              className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-slate-100 outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 py-4 bg-blue-600 rounded-2xl text-white font-black"
            >
              حفظ
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-4 bg-white/[0.05] rounded-2xl text-slate-400 font-black"
              >
                إلغاء
              </button>
            )}
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
