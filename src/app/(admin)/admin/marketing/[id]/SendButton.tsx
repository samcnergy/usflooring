"use client";

import { useState, useTransition } from "react";
import { sendCampaignAction, type SendResult } from "../actions";

export default function SendButton({ campaignId, recipientCount }: { campaignId: string; recipientCount: number }) {
  const [confirming, setConfirming] = useState(false);
  const [result, setResult] = useState<SendResult | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSend() {
    startTransition(async () => {
      const res = await sendCampaignAction(campaignId);
      setResult(res);
      setConfirming(false);
    });
  }

  if (result) {
    if (result.ok) {
      return (
        <div className="rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800">
          ✓ Campaign sent to <strong>{result.sent.toLocaleString()}</strong> customer{result.sent !== 1 ? "s" : ""}
          {result.failed > 0 && <span className="text-amber-700"> ({result.failed} failed — check server logs)</span>}
        </div>
      );
    }
    return (
      <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
        {result.message}
        <button onClick={() => setResult(null)} className="ml-3 underline text-red-600">Dismiss</button>
      </div>
    );
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="inline-flex items-center justify-center rounded bg-green-600 hover:bg-green-700 text-white font-semibold px-6 h-10 text-sm"
      >
        Send campaign →
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 space-y-3">
      <p className="text-sm font-medium text-amber-900">
        You&apos;re about to send this campaign to <strong>{recipientCount.toLocaleString()}</strong> customer{recipientCount !== 1 ? "s" : ""} with email addresses. This cannot be undone.
      </p>
      <div className="flex gap-3">
        <button
          onClick={handleSend}
          disabled={isPending}
          className="rounded bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold px-5 h-9 text-sm"
        >
          {isPending ? "Sending…" : "Yes, send now"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={isPending}
          className="rounded border border-marble-300 hover:bg-marble-50 text-marble-700 font-medium px-5 h-9 text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
