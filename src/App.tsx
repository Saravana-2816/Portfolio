import { ThemeProvider } from "@/hooks/useTheme"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { BackToTop } from "@/components/layout/BackToTop"
import { Hero } from "@/components/sections/Hero"
import { About } from "@/components/sections/About"
import { Experience } from "@/components/sections/Experience"
import { Projects } from "@/components/sections/Projects"
import { Skills } from "@/components/sections/Skills"
import { Education } from "@/components/sections/Education"
import { Connect } from "@/components/sections/Connect"

function App() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <Navbar />
        <main>
          <Hero />
          <About />
          <Experience />
          <Projects />
          <Skills />
          <Education />
          <Connect />
        </main>
        <Footer />
        <BackToTop />
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  )
}

export default App
