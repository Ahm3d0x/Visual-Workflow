"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { getNodeTemplate } from "@/lib/node-catalog";

export function WorkflowNode({ data, selected }: NodeProps) {
  const nodeType = typeof data.nodeType === "string" ? data.nodeType : "process";
  const template = getNodeTemplate(nodeType);
  const Icon = template.icon;
  const title = typeof data.title === "string" ? data.title : "Untitled";
  const description = typeof data.description === "string" ? data.description : "";

  return (
    <div className="workflow-node" style={{ outline: selected ? `2px solid ${template.color}` : "none" }}>
      <div className="workflow-node-header" style={{ background: template.color }} />
      <div className="workflow-node-body">
        <div className="mb-2 flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-md" style={{ background: `${template.color}22`, color: template.color }}>
            <Icon className="size-4" />
          </span>
          <strong className="text-sm">{title}</strong>
        </div>
        <p className="muted line-clamp-2 text-xs">{description}</p>
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
