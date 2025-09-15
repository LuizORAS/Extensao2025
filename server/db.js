const Database = require('better-sqlite3');
const db = new Database('dev.db');

// Tabela de clientes
db.prepare(`
  CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    sobrenome TEXT,
    idade INTEGER,
    telefone TEXT,
    quantidade_cortes INTEGER DEFAULT 0,
    total_gasto REAL DEFAULT 0,
    email TEXT,
    data_cadastro TEXT DEFAULT (datetime('now'))
  )
`).run();

// Tabela de agendamentos
db.prepare(`
  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente INTEGER NOT NULL,
    data TEXT NOT NULL,
    horario_inicio TEXT NOT NULL,
    horario_fim TEXT NOT NULL,
    valor_corte REAL,
    servico TEXT,
    notas TEXT,
    FOREIGN KEY (cliente) REFERENCES clients(id)
  )
`).run();

// Tabela de orçamento
db.prepare(`
  CREATE TABLE IF NOT EXISTS budget (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente INTEGER,
    cliente_nome TEXT,
    valor REAL,
    status_pagamento TEXT,
    data TEXT,
    notas TEXT,
    FOREIGN KEY (cliente) REFERENCES clients(id)
  )
`).run();

// Tabela de login
db.prepare(`
  CREATE TABLE IF NOT EXISTS login (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL,
    telefone TEXT,
    nome TEXT,
    sobrenome TEXT,
    criado_em TEXT DEFAULT (datetime('now'))
  )
`).run();

module.exports = db;