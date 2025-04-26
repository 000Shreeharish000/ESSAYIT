import Header from "@/components/header"
import HeroSection from "@/components/hero-section"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col cyberpunk-grid">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <HeroSection />
      </div>
    </main>
  )
}
