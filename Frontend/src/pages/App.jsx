import Create from "./Create";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function App() {
  return (
      <div className="min-h-screen bg-slate-50 text-slate-900">

        {/* Navbar */}
        <header className="border-b bg-white">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <h1 className="text-xl font-bold">
              ResuMate
            </h1>

            <div className="flex gap-3">
              <Button variant="ghost">Login</Button>
              <Button>Get Started</Button>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h2 className="text-5xl font-bold leading-tight">
            Build ATS-Friendly Resumes
            <span className="block text-slate-500">
            with AI in Minutes
          </span>
          </h2>

          <p className="mt-6 text-slate-600 max-w-2xl mx-auto">
            Generate professional resumes, edit instantly,
            preview live, and download polished PDFs.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg">Create Resume</Button>
            <Button variant="outline" size="lg">
              View Templates
            </Button>
          </div>
        </section>

        {/* Builder */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <Card className="rounded-3xl shadow-xl border-0">
            <CardContent className="p-6 md:p-10">
              <Create />
            </CardContent>
          </Card>
        </section>

      </div>
  );
}