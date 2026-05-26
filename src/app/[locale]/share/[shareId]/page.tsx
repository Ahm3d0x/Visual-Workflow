import { WorkflowEditor } from "@/components/workflow/workflow-editor";
import type { Locale } from "@/lib/i18n";
import { getWorkflowData } from "@/lib/workflow-data";

export default async function SharePage({ params }: { params: Promise<{ locale: Locale; shareId: string }> }) {
  const { locale, shareId } = await params;
  const workflowData = await getWorkflowData(shareId);
  return <WorkflowEditor locale={locale} workflowId={shareId} initialNodes={workflowData.nodes} initialEdges={workflowData.edges} readOnly />;
}
