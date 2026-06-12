## 📖 Documentação Funcional e Regras de Negócio

Este documento descreve as diretrizes arquiteturais, fluxos de dados e regras operacionais que sustentam o Sistema de Agendamento Acadêmico. A aplicação foi projetada focando na experiência do usuário (UX) e na integridade dos dados durante todo o ciclo de vida de uma solicitação.

---

### 1. Fluxo de Navegação e Estados da Interface

O sistema opera sob o conceito de Estados Dinâmicos Reativos. A tela é dividida estrategicamente em dois painéis que se comunicam em tempo real:

* **Painel de Entrada (Formulário):** Funciona como um assistente passo a passo (Wizard). Conforme o estudante preenche os dados, gatilhos internos atualizam os elementos visuais seguintes. A seleção de um docente, por exemplo, renderiza instantaneamente um cartão com suas informações institucionais, seguido pela liberação exclusiva dos horários em que aquele profissional está disponível.
* **Painel de Saída (Mural de Agendamentos):** Funciona como uma central de monitoramento. Ele consome o estado global de agendamentos e aplica filtros lógicos instantâneos com base na aba selecionada pelo usuário, sem a necessidade de recarregar a página.

---

### 2. Regras de Negócio e Validações

Para garantir a consistência das informações enviadas e evitar sobrecarga nos servidores ou dados corrompidos, o sistema aplica as seguintes regras na camada de cliente:

* **Validação de Identidade e Contato:** O campo destinado ao WhatsApp do estudante possui um interceptador de digitação. Ele impede a inserção de letras ou caracteres especiais inválidos, aplicando automaticamente a máscara padrão de telefonia brasileira. Isso garante que os professores consigam iniciar um contato direto sem erros de digitação.
* **Controle de Escopo da Solicitação:** O campo de descrição do problema possui um limitador severo de caracteres com um contador regressivo visual. Essa regra força o estudante a ser objetivo na exposição do seu problema acadêmico e previne ataques de injeção de texto massivo na interface.
* **Prevenção de Conflitos de Agenda:** Os botões de seleção de horário operam em modo de escolha única por formulário. Ao clicar em um horário, o estado anterior é limpo e a nova escolha é destacada, impedindo o envio de múltiplos horários em uma mesma janela de requisição.

---

### 3. Ciclo de Vida de um Agendamento

Cada agendamento criado entra em um fluxo de estados bem definido, representado visualmente por cores semânticas para facilitar a identificação rápida pelo usuário:

1.  **Pendente (Amarelo):** O estado inicial de qualquer solicitação. Significa que o aluno enviou o formulário com sucesso e o pedido está na fila aguardando a avaliação do docente.
2.  **Aceita (Verde):** Ocorre quando o professor valida a solicitação e confirma a reunião. O card ganha destaque positivo e indica que o compromisso está firmado.
3.  **Recusada (Vermelho):** Caso o professor não tenha disponibilidade ou o tema não seja pertinente, a solicitação é movida para este estado. O card perde opacidade para indicar um item arquivado.
4.  **Cancelada (Cinza):** Estado acionado pelo próprio estudante caso ele desista da mentoria ou precise refazer o processo. 

---

### 4. Engenharia de UX e Segurança de Ações

* **Confirmação Destrutiva:** Operações que alteram drasticamente o estado do sistema ou removem dados (como o cancelamento de uma reunião) passam obrigatoriamente por uma barreira de segurança. Um modal de confirmação intercepta o clique do usuário, exigindo uma dupla validação antes de efetivar a exclusão.
* **Notificações Flutuantes (Toasts):** Qualquer resposta do sistema (seja um sucesso no agendamento, um alerta de campo incompleto ou uma falha de rede) é comunicada através de alertas temporários no canto da tela. Eles possuem temporizadores independentes e não interrompem o fluxo de trabalho do usuário.