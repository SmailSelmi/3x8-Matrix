// components/ImageCropper.tsx
"use client";

import React, { useState, useCallback } from "react";
import Cropper, { Point, Area } from "react-easy-crop";
import { motion } from "framer-motion";
import { Check, X, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedImage: string) => void;
  onCancel: () => void;
}

export default function ImageCropper({
  image,
  onCropComplete,
  onCancel,
}: ImageCropperProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropChange = (crop: Point) => setCrop(crop);
  const onZoomChange = (zoom: number) => setZoom(zoom);

  const onCropCompleteInternal = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area,
  ): Promise<string | null> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height,
    );

    return canvas.toDataURL("image/jpeg");
  };

  const handleSave = async () => {
    try {
      if (croppedAreaPixels) {
        const croppedImage = await getCroppedImg(image, croppedAreaPixels);
        if (croppedImage) {
          onCropComplete(croppedImage);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/95 z-[200] flex flex-col pt-safe px-4 pb-8"
      dir="rtl"
    >
      {/* Header */}
      <div className="flex items-center justify-between py-6 px-2">
        <h3 className="text-xl font-black text-white italic">تعديل الصورة</h3>
        <button
          onClick={onCancel}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Cropper Area */}
      <div className="relative flex-1 rounded-3xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={onCropChange}
          onCropComplete={onCropCompleteInternal}
          onZoomChange={onZoomChange}
          cropShape="round"
          showGrid={false}
        />
      </div>

      {/* Controls */}
      <div className="mt-8 flex flex-col gap-8">
        {/* Zoom Slider */}
        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
          <ZoomOut size={18} className="text-slate-500" />
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-blue-500 h-1.5 rounded-full"
          />
          <ZoomIn size={18} className="text-slate-500" />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onCancel}
            className="py-4 px-6 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 font-black flex items-center justify-center gap-2 transition-all border border-white/10"
          >
            <RotateCcw size={18} />
            <span>إعادة</span>
          </button>
          <button
            onClick={handleSave}
            className="py-4 px-6 bg-blue-600 hover:bg-blue-500 rounded-2xl text-white font-black flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-500/20"
          >
            <Check size={18} />
            <span>تطبيق الثص</span>
          </button>
        </div>
      </div>
    </div>
  );
}
