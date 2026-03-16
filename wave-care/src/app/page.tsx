import { use } from "react"
import Seasons from "@/sections/Seasons/Seasons"
import Products from "@/sections/Products/Products"
import Quiz from "@/sections/Quiz/Quiz"
import Blog from "@/sections/Blog/Blog"
import Summer from "@/pages/Summer/Summer"

interface HomeProps {
  searchParams: Promise<{ estacao?: string }>
}

export default function Home({ searchParams }: HomeProps) {
  const { estacao } = use(searchParams)

  return (
    <main>
      {estacao === "verao" ? (
        <section className="estacao-section estacao-fade-in">
          <Summer />
        </section>
      ) : (
        <>
          <Seasons />
          <Products />
          <Quiz />
          <Blog />
        </>
      )}
    </main>
  )
}