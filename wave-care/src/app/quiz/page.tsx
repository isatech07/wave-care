"use client"

import { useState } from "react"
import Link from "next/link"
import "./quiz.css"

const perguntas = [
  {
    id: 1,
    pergunta: "Como sua pele costuma ficar ao longo do dia?",
    opcoes: [
      { texto: "Oleosa, brilhosa", valor: "oleosa" },
      { texto: "Seca, com tensão", valor: "seca" },
      { texto: "Mista — oleosa no T e seca nas bochechas", valor: "mista" },
      { texto: "Sensível, costumo ter vermelhidões", valor: "sensivel" },
    ],
  },
  {
    id: 2,
    pergunta: "Qual estação mais incomoda sua pele?",
    opcoes: [
      { texto: "Verão — o calor aumenta a oleosidade", valor: "verao" },
      { texto: "Inverno — resseca muito", valor: "inverno" },
      { texto: "Outono — a transição me prejudica", valor: "outono" },
      { texto: "Primavera — alergias e sensibilidade", valor: "primavera" },
    ],
  },
  {
    id: 3,
    pergunta: "Qual é sua maior preocupação com a pele?",
    opcoes: [
      { texto: "Manchas e tom irregular", valor: "manchas" },
      { texto: "Rugas e firmeza", valor: "envelhecimento" },
      { texto: "Poros dilatados", valor: "poros" },
      { texto: "Vermelhidão e irritações", valor: "sensibilidade" },
    ],
  },
]

export default function QuizPage() {
  const [passo, setPasso] = useState(0)
  const [respostas, setRespostas] = useState<string[]>([])
  const [concluido, setConcluido] = useState(false)

  function responder(valor: string) {
    const novas = [...respostas, valor]
    setRespostas(novas)
    if (passo + 1 < perguntas.length) {
      setPasso(passo + 1)
    } else {
      setConcluido(true)
    }
  }

  if (concluido) {
    return (
      <main className="quiz-main">
        <div className="quiz-resultado">
          <span className="quiz-resultado__icon">✦</span>
          <h2 className="quiz-resultado__title">Seu perfil de pele está pronto!</h2>
          <p className="quiz-resultado__desc">
            Com base nas suas respostas, montamos uma rotina personalizada e produtos ideais para você.
          </p>
          <Link href="/loja" className="quiz-resultado__cta">
            Ver produtos recomendados →
          </Link>
          <button
            className="quiz-resultado__refazer"
            onClick={() => { setPasso(0); setRespostas([]); setConcluido(false) }}
          >
            Refazer quiz
          </button>
        </div>
      </main>
    )
  }

  const perguntaAtual = perguntas[passo]
  const progresso = ((passo) / perguntas.length) * 100

  return (
    <main className="quiz-main">
      <div className="quiz-wrapper">
        <div className="quiz-progress-bar">
          <div className="quiz-progress-fill" style={{ width: `${progresso}%` }} />
        </div>

        <div className="quiz-header">
          <span className="quiz-step">{passo + 1} / {perguntas.length}</span>
          <h1 className="quiz-title">Descubra sua rotina ideal</h1>
        </div>

        <div className="quiz-pergunta-card">
          <p className="quiz-pergunta">{perguntaAtual.pergunta}</p>
          <div className="quiz-opcoes">
            {perguntaAtual.opcoes.map((op) => (
              <button
                key={op.valor}
                className="quiz-opcao"
                onClick={() => responder(op.valor)}
              >
                {op.texto}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}