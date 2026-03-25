"use client"

import { useState } from "react"
import Link from "next/link"
import "./quiz-avancado.css"

interface Pergunta {
  id: number
  categoria: string
  pergunta: string
  multi?: boolean
  opcoes: { texto: string; valor: string; emoji?: string }[]
}

const perguntas: Pergunta[] = [
  {
    id: 1,
    categoria: "Tipo de pele",
    pergunta: "Ao acordar, como está sua pele sem nenhum produto?",
    opcoes: [
      { texto: "Com brilho em todo o rosto", valor: "oleosa", emoji: "💧" },
      { texto: "Com sensação de tensão", valor: "seca", emoji: "🌵" },
      { texto: "Brilho no centro, seca nas laterais", valor: "mista", emoji: "⚖️" },
      { texto: "Normal, confortável", valor: "normal", emoji: "✨" },
    ],
  },
  {
    id: 2,
    categoria: "Rotina atual",
    pergunta: "Quais passos você já tem na sua rotina? (pode escolher mais de um)",
    multi: true,
    opcoes: [
      { texto: "Limpeza facial", valor: "limpeza", emoji: "🧼" },
      { texto: "Hidratante", valor: "hidratante", emoji: "🫙" },
      { texto: "Protetor solar", valor: "spf", emoji: "☀️" },
      { texto: "Sérum ou ativo", valor: "serum", emoji: "💊" },
    ],
  },
  {
    id: 3,
    categoria: "Preocupações",
    pergunta: "Qual é sua principal queixa?",
    opcoes: [
      { texto: "Manchas e hiperpigmentação", valor: "manchas", emoji: "🌑" },
      { texto: "Linhas de expressão", valor: "rugas", emoji: "〰️" },
      { texto: "Poros aparentes", valor: "poros", emoji: "🔍" },
      { texto: "Pele opaca, sem viço", valor: "opaca", emoji: "🌫️" },
    ],
  },
  {
    id: 4,
    categoria: "Estilo de vida",
    pergunta: "Como é sua exposição ao sol no dia a dia?",
    opcoes: [
      { texto: "Quase nunca fico ao sol", valor: "pouco", emoji: "🏠" },
      { texto: "Algumas horas por semana", valor: "moderado", emoji: "🚶" },
      { texto: "Diariamente, por horas", valor: "alto", emoji: "🏖️" },
      { texto: "Pratico esportes ao ar livre", valor: "esporte", emoji: "🏃" },
    ],
  },
]

const resultados: Record<string, { titulo: string; desc: string; estacao: string; param: string }> = {
  oleosa:  { titulo: "Pele Oleosa com Brilho", desc: "Sua pele produz bastante sebo. Foque em géis leves, ácido salicílico e FPS oil-free.", estacao: "Verão", param: "verao" },
  seca:    { titulo: "Pele Seca e Sedenta", desc: "Sua barreira cutânea precisa de reforço. Ceramidas, ácido hialurônico e óleos nutritivos são seus aliados.", estacao: "Inverno", param: "inverno" },
  mista:   { titulo: "Pele Mista", desc: "Equilíbrio é a chave. Produtos que hidratam sem pesar nas zonas T e tratam as bochechas sem ressecá-las.", estacao: "Outono", param: "outono" },
  normal:  { titulo: "Pele Normal Equilibrada", desc: "Você tem sorte! Mantenha a rotina simples e invista em prevenção — protetor solar todos os dias.", estacao: "Primavera", param: "primavera" },
  sensivel:{ titulo: "Pele Sensível", desc: "Menos é mais. Formulas mínimas, sem fragâncias e com ingredientes calmantes como centella e niacinamida.", estacao: "Primavera", param: "primavera" },
}

export default function QuizAvancadoPage() {
  const [passo, setPasso] = useState(0)
  const [respostas, setRespostas] = useState<(string | string[])[]>([])
  const [selecionados, setSelecionados] = useState<string[]>([])
  const [concluido, setConcluido] = useState(false)

  const perguntaAtual = perguntas[passo]
  const progresso = (passo / perguntas.length) * 100

  function toggleMulti(valor: string) {
    setSelecionados(prev =>
      prev.includes(valor) ? prev.filter(v => v !== valor) : [...prev, valor]
    )
  }

  function avancar() {
    const resposta = perguntaAtual.multi ? selecionados : ""
    if (!perguntaAtual.multi) return
    const novas = [...respostas, resposta]
    setRespostas(novas)
    setSelecionados([])
    if (passo + 1 < perguntas.length) {
      setPasso(passo + 1)
    } else {
      setConcluido(true)
    }
  }

  function responder(valor: string) {
    if (perguntaAtual.multi) return
    const novas = [...respostas, valor]
    setRespostas(novas)
    if (passo + 1 < perguntas.length) {
      setPasso(passo + 1)
    } else {
      setConcluido(true)
    }
  }

  if (concluido) {
    const tipoResposta = respostas[0] as string
    const resultado = resultados[tipoResposta] ?? resultados["normal"]
    return (
      <main className="qav-main">
        <div className="qav-resultado">
          <div className="qav-resultado__header">
            <span className="qav-resultado__eyebrow">Seu diagnóstico</span>
            <h2 className="qav-resultado__title">{resultado.titulo}</h2>
          </div>
          <p className="qav-resultado__desc">{resultado.desc}</p>
          <div className="qav-resultado__estacao">
            <span>Estação mais desafiadora para você:</span>
            <strong>{resultado.estacao}</strong>
          </div>
          <div className="qav-resultado__actions">
            <Link href={`/?estacao=${resultado.param}`} className="qav-resultado__cta-primary">
              Ver rotina para {resultado.estacao}
            </Link>
            <Link href="/loja" className="qav-resultado__cta-secondary">
              Produtos recomendados
            </Link>
          </div>
          <button
            className="qav-resultado__refazer"
            onClick={() => { setPasso(0); setRespostas([]); setConcluido(false) }}
          >
            Refazer diagnóstico
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="qav-main">
      <div className="qav-container">
        {/* Progress */}
        <div className="qav-progress">
          {perguntas.map((_, i) => (
            <div
              key={i}
              className={`qav-progress__dot ${i < passo ? "done" : i === passo ? "active" : ""}`}
            />
          ))}
        </div>

        <div className="qav-card">
          <span className="qav-card__cat">{perguntaAtual.categoria}</span>
          <h2 className="qav-card__pergunta">{perguntaAtual.pergunta}</h2>

          <div className={`qav-opcoes ${perguntaAtual.multi ? "qav-opcoes--grid" : ""}`}>
            {perguntaAtual.opcoes.map((op) => {
              const isActive = perguntaAtual.multi
                ? selecionados.includes(op.valor)
                : false
              return (
                <button
                  key={op.valor}
                  className={`qav-opcao ${isActive ? "qav-opcao--active" : ""}`}
                  onClick={() => perguntaAtual.multi ? toggleMulti(op.valor) : responder(op.valor)}
                >
                  {op.emoji && <span className="qav-opcao__emoji">{op.emoji}</span>}
                  {op.texto}
                </button>
              )
            })}
          </div>

          {perguntaAtual.multi && (
            <button
              className="qav-continuar"
              disabled={selecionados.length === 0}
              onClick={avancar}
            >
              Continuar →
            </button>
          )}
        </div>

        <p className="qav-step">{passo + 1} de {perguntas.length}</p>
      </div>
    </main>
  )
}