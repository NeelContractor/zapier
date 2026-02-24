import { Appbar } from "./components/Appbar";
import { Hero } from "./components/Hero";
import { HeroVideo } from "./components/HeroVideo";

export default function Home() {
    return (
        <main className="bg-[#0a0a0a] min-h-screen">
            <Appbar />
            <Hero />
            <HeroVideo />
        </main>
    );
}