# PlannerBarbeiro

Aplicação inteligente para gestão de barbearia.

## Descrição
O PlannerBarbeiro é um sistema web moderno para organização, agendamento e controle de serviços em barbearias. Ele oferece uma interface intuitiva, visual atraente e recursos pensados para facilitar o dia a dia do barbeiro e do cliente.

## Funcionalidades
- Página de boas-vindas com imagem de fundo e destaque para o nome do sistema
- Navegação entre páginas (Home, Serviços, Sobre, Contato, Perfil)
- Layout responsivo com header fixo no topo e footer fixo na base
- Botões de navegação e ações principais
- Utilização de React, Vite e React Router DOM.


## Como rodar o projeto

### Front-end
1. Instale as dependências:
  ```bash
  npm install
  ```
2. Inicie o servidor de desenvolvimento:
  ```bash
  npm run dev
  ```
3. Acesse `http://localhost:5173` no navegador

### Back-end (server)
1. Acesse a pasta `server`:
  ```bash
  cd server
  ```
2. Instale as dependências do backend:
  ```bash
  npm install
  ```
3. Inicie o servidor de desenvolvimento:
  ```bash
  npm run dev
  ```
  O backend estará disponível em `http://localhost:4000`

#### Banco de dados
- O banco de dados é salvo no arquivo `server/dev.db` (SQLite).
- Para transferir o backend para outro computador, basta copiar o arquivo `dev.db` junto com os arquivos do backend e rodar `npm install` e `npm run dev` na pasta `server`.

#### Endpoints principais
- `/api/clients` — Gerenciamento de clientes
- `/api/appointments` — Agendamentos
- `/api/budget` — Orçamentos
- `/api/login` — Usuários/login

---

## Estrutura de pastas
```
PlannerBarbeiro/
  src/
    Components/
      Header.tsx
      Footer.tsx
      WelcomePage.tsx
      ...
    assets/
      logoBarbeiros.png
  index.html
  package.json
  README.md
  ...
```

## Tecnologias
- React
- Vite
- TypeScript
- React Router DOM

## Autor
LuizORAS

---
© 2023 PlannerBarbeiro. Todos os direitos reservados.
