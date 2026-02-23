// import { Appbar } from "@repo/ui/Appbar";
// import { Hero } from "@repo/ui/Hero";
// import { HeroVideo } from "@repo/ui/HeroVideo"
// import Appbar from "@repo/ui/appbar"
import { Appbar } from "@repo/ui/appbar"
import { Hero } from "@repo/ui/hero";
import { HeroVideo } from "@repo/ui/herovideo";

export default function Home() {
  return (
    <main className="pb-48">
      <div className="font-bold text-6xl">Zapier</div>

      <div className="bg-red-500 text-white p-10">
        Test Tailwind
      </div>
      <Appbar />
      <Hero />
      <div className="pt-8">
        <HeroVideo />
      </div>
    </main>
  );
}

