import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function createWorkflow(name: string, workspaceId: string) {
  const supabase = await getSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) throw new Error("Not authenticated");

  // Get default dashboard
  const { data: dashboard } = await supabase
    .from("dashboards")
    .select("id")
    .eq("workspace_id", workspaceId)
    .limit(1)
    .maybeSingle();

  const { data: workflow, error } = await supabase
    .from("workflows")
    .insert({
      name,
      workspace_id: workspaceId,
      dashboard_id: dashboard?.id ?? null,
      created_by: authData.user.id,
      status: "draft"
    })
    .select("id")
    .single();

  if (error) throw error;

  // Update usage
  try {
    const { error: rpcError } = await supabase.rpc("increment_usage", { ws_id: workspaceId, col: "workflows" });
    if (rpcError) {
      const { data: usage } = await supabase.from("plan_usage").select("workflows").eq("workspace_id", workspaceId).maybeSingle();
      if (usage) {
        await supabase.from("plan_usage")
          .update({ workflows: (usage.workflows || 0) + 1 })
          .eq("workspace_id", workspaceId);
      }
    }
  } catch {
    // Suppress error so that workflow creation is not blocked if usage tracking fails
  }

  return workflow;
}

export async function deleteWorkflow(workflowId: string) {
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.from("workflows").delete().eq("id", workflowId);
  if (error) throw error;
}

export async function duplicateWorkflow(workflowId: string) {
  const supabase = await getSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) throw new Error("Not authenticated");

  const { data: original } = await supabase
    .from("workflows")
    .select("name, description, workspace_id, dashboard_id")
    .eq("id", workflowId)
    .single();

  if (!original) throw new Error("Workflow not found");

  const { data: newWorkflow, error } = await supabase
    .from("workflows")
    .insert({
      name: `${original.name} (copy)`,
      description: original.description,
      workspace_id: original.workspace_id,
      dashboard_id: original.dashboard_id,
      created_by: authData.user.id,
      status: "draft"
    })
    .select("id")
    .single();

  if (error) throw error;

  // Copy nodes
  const { data: nodes } = await supabase
    .from("workflow_nodes")
    .select("type, position, data, style")
    .eq("workflow_id", workflowId);

  if (nodes && nodes.length > 0 && newWorkflow) {
    await supabase.from("workflow_nodes").insert(
      nodes.map((n) => ({ ...n, workflow_id: newWorkflow.id }))
    );
  }

  return newWorkflow;
}

export async function archiveWorkflow(workflowId: string) {
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase
    .from("workflows")
    .update({ status: "archived" })
    .eq("id", workflowId);
  if (error) throw error;
}

export async function updateWorkflowStatus(workflowId: string, status: string) {
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase
    .from("workflows")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", workflowId);
  if (error) throw error;
}

export async function getUserWorkspaceId(): Promise<string | null> {
  const supabase = await getSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return null;

  const { data: membership } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", authData.user.id)
    .limit(1)
    .maybeSingle();

  return membership?.workspace_id ?? null;
}
