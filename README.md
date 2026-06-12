# 📅 Sistema de Agendamento Acadêmico

<p align="center">
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/SEU-USUARIO/agendamento-reunioes?color=%232f4050">
  <img alt="Repository size" src="https://img.shields.io/github/repo-size/SEU-USUARIO/agendamento-reunioes?color=%232f4050">
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/SEU-USUARIO/agendamento-reunioes?color=%232f4050">
</p>

<p align="center">
  <a href="#-sobre-o-projeto">Sobre</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-funcionalidades">Funcionalidades</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-como-executar">Como Executar</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-layout-e-arquitetura">Interface</a>
</p>

---

## 💻 Sobre o Projeto

O **Sistema de Agendamento Acadêmico** é uma aplicação web moderna voltada para o ambiente universitário. O objetivo principal é mitigar os gargalos de comunicação entre o corpo docente e os estudantes, oferecendo uma plataforma centralizada para a solicitação, controle e aprovação de mentorias e reuniões pedagógicas.

A aplicação foi totalmente portada de uma arquitetura estática (HTML/JS legados) para um ecossistema **Single Page Application (SPA)** dinâmico, garantindo reatividade instantânea na gestão dos agendamentos.

---

## ⚙️ Funcionalidades

### 🔹 Módulo de Solicitação (Alunos)
* **Seleção Inteligente de Docentes:** Renderização automatizada do perfil do professor selecionado (matérias, dias de atendimento e cargo).
* **Grade de Horários Dinâmica:** Botões interativos que mudam de estado para selecionar o horário desejado.
* **Formatos de Reunião:** Seleção visual intuitiva entre o modelo *Presencial* ou *Remoto*.
* **Máscara de Entrada:** Campo de WhatsApp com formatação automatizada e tratamento de dados.
* **Contador de Caracteres:** Feedback em tempo real no campo de descrição do problema acadêmico.

### 🔹 Módulo de Gestão (Painel Geral)
* **Filtros por Abas (Tabs):** Separação cirúrgica de agendamentos por status (*Pendentes*, *Aceitas*, *Recusadas*, *Canceladas*) com contadores numéricos individuais.
* **Estilização Semântica:** Cards de agendamento que mudam de cor na borda esquerda baseados no estado atual da reunião.
* **Feedback de UX:** Toasts de notificação flutuantes e modais de confirmação customizados que previnem exclusões acidentais.

---

## 🛠️ Tecnologias

As seguintes ferramentas, linguagens e bibliotecas foram utilizadas no desenvolvimento do projeto:

- **[React 18](https://react.dev/)** — Biblioteca base para construção da interface baseada em componentes.
- **[TypeScript](https://www.typescriptlang.org/)** — Tipagem estática para maior segurança e manutenibilidade do código.
- **[Vite](https://vite.dev/)** — Ferramenta de build de última geração para um ambiente de desenvolvimento ultra-rápido.
- **CSS3 Core (Grid & Flexbox)** — Arquitetura de estilização responsiva sem dependência de frameworks pesados.
- **Font Awesome Icons** — Conjunto de ícones vetoriais integrados de forma semântica.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
Antes de começar, você vai precisar ter instalado em sua máquina o [Git](https://git-scm.com) e o [Node.js](https://nodejs.org/en/).

```bash
# 1. Clone este repositório
$ git clone [https://github.com/SEU-USUARIO/agendamento-reunioes.git](https://github.com/SEU-USUARIO/agendamento-reunioes.git)

# 2. Acesse a pasta do projeto no terminal
$ cd agendamento-reunioes

# 3. Instale as dependências listadas no package.json
$ npm install

# 4. Execute a aplicação em modo de desenvolvimento
$ npm run dev

# O servidor iniciará na porta padrão do Vite.
# Abra o navegador e acesse: http://localhost:5173