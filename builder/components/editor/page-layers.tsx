"use client";

import { ChevronRight, Eye, EyeOff } from "lucide-react";
import "./page-layers.css";

interface Layer {
  id: string;
  type: string;
  name: string;
  visible: boolean;
  children?: Layer[];
}

interface PageLayersProps {
  layers?: Layer[];
}

// Mock layers for now
const mockLayers: Layer[] = [
  {
    id: "section-1",
    type: "section",
    name: "Hero Section",
    visible: true,
    children: [
      { id: "heading-1", type: "heading", name: "Main Heading", visible: true },
      {
        id: "paragraph-1",
        type: "paragraph",
        name: "Description",
        visible: true,
      },
    ],
  },
];

export function PageLayers({ layers = mockLayers }: PageLayersProps) {
  return (
    <div className="page-layers">
      {layers.length === 0 ? (
        <div className="page-layers-empty">
          <p className="text-sm text-muted-foreground">
            No blocks yet. Drag blocks from the library to get started.
          </p>
        </div>
      ) : (
        <div className="page-layers-tree">
          {layers.map((layer) => (
            <LayerItem key={layer.id} layer={layer} level={0} />
          ))}
        </div>
      )}
    </div>
  );
}

function LayerItem({ layer, level }: { layer: Layer; level: number }) {
  const hasChildren = layer.children && layer.children.length > 0;

  return (
    <div className="layer-item" style={{ paddingLeft: `${level * 16}px` }}>
      <div className="layer-item-content">
        {hasChildren && (
          <button className="layer-item-toggle">
            <ChevronRight className="h-3 w-3" />
          </button>
        )}
        {!hasChildren && <span className="layer-item-spacer" />}

        <span className="layer-item-type">{layer.type}</span>
        <span className="layer-item-name">{layer.name}</span>

        <button className="layer-item-visibility">
          {layer.visible ? (
            <Eye className="h-3 w-3" />
          ) : (
            <EyeOff className="h-3 w-3" />
          )}
        </button>
      </div>

      {hasChildren && (
        <div className="layer-item-children">
          {layer.children!.map((child) => (
            <LayerItem key={child.id} layer={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
