"use client";

import { CheckCircle2, Loader2, X, AlertCircle, Upload } from "lucide-react";
import type { UploadJob } from "../hooks/use-media-upload-queue";
import { formatBytes } from "../utils";
import "./upload-queue.css";

interface UploadQueueProps {
  jobs: UploadJob[];
  completedCount: number;
  totalCount: number;
  isActive: boolean;
  onRemove: (id: string) => void;
  onClear: () => void;
}

export function UploadQueue({
  jobs,
  completedCount,
  totalCount,
  isActive,
  onRemove,
  onClear,
}: UploadQueueProps) {
  if (jobs.length === 0) return null;

  return (
    <aside data-slot="upload-queue" aria-label="Upload queue">
      <header data-slot="upload-queue-header">
        <Upload aria-hidden="true" />
        <span data-slot="upload-queue-title">
          {isActive
            ? `Uploading ${completedCount}/${totalCount}`
            : `Uploaded ${completedCount}/${totalCount}`}
        </span>
        {!isActive ? (
          <button
            type="button"
            data-slot="upload-queue-clear"
            onClick={onClear}
            aria-label="Clear completed"
          >
            Clear
          </button>
        ) : null}
      </header>
      <ul data-slot="upload-queue-list">
        {jobs.map((job) => (
          <li key={job.id} data-slot="upload-queue-item" data-status={job.status}>
            <span data-slot="upload-queue-icon">
              {job.status === "success" ? (
                <CheckCircle2 aria-hidden="true" />
              ) : job.status === "error" ? (
                <AlertCircle aria-hidden="true" />
              ) : (
                <Loader2 aria-hidden="true" />
              )}
            </span>
            <span data-slot="upload-queue-info">
              <span data-slot="upload-queue-name" title={job.file.name}>
                {job.file.name}
              </span>
              <span data-slot="upload-queue-sub">
                {job.status === "error"
                  ? (job.error ?? "Failed")
                  : formatBytes(job.file.size)}
              </span>
              <span data-slot="upload-queue-bar">
                <span
                  data-slot="upload-queue-fill"
                  style={{ width: `${job.progress}%` }}
                />
              </span>
            </span>
            <button
              type="button"
              data-slot="upload-queue-remove"
              onClick={() => onRemove(job.id)}
              aria-label="Remove from queue"
            >
              <X aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
