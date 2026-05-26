import type { Edge, Node } from "@xyflow/react";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { demoEdges, demoNodes, demoUsage, demoWorkflows } from "@/lib/demo-data";

export type DashboardWorkflow = {
  id: string;
  name: string;
  status: string;
  nodes: number;
  collaborators: number;
  updatedAt: string;
};

export type DashboardData = {
  authenticated: boolean;
  usage: typeof demoUsage;
  workflows: DashboardWorkflow[];
};

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await getSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    return { authenticated: false, usage: demoUsage, workflows: demoWorkflows };
  }

  const { data: membership } = await supabase
    .from("workspace_members")
    .select("workspace_id, role")
    .eq("user_id", authData.user.id)
    .limit(1)
    .maybeSingle();

  if (!membership?.workspace_id) {
    return { authenticated: true, usage: demoUsage, workflows: [] };
  }

  const [{ data: usageRow }, { data: workflows }, { data: members }] = await Promise.all([
    supabase.from("plan_usage").select("*").eq("workspace_id", membership.workspace_id).maybeSingle(),
    supabase
      .from("workflows")
      .select("id, name, status, updated_at, workflow_nodes(count)")
      .eq("workspace_id", membership.workspace_id)
      .order("updated_at", { ascending: false }),
    supabase.from("workspace_members").select("user_id", { count: "exact", head: true }).eq("workspace_id", membership.workspace_id)
  ]);

  return {
    authenticated: true,
    usage: {
      plan: "legend",
      workflows: usageRow?.workflows ?? workflows?.length ?? 0,
      dashboards: usageRow?.dashboards ?? 0,
      nodes: usageRow?.nodes ?? 0,
      customElements: usageRow?.custom_elements ?? 0,
      favorites: usageRow?.favorites ?? 0,
      aiCredits: usageRow?.ai_credits_used ?? 0,
      collaborators: members?.length ?? 0
    },
    workflows: (workflows ?? []).map((workflow) => ({
      id: workflow.id,
      name: workflow.name,
      status: workflow.status,
      nodes: Array.isArray(workflow.workflow_nodes) && workflow.workflow_nodes[0] ? Number(workflow.workflow_nodes[0].count) : 0,
      collaborators: members?.length ?? 0,
      updatedAt: new Date(workflow.updated_at).toISOString().slice(0, 10)
    }))
  };
}

export async function getWorkflowData(workflowId: string): Promise<{ nodes: Node[]; edges: Edge[]; found: boolean }> {
  if (!isUuid(workflowId)) {
    return { nodes: demoNodes, edges: demoEdges, found: false };
  }

  const supabase = await getSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) {
    return { nodes: demoNodes, edges: demoEdges, found: false };
  }

  const [{ data: dbNodes }, { data: dbEdges }] = await Promise.all([
    supabase.from("workflow_nodes").select("*").eq("workflow_id", workflowId).order("created_at"),
    supabase.from("workflow_edges").select("*").eq("workflow_id", workflowId).order("created_at")
  ]);

  const nodes: Node[] = (dbNodes ?? []).map((node) => ({
    id: node.id,
    type: "workflowNode",
    position: readPosition(node.position),
    data: {
      nodeType: node.type,
      ...(isRecord(node.data) ? node.data : {}),
      dbId: node.id
    }
  }));

  const edges: Edge[] = (dbEdges ?? []).map((edge) => ({
    id: edge.id,
    source: edge.source_node_id,
    target: edge.target_node_id,
    sourceHandle: edge.source_handle,
    targetHandle: edge.target_handle,
    data: edge.data,
    animated: true
  }));

  return { nodes: nodes.length ? nodes : demoNodes, edges: nodes.length ? edges : demoEdges, found: true };
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readPosition(value: unknown) {
  if (isRecord(value) && typeof value.x === "number" && typeof value.y === "number") {
    return { x: value.x, y: value.y };
  }
  return { x: 80, y: 120 };
}
