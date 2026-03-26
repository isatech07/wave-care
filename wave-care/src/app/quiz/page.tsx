"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowLeft, Sun, Droplets, Wind, Waves, Sparkles, BookOpen } from "lucide-react"
import "./quiz.css"

interface Pergunta {
  id: number
  categoria: string
  pergunta: string
  opcoes: { texto: string; valor: string; pontos: Record<string, number> }[]
}

const perguntas: Pergunta[] = [
  {
    id: 1,
    categoria: "Localização",
    pergunta: "Em qual cidade do litoral norte você mora?",
    opcoes: [
      { texto: "Caraguatatuba", valor: "caraguatatuba", pontos: { sol: 2, sal: 2, umidade: 2 } },
      { texto: "São Sebastião", valor: "sao-sebastiao", pontos: { sol: 2, sal: 3, umidade: 2 } },
      { texto: "Ilhabela", valor: "ilhabela", pontos: { sol: 2, sal: 3, umidade: 3 } },
      { texto: "Ubatuba", valor: "ubatuba", pontos: { sol: 2, sal: 2, umidade: 3 } },
    ],
  },
  {
    id: 2,
    categoria: "Tipo de Cabelo",
    pergunta: "Qual é o tipo do seu cabelo?",
    opcoes: [
      { texto: "Liso", valor: "liso", pontos: { liso: 3, cacheado: 0 } },
      { texto: "Ondulado (2A-2C)", valor: "ondulado", pontos: { liso: 1, cacheado: 2 } },
      { texto: "Cacheado (3A-3C)", valor: "cacheado", pontos: { liso: 0, cacheado: 3 } },
      { texto: "Crespo (4A-4C)", valor: "crespo", pontos: { liso: 0, cacheado: 3 } },
    ],
  },
  {
    id: 3,
    categoria: "Rotina de Praia",
    pergunta: "Com que frequência você vai à praia?",
    opcoes: [
      { texto: "Todos os dias ou quase", valor: "diario", pontos: { sol: 3, sal: 3 } },
      { texto: "Nos fins de semana", valor: "fds", pontos: { sol: 2, sal: 2 } },
      { texto: "Algumas vezes por mês", valor: "mensal", pontos: { sol: 1, sal: 1 } },
      { texto: "Raramente", valor: "raro", pontos: { sol: 0, sal: 0 } },
    ],
  },
  {
    id: 4,
    categoria: "Exposição Solar",
    pergunta: "Você costuma proteger o cabelo do sol?",
    opcoes: [
      { texto: "Nunca uso proteção", valor: "nunca", pontos: { ressecamento: 3, dano: 3 } },
      { texto: "Às vezes uso chapéu ou boné", valor: "as-vezes", pontos: { ressecamento: 2, dano: 2 } },
      { texto: "Sempre uso protetor térmico/solar", valor: "sempre", pontos: { ressecamento: 1, dano: 1 } },
      { texto: "Evito exposição direta ao sol", valor: "evita", pontos: { ressecamento: 0, dano: 0 } },
    ],
  },
  {
    id: 5,
    categoria: "Contato com Água",
    pergunta: "Quando vai à praia, você molha o cabelo no mar?",
    opcoes: [
      { texto: "Sim, sempre mergulho", valor: "sempre", pontos: { sal: 3, ressecamento: 2 } },
      { texto: "Às vezes molho", valor: "as-vezes", pontos: { sal: 2, ressecamento: 1 } },
      { texto: "Só molho na piscina", valor: "piscina", pontos: { cloro: 3, ressecamento: 2 } },
      { texto: "Prefiro não molhar", valor: "nao", pontos: { sal: 0, ressecamento: 0 } },
    ],
  },
  {
    id: 6,
    categoria: "Condição do Cabelo",
    pergunta: "Como está seu cabelo atualmente?",
    opcoes: [
      { texto: "Ressecado e com frizz", valor: "ressecado", pontos: { hidratacao: 3, nutricao: 2 } },
      { texto: "Quebradiço e sem vida", valor: "quebradico", pontos: { reconstrucao: 3, nutricao: 2 } },
      { texto: "Opaco e sem brilho", valor: "opaco", pontos: { nutricao: 3, hidratacao: 2 } },
      { texto: "Saudável, mas precisa de manutenção", valor: "saudavel", pontos: { manutencao: 3 } },
    ],
  },
  {
    id: 7,
    categoria: "Química",
    pergunta: "Seu cabelo tem algum processo químico?",
    opcoes: [
      { texto: "Coloração ou descoloração", valor: "coloracao", pontos: { reconstrucao: 3, dano: 2 } },
      { texto: "Alisamento ou relaxamento", valor: "alisamento", pontos: { reconstrucao: 2, dano: 2 } },
      { texto: "Permanente ou texturização", valor: "permanente", pontos: { hidratacao: 2, dano: 1 } },
      { texto: "Cabelo natural, sem química", valor: "natural", pontos: { manutencao: 2 } },
    ],
  },
  {
    id: 8,
    categoria: "Estação Atual",
    pergunta: "Em qual estação estamos ou qual se aproxima?",
    opcoes: [
      { texto: "Verão", valor: "verao", pontos: { verao: 3 } },
      { texto: "Outono", valor: "outono", pontos: { outono: 3 } },
      { texto: "Inverno", valor: "inverno", pontos: { inverno: 3 } },
      { texto: "Primavera", valor: "primavera", pontos: { primavera: 3 } },
    ],
  },
]

interface KitInfo {
  nome: string
  imagem: string
  link: string
  cor: { bg: string; text: string; accent: string }
  produtos: { nome: string; descricao: string }[]
}

interface Resultado {
  titulo: string
  descricao: string
  necessidades: string[]
  dicasPraia: string[]
  estacao: "verao" | "outono" | "inverno" | "primavera"
  kitInfo: KitInfo
  blogPost: {
    titulo: string
    resumo: string
    link: string
  }
}

const produtosPorEstacao: Record<string, KitInfo> = {
  verao: {
    imagem: "/products/verao-produtos/Summer-Protection - kit.png",
    nome: "Summer Protection",
    link: "/produtos/verao",
    cor: { bg: "#f5e0d0", text: "#8b4513", accent: "#d35400" },
    produtos: [
      { nome: "Shampoo Summer Protection", descricao: "Limpeza suave que remove sal e cloro" },
      { nome: "Condicionador Summer Protection", descricao: "Desembaraça e protege dos raios UV" },
      { nome: "Máscara de Hidratação", descricao: "Hidratação profunda para cabelos expostos ao sol" },
      { nome: "Leave-in Cream", descricao: "Proteção térmica e solar durante o dia" },
    ],
  },
  outono: {
    imagem: "/products/outono-produtos/Autumn-Bloom-kit.png",
    nome: "Autumn Bloom",
    link: "/produtos/outono",
    cor: { bg: "#d4c4a0", text: "#4a5a30", accent: "#6b7a40" },
    produtos: [
      { nome: "Shampoo Autumn Bloom", descricao: "Limpeza nutritiva para transição de estação" },
      { nome: "Condicionador Autumn Bloom", descricao: "Nutrição e desembaraço" },
      { nome: "Hair Mask", descricao: "Reconstrução e fortalecimento capilar" },
      { nome: "Oil Autumn Bloom", descricao: "Óleo nutritivo para selar as cutículas" },
    ],
  },
  inverno: {
    imagem: "/products/inverno-produtos/inverno-kit-completo.png",
    nome: "Winter Complete",
    link: "/produtos/inverno",
    cor: { bg: "#c8d4e0", text: "#2a3a5a", accent: "#4a6080" },
    produtos: [
      { nome: "Shampoo Winter Complete", descricao: "Limpeza hidratante para dias frios" },
      { nome: "Condicionador Winter Complete", descricao: "Hidratação intensa contra ressecamento" },
      { nome: "Máscara Winter", descricao: "Tratamento profundo para umidade do litoral" },
      { nome: "Oil Winter Complete", descricao: "Óleo selador para proteção" },
    ],
  },
  primavera: {
    imagem: "/products/primavera-produtos/bloom-kit-2.png",
    nome: "Primavera Bloom",
    link: "/produtos/primavera",
    cor: { bg: "#f0d8e0", text: "#6a3050", accent: "#b05080" },
    produtos: [
      { nome: "Shampoo Primavera Bloom", descricao: "Limpeza leve e revigorante" },
      { nome: "Leave-in Cream", descricao: "Hidratação diária com proteção" },
      { nome: "Styling Gelatin", descricao: "Definição natural para cachos e ondas" },
      { nome: "Hair Oil", descricao: "Brilho e finalização perfeita" },
    ],
  },
}

const cidadesNomes: Record<string, string> = {
  caraguatatuba: "Caraguatatuba",
  "sao-sebastiao": "São Sebastião",
  ilhabela: "Ilhabela",
  ubatuba: "Ubatuba",
}

function calcularResultado(
  respostas: string[],
  pontosAcumulados: Record<string, number>
): Resultado {
  const estacao = respostas[7] as "verao" | "outono" | "inverno" | "primavera"
  const tipoCabelo = respostas[1]
  const frequenciaPraia = respostas[2]
  const condicaoCabelo = respostas[5]
  const cidade = respostas[0]

  const necessidades: string[] = []
  const dicasPraia: string[] = []

  if (pontosAcumulados.hidratacao >= 2) necessidades.push("Hidratação intensiva")
  if (pontosAcumulados.nutricao >= 2) necessidades.push("Nutrição profunda")
  if (pontosAcumulados.reconstrucao >= 2) necessidades.push("Reconstrução capilar")
  if (pontosAcumulados.ressecamento >= 2) necessidades.push("Tratamento anti-ressecamento")
  if (pontosAcumulados.sal >= 2) necessidades.push("Proteção contra sal marinho")
  if (pontosAcumulados.sol >= 2) necessidades.push("Proteção solar capilar")
  if (pontosAcumulados.cloro >= 2) necessidades.push("Remoção de cloro")
  if (necessidades.length === 0) necessidades.push("Manutenção e prevenção")

  if (frequenciaPraia === "diario" || frequenciaPraia === "fds") {
    dicasPraia.push("Enxágue o cabelo com água doce antes e depois do mar")
    dicasPraia.push("Use leave-in com proteção UV antes de ir à praia")
    dicasPraia.push("Prenda o cabelo em tranças soltas para reduzir nós")
  }

  if (tipoCabelo === "cacheado" || tipoCabelo === "crespo") {
    dicasPraia.push("Hidrate profundamente uma vez por semana")
    dicasPraia.push("Use gelatina capilar para definir os cachos após a praia")
  }

  if (tipoCabelo === "liso" || tipoCabelo === "ondulado") {
    dicasPraia.push("Aplique óleo finalizador para selar as cutículas")
    dicasPraia.push("Evite pentear seco para não quebrar os fios")
  }

  if (condicaoCabelo === "ressecado") {
    dicasPraia.push("Faça umectação noturna com óleo de coco ou argan")
  }

  const kitEstacao = produtosPorEstacao[estacao]

  let tituloResultado = ""
  let descricaoResultado = ""

  if (condicaoCabelo === "ressecado") {
    tituloResultado = "Seu cabelo precisa de hidratação urgente"
    descricaoResultado = `Morando em ${cidadesNomes[cidade]} e frequentando a praia ${
      frequenciaPraia === "diario" ? "diariamente" : "regularmente"
    }, seu cabelo está sofrendo com a exposição ao sol e sal marinho. A boa notícia é que com a rotina certa, você pode recuperar a vitalidade dos fios.`
  } else if (condicaoCabelo === "quebradico") {
    tituloResultado = "Foco na reconstrução e fortalecimento"
    descricaoResultado =
      "Os fios estão pedindo socorro. A combinação de sol, sal e possivelmente química enfraqueceu a estrutura do cabelo. Vamos trabalhar na reconstrução para devolver a força aos seus fios."
  } else if (condicaoCabelo === "opaco") {
    tituloResultado = "Hora de devolver o brilho natural"
    descricaoResultado =
      "Seu cabelo está precisando de nutrição para recuperar o brilho característico de fios saudáveis. O clima litorâneo pode estar removendo os óleos naturais do cabelo."
  } else {
    tituloResultado = "Mantenha a rotina de cuidados"
    descricaoResultado =
      "Seu cabelo está bem, mas morar no litoral exige atenção constante. Continue com os cuidados preventivos para manter a saúde dos fios durante todo o ano."
  }

  return {
    titulo: tituloResultado,
    descricao: descricaoResultado,
    necessidades,
    dicasPraia,
    estacao,
    kitInfo: {
      nome: kitEstacao.nome,
      imagem: kitEstacao.imagem,
      link: kitEstacao.link,
      cor: kitEstacao.cor,
      produtos: kitEstacao.produtos,
    },
    blogPost: {
      titulo: `Cuidados com Cabelo ${
        tipoCabelo === "cacheado" || tipoCabelo === "crespo" ? "Cacheado" : "Liso"
      } no Litoral`,
      resumo: `Dicas para manter seu cabelo saudável em ${cidadesNomes[cidade]}, considerando o clima tropical e a exposição ao mar.`,
      link: `/blog/cuidados-cabelo-litoral-norte`,
    },
  }
}

export default function WaveCareQuiz() {
  const [passo, setPasso] = useState(0)
  const [respostas, setRespostas] = useState<string[]>([])
  const [pontosAcumulados, setPontosAcumulados] = useState<Record<string, number>>({})
  const [concluido, setConcluido] = useState(false)
  const [telaInicial, setTelaInicial] = useState(true)
  const [opcaoSelecionada, setOpcaoSelecionada] = useState<string | null>(null)

  const perguntaAtual = perguntas[passo]
  const progresso = (passo / perguntas.length) * 100

  const resultado = useMemo(() => {
    if (concluido) return calcularResultado(respostas, pontosAcumulados)
    return null
  }, [concluido, respostas, pontosAcumulados])

  function responder(valor: string, pontos: Record<string, number>) {
    setOpcaoSelecionada(valor)
    setTimeout(() => {
      const novasRespostas = [...respostas, valor]
      setRespostas(novasRespostas)
      const novosPontos = { ...pontosAcumulados }
      Object.entries(pontos).forEach(([key, value]) => {
        novosPontos[key] = (novosPontos[key] || 0) + value
      })
      setPontosAcumulados(novosPontos)
      if (passo + 1 < perguntas.length) {
        setPasso(passo + 1)
        setOpcaoSelecionada(null)
      } else {
        setConcluido(true)
      }
    }, 300)
  }

  function voltar() {
    if (passo > 0) {
      setRespostas(respostas.slice(0, -1))
      setPasso(passo - 1)
      setOpcaoSelecionada(null)
    }
  }

  function reiniciar() {
    setPasso(0)
    setRespostas([])
    setPontosAcumulados({})
    setConcluido(false)
    setTelaInicial(true)
    setOpcaoSelecionada(null)
  }

  // ── Tela Inicial ──────────────────────────────────────────────────────────
  if (telaInicial) {
    return (
      <main className="quiz-container">
        <div className="quiz-bg-decoration">
          <div className="quiz-blob quiz-blob-1" />
          <div className="quiz-blob quiz-blob-2" />
        </div>

        <div className="quiz-wrapper">
          
          <p className="quiz-subtitle">Quiz Capilar</p>

          <div className="quiz-card quiz-animate-in">
            <h2 className="quiz-start-title">
              Descubra o que seu cabelo <span>precisa no litoral</span>
            </h2>
            <p className="quiz-start-description">
              Um diagnóstico personalizado para quem mora em Caraguatatuba, São Sebastião,
              Ilhabela ou Ubatuba.
            </p>

            <div className="quiz-features">
              <div className="quiz-feature">
                <div className="quiz-feature-icon">
                  <Sun size={18} />
                </div>
                <span className="quiz-feature-text">Proteção Solar</span>
              </div>
              <div className="quiz-feature">
                <div className="quiz-feature-icon">
                  <Waves size={18} />
                </div>
                <span className="quiz-feature-text">Sal Marinho</span>
              </div>
              <div className="quiz-feature">
                <div className="quiz-feature-icon">
                  <Droplets size={18} />
                </div>
                <span className="quiz-feature-text">Hidratação</span>
              </div>
              <div className="quiz-feature">
                <div className="quiz-feature-icon">
                  <Wind size={18} />
                </div>
                <span className="quiz-feature-text">Clima Local</span>
              </div>
            </div>

            <button onClick={() => setTelaInicial(false)} className="quiz-btn-primary">
              Começar Diagnóstico
              <ArrowRight size={18} />
            </button>

            <p className="quiz-hint">8 perguntas rápidas — Resultado personalizado</p>
          </div>

          <div className="quiz-preview-images">
            {Object.entries(produtosPorEstacao).map(([key, kit]) => (
              <div key={key} className="quiz-preview-image">
                <Image src={kit.imagem} alt={kit.nome} width={60} height={60} />
              </div>
            ))}
          </div>
        </div>
      </main>
    )
  }

  // ── Tela de Resultado ─────────────────────────────────────────────────────
  if (concluido && resultado) {
    const cores = resultado.kitInfo.cor

    return (
      <main className="quiz-result-container" style={{ backgroundColor: cores.bg }}>
        <div className="quiz-bg-decoration">
          <div className="quiz-blob quiz-blob-1" style={{ backgroundColor: cores.accent, opacity: 0.2 }} />
          <div className="quiz-blob quiz-blob-2" style={{ backgroundColor: cores.text, opacity: 0.1 }} />
        </div>

        <div className="quiz-result-wrapper">
          {/* Header */}
          <div className="quiz-result-header quiz-animate-in">
            <Link href="/" className="quiz-logo" style={{ color: cores.text }}>
              Wave<span style={{ color: cores.accent }}>Care</span>
            </Link>
            <p className="quiz-subtitle" style={{ color: cores.text, opacity: 0.6 }}>
              Seu Resultado
            </p>
          </div>

          {/* Diagnóstico */}
          <div className="quiz-animate-in" style={{ animationDelay: "0.1s" }}>
            <div className="quiz-result-badge" style={{ color: cores.text }}>
              Diagnóstico Capilar
            </div>
            <h2 className="quiz-result-title" style={{ color: cores.text }}>
              {resultado.titulo}
            </h2>
            <p className="quiz-result-description" style={{ color: cores.text }}>
              {resultado.descricao}
            </p>
          </div>

          {/* Cards de necessidades e dicas */}
          <div className="quiz-result-cards quiz-animate-in" style={{ animationDelay: "0.2s" }}>
            <div className="quiz-result-card">
              <h4 className="quiz-result-card-title">
                <Sparkles size={18} className="quiz-result-card-icon" />
                Seu cabelo precisa de
              </h4>
              <ul className="quiz-result-list">
                {resultado.necessidades.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="quiz-result-card">
              <h4 className="quiz-result-card-title">
                <Waves size={18} className="quiz-result-card-icon" />
                Dicas para a praia
              </h4>
              <ul className="quiz-result-list">
                {resultado.dicasPraia.slice(0, 4).map((dica, i) => (
                  <li key={i}>{dica}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Produto Recomendado */}
          <div className="quiz-product-section quiz-animate-in" style={{ animationDelay: "0.3s" }}>
            <div className="quiz-product-header">
              <h3 className="quiz-product-title">Kit {resultado.kitInfo.nome}</h3>
              <p className="quiz-product-subtitle">Recomendado para a estação atual</p>
            </div>

            <div className="quiz-product-content">
              <div className="quiz-product-image">
                <Image
                  src={resultado.kitInfo.imagem}
                  alt={resultado.kitInfo.nome}
                  width={300}
                  height={300}
                />
              </div>

              <div className="quiz-product-items">
                {resultado.kitInfo.produtos.map((produto, i) => (
                  <div key={i} className="quiz-product-item">
                    <h5 className="quiz-product-item-name">{produto.nome}</h5>
                    <p className="quiz-product-item-desc">{produto.descricao}</p>
                  </div>
                ))}

                <Link href={resultado.kitInfo.link} className="quiz-product-cta">
                  Ver Kit Completo
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>

          {/* Blog */}
          <div className="quiz-blog-section quiz-animate-in" style={{ animationDelay: "0.4s" }}>
            <div className="quiz-blog-content">
              <h4>{resultado.blogPost.titulo}</h4>
              <p>{resultado.blogPost.resumo}</p>
            </div>
            <Link href={resultado.blogPost.link} className="quiz-blog-link">
              <BookOpen size={16} />
              Ler Artigo
            </Link>
          </div>

          {/* Outras Estações */}
          <div className="quiz-seasons-section quiz-animate-in" style={{ animationDelay: "0.5s" }}>
            <h3 className="quiz-seasons-title" style={{ color: cores.text }}>
              Kits para Todas as Estações
            </h3>
            <div className="quiz-seasons-grid">
              {Object.entries(produtosPorEstacao).map(([key, kit]) => (
                <Link key={key} href={kit.link} className="quiz-season-card">
                  <Image
                    src={kit.imagem}
                    alt={kit.nome}
                    width={200}
                    height={200}
                    className="quiz-season-image"
                  />
                  <p className="quiz-season-name">{kit.nome}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Ações */}
          <div className="quiz-actions quiz-animate-in" style={{ animationDelay: "0.6s" }}>
            <button
              onClick={reiniciar}
              className="quiz-btn-secondary"
              style={{ color: cores.text, borderColor: `${cores.text}40` }}
            >
              <ArrowLeft size={16} />
              Refazer Quiz
            </button>
            <Link
              href="/loja"
              className="quiz-btn-secondary"
              style={{ color: cores.text, borderColor: `${cores.text}40` }}
            >
              Ver Todos os Produtos
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>
    )
  }

  // ── Tela de Perguntas ─────────────────────────────────────────────────────
  return (
    <main className="quiz-container">
      <div className="quiz-bg-decoration">
        <div className="quiz-blob quiz-blob-1" />
        <div className="quiz-blob quiz-blob-2" />
      </div>

      <div className="quiz-wrapper">
        <Link href="/" className="quiz-logo">
          Wave<span>Care</span>
        </Link>
        <p className="quiz-subtitle">Quiz Capilar</p>

        <div className="quiz-card quiz-animate-in" key={passo}>
          {/* Progress */}
          <div className="quiz-progress-container">
            <div className="quiz-progress-header">
              <span className="quiz-progress-category">{perguntaAtual.categoria}</span>
              <span className="quiz-progress-step">
                {passo + 1} de {perguntas.length}
              </span>
            </div>
            <div className="quiz-progress-bar">
              <div className="quiz-progress-fill" style={{ width: `${progresso}%` }} />
            </div>
          </div>

          {/* Question */}
          <h2 className="quiz-question">{perguntaAtual.pergunta}</h2>

          {/* Options */}
          <div className="quiz-options">
            {perguntaAtual.opcoes.map((opcao) => (
              <button
                key={opcao.valor}
                onClick={() => responder(opcao.valor, opcao.pontos)}
                className={`quiz-option ${opcaoSelecionada === opcao.valor ? "selected" : ""}`}
              >
                <span className="quiz-option-radio" />
                {opcao.texto}
              </button>
            ))}
          </div>

          {/* Navigation */}
          {passo > 0 && (
            <div className="quiz-nav">
              <button onClick={voltar} className="quiz-btn-back">
                <ArrowLeft size={16} />
                Voltar
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}