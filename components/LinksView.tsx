"use client";

import React from "react";
import GlassCard from "./GlassCard";
import {
  Plane,
  PlaneTakeoff,
  Globe,
  Apple,
  Smartphone,
  BusFront,
  Train,
  CarTaxiFront,
  CreditCard,
  ShieldPlus,
  ExternalLink,
} from "lucide-react";

interface LinkAction {
  url: string;
  cta: string;
  Icon: React.ElementType;
}

interface LinkItem {
  title: string;
  Icon: React.ElementType;
  iconColor: string;
  actions: LinkAction[];
}

interface LinkCategory {
  title: string;
  items: LinkItem[];
}

const categories: LinkCategory[] = [
  {
    title: "النقل الجوي",
    items: [
      {
        title: "الخطوط الجوية الجزائرية",
        Icon: Plane,
        iconColor: "text-sky-400",
        actions: [
          {
            url: "https://airalgerie.dz/ar/",
            cta: "الموقع",
            Icon: Globe,
          },
          {
            url: "https://play.google.com/store/apps/details?id=com.amadeus.merci.ah",
            cta: "Android",
            Icon: Smartphone,
          },
          {
            url: "https://apps.apple.com/fr/app/air-alg%C3%A9rie/id1458273665",
            cta: "iOS",
            Icon: Apple,
          },
        ],
      },
      {
        title: "طيران الطاسيلي",
        Icon: PlaneTakeoff,
        iconColor: "text-emerald-400",
        actions: [
          {
            url: "https://fly.tassiliairlines.com/B2C/ar",
            cta: "الموقع",
            Icon: Globe,
          },
        ],
      },
    ],
  },
  {
    title: "النقل البري",
    items: [
      {
        title: "محطتي - سوڨرال",
        Icon: BusFront,
        iconColor: "text-amber-400",
        actions: [
          {
            url: "https://play.google.com/store/apps/details?id=com.sogral.mobile",
            cta: "Android",
            Icon: Smartphone,
          },
          {
            url: "https://apps.apple.com/dz/app/mahatati/id6754021775",
            cta: "iOS",
            Icon: Apple,
          },
        ],
      },
      {
        title: "السكك الحديدية (SNTF)",
        Icon: Train,
        iconColor: "text-blue-400",
        actions: [
          {
            url: "https://www.sntf.dz/",
            cta: "الموقع",
            Icon: Globe,
          },
          {
            url: "https://play.google.com/store/apps/details?id=dz.sntf.sntf",
            cta: "Android",
            Icon: Smartphone,
          },
        ],
      },
      {
        title: "يسير (Yassir)",
        Icon: CarTaxiFront,
        iconColor: "text-rose-400",
        actions: [
          {
            url: "https://play.google.com/store/apps/details?id=com.yatechnologies.yassir_rider",
            cta: "Android",
            Icon: Smartphone,
          },
          {
            url: "https://apps.apple.com/dz/app/yassir/id1256346215",
            cta: "iOS",
            Icon: Apple,
          },
        ],
      },
    ],
  },
  {
    title: "المالية والصحة",
    items: [
      {
        title: "بريدي موب (BaridiMob)",
        Icon: CreditCard,
        iconColor: "text-yellow-400",
        actions: [
          {
            url: "https://play.google.com/store/apps/details?id=ru.bpc.mobilebank.bpc",
            cta: "Android",
            Icon: Smartphone,
          },
          {
            url: "https://apps.apple.com/fr/app/baridimob/id1481839638",
            cta: "iOS",
            Icon: Apple,
          },
        ],
      },
      {
        title: "فضاء الهناء (CNAS El Hanaa)",
        Icon: ShieldPlus,
        iconColor: "text-teal-400",
        actions: [
          {
            url: "https://elhanaa.cnas.dz/",
            cta: "الموقع",
            Icon: Globe,
          },
          {
            url: "https://play.google.com/store/apps/details?id=dz.cnas.elhanaa",
            cta: "Android",
            Icon: Smartphone,
          },
        ],
      },
    ],
  },
];

export default function LinksView() {
  return (
    <div className="flex flex-col gap-6 w-full" dir="rtl">
      <div className="w-full flex flex-col gap-6">
        {/* Header */}
        <div className="text-center mb-2">
          <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(255,255,255,0.05)] animate-zoom-in">
            <Globe className="text-slate-300" size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-100">روابط وخدمات</h1>
          <p className="text-sm font-bold text-slate-500 mt-1">
            دليل الخدمات الأساسية لعمال التناوب
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-col gap-8">
          {categories.map((category, catIndex) => (
            <div key={catIndex} className="flex flex-col gap-4">
              <div className="flex items-center gap-3 px-2">
                <div className="h-px bg-white/10 flex-1" />
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  {category.title}
                </h2>
                <div className="h-px bg-white/10 flex-1" />
              </div>

              <div className="grid gap-3">
                {category.items.map((item, itemIndex) => (
                  <GlassCard
                    key={itemIndex}
                    className="p-4 group hover:bg-white/[0.04] transition-all duration-300 border-white/[0.05]"
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon Container */}
                      <div className="p-3 bg-white/5 border border-white/5 rounded-2xl shadow-inner group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                        <item.Icon size={24} className={item.iconColor} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col gap-2 pt-1">
                        <h3 className="text-sm font-black text-slate-100 group-hover:text-white transition-colors">
                          {item.title}
                        </h3>

                        <div className="flex flex-wrap gap-2 mt-1">
                          {item.actions.map((action, actionIndex) => (
                            <a
                              key={actionIndex}
                              href={action.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-[10px] font-bold uppercase tracking-wide transition-all duration-300 active:scale-95 border border-white/5 hover:border-white/10"
                            >
                              <action.Icon size={14} />
                              <span>{action.cta}</span>
                              {action.cta === "الموقع" && (
                                <ExternalLink
                                  size={10}
                                  className="scale-x-[-1] opacity-70 ml-0.5"
                                />
                              )}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Info Card */}
        <div className="mt-2 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-center">
          <p className="text-[10px] font-bold text-slate-500 italic leading-relaxed px-4">
            هذه الروابط خارجية وتخص الجهات الرسمية. التطبيق لا يتحمل مسؤولية
            محتوى هذه المنصات.
          </p>
        </div>
      </div>
    </div>
  );
}
