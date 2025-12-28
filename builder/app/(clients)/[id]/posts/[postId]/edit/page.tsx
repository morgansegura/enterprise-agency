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
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SortableBlockItem } from "@/components/blocks/sortable-block-item";
import { SortableSection } from "@/components/editor/sortable-section";
import { ResponsivePreview } from "@/components/editor/responsive-preview";
import { type Breakpoint } from "@/components/editor/breakpoint-selector";
import { blockRegistry } from "@/lib/editor";
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
import {
  PanelsTopLeft,
  Newspaper,
  Store,
  LayoutPanelTop,
  Layers,
  Plus,
} from "lucide-react";
import { PostEditorLayout } from "@/components/editor/post-editor-layout";
import { useUIStore } from "@/lib/stores/ui-store";

/**
 * Create a default container with empty blocks
 */
function createDefaultContainer(): Container {
  return {
    _type: "container",
    _key: `container-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    layout: { type: "stack", gap: "md" },
    blocks: [],
  };
}

/**
 * Create a default section with one container
 */
function createDefaultSection(): Section {
  return {
    _type: "section",
    _key: `section-${Date.now()}`,
    containers: [createDefaultContainer()],
  };
}

/**
 * Get blocks from a specific container in a section
 */
function getContainerBlocks(section: Section, containerIndex: number): Block[] {
  return section.containers?.[containerIndex]?.blocks ?? [];
}

/**
 * Update blocks in a specific container
 */
function updateContainerBlocks(
  section: Section,
  containerIndex: number,
  blocks: Block[],
): Section {
  const containers = section.containers ?? [createDefaultContainer()];
  const newContainers = [...containers];
  if (newContainers[containerIndex]) {
    newContainers[containerIndex] = {
      ...newContainers[containerIndex],
      blocks,
    };
  }
  return { ...section, containers: newContainers };
}

export default function EditPostPage({
  params,
}: {
  params: Promise<{ id: string; postId: string }>;
}) {
  const resolvedParams = React.use(params);
  const { id, postId } = resolvedParams;
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

  // Initialize sections from post content or create default
  const [sections, setSections] = React.useState<Section[]>([]);

  // Breakpoint state for responsive preview
  const [breakpoint, setBreakpoint] = React.useState<Breakpoint>("desktop");

  // Selection state for blocks
  const [selectedBlockKey, setSelectedBlockKey] = React.useState<string | null>(null);

  // UI Store for block selection in sidebar
  const { selectBlock } = useUIStore();

  // Sync sections with post data
  React.useEffect(() => {
    if (post?.content?.sections) {
      setSections(post.content.sections as Section[]);
    } else {
      // Create default section if none exists
      setSections([createDefaultSection()]);
    }
  }, [post]);

  // Listen for block additions from BlocksLibrary
  React.useEffect(() => {
    const handleAddBlock = (event: Event) => {
      const customEvent = event as CustomEvent<{
        blockId: string;
        blockType: string;
      }>;
      const { blockType } = customEvent.detail;

      // Create new block based on type
      const newBlock = createDefaultBlock(blockType);

      // Add to first section's first container
      setSections((prevSections) => {
        const updatedSections = [...prevSections];
        if (updatedSections.length === 0) {
          const newSection = createDefaultSection();
          newSection.containers[0].blocks = [newBlock];
          updatedSections.push(newSection);
        } else {
          const blocks = getContainerBlocks(updatedSections[0], 0);
          updatedSections[0] = updateContainerBlocks(updatedSections[0], 0, [
            ...blocks,
            newBlock,
          ]);
        }
        return updatedSections;
      });

      toast.success("Block added!");
    };

    window.addEventListener("add-block", handleAddBlock);
    return () => window.removeEventListener("add-block", handleAddBlock);
  }, []);

  if (isLoading) return <div>Loading post...</div>;
  if (error) return <div>Error loading post: {error.message}</div>;
  if (!post) return <div>Post not found</div>;

  const handleSave = () => {
    updatePost.mutate({
      id: postId,
      data: {
        title: post.title,
        content: {
          sections,
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
              sections,
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

  const handleBlockChange = (
    sectionIndex: number,
    containerIndex: number,
    blockIndex: number,
    updatedBlock: Block,
  ) => {
    setSections((prevSections) => {
      const updatedSections = [...prevSections];
      const blocks = getContainerBlocks(
        updatedSections[sectionIndex],
        containerIndex,
      );
      const newBlocks = blocks.map((block: Block, idx: number) =>
        idx === blockIndex ? updatedBlock : block,
      );
      updatedSections[sectionIndex] = updateContainerBlocks(
        updatedSections[sectionIndex],
        containerIndex,
        newBlocks,
      );
      return updatedSections;
    });
  };

  const handleBlockDelete = (
    sectionIndex: number,
    containerIndex: number,
    blockIndex: number,
  ) => {
    setSections((prevSections) => {
      const updatedSections = [...prevSections];
      const blocks = getContainerBlocks(
        updatedSections[sectionIndex],
        containerIndex,
      );
      const newBlocks = blocks.filter(
        (_: Block, idx: number) => idx !== blockIndex,
      );
      updatedSections[sectionIndex] = updateContainerBlocks(
        updatedSections[sectionIndex],
        containerIndex,
        newBlocks,
      );
      return updatedSections;
    });
    toast.success("Block deleted");
  };

  const handleBlockDragEnd = (
    event: DragEndEvent,
    sectionIndex: number,
    containerIndex: number,
  ) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setSections((prevSections) => {
      const updatedSections = [...prevSections];
      const blocks = getContainerBlocks(
        updatedSections[sectionIndex],
        containerIndex,
      );

      const oldIndex = blocks.findIndex(
        (block: Block) => block._key === active.id,
      );
      const newIndex = blocks.findIndex(
        (block: Block) => block._key === over.id,
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        const newBlocks = arrayMove(blocks, oldIndex, newIndex);
        updatedSections[sectionIndex] = updateContainerBlocks(
          updatedSections[sectionIndex],
          containerIndex,
          newBlocks,
        );
      }

      return updatedSections;
    });
  };

  const handleAddBlockToContainer = (
    sectionIndex: number,
    containerIndex: number,
    blockType: string,
  ) => {
    const newBlock = createDefaultBlock(blockType);
    setSections((prevSections) => {
      const updated = [...prevSections];
      const blocks = getContainerBlocks(updated[sectionIndex], containerIndex);
      updated[sectionIndex] = updateContainerBlocks(
        updated[sectionIndex],
        containerIndex,
        [...blocks, newBlock],
      );
      return updated;
    });
    toast.success("Block added!");
  };

  const handleAddContainerToSection = (sectionIndex: number) => {
    const newContainer = createDefaultContainer();
    setSections((prevSections) => {
      const updated = [...prevSections];
      const containers = updated[sectionIndex].containers ?? [];
      updated[sectionIndex] = {
        ...updated[sectionIndex],
        containers: [...containers, newContainer],
      };
      return updated;
    });
    toast.success("Container added!");
  };

  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setSections((prevSections) => {
      const oldIndex = prevSections.findIndex(
        (section) => section._key === active.id,
      );
      const newIndex = prevSections.findIndex(
        (section) => section._key === over.id,
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        return arrayMove(prevSections, oldIndex, newIndex);
      }

      return prevSections;
    });
  };

  const handleSectionChange = (
    sectionIndex: number,
    updatedSection: Section,
  ) => {
    setSections((prevSections) => {
      const updatedSections = [...prevSections];
      updatedSections[sectionIndex] = updatedSection;
      return updatedSections;
    });
  };

  const handleSectionDelete = (sectionIndex: number) => {
    setSections((prevSections) =>
      prevSections.filter((_, idx) => idx !== sectionIndex),
    );
    toast.success("Section deleted");
  };

  const handleAddSection = () => {
    const newSection = createDefaultSection();
    setSections((prevSections) => [...prevSections, newSection]);
    toast.success("Section added");
  };

  function createDefaultBlock(blockType: string): Block {
    // Use block registry to create default block
    const defaultBlock = blockRegistry.createDefault(blockType);

    if (!defaultBlock) {
      // Fallback if block type not registered
      logger.warn(
        `Block type "${blockType}" not found in registry, using fallback`,
      );
      return {
        _key: `block-${Date.now()}`,
        _type: blockType,
        data: {},
      };
    }

    return defaultBlock;
  }

  return (
    <div className="flex">
      <aside className="relative bg-white -m-4 w-12 border-r flex flex-col top-0 bottom-0 items-center space-y-4 py-4 text-muted-foreground">
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
          onClick={() => toast.info("Shop editor coming soon")}
          title="Visit the Shop Editor"
        >
          <Store />
        </Button>
        <Separator />
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => toast.info("Block editor coming soon")}
          title="Open Block Editor"
        >
          <LayoutPanelTop />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => toast.info("Settings coming soon")}
          title="Open Editor Settings"
        >
          <Layers />
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
                  items={sections.map((section) => section._key)}
                  strategy={verticalListSortingStrategy}
                >
                  <div>
                    {sections.map((section, sectionIndex) => (
                      <SortableSection
                        key={section._key}
                        section={section}
                        sectionIndex={sectionIndex}
                        onSectionChange={(updatedSection) =>
                          handleSectionChange(sectionIndex, updatedSection)
                        }
                        onDelete={() => handleSectionDelete(sectionIndex)}
                        onAddContainer={() =>
                          handleAddContainerToSection(sectionIndex)
                        }
                        isFirst={sectionIndex === 0}
                        isLast={sectionIndex === sections.length - 1}
                        onAddBlockToContainer={(
                          containerIndex: number,
                          blockType: string,
                        ) =>
                          handleAddBlockToContainer(
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
                                          handleBlockChange(
                                            sectionIndex,
                                            containerIndex,
                                            blockIndex,
                                            updatedBlock,
                                          )
                                        }
                                        onDelete={() =>
                                          handleBlockDelete(
                                            sectionIndex,
                                            containerIndex,
                                            blockIndex,
                                          )
                                        }
                                        tenantId={id}
                                        isSelected={selectedBlockKey === block._key}
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
                                        isLast={blockIndex === blocks.length - 1}
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
                      onClick={handleAddSection}
                      className="w-full border-2 border-dashed hover:border-primary hover:bg-primary/5"
                    >
                      <Plus className="h-4 w-4 mr-2" />
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
                <pre className="mt-2 p-4 bg-muted rounded text-xs overflow-auto max-h-96">
                  {JSON.stringify({ sections }, null, 2)}
                </pre>
              </details>
            </CardContent>
          </Card>
        </ResponsivePreview>
      </PostEditorLayout>
    </div>
  );
}
