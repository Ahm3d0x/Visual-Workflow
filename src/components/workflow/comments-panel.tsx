"use client";

import { useCallback, useEffect, useState } from "react";
import { type Locale, t } from "@/lib/i18n";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { MessageSquare, Send, Trash2, User, Link as LinkIcon } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

type Comment = {
  id: string;
  workflow_id: string;
  node_id: string | null;
  body: string;
  created_by: string;
  created_at: string;
  profiles?: {
    full_name: string | null;
    email: string;
  } | null;
};

export function CommentsPanel({
  locale,
  workflowId,
  selectedNodeId,
  selectedNodeTitle
}: {
  locale: Locale;
  workflowId: string;
  selectedNodeId: string | null;
  selectedNodeTitle?: string;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [linkToNode, setLinkToNode] = useState(false);

  const supabase = getSupabaseBrowserClient();

  const fetchComments = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("workflow_comments")
        .select(`
          id,
          workflow_id,
          node_id,
          body,
          created_by,
          created_at,
          profiles:created_by (
            full_name,
            email
          )
        `)
        .eq("workflow_id", workflowId)
        .order("created_at", { ascending: true });

      if (!error && data) {
        setComments(data as unknown as Comment[]);
      }
    } catch {
      // Suppress error
    }
  }, [workflowId, supabase]);

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // Fetch initial comments
    fetchComments();

    // Subscribe to real-time comments
    const channel = supabase
      .channel("workflow_comments_channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "workflow_comments",
          filter: `workflow_id=eq.${workflowId}`
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [workflowId, fetchComments, supabase]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("workflow_comments").insert({
        workflow_id: workflowId,
        node_id: linkToNode ? selectedNodeId : null,
        body: newComment.trim(),
        created_by: user.id
      });

      if (!error) {
        setNewComment("");
        fetchComments();
      }
    } catch {
      // Suppress error
    }
    setLoading(false);
  }

  async function handleDelete(commentId: string) {
    try {
      const { error } = await supabase
        .from("workflow_comments")
        .delete()
        .eq("id", commentId);
      
      if (!error) {
        fetchComments();
      }
    } catch {
      // Suppress error
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-190px)] p-4 justify-between">
      {/* Comments List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        <h2 className="font-semibold text-sm mb-3">{t(locale, "editor.comments")}</h2>
        
        {comments.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <MessageSquare size={32} className="muted mb-2 text-muted" />
            <p className="muted text-xs">
              {locale === "ar" ? "لا توجد تعليقات بعد. ابدأ النقاش!" : "No comments yet. Start the discussion!"}
            </p>
          </div>
        ) : (
          comments.map((comment) => {
            const commenterName = comment.profiles?.full_name || comment.profiles?.email?.split("@")[0] || "User";
            const isOwnComment = user && comment.created_by === user.id;

            return (
              <div 
                key={comment.id} 
                className="panel p-3 text-sm flex flex-col gap-1.5 relative group transition-all"
                style={{ borderColor: "var(--border)", background: "var(--accent-muted)" }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <User size={12} className="text-[var(--accent)]" />
                    <span>{commenterName}</span>
                    <span className="text-[10px] font-normal text-muted">
                      {new Date(comment.created_at).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {isOwnComment && (
                    <button 
                      onClick={() => handleDelete(comment.id)}
                      className="text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity p-0.5"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>

                <p className="text-xs">{comment.body}</p>

                {comment.node_id && (
                  <div 
                    className="inline-flex items-center gap-1 text-[10px] text-[var(--accent)] font-semibold mt-1"
                  >
                    <LinkIcon size={10} />
                    <span>
                      {locale === "ar" ? `مرتبط بـ: ` : `Linked to: `}
                      {selectedNodeId === comment.node_id && selectedNodeTitle ? selectedNodeTitle : comment.node_id.slice(0, 8)}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Comment Input */}
      {user ? (
        <form onSubmit={handleSend} className="border-t pt-3 space-y-2 mt-2" style={{ borderColor: "var(--border)" }}>
          {selectedNodeId && (
            <div className="flex items-center gap-1.5">
              <input
                type="checkbox"
                id="link-node-check"
                checked={linkToNode}
                onChange={(e) => setLinkToNode(e.target.checked)}
                className="rounded cursor-pointer"
                style={{ accentColor: "var(--accent)" }}
              />
              <label htmlFor="link-node-check" className="text-[11px] text-muted cursor-pointer select-none">
                {locale === "ar" ? `ربط التعليق بالعنصر المحدد (${selectedNodeTitle})` : `Link comment to selected node (${selectedNodeTitle})`}
              </label>
            </div>
          )}

          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="input flex-1 py-1.5 text-xs"
              placeholder={locale === "ar" ? "اكتب تعليقاً..." : "Type a comment..."}
              disabled={loading}
              required
            />
            <button 
              type="submit" 
              className="button primary size-8 p-0 flex items-center justify-center shrink-0"
              disabled={loading || !newComment.trim()}
            >
              <Send size={14} />
            </button>
          </div>
        </form>
      ) : (
        <p className="text-center text-xs text-muted pt-2 border-t" style={{ borderColor: "var(--border)" }}>
          {locale === "ar" ? "سجل الدخول للمشاركة في التعليقات." : "Sign in to add a comment."}
        </p>
      )}
    </div>
  );
}
