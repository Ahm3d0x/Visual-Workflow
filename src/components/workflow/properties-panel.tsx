"use client";

import type { Node } from "@xyflow/react";
import { getNodeTemplate } from "@/lib/node-catalog";
import { type Locale, t } from "@/lib/i18n";

export function PropertiesPanel({
  locale,
  selectedNode,
  onChange
}: {
  locale: Locale;
  selectedNode: Node | null;
  onChange: (nodeId: string, key: string, value: unknown) => void;
}) {
  if (!selectedNode) {
    return (
      <div className="p-4">
        <h2 className="font-semibold">{t(locale, "editor.properties")}</h2>
        <p className="muted mt-2 text-sm">Select a node to edit its schema-driven properties.</p>
      </div>
    );
  }

  const nodeType = typeof selectedNode.data.nodeType === "string" ? selectedNode.data.nodeType : "process";
  const template = getNodeTemplate(nodeType);

  return (
    <div className="grid gap-4 p-4">
      <div>
        <h2 className="font-semibold">{t(locale, "editor.properties")}</h2>
        <p className="muted text-sm">{t(locale, template.titleKey)}</p>
      </div>
      {template.properties.map((field) => {
        const value = selectedNode.data[field.key] ?? "";
        return (
          <label className="grid gap-1" key={field.key}>
            <span className="text-sm">{t(locale, field.labelKey)}{field.required ? " *" : ""}</span>
            {field.type === "textarea" || field.type === "json" ? (
              <textarea
                className="input min-h-24"
                value={typeof value === "string" ? value : JSON.stringify(value, null, 2)}
                onChange={(event) => onChange(selectedNode.id, field.key, event.target.value)}
              />
            ) : field.type === "select" ? (
              <select className="input" value={String(value)} onChange={(event) => onChange(selectedNode.id, field.key, event.target.value)}>
                <option value="">Select</option>
                {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            ) : field.type === "boolean" ? (
              <input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(selectedNode.id, field.key, event.target.checked)} />
            ) : (
              <input
                className="input"
                type={field.type === "number" ? "number" : "text"}
                value={String(value)}
                onChange={(event) => onChange(selectedNode.id, field.key, field.type === "number" ? Number(event.target.value) : event.target.value)}
              />
            )}
          </label>
        );
      })}
      <button className="button primary" type="button">{t(locale, "common.save")}</button>
    </div>
  );
}
