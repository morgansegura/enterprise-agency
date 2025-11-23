"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { usePages, useDeletePage } from "@/lib/hooks/use-pages";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LayoutHeading } from "@/components/layout/layout-heading";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

export default function PagesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  const { data: pages, isLoading, error } = usePages(id);
  const deletePage = useDeletePage(id);

  const handleEdit = (pageId: string) => {
    router.push(`/${id}/pages/${pageId}/edit`);
  };

  const handleDelete = (page: { id: string; title: string }) => {
    if (confirm(`Delete ${page.title}?`)) {
      deletePage.mutate(page.id);
    }
  };

  if (isLoading) return <div>Loading pages...</div>;
  if (error) return <div>Error loading pages: {error.message}</div>;
  if (!pages || pages.length === 0) return <div>No pages found</div>;

  return (
    <div>
      <div>
        <LayoutHeading
          title="Pages"
          description={`${pages.length} total pages`}
          actions={
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push(`/${id}/pages/new`)}
            >
              New Page
            </Button>
          }
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Template</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pages.map((page) => (
            <TableRow key={page.id}>
              <TableCell>{page.title}</TableCell>
              <TableCell>{page.slug}</TableCell>
              <TableCell>{page.status || "draft"}</TableCell>
              <TableCell>{page.template || "default"}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(page.id)}>
                      <Pencil />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(page)}>
                      <Trash2 />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
