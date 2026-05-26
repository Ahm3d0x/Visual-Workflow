import type { Edge, Node } from "@xyflow/react";
import { planLimits } from "@/lib/plans";

export const demoUsage = {
  plan: "legend",
  workflows: 18,
  dashboards: 4,
  nodes: 416,
  customElements: 12,
  favorites: 27,
  aiCredits: 1840,
  collaborators: 9
};

export const demoWorkflows = [
  { id: "customer-onboarding", name: "Customer onboarding", status: "Active", nodes: 34, collaborators: 5, updatedAt: "2026-05-26" },
  { id: "support-triage", name: "AI support triage", status: "Draft", nodes: 22, collaborators: 3, updatedAt: "2026-05-25" },
  { id: "invoice-approval", name: "Invoice approval", status: "Active", nodes: 18, collaborators: 6, updatedAt: "2026-05-24" }
];

export const demoNodes: Node[] = [
  {
    id: "start",
    type: "workflowNode",
    position: { x: 80, y: 160 },
    data: { nodeType: "start", title: "Lead received", description: "New lead enters the workflow" }
  },
  {
    id: "classify",
    type: "workflowNode",
    position: { x: 360, y: 120 },
    data: { nodeType: "ai_classify", title: "AI classify", description: "Classify lead quality and intent", provider: "openai" }
  },
  {
    id: "decision",
    type: "workflowNode",
    position: { x: 670, y: 160 },
    data: { nodeType: "decision", title: "Qualified?", description: "Route based on confidence score" }
  },
  {
    id: "approval",
    type: "workflowNode",
    position: { x: 980, y: 80 },
    data: { nodeType: "approval", title: "Sales approval", description: "Assign owner and approve next action" }
  },
  {
    id: "email",
    type: "workflowNode",
    position: { x: 980, y: 260 },
    data: { nodeType: "email", title: "Nurture email", description: "Send personalized follow-up" }
  }
];

export const demoEdges: Edge[] = [
  { id: "e1", source: "start", target: "classify", animated: true },
  { id: "e2", source: "classify", target: "decision", animated: true },
  { id: "e3", source: "decision", target: "approval", label: "yes" },
  { id: "e4", source: "decision", target: "email", label: "not yet" }
];

export function usageRows() {
  const limits = planLimits.legend;
  return [
    ["Workflows", demoUsage.workflows, limits.workflows],
    ["Dashboards", demoUsage.dashboards, limits.dashboards],
    ["Custom elements", demoUsage.customElements, limits.customElements],
    ["Favorites", demoUsage.favorites, limits.favorites],
    ["AI credits", demoUsage.aiCredits, limits.aiCredits],
    ["Collaborators", demoUsage.collaborators, limits.collaborators]
  ] as const;
}
