# PlannerBarbeiro

Aplicação para gestão de barbearia — agendamentos, clientes e finanças.

## Descrição
O PlannerBarbeiro é um sistema web simples e moderno para organização e controle de serviços em barbearias. Oferece gerenciamento de clientes, agendamentos, visão financeira e uma interface responsiva construída com React + Vite.

## Principais funcionalidades
- Agendamento de serviços com verificação de conflitos
- Gestão de clientes
- Visão geral financeira e estatísticas
- Páginas de autenticação (login/recuperação/criação)
- Layout responsivo e tema (dark / light / slight-dark)

## Pré-requisitos
- Node.js 16+ (recomendado 18+)
- npm (ou pnpm/yarn)

## Variáveis de ambiente
Crie um arquivo `.env` na raiz do frontend (opcional) para apontar o backend durante o desenvolvimento:

```
VITE_API_URL=http://localhost:4000
```

O backend, por padrão, escuta em `http://localhost:4000`.

## Rodando em desenvolvimento

### Frontend
1. Instale dependências:

```powershell
npm install
```

2. Verifique tipos TypeScript (opcional, útil para contribuidores):

```powershell
npx tsc --noEmit
```

3. Inicie o dev server:

```powershell
npm run dev
```

Abra `http://localhost:5173` no navegador.

### Backend
1. Entre na pasta do servidor e instale dependências:

```powershell
cd server
npm install
```

2. Inicie o servidor de desenvolvimento:

```powershell
npm run dev
```

O backend estará disponível em `http://localhost:4000`.

## Banco de dados
- O backend usa SQLite por padrão. O arquivo do banco é `server/dev.db`.
- Para mover o backend para outra máquina, copie `server/dev.db` junto dos arquivos do servidor.

## Endpoints principais
- `GET /api/clients` — listar/gerenciar clientes
- `GET|POST /api/appointments` — listar e criar agendamentos
- `PUT|DELETE /api/appointments/:id` — atualizar/remover agendamento
- `POST /api/login` — autenticação

## Build / Produção
- Para gerar o build do frontend:

```powershell
npm run build
```

- Os arquivos gerados ficam em `dist/` por padrão; sirva-os com um servidor estático (nginx, serve, express) ou integre ao backend conforme necessário.

## Troubleshooting rápido
- Se as cores/estilos não aparecerem como esperado, limpe o cache do navegador e reinicie o dev server.
- Se ocorrerem erros de tipos, rode `npx tsc --noEmit` para localizar problemas TypeScript.
- Verifique `VITE_API_URL` em `.env` se o frontend não conseguir alcançar o backend.

## Estrutura de pastas (resumida)
```
PlannerBarbeiro/
  src/
    Components/
    assets/
  server/
    dev.db
    index.js
  package.json
  README.md
```

## Tecnologias
- React + TypeScript
- Vite
- Express (backend)
- SQLite (backend)

## Contribuindo
- Abra uma issue descrevendo o bug ou feature.
- Faça um fork, crie uma branch com sua alteração e abra um PR.

## Autor
LuizORAS

---
© 2025 PlannerBarbeiro. Todos os direitos reservados.
