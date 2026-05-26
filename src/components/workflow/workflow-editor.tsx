"use client";

import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type Edge,
  type Node,
  type NodeChange,
  type EdgeChange
} from "@xyflow/react";
import {
  Bot, Check, ChevronLeft, ChevronRight, Cloud, Download, History,
  Layers, MessageSquare, PanelLeftClose, PanelRightClose, Share2,
  Smartphone, type LucideIcon
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { demoEdges, demoNodes } from "@/lib/demo-data";
import { type Locale, t } from "@/lib/i18n";
import { getNodeTemplate, nodeCatalog } from "@/lib/node-catalog";
import { AIAssistant } from "@/components/workflow/ai-assistant";
import { NodeLibrary } from "@/components/workflow/node-library";
import { PropertiesPanel } from "@/components/workflow/properties-panel";
import { WorkflowNode } from "@/components/workflow/workflow-node";

const nodeTypes = { workflowNode: WorkflowNode };

export function WorkflowEditor({
  locale,
  workflowId,
  initialNodes = demoNodes,
  initialEdges = demoEdges,
  readOnly = false
}: {
  locale: Locale;
  workflowId: string;
  initialNodes?: Node[];
  initialEdges?: Edge[];
  readOnly?: boolean;
}) {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(initialNodes[0]?.id ?? null);
  const [libraryOpen, setLibraryOpen] = useState(true);
  const [propertiesOpen, setPropertiesOpen] = useState(true);
  const [rightTab, setRightTab] = useState<"properties" | "comments" | "history" | "layers" | "ai">("properties");
  const [saved, setSaved] = useState(true);

  const selectedNode = useMemo(() => nodes.find((node) => node.id === selectedNodeId) ?? null, [nodes, selectedNodeId]);
  const favorites = ["start", "process", "decision", "api_request", "ai_generate"];
  const customTemplates = nodeCatalog.filter((node) => ["api_request", "approval"].includes(node.type)).map((node) => ({
    ...node,
    type: `custom_${node.type}`,
    titleKey: node.titleKey,
    descriptionKey: node.descriptionKey
  }));

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((current) => applyNodeChanges(changes, current));
    setSaved(false);
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((current) => applyEdgeChanges(changes, current));
    setSaved(false);
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((current) => addEdge({ ...connection, animated: true }, current));
    setSaved(false);
  }, []);

  function addNode(type: string) {
    const template = getNodeTemplate(type.replace(/^custom_/, ""));
    const id = `${type}-${Date.now()}`;
    setNodes((current) => [
      ...current,
      {
        id,
        type: "workflowNode",
        position: { x: 180 + current.length * 35, y: 180 + current.length * 25 },
        data: {
          nodeType: type.replace(/^custom_/, ""),
          title: t(locale, template.titleKey),
          description: t(locale, template.descriptionKey)
        }
      }
    ]);
    setSelectedNodeId(id);
    setSaved(false);
  }

  function updateNodeData(nodeId: string, key: string, value: unknown) {
    setNodes((current) => current.map((node) => node.id === nodeId ? { ...node, data: { ...node.data, [key]: value } } : node));
    setSaved(false);
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify({ workflowId, nodes, edges }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${workflowId}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const tabItems: Array<[typeof rightTab, LucideIcon, string]> = [
    ["properties", PanelRightClose, t(locale, "editor.properties")],
    ["comments", MessageSquare, t(locale, "editor.comments")],
    ["history", History, t(locale, "editor.history")],
    ["layers", Layers, t(locale, "editor.layers")],
    ["ai", Bot, t(locale, "editor.ai")]
  ];

  return (
    <div className="h-[calc(100vh-66px)] overflow-hidden">
      <div className="flex h-full">
        {/* Library Sidebar */}
        <aside
          className={`desktop-editor-only transition-all overflow-y-auto ${libraryOpen ? "w-80" : "w-12"}`}
          style={{ borderInlineEnd: "1px solid var(--border)", background: "var(--panel)" }}
        >
          <button className="button ghost m-2 w-[calc(100%-1rem)]" type="button" onClick={() => setLibraryOpen((open) => !open)}>
            {libraryOpen ? <PanelLeftClose size={16} /> : <ChevronRight size={16} />}
            {libraryOpen ? t(locale, "editor.library") : null}
          </button>
          {libraryOpen ? <NodeLibrary locale={locale} favorites={favorites} customTemplates={customTemplates} onAddNode={addNode} /> : null}
        </aside>

        {/* Canvas */}
        <section className="relative flex-1">
          {/* Top Bar */}
          <div className="absolute left-3 right-3 top-3 z-20 flex flex-wrap items-center justify-between gap-2">
            <div className="panel flex items-center gap-3 px-4 py-2">
              <strong className="text-sm truncate max-w-[200px]">{workflowId}</strong>
              <div className="flex items-center gap-1.5">
                {saved ? (
                  <span className="flex items-center gap-1 text-xs" style={{ color: "var(--success)" }}>
                    <Check size={12} />
                    {t(locale, "editor.autoSaved")}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs" style={{ color: "var(--warning)" }}>
                    <Cloud size={12} />
                    {t(locale, "editor.unsaved")}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button className="button sm" type="button">
                <Share2 size={14} />
                <span className="hidden sm:inline">{t(locale, "common.share")}</span>
              </button>
              <button className="button sm" type="button" onClick={exportJson}>
                <Download size={14} />
                <span className="hidden sm:inline">JSON</span>
              </button>
            </div>
          </div>

          {/* Mobile Notice */}
          <div className="md:hidden absolute inset-x-3 top-16 z-20 panel p-4 text-sm animate-slideDown">
            <div className="flex items-center gap-2 mb-1">
              <Smartphone size={16} style={{ color: "var(--accent)" }} />
              <strong className="text-sm">{t(locale, "editor.mobileLocked").split(".")[0]}.</strong>
            </div>
            <p className="muted text-xs">{t(locale, "editor.mobileLocked").split(".").slice(1).join(".")}</p>
          </div>

          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={readOnly ? undefined : onNodesChange}
            onEdgesChange={readOnly ? undefined : onEdgesChange}
            onConnect={readOnly ? undefined : onConnect}
            onNodeClick={(_, node) => setSelectedNodeId(node.id)}
            fitView
            snapToGrid
            snapGrid={[16, 16]}
            nodesDraggable={!readOnly}
            nodesConnectable={!readOnly}
            elementsSelectable
          >
            <Background gap={24} />
            <Controls />
            <MiniMap pannable zoomable />
          </ReactFlow>
        </section>

        {/* Properties Sidebar */}
        <aside
          className={`desktop-editor-only transition-all overflow-y-auto ${propertiesOpen ? "w-96" : "w-12"}`}
          style={{ borderInlineStart: "1px solid var(--border)", background: "var(--panel)" }}
        >
          <button className="button ghost m-2 w-[calc(100%-1rem)]" type="button" onClick={() => setPropertiesOpen((open) => !open)}>
            {propertiesOpen ? <PanelRightClose size={16} /> : <ChevronLeft size={16} />}
            {propertiesOpen ? t(locale, "editor.properties") : null}
          </button>
          {propertiesOpen ? (
            <>
              {/* Tab bar */}
              <div className="tabs mx-2 mb-2">
                {tabItems.map(([tab, Icon, label]) => (
                  <button
                    className={`tab ${rightTab === tab ? "active" : ""}`}
                    key={tab}
                    type="button"
                    onClick={() => setRightTab(tab)}
                    title={label}
                  >
                    <Icon size={14} />
                  </button>
                ))}
              </div>

              {rightTab === "properties" ? (
                <PropertiesPanel locale={locale} selectedNode={selectedNode} onChange={updateNodeData} />
              ) : null}

              {rightTab === "comments" ? (
                <div className="grid gap-3 p-4">
                  <h2 className="font-semibold">{t(locale, "editor.comments")}</h2>
                  <div className="flex flex-col items-center py-8 text-center">
                    <MessageSquare size={24} className="muted-light mb-2" />
                    <p className="muted text-sm">{t(locale, "editor.noComments")}</p>
                  </div>
                  <textarea
                    className="input min-h-16"
                    placeholder={t(locale, "editor.addComment")}
                  />
                  <button className="button primary sm" type="button">{t(locale, "common.save")}</button>
                </div>
              ) : null}

              {rightTab === "history" ? (
                <div className="grid gap-3 p-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold">{t(locale, "editor.history")}</h2>
                    <button className="button sm" type="button">{t(locale, "editor.createSnapshot")}</button>
                  </div>
                  <div className="flex flex-col items-center py-8 text-center">
                    <History size={24} className="muted-light mb-2" />
                    <p className="muted text-sm">{t(locale, "editor.noHistory")}</p>
                  </div>
                </div>
              ) : null}

              {rightTab === "layers" ? (
                <div className="grid gap-2 p-4">
                  <h2 className="font-semibold mb-1">{t(locale, "editor.layers")}</h2>
                  {nodes.map((node) => {
                    const nt = typeof node.data.nodeType === "string" ? node.data.nodeType : "process";
                    const template = getNodeTemplate(nt);
                    const Icon = template.icon;
                    return (
                      <button
                        key={node.id}
                        className={`button ghost sm justify-start ${selectedNodeId === node.id ? "primary" : ""}`}
                        type="button"
                        onClick={() => setSelectedNodeId(node.id)}
                      >
                        <span
                          className="grid size-6 place-items-center rounded"
                          style={{ background: `${template.color}18`, color: template.color }}
                        >
                          <Icon className="size-3" />
                        </span>
                        <span className="truncate text-xs">{String(node.data.title ?? node.id)}</span>
                      </button>
                    );
                  })}
                </div>
              ) : null}

              {rightTab === "ai" ? <AIAssistant locale={locale} /> : null}
            </>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
