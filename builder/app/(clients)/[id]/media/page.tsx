"use client";

import * as React from "react";
import {
  useAssets,
  useUploadAsset,
  useDeleteAsset,
  type Asset,
} from "@/lib/hooks/use-assets";
import { LayoutHeading } from "@/components/layout/layout-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, Search, X, Trash2, Copy, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MediaLibraryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  // State
  const [searchQuery, setSearchQuery] = React.useState("");
  const [fileTypeFilter, setFileTypeFilter] = React.useState<string>("");
  const [selectedAsset, setSelectedAsset] = React.useState<Asset | null>(null);
  const [uploading, setUploading] = React.useState(false);

  // Queries
  const {
    data: assets,
    isLoading,
    error,
  } = useAssets(id, {
    fileType: fileTypeFilter || undefined,
  });
  const uploadAsset = useUploadAsset(id);
  const deleteAsset = useDeleteAsset(id);

  // File input ref
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Handle delete
  const handleDelete = (asset: Asset) => {
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

  // Filter assets by search query
  const filteredAssets = React.useMemo(() => {
    if (!assets) return [];

    return assets.filter((asset) => {
      const matchesSearch =
        searchQuery === "" ||
        asset.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.altText?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [assets, searchQuery]);

  // Format file size
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "—";
    const kb = bytes / 1024;
    const mb = kb / 1024;

    if (mb >= 1) return `${mb.toFixed(2)} MB`;
    return `${kb.toFixed(2)} KB`;
  };

  if (isLoading) return <div>Loading media library...</div>;
  if (error) return <div>Error loading media: {error.message}</div>;

  return (
    <div className="space-y-6">
      <LayoutHeading
        title="Media Library"
        description={
          assets && assets.length > 0
            ? `${filteredAssets.length} of ${assets.length} assets`
            : "No assets yet"
        }
        actions={
          <Button
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        }
      />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,audio/*,.pdf"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by filename or alt text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={fileTypeFilter} onValueChange={setFileTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All file types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All file types</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
            <SelectItem value="audio">Audio</SelectItem>
            <SelectItem value="document">Documents</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Assets Grid */}
      {filteredAssets.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">
            {searchQuery || fileTypeFilter
              ? "No assets match your filters"
              : "No assets uploaded yet"}
          </p>
          {!searchQuery && !fileTypeFilter && (
            <Button onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Upload your first asset
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredAssets.map((asset) => (
            <Card
              key={asset.id}
              className={cn(
                "group relative cursor-pointer hover:border-primary transition-colors overflow-hidden",
                selectedAsset?.id === asset.id && "border-primary",
              )}
              onClick={() => setSelectedAsset(asset)}
            >
              {/* Preview */}
              <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                {asset.fileType === "image" ? (
                  <img
                    src={asset.thumbnailUrl || asset.url}
                    alt={asset.altText || asset.fileName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <span className="text-2xl mb-2">
                      {asset.fileType === "video"
                        ? "🎥"
                        : asset.fileType === "audio"
                          ? "🎵"
                          : "📄"}
                    </span>
                    <span className="text-xs text-muted-foreground uppercase">
                      {asset.fileType}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-2 border-t">
                <p className="text-xs font-medium truncate">{asset.fileName}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(asset.sizeBytes)}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}

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
                <div className="bg-muted rounded-lg overflow-hidden flex items-center justify-center min-h-[300px]">
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
                      <p className="text-sm text-muted-foreground">
                        {selectedAsset.fileName}
                      </p>
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">File Type</p>
                    <p className="font-medium">{selectedAsset.fileType}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">File Size</p>
                    <p className="font-medium">
                      {formatFileSize(selectedAsset.sizeBytes)}
                    </p>
                  </div>
                  {selectedAsset.width && selectedAsset.height && (
                    <div>
                      <p className="text-muted-foreground">Dimensions</p>
                      <p className="font-medium">
                        {selectedAsset.width} × {selectedAsset.height}
                      </p>
                    </div>
                  )}
                  {selectedAsset.altText && (
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Alt Text</p>
                      <p className="font-medium">{selectedAsset.altText}</p>
                    </div>
                  )}
                </div>

                {/* URL */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">URL</p>
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
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
