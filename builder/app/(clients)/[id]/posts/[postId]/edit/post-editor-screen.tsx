"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  usePost,
  useUpdatePost,
  usePublishPost,
  useUnpublishPost,
  type Post,
} from "@/lib/hooks/use-posts";
import {
  type Section,
  type Block,
  type Container,
} from "@/lib/hooks/use-pages";
import {
  usePageEditor,
  createDefaultSection,
} from "@/lib/hooks/use-page-editor";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SortableBlockItem } from "@/components/blocks/sortable-block-item";
import { SortableSection } from "@/components/editor/sortable-section";
import { ResponsivePreview } from "@/components/editor/responsive-preview";
import { type Breakpoint } from "@/components/editor/breakpoint-selector";
import { logger } from "@/lib/logger";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { PanelsTopLeft, Newspaper, Store, PlusCircle } from "lucide-react";
import { PostEditorLayout } from "@/components/editor/post-editor-layout";
import { useUIStore } from "@/lib/stores/ui-store";

interface PostEditorScreenProps {
  tenantId: string;
  postId: string;
}

export function PostEditorScreen({ tenantId: id, postId }: PostEditorScreenProps) {
  const router = useRouter();
  const { data: post, isLoading, error } = usePost(id, postId);
  const updatePost = useUpdatePost(id);
  const publishPost = usePublishPost(id);
  const unpublishPost = useUnpublishPost(id);

  // Drag-and-drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Section/block operations (shared hook)
  const initialSections = React.useMemo(
    () =>
      (post?.content?.sections as Section[]) ?? [createDefaultSection()],
    [post],
  );
  const editor = usePageEditor(initialSections);

  // Breakpoint state for responsive preview
  const [breakpoint, setBreakpoint] = React.useState<Breakpoint>("desktop");

  // Selection state for blocks
  const [selectedBlockKey, setSelectedBlockKey] = React.useState<string | null>(
    null,
  );

  // UI Store for block selection in sidebar
  const { selectBlock } = useUIStore();

  // Listen for block additions from BlocksLibrary
  React.useEffect(() => {
    const handleAddBlock = (event: Event) => {
      const customEvent = event as CustomEvent<{
        blockId: string;
        blockType: string;
      }>;
      editor.handleAddBlockToContainer(0, 0, customEvent.detail.blockType);
    };
    window.addEventListener("add-block", handleAddBlock);
    return () => window.removeEventListener("add-block", handleAddBlock);
  }, [editor]);

  if (isLoading) {
    return (
      <div className="flex h-full">
        <div className="w-[220px] border-r border-(--border-default) p-3 space-y-3">
          <div className="h-4 w-16 bg-(--el-100) rounded animate-pulse" />
          <div className="h-8 w-full bg-(--el-100) rounded animate-pulse" />
          <div className="h-8 w-3/4 bg-(--el-100) rounded animate-pulse ml-4" />
        </div>
        <div className="flex-1 p-8 space-y-6">
          <div className="h-10 w-1/3 bg-(--el-100) rounded animate-pulse" />
          <div className="h-4 w-full bg-(--el-100) rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-(--el-100) rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-(--el-100) rounded animate-pulse" />
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="text-[14px] text-(--status-error)">Error loading post: {error.message}</span>
      </div>
    );
  }
  if (!post) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="text-[14px] text-(--el-500)">Post not found</span>
      </div>
    );
  }

  const handleSave = () => {
    updatePost.mutate({
      id: postId,
      data: {
        title: post.title,
        content: {
          sections: editor.sections,
        },
      },
    });
  };

  const handlePublish = async () => {
    const isCurrentlyPublished = post?.status === "published";

    if (isCurrentlyPublished) {
      // Unpublish
      if (
        confirm("Unpublish this post? It will no longer be visible publicly.")
      ) {
        unpublishPost.mutate(postId, {
          onSuccess: () => {
            toast.success("Post unpublished");
          },
          onError: () => {
            toast.error("Failed to unpublish post");
          },
        });
      }
    } else {
      // Save first, then publish
      const confirmed = confirm(
        "Publish this post? It will be visible to the public.",
      );
      if (!confirmed) return;

      try {
        // Save current changes
        await updatePost.mutateAsync({
          id: postId,
          data: {
            title: post?.title || "",
            content: {
              sections: editor.sections,
            },
          },
        });

        // Then publish
        publishPost.mutate(postId, {
          onSuccess: () => {
            toast.success("Post published successfully!");
          },
          onError: () => {
            toast.error("Failed to publish post");
          },
        });
      } catch {
        toast.error("Failed to save changes");
      }
    }
  };

  const handlePostChange = (field: keyof Post, value: unknown) => {
    // Update post data locally (you could debounce this to auto-save)
    logger.debug("Post field changed", { field, value });
  };

  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = editor.sections.findIndex(
      (section) => section._key === active.id,
    );
    const newIndex = editor.sections.findIndex(
      (section) => section._key === over.id,
    );
    if (oldIndex !== -1 && newIndex !== -1) {
      editor.setSections(arrayMove(editor.sections, oldIndex, newIndex));
    }
  };

  const handleBlockDragEnd = (
    event: DragEndEvent,
    sectionIndex: number,
    containerIndex: number,
  ) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const blocks = editor.sections[sectionIndex]?.containers?.[containerIndex]?.blocks ?? [];
    const oldIndex = blocks.findIndex((b: Block) => b._key === active.id);
    const newIndex = blocks.findIndex((b: Block) => b._key === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      const newBlocks = arrayMove(blocks, oldIndex, newIndex);
      const updated = [...editor.sections];
      const containers = [...(updated[sectionIndex].containers ?? [])];
      containers[containerIndex] = { ...containers[containerIndex], blocks: newBlocks };
      updated[sectionIndex] = { ...updated[sectionIndex], containers };
      editor.setSections(updated);
    }
  };

  return (
    <div className="flex">
      <aside className="relative bg-white -m-4 w-12 border-r flex flex-col top-0 bottom-0 items-center space-y-4 py-4 text-(--el-500)">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => router.push(`/${id}/pages`)}
          title="Visit the Website Editor"
        >
          <PanelsTopLeft />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => router.push(`/${id}/posts`)}
          title="Visit the Blog Editor"
        >
          <Newspaper />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => router.push(`/${id}/shop`)}
          title="Visit the Shop Editor"
        >
          <Store />
        </Button>
      </aside>
      <PostEditorLayout
        postId={postId}
        postTitle={post.title}
        post={{
          title: post.title,
          slug: post.slug,
          status: post.status,
          author: post.author,
          publishDate: post.publishDate,
          excerpt: post.excerpt,
          featuredImage: post.featuredImage,
          categories: post.categories,
          tags: post.tags,
        }}
        breakpoint={breakpoint}
        onBreakpointChange={setBreakpoint}
        onSave={handleSave}
        onPublish={handlePublish}
        onPostChange={handlePostChange}
        isSaving={updatePost.isPending}
      >
        {/* Canvas Content */}
        <ResponsivePreview breakpoint={breakpoint} className="h-full">
          <Card className="post-editor-canvas-content bg-white h-full">
            <CardContent className="p-8">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleSectionDragEnd}
              >
                <SortableContext
                  items={editor.sections.map((section) => section._key)}
                  strategy={verticalListSortingStrategy}
                >
                  <div>
                    {editor.sections.map((section, sectionIndex) => (
                      <SortableSection
                        key={section._key}
                        section={section}
                        sectionIndex={sectionIndex}
                        onSectionChange={(updatedSection) =>
                          editor.handleSectionChange(sectionIndex, updatedSection)
                        }
                        onDelete={() => editor.handleSectionDelete(sectionIndex)}
                        onAddContainer={() =>
                          editor.handleAddContainerToSection(sectionIndex)
                        }
                        isFirst={sectionIndex === 0}
                        isLast={sectionIndex === editor.sections.length - 1}
                        onAddBlockToContainer={(
                          containerIndex: number,
                          blockType: string,
                        ) =>
                          editor.handleAddBlockToContainer(
                            sectionIndex,
                            containerIndex,
                            blockType,
                          )
                        }
                        renderContainerBlocks={(
                          containerIndex: number,
                          container: Container,
                        ) => {
                          const blocks = container.blocks ?? [];
                          if (blocks.length === 0) {
                            return null;
                          }
                          return (
                            <DndContext
                              sensors={sensors}
                              collisionDetection={closestCenter}
                              onDragEnd={(event) =>
                                handleBlockDragEnd(
                                  event,
                                  sectionIndex,
                                  containerIndex,
                                )
                              }
                            >
                              <SortableContext
                                items={blocks.map((block: Block) => block._key)}
                                strategy={verticalListSortingStrategy}
                              >
                                <div className="space-y-4">
                                  {blocks.map(
                                    (block: Block, blockIndex: number) => (
                                      <SortableBlockItem
                                        key={block._key}
                                        block={block}
                                        onChange={(updatedBlock: Block) =>
                                          editor.handleBlockChange(
                                            sectionIndex,
                                            containerIndex,
                                            blockIndex,
                                            updatedBlock,
                                          )
                                        }
                                        onDelete={() =>
                                          editor.handleBlockDelete(
                                            sectionIndex,
                                            containerIndex,
                                            blockIndex,
                                          )
                                        }
                                        tenantId={id}
                                        isSelected={
                                          selectedBlockKey === block._key
                                        }
                                        onSelect={() => {
                                          setSelectedBlockKey(block._key);
                                          selectBlock(
                                            sectionIndex,
                                            containerIndex,
                                            blockIndex,
                                            block._key,
                                          );
                                        }}
                                        isFirst={blockIndex === 0}
                                        isLast={
                                          blockIndex === blocks.length - 1
                                        }
                                      />
                                    ),
                                  )}
                                </div>
                              </SortableContext>
                            </DndContext>
                          );
                        }}
                      />
                    ))}

                    {/* Add Section Button */}
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => editor.handleAddSectionAt(editor.sections.length)}
                      className="w-full border-2 border-dashed hover:border-primary hover:bg-(--accent-primary)/5"
                    >
                      <PlusCircle className="h-4 w-4 " />
                      Add Section
                    </Button>
                  </div>
                </SortableContext>
              </DndContext>

              {/* Debug: Show content data */}
              <details className="mt-8">
                <summary className="cursor-pointer text-sm font-medium">
                  Content Data (Debug)
                </summary>
                <pre className="mt-2 p-4 bg-(--el-100) rounded text-xs overflow-auto max-h-96">
                  {JSON.stringify({ sections: editor.sections }, null, 2)}
                </pre>
              </details>
            </CardContent>
          </Card>
        </ResponsivePreview>
      </PostEditorLayout>
    </div>
  );
}
