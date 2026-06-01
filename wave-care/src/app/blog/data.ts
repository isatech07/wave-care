// src/app/blog/data.ts

export type Product = {
  productId: number  // ID real no banco
  name: string
  rating: number
  reviews: number
  description: string
  price: string
  image: string
}

export type Post = {
  slug: string
  tag: string
  tagColor: string
  date: string
  title: string
  excerpt: string
  readTime: string
  image: string
  author: string
  content: string[]
  products: Product[]
}

export const posts: Post[] = [
  {
    slug: "cuidados-verao",
    tag: "Verão",
    tagColor: "tag--verao",
    date: "12 Mar 2025",
    title: "Cuidados essenciais para a pele no verão",
    excerpt: "O sol intenso pede atenção redobrada. Descubra rotinas, protetores e hidratantes que mantêm sua pele saudável mesmo nos dias mais quentes.",
    readTime: "5 min",
    image: "/blog/blog-1.png",
    author: "Marina Reis",
    content: [
      "O sol intenso pede atenção redobrada. No verão, a pele fica mais exposta à radiação UV, o que pode causar danos que vão além do bronzeado — ressecamento, manchas e envelhecimento precoce são consequências reais e evitáveis.",
      "Morando no litoral norte de SP, é fundamental adaptar sua rotina capilar às particularidades do clima local. A combinação de umidade, maresia e exposição solar exige cuidados específicos que vão além do básico.",
      "A maresia é um dos maiores desafios para quem mora no litoral. O sal presente no ar pode resecar os fios, deixando-os opacos e quebradiços. Neste artigo, vamos te ensinar as melhores estratégias para proteger seu cabelo.",
      "Lembre-se: cada estação traz desafios diferentes para seus fios. O segredo é antecipar as mudanças e ajustar sua rotina antes que os danos apareçam.",
    ],
    products: [
      {
        productId: 12, // Summer Total Protection (kit completo verão)
        name: "Summer Total Protection",
        rating: 4.8,
        reviews: 389,
        description: "A experiência completa de cuidado para o verão.",
        price: "R$ 249,90",
        image: "/products/verao-produtos/verao-kit-completo.png",
      },
      {
        productId: 9, // Summer Definition Duo
        name: "Summer Definition Duo",
        rating: 4.6,
        reviews: 140,
        description: "A dupla perfeita para definição duradoura e controle do frizz no verão.",
        price: "R$ 89,90",
        image: "/products/verao-produtos/verao-kit-3.png",
      },
    ],
  },
  {
    slug: "hidratacao-inverno",
    tag: "Primavera",
    tagColor: "tag--primavera",
    date: "1 Set 2025",
    title: "Renovação capilar: prepare-se para a primavera",
    excerpt: "Dicas para revitalizar seus fios após o inverno e começar a estação com tudo.",
    readTime: "4 min",
    image: "/blog/blog-2.png",
    author: "Marina Reis",
    content: [
      "A primavera é o momento perfeito para renovar sua rotina capilar. Após meses de ar seco e frio, os fios precisam de cuidados especiais para recuperar o brilho e a vitalidade.",
      "O inverno costuma deixar os cabelos ressecados e sem vida. A baixa umidade do ar retira a hidratação natural dos fios, tornando-os mais quebradiços e difíceis de pentear.",
      "Comece pela limpeza profunda: um shampoo detox vai remover o acúmulo de produtos e abrir caminho para os ativos nutritivos penetrarem melhor.",
      "Aproveite a estação para reavaliar os produtos que você usa no dia a dia. Produtos mais leves e com proteção UV são ideais para a primavera.",
    ],
    products: [
      {
        productId: 41, // Bloom Definition Jelly (primavera-gelatina)
        name: "Bloom Definition Jelly",
        rating: 4.9,
        reviews: 312,
        description: "Definição duradoura com fixação leve e perfume floral que dura o dia todo.",
        price: "R$ 48,90",
        image: "/products/primavera-produtos/primavera-gelatina.png",
      },
    ],
  },
  {
    slug: "rotina-outono",
    tag: "Outono",
    tagColor: "tag--outono",
    date: "10 Fev 2025",
    title: "Transição de estação: sua pele pede adaptação",
    excerpt: "Entre o calor e o frio, a pele oscila. Saiba como ajustar sua rotina para enfrentar o outono sem ressecamento nem oleosidade.",
    readTime: "6 min",
    image: "/blog/blog-3.png",
    author: "Marina Reis",
    content: [
      "O outono é uma estação de transição, e sua pele sente cada mudança. As temperaturas começam a cair, a umidade do ar diminui e o organismo precisa se adaptar a um novo ritmo.",
      "Muitas pessoas enfrentam uma fase confusa no outono: a pele parece oleosa em algumas áreas e ressecada em outras.",
      "A chave para o outono é o equilíbrio. Aposte em produtos que regulam a oleosidade sem ressecar, como géis-creme e hidratantes de textura média.",
      "Não abandone o protetor solar! Mesmo com dias nublados, a radiação UV continua presente.",
    ],
    products: [
      {
        productId: 16, // Autumn Leave-In Cream (outono-creme)
        name: "Autumn Leave-In Cream",
        rating: 4.7,
        reviews: 198,
        description: "Forma uma barreira protetora contra o ressecamento, mantendo a definição e o brilho dos fios.",
        price: "R$ 54,90",
        image: "/products/outono-produtos/outono-creme.png",
      },
    ],
  },
  {
    slug: "spf-guia",
    tag: "Guia",
    tagColor: "tag--guia",
    date: "01 Fev 2025",
    title: "SPF: tudo que você precisa saber sobre proteção solar",
    excerpt: "FPS 30, 50 ou 100? Protetor físico ou químico? Este guia completo responde as dúvidas mais comuns sobre filtro solar.",
    readTime: "8 min",
    image: "/blog/blog-4.png",
    author: "Marina Reis",
    content: [
      "Protetor solar é, sem dúvida, o produto mais importante da sua rotina de skincare. O FPS deve ser parte obrigatória do seu dia a dia — e não apenas nos dias de praia.",
      "FPS 30, 50 ou 100? A resposta depende da sua rotina. Para o dia a dia urbano, um FPS 30 já oferece proteção adequada.",
      "A diferença entre protetores físicos e químicos está no mecanismo de ação. Os físicos formam uma barreira que reflete os raios UV. Os químicos absorvem a radiação e a convertem em calor.",
      "Um erro comum é aplicar pouca quantidade. Para o rosto, o ideal é uma colher de chá do produto. Renove a aplicação a cada 2 horas.",
    ],
    products: [
      {
        productId: 48, // Spring Total Bloom (kit completo primavera)
        name: "Spring Total Bloom",
        rating: 4.8,
        reviews: 445,
        description: "A experiência completa de florescimento para os seus fios na nova estação.",
        price: "R$ 249,90",
        image: "/products/primavera-produtos/primavera-kit-completo.png",
      },
    ],
  },
  {
    slug: "vitamina-c-pele",
    tag: "Ingredientes",
    tagColor: "tag--guia",
    date: "20 Jan 2025",
    title: "Vitamina C na skincare: mitos e verdades",
    excerpt: "Um dos ativos mais populares do universo beauty. Descubra como usar corretamente e potencializar seus resultados.",
    readTime: "5 min",
    image: "/blog/blog-5.jpg",
    author: "Marina Reis",
    content: [
      "A Vitamina C é um dos ingredientes mais estudados e mais amados da dermatologia cosmética. Com propriedades antioxidantes, clareadora e estimuladora de colágeno.",
      "O maior mito em torno da Vitamina C é que ela clareia a pele de forma uniforme. Na verdade, ela age especificamente nas manchas causadas por exposição solar.",
      "A estabilidade é o maior desafio dos produtos com Vitamina C. A substância oxida rapidamente quando exposta à luz e ao ar.",
      "Para potencializar os resultados, use a Vitamina C pela manhã e combine com Vitamina E e Ácido Ferúlico.",
    ],
    products: [
      {
        productId: 36, // Winter Ultimate Care Kit (kit completo inverno)
        name: "Winter Ultimate Care Kit",
        rating: 4.9,
        reviews: 567,
        description: "A experiência completa de cuidado e nutrição para enfrentar o inverno.",
        price: "R$ 259,90",
        image: "/products/inverno-produtos/inverno-kit-completo.png",
      },
    ],
  },
  {
    slug: "Cronograma",
    tag: "Cuidado",
    tagColor: "tag--guia",
    date: "05 Jan 2025",
    title: "Cronograma capilar: o guia completo",
    excerpt: "Aprenda a montar seu cronograma de hidratação, nutrição e reconstrução perfeito.",
    readTime: "4 min",
    image: "/blog/blog-6.png",
    author: "Marina Reis",
    content: [
      "O cronograma capilar é uma das técnicas mais eficientes para recuperar cabelos danificados e manter a saúde dos fios em dia.",
      "Antes de montar seu cronograma, é essencial identificar a necessidade do seu cabelo. Fios ressecados pedem mais hidratação. Cabelos finos precisam de nutrição.",
      "A regra básica do cronograma é: comece sempre pela hidratação, depois vá para a nutrição e finalize com a reconstrução.",
      "A frequência depende do estado do seu cabelo. Para cabelos muito danificados, faça o cronograma completo uma vez por semana.",
    ],
    products: [
      {
        productId: 12, // Summer Total Protection
        name: "Summer Total Protection",
        rating: 4.8,
        reviews: 389,
        description: "A experiência completa de cuidado para o verão.",
        price: "R$ 249,90",
        image: "/products/verao-produtos/verao-kit-completo.png",
      },
    ],
  },
]