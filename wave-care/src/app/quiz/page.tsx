"use client"

import { useState, useMemo, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import "./quiz.css"
import { useUser } from "@/contexts/UserContext"
import { apiSubmitQuiz, apiGetMyProfile, type QuizApiResult } from "@/lib/api"

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface Opcao {
  texto: string
  valor: string
  pontos: Record<string, number>
}

interface Pergunta {
  id: number
  categoria: string
  pergunta: string
  opcoes: Opcao[]
}

type EstacaoKey = "verao" | "outono" | "inverno" | "primavera"

interface EstadoSalvo {
  passo: number
  respostas: string[]
  pontos: Record<string, number>
  concluido: boolean
}

// ─── Perguntas ─────────────────────────────────────────────────────────────────
const PERGUNTAS: Pergunta[] = [
  {
    id: 1,
    categoria: "Ambiente",
    pergunta: "Como você descreveria o ambiente onde você vive ou passa mais tempo?",
    opcoes: [
      { texto: "Quente e úmido",  valor: "quente-umido", pontos: { umidade: 3 } },
      { texto: "Quente e seco",   valor: "quente-seco",  pontos: { ressecamento: 3 } },
      { texto: "Frio e úmido",    valor: "frio-umido",   pontos: { umidade: 2 } },
      { texto: "Frio e seco",     valor: "frio-seco",    pontos: { ressecamento: 2 } },
    ],
  },
  {
    id: 2,
    categoria: "Tipo de cabelo",
    pergunta: "Qual é o seu tipo de cabelo?",
    opcoes: [
      { texto: "Liso",     valor: "liso",     pontos: { liso: 3 } },
      { texto: "Ondulado", valor: "ondulado", pontos: { liso: 1, cacheado: 2 } },
      { texto: "Cacheado", valor: "cacheado", pontos: { cacheado: 3 } },
      { texto: "Crespo",   valor: "crespo",   pontos: { cacheado: 4 } },
    ],
  },
  {
    id: 3,
    categoria: "Exposição",
    pergunta: "Com que frequência seu cabelo fica exposto ao sol, vento ou umidade?",
    opcoes: [
      { texto: "Quase todo dia",           valor: "quase-todo-dia", pontos: { sol: 3, dano: 2 } },
      { texto: "Algumas vezes por semana", valor: "algumas-semana", pontos: { sol: 2 } },
      { texto: "Raramente",                valor: "raramente",      pontos: { sol: 1 } },
      { texto: "Quase nunca",              valor: "quase-nunca",    pontos: {} },
    ],
  },
  {
    id: 4,
    categoria: "Praia",
    pergunta: "Como seu cabelo fica após a praia?",
    opcoes: [
      { texto: "Ressecado e áspero", valor: "ressecado", pontos: { hidratacao: 3 } },
      { texto: "Com muito frizz",    valor: "frizz",     pontos: { nutricao: 2 } },
      { texto: "Opaco e sem brilho", valor: "opaco",     pontos: { nutricao: 3 } },
      { texto: "Fica normal",        valor: "normal",    pontos: { manutencao: 2 } },
    ],
  },
  {
    id: 5,
    categoria: "Cuidados",
    pergunta: "Você lava o cabelo após entrar no mar?",
    opcoes: [
      { texto: "Sempre",             valor: "sempre",   pontos: { manutencao: 2 } },
      { texto: "Às vezes",           valor: "as-vezes", pontos: { sal: 2 } },
      { texto: "Raramente",          valor: "raramente",pontos: { sal: 3, ressecamento: 2 } },
      { texto: "Nunca pensei nisso", valor: "nunca",    pontos: { sal: 4, ressecamento: 3 } },
    ],
  },
  {
    id: 6,
    categoria: "Condição atual",
    pergunta: "Qual a condição atual do seu cabelo?",
    opcoes: [
      { texto: "Seco e quebradiço", valor: "seco",      pontos: { hidratacao: 3, reconstrucao: 2 } },
      { texto: "Oleoso na raiz",    valor: "misto",     pontos: { equilibrar: 2 } },
      { texto: "Com pontas duplas", valor: "danificado",pontos: { reconstrucao: 3 } },
      { texto: "Saudável",          valor: "saudavel",  pontos: { manutencao: 3 } },
    ],
  },
  {
    id: 7,
    categoria: "Química",
    pergunta: "Faz algum tratamento químico?",
    opcoes: [
      { texto: "Coloração",   valor: "coloracao",   pontos: { reconstrucao: 2 } },
      { texto: "Progressiva", valor: "progressiva", pontos: { hidratacao: 2 } },
      { texto: "Descoloração",valor: "descoloracao",pontos: { reconstrucao: 4, dano: 3 } },
      { texto: "Nenhum",      valor: "natural",     pontos: { manutencao: 2 } },
    ],
  },
  {
    id: 8,
    categoria: "Principal queixa",
    pergunta: "Qual sua principal queixa?",
    opcoes: [
      { texto: "Falta de hidratação", valor: "hidratacao", pontos: { hidratacao: 4 } },
      { texto: "Frizz",               valor: "frizz",      pontos: { nutricao: 3 } },
      { texto: "Falta de definição",  valor: "definicao",  pontos: { definicao: 3 } },
      { texto: "Queda ou quebra",     valor: "queda",      pontos: { reconstrucao: 4 } },
    ],
  },
  {
    id: 9,
    categoria: "Estação Atual",
    pergunta: "Em qual estação do ano estamos agora?",
    opcoes: [
      { texto: "Verão",    valor: "verao",    pontos: { verao: 3 } },
      { texto: "Outono",   valor: "outono",   pontos: { outono: 3 } },
      { texto: "Inverno",  valor: "inverno",  pontos: { inverno: 3 } },
      { texto: "Primavera",valor: "primavera",pontos: { primavera: 3 } },
    ],
  },
  {
    id: 10,
    categoria: "Dificuldade",
    pergunta: "Qual estação do ano você acha mais difícil de cuidar do seu cabelo?",
    opcoes: [
      { texto: "Verão",    valor: "verao-dificil",    pontos: { sol: 2 } },
      { texto: "Outono",   valor: "outono-dificil",   pontos: { nutricao: 2 } },
      { texto: "Inverno",  valor: "inverno-dificil",  pontos: { hidratacao: 2 } },
      { texto: "Primavera",valor: "primavera-dificil",pontos: { frizz: 2 } },
    ],
  },
]

// ─── Dados por estação ─────────────────────────────────────────────────────────
const ESTACOES: Record<EstacaoKey, {
  nome: string; kitNome: string; kitImagem: string; tagline: string; bg: string
  produtos: { nome: string; descricao: string }[]
  blogLinks: { titulo: string; link: string }[]
}> = {
  verao: {
    nome: "Verão", bg: "#FFF6EE",
    kitNome: "Summer Protection",
    kitImagem: "/products/verao-produtos/verao-kit-completo.png",
    tagline: "Proteção total contra sol e sal",
    produtos: [
      { nome: "Shampoo Summer Protection", descricao: "Remove sal e cloro sem agredir os fios" },
      { nome: "Condicionador Summer",       descricao: "Desembaraço com filtro UV integrado" },
      { nome: "Máscara de Hidratação",      descricao: "Recupera fios castigados pelo sol" },
      { nome: "Leave-in Summer",            descricao: "Escudo térmico e solar para o dia" },
    ],
    blogLinks: [
      { titulo: "Como proteger o cabelo no verão do litoral norte", link: "/blog/cabelo-verao-litoral" },
      { titulo: "Rotina pós-praia: o que fazer depois do mar",      link: "/blog/rotina-pos-praia" },
      { titulo: "Sal marinho e frizz: entenda a relação",           link: "/blog/sal-marinho-frizz" },
    ],
  },
  outono: {
    nome: "Outono", bg: "#F6F2E8",
    kitNome: "Autumn Bloom",
    kitImagem: "/products/outono-produtos/Autumn-kit-completo.png",
    tagline: "Nutrição para a transição de estação",
    produtos: [
      { nome: "Shampoo Autumn Bloom", descricao: "Limpeza nutritiva para o outono" },
      { nome: "Condicionador Autumn",  descricao: "Nutre e desembaraça com leveza" },
      { nome: "Hair Mask Autumn",      descricao: "Reconstrução e fortalecimento profundo" },
      { nome: "Oil Autumn Bloom",      descricao: "Sela cutículas e dá brilho intenso" },
    ],
    blogLinks: [
      { titulo: "Cabelo no outono: como preparar seus fios para a transição", link: "/blog/cabelo-outono-litoral" },
      { titulo: "Nutrição capilar: por onde começar",                          link: "/blog/nutricao-capilar" },
      { titulo: "Óleos capilares: qual usar em cada estação",                  link: "/blog/oleos-capilares-estacoes" },
    ],
  },
  inverno: {
    nome: "Inverno", bg: "#EEF3FA",
    kitNome: "Winter Complete",
    kitImagem: "/products/inverno-produtos/inverno-kitcompleto.png",
    tagline: "Hidratação profunda contra o frio",
    produtos: [
      { nome: "Shampoo Winter Complete", descricao: "Limpeza hidratante para dias frios" },
      { nome: "Condicionador Winter",     descricao: "Hidratação intensa anti-ressecamento" },
      { nome: "Máscara Winter",           descricao: "Tratamento profundo para o inverno litorâneo" },
      { nome: "Oil Winter Complete",      descricao: "Óleo selador de proteção total" },
    ],
    blogLinks: [
      { titulo: "Inverno no litoral: por que o cabelo resseca mesmo com umidade?", link: "/blog/cabelo-inverno-litoral" },
      { titulo: "Cronograma capilar para o inverno",                               link: "/blog/cronograma-inverno" },
      { titulo: "Hidratação vs. nutrição: qual a diferença?",                      link: "/blog/hidratacao-vs-nutricao" },
    ],
  },
  primavera: {
    nome: "Primavera", bg: "#FBF0F5",
    kitNome: "Primavera Bloom",
    kitImagem: "/products/primavera-produtos/primavera-kit-completo.png",
    tagline: "Leveza e definição para os cachos",
    produtos: [
      { nome: "Shampoo Primavera Bloom", descricao: "Limpeza leve e revigorante" },
      { nome: "Leave-in Cream",           descricao: "Hidratação diária com proteção" },
      { nome: "Styling Gelatin",          descricao: "Definição natural para cachos e ondas" },
      { nome: "Hair Oil Bloom",           descricao: "Brilho e finalização perfeita" },
    ],
    blogLinks: [
      { titulo: "Primavera no litoral: como controlar o frizz com calor e umidade", link: "/blog/cabelo-primavera-litoral" },
      { titulo: "Definição de cachos: guia completo para o litoral",                 link: "/blog/definicao-cachos-litoral" },
      { titulo: "Leave-in: como e quando usar",                                      link: "/blog/como-usar-leave-in" },
    ],
  },
}

const CIDADES: Record<string, string> = {
  caraguatatuba: "Caraguatatuba",
  "sao-sebastiao": "São Sebastião",
  ilhabela: "Ilhabela",
  ubatuba: "Ubatuba",
}

// Labels legíveis para o diagnóstico vindo do back
const DIAGNOSIS_LABELS: Record<string, string> = {
  hydration:      "Hidratação intensiva",
  reconstruction: "Reconstrução capilar",
  nutrition:      "Nutrição profunda",
  maintenance:    "Manutenção preventiva",
}

const STORAGE_KEY = "wavecare_quiz_v1"

// ─── Monta payload para o backend ─────────────────────────────────────────────
// Índices das respostas:
// 0=ambiente, 1=hairType, 2=beachFrequency, 3=sunProtection,
// 4=wetHair,  5=hairState, 6=chemicalProcess, 7=queixa, 8=season, 9=dificuldade
function montarPayload(respostas: string[], cidade: string) {
  return {
    city:            cidade || "caraguatatuba",
    hairType:        respostas[1] ?? "",
    beachFrequency:  respostas[2] ?? "",
    sunProtection:   respostas[3] ?? "",
    wetHair:         respostas[4] ?? "",
    hairState:       respostas[5] ?? "",
    chemicalProcess: respostas[6] ?? "",
    season:          respostas[8] ?? "verao",
  }
}

// ─── Lógica de resultado (frontend) ───────────────────────────────────────────
function calcularResultado(respostas: string[], pontos: Record<string, number>) {
  const estacao    = (respostas[8] ?? "verao") as EstacaoKey
  const condicao   = respostas[5]
  const cidade     = respostas[0]
  const frequencia = respostas[2]
  const tipoCabelo = respostas[1]

  const necessidades: string[] = []
  if (pontos.hidratacao   >= 2) necessidades.push("Hidratação intensiva")
  if (pontos.nutricao     >= 2) necessidades.push("Nutrição profunda")
  if (pontos.reconstrucao >= 2) necessidades.push("Reconstrução capilar")
  if (pontos.ressecamento >= 2) necessidades.push("Anti-ressecamento")
  if (pontos.sal          >= 2) necessidades.push("Proteção contra sal marinho")
  if (pontos.sol          >= 2) necessidades.push("Proteção solar capilar")
  if (pontos.cloro        >= 2) necessidades.push("Remoção de cloro")
  if (necessidades.length === 0) necessidades.push("Manutenção e prevenção")

  const titulos: Record<string, string> = {
    seco:      "Seu cabelo precisa de hidratação urgente",
    danificado:"Foco em reconstrução e fortalecimento",
    misto:     "Seu cabelo pede nutrição de verdade",
    saudavel:  "Continue com a rotina — e evolua",
  }
  const descricoes: Record<string, string> = {
    seco:      `Morando em ${CIDADES[cidade] ?? "sua cidade"} e indo à praia ${frequencia === "quase-todo-dia" ? "quase todo dia" : "regularmente"}, o sol e o sal estão ressecando seus fios. Com a rotina certa, a vitalidade volta rapidamente.`,
    danificado:"Sol, sal e química enfraqueceram a estrutura dos fios. É hora de reconstruir de dentro pra fora e devolver a força que seu cabelo merece.",
    misto:     "O clima litorâneo remove os óleos naturais dos fios, deixando-os sem brilho. Nutrição profunda vai trazer o viço de volta.",
    saudavel:  "Seu cabelo está bem cuidado! Morar no litoral exige atenção constante. Vamos potencializar o que já funciona para manter a saúde dos fios o ano todo.",
  }

  return {
    titulo:      titulos[condicao]    ?? titulos.saudavel,
    descricao:   descricoes[condicao] ?? descricoes.saudavel,
    necessidades,
    estacao,
    tipoCabelo,
    cidade,
    frequencia,
    condicao,
  }
}

// ─── Componente principal ──────────────────────────────────────────────────────
export default function QuizCapilar() {
  const { user, isLoggedIn, updateCapilar } = useUser()

  const [passo,       setPasso]       = useState(-1)
  const [respostas,   setRespostas]   = useState<string[]>([])
  const [pontos,      setPontos]      = useState<Record<string, number>>({})
  const [concluido,   setConcluido]   = useState(false)
  const [saindo,      setSaindo]      = useState(false)
  const [opcaoSel,    setOpcaoSel]    = useState<string | null>(null)
  const [resVisible,  setResVisible]  = useState(false)
  const [temSalvo,    setTemSalvo]    = useState(false)
  const [savedPerfil, setSavedPerfil] = useState(false)

  // Resultado do backend (diagnosis + recommendedKit)
  const [backResult, setBackResult] = useState<QuizApiResult | null>(null)

  // ── resultado (useMemo) ───────────────────────────────────────────────────
  const resultado = useMemo(() => {
    if (!concluido || respostas.length < 9) return null
    return calcularResultado(respostas, pontos)
  }, [concluido, respostas, pontos])

  // ── Carrega localStorage ──────────────────────────────────────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const s: EstadoSalvo = JSON.parse(raw)
      setTemSalvo(true)
      if (s.concluido) {
        setPasso(s.passo); setRespostas(s.respostas)
        setPontos(s.pontos); setConcluido(true)
      }
    } catch { /* ignora */ }
  }, [])

  // ── Persiste no localStorage ──────────────────────────────────────────────
  useEffect(() => {
    if (passo === -1) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ passo, respostas, pontos, concluido }))
  }, [passo, respostas, pontos, concluido])

  useEffect(() => {
    if (!concluido) return
    const t = setTimeout(() => setResVisible(true), 80)
    return () => clearTimeout(t)
  }, [concluido])

  useEffect(() => {
    if (!concluido || respostas.length < 9) return
    const jaEnviado = localStorage.getItem("wavecare_quiz_enviado")
    if (jaEnviado === "true") return
    localStorage.setItem("wavecare_quiz_enviado", "true")
    const cidade = user?.cidade ?? ""
    const payload = montarPayload(respostas, cidade)
    apiSubmitQuiz(payload)
      .then(result => setBackResult(result))
      .catch(err => console.error("Erro ao enviar quiz:", err))
  }, [concluido]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Salva no perfil ───────────────────────────────────────────────────────
  const salvarNoPerfil = useCallback(() => {
    if (!resultado || !isLoggedIn) return

    // O POST /quiz já salvou no banco ao concluir.
    // Aqui apenas atualiza o contexto local com os dados já retornados.
    updateCapilar({
      tipo:            resultado.tipoCabelo,
      preocupacao:     resultado.condicao,
      frequenciaPreia: resultado.frequencia,
      estacaoCritica:  resultado.estacao,
      diagnosis:       backResult?.diagnosis,
      recommendedKit:  backResult?.recommendedKit,
    })
    setSavedPerfil(true)

    // Confirma com o banco (garante consistência para o mobile também)
    apiGetMyProfile()
      .then(profile => {
        if (profile?.capilar) updateCapilar(profile.capilar)
      })
      .catch(() => {/* silencioso — o contexto local já foi atualizado */})
  }, [resultado, isLoggedIn, updateCapilar, backResult])

  // ── Transição animada ─────────────────────────────────────────────────────
  const transitar = useCallback((fn: () => void) => {
    setSaindo(true)
    setTimeout(() => { fn(); setSaindo(false); setOpcaoSel(null) }, 320)
  }, [])

  // ── Handlers ──────────────────────────────────────────────────────────────
  function continuarSalvo() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const s: EstadoSalvo = JSON.parse(raw)
      setRespostas(s.respostas); setPontos(s.pontos)
      transitar(() => setPasso(s.passo))
    } catch { /* ignora */ }
  }

  function iniciar() {
    localStorage.removeItem(STORAGE_KEY)
    setTemSalvo(false)
    transitar(() => setPasso(0))
  }

  function responder(valor: string, pts: Record<string, number>) {
    if (opcaoSel) return
    setOpcaoSel(valor)
    setTimeout(() => {
      const nr = [...respostas, valor]
      const np = { ...pontos }
      Object.entries(pts).forEach(([k, v]) => { np[k] = (np[k] ?? 0) + v })
      setRespostas(nr)
      setPontos(np)
      transitar(() => {
        if (passo + 1 < PERGUNTAS.length) setPasso(passo + 1)
        else setConcluido(true)
      })
    }, 300)
  }

  function voltar() {
    if (passo <= 0) return
    transitar(() => { setRespostas(respostas.slice(0, -1)); setPasso(passo - 1) })
  }

  function reiniciar() {
    setResVisible(false); setSavedPerfil(false); setBackResult(null)
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem("wavecare_quiz_enviado") // ← adiciona essa linha
    setTimeout(() => {
      setPasso(-1); setRespostas([]); setPontos({})
      setConcluido(false); setOpcaoSel(null); setTemSalvo(false)
    }, 400)
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TELA DE RESULTADO
  // ══════════════════════════════════════════════════════════════════════════
  if (concluido && resultado) {
    const est = ESTACOES[resultado.estacao]

    return (
      <main
        className={`res-page est-${resultado.estacao} ${resVisible ? "res-page--visible" : ""}`}
        style={{ backgroundColor: est.bg }}
      >
        <div className="res-blob res-blob--1" />
        <div className="res-blob res-blob--2" />

        <div className="res-inner">
          <nav className="res-nav" />

          <section className="res-hero">
            <span className="res-label">Diagnóstico capilar</span>
            <h1 className="res-titulo">{resultado.titulo}</h1>
            <p className="res-desc">{resultado.descricao}</p>

            {/* Badge com diagnóstico do backend */}
            {backResult?.diagnosis && (
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                marginTop: "0.75rem", padding: "0.35rem 0.9rem",
                borderRadius: "20px", background: "rgba(45,106,90,0.1)",
                fontSize: "0.78rem", fontWeight: 600, color: "#2d6a5a",
              }}>
                🔬 Diagnóstico: {DIAGNOSIS_LABELS[backResult.diagnosis] ?? backResult.diagnosis}
              </div>
            )}
          </section>

          <div className="res-tags">
            {resultado.necessidades.map((n, i) => (
              <span key={i} className="res-tag">{n}</span>
            ))}
          </div>

          <section className="res-kit">
            <Image
              src={est.kitImagem}
              alt={`Kit ${est.kitNome}`}
              width={220} height={220}
              className="res-kit-img"
            />
            <div className="res-kit-info">
              <span className="res-kit-label">Kit recomendado · {est.nome}</span>
              <h2 className="res-kit-nome">Kit {est.kitNome}</h2>
              {/* Se o back retornou um kit específico, mostra abaixo */}
              {backResult?.recommendedKit && (
                <p style={{ fontSize: "0.78rem", color: "#6b7280", marginBottom: "0.25rem" }}>
                  Kit personalizado: <strong>{backResult.recommendedKit}</strong>
                </p>
              )}
              <p className="res-kit-tagline">{est.tagline}</p>
              <ul className="res-kit-lista">
                {est.produtos.map((p, i) => (
                  <li key={i}>
                    <strong>{p.nome}</strong>
                    <span>{p.descricao}</span>
                  </li>
                ))}
              </ul>
              <Link href={`/loja?kit=${resultado.estacao}`} className="res-cta">
                Comprar Kit {est.kitNome} →
              </Link>
            </div>
          </section>

          <section className="res-blog">
            <div className="res-blog-header">
              <span className="res-blog-pre">Do nosso blog</span>
              <h3>Leituras recomendadas para você</h3>
            </div>
            <div className="res-blog-links">
              {est.blogLinks.map((b, i) => (
                <Link key={i} href={b.link} className="res-blog-link">
                  <span>{b.titulo}</span>
                  <span>→</span>
                </Link>
              ))}
            </div>
          </section>

          <div className="res-save-banner">
            {isLoggedIn ? (
              <>
                <div className="res-save-banner-text">
                  <p>Salvar diagnóstico no perfil</p>
                  <span>
                    {savedPerfil
                      ? "Salvo! Acesse em Perfil › Perfil Capilar."
                      : `Olá, ${user?.nome ? user.nome.split(" ")[0] : "usuário"}! Salve seu resultado para acompanhar na sua conta.`}
                  </span>
                </div>
                <button
                  onClick={salvarNoPerfil}
                  disabled={savedPerfil}
                  className={`res-save-btn ${savedPerfil ? "res-save-btn--saved" : ""}`}
                >
                  {savedPerfil ? "Salvo!" : "Salvar no perfil"}
                </button>
              </>
            ) : (
              <>
                <div className="res-save-banner-text">
                  <p>Crie uma conta para salvar seu diagnóstico</p>
                  <span>Entre ou crie uma conta para salvar seu resultado e acompanhar seu perfil capilar.</span>
                </div>
                <a href="/auth" className="res-save-btn">Criar conta / Entrar</a>
              </>
            )}
          </div>

          <div className="res-actions">
            <button onClick={reiniciar} className="res-btn-ghost">← Refazer quiz</button>
            <Link href="/loja"  className="res-btn-ghost">Ver todos os kits →</Link>
            <Link href="/blog"  className="res-btn-ghost">Blog capilar →</Link>
          </div>
        </div>
      </main>
    )
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TELA DO QUIZ (início + perguntas)
  // ══════════════════════════════════════════════════════════════════════════
  const perguntaAtual = passo >= 0 ? PERGUNTAS[passo] : null
  const progresso     = passo < 0 ? 0 : (passo / PERGUNTAS.length) * 100

  return (
    <main className="quiz-page">
      <div className="quiz-bg" aria-hidden="true" />
      <div className="quiz-shell">
        <Link href="/" className="quiz-logo">Wave<em>Care</em></Link>

        {passo >= 0 && (
          <div className="quiz-progress">
            <div className="quiz-progress-fill" style={{ width: `${progresso}%` }} />
          </div>
        )}

        <div className={`quiz-card ${saindo ? "quiz-card-exit" : "quiz-card-enter"}`}>
          {passo === -1 && (
            <div className="quiz-start">
              <span className="quiz-start-eyebrow">Quiz Capilar</span>
              <h1 className="quiz-start-title">
                Descubra o que seu cabelo
                <em> precisa no litoral norte</em>
              </h1>
              <div className="quiz-start-divider" />
              <p className="quiz-start-sub">
                10 perguntas. Diagnóstico personalizado.
                Kit ideal para a sua estação do ano.
              </p>
              <div className="quiz-start-pills">
                <span>Sol e sal marinho</span>
                <span>Tipo de fio</span>
                <span>Estado atual</span>
                <span>Estação</span>
              </div>
              <button onClick={iniciar} className="quiz-start-cta">
                Começar diagnóstico →
              </button>
              <p className="quiz-start-hint">
                Caraguatatuba · São Sebastião · Ilhabela · Ubatuba
              </p>
            </div>
          )}

          {perguntaAtual && (
            <div className="quiz-pergunta">
              <div className="quiz-meta">
                <span className="quiz-categoria">{perguntaAtual.categoria}</span>
                <span className="quiz-counter">{passo + 1} / {PERGUNTAS.length}</span>
              </div>
              <h2 className="quiz-texto">{perguntaAtual.pergunta}</h2>
              <div className="quiz-opcoes">
                {perguntaAtual.opcoes.map((op, i) => (
                  <button
                    key={op.valor}
                    onClick={() => responder(op.valor, op.pontos)}
                    className={`quiz-opcao ${opcaoSel === op.valor ? "quiz-opcao--selecionada" : ""}`}
                    style={{ animationDelay: `${i * 70}ms` }}
                    disabled={!!opcaoSel}
                  >
                    <span className="quiz-radio" />
                    <span className="quiz-opcao-texto">{op.texto}</span>
                    <span className="quiz-opcao-arrow">→</span>
                  </button>
                ))}
              </div>
              {passo > 0 && (
                <button onClick={voltar} className="quiz-voltar">← Voltar</button>
              )}
            </div>
          )}
        </div>

        {passo === -1 && temSalvo && (
          <div className="quiz-saved-banner">
            <div>
              <p>Você tem um quiz em andamento</p>
              <span>Continuar de onde parou ou começar do zero?</span>
            </div>
            <div className="quiz-saved-actions">
              <button onClick={continuarSalvo} className="quiz-saved-continue">Continuar</button>
              <button onClick={iniciar}        className="quiz-saved-reset">Reiniciar</button>
            </div>
          </div>
        )}

          {passo === 0 && !isLoggedIn && (
            <div className="quiz-login-banner">
              <div className="quiz-login-banner-text">
                <p>Entre para fazer o quiz</p>
                <span>É necessário ter uma conta para descobrir seu diagnóstico capilar.</span>
              </div>
              <Link href="/auth?redirect=/quiz" className="quiz-login-btn">
                Entrar →
              </Link>
            </div>
          )}
      </div>
    </main>
  )
}