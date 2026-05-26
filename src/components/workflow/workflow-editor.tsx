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
import { Bot, ChevronLeft, ChevronRight, Download, History, Layers, MessageSquare, PanelLeftClose, PanelRightClose, Share2, type LucideIcon } from "lucide-react";
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

  const selectedNode = useMemo(() => nodes.find((node) => node.id === selectedNodeId) ?? null, [nodes, selectedNodeId]);
  const favorites = ["start", "process", "decision", "api_request", "ai_generate"];
  const customTemplates = nodeCatalog.filter((node) => ["api_request", "approval"].includes(node.type)).map((node) => ({
    ...node,
    type: `custom_${node.type}`,
    titleKey: node.titleKey,
    descriptionKey: node.descriptionKey
  }));

  const onNodesChange = useCallback((changes: NodeChange[]) => setNodes((current) => applyNodeChanges(changes, current)), []);
  const onEdgesChange = useCallback((changes: EdgeChange[]) => setEdges((current) => applyEdgeChanges(changes, current)), []);
  const onConnect = useCallback((connection: Connection) => setEdges((current) => addEdge({ ...connection, animated: true }, current)), []);

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
  }

  function updateNodeData(nodeId: string, key: string, value: unknown) {
    setNodes((current) => current.map((node) => node.id === nodeId ? { ...node, data: { ...node.data, [key]: value } } : node));
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

  return (
    <div className="h-[calc(100vh-66px)] overflow-hidden">
      <div className="flex h-full">
        <aside className={`desktop-editor-only border-e transition-all ${libraryOpen ? "w-80" : "w-12"}`} style={{ borderColor: "var(--border)", background: "var(--panel)" }}>
          <button className="button m-2 w-[calc(100%-1rem)]" type="button" onClick={() => setLibraryOpen((open) => !open)}>
            {libraryOpen ? <PanelLeftClose size={16} /> : <ChevronRight size={16} />}
            {libraryOpen ? t(locale, "editor.library") : null}
          </button>
          {libraryOpen ? <NodeLibrary locale={locale} favorites={favorites} customTemplates={customTemplates} onAddNode={addNode} /> : null}
        </aside>

        <section className="relative flex-1">
          <div className="absolute left-3 right-3 top-3 z-20 flex flex-wrap items-center justify-between gap-2">
            <div className="panel flex items-center gap-2 px-3 py-2">
              <strong>{workflowId}</strong>
              <span className="muted text-sm">Realtime collaboration ready</span>
            </div>
            <div className="flex gap-2">
              <button className="button" type="button"><Share2 size={16} />{t(locale, "common.share")}</button>
              <button className="button" type="button" onClick={exportJson}><Download size={16} />JSON</button>
            </div>
          </div>

          <div className="md:hidden absolute inset-x-3 top-20 z-20 panel p-3 text-sm">
            {t(locale, "editor.mobileLocked")}
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

        <aside className={`desktop-editor-only border-s transition-all ${propertiesOpen ? "w-96" : "w-12"}`} style={{ borderColor: "var(--border)", background: "var(--panel)" }}>
          <button className="button m-2 w-[calc(100%-1rem)]" type="button" onClick={() => setPropertiesOpen((open) => !open)}>
            {propertiesOpen ? <PanelRightClose size={16} /> : <ChevronLeft size={16} />}
            {propertiesOpen ? t(locale, "editor.properties") : null}
          </button>
          {propertiesOpen ? (
            <>
              <div className="flex gap-1 border-b px-2 pb-2" style={{ borderColor: "var(--border)" }}>
                {([
                  ["properties", PanelRightClose],
                  ["comments", MessageSquare],
                  ["history", History],
                  ["layers", Layers],
                  ["ai", Bot]
                ] as Array<[typeof rightTab, LucideIcon]>).map(([tab, Icon]) => (
                  <button className={`button flex-1 ${rightTab === tab ? "primary" : ""}`} key={tab} type="button" onClick={() => setRightTab(tab)}>
                    <Icon size={15} />
                  </button>
                ))}
              </div>
              {rightTab === "properties" ? <PropertiesPanel locale={locale} selectedNode={selectedNode} onChange={updateNodeData} /> : null}
              {rightTab === "comments" ? <PanelText title={t(locale, "editor.comments")} lines={["Mention teammates with @name.", "Comments sync through Supabase Realtime."]} /> : null}
              {rightTab === "history" ? <PanelText title={t(locale, "editor.history")} lines={["Version snapshots are retained by plan.", "Last-write-wins conflict policy for v1."]} /> : null}
              {rightTab === "layers" ? <PanelText title={t(locale, "editor.layers")} lines={nodes.map((node) => String(node.data.title ?? node.id))} /> : null}
              {rightTab === "ai" ? <AIAssistant locale={locale} /> : null}
            </>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

function PanelText({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="grid gap-3 p-4">
      <h2 className="font-semibold">{title}</h2>
      {lines.map((line) => <p className="muted text-sm" key={line}>{line}</p>)}
    </div>
  );
}
