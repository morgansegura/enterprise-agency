"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  usePage,
  useUpdatePage,
  type Section,
  type Block,
} from "@/lib/hooks/use-pages";
import { PageEditorLayout } from "@/components/editor";
import { Card, CardContent } from "@/components/ui/card";
import {
  Blocks,
  Layers,
  LayoutPanelTop,
  MonitorCog,
  Newspaper,
  PanelsTopLeft,
  Rows2,
  Store,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SortableBlockItem } from "@/components/blocks/sortable-block-item";
import { blockRegistry } from "@/lib/editor";
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

export default function EditPagePage({
  params,
}: {
  params: Promise<{ id: string; pageId: string }>;
}) {
  const resolvedParams = React.use(params);
  const { id, pageId } = resolvedParams;
  const router = useRouter();
  const { data: page, isLoading, error } = usePage(id, pageId);
  const updatePage = useUpdatePage(id);

  // Drag-and-drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Initialize sections from page content or create default
  const [sections, setSections] = React.useState<Section[]>([]);

  // Sync sections with page data
  React.useEffect(() => {
    if (page?.content?.sections) {
      setSections(page.content.sections as Section[]);
    } else {
      // Create default section if none exists
      setSections([
        {
          _type: "section",
          _key: `section-${Date.now()}`,
          blocks: [],
        },
      ]);
    }
  }, [page]);

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

      // Add to first section (for now)
      setSections((prevSections) => {
        const updatedSections = [...prevSections];
        if (updatedSections.length === 0) {
          updatedSections.push({
            _type: "section",
            _key: `section-${Date.now()}`,
            blocks: [newBlock],
          });
        } else {
          updatedSections[0] = {
            ...updatedSections[0],
            blocks: [...updatedSections[0].blocks, newBlock],
          };
        }
        return updatedSections;
      });

      toast.success("Block added!");
    };

    window.addEventListener("add-block", handleAddBlock);
    return () => window.removeEventListener("add-block", handleAddBlock);
  }, []);

  if (isLoading) return <div>Loading page...</div>;
  if (error) return <div>Error loading page: {error.message}</div>;
  if (!page) return <div>Page not found</div>;

  const handleSave = () => {
    updatePage.mutate({
      id: pageId,
      data: {
        title: page.title,
        content: {
          sections,
        },
      },
    });
  };

  const handlePublish = () => {
    // TODO: Implement publish logic
    console.log("Publishing page...");
  };

  const handlePageChange = (field: string, value: string) => {
    // Update page data locally (you could debounce this to auto-save)
    console.log("Page field changed:", field, value);
  };

  const handleBlockChange = (
    sectionIndex: number,
    blockIndex: number,
    updatedBlock: Block,
  ) => {
    setSections((prevSections) => {
      const updatedSections = [...prevSections];
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        blocks: updatedSections[sectionIndex].blocks.map((block, idx) =>
          idx === blockIndex ? updatedBlock : block,
        ),
      };
      return updatedSections;
    });
  };

  const handleBlockDelete = (sectionIndex: number, blockIndex: number) => {
    setSections((prevSections) => {
      const updatedSections = [...prevSections];
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        blocks: updatedSections[sectionIndex].blocks.filter(
          (_, idx) => idx !== blockIndex,
        ),
      };
      return updatedSections;
    });
    toast.success("Block deleted");
  };

  const handleDragEnd = (event: DragEndEvent, sectionIndex: number) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setSections((prevSections) => {
      const updatedSections = [...prevSections];
      const section = updatedSections[sectionIndex];

      const oldIndex = section.blocks.findIndex(
        (block) => block._key === active.id,
      );
      const newIndex = section.blocks.findIndex(
        (block) => block._key === over.id,
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        updatedSections[sectionIndex] = {
          ...section,
          blocks: arrayMove(section.blocks, oldIndex, newIndex),
        };
      }

      return updatedSections;
    });
  };

  function createDefaultBlock(blockType: string): Block {
    // Use block registry to create default block
    const defaultBlock = blockRegistry.createDefault(blockType);

    if (!defaultBlock) {
      // Fallback if block type not registered
      console.warn(
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
      <aside className="relative bg-white -m-4 w-12 border-r flex flex-col top-0 bottom-0 items-center space-y-4 py-4 text-(--muted-foreground)">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => console.log("Test click")}
          title="Visit the Website Editor"
        >
          <PanelsTopLeft />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => console.log("Test click")}
          title="Visit the Blog Editor"
        >
          <Newspaper />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => console.log("Test click")}
          title="Visit the Shop Editor"
        >
          <Store />
        </Button>
        <Separator />
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => console.log("Test click")}
          title="Open Block Editor"
        >
          <LayoutPanelTop />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => console.log("Test click")}
          title="Open Editor Settings"
        >
          <Layers />
        </Button>
      </aside>
      <PageEditorLayout
        pageId={pageId}
        pageTitle={page.title}
        page={{
          title: page.title,
          slug: page.slug,
          status: page.status,
          template: page.template,
        }}
        onSave={handleSave}
        onPublish={handlePublish}
        onPageChange={handlePageChange}
        isSaving={updatePage.isPending}
      >
        {/* Canvas Content */}
        <Card className="page-editor-canvas-content bg-white h-full">
          <CardContent className="p-8">
            <div className="space-y-4">
              {sections.map((section, sectionIndex) => (
                <div key={section._key} className="space-y-4">
                  {section.blocks.length === 0 ? (
                    <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
                      <p className="text-muted-foreground">
                        Click a block from the left sidebar to get started.
                      </p>
                    </div>
                  ) : (
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={(event) => handleDragEnd(event, sectionIndex)}
                    >
                      <SortableContext
                        items={section.blocks.map((block) => block._key)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-4">
                          {section.blocks.map((block, blockIndex) => (
                            <SortableBlockItem
                              key={block._key}
                              block={block}
                              onChange={(updatedBlock) =>
                                handleBlockChange(
                                  sectionIndex,
                                  blockIndex,
                                  updatedBlock,
                                )
                              }
                              onDelete={() =>
                                handleBlockDelete(sectionIndex, blockIndex)
                              }
                              tenantId={id}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  )}
                </div>
              ))}

              {/* Debug: Show content data */}
              <details className="mt-8">
                <summary className="cursor-pointer text-sm font-medium">
                  Content Data (Debug)
                </summary>
                <pre className="mt-2 p-4 bg-muted rounded text-xs overflow-auto max-h-96">
                  {JSON.stringify({ sections }, null, 2)}
                </pre>
              </details>
            </div>
          </CardContent>
        </Card>
      </PageEditorLayout>
    </div>
  );
}
