"use client";

import { useRouter } from "next/navigation";

const features = [
    { title: "Free Forever", subtitle: "for core features" },
    { title: "7,000+ Apps", subtitle: "more than any other platform" },
    { title: "Cutting-Edge AI", subtitle: "built into every workflow" },
];

export const Hero = () => {
    const router = useRouter();

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden bg-[#0a0a0a]">
            {/* Glow background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-orange-600/5 rounded-full blur-[80px] pointer-events-none" />

            {/* Badge */}
            <div className="relative flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8 animate-fade-in">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                <span className="text-xs text-white/60 font-medium tracking-wide uppercase">
                    Now with AI-powered automation
                </span>
            </div>

            {/* Headline */}
            <h1 className="relative text-center font-black text-white leading-[1.05] tracking-tighter max-w-4xl mb-6"
                style={{ fontSize: "clamp(3rem, 8vw, 6rem)" }}>
                Automate as fast
                <br />
                <span className="text-orange-500">as you can type.</span>
            </h1>

            {/* Subheadline */}
            <p className="relative text-center text-white/50 text-lg max-w-xl mb-10 leading-relaxed">
                AI gives you automation superpowers, and Zapier puts them to work.
                Turn ideas into workflows that run while you sleep.
            </p>

            {/* CTAs */}
            <div className="relative flex items-center gap-3 mb-16">
                <button
                    onClick={() => router.push("/signup")}
                    className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-3.5 rounded-xl text-base transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(249,115,22,0.4)]"
                >
                    Get started free
                </button>
                <button className="border border-white/10 hover:border-white/20 text-white/70 hover:text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-all bg-white/5">
                    Contact Sales
                </button>
            </div>

            {/* Feature pills */}
            <div className="relative flex items-center gap-4 flex-wrap justify-center">
                {features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-full px-4 py-2">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M1.5 6L4.5 9L10.5 3" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="text-sm font-semibold text-white">{f.title}</span>
                        <span className="text-sm text-white/40">{f.subtitle}</span>
                    </div>
                ))}
            </div>
        </section>
    );
};