import * as React from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import type { Asset, UploadAssetVars } from "@/lib/hooks/use-assets";
import { logger } from "@/lib/logger";

export type UploadStatus = "queued" | "uploading" | "success" | "error";

export interface UploadJob {
  id: string;
  file: File;
  progress: number;
  status: UploadStatus;
  error?: string;
  asset?: Asset;
}

export interface UploadQueueOptions {
  concurrency?: number;
  folderId?: string;
}

export interface UploadQueue {
  jobs: UploadJob[];
  enqueue: (files: File[]) => void;
  remove: (id: string) => void;
  clear: () => void;
  isActive: boolean;
  completedCount: number;
  totalCount: number;
}

type UploadMutation = UseMutationResult<Asset, Error, UploadAssetVars, unknown>;

const DEFAULT_CONCURRENCY = 3;

export function useMediaUploadQueue(
  uploadMutation: UploadMutation,
  options: UploadQueueOptions = {},
): UploadQueue {
  const concurrency = options.concurrency ?? DEFAULT_CONCURRENCY;
  const [jobs, setJobs] = React.useState<UploadJob[]>([]);
  const runningRef = React.useRef(0);
  const queueRef = React.useRef<UploadJob[]>([]);

  const updateJob = React.useCallback(
    (id: string, patch: Partial<UploadJob>) => {
      setJobs((prev) =>
        prev.map((j) => (j.id === id ? { ...j, ...patch } : j)),
      );
    },
    [],
  );

  const pumpRef = React.useRef<() => void>(() => undefined);

  React.useEffect(() => {
    pumpRef.current = () => {
      while (runningRef.current < concurrency && queueRef.current.length > 0) {
        const job = queueRef.current.shift();
        if (!job) break;
        runningRef.current += 1;

        updateJob(job.id, { status: "uploading" });

        uploadMutation
          .mutateAsync({
            file: job.file,
            folderId: options.folderId,
            onProgress: (percent) => updateJob(job.id, { progress: percent }),
          })
          .then((asset) => {
            updateJob(job.id, {
              status: "success",
              progress: 100,
              asset,
            });
          })
          .catch((err: Error) => {
            logger.error("upload-queue: job failed", err);
            updateJob(job.id, {
              status: "error",
              error: err.message || "Upload failed",
            });
          })
          .finally(() => {
            runningRef.current = Math.max(0, runningRef.current - 1);
            pumpRef.current();
          });
      }
    };
  }, [concurrency, options.folderId, uploadMutation, updateJob]);

  const pump = React.useCallback(() => pumpRef.current(), []);

  const enqueue = React.useCallback(
    (files: File[]) => {
      const newJobs: UploadJob[] = files.map((file) => ({
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,
        file,
        progress: 0,
        status: "queued",
      }));
      setJobs((prev) => [...prev, ...newJobs]);
      queueRef.current.push(...newJobs);
      pump();
    },
    [pump],
  );

  const remove = React.useCallback((id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
    queueRef.current = queueRef.current.filter((j) => j.id !== id);
  }, []);

  const clear = React.useCallback(() => {
    setJobs((prev) => prev.filter((j) => j.status === "uploading"));
    queueRef.current = [];
  }, []);

  const completedCount = jobs.filter(
    (j) => j.status === "success" || j.status === "error",
  ).length;
  const isActive = jobs.some(
    (j) => j.status === "queued" || j.status === "uploading",
  );

  return {
    jobs,
    enqueue,
    remove,
    clear,
    isActive,
    completedCount,
    totalCount: jobs.length,
  };
}
