import Seasons from "@/sections/Seasons/Seasons"
import Products from "@/sections/Products/Products"
import Quiz from "@/sections/Quiz/Quiz"
import Blog from "@/sections/Blog/Blog"
import Summer from "@/pages/Summer/Summer"

export default function Home() {
  return (
    <main>
      <Seasons />
      <Products />
      <Quiz />
      <Blog />
      <Summer/>
    </main>
  )
}