import { WorkflowEditor } from "@/components/workflow/workflow-editor";
import type { Locale } from "@/lib/i18n";
import { getWorkflowData } from "@/lib/workflow-data";

export default async function WorkflowPage({
  params
}: {
  params: Promise<{ locale: Locale; workflowId: string }>;
}) {
  const { locale, workflowId } = await params;
  const workflowData = await getWorkflowData(workflowId);
  return <WorkflowEditor locale={locale} workflowId={workflowId} initialNodes={workflowData.nodes} initialEdges={workflowData.edges} />;
}
