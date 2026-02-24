"use client";

import { Appbar } from "../components/Appbar";
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
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md border transition-all font-medium ${
                copied
                    ? "border-green-200 bg-green-50 text-green-600"
                    : "border-gray-200 bg-white text-gray-400 hover:text-gray-600 hover:border-gray-300"
            }`}
        >
            {copied ? (
                <>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 5L3.5 7L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Copied
                </>
            ) : (
                <>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                        <path d="M1 7V1H7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                    Copy
                </>
            )}
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
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md border transition-all font-medium ${
                confirming
                    ? "border-red-300 bg-red-50 text-red-600"
                    : "border-gray-200 bg-white text-gray-400 hover:border-red-200 hover:text-red-500 hover:bg-red-50"
            }`}
        >
            {deleting ? (
                <span className="animate-pulse">Deleting...</span>
            ) : confirming ? (
                "Confirm?"
            ) : (
                <>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 3h7M3.5 3V2h3v1M2 3l.5 5.5a.5.5 0 00.5.5h4a.5.5 0 00.5-.5L8 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                    Delete
                </>
            )}
        </button>
    );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 bg-orange-50 border-2 border-orange-100 rounded-2xl flex items-center justify-center mb-5 text-4xl">
                ⚡
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">No Zaps yet</h3>
            <p className="text-sm text-gray-400 mb-6 max-w-xs">
                Create your first Zap to start automating your workflows.
            </p>
            <button
                onClick={onCreate}
                className="bg-orange-500 hover:bg-orange-400 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-orange-100"
            >
                + Create your first Zap
            </button>
        </div>
    );
}

function SkeletonRow() {
    return (
        <div className="grid grid-cols-12 items-center px-6 py-4 border-b border-gray-100 animate-pulse">
            <div className="col-span-3 flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-100 rounded-full" />
                <div className="w-4 h-3 bg-gray-100 rounded" />
                <div className="w-8 h-8 bg-gray-100 rounded-full" />
            </div>
            <div className="col-span-2"><div className="w-20 h-3 bg-gray-100 rounded" /></div>
            <div className="col-span-2"><div className="w-16 h-3 bg-gray-100 rounded" /></div>
            <div className="col-span-3"><div className="w-32 h-6 bg-gray-100 rounded-md" /></div>
            <div className="col-span-2 flex justify-end">
                <div className="w-14 h-6 bg-gray-100 rounded-md" />
            </div>
        </div>
    );
}

function ZapRow({ zap, onDeleted }: { zap: Zap; onDeleted: () => void }) {
    const router = useRouter();
    const webhookUrl = `${HOOKS_URL}/hooks/catch/1/${zap.id}`;
    const sortedActions = [...zap.actions].sort((a, b) => a.sortingOrder - b.sortingOrder);

    return (
        <div
            onClick={() => router.push(`/zap/${zap.id}`)}
            className="grid grid-cols-12 items-center px-6 py-4 border-b border-gray-100 hover:bg-orange-50/30 cursor-pointer transition-colors group"
        >
            <div className="col-span-3 flex items-center gap-1.5">
                <img src={zap.trigger.type.image} className="w-8 h-8 rounded-full border border-gray-200 object-cover shadow-sm" alt={zap.trigger.type.name} title={zap.trigger.type.name} />
                {sortedActions.length > 0 && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-gray-300 flex-shrink-0">
                        <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                )}
                {sortedActions.map((x) => (
                    <img key={x.id} src={x.type.image} className="w-8 h-8 rounded-full border border-gray-200 object-cover shadow-sm" alt={x.type.name} title={x.type.name} />
                ))}
            </div>

            <div className="col-span-2 font-mono text-xs text-gray-400 truncate pr-4">{zap.id}</div>
            <div className="col-span-2 text-sm text-gray-400">Nov 13, 2023</div>

            <div className="col-span-3 flex items-center gap-2">
                <code className="text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-md px-2 py-1 truncate max-w-[150px] font-mono">
                    .../{zap.id}
                </code>
                <CopyButton text={webhookUrl} />
            </div>

            <div className="col-span-2 flex items-center justify-end gap-2">
                <DeleteButton zapId={zap.id} onDeleted={onDeleted} />
                <div className="w-6 h-6 rounded-full bg-gray-100 group-hover:bg-orange-100 flex items-center justify-center transition-colors flex-shrink-0">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-gray-400 group-hover:text-orange-500 transition-colors">
                        <path d="M2 5h6M5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
            </div>
        </div>
    );
}

function ZapTable({ zaps, onDeleted }: { zaps: Zap[]; onDeleted: (id: string) => void }) {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-12 px-6 py-3 bg-gray-50/80 border-b border-gray-100 text-xs uppercase tracking-widest text-gray-400 font-semibold">
                <div className="col-span-3">Flow</div>
                <div className="col-span-2">ID</div>
                <div className="col-span-2">Created</div>
                <div className="col-span-3">Webhook</div>
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
            <div className="max-w-screen-lg mx-auto px-6 pt-28 pb-16">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Zaps</h1>
                        {!loading && (
                            <p className="text-sm text-gray-400 mt-0.5">
                                {zaps.length} automation{zaps.length !== 1 ? "s" : ""}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={() => router.push("/zap/create")}
                        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-orange-100"
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M7 1v12M1 7h12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        Create Zap
                    </button>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="grid grid-cols-12 px-6 py-3 bg-gray-50/80 border-b border-gray-100 text-xs uppercase tracking-widest text-gray-400 font-semibold">
                            <div className="col-span-3">Flow</div>
                            <div className="col-span-2">ID</div>
                            <div className="col-span-2">Created</div>
                            <div className="col-span-3">Webhook</div>
                            <div className="col-span-2" />
                        </div>
                        {[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}
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