"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  HardDrive,
  Image as ImageIcon,
  FileText,
  FileVideo,
  FileAudio,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAssetUsage,
  useLargestAssets,
  useOrphanAssets,
  useBulkDeleteAssets,
  type LargestAsset,
} from "@/lib/hooks/use-assets";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatBytes, quotaPercent, formatRelativeTime } from "../utils";
import "./storage-dashboard.css";

interface StorageDashboardProps {
  tenantId: string;
}

export function StorageDashboard({ tenantId }: StorageDashboardProps) {
  const usage = useAssetUsage(tenantId);
  const largest = useLargestAssets(tenantId, 20);
  const orphans = useOrphanAssets(tenantId, 100);
  const bulkDelete = useBulkDeleteAssets(tenantId);

  const [confirmCleanup, setConfirmCleanup] = React.useState(false);

  const orphanBytes = React.useMemo(() => {
    if (!orphans.data) return 0;
    return orphans.data.reduce((sum, o) => sum + (o.sizeBytes ?? 0), 0);
  }, [orphans.data]);

  const handleCleanup = () => {
    if (!orphans.data || orphans.data.length === 0) return;
    bulkDelete
      .mutateAsync(orphans.data.map((o) => o.id))
      .then((res) => {
        toast.success(
          `Reclaimed ${formatBytes(orphanBytes)} (${res.successIds.length} files)`,
        );
        setConfirmCleanup(false);
      })
      .catch((err: Error) => toast.error(err.message));
  };

  return (
    <div data-slot="storage-dashboard">
      <header data-slot="storage-dashboard-header">
        <h1>Storage</h1>
        <p>Monitor usage, find large files, and clean up orphans.</p>
      </header>

      <section data-slot="storage-dashboard-stats">
        <article data-slot="storage-stat" data-tone="primary">
          <div data-slot="storage-stat-icon">
            <HardDrive aria-hidden="true" />
          </div>
          <div data-slot="storage-stat-body">
            <span data-slot="storage-stat-label">Total storage</span>
            {usage.isLoading ? (
              <Skeleton data-slot="storage-stat-skeleton" />
            ) : usage.data ? (
              <>
                <span data-slot="storage-stat-value">
                  {formatBytes(usage.data.usedBytes)}
                  {!usage.data.unlimited ? (
                    <small> / {formatBytes(usage.data.quotaBytes)}</small>
                  ) : null}
                </span>
                {!usage.data.unlimited ? (
                  <div data-slot="storage-stat-bar">
                    <span
                      data-slot="storage-stat-fill"
                      style={{
                        width: `${quotaPercent(usage.data.usedBytes, usage.data.quotaBytes)}%`,
                      }}
                    />
                  </div>
                ) : (
                  <span data-slot="storage-stat-note">Unlimited plan</span>
                )}
              </>
            ) : null}
          </div>
        </article>

        <article data-slot="storage-stat">
          <div data-slot="storage-stat-icon"><ImageIcon aria-hidden="true" /></div>
          <div data-slot="storage-stat-body">
            <span data-slot="storage-stat-label">Images</span>
            <span data-slot="storage-stat-value">
              {usage.data?.counts.images.toLocaleString() ?? "—"}
            </span>
          </div>
        </article>

        <article data-slot="storage-stat">
          <div data-slot="storage-stat-icon"><FileVideo aria-hidden="true" /></div>
          <div data-slot="storage-stat-body">
            <span data-slot="storage-stat-label">Videos</span>
            <span data-slot="storage-stat-value">
              {usage.data?.counts.videos.toLocaleString() ?? "—"}
            </span>
          </div>
        </article>

        <article data-slot="storage-stat">
          <div data-slot="storage-stat-icon"><FileAudio aria-hidden="true" /></div>
          <div data-slot="storage-stat-body">
            <span data-slot="storage-stat-label">Audio</span>
            <span data-slot="storage-stat-value">
              {usage.data?.counts.audio.toLocaleString() ?? "—"}
            </span>
          </div>
        </article>

        <article data-slot="storage-stat">
          <div data-slot="storage-stat-icon"><FileText aria-hidden="true" /></div>
          <div data-slot="storage-stat-body">
            <span data-slot="storage-stat-label">Documents</span>
            <span data-slot="storage-stat-value">
              {usage.data?.counts.documents.toLocaleString() ?? "—"}
            </span>
          </div>
        </article>
      </section>

      <section data-slot="storage-dashboard-panel">
        <header>
          <div>
            <h2>Orphan assets</h2>
            <p>Files not referenced by any page. Reclaim space by deleting.</p>
          </div>
          {orphans.data && orphans.data.length > 0 ? (
            <Button
              size="sm"
              variant="outline"
              data-variant="destructive"
              onClick={() => setConfirmCleanup(true)}
            >
              <Trash2 aria-hidden="true" />
              Delete all ({formatBytes(orphanBytes)})
            </Button>
          ) : null}
        </header>
        {orphans.isLoading ? (
          <StorageSkeletonRows />
        ) : !orphans.data || orphans.data.length === 0 ? (
          <div data-slot="storage-empty">
            <AlertTriangle aria-hidden="true" />
            No orphans found — every file is in use.
          </div>
        ) : (
          <AssetTable assets={orphans.data} />
        )}
      </section>

      <section data-slot="storage-dashboard-panel">
        <header>
          <div>
            <h2>Largest files</h2>
            <p>Top 20 by size — compress or replace to reclaim space.</p>
          </div>
        </header>
        {largest.isLoading ? (
          <StorageSkeletonRows />
        ) : !largest.data || largest.data.length === 0 ? (
          <div data-slot="storage-empty">No assets yet.</div>
        ) : (
          <AssetTable assets={largest.data} />
        )}
      </section>

      <ConfirmDialog
        open={confirmCleanup}
        onOpenChange={setConfirmCleanup}
        title={`Delete ${orphans.data?.length ?? 0} orphan files?`}
        description={`${formatBytes(orphanBytes)} will be permanently reclaimed.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleCleanup}
      />
    </div>
  );
}

function AssetTable({ assets }: { assets: LargestAsset[] }) {
  return (
    <div data-slot="storage-table" role="table">
      <div data-slot="storage-table-head" role="row">
        <div>File</div>
        <div>Type</div>
        <div>Size</div>
        <div>Uploaded</div>
      </div>
      {assets.map((asset) => (
        <div data-slot="storage-table-row" role="row" key={asset.id}>
          <div data-slot="storage-table-file">
            <span data-slot="storage-table-thumb">
              {asset.thumbnailUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={asset.thumbnailUrl} alt="" />
              ) : null}
            </span>
            <span data-slot="storage-table-name" title={asset.fileName}>
              {asset.fileName}
            </span>
          </div>
          <div>{asset.fileType}</div>
          <div data-slot="storage-table-size">{formatBytes(asset.sizeBytes)}</div>
          <div>{formatRelativeTime(asset.createdAt)}</div>
        </div>
      ))}
    </div>
  );
}

function StorageSkeletonRows() {
  return (
    <div data-slot="storage-skeleton-rows">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} data-slot="storage-skeleton-row" />
      ))}
    </div>
  );
}
