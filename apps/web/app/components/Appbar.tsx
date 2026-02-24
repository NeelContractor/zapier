"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const Appbar = () => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // localStorage is only available in the browser
        setIsLoggedIn(!!localStorage.getItem("token"));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        router.push("/");
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
            <div className="flex items-center cursor-pointer" onClick={() => router.push("/")}>
                <span className="text-orange-500 font-bold text-xl">_</span>
                <span className="text-white font-bold text-3xl tracking-tight">zapier</span>
            </div>

            <div className="flex items-center gap-6">
                <button className="text-sm text-white/50 hover:text-white transition-colors">
                    Contact Sales
                </button>

                {isLoggedIn ? (
                    <>
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="text-sm text-white/50 hover:text-white transition-colors"
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={handleLogout}
                            className="text-sm bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => router.push("/login")}
                            className="text-sm text-white/50 hover:text-white transition-colors"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => router.push("/signup")}
                            className="text-sm bg-orange-500 hover:bg-orange-400 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                        >
                            Sign up free
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};