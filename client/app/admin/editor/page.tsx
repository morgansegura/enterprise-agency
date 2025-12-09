"use client";

import { useState } from "react";
import { BlockEditor } from "@/components/editor";
import { logger } from "@/lib/logger";
import type { Block } from "@/lib/editor/types";

export default function EditorTestPage() {
  const [blocks, setBlocks] = useState<Block[]>([
    {
      _key: "initial_1",
      _type: "heading-block",
      data: {
        title: "Welcome to the Block Editor",
        level: "h1",
        size: "4xl",
        align: "center",
      },
    },
    {
      _key: "initial_2",
      _type: "text-block",
      data: {
        content:
          "Start editing by clicking here. You can format text, add headings, and more.",
        size: "lg",
        align: "left",
      },
    },
  ]);

  const handleChange = (newBlocks: Block[]) => {
    logger.log("Content changed", {
      context: "BlockEditor",
      meta: { blocks: newBlocks },
    });
    setBlocks(newBlocks);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Block Editor Demo
          </h1>
          <p className="text-gray-600">
            Try editing the content below. Changes are logged to the console.
          </p>
        </div>

        {/* Editor */}
        <div className="bg-white rounded-lg shadow-sm">
          <BlockEditor
            initialBlocks={blocks}
            onChange={handleChange}
            placeholder="Type / to add a block..."
          />
        </div>

        {/* Debug output */}
        <div className="mt-6 bg-gray-900 rounded-lg p-6 text-gray-100">
          <h2 className="text-lg font-semibold mb-3">Current Blocks (JSON)</h2>
          <pre className="text-sm overflow-x-auto">
            {JSON.stringify(blocks, null, 2)}
          </pre>
        </div>

        {/* Keyboard shortcuts */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-3">Keyboard Shortcuts</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong># + space</strong> - Heading 1
            </div>
            <div>
              <strong>## + space</strong> - Heading 2
            </div>
            <div>
              <strong>**text**</strong> - Bold
            </div>
            <div>
              <strong>*text*</strong> - Italic
            </div>
            <div>
              <strong>- + space</strong> - Bullet list
            </div>
            <div>
              <strong>1. + space</strong> - Numbered list
            </div>
            <div>
              <strong>&gt; + space</strong> - Blockquote
            </div>
            <div>
              <strong>```</strong> - Code block
            </div>
            <div>
              <strong>Ctrl+B</strong> - Bold
            </div>
            <div>
              <strong>Ctrl+I</strong> - Italic
            </div>
            <div>
              <strong>Ctrl+K</strong> - Add link
            </div>
            <div>
              <strong>Ctrl+Z</strong> - Undo
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
