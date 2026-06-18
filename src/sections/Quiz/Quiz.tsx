import "./quiz.css"
import { Sparkles } from "lucide-react"

export default function Quiz() {
  return (
    <section className="quiz-section" id="quiz">
      <div className="quiz-bg" />
      <div className="quiz-card">
        <div className="quiz-icon">
          <Sparkles size={22} strokeWidth={1.5} />
        </div>
        <h2>Descubra seu tipo de cabelo</h2>
        <p>
          Faça nosso quiz interativo e receba recomendações personalizadas para seus
          fios. Em apenas 5 perguntas, encontre a rotina capilar ideal para você.
        </p>
        <a href="/quiz" className="quiz-btn">Fazer o Quiz</a>
        <span className="quiz-social-proof">Mais de 10.000 diagnósticos realizados</span>
      </div>
    </section>
  )
}