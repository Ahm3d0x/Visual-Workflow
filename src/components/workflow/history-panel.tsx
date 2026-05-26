"use client";

import { useCallback, useEffect, useState } from "react";
import { type Locale, t } from "@/lib/i18n";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { History, Plus, RotateCcw, User, Clock } from "lucide-react";
import type { Node, Edge } from "@xyflow/react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

type Version = {
  id: string;
  workflow_id: string;
  snapshot: {
    nodes: Node[];
    edges: Edge[];
  };
  created_by: string;
  created_at: string;
  profiles?: {
    full_name: string | null;
    email: string;
  } | null;
};

export function HistoryPanel({
  locale,
  workflowId,
  currentNodes,
  currentEdges,
  onRestore
}: {
  locale: Locale;
  workflowId: string;
  currentNodes: Node[];
  currentEdges: Edge[];
  onRestore: (nodes: Node[], edges: Edge[]) => void;
}) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);

  const supabase = getSupabaseBrowserClient();

  const fetchVersions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("workflow_versions")
        .select(`
          id,
          workflow_id,
          snapshot,
          created_by,
          created_at,
          profiles:created_by (
            full_name,
            email
          )
        `)
        .eq("workflow_id", workflowId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setVersions(data as unknown as Version[]);
      }
    } catch {
      // Suppress error
    }
  }, [workflowId, supabase]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    fetchVersions();
  }, [workflowId, fetchVersions]);

  async function handleCreateSnapshot() {
    if (!user) return;
    setLoading(true);

    try {
      const { error } = await supabase.from("workflow_versions").insert({
        workflow_id: workflowId,
        snapshot: {
          nodes: currentNodes,
          edges: currentEdges
        },
        created_by: user.id
      });

      if (!error) {
        fetchVersions();
      }
    } catch {
      // Suppress error
    }

    setLoading(false);
  }

  async function handleRestore(version: Version) {
    const { nodes, edges } = version.snapshot;
    if (nodes && edges) {
      if (confirm(locale === "ar" ? "هل أنت متأكد من استعادة هذه النسخة؟ سيتم فقدان التعديلات الحالية غير المحفوظة." : "Are you sure you want to restore this version? Unsaved changes will be lost.")) {
        onRestore(nodes, edges);
      }
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-190px)] p-4 justify-between">
      {/* Versions List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm">{t(locale, "editor.history")}</h2>
          {user && (
            <button 
              onClick={handleCreateSnapshot}
              disabled={loading}
              className="button sm gap-1 px-2.5 py-1 text-xs"
              style={{ background: "var(--accent-muted)", color: "var(--accent)" }}
            >
              <Plus size={13} />
              <span>{t(locale, "editor.createSnapshot")}</span>
            </button>
          )}
        </div>

        {versions.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <History size={32} className="muted mb-2 text-muted" />
            <p className="muted text-xs">
              {locale === "ar" ? "لا توجد لقطات سجل بعد. أنشئ لقطتك الأولى!" : "No snapshots in history yet. Create your first one!"}
            </p>
          </div>
        ) : (
          versions.map((version) => {
            const creatorName = version.profiles?.full_name || version.profiles?.email?.split("@")[0] || "User";

            return (
              <div 
                key={version.id} 
                className="panel p-3 text-sm flex flex-col gap-1.5 transition-all"
                style={{ borderColor: "var(--border)", background: "var(--accent-muted)" }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <User size={12} className="text-[var(--accent)]" />
                    <span>{creatorName}</span>
                  </div>

                  <button 
                    onClick={() => handleRestore(version)}
                    className="button sm ghost text-xs gap-1 px-2 py-0.5"
                    style={{ color: "var(--accent)" }}
                  >
                    <RotateCcw size={12} />
                    <span>{locale === "ar" ? "استعادة" : "Restore"}</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-muted">
                  <Clock size={11} />
                  <span>
                    {new Date(version.created_at).toLocaleString(locale, {
                      dateStyle: "short",
                      timeStyle: "short"
                    })}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
