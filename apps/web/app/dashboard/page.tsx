"use client";

import { Appbar } from "../components/Appbar";
import { DarkButton } from "../components/buttons/DarkButton";
import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL, HOOKS_URL } from "../config";
import { useRouter } from "next/navigation";

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
    }[];
    trigger: {
        id: string;
        zapId: string;
        triggerId: string;
        type: { id: string; name: string; image: string };
    };
}

function useZaps() {
    const [loading, setLoading] = useState(true);
    const [zaps, setZaps] = useState<Zap[]>([]);

    useEffect(() => {
        axios
            .get(`${BACKEND_URL}/api/v1/zap`, {
                headers: { Authorization: localStorage.getItem("token") },
            })
            .then((res) => {
                setZaps(res.data.zaps);
                setLoading(false);
            });
    }, []);

    return { loading, zaps, setZaps };
}

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(text);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }}
            className="ml-2 px-2 py-0.5 text-xs rounded border border-gray-200 hover:bg-gray-100 transition-colors font-mono text-gray-500"
        >
            {copied ? "✓" : "Copy"}
        </button>
    );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-3xl">
                ⚡
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">No Zaps yet</h3>
            <p className="text-sm text-gray-400 mb-6">
                Create your first Zap to start automating.
            </p>
            <DarkButton onClick={onCreate}>Create your first Zap</DarkButton>
        </div>
    );
}

function DeleteButton({ zapId, onDeleted }: { zapId: string; onDeleted: () => void }) {
    const [confirming, setConfirming] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirming) {
            setConfirming(true);
            setTimeout(() => setConfirming(false), 3000); // auto-cancel after 3s
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
            className={`px-2 py-1 text-xs rounded border transition-colors font-medium ${
                confirming
                    ? "border-red-400 bg-red-50 text-red-600 hover:bg-red-100"
                    : "border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500 hover:bg-red-50"
            }`}
        >
            {deleting ? "..." : confirming ? "Sure?" : "Delete"}
        </button>
    );
}

function ZapRow({ zap, onDeleted }: { zap: Zap; onDeleted: () => void }) {
    const router = useRouter();
    const webhookUrl = `${HOOKS_URL}/hooks/catch/1/${zap.id}`;
    const sortedActions = [...zap.actions].sort(
        (a, b) => a.sortingOrder - b.sortingOrder
    );

    return (
        <div
            onClick={() => router.push(`/zap/${zap.id}`)}
            className="grid grid-cols-12 items-center px-6 py-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors group"
        >
            {/* Flow icons */}
            <div className="col-span-3 flex items-center gap-1">
                <img
                    src={zap.trigger.type.image}
                    className="w-7 h-7 rounded-full border border-gray-200 object-cover"
                    alt={zap.trigger.type.name}
                    title={zap.trigger.type.name}
                />
                {sortedActions.length > 0 && (
                    <span className="text-gray-300 text-xs mx-1">→</span>
                )}
                {sortedActions.map((x) => (
                    <img
                        key={x.id}
                        src={x.type.image}
                        className="w-7 h-7 rounded-full border border-gray-200 object-cover"
                        alt={x.type.name}
                        title={x.type.name}
                    />
                ))}
            </div>

            {/* ID */}
            <div className="col-span-2 font-mono text-xs text-gray-400 truncate pr-4">
                {zap.id}
            </div>

            {/* Created at */}
            <div className="col-span-2 text-sm text-gray-500">Nov 13, 2023</div>

            {/* Webhook URL */}
            <div className="col-span-3 flex items-center">
                <code className="text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded px-2 py-1 truncate max-w-[180px]">
                    {webhookUrl}
                </code>
                <CopyButton text={webhookUrl} />
            </div>

            {/* Actions */}
            <div className="col-span-2 flex items-center justify-end gap-2">
                <DeleteButton zapId={zap.id} onDeleted={onDeleted} />
                <span className="text-gray-300 group-hover:text-gray-600 group-hover:translate-x-1 transition-all text-lg">
                    →
                </span>
            </div>
        </div>
    );
}

function ZapTable({ zaps, onDeleted }: { zaps: Zap[]; onDeleted: (id: string) => void }) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-12 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-widest text-gray-400 font-semibold">
                <div className="col-span-3">Flow</div>
                <div className="col-span-2">ID</div>
                <div className="col-span-2">Created</div>
                <div className="col-span-3">Webhook URL</div>
                <div className="col-span-2" />
            </div>

            {zaps.map((z) => (
                <ZapRow key={z.id} zap={z} onDeleted={() => onDeleted(z.id)} />
            ))}
        </div>
    );
}

export default function DashboardPage() {
    const { loading, zaps, setZaps } = useZaps();
    const router = useRouter();

    const handleDeleted = (id: string) => {
        setZaps((prev) => prev.filter((z) => z.id !== id));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Appbar />
            <div className="max-w-screen-lg mx-auto px-6 py-10">
                {/* Page header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Zaps</h1>
                        {!loading && (
                            <p className="text-sm text-gray-400 mt-1">
                                {zaps.length} automation{zaps.length !== 1 ? "s" : ""}
                            </p>
                        )}
                    </div>
                    <DarkButton onClick={() => router.push("/zap/create")}>
                        + Create Zap
                    </DarkButton>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center items-center h-48 text-gray-400 text-sm">
                        Loading...
                    </div>
                ) : zaps.length === 0 ? (
                    <EmptyState onCreate={() => router.push("/zap/create")} />
                ) : (
                    <ZapTable zaps={zaps} onDeleted={handleDeleted} />
                )}
            </div>
        </div>
    );
}