"use client";

import * as React from "react";
import { Upload } from "lucide-react";
import "./upload-dropzone.css";

interface UploadDropzoneProps {
  onDrop: (files: File[]) => void;
  children: React.ReactNode;
}

/**
 * Page-level drop handler — shows a full-size overlay when dragging files
 * anywhere onto the library.
 */
export function UploadDropzone({ onDrop, children }: UploadDropzoneProps) {
  const [dragging, setDragging] = React.useState(false);
  const counterRef = React.useRef(0);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.dataTransfer.types.includes("Files")) return;
    counterRef.current += 1;
    if (counterRef.current === 1) setDragging(true);
  };

  const handleDragLeave = () => {
    counterRef.current = Math.max(0, counterRef.current - 1);
    if (counterRef.current === 0) setDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    counterRef.current = 0;
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) onDrop(files);
  };

  return (
    <div
      data-slot="upload-dropzone"
      data-dragging={dragging ? "true" : "false"}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {children}
      {dragging ? (
        <div data-slot="upload-dropzone-overlay" aria-hidden="true">
          <Upload />
          <span>Drop files to upload</span>
        </div>
      ) : null}
    </div>
  );
}
