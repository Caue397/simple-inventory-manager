# Gerenciador de Estoque

Sistema de controle de estoque para pequenas empresas, construído com Next.js — sem backend separado, sem complexidade desnecessária.

---

## O problema

Gerenciadores de estoque são um dos CRUDs mais comuns que existem. Qualquer empresa pequena precisa de uma solução para:

- Cadastrar produtos com SKU, preço e estoque mínimo
- Registrar entradas e saídas de mercadoria
- Receber alertas quando o estoque está abaixo do mínimo
- Visualizar o histórico de movimentações

A abordagem tradicional seria criar um backend em Node/Express ou NestJS, um banco de dados, uma API REST com autenticação JWT, e um frontend React consumindo essa API. São facilmente 5 a 8 camadas de abstração para resolver um problema relativamente simples.

## A solução: menos é mais

Esse projeto usa exclusivamente **Next.js com Server Actions**. Não existe servidor separado. Não existe API REST. Toda a lógica de negócio roda direto no servidor Next.js, em funções marcadas com `'use server'`.

O resultado: um sistema completo, com autenticação, banco de dados relacional e dashboard analytics — em uma única base de código, fácil de entender e fácil de manter.

```
Arquitetura tradicional:         Arquitetura desse projeto:

 [React App]                      [Next.js]
      ↓ HTTP                           ↓ Server Action (chamada direta)
 [Express/NestJS]                 [Prisma ORM]
      ↓ SQL                            ↓ SQL
 [PostgreSQL]                     [PostgreSQL (Supabase)]
```

### Por que isso importa

Com Server Actions, o cliente chama uma função que executa no servidor — sem necessidade de endpoints, sem fetch manual, sem serialização de erros entre camadas. O TypeScript cobre tudo de ponta a ponta: do formulário no frontend até a query no banco.

Menos código, menos pontos de falha, menos tempo de manutenção.

---

## Funcionalidades

- **Autenticacao** via Supabase Auth com persistencia de sessao
- **Onboarding** de empresa no primeiro acesso
- **Produtos** — cadastro, edicao e exclusao com SKU e estoque minimo
- **Movimentacoes** — registro de entradas e saidas com motivo e responsavel
- **Alertas** — listagem de produtos abaixo do estoque minimo
- **Dashboard** — total de produtos, movimentacoes dos ultimos 30 dias, grafico de tendencia dos ultimos 6 meses
- **Multi-tenant** — dados isolados por empresa

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) |
| Linguagem | TypeScript 5 |
| Banco de dados | PostgreSQL via Supabase |
| ORM | Prisma 7 |
| Autenticacao | Supabase Auth |
| Estilizacao | Tailwind CSS 4 |
| Animacoes | Framer Motion |
| Validacao | Zod |
| Icones | Lucide React |

---

## Estrutura do projeto

```
src/
├── app/
│   ├── (auth)/          # Rotas de login e cadastro
│   ├── (dashboard)/     # Rotas protegidas
│   │   ├── dashboard/   # Pagina inicial com metricas
│   │   ├── products/    # CRUD de produtos
│   │   ├── movements/   # Historico de movimentacoes
│   │   └── alerts/      # Produtos abaixo do estoque minimo
│   └── onboarding/      # Configuracao inicial da empresa
├── components/
│   ├── features/        # Componentes por dominio de negocio
│   └── ui/              # Componentes reutilizaveis
└── lib/
    ├── actions/         # Server Actions (toda a logica de backend)
    ├── supabase/        # Clientes Supabase (browser e server)
    └── validations/     # Schemas Zod
```

A organizacao segue o principio de **colocacao por funcionalidade**: cada dominio (produtos, movimentacoes, alertas) tem seus proprios componentes e actions, sem acoplamento entre eles.

---

## Banco de dados

O schema tem 4 tabelas:

```
Company
  └── users[]
  └── products[]
        └── stockMovements[]
              └── user (quem fez a movimentacao)
```

Multi-tenancy implementado por `companyId` em todas as queries — cada empresa ve apenas os proprios dados, sem nenhum dado vazando entre contas.

---

## Rodando o projeto

**Pre-requisitos:** Node.js 18+, uma conta no [Supabase](https://supabase.com) (plano gratuito e suficiente)

```bash
# Instalar dependencias
npm install

# Configurar variaveis de ambiente
cp .env.example .env.local
# Preencher NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY

# Rodar as migrations do banco
npx prisma migrate dev

# Iniciar em desenvolvimento
npm run dev
```

Acesse `http://localhost:3000`.

---

## Decisoes de arquitetura

**Por que Server Actions e nao API Routes?**
Server Actions eliminam a necessidade de criar endpoints manualmente. A chamada acontece de forma transparente — o Next.js serializa os argumentos, executa a funcao no servidor e retorna o resultado. Isso reduz boilerplate e mantem type safety do inicio ao fim sem nenhuma configuracao extra.

**Por que Supabase Auth e nao NextAuth?**
O Supabase oferece autenticacao pronta com persistencia de sessao em cookies e suporte a SSR fora da caixa via `@supabase/ssr`. Nao e necessario configurar JWT ou session store separados.

**Por que Prisma sobre o cliente nativo do Supabase?**
O Supabase oferece seu proprio cliente para queries, mas o Prisma garante type safety gerado a partir do schema — erros de query aparecem em tempo de compilacao, nao em runtime. Para um projeto com relacoes entre tabelas, o ganho vale a dependencia extra.

**Por que sem Redux ou Zustand?**
Todo o estado relevante vive no banco de dados e e buscado via Server Components ou revalidado apos mutations com `revalidatePath()`. Nao existe estado global no cliente que precise ser gerenciado — o que simplifica enormemente o debugging e elimina bugs de sincronizacao.

---

## O que esse projeto demonstra

- Capacidade de **escolher a ferramenta certa** para o problema em vez de replicar arquiteturas complexas por habito
- Conhecimento do **ecossistema moderno do Next.js** (App Router, Server Actions, Server Components)
- **Type safety de ponta a ponta** sem configuracao manual de tipos de API
- Organizacao de codigo **escalavel e legivel** para times pequenos
- Entendimento de **multi-tenancy** e isolamento de dados em SaaS
