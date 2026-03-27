"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useTemplates,
  useCloneTemplate,
} from "@/lib/hooks/use-tenants";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Copy,
  FileText,
  PanelTop,
  PanelBottom,
  Menu,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export default function TemplatesPage() {
  const router = useRouter();
  const { data: templates, isLoading } = useTemplates();
  const cloneTemplate = useCloneTemplate();

  const [cloneDialogOpen, setCloneDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(
    null,
  );
  const [cloneForm, setCloneForm] = useState({
    businessName: "",
    slug: "",
    contactEmail: "",
  });

  const handleCloneClick = (templateId: string) => {
    setSelectedTemplate(templateId);
    setCloneForm({ businessName: "", slug: "", contactEmail: "" });
    setCloneDialogOpen(true);
  };

  const handleClone = async () => {
    if (!selectedTemplate || !cloneForm.businessName || !cloneForm.slug) return;

    try {
      const newTenant = await cloneTemplate.mutateAsync({
        templateId: selectedTemplate,
        businessName: cloneForm.businessName,
        slug: cloneForm.slug,
        contactEmail: cloneForm.contactEmail || undefined,
      });
      toast.success("Site created from template");
      setCloneDialogOpen(false);
      router.push(`/${newTenant.id}/pages`);
    } catch {
      toast.error("Failed to create site from template");
    }
  };

  const autoSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  return (
    <PageLayout
      title="Templates"
      description="Starter sites you can clone for new clients"
    >
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-lg" />
          ))}
        </div>
      ) : !templates || templates.length === 0 ? (
        <div className="text-center py-20 text-[var(--el-500)]">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-base font-medium mb-1">No templates yet</h3>
          <p className="text-sm">
            Mark a client site as a template to make it cloneable.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="border border-border rounded-lg p-5 flex flex-col gap-3 hover:border-primary/50 transition-colors"
            >
              <div>
                <h3 className="text-sm font-semibold">
                  {template.templateName || template.businessName}
                </h3>
                {template.templateDescription && (
                  <p className="text-xs text-[var(--el-500)] mt-1">
                    {template.templateDescription}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-[var(--el-500)]">
                {template._count?.pages !== undefined && (
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {template._count.pages} pages
                  </span>
                )}
                {template._count?.headers !== undefined && (
                  <span className="flex items-center gap-1">
                    <PanelTop className="h-3 w-3" />
                    {template._count.headers} headers
                  </span>
                )}
                {template._count?.footers !== undefined && (
                  <span className="flex items-center gap-1">
                    <PanelBottom className="h-3 w-3" />
                    {template._count.footers} footers
                  </span>
                )}
                {template._count?.menus !== undefined && (
                  <span className="flex items-center gap-1">
                    <Menu className="h-3 w-3" />
                    {template._count.menus} menus
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-auto pt-2">
                <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-[var(--el-100)] text-[var(--el-500)]">
                  {template.tier}
                </span>
                {template.businessType && (
                  <span className="text-[11px] text-[var(--el-500)]">
                    {template.businessType}
                  </span>
                )}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCloneClick(template.id)}
              >
                <Copy className="h-3.5 w-3.5" />
                Use Template
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Clone Dialog */}
      <Dialog open={cloneDialogOpen} onOpenChange={setCloneDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Site from Template</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div>
              <Label>Business Name</Label>
              <Input
                value={cloneForm.businessName}
                onChange={(e) => {
                  const name = e.target.value;
                  setCloneForm((prev) => ({
                    ...prev,
                    businessName: name,
                    slug: prev.slug === autoSlug(prev.businessName)
                      ? autoSlug(name)
                      : prev.slug,
                  }));
                }}
                placeholder="Acme Corp"
              />
            </div>
            <div>
              <Label>Slug</Label>
              <Input
                value={cloneForm.slug}
                onChange={(e) =>
                  setCloneForm((prev) => ({
                    ...prev,
                    slug: e.target.value,
                  }))
                }
                placeholder="acme-corp"
              />
            </div>
            <div>
              <Label>Contact Email (optional)</Label>
              <Input
                type="email"
                value={cloneForm.contactEmail}
                onChange={(e) =>
                  setCloneForm((prev) => ({
                    ...prev,
                    contactEmail: e.target.value,
                  }))
                }
                placeholder="admin@acme.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCloneDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleClone}
              disabled={
                !cloneForm.businessName ||
                !cloneForm.slug ||
                cloneTemplate.isPending
              }
            >
              {cloneTemplate.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Create Site
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
