"use client";

 

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Crop,
  Maximize2,
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Undo2,
  Redo2,
  Save,
} from "lucide-react";
import "./image-editor.css";

interface ImageEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  onSave: (blob: Blob, filename: string) => void;
  fileName?: string;
}

interface EditorState {
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  cropX: number;
  cropY: number;
  cropW: number;
  cropH: number;
  scaleW: number;
  scaleH: number;
}

const DEFAULT_STATE: EditorState = {
  rotation: 0,
  flipH: false,
  flipV: false,
  cropX: 0,
  cropY: 0,
  cropW: 0,
  cropH: 0,
  scaleW: 0,
  scaleH: 0,
};

type EditorMode = "crop" | "scale" | "rotate";

export function ImageEditor({
  open,
  onOpenChange,
  imageUrl,
  onSave,
  fileName = "edited-image.jpg",
}: ImageEditorProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const imageRef = React.useRef<HTMLImageElement | null>(null);
  const [mode, setMode] = React.useState<EditorMode>("crop");
  const [state, setState] = React.useState<EditorState>({ ...DEFAULT_STATE });
  const [history, setHistory] = React.useState<EditorState[]>([]);
  const [historyIndex, setHistoryIndex] = React.useState(-1);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [naturalW, setNaturalW] = React.useState(0);
  const [naturalH, setNaturalH] = React.useState(0);

  // Crop drag state
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });

  // Load image
  React.useEffect(() => {
    if (!open || !imageUrl) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageRef.current = img;
      setNaturalW(img.naturalWidth);
      setNaturalH(img.naturalHeight);
      setState({
        ...DEFAULT_STATE,
        cropW: img.naturalWidth,
        cropH: img.naturalHeight,
        scaleW: img.naturalWidth,
        scaleH: img.naturalHeight,
      });
      setHistory([]);
      setHistoryIndex(-1);
      setImageLoaded(true);
    };
    img.src = imageUrl;
    return () => { setImageLoaded(false); };
  }, [open, imageUrl]);

  // Draw to canvas
  React.useEffect(() => {
    if (!imageLoaded || !canvasRef.current || !imageRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imageRef.current;
    const { rotation, flipH, flipV, cropX, cropY, cropW, cropH } = state;

    // Set canvas size to crop area
    const isRotated90 = rotation === 90 || rotation === 270;
    const displayW = isRotated90 ? cropH : cropW;
    const displayH = isRotated90 ? cropW : cropH;

    canvas.width = displayW || img.naturalWidth;
    canvas.height = displayH || img.naturalHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    // Center transforms
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    if (flipH) ctx.scale(-1, 1);
    if (flipV) ctx.scale(1, -1);

    const w = cropW || img.naturalWidth;
    const h = cropH || img.naturalHeight;
    ctx.drawImage(img, cropX, cropY, w, h, -w / 2, -h / 2, w, h);

    ctx.restore();
  }, [state, imageLoaded]);

  const pushHistory = (newState: EditorState) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setState(newState);
  };

  const undo = () => {
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    setState(history[newIndex]);
  };

  const redo = () => {
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    setState(history[newIndex]);
  };

  const handleRotate = (degrees: number) => {
    pushHistory({ ...state, rotation: (state.rotation + degrees + 360) % 360 });
  };

  const handleFlip = (axis: "h" | "v") => {
    if (axis === "h") pushHistory({ ...state, flipH: !state.flipH });
    else pushHistory({ ...state, flipV: !state.flipV });
  };

  const handleScale = (w: number, h: number) => {
    pushHistory({ ...state, scaleW: w, scaleH: h, cropW: w, cropH: h });
  };

  const handleSave = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob(
      (blob) => {
        if (blob) onSave(blob, fileName);
        onOpenChange(false);
      },
      "image/jpeg",
      0.92,
    );
  };

  // Crop drag handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== "crop") return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || mode !== "crop") return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Draw crop overlay
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx || !imageRef.current) return;

    // Redraw image
    const img = imageRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, state.cropX, state.cropY, state.cropW, state.cropH, 0, 0, canvas.width, canvas.height);

    // Draw semi-transparent overlay
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clear crop area
    const cropLeft = Math.min(dragStart.x, x);
    const cropTop = Math.min(dragStart.y, y);
    const cropWidth = Math.abs(x - dragStart.x);
    const cropHeight = Math.abs(y - dragStart.y);
    ctx.clearRect(cropLeft, cropTop, cropWidth, cropHeight);
    ctx.drawImage(img, state.cropX, state.cropY, state.cropW, state.cropH, 0, 0, canvas.width, canvas.height);

    // Redraw overlay except crop area
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(0, 0, canvas.width, cropTop);
    ctx.fillRect(0, cropTop, cropLeft, cropHeight);
    ctx.fillRect(cropLeft + cropWidth, cropTop, canvas.width - cropLeft - cropWidth, cropHeight);
    ctx.fillRect(0, cropTop + cropHeight, canvas.width, canvas.height - cropTop - cropHeight);

    // Crop border
    ctx.strokeStyle = "#0052cc";
    ctx.lineWidth = 2;
    ctx.strokeRect(cropLeft, cropTop, cropWidth, cropHeight);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || mode !== "crop") return;
    setIsDragging(false);

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const scaleX = (state.cropW || naturalW) / (canvasRef.current?.width || 1);
    const scaleY = (state.cropH || naturalH) / (canvasRef.current?.height || 1);

    const cropLeft = Math.min(dragStart.x, x) * scaleX;
    const cropTop = Math.min(dragStart.y, y) * scaleY;
    const cropWidth = Math.abs(x - dragStart.x) * scaleX;
    const cropHeight = Math.abs(y - dragStart.y) * scaleY;

    if (cropWidth > 10 && cropHeight > 10) {
      pushHistory({
        ...state,
        cropX: state.cropX + cropLeft,
        cropY: state.cropY + cropTop,
        cropW: cropWidth,
        cropH: cropHeight,
        scaleW: cropWidth,
        scaleH: cropHeight,
      });
    }
  };

  const aspectRatio = naturalW && naturalH ? naturalW / naturalH : 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="image-editor-dialog">
        <DialogHeader>
          <DialogTitle>Edit Image</DialogTitle>
        </DialogHeader>

        {/* Toolbar */}
        <div className="image-editor-toolbar">
          <div className="image-editor-tools">
            <button
              type="button"
              className="image-editor-tool"
              data-active={mode === "crop" || undefined}
              onClick={() => setMode("crop")}
            >
              <Crop className="size-4" />
              Crop
            </button>
            <button
              type="button"
              className="image-editor-tool"
              data-active={mode === "scale" || undefined}
              onClick={() => setMode("scale")}
            >
              <Maximize2 className="size-4" />
              Scale
            </button>
            <button
              type="button"
              className="image-editor-tool"
              data-active={mode === "rotate" || undefined}
              onClick={() => setMode("rotate")}
            >
              <RotateCw className="size-4" />
              Rotate
            </button>
          </div>

          <div className="image-editor-toolbar-divider" />

          <button type="button" className="image-editor-tool" onClick={undo} disabled={historyIndex <= 0}>
            <Undo2 className="size-4" />
            Undo
          </button>
          <button type="button" className="image-editor-tool" onClick={redo} disabled={historyIndex >= history.length - 1}>
            <Redo2 className="size-4" />
            Redo
          </button>

          <div className="image-editor-toolbar-spacer" />

          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="size-3.5" />
            Save
          </Button>
        </div>

        {/* Mode-specific controls */}
        {mode === "scale" && (
          <div className="image-editor-scale-controls">
            <div className="image-editor-scale-field">
              <span>Width</span>
              <Input
                type="number"
                value={Math.round(state.scaleW)}
                onChange={(e) => {
                  const w = parseInt(e.target.value) || 0;
                  handleScale(w, Math.round(w / aspectRatio));
                }}
                className="w-20 h-7 text-xs text-center"
              />
              <span>px</span>
            </div>
            <span className="text-(--el-400)">×</span>
            <div className="image-editor-scale-field">
              <span>Height</span>
              <Input
                type="number"
                value={Math.round(state.scaleH)}
                onChange={(e) => {
                  const h = parseInt(e.target.value) || 0;
                  handleScale(Math.round(h * aspectRatio), h);
                }}
                className="w-20 h-7 text-xs text-center"
              />
              <span>px</span>
            </div>
          </div>
        )}

        {mode === "rotate" && (
          <div className="image-editor-rotate-controls">
            <Button variant="outline" size="sm" onClick={() => handleRotate(-90)}>
              <RotateCcw className="size-4" /> 90° Left
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleRotate(90)}>
              <RotateCw className="size-4" /> 90° Right
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleFlip("h")}>
              <FlipHorizontal className="size-4" /> Flip H
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleFlip("v")}>
              <FlipVertical className="size-4" /> Flip V
            </Button>
          </div>
        )}

        {mode === "crop" && (
          <p className="image-editor-hint">
            Click and drag on the image to select a crop area
          </p>
        )}

        {/* Canvas */}
        <div className="image-editor-canvas-wrapper">
          <canvas
            ref={canvasRef}
            className="image-editor-canvas"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => setIsDragging(false)}
          />
        </div>

        {/* Info */}
        <div className="image-editor-info">
          <span>
            {Math.round(state.scaleW || naturalW)} × {Math.round(state.scaleH || naturalH)} px
          </span>
          {state.rotation !== 0 && <span>Rotated {state.rotation}°</span>}
          {state.flipH && <span>Flipped H</span>}
          {state.flipV && <span>Flipped V</span>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
