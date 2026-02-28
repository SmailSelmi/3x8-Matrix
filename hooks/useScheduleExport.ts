// hooks/useScheduleExport.ts
import { useCallback, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { format } from "date-fns";
import { arDZ } from "date-fns/locale";

export const useScheduleExport = () => {
  const snapshotRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const exportImage = useCallback(async (month: Date) => {
    const node = snapshotRef.current;
    if (!node) return;

    setIsExporting(true);
    try {
      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#020617",
        style: {
          // Ensure the element is "visible" during capture
          position: "static",
          left: "0",
          top: "0",
          opacity: "1",
        },
      });

      const monthLabel = format(month, "MMMM-yyyy", { locale: arDZ });
      const link = document.createElement("a");
      link.download = `schedule-${monthLabel}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setIsExporting(false);
    }
  }, []);

  return { snapshotRef, exportImage, isExporting };
};
