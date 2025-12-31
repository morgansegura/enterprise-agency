"use client";

import * as React from "react";
import {
  useAssets,
  useUploadAsset,
  useDeleteAsset,
} from "@/lib/hooks/use-assets";
import { ContentList } from "@/components/layout/content-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Image, Trash2, Copy, ExternalLink } from "lucide-react";

// Asset type for ContentList
interface AssetItem {
  id: string;
  title: string;
  fileName: string;
  slug?: string;
  status?: string;
  updatedAt?: string;
  url: string;
  thumbnailUrl?: string;
  fileType: string;
  sizeBytes?: number;
  width?: number;
  height?: number;
  altText?: string;
}

export default function MediaLibraryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  // State
  const [selectedAsset, setSelectedAsset] = React.useState<AssetItem | null>(
    null,
  );
  const [uploading, setUploading] = React.useState(false);

  // Queries
  const { data: assets, isLoading, error } = useAssets(id);
  const uploadAsset = useUploadAsset(id);
  const deleteAsset = useDeleteAsset(id);

  // File input ref
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Transform assets to include title field
  const assetItems = React.useMemo(() => {
    if (!assets) return [];
    return assets.map((a) => ({ ...a, title: a.fileName }));
  }, [assets]);

  // Handle file upload
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        await uploadAsset.mutateAsync({ file });
      }
      toast.success(`Uploaded ${files.length} file(s)`);
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Handle delete
  const handleDelete = (asset: AssetItem) => {
    if (confirm(`Delete "${asset.fileName}"?`)) {
      deleteAsset.mutate(asset.id, {
        onSuccess: () => {
          toast.success("Asset deleted");
          setSelectedAsset(null);
        },
      });
    }
  };

  // Handle copy URL
  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
  };

  // Format file size
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "—";
    const kb = bytes / 1024;
    const mb = kb / 1024;

    if (mb >= 1) return `${mb.toFixed(2)} MB`;
    return `${kb.toFixed(2)} KB`;
  };

  // Custom create handler - open file picker
  const handleCreate = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,audio/*,.pdf"
        className="hidden"
        onChange={handleFileSelect}
      />

      <ContentList<AssetItem>
        title="Media Library"
        singularName="Asset"
        pluralName="assets"
        icon={Image}
        items={assetItems}
        isLoading={isLoading || uploading}
        error={error}
        onCreate={handleCreate}
        onEdit={(asset) => setSelectedAsset(asset)}
        onDelete={handleDelete}
        showStatus={false}
        filterOptions={[
          { value: "image", label: "Images" },
          { value: "video", label: "Videos" },
          { value: "audio", label: "Audio" },
          { value: "document", label: "Documents" },
        ]}
        searchFields={["title", "fileName"]}
        renderThumbnail={(asset) =>
          asset.fileType === "image" ? (
            <img
              src={asset.thumbnailUrl || asset.url}
              alt={asset.altText || asset.fileName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <span className="text-2xl mb-2">
                {asset.fileType === "video"
                  ? "🎥"
                  : asset.fileType === "audio"
                    ? "🎵"
                    : "📄"}
              </span>
              <span className="text-xs text-(--muted-foreground) uppercase">
                {asset.fileType}
              </span>
            </div>
          )
        }
        renderMeta={(asset) => (
          <p className="text-xs text-(--muted-foreground) mt-1">
            {formatFileSize(asset.sizeBytes)}
          </p>
        )}
        renderListMeta={(asset) => (
          <span className="text-sm text-(--muted-foreground)">
            {formatFileSize(asset.sizeBytes)}
          </span>
        )}
      />

      {/* Asset Detail Dialog */}
      <Dialog
        open={!!selectedAsset}
        onOpenChange={(open) => !open && setSelectedAsset(null)}
      >
        <DialogContent className="max-w-2xl">
          {selectedAsset && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedAsset.fileName}</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Preview */}
                <div className="bg-(--muted) rounded-lg overflow-hidden flex items-center justify-center min-h-[300px]">
                  {selectedAsset.fileType === "image" ? (
                    <img
                      src={selectedAsset.url}
                      alt={selectedAsset.altText || selectedAsset.fileName}
                      className="max-w-full max-h-[400px] object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                      <span className="text-6xl mb-4">
                        {selectedAsset.fileType === "video"
                          ? "🎥"
                          : selectedAsset.fileType === "audio"
                            ? "🎵"
                            : "📄"}
                      </span>
                      <p className="text-sm text-(--muted-foreground)">
                        {selectedAsset.fileName}
                      </p>
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-(--muted-foreground)">File Type</p>
                    <p className="font-medium">{selectedAsset.fileType}</p>
                  </div>
                  <div>
                    <p className="text-(--muted-foreground)">File Size</p>
                    <p className="font-medium">
                      {formatFileSize(selectedAsset.sizeBytes)}
                    </p>
                  </div>
                  {selectedAsset.width && selectedAsset.height && (
                    <div>
                      <p className="text-(--muted-foreground)">Dimensions</p>
                      <p className="font-medium">
                        {selectedAsset.width} × {selectedAsset.height}
                      </p>
                    </div>
                  )}
                  {selectedAsset.altText && (
                    <div className="col-span-2">
                      <p className="text-(--muted-foreground)">Alt Text</p>
                      <p className="font-medium">{selectedAsset.altText}</p>
                    </div>
                  )}
                </div>

                {/* URL */}
                <div>
                  <p className="text-sm text-(--muted-foreground) mb-2">URL</p>
                  <div className="flex gap-2">
                    <Input
                      value={selectedAsset.url}
                      readOnly
                      className="flex-1 font-mono text-xs"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleCopyUrl(selectedAsset.url)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => window.open(selectedAsset.url, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setSelectedAsset(null)}
                >
                  Close
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(selectedAsset)}
                >
                  <Trash2 className="h-4 w-4 " />
                  Delete
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
