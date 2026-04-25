import { Header } from "@/components/common/Header";

export default function Home() {
  return (
    <div>
      <Header />
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 sm:items-start">
        <h1 className="text-6xl font-bold text-center">
          Welcome to <a href="https://career-ai.com" className="text-blue-600">Career AI</a>
        </h1>
      </main>
    </div>
  );
}
