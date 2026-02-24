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
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border transition-all font-medium ${
                copied
                    ? "border-green-200 bg-green-50 text-green-600"
                    : "border-gray-200 bg-white text-gray-400 hover:text-gray-600 hover:border-gray-300"
            }`}
        >
            {copied ? "✓ Copied" : "Copy"}
        </button>
    );
}

function DeleteButton({ zapId, onDeleted }: { zapId: string; onDeleted: () => void }) {
    const [confirming, setConfirming] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirming) {
            setConfirming(true);
            setTimeout(() => setConfirming(false), 3000);
            return;
        }
        setDeleting(true);
        await axios.delete(`${BACKEND_URL}/api/v1/zap/${zapId}`, {
            headers: { Authorization: localStorage.getItem("token") },
        });
        onDeleted();
    };

    return (
        <button
            onClick={handleDelete}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border transition-all font-medium ${
                confirming
                    ? "border-red-300 bg-red-50 text-red-600"
                    : "border-gray-200 bg-white text-gray-500 hover:border-red-200 hover:text-red-500 hover:bg-red-50"
            }`}
        >
            {deleting ? (
                <span className="animate-pulse">Deleting...</span>
            ) : confirming ? (
                "Confirm delete?"
            ) : (
                <>
                    <svg width="13" height="13" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 3h7M3.5 3V2h3v1M2 3l.5 5.5a.5.5 0 00.5.5h4a.5.5 0 00.5-.5L8 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                    Delete Zap
                </>
            )}
        </button>
    );
}

function StepBadge({ index, total }: { index: number; total: number }) {
    return (
        <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                {index}
            </div>
            {index < total && <div className="w-0.5 h-8 bg-gray-200 mt-1" />}
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
                <div className="flex justify-center items-center h-64">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                        <div className="w-6 h-6 border-2 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
                        <span className="text-sm">Loading zap...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!zap) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Appbar />
                <div className="flex flex-col justify-center items-center h-64 gap-4">
                    <div className="text-4xl">🔍</div>
                    <div className="text-gray-600 font-medium">Zap not found</div>
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="text-sm text-orange-500 hover:underline"
                    >
                        ← Back to dashboard
                    </button>
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

            <div className="max-w-2xl mx-auto px-4 pt-28 pb-16">
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="text-sm text-gray-400 hover:text-gray-600 mb-2 flex items-center gap-1 transition-colors"
                        >
                            ← Back to dashboard
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">Zap Details</h1>
                        <p className="text-xs text-gray-400 font-mono mt-1">{zap.id}</p>
                    </div>
                    <DeleteButton
                        zapId={zap.id}
                        onDeleted={() => router.push("/dashboard")}
                    />
                </div>

                {/* Webhook URL Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 mb-8 shadow-sm">
                    <div className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-3">
                        Webhook URL
                    </div>
                    <div className="flex items-center gap-2">
                        <code className="text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg flex-1 truncate border border-gray-100 font-mono">
                            {webhookUrl}
                        </code>
                        <CopyButton text={webhookUrl} />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                        Send a <span className="font-mono bg-gray-100 px-1 rounded">POST</span> request to this URL to trigger your Zap.
                    </p>
                </div>

                {/* Flow */}
                <div className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-4">
                    Flow · {totalSteps} step{totalSteps !== 1 ? "s" : ""}
                </div>
                <div className="flex flex-col">
                    {/* Trigger */}
                    <div className="flex gap-4 items-start">
                        <StepBadge index={1} total={totalSteps} />
                        <div className="bg-white border border-gray-200 rounded-xl p-4 flex-1 shadow-sm mb-2">
                            <div className="text-xs uppercase tracking-widest text-orange-400 font-semibold mb-2">
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
                                            <div className="text-xs text-gray-400 mt-0.5 space-x-1">
                                                {action.metadata.email && (
                                                    <span>To: <span className="font-mono">{action.metadata.email}</span></span>
                                                )}
                                                {action.metadata.address && (
                                                    <span>To: <span className="font-mono">{action.metadata.address}</span></span>
                                                )}
                                                {action.metadata.amount && (
                                                    <span>· {action.metadata.amount} SOL</span>
                                                )}
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