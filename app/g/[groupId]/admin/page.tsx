"use client";

import { FormEvent, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";

export default async function AdminPage({
  params,
}: {
  params: { groupId: string };
}) {
  const sb = supabaseServer();

  const { data: requests, error } = await sb
    .from("access_requests")
    .select("id, requester_name, requester_contact, created_at")
    .eq("group_id", params.groupId)
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  async function approve(formData: FormData) {
    "use server";
    const requestId = String(formData.get("requestId"));
    const requesterName = String(formData.get("name"));
    const userId = `dev:${requesterName}`;

    const res = await fetch(
      `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/api/groups/${params.groupId}/approve`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, userId }),
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error(j?.error || "Approve failed");
    }
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui", maxWidth: 720 }}>
      <h1>Admin – Access Requests</h1>
      <p>
        Group: <code>{params.groupId}</code>
      </p>

      {error && <p style={{ color: "crimson" }}>Error: {error.message}</p>}

      {(!requests || requests.length === 0) && !error && (
        <p>No pending access requests.</p>
      )}

      {requests?.map((r) => (
        <form
          key={r.id}
          action={approve}
          style={{
            border: "1px solid #ddd",
            borderRadius: 12,
            padding: 12,
            marginBottom: 12,
          }}
        >
          <p style={{ margin: 0 }}>
            <strong>{r.requester_name}</strong>
          </p>
          {r.requester_contact && <p style={{ margin: "6px 0" }}>{r.requester_contact}</p>}

          <input type="hidden" name="requestId" value={r.id} />
          <input type="hidden" name="name" value={r.requester_name} />

          <button style={{ padding: 8, borderRadius: 10 }}>Approve</button>
        </form>
      ))}
    </main>
  );
}
 