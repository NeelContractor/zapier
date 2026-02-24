"use client";

import { Appbar } from "../../components/Appbar";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BACKEND_URL, HOOKS_URL } from "../../config";

interface Zap {
    id: string;
    triggerId: string;
    userId: number;
    actions: {
        id: string;
        zapId: string;
        actionId: string;
        sortingOrder: number;
        type: { id: string; name: string; image: string };
        metadata: any;
    }[];
    trigger: {
        id: string;
        zapId: string;
        triggerId: string;
        type: { id: string; name: string; image: string };
    };
}

function useZap(id: string) {
    const [loading, setLoading] = useState(true);
    const [zap, setZap] = useState<Zap | null>(null);

    useEffect(() => {
        axios
            .get(`${BACKEND_URL}/api/v1/zap/${id}`, {
                headers: { Authorization: localStorage.getItem("token") },
            })
            .then((res) => {
                setZap(res.data.zap);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    return { loading, zap };
}

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    return (
        <button
            onClick={() => {
                navigator.clipboard.writeText(text);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }}
            className="ml-2 px-3 py-1 text-xs rounded-md border border-gray-300 hover:bg-gray-100 transition-colors font-mono"
        >
            {copied ? "✓ Copied" : "Copy"}
        </button>
    );
}

function StepBadge({ index, total }: { index: number; total: number }) {
    return (
        <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">
                {index}
            </div>
            {index < total && <div className="w-0.5 h-8 bg-gray-300 mt-1" />}
        </div>
    );
}

export default function ZapDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const { loading, zap } = useZap(id);
    const webhookUrl = `${HOOKS_URL}/hooks/catch/1/${id}`;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Appbar />
                <div className="flex justify-center items-center h-64 text-gray-400 text-sm">
                    Loading...
                </div>
            </div>
        );
    }

    if (!zap) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Appbar />
                <div className="flex justify-center items-center h-64 text-gray-400 text-sm">
                    Zap not found.
                </div>
            </div>
        );
    }

    const sortedActions = [...zap.actions].sort(
        (a, b) => a.sortingOrder - b.sortingOrder
    );
    const totalSteps = 1 + sortedActions.length;

    return (
        <div className="min-h-screen bg-gray-50">
            <Appbar />

            <div className="max-w-2xl mx-auto px-4 py-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="text-sm text-gray-400 hover:text-gray-600 mb-1 flex items-center gap-1"
                        >
                            ← Back to dashboard
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">Zap Details</h1>
                        <p className="text-xs text-gray-400 font-mono mt-1">{zap.id}</p>
                    </div>
                </div>

                {/* Webhook URL Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 mb-8 shadow-sm">
                    <div className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-2">
                        Webhook URL
                    </div>
                    <div className="flex items-center">
                        <code className="text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg flex-1 truncate border border-gray-100">
                            {webhookUrl}
                        </code>
                        <CopyButton text={webhookUrl} />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                        Send a POST request to this URL to trigger your Zap.
                    </p>
                </div>

                {/* Flow */}
                <div className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-4">
                    Flow
                </div>
                <div className="flex flex-col gap-0">
                    {/* Trigger */}
                    <div className="flex gap-4 items-start">
                        <StepBadge index={1} total={totalSteps} />
                        <div className="bg-white border border-gray-200 rounded-xl p-4 flex-1 shadow-sm mb-2">
                            <div className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-2">
                                Trigger
                            </div>
                            <div className="flex items-center gap-3">
                                <img
                                    src={zap.trigger.type.image}
                                    className="w-9 h-9 rounded-full object-cover border border-gray-100"
                                    alt={zap.trigger.type.name}
                                />
                                <div>
                                    <div className="font-semibold text-gray-800 text-sm">
                                        {zap.trigger.type.name}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        Starts the automation
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    {sortedActions.map((action, idx) => (
                        <div key={action.id} className="flex gap-4 items-start">
                            <StepBadge index={idx + 2} total={totalSteps} />
                            <div className="bg-white border border-gray-200 rounded-xl p-4 flex-1 shadow-sm mb-2">
                                <div className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-2">
                                    Action {idx + 1}
                                </div>
                                <div className="flex items-center gap-3">
                                    <img
                                        src={action.type.image}
                                        className="w-9 h-9 rounded-full object-cover border border-gray-100"
                                        alt={action.type.name}
                                    />
                                    <div>
                                        <div className="font-semibold text-gray-800 text-sm">
                                            {action.type.name}
                                        </div>
                                        {action.metadata && (
                                            <div className="text-xs text-gray-400 mt-0.5">
                                                {action.metadata.email && `To: ${action.metadata.email}`}
                                                {action.metadata.address && `To: ${action.metadata.address}`}
                                                {action.metadata.amount && ` · ${action.metadata.amount} SOL`}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}