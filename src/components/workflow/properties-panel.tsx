"use client";

import type { Node } from "@xyflow/react";
import { Sliders } from "lucide-react";
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
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <Sliders size={24} className="muted-light mb-2" />
        <h2 className="font-semibold text-sm">{t(locale, "editor.properties")}</h2>
        <p className="muted mt-1 text-xs">{t(locale, "editor.selectNode")}</p>
      </div>
    );
  }

  const nodeType = typeof selectedNode.data.nodeType === "string" ? selectedNode.data.nodeType : "process";
  const template = getNodeTemplate(nodeType);
  const Icon = template.icon;

  return (
    <div className="grid gap-4 p-4">
      {/* Node Info Header */}
      <div className="flex items-center gap-3">
        <span
          className="grid size-9 place-items-center rounded-lg"
          style={{ background: `${template.color}18`, color: template.color }}
        >
          <Icon className="size-4" />
        </span>
        <div>
          <h2 className="font-semibold text-sm">{t(locale, template.titleKey)}</h2>
          <p className="muted text-xs">{t(locale, template.descriptionKey)}</p>
        </div>
      </div>

      <hr className="separator" />

      {/* Fields */}
      {template.properties.map((field) => {
        const value = selectedNode.data[field.key] ?? "";
        return (
          <label className="grid gap-1.5" key={field.key}>
            <span className="text-xs font-medium">
              {t(locale, field.labelKey)}
              {field.required && <span style={{ color: "var(--danger)" }}> *</span>}
            </span>
            {field.type === "textarea" || field.type === "json" ? (
              <textarea
                className="input min-h-20"
                style={{ fontSize: "0.8125rem" }}
                value={typeof value === "string" ? value : JSON.stringify(value, null, 2)}
                onChange={(event) => onChange(selectedNode.id, field.key, event.target.value)}
              />
            ) : field.type === "select" ? (
              <select
                className="input"
                style={{ fontSize: "0.8125rem" }}
                value={String(value)}
                onChange={(event) => onChange(selectedNode.id, field.key, event.target.value)}
              >
                <option value="">{t(locale, "common.select")}</option>
                {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            ) : field.type === "boolean" ? (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Boolean(value)}
                  onChange={(event) => onChange(selectedNode.id, field.key, event.target.checked)}
                  className="size-4 accent-[var(--accent)]"
                />
                <span className="text-sm muted">{t(locale, field.labelKey)}</span>
              </div>
            ) : (
              <input
                className="input"
                style={{ fontSize: "0.8125rem" }}
                type={field.type === "number" ? "number" : "text"}
                value={String(value)}
                onChange={(event) => onChange(selectedNode.id, field.key, field.type === "number" ? Number(event.target.value) : event.target.value)}
              />
            )}
          </label>
        );
      })}

      <button className="button primary sm" type="button">{t(locale, "common.save")}</button>
    </div>
  );
}
