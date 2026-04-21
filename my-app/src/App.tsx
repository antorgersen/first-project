import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Rocket, Zap, Globe } from "lucide-react"

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-8 gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-zinc-900 mb-2">Min første app</h1>
        <p className="text-zinc-500 text-lg">Vite + React + Tailwind + shadcn/ui</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
        <Card>
          <CardHeader>
            <Rocket className="h-6 w-6 text-zinc-700 mb-1" />
            <CardTitle>Vite</CardTitle>
            <CardDescription>Lynrask build og HMR</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-600">Instant dev server start og hot module replacement.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Zap className="h-6 w-6 text-zinc-700 mb-1" />
            <CardTitle>Tailwind CSS</CardTitle>
            <CardDescription>Utility-first CSS</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-600">Stil direkte i markup — ingen CSS-filer å holde orden på.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Globe className="h-6 w-6 text-zinc-700 mb-1" />
            <CardTitle>shadcn/ui</CardTitle>
            <CardDescription>Ferdiglagde komponenter</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-600">Tilgjengelige UI-komponenter du eier og kan tilpasse.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Interaktiv demo</CardTitle>
          <CardDescription>Klikk på knappene nedenfor</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <span className="text-6xl font-bold text-zinc-900">{count}</span>
        </CardContent>
        <CardFooter className="flex gap-2 justify-center">
          <Button variant="outline" onClick={() => setCount(c => c - 1)}>−</Button>
          <Button onClick={() => setCount(0)} variant="secondary">Reset</Button>
          <Button onClick={() => setCount(c => c + 1)}>+</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default App
