# StapNova - CRM para Fundadores de Startup

Um SaaS CRM completo com Pipeline Kanban, desenvolvido com React, Supabase e DaisyUI.

## 🚀 Funcionalidades

- ✅ **Autenticação completa** (Login/Cadastro)
- 📊 **Dashboard** com métricas e estatísticas
- 🎯 **Pipeline Kanban** para gerenciar leads
- 👥 **Gestão de Leads** com busca e filtros
- 👤 **Perfil de usuário** editável
- 🌓 **Tema claro/escuro**
- 📱 **Design responsivo**

## 🎨 Tecnologias

- **React** - Framework frontend
- **Supabase** - Backend e autenticação
- **DaisyUI** - Componentes UI
- **Tailwind CSS** - Estilização
- **React Router** - Navegação
- **React Icons** - Ícones

## 📋 Pré-requisitos

- Node.js (v14 ou superior)
- Conta no Supabase
- npm ou yarn

## 🔧 Configuração

### 1. Clone o repositório

```bash
cd stapnova
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o Supabase

1. Crie uma conta em [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Execute o SQL do arquivo `supabase_schema.sql` no SQL Editor do Supabase
4. Copie as credenciais do projeto (URL e Anon Key)

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto `stapnova`:

```env
REACT_APP_SUPABASE_URL=sua_url_do_supabase
REACT_APP_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
```

**Onde encontrar as credenciais:**
- Acesse seu projeto no Supabase
- Vá em Settings > API
- Copie a `Project URL` e a `anon public` key

### 5. Inicie o servidor de desenvolvimento

```bash
npm start
```

O aplicativo estará disponível em `http://localhost:3000`

## 📱 Estrutura do Projeto

```
stapnova/
├── src/
│   ├── components/       # Componentes reutilizáveis
│   │   ├── Layout.js     # Layout principal com sidebar
│   │   └── Sidebar.js    # Menu lateral
│   ├── contexts/         # Contextos React
│   │   ├── AuthContext.js    # Autenticação
│   │   └── ThemeContext.js   # Tema claro/escuro
│   ├── pages/            # Páginas da aplicação
│   │   ├── Login.js      # Página de login
│   │   ├── Cadastro.js   # Página de cadastro
│   │   ├── Dashboard.js  # Dashboard principal
│   │   ├── Kanban.js     # Pipeline Kanban
│   │   ├── Leads.js      # Listagem de leads
│   │   └── Perfil.js     # Perfil do usuário
│   ├── config/           # Configurações
│   │   └── supabase.js   # Cliente Supabase
│   ├── App.js            # Componente principal
│   └── index.js          # Ponto de entrada
├── public/               # Arquivos públicos
└── package.json          # Dependências
```

## 🎯 Como Usar

### Primeiro Acesso

1. Acesse `http://localhost:3000`
2. Clique em "Cadastre-se"
3. Preencha seus dados e crie uma conta
4. Você será redirecionado para o Dashboard

### Dashboard

- Visualize métricas importantes:
  - Usuários testando
  - Clientes convertidos
  - Taxa de conversão
  - Total de leads
- Veja os leads mais recentes

### Pipeline Kanban

- Visualize leads organizados por estágio:
  - **Conversando** - Acabou de manifestar interesse
  - **Demo Agendada** - Vai ver o produto
  - **Testando** - Está no trial/beta
  - **Cliente** - Converteu (pagando)
- Clique em "Novo Lead" para adicionar
- Arraste leads entre colunas ou use o seletor de estágio
- Edite ou exclua leads pelo menu (•••)

### Leads

- Visualize todos os leads em formato de tabela
- Use a busca para encontrar leads específicos
- Filtre por estágio
- Adicione, edite ou exclua leads

### Perfil

- Atualize suas informações pessoais
- Altere nome, empresa e telefone
- Visualize informações da conta

### Tema

- Alterne entre tema claro e escuro
- Clique no botão de tema na sidebar
- A preferência é salva automaticamente

## 🔒 Segurança

- Autenticação via Supabase Auth
- Row Level Security (RLS) habilitado
- Cada usuário só acessa seus próprios dados
- Senhas criptografadas

## 🚀 Deploy

### Vercel (Recomendado)

1. Instale a CLI da Vercel:
```bash
npm i -g vercel
```

2. Faça o deploy:
```bash
vercel
```

3. Configure as variáveis de ambiente no painel da Vercel:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`

### Outras Plataformas

O projeto pode ser deployado em qualquer plataforma que suporte React:
- Netlify
- GitHub Pages
- AWS Amplify
- Firebase Hosting

## 📝 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## 📧 Suporte

Para dúvidas ou suporte, abra uma issue no repositório.

---

Desenvolvido com ❤️ para fundadores de startups
