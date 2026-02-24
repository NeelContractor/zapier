"use client";
import { Appbar } from "../components/Appbar";
import { CheckFeature } from "../components/CheckFeature";
import { Input } from "../components/Input";
import { PrimaryButton } from "../components/buttons/PrimaryButton";
import axios from "axios";
import { useState } from "react";
import { BACKEND_URL } from "../config";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <Appbar />
            <div className="flex justify-center items-start pt-24 px-4 pb-16">
                <div className="flex w-full max-w-4xl gap-16">
                    {/* Left: Value prop */}
                    <div className="flex-1 pt-10 hidden md:block">
                        <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-full px-3 py-1 mb-6">
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                            <span className="text-xs font-semibold text-orange-600 uppercase tracking-wide">Free to start</span>
                        </div>
                        <h1 className="font-bold text-3xl text-gray-900 leading-snug mb-8">
                            Join millions who automate their work using Zapier.
                        </h1>
                        <div className="flex flex-col gap-4">
                            <CheckFeature label="Easy setup, no coding required" />
                            <CheckFeature label="Free forever for core features" />
                            <CheckFeature label="14-day trial of premium features & apps" />
                        </div>

                        <div className="mt-12 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">Z</div>
                                <div>
                                    <div className="text-xs font-semibold text-gray-800">Zapier user</div>
                                    <div className="text-xs text-gray-400">Saved 10 hrs/week</div>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 italic">"Setting up my first Zap took 5 minutes. Now it runs every day automatically."</p>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="flex-1">
                        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-1">Create your account</h2>
                            <p className="text-sm text-gray-400 mb-6">
                                Already have an account?{" "}
                                <button onClick={() => router.push("/login")} className="text-orange-500 hover:underline font-medium">
                                    Log in
                                </button>
                            </p>

                            <div className="flex flex-col gap-4">
                                <Input label="Name" onChange={e => setName(e.target.value)} type="text" placeholder="Your name" />
                                <Input label="Email" onChange={e => setEmail(e.target.value)} type="text" placeholder="you@example.com" />
                                <Input label="Password" onChange={e => setPassword(e.target.value)} type="password" placeholder="Min. 8 characters" />
                            </div>

                            <div className="mt-6">
                                <PrimaryButton onClick={async () => {
                                    setLoading(true);
                                    try {
                                        await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
                                            username: email,
                                            password,
                                            name
                                        });
                                        router.push("/login");
                                    } finally {
                                        setLoading(false);
                                    }
                                }} size="big">
                                    {loading ? "Creating account..." : "Get started free"}
                                </PrimaryButton>
                            </div>

                            <p className="text-xs text-gray-400 text-center mt-4">
                                By signing up, you agree to our{" "}
                                <span className="underline cursor-pointer">Terms</span> and{" "}
                                <span className="underline cursor-pointer">Privacy Policy</span>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}