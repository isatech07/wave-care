"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import "./quiz.css"
import { useUser } from "@/contexts/UserContext"

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
    categoria: "Localização",
    pergunta: "Em qual cidade do litoral norte você mora?",
    opcoes: [
      { texto: "Caraguatatuba", valor: "caraguatatuba", pontos: { sol: 2, sal: 2, umidade: 2 } },
      { texto: "São Sebastião",  valor: "sao-sebastiao", pontos: { sol: 2, sal: 3, umidade: 2 } },
      { texto: "Ilhabela",       valor: "ilhabela",      pontos: { sol: 2, sal: 3, umidade: 3 } },
      { texto: "Ubatuba",        valor: "ubatuba",       pontos: { sol: 2, sal: 2, umidade: 3 } },
    ],
  },
  {
    id: 2,
    categoria: "Tipo de cabelo",
    pergunta: "Como são seus fios naturalmente?",
    opcoes: [
      { texto: "Liso",             valor: "liso",     pontos: { liso: 3 } },
      { texto: "Ondulado (2A–2C)", valor: "ondulado", pontos: { liso: 1, cacheado: 2 } },
      { texto: "Cacheado (3A–3C)", valor: "cacheado", pontos: { cacheado: 3 } },
      { texto: "Crespo (4A–4C)",   valor: "crespo",   pontos: { cacheado: 3 } },
    ],
  },
  {
    id: 3,
    categoria: "Rotina de praia",
    pergunta: "Com que frequência você vai à praia?",
    opcoes: [
      { texto: "Todo dia ou quase",     valor: "diario", pontos: { sol: 3, sal: 3 } },
      { texto: "Fins de semana",         valor: "fds",    pontos: { sol: 2, sal: 2 } },
      { texto: "Algumas vezes por mês", valor: "mensal", pontos: { sol: 1, sal: 1 } },
      { texto: "Raramente",             valor: "raro",   pontos: { sol: 0, sal: 0 } },
    ],
  },
  {
    id: 4,
    categoria: "Proteção solar",
    pergunta: "Como você protege o cabelo do sol?",
    opcoes: [
      { texto: "Nunca uso proteção",                valor: "nunca",    pontos: { ressecamento: 3, dano: 3 } },
      { texto: "Às vezes chapéu ou boné",           valor: "as-vezes", pontos: { ressecamento: 2, dano: 2 } },
      { texto: "Sempre uso protetor solar capilar", valor: "sempre",   pontos: { ressecamento: 1, dano: 1 } },
      { texto: "Evito exposição direta",            valor: "evita",    pontos: { ressecamento: 0, dano: 0 } },
    ],
  },
  {
    id: 5,
    categoria: "Água do mar",
    pergunta: "Na praia, você molha o cabelo?",
    opcoes: [
      { texto: "Sim, sempre mergulho", valor: "sempre",   pontos: { sal: 3, ressecamento: 2 } },
      { texto: "Às vezes molho",        valor: "as-vezes", pontos: { sal: 2, ressecamento: 1 } },
      { texto: "Só molho na piscina",   valor: "piscina",  pontos: { cloro: 3, ressecamento: 2 } },
      { texto: "Prefiro não molhar",    valor: "nao",      pontos: { sal: 0, ressecamento: 0 } },
    ],
  },
  {
    id: 6,
    categoria: "Estado atual",
    pergunta: "Como está seu cabelo hoje?",
    opcoes: [
      { texto: "Ressecado e com frizz",          valor: "ressecado",  pontos: { hidratacao: 3, nutricao: 2 } },
      { texto: "Quebradiço e sem vida",           valor: "quebradico", pontos: { reconstrucao: 3, nutricao: 2 } },
      { texto: "Opaco, sem brilho",               valor: "opaco",      pontos: { nutricao: 3, hidratacao: 2 } },
      { texto: "Saudável, precisa de manutenção", valor: "saudavel",   pontos: { manutencao: 3 } },
    ],
  },
  {
    id: 7,
    categoria: "Processos químicos",
    pergunta: "Seu cabelo tem processo químico?",
    opcoes: [
      { texto: "Coloração ou descoloração",  valor: "coloracao",  pontos: { reconstrucao: 3, dano: 2 } },
      { texto: "Alisamento ou relaxamento",  valor: "alisamento", pontos: { reconstrucao: 2, dano: 2 } },
      { texto: "Permanente ou texturização", valor: "permanente", pontos: { hidratacao: 2, dano: 1 } },
      { texto: "Natural, sem química",       valor: "natural",    pontos: { manutencao: 2 } },
    ],
  },
  {
    id: 8,
    categoria: "Estação",
    pergunta: "Qual estação estamos vivendo agora?",
    opcoes: [
      { texto: "Verão",     valor: "verao",     pontos: { verao: 3 } },
      { texto: "Outono",    valor: "outono",    pontos: { outono: 3 } },
      { texto: "Inverno",   valor: "inverno",   pontos: { inverno: 3 } },
      { texto: "Primavera", valor: "primavera", pontos: { primavera: 3 } },
    ],
  },
]

// ─── Dados por estação ─────────────────────────────────────────────────────────
const ESTACOES: Record<EstacaoKey, {
  nome: string
  kitNome: string
  kitImagem: string
  tagline: string
  bg: string
  produtos: { nome: string; descricao: string }[]
  blogLinks: { titulo: string; link: string }[]
}> = {
  verao: {
    nome: "Verão",
    bg: "#FFF6EE",
    kitNome: "Summer Protection",
    kitImagem: "/products/verao-produtos/Summer-Protection - kit.png",
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
    nome: "Outono",
    bg: "#F6F2E8",
    kitNome: "Autumn Bloom",
    kitImagem: "/products/outono-produtos/Autumn-Bloom-kit.png",
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
    nome: "Inverno",
    bg: "#EEF3FA",
    kitNome: "Winter Complete",
    kitImagem: "/products/inverno-produtos/inverno-kit-completo.png",
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
    nome: "Primavera",
    bg: "#FBF0F5",
    kitNome: "Primavera Bloom",
    kitImagem: "/products/primavera-produtos/bloom-kit-2.png",
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

const STORAGE_KEY = "wavecare_quiz_v1"

// ─── Lógica de resultado ───────────────────────────────────────────────────────
function calcularResultado(respostas: string[], pontos: Record<string, number>) {
  const estacao    = (respostas[7] ?? "verao") as EstacaoKey
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
    ressecado:  "Seu cabelo precisa de hidratação urgente",
    quebradico: "Foco em reconstrução e fortalecimento",
    opaco:      "Seu cabelo pede nutrição de verdade",
    saudavel:   "Continue com a rotina — e evolua",
  }
  const descricoes: Record<string, string> = {
    ressecado:  `Morando em ${CIDADES[cidade] ?? "sua cidade"} e indo à praia ${frequencia === "diario" ? "diariamente" : "regularmente"}, o sol e o sal estão ressecando seus fios. Com a rotina certa, a vitalidade volta rapidamente.`,
    quebradico: "Sol, sal e química enfraqueceram a estrutura dos fios. É hora de reconstruir de dentro pra fora e devolver a força que seu cabelo merece.",
    opaco:      "O clima litorâneo remove os óleos naturais dos fios, deixando-os sem brilho. Nutrição profunda vai trazer o viço de volta.",
    saudavel:   "Seu cabelo está bem cuidado! Morar no litoral exige atenção constante. Vamos potencializar o que já funciona para manter a saúde dos fios o ano todo.",
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

  // ── 1. resultado (useMemo) — DEVE vir antes de qualquer useCallback que o usa ──
  const resultado = useMemo(() => {
    if (!concluido || respostas.length < 8) return null
    return calcularResultado(respostas, pontos)
  }, [concluido, respostas, pontos])

  // ── 2. Carrega localStorage ───────────────────────────────────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const s: EstadoSalvo = JSON.parse(raw)
      setTemSalvo(true)
      if (s.concluido) {
        setPasso(s.passo)
        setRespostas(s.respostas)
        setPontos(s.pontos)
        setConcluido(true)
      }
    } catch { /* ignora */ }
  }, [])

  // ── 3. Persiste no localStorage ───────────────────────────────────────────
  useEffect(() => {
    if (passo === -1) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ passo, respostas, pontos, concluido }))
  }, [passo, respostas, pontos, concluido])

  // ── 4. Fade-in resultado ──────────────────────────────────────────────────
  useEffect(() => {
    if (!concluido) return
    const t = setTimeout(() => setResVisible(true), 80)
    return () => clearTimeout(t)
  }, [concluido])

  // ── 5. Salva no perfil — resultado já está disponível aqui ────────────────
  const salvarNoPerfil = useCallback(() => {
    if (!resultado || !isLoggedIn) return
    updateCapilar({
      tipo:            resultado.tipoCabelo,
      preocupacao:     resultado.condicao,
      frequenciaPreia: resultado.frequencia,
      estacaoCritica:  resultado.estacao,
    })
    setSavedPerfil(true)
  }, [resultado, isLoggedIn, updateCapilar])

  // ── 6. Transição animada ──────────────────────────────────────────────────
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
      setRespostas(s.respostas)
      setPontos(s.pontos)
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
    setResVisible(false)
    setSavedPerfil(false)
    localStorage.removeItem(STORAGE_KEY)
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

          <nav className="res-nav">
           
           
          </nav>

          <section className="res-hero">
            <span className="res-label">Diagnóstico capilar</span>
            <h1 className="res-titulo">{resultado.titulo}</h1>
            <p className="res-desc">{resultado.descricao}</p>
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
              width={220}
              height={220}
              className="res-kit-img"
            />
            <div className="res-kit-info">
              <span className="res-kit-label">Kit recomendado · {est.nome}</span>
              <h2 className="res-kit-nome">Kit {est.kitNome}</h2>
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
        <span>
          Entre ou crie uma conta para salvar seu resultado e acompanhar seu perfil capilar.
        </span>
      </div>

      <a href="/auth" className="res-save-btn">
        Criar conta / Entrar
      </a>
    </>
  )}
</div>

          <div className="res-actions">
            <button onClick={reiniciar} className="res-btn-ghost">← Refazer quiz</button>
            <Link href="/loja" className="res-btn-ghost">Ver todos os kits →</Link>
            <Link href="/blog" className="res-btn-ghost">Blog capilar →</Link>
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
                8 perguntas. Diagnóstico personalizado.
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

        {/* Banner quiz salvo — tela inicial */}
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

        {/* Banner de login — aparece na pergunta 4 para não logados */}
        {passo === 3 && !isLoggedIn && (
          <div className="quiz-login-banner">
            <div className="quiz-login-banner-text">
              <p>Entre para salvar seu resultado</p>
              <span>Acompanhe sua evolução capilar ao longo do tempo.</span>
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