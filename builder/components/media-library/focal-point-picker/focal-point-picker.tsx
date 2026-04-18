"use client";
/* eslint-disable @next/next/no-img-element -- CMS images */

import * as React from "react";
import "./focal-point-picker.css";

interface FocalPoint {
  x: number; // 0..1
  y: number; // 0..1
}

interface FocalPointPickerProps {
  src: string;
  alt: string;
  value: FocalPoint | null;
  onChange: (value: FocalPoint) => void;
  onCommit?: (value: FocalPoint) => void;
}

/**
 * Click/drag on the image to set a focal point (0..1 coordinates).
 * Used by smart-crop algorithms and CSS `object-position` for responsive
 * cropping hints.
 */
export function FocalPointPicker({
  src,
  alt,
  value,
  onChange,
  onCommit,
}: FocalPointPickerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const draggingRef = React.useRef(false);

  const updateFromEvent = React.useCallback(
    (clientX: number, clientY: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = clamp((clientX - rect.left) / rect.width);
      const y = clamp((clientY - rect.top) / rect.height);
      onChange({ x, y });
    },
    [onChange],
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    containerRef.current?.setPointerCapture(e.pointerId);
    updateFromEvent(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    updateFromEvent(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    containerRef.current?.releasePointerCapture(e.pointerId);
    if (onCommit && value) onCommit(value);
  };

  const x = value ? value.x : 0.5;
  const y = value ? value.y : 0.5;

  return (
    <div
      ref={containerRef}
      data-slot="focal-point-picker"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <img src={src} alt={alt} />
      <span
        data-slot="focal-point-marker"
        style={{ left: `${x * 100}%`, top: `${y * 100}%` }}
        aria-hidden="true"
      />
    </div>
  );
}

function clamp(v: number): number {
  if (Number.isNaN(v)) return 0.5;
  return Math.max(0, Math.min(1, v));
}
