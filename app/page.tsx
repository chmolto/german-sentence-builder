import SentenceBuilder from "@/components/sentence-builder"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-100 to-gray-200">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Deutsch Satzbildung</h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Baue deutsche Sätze mit den richtigen grammatikalischen Elementen
      </p>
      <SentenceBuilder />
    </main>
  )
}

