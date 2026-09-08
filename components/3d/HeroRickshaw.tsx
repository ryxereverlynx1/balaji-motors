"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Check, ZoomIn, ZoomOut, RefreshCw, Info, X } from "lucide-react";

interface ColorOption {
  name: string;
  hex: string;
  image: string;
}

const colorPresets: ColorOption[] = [
  { name: "Dealership Red", hex: "#C9232A", image: "/images/rickshaw-red.webp" },
  { name: "Punjab Blue", hex: "#1D4ED8", image: "/images/rickshaw-blue.webp" },
  { name: "Emerald Green", hex: "#047857", image: "/images/rickshaw-green.webp" },
  { name: "Pure White", hex: "#E5E7EB", image: "/images/rickshaw-white.webp" },
];

const heroHotspots = [
  {
    id: "motor",
    title: "High-Torque BLDC Motor",
    desc: "Direct electric drive motor with heavy differential axle for smooth city driving.",
    top: "70%",
    left: "22%",
  },
  {
    id: "cockpit",
    title: "Ergonomic Driver Cockpit",
    desc: "Sturdy handlebar with digital speedometer, reverse toggle, and comfortable driver saddle.",
    top: "44%",
    left: "32%",
  },
  {
    id: "battery",
    title: "Under-Seat Battery Compartment",
    desc: "Lockable, balanced battery tray supporting tubular lead-acid or lithium battery systems.",
    top: "62%",
    left: "52%",
  },
  {
    id: "passenger",
    title: "Passenger Bench Seating",
    desc: "Cushioned diamond-stitched vinyl seating with safety grab handles and rain flaps.",
    top: "48%",
    left: "68%",
  },
  {
    id: "roof",
    title: "Luggage Carrier & Roof Canopy",
    desc: "Fibre-reinforced canopy with stainless steel overhead baggage rack.",
    top: "18%",
    left: "56%",
  },
];

export default function HeroRickshaw() {
  const [selectedColor, setSelectedColor] = useState<ColorOption>(colorPresets[0]);
  const [zoom, setZoom] = useState(1);
  const [showHotspots, setShowHotspots] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<typeof heroHotspots[0] | null>(null);
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

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[360px] sm:h-[440px] lg:h-[500px] select-none flex flex-col justify-between overflow-hidden bg-gradient-to-b from-brand-warmWhite to-brand-cream/70"
    >
      <div className="absolute top-2.5 sm:top-4 left-2.5 sm:left-4 z-20 flex items-center gap-1.5 sm:gap-2">
        <span className="px-2 sm:px-2.5 py-1 rounded bg-white/90 backdrop-blur-sm border border-brand-border text-[10px] sm:text-[11px] font-bold tracking-wideUpper uppercase text-brand-charcoal shadow-xs flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-brand-red shrink-0" />
          <span className="hidden xs:inline sm:inline">Interactive </span>
          <span>Studio</span>
        </span>

        <button
          type="button"
          onClick={() => {
            setShowHotspots(!showHotspots);
            if (showHotspots) setActiveHotspot(null);
          }}
          className={`px-2 sm:px-2.5 py-1 rounded text-[10px] sm:text-[11px] font-bold tracking-wideUpper uppercase border transition-colors shadow-xs flex items-center gap-1 ${
            showHotspots
              ? "bg-brand-red text-white border-brand-red"
              : "bg-white/90 text-brand-charcoal border-brand-border hover:bg-white"
          }`}
        >
          <Info className="w-3 h-3" />
          <span>Hotspots</span>
        </button>
      </div>

      <div className="absolute top-2.5 sm:top-4 right-2.5 sm:right-4 z-20 flex items-center gap-1 bg-white/90 backdrop-blur-sm p-1 rounded border border-brand-border shadow-xs">
        <button
          type="button"
          onClick={() => setZoom((prev) => Math.min(prev + 0.15, 1.45))}
          className="p-1.5 text-brand-charcoal hover:text-brand-red rounded transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => setZoom((prev) => Math.max(prev - 0.15, 0.9))}
          className="p-1.5 text-brand-charcoal hover:text-brand-red rounded transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => {
            setZoom(1);
            setTilt({ x: 0, y: 0 });
          }}
          className="p-1.5 text-brand-charcoal hover:text-brand-red rounded transition-colors"
          title="Reset View"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="relative flex-1 w-full h-full flex items-center justify-center p-4">
        <div
          className="relative w-full h-full max-w-[540px] max-h-[440px] transition-transform duration-200 ease-out"
          style={{
            transform: `scale(${zoom}) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          <Image
            src={selectedColor.image}
            alt="Balaji Motors Electric Rickshaw"
            fill
            priority
            className="object-contain drop-shadow-xl"
            sizes="(max-width: 768px) 100vw, 540px"
          />

          {showHotspots &&
            heroHotspots.map((hs) => (
              <button
                key={hs.id}
                type="button"
                onClick={() => setActiveHotspot(hs)}
                style={{ top: hs.top, left: hs.left }}
                className="absolute z-20 group -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-full bg-brand-red text-white shadow-md hover:scale-125 transition-transform"
                title={hs.title}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping absolute inset-0 m-auto opacity-75" />
                <span className="w-1.5 h-1.5 rounded-full bg-white relative z-10" />
              </button>
            ))}
        </div>
      </div>

      {activeHotspot && (
        <div className="absolute bottom-16 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-sm z-30 bg-white border border-brand-border p-4 rounded shadow-elevated animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-start justify-between gap-3 mb-1">
            <h4 className="text-sm font-bold text-brand-charcoal">{activeHotspot.title}</h4>
            <button
              type="button"
              onClick={() => setActiveHotspot(null)}
              className="text-brand-muted hover:text-brand-charcoal p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-brand-muted leading-relaxed">{activeHotspot.desc}</p>
        </div>
      )}

      <div className="relative z-20 mx-2 sm:mx-4 mb-2 sm:mb-4 flex flex-wrap items-center justify-between gap-2 sm:gap-3 bg-white/95 backdrop-blur-md px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded border border-brand-border shadow-card">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-wideUpper text-brand-muted font-bold">
            Colors:
          </span>
          <div className="flex items-center gap-1 sm:gap-1.5">
            {colorPresets.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setSelectedColor(c)}
                className="group relative w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-brand-charcoal/20 transition-transform hover:scale-110 flex items-center justify-center shadow-xs"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              >
                {selectedColor.name === c.name && (
                  <Check className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${c.hex === "#E5E7EB" ? "text-brand-charcoal" : "text-white"} drop-shadow-sm`} />
                )}
              </button>
            ))}
          </div>
          <span className="text-xs text-brand-charcoal font-bold ml-1 hidden sm:inline">
            {selectedColor.name}
          </span>
        </div>

        <span className="text-[10px] sm:text-[11px] text-brand-muted uppercase tracking-wideUpper font-semibold hidden sm:inline">
          Real Punjab Dealership Stock
        </span>
      </div>
    </div>
  );
}