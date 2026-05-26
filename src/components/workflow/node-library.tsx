"use client";

import { Plus, Search, Star, WandSparkles } from "lucide-react";
import { useState, type ReactNode } from "react";
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
  const [search, setSearch] = useState("");
  const favoriteNodes = nodeCatalog.filter((node) => favorites.includes(node.type));

  const filteredCatalog = search.trim()
    ? nodeCatalog.filter((node) =>
        t(locale, node.titleKey).toLowerCase().includes(search.toLowerCase()) ||
        t(locale, node.descriptionKey).toLowerCase().includes(search.toLowerCase())
      )
    : null;

  return (
    <div className="grid gap-3 p-3">
      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute top-1/2 -translate-y-1/2 muted-light" style={{ insetInlineStart: "0.65rem" }} />
        <input
          className="input sm"
          style={{ paddingInlineStart: "2rem", minHeight: "2rem", fontSize: "0.8125rem" }}
          placeholder={t(locale, "common.search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredCatalog ? (
        <LibrarySection title={t(locale, "common.search")}>
          {filteredCatalog.map((node) => (
            <NodeButton key={node.type} node={node} locale={locale} onAddNode={onAddNode} />
          ))}
          {filteredCatalog.length === 0 && (
            <p className="muted text-xs text-center py-3">{t(locale, "common.noResults")}</p>
          )}
        </LibrarySection>
      ) : (
        <>
          <LibrarySection title={t(locale, "editor.favorites")} icon={<Star size={14} style={{ color: "var(--warning)" }} />}>
            {favoriteNodes.map((node) => <NodeButton key={node.type} node={node} locale={locale} onAddNode={onAddNode} />)}
          </LibrarySection>

          <LibrarySection title={t(locale, "editor.custom")} icon={<WandSparkles size={14} style={{ color: "var(--accent)" }} />}>
            {customTemplates.map((node) => <NodeButton key={node.type} node={node} locale={locale} onAddNode={onAddNode} />)}
            <button className="button sm ghost w-full" type="button">
              <Plus size={12} />
              {t(locale, "editor.createCustom")}
            </button>
          </LibrarySection>

          {categories.map((category) => (
            <LibrarySection key={category} title={t(locale, `categories.${category}`)}>
              {nodeCatalog.filter((node) => node.category === category).map((node) => (
                <NodeButton key={node.type} node={node} locale={locale} onAddNode={onAddNode} />
              ))}
            </LibrarySection>
          ))}
        </>
      )}
    </div>
  );
}

function LibrarySection({ title, icon, children }: { title: string; icon?: ReactNode; children: ReactNode }) {
  return (
    <section>
      <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide muted">
        {icon}
        <span>{title}</span>
      </div>
      <div className="grid gap-1">{children}</div>
    </section>
  );
}

function NodeButton({ node, locale, onAddNode }: { node: NodeTemplate; locale: Locale; onAddNode: (type: string) => void }) {
  const Icon = node.icon;
  return (
    <button className="button ghost justify-start text-start sm" type="button" onClick={() => onAddNode(node.type)}>
      <span
        className="grid size-7 shrink-0 place-items-center rounded-md"
        style={{ background: `${node.color}15`, color: node.color }}
      >
        <Icon className="size-3.5" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-xs font-medium">{t(locale, node.titleKey)}</span>
        <span className="muted block truncate text-[10px]">{t(locale, node.descriptionKey)}</span>
      </span>
    </button>
  );
}
