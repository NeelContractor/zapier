export const HeroVideo = () => {
    return (
        <section className="bg-[#0a0a0a] px-6 pb-32">
            <div className="max-w-5xl mx-auto">
                {/* Section label */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
                    <span className="text-xs uppercase tracking-widest text-white/30 font-semibold">
                        See it in action
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
                </div>

                {/* Video frame */}
                <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(249,115,22,0.08)]">
                    {/* Top bar chrome */}
                    <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/5">
                        <div className="w-3 h-3 rounded-full bg-white/10" />
                        <div className="w-3 h-3 rounded-full bg-white/10" />
                        <div className="w-3 h-3 rounded-full bg-white/10" />
                    </div>
                    <video
                        src="https://res.cloudinary.com/zapier-media/video/upload/f_auto,q_auto/v1706042175/Homepage%20ZAP%20Jan%2024/012324_Homepage_Hero1_1920x1080_pwkvu4.mp4"
                        className="w-full"
                        controls={false}
                        muted
                        autoPlay
                        loop
                        playsInline
                    />
                    {/* Bottom fade */}
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
                </div>
            </div>
        </section>
    );
};