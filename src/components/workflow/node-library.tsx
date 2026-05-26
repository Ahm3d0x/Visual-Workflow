"use client";

import { Star, WandSparkles } from "lucide-react";
import type { ReactNode } from "react";
import { categories, nodeCatalog, type NodeTemplate } from "@/lib/node-catalog";
import { type Locale, t } from "@/lib/i18n";

export function NodeLibrary({
  locale,
  favorites,
  customTemplates,
  onAddNode
}: {
  locale: Locale;
  favorites: string[];
  customTemplates: NodeTemplate[];
  onAddNode: (type: string) => void;
}) {
  const favoriteNodes = nodeCatalog.filter((node) => favorites.includes(node.type));

  return (
    <div className="grid gap-4 p-3">
      <LibrarySection title={t(locale, "editor.favorites")} icon={<Star size={16} />}>
        {favoriteNodes.map((node) => <NodeButton key={node.type} node={node} locale={locale} onAddNode={onAddNode} />)}
      </LibrarySection>

      <LibrarySection title={t(locale, "editor.custom")} icon={<WandSparkles size={16} />}>
        {customTemplates.map((node) => <NodeButton key={node.type} node={node} locale={locale} onAddNode={onAddNode} />)}
        <button className="button w-full" type="button">Create custom element</button>
      </LibrarySection>

      {categories.map((category) => (
        <LibrarySection key={category} title={t(locale, `categories.${category}`)}>
          {nodeCatalog.filter((node) => node.category === category).map((node) => (
            <NodeButton key={node.type} node={node} locale={locale} onAddNode={onAddNode} />
          ))}
        </LibrarySection>
      ))}
    </div>
  );
}

function LibrarySection({ title, icon, children }: { title: string; icon?: ReactNode; children: ReactNode }) {
  return (
    <section>
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
        {icon}
        <span>{title}</span>
      </div>
      <div className="grid gap-2">{children}</div>
    </section>
  );
}

function NodeButton({ node, locale, onAddNode }: { node: NodeTemplate; locale: Locale; onAddNode: (type: string) => void }) {
  const Icon = node.icon;
  return (
    <button className="button justify-start text-start" type="button" onClick={() => onAddNode(node.type)}>
      <span className="grid size-8 shrink-0 place-items-center rounded-md" style={{ background: `${node.color}22`, color: node.color }}>
        <Icon className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium">{t(locale, node.titleKey)}</span>
        <span className="muted block truncate text-xs">{t(locale, node.descriptionKey)}</span>
      </span>
    </button>
  );
}
