import {
  BadgeCheck,
  Bot,
  Braces,
  CheckSquare,
  Clock,
  Code2,
  Database,
  Diamond,
  FileInput,
  FileOutput,
  FileUp,
  Filter,
  GitBranch,
  GitMerge,
  GitPullRequest,
  Group,
  Mail,
  MessageSquare,
  NotebookPen,
  Play,
  Repeat,
  RotateCcw,
  Route,
  ShieldAlert,
  Signature,
  Sparkles,
  Split,
  Square,
  Table2,
  Text,
  Webhook,
  XCircle
} from "lucide-react";
import type { ComponentType } from "react";

export type PropertyField = {
  key: string;
  labelKey: string;
  type: "text" | "textarea" | "select" | "number" | "boolean" | "json";
  options?: string[];
  required?: boolean;
};

export type NodeTemplate = {
  type: string;
  category: "basic" | "logic" | "data" | "integration" | "human" | "ai";
  titleKey: string;
  descriptionKey: string;
  icon: ComponentType<{ className?: string }>;
  color: string;
  properties: PropertyField[];
};

const common: PropertyField[] = [
  { key: "title", labelKey: "properties.title", type: "text", required: true },
  { key: "description", labelKey: "properties.description", type: "textarea" }
];

export const nodeCatalog: NodeTemplate[] = [
  { type: "start", category: "basic", titleKey: "nodes.start", descriptionKey: "nodes.startDesc", icon: Play, color: "#22c55e", properties: common },
  { type: "end", category: "basic", titleKey: "nodes.end", descriptionKey: "nodes.endDesc", icon: XCircle, color: "#ef4444", properties: common },
  { type: "process", category: "basic", titleKey: "nodes.process", descriptionKey: "nodes.processDesc", icon: Square, color: "#38bdf8", properties: common },
  { type: "decision", category: "basic", titleKey: "nodes.decision", descriptionKey: "nodes.decisionDesc", icon: Diamond, color: "#f59e0b", properties: [...common, { key: "conditions", labelKey: "properties.conditions", type: "json" }] },
  { type: "note", category: "basic", titleKey: "nodes.note", descriptionKey: "nodes.noteDesc", icon: NotebookPen, color: "#a78bfa", properties: common },
  { type: "group", category: "basic", titleKey: "nodes.group", descriptionKey: "nodes.groupDesc", icon: Group, color: "#64748b", properties: common },
  { type: "delay", category: "basic", titleKey: "nodes.delay", descriptionKey: "nodes.delayDesc", icon: Clock, color: "#14b8a6", properties: [...common, { key: "duration", labelKey: "properties.duration", type: "number" }] },
  { type: "if_else", category: "logic", titleKey: "nodes.ifElse", descriptionKey: "nodes.ifElseDesc", icon: GitBranch, color: "#f97316", properties: [...common, { key: "expression", labelKey: "properties.expression", type: "text", required: true }] },
  { type: "switch", category: "logic", titleKey: "nodes.switch", descriptionKey: "nodes.switchDesc", icon: Split, color: "#eab308", properties: [...common, { key: "cases", labelKey: "properties.cases", type: "json" }] },
  { type: "loop", category: "logic", titleKey: "nodes.loop", descriptionKey: "nodes.loopDesc", icon: Repeat, color: "#84cc16", properties: [...common, { key: "maxIterations", labelKey: "properties.maxIterations", type: "number" }] },
  { type: "parallel", category: "logic", titleKey: "nodes.parallel", descriptionKey: "nodes.parallelDesc", icon: GitPullRequest, color: "#06b6d4", properties: common },
  { type: "merge", category: "logic", titleKey: "nodes.merge", descriptionKey: "nodes.mergeDesc", icon: GitMerge, color: "#0ea5e9", properties: common },
  { type: "retry", category: "logic", titleKey: "nodes.retry", descriptionKey: "nodes.retryDesc", icon: RotateCcw, color: "#8b5cf6", properties: [...common, { key: "attempts", labelKey: "properties.attempts", type: "number" }] },
  { type: "error_handler", category: "logic", titleKey: "nodes.errorHandler", descriptionKey: "nodes.errorHandlerDesc", icon: ShieldAlert, color: "#dc2626", properties: common },
  { type: "input", category: "data", titleKey: "nodes.input", descriptionKey: "nodes.inputDesc", icon: FileInput, color: "#10b981", properties: common },
  { type: "output", category: "data", titleKey: "nodes.output", descriptionKey: "nodes.outputDesc", icon: FileOutput, color: "#0284c7", properties: common },
  { type: "variable", category: "data", titleKey: "nodes.variable", descriptionKey: "nodes.variableDesc", icon: Braces, color: "#7c3aed", properties: [...common, { key: "value", labelKey: "properties.value", type: "json" }] },
  { type: "mapper", category: "data", titleKey: "nodes.mapper", descriptionKey: "nodes.mapperDesc", icon: Route, color: "#0891b2", properties: [...common, { key: "mapping", labelKey: "properties.mapping", type: "json" }] },
  { type: "filter", category: "data", titleKey: "nodes.filter", descriptionKey: "nodes.filterDesc", icon: Filter, color: "#65a30d", properties: [...common, { key: "expression", labelKey: "properties.expression", type: "text" }] },
  { type: "transform", category: "data", titleKey: "nodes.transform", descriptionKey: "nodes.transformDesc", icon: Code2, color: "#2563eb", properties: [...common, { key: "script", labelKey: "properties.script", type: "textarea" }] },
  { type: "api_request", category: "integration", titleKey: "nodes.api", descriptionKey: "nodes.apiDesc", icon: Code2, color: "#0f766e", properties: [...common, { key: "method", labelKey: "properties.method", type: "select", options: ["GET", "POST", "PUT", "PATCH", "DELETE"] }, { key: "url", labelKey: "properties.url", type: "text", required: true }, { key: "headers", labelKey: "properties.headers", type: "json" }] },
  { type: "webhook", category: "integration", titleKey: "nodes.webhook", descriptionKey: "nodes.webhookDesc", icon: Webhook, color: "#db2777", properties: common },
  { type: "email", category: "integration", titleKey: "nodes.email", descriptionKey: "nodes.emailDesc", icon: Mail, color: "#ea580c", properties: [...common, { key: "recipient", labelKey: "properties.recipient", type: "text" }, { key: "subject", labelKey: "properties.subject", type: "text" }] },
  { type: "database", category: "integration", titleKey: "nodes.database", descriptionKey: "nodes.databaseDesc", icon: Database, color: "#16a34a", properties: [...common, { key: "query", labelKey: "properties.query", type: "textarea" }] },
  { type: "google_sheets", category: "integration", titleKey: "nodes.sheets", descriptionKey: "nodes.sheetsDesc", icon: Table2, color: "#22c55e", properties: common },
  { type: "file_upload", category: "integration", titleKey: "nodes.fileUpload", descriptionKey: "nodes.fileUploadDesc", icon: FileUp, color: "#0891b2", properties: common },
  { type: "approval", category: "human", titleKey: "nodes.approval", descriptionKey: "nodes.approvalDesc", icon: BadgeCheck, color: "#4f46e5", properties: [...common, { key: "assignee", labelKey: "properties.assignee", type: "text" }] },
  { type: "user_task", category: "human", titleKey: "nodes.userTask", descriptionKey: "nodes.userTaskDesc", icon: CheckSquare, color: "#9333ea", properties: common },
  { type: "checklist", category: "human", titleKey: "nodes.checklist", descriptionKey: "nodes.checklistDesc", icon: CheckSquare, color: "#0d9488", properties: [...common, { key: "items", labelKey: "properties.items", type: "json" }] },
  { type: "attachment", category: "human", titleKey: "nodes.attachment", descriptionKey: "nodes.attachmentDesc", icon: FileUp, color: "#64748b", properties: common },
  { type: "signature", category: "human", titleKey: "nodes.signature", descriptionKey: "nodes.signatureDesc", icon: Signature, color: "#be123c", properties: common },
  { type: "ai_generate", category: "ai", titleKey: "nodes.aiGenerate", descriptionKey: "nodes.aiGenerateDesc", icon: Sparkles, color: "#8b5cf6", properties: [...common, { key: "prompt", labelKey: "properties.prompt", type: "textarea", required: true }, { key: "provider", labelKey: "properties.provider", type: "select", options: ["openai", "gemini"] }] },
  { type: "ai_classify", category: "ai", titleKey: "nodes.aiClassify", descriptionKey: "nodes.aiClassifyDesc", icon: Bot, color: "#7c3aed", properties: [...common, { key: "labels", labelKey: "properties.labels", type: "json" }] },
  { type: "ai_extract", category: "ai", titleKey: "nodes.aiExtract", descriptionKey: "nodes.aiExtractDesc", icon: Text, color: "#6d28d9", properties: [...common, { key: "schema", labelKey: "properties.schema", type: "json" }] },
  { type: "ai_summarize", category: "ai", titleKey: "nodes.aiSummarize", descriptionKey: "nodes.aiSummarizeDesc", icon: MessageSquare, color: "#9333ea", properties: common },
  { type: "ai_route", category: "ai", titleKey: "nodes.aiRoute", descriptionKey: "nodes.aiRouteDesc", icon: Route, color: "#a855f7", properties: [...common, { key: "routes", labelKey: "properties.routes", type: "json" }] },
  { type: "ai_validate", category: "ai", titleKey: "nodes.aiValidate", descriptionKey: "nodes.aiValidateDesc", icon: ShieldAlert, color: "#c026d3", properties: [...common, { key: "rules", labelKey: "properties.rules", type: "json" }] }
];

export const categories = ["basic", "logic", "data", "integration", "human", "ai"] as const;

export function getNodeTemplate(type: string) {
  return nodeCatalog.find((node) => node.type === type) ?? nodeCatalog[2];
}
