// src/app/blog/data.ts

export type Product = {
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
    excerpt:
      "O sol intenso pede atenção redobrada. Descubra rotinas, protetores e hidratantes que mantêm sua pele saudável mesmo nos dias mais quentes.",
    readTime: "5 min",
    image: "/blog/blog-1.png",
    author: "Marina Reis",
    content: [
      "O sol intenso pede atenção redobrada. No verão, a pele fica mais exposta à radiação UV, o que pode causar danos que vão além do bronzeado — ressecamento, manchas e envelhecimento precoce são consequências reais e evitáveis.",
      "Morando no litoral norte de SP, é fundamental adaptar sua rotina capilar às particularidades do clima local. A combinação de umidade, maresia e exposição solar exige cuidados específicos que vão além do básico. Consulte sempre um profissional e invista em produtos de qualidade formulados especificamente para essas condições.",
      "A maresia é um dos maiores desafios para quem mora no litoral. O sal presente no ar pode resecar os fios, deixando-os opacos e quebradiços. Neste artigo, vamos te ensinar as melhores estratégias para proteger seu cabelo.",
      "Lembre-se: cada estação traz desafios diferentes para seus fios. O segredo é antecipar as mudanças e ajustar sua rotina antes que os danos apareçam. Uma boa rotina de cuidados preventivos é sempre mais eficaz do que tratamentos corretivos.",
    ],
    products: [
      {
        name: "Kit Completo Verão",
        rating: 4.8,
        reviews: 389,
        description:
          "Shampoo + Condicionador + Leave-in + Máscara para proteção completa no verão.",
        price: "R$ 159,90",
        image: "/products/verao-produtos/verão-kit-completo.png",
      },
      {
        name: "Wave Care Summer Styling Duo",
        rating: 4.6,
        reviews: 140,
        description:
          "Duo de finalização para fios iluminados e definidos durante todo o verão. Combate o frizz causado pela umidade.",
        price: "R$ 49,90",
        image: "/products/verao-produtos/verão-kit-3.png",
      },
    ],
  },
  {
    slug: "hidratacao-inverno",
    tag: "Primavera",
    tagColor: "tag--primavera",
    date: "1 Set 2025",
    title: "Renovação capilar: prepare-se para a primavera",
    excerpt:
      "Dicas para revitalizar seus fios após o inverno e começar a estação com tudo.",
    readTime: "4 min",
    image: "/blog/blog-2.png",
    author: "Marina Reis",
    content: [
      "A primavera é o momento perfeito para renovar sua rotina capilar. Após meses de ar seco e frio, os fios precisam de cuidados especiais para recuperar o brilho e a vitalidade.",
      "O inverno costuma deixar os cabelos ressecados e sem vida. A baixa umidade do ar retira a hidratação natural dos fios, tornando-os mais quebradiços e difíceis de pentear. Por isso, a transição para a primavera exige uma atenção especial.",
      "Comece pela limpeza profunda: um shampoo detox vai remover o acúmulo de produtos e abrir caminho para os ativos nutritivos penetrarem melhor. Em seguida, invista em máscaras de hidratação intensa pelo menos duas vezes por semana.",
      "Aproveite a estação para também reavaliar os produtos que você usa no dia a dia. Produtos mais leves e com proteção UV são ideais para a primavera, quando a exposição solar começa a aumentar novamente.",
    ],
    products: [
      {
        name: "Primavera Bloom Hair Mask",
        rating: 4.9,
        reviews: 312,
        description:
          "Máscara de hidratação profunda com ativos de primavera. Recupera o brilho e a maciez dos fios ressecados pelo inverno.",
        price: "R$ 79,90",
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
    excerpt:
      "Entre o calor e o frio, a pele oscila. Saiba como ajustar sua rotina para enfrentar o outono sem ressecamento nem oleosidade.",
    readTime: "6 min",
    image: "/blog/blog-3.png",
    author: "Marina Reis",
    content: [
      "O outono é uma estação de transição, e sua pele sente cada mudança. As temperaturas começam a cair, a umidade do ar diminui e o organismo precisa se adaptar a um novo ritmo — e isso se reflete diretamente na saúde da pele.",
      "Muitas pessoas enfrentam uma fase confusa no outono: a pele parece oleosa em algumas áreas e ressecada em outras. Isso acontece porque ainda há calor suficiente para estimular a produção de sebo, mas o ar mais seco já começa a comprometer a barreira de hidratação.",
      "A chave para o outono é o equilíbrio. Aposte em produtos que regulam a oleosidade sem ressecar, como géis-creme e hidratantes de textura média. Evite produtos muito pesados, que podem entupir os poros nessa fase de transição.",
      "Não abandone o protetor solar! Mesmo com dias nublados, a radiação UV continua presente. Mantenha o hábito de aplicar FPS diariamente e faça uma limpeza suave à noite para remover resíduos acumulados durante o dia.",
    ],
    products: [
      {
        name: "Autumn Bloom Leave-in Cream",
        rating: 4.7,
        reviews: 198,
        description:
          "Creme de textura leve que hidrata sem pesar. Fórmula especial para a transição entre estações.",
        price: "R$ 69,90",
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
    excerpt:
      "FPS 30, 50 ou 100? Protetor físico ou químico? Este guia completo responde as dúvidas mais comuns sobre filtro solar.",
    readTime: "8 min",
    image: "/blog/blog-4.png",
    author: "Marina Reis",
    content: [
      "Protetor solar é, sem dúvida, o produto mais importante da sua rotina de skincare. Independente da estação, cor de pele ou tipo de cabelo, o FPS deve ser parte obrigatória do seu dia a dia — e não apenas nos dias de praia.",
      "FPS 30, 50 ou 100? A resposta depende da sua rotina. Para o dia a dia urbano, um FPS 30 já oferece proteção adequada. Para exposição prolongada ao sol, especialmente na praia ou na piscina, prefira FPS 50 ou superior.",
      "A diferença entre protetores físicos e químicos está no mecanismo de ação. Os físicos (com óxido de zinco ou dióxido de titânio) formam uma barreira que reflete os raios UV. Os químicos absorvem a radiação e a convertem em calor. Nenhum é melhor que o outro — a escolha depende do seu tipo de pele e preferência de textura.",
      "Um erro comum é aplicar pouca quantidade. Para o rosto, o ideal é uma colher de chá do produto. Para o corpo, aplique generosamente e renove a aplicação a cada 2 horas, ou após nadar e suar. A reaplicação é tão importante quanto a primeira aplicação.",
    ],
    products: [
      {
        name: "Kit Primavera Bloom Completo",
        rating: 4.8,
        reviews: 445,
        description:
          "A rotina completa de cuidados da linha Primavera Bloom. Proporciona limpeza, hidratação, nutrição, definição e brilho para cabelos saudáveis e cheios de vida.",
        price: "R$ 329,90",
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
    excerpt:
      "Um dos ativos mais populares do universo beauty. Descubra como usar corretamente e potencializar seus resultados.",
    readTime: "5 min",
    image: "/blog/blog-5.jpg",
    author: "Marina Reis",
    content: [
      "A Vitamina C é um dos ingredientes mais estudados e mais amados da dermatologia cosmética. Com propriedades antioxidantes, clareadora e estimuladora de colágeno, ela promete — e entrega — resultados visíveis quando usada corretamente.",
      "O maior mito em torno da Vitamina C é que ela clareia a pele de forma uniforme. Na verdade, ela age especificamente nas manchas causadas por exposição solar e inflamações, uniformizando o tom sem alterar a cor natural da pele.",
      "A estabilidade é o maior desafio dos produtos com Vitamina C. A substância oxida rapidamente quando exposta à luz e ao ar. Por isso, prefira embalagens opacas e bem vedadas, e guarde o produto longe da luz solar direta.",
      "Para potencializar os resultados, use a Vitamina C pela manhã (ela reforça a ação do protetor solar) e combine com Vitamina E e Ácido Ferúlico. Comece com concentrações mais baixas (10%) e vá aumentando gradualmente para minimizar a irritação.",
    ],
    products: [
      {
        name: "Kit Winter Complete",
        rating: 4.9,
        reviews: 567,
        description:
          "A rotina completa de cuidados da linha Winter. Oferece limpeza, hidratação intensa, nutrição profunda e definição para manter os cabelos saudáveis mesmo nos dias mais frios.",
        price: "R$ 329,90",
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
    excerpt:
      "Aprenda a montar seu cronograma de hidratação, nutrição e reconstrução perfeito.",
    readTime: "4 min",
    image: "/blog/blog-6.png",
    author: "Marina Reis",
    content: [
      "O cronograma capilar é uma das técnicas mais eficientes para recuperar cabelos danificados e manter a saúde dos fios em dia. Ele consiste em organizar os tratamentos de hidratação, nutrição e reconstrução de forma estratégica ao longo do mês.",
      "Antes de montar seu cronograma, é essencial identificar a necessidade do seu cabelo. Fios ressecados e sem brilho pedem mais hidratação. Cabelos finos e sem corpo precisam de nutrição. Fios danificados por química ou calor exigem reconstrução.",
      "A regra básica do cronograma é: comece sempre pela hidratação, depois vá para a nutrição e finalize com a reconstrução. Essa sequência garante que os ativos sejam absorvidos na ordem correta, potencializando os resultados de cada etapa.",
      "A frequência depende do estado do seu cabelo. Para cabelos muito danificados, faça o cronograma completo uma vez por semana. Para cabelos saudáveis, uma vez por mês já é suficiente para manutenção. O importante é ser consistente e respeitar as necessidades dos seus fios.",
    ],
    products: [
      {
        name: "Kit Completo Verão",
        rating: 4.8,
        reviews: 389,
        description:
          "Shampoo + Condicionador + Leave-in + Máscara para proteção completa no verão.",
        price: "R$ 159,90",
        image: "/products/verao-produtos/verão-kit-completo.png",
      },
    ],
  },
]