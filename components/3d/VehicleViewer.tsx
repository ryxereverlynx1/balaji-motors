"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { VehicleColor, VehicleHotspot } from "@/data/vehicles";
import { useLanguage } from "@/context/LanguageContext";
import {
  Maximize2,
  Minimize2,
  RefreshCw,
  Check,
  Info,
  ZoomIn,
  ZoomOut,
  X,
} from "lucide-react";

interface VehicleViewerProps {
  category?: "Passenger" | "Cargo / Loader";
  colors?: VehicleColor[];
  hotspots?: VehicleHotspot[];
  initialColorHex?: string;
  defaultImage?: string;
}

export default function VehicleViewer({
  category = "Passenger",
  colors = [],
  hotspots = [],
  initialColorHex,
  defaultImage = "/images/rickshaw-red.webp",
}: VehicleViewerProps) {
  const { language, dict } = useLanguage();
  const t = dict.viewer;

  const initialSelected = colors.length > 0
    ? colors.find((c) => c.hex === initialColorHex) || colors[0]
    : { name: "Dealership Red", nameHi: "डीलशिप रेड", hex: "#C9232A", image: defaultImage };

  const [activeColor, setActiveColor] = useState<VehicleColor>(initialSelected);
  const [zoom, setZoom] = useState(1);
  const [showHotspots, setShowHotspots] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<VehicleHotspot | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -6;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const currentImage = activeColor.image || defaultImage;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full overflow-hidden bg-gradient-to-b from-brand-warmWhite to-brand-cream border border-brand-border flex flex-col justify-between ${
        isFullscreen
          ? "h-screen fixed inset-0 z-50 rounded-none bg-brand-warmWhite"
          : "h-[400px] sm:h-[480px] lg:h-[540px] rounded-md shadow-card"
      }`}
    >
      <div className="absolute top-2.5 sm:top-4 left-2.5 sm:left-4 z-20 flex items-center gap-1.5 sm:gap-2">
        <span className="px-2 sm:px-3 py-1 rounded bg-white/90 backdrop-blur-sm border border-brand-border text-[10px] sm:text-[11px] font-bold tracking-wideUpper uppercase text-brand-charcoal shadow-xs flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-brand-red shrink-0" />
          <span>{t.studioTitle}</span>
        </span>

        {hotspots.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setShowHotspots(!showHotspots);
              if (showHotspots) setSelectedHotspot(null);
            }}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded border text-[10px] sm:text-[11px] font-bold tracking-wideUpper uppercase transition-all shadow-xs active:scale-[0.98] ${
              showHotspots
                ? "bg-brand-red text-white border-brand-red"
                : "bg-white/90 text-brand-charcoal border-brand-border hover:bg-white"
            }`}
          >
            <Info className="w-3 h-3" />
            <span>{t.hotspotsBtn}</span>
          </button>
        )}
      </div>

      <div className="absolute top-2.5 sm:top-4 right-2.5 sm:right-4 z-20 flex items-center gap-1 bg-white/90 backdrop-blur-sm p-1 rounded border border-brand-border shadow-xs">
        <button
          type="button"
          onClick={() => setZoom((prev) => Math.min(prev + 0.15, 1.5))}
          className="p-1.5 text-brand-charcoal hover:text-brand-red rounded transition-colors active:scale-95"
          title={t.zoomIn}
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => setZoom((prev) => Math.max(prev - 0.15, 0.9))}
          className="p-1.5 text-brand-charcoal hover:text-brand-red rounded transition-colors active:scale-95"
          title={t.zoomOut}
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => {
            setZoom(1);
            setTilt({ x: 0, y: 0 });
          }}
          className="p-1.5 text-brand-charcoal hover:text-brand-red rounded transition-colors active:scale-95"
          title={t.reset}
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={toggleFullscreen}
          className="p-1.5 text-brand-charcoal hover:text-brand-red rounded transition-colors active:scale-95"
          title={t.fullscreen}
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="relative flex-1 w-full h-full flex items-center justify-center p-6">
        <div
          className="relative w-full h-full max-w-[560px] max-h-[440px] transition-transform duration-200 ease-out"
          style={{
            transform: `scale(${zoom}) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          <Image
            src={currentImage}
            alt="Commercial Electric Rickshaw"
            fill
            priority
            className="object-contain drop-shadow-xl"
            sizes="(max-width: 768px) 100vw, 560px"
          />

          {showHotspots &&
            hotspots.map((hs) => {
              const hsTitle = language === "hi" ? hs.titleHi || hs.title : hs.title;
              return (
                <button
                  key={hs.id}
                  type="button"
                  onClick={() => setSelectedHotspot(hs)}
                  style={{ top: hs.top, left: hs.left }}
                  className="absolute z-20 group -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-full bg-brand-red text-white shadow-md hover:scale-125 transition-transform"
                  title={hsTitle}
                >
                  <span className="w-5 h-5 rounded-full bg-brand-red animate-radar-pulse absolute inset-0 m-auto pointer-events-none" />
                  <span className="w-2 h-2 rounded-full bg-white relative z-10" />
                </button>
              );
            })}
        </div>
      </div>

      {selectedHotspot && (
        <div className="absolute bottom-16 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-sm z-30 bg-white border border-brand-border p-4 rounded shadow-elevated animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <h4 className="text-sm font-bold text-brand-charcoal tracking-wide">
              {language === "hi" ? selectedHotspot.titleHi || selectedHotspot.title : selectedHotspot.title}
            </h4>
            <button
              type="button"
              onClick={() => setSelectedHotspot(null)}
              className="text-brand-muted hover:text-brand-charcoal p-0.5 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-brand-muted leading-relaxed">
            {language === "hi" ? selectedHotspot.descriptionHi || selectedHotspot.description : selectedHotspot.description}
          </p>
        </div>
      )}

      <div className="relative z-20 mx-2 sm:mx-4 mb-2 sm:mb-4 flex flex-wrap items-center justify-between gap-2 sm:gap-3 bg-white/95 backdrop-blur-md px-2.5 sm:px-3.5 py-1.5 sm:py-2.5 rounded border border-brand-border shadow-card">
        {colors.length > 0 ? (
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-wideUpper text-brand-muted font-bold">
              {t.bodyPaint}
            </span>
            <div className="flex items-center gap-1.5 sm:gap-2">
              {colors.map((c) => {
                const isSelected = activeColor.name === c.name;
                const cName = language === "hi" ? c.nameHi || c.name : c.name;
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setActiveColor(c)}
                    className={`group relative w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-brand-charcoal/20 transition-all flex items-center justify-center shadow-xs ${
                      isSelected
                        ? "ring-2 ring-offset-2 ring-brand-red scale-110"
                        : "hover:scale-105"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={cName}
                  >
                    {isSelected && (
                      <Check className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${c.hex === "#E5E7EB" ? "text-brand-charcoal" : "text-white"} drop-shadow-sm`} />
                    )}
                  </button>
                );
              })}
            </div>
            <span className="text-xs text-brand-charcoal font-bold ml-1 hidden sm:inline">
              {language === "hi" ? activeColor.nameHi || activeColor.name : activeColor.name}
            </span>
          </div>
        ) : (
          <span className="text-xs text-brand-muted uppercase tracking-wideUpper font-semibold">
            {category}
          </span>
        )}

        <span className="text-[10px] sm:text-[11px] text-brand-muted uppercase tracking-wideUpper font-semibold hidden sm:inline">
          {t.inspectLabel}
        </span>
      </div>
    </div>
  );
}