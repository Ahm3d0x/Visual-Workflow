"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { getNodeTemplate } from "@/lib/node-catalog";

export function WorkflowNode({ data, selected }: NodeProps) {
  const [hovered, setHovered] = useState(false);
  const nodeType = typeof data.nodeType === "string" ? data.nodeType : "process";
  const template = getNodeTemplate(nodeType);
  const Icon = template.icon;
  const title = typeof data.title === "string" ? data.title : "Untitled";
  const description = typeof data.description === "string" ? data.description : "";

  return (
    <div
      className="workflow-node"
      style={{
        outline: selected ? `2px solid ${template.color}` : "none",
        outlineOffset: "1px"
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="workflow-node-header" style={{ background: template.color }} />
      <div className="workflow-node-body">
        <div className="mb-2 flex items-center gap-2">
          <span
            className="grid size-8 place-items-center rounded-md transition-transform"
            style={{
              background: `${template.color}18`,
              color: template.color,
              transform: hovered ? "scale(1.1)" : "scale(1)"
            }}
          >
            <Icon className="size-4" />
          </span>
          <strong className="text-sm flex-1 truncate">{title}</strong>
          {hovered && (
            <button
              className="grid size-6 place-items-center rounded-md transition-opacity opacity-60 hover:opacity-100"
              style={{ color: "var(--danger)" }}
              type="button"
              onClick={(e) => e.stopPropagation()}
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
        {description && (
          <p className="muted line-clamp-2 text-xs">{description}</p>
        )}
      </div>
      <Handle type="target" position={Position.Left} style={{ background: template.color }} />
      <Handle type="source" position={Position.Right} style={{ background: template.color }} />
    </div>
  );
}
