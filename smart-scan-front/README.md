# 🛍️ SmartScan - Busca de Produtos por Foto

Aplicação web moderna para busca de produtos com funcionalidade de pesquisa por texto e upload de imagens. Desenvolvida com React, TypeScript e Tailwind CSS.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat&logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-7.2.2-646CFF?style=flat&logo=vite)

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Como Usar](#como-usar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

## 🎯 Sobre o Projeto

SmartScan é uma aplicação de e-commerce moderna que permite aos usuários buscar produtos de duas maneiras:

1. **Busca por Texto**: Digite o nome ou categoria do produto
2. **Busca por Imagem**: Faça upload de uma foto do produto para encontrar itens similares

A interface é totalmente responsiva, funcionando perfeitamente em dispositivos móveis, tablets e desktops.

## ✨ Funcionalidades

### 🔍 Busca Inteligente
- Busca em tempo real por nome ou categoria
- Filtragem instantânea dos resultados
- Interface case-insensitive

### 📸 Upload de Imagens
- Suporte para JPG, PNG e GIF
- Preview da imagem antes do processamento
- Simulação de processamento backend
- Feedback visual durante o upload

### 🎨 Interface do Usuário
- Design moderno e minimalista
- Grid responsivo de produtos (1-4 colunas)
- Cards com hover effects
- Modal de detalhes do produto
- Animações suaves e transitions
- Bottom sheet no mobile, modal centralizado no desktop

### 📦 Detalhes do Produto
- Imagem em alta resolução
- Informações completas (nome, preço, categoria)
- Sistema de avaliação (estrelas)
- Especificações técnicas
- Botões de ação (Adicionar ao carrinho, Favoritar)
- Feedback visual ao realizar ações

### 📱 Responsividade
- **Mobile** (< 640px): 1 coluna, layout vertical
- **Tablet** (640px - 1024px): 2 colunas, barra de busca otimizada
- **Desktop** (> 1024px): 3-4 colunas, layout completo

## 🚀 Tecnologias

### Core
- **[React 19.2.0](https://react.dev/)** - Biblioteca JavaScript para interfaces
- **[TypeScript 5.9.3](https://www.typescriptlang.org/)** - Superset tipado do JavaScript
- **[Vite 7.2.2](https://vitejs.dev/)** - Build tool e dev server

### Styling
- **[Tailwind CSS 3.4](https://tailwindcss.com/)** - Framework CSS utility-first
- **[PostCSS](https://postcss.org/)** - Processador CSS
- **[Autoprefixer](https://github.com/postcss/autoprefixer)** - Plugin para vendor prefixes

### Utilidades
- **[clsx](https://github.com/lukeed/clsx)** - Utilitário para classes condicionais

### Dev Tools
- **[ESLint](https://eslint.org/)** - Linter para JavaScript/TypeScript
- **[TypeScript ESLint](https://typescript-eslint.io/)** - Parser ESLint para TypeScript

## 📋 Pré-requisitos

Certifique-se de ter instalado em sua máquina:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 ou **yarn** >= 1.22.0

## 🔧 Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/ZeroLuan/Smart-Scan.git
cd Smart-Scan/Front/smart-scan-front
```

2. **Instale as dependências**
```bash
npm install
```

3. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

4. **Acesse a aplicação**
```
Abra http://localhost:5173 no seu navegador
```

## 📖 Como Usar

### Busca por Texto
1. Digite o nome do produto ou categoria no campo de busca
2. Os resultados são filtrados automaticamente em tempo real
3. Clique em "Ver Detalhes" para mais informações

### Busca por Imagem
1. Clique no botão "Buscar por Foto" (ícone de câmera)
2. Selecione uma imagem do seu dispositivo (JPG, PNG ou GIF)
3. Visualize o preview da imagem
4. Aguarde o processamento (simulado)
5. Veja os produtos similares encontrados

### Visualizar Detalhes
1. Clique no botão "Ver Detalhes" em qualquer card de produto
2. No modal, você pode:
   - Ver a imagem em tamanho grande
   - Ler a descrição completa
   - Conferir as especificações técnicas
   - Adicionar ao carrinho ou favoritar
3. Feche o modal clicando no X, fora do modal, ou pressionando ESC

## 📁 Estrutura do Projeto

```
smart-scan-front/
├── public/                      # Arquivos públicos estáticos
├── src/
│   ├── components/             # Componentes React
│   │   ├── product-card.tsx   # Card individual de produto
│   │   ├── product-grid.tsx   # Grid de produtos
│   │   ├── product-modal.tsx  # Modal de detalhes
│   │   └── product-search.tsx # Barra de busca e upload
│   ├── lib/
│   │   └── utils.ts           # Funções utilitárias e dados mock
│   ├── App.css                # Estilos do componente App
│   ├── App.tsx                # Componente principal
│   ├── index.css              # Estilos globais e Tailwind
│   └── main.tsx               # Entry point da aplicação
├── .gitignore
├── eslint.config.js           # Configuração do ESLint
├── index.html                 # HTML base
├── package.json               # Dependências e scripts
├── postcss.config.js          # Configuração do PostCSS
├── tailwind.config.js         # Configuração do Tailwind
├── tsconfig.json              # Configuração do TypeScript
├── tsconfig.app.json          # Config TypeScript (app)
├── tsconfig.node.json         # Config TypeScript (node)
├── vite.config.ts             # Configuração do Vite
└── README.md
```

## 📜 Scripts Disponíveis

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build de produção
npm run preview

# Lint do código
npm run lint
```

## 🎨 Paleta de Cores

- **Primária**: `#3B82F6` (Azul)
- **Secundária**: `#F3F4F6`, `#E5E7EB`, `#1F2937` (Cinzas)
- **Acento**: `#F59E0B` (Laranja/Amber)
- **Fundo**: `#FFFFFF` (Branco)

## 🔄 Fluxo de Dados

```
App.tsx
  ├─ ProductSearch → handleSearchChange / handleImageUpload
  ├─ ProductGrid → handleViewDetails
  └─ ProductModal → handleCloseModal
```

## 📱 Breakpoints Responsivos

```css
/* Mobile */
< 640px (sm)

/* Tablet */
640px - 1024px (sm-lg)

/* Desktop */
> 1024px (lg+)
```

## 🤝 Contribuindo

Contribuições são sempre bem-vindas!

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 👥 Autores

- **ZeroLuan** - [GitHub](https://github.com/ZeroLuan)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Contato

Projeto Link: [https://github.com/ZeroLuan/Smart-Scan](https://github.com/ZeroLuan/Smart-Scan)

---

⌨️ Desenvolvido com React + TypeScript + Tailwind CSS
