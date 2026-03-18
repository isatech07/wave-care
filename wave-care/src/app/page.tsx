import { use } from "react"
import Seasons from "@/sections/Seasons/Seasons"
import Products from "@/sections/Products/Products"
import Quiz from "@/sections/Quiz/Quiz"
import Blog from "@/sections/Blog/Blog"
import Summer from "@/pages/Summer/Summer"
import Autumn from "@/pages/Autumn/Autumn"
import Winter from "@/pages/Winter/Winter"


interface HomeProps {
  searchParams: Promise<{ estacao?: string }>
}

export default function Home({ searchParams }: HomeProps) {
  const { estacao } = use(searchParams)

  if (estacao === "verao") {
    return (
      <main>
        <section className="estacao-section estacao-fade-in">
          <Summer />
        </section>
      </main>
    )
  }

  if (estacao === "outono") {
    return (
      <main>
        <section className="estacao-section estacao-fade-in">
          <Autumn />
        </section>
      </main>
    )
  }

    if (estacao === "inverno") {
    return (
      <main>
        <section className="estacao-section estacao-fade-in">
          <Winter />
        </section>
      </main>
    )
  }

  return (
    <main>
      <Seasons />
      <Products />
      <Quiz />
      <Blog />
    </main>
  )
}