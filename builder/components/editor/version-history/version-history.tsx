"use client";

import * as React from "react";
import { usePageVersions, useRestorePageVersion } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { History, RotateCcw, User, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface VersionHistoryProps {
  tenantId: string;
  pageId: string;
}

export function VersionHistory({ tenantId, pageId }: VersionHistoryProps) {
  const {
    data: versions,
    isLoading,
    error,
  } = usePageVersions(tenantId, pageId);
  const restoreVersion = useRestorePageVersion(tenantId);
  const [restoreId, setRestoreId] = React.useState<string | null>(null);

  const handleRestore = () => {
    if (restoreId) {
      restoreVersion.mutate(
        { pageId, versionId: restoreId },
        {
          onSuccess: () => setRestoreId(null),
        },
      );
    }
  };

  if (isLoading) {
    return (
      <div className="version-history">
        <div className="version-history-loading">
          {[1, 2, 3].map((i) => (
            <div key={i} className="version-skeleton">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="version-history">
        <div className="version-history-error">
          <p>Failed to load version history</p>
        </div>
      </div>
    );
  }

  if (!versions || versions.length === 0) {
    return (
      <div className="version-history">
        <div className="version-history-empty">
          <History className="size-8 text-muted-foreground" />
          <p>No versions yet</p>
          <span>Version history will appear here as you make changes.</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="version-history">
        <div className="version-list">
          {versions.map((version, index) => {
            const isLatest = index === 0;
            const authorName = version.author.firstName
              ? `${version.author.firstName} ${version.author.lastName || ""}`.trim()
              : version.author.email;

            return (
              <div
                key={version.id}
                className={`version-item ${isLatest ? "version-item-current" : ""}`}
              >
                <div className="version-header">
                  <span className="version-number">
                    v{version.version}
                    {isLatest && <span className="version-badge">Current</span>}
                  </span>
                  {!isLatest && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="version-restore-btn"
                      onClick={() => setRestoreId(version.id)}
                      disabled={restoreVersion.isPending}
                    >
                      <RotateCcw className="size-3" />
                      Restore
                    </Button>
                  )}
                </div>

                <div className="version-meta">
                  <span className="version-meta-item">
                    <User className="size-3" />
                    {authorName}
                  </span>
                  <span className="version-meta-item">
                    <Clock className="size-3" />
                    {formatDistanceToNow(new Date(version.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>

                {version.changeNote && (
                  <p className="version-note">{version.changeNote}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Dialog open={!!restoreId} onOpenChange={() => setRestoreId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restore this version?</DialogTitle>
            <DialogDescription>
              This will restore the page content to this version. A snapshot of
              the current version will be saved before restoring.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRestoreId(null)}>
              Cancel
            </Button>
            <Button onClick={handleRestore} disabled={restoreVersion.isPending}>
              {restoreVersion.isPending ? "Restoring..." : "Restore"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
