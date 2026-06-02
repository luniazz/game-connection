# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

# Instruções para Claude Code – Game Connection

## Objetivo
Trabalhar no projeto Game Connection com segurança, organização e controle de versão.

## Regras de Git
- Sempre executar `git status` antes de alterar arquivos.
- Fazer alterações pequenas e controladas.
- Após cada melhoria concluída, executar `git status`.
- Criar commit com mensagem clara.
- Não executar `git push` sem confirmação do usuário.
- Não apagar arquivos importantes sem confirmação.

## Validação
- Sempre que possível, rodar `npm run build` antes de commitar.
- Se houver erro, explicar o erro e não commitar sem avisar.
- Caso o erro seja externo, como falha de rede ou fonte remota, registrar isso na resposta.

## Proteção contra perda de trabalho
- Antes de alterações grandes, recomendar um commit de segurança.
- Se uma alteração causar problema, orientar rollback com `git restore .` ou `git reset --hard HEAD`.

## Estilo de trabalho
- Priorizar alterações compatíveis com o projeto.
- Manter a identidade visual do Game Connection.
- Evitar adicionar bibliotecas desnecessárias.
- Manter acessibilidade, responsividade e clareza dos textos.
- Respeitar a estrutura atual do projeto Next.js, React, TypeScript e Tailwind CSS.

---

## Commands

```bash
npm run dev      # Iniciar servidor de desenvolvimento
npm run build    # Build de produção
npm run start    # Iniciar servidor de produção
npm run lint     # Executar ESLint
```

## Arquitetura

**Game Connection** é um app Next.js 16 (App Router) para conectar gamers brasileiros. Todo o texto da UI está em português (pt-BR).

### Estrutura de diretórios

- `app/` — Páginas do App Router. Cada subdiretório é uma rota.
- `components/` — Componentes React compartilhados entre páginas.
- `public/assets/img/` — Ícones SVG e logo da marca.

### Páginas

| Rota | Arquivo | Propósito |
|---|---|---|
| `/` | `app/page.tsx` | Landing page com animação de digitação e contador de usuários |
| `/cadastro` | `app/cadastro/page.tsx` | Formulário de cadastro com medidor de força de senha; redireciona para `/feedback` |
| `/feedback` | `app/feedback/page.tsx` | Página de sucesso pós-cadastro com confete e auto-redirect em 10 s |
| `/dados` | `app/dados/page.tsx` | Dados de mercado: simuladores de crescimento/saturação (SVG), cards via API RAWG e tabela filtrável |
| `/sobre` | `app/sobre/page.tsx` | Página sobre o projeto |

### Layout compartilhado

`app/layout.tsx` envolve todas as páginas com:
- `Navbar` — barra fixa no topo (72 px), hamburger responsivo no mobile, destaque de rota ativa via `usePathname`
- `ThemeToggle` — botão flutuante (inferior direito) que aplica filtro CSS grayscale/contraste no `<html>` como "modo foco"
- `Footer` — rodapé simples

### Componentes

- `CardStat` — card de contagem animada (ícone + número + label). Props: `finalValue`, `text`, `suffix` (opcional).
- Todos os componentes usam `'use client'` pois dependem de hooks React.

### Design system (Tailwind)

Tokens definidos em `tailwind.config.ts`:

| Token | Valor |
|---|---|
| `brand-dark` | `#02011E` (fundo das páginas) |
| `brand-surface` | `#0A092D` (fundo de cards/painéis) |
| `brand-green` | `#1DE56D` (cor de destaque principal) |
| `brand-hover` | `#00ff66` (estado hover) |

Padrão de botão usado em todo o projeto: `bg-brand-green text-brand-dark font-extrabold rounded-lg shadow-[0_4px_0_0_#0ea149] hover:bg-brand-hover hover:-translate-y-1`.

Efeito de glow de fundo: `div` absolutamente posicionada com `bg-brand-green/10 ... blur-[120px]`.

Fonte: **Geologica** carregada via `next/font/google`, aplicada no `<body>`.

### API Externa

`/dados` busca jogos cooperativos na [RAWG API](https://rawg.io/apidocs). A chave de API está em `app/dados/page.tsx:93`. A busca ocorre dentro de `useEffect` com tratamento de erro.

### Path alias

`@/*` resolve para a raiz do projeto (configurado em `tsconfig.json`). Ex.: `import CardStat from "@/components/CardStat"`.

### Acessibilidade

O projeto usa consistentemente atributos ARIA (`aria-label`, `aria-describedby`, `aria-live`, `role`, `aria-invalid`, etc.) em elementos interativos e gráficos. Preserve-os ao modificar componentes.
