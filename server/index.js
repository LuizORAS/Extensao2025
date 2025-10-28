const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors()); // Permite que o front-end acesse o back-end
app.use(express.json()); // Faz o servidor entender JSON das requisições

// --- Rotas para CLIENTS ---
app.get('/api/clients', (req, res) => {
  const rows = db.prepare('SELECT * FROM clients ORDER BY id DESC').all();
  res.json(rows);
});

app.get('/api/clients/:id', (req, res) => {
  const id = Number(req.params.id);
  const row = db.prepare('SELECT * FROM clients WHERE id = ?').get(id);
  if (!row) return res.status(404).json({ message: 'Cliente não encontrado' });
  res.json(row);
});

app.post('/api/clients', (req, res) => {
  const { nome, sobrenome, idade, telefone, quantidade_cortes, total_gasto, email } = req.body;
  if (!nome) return res.status(400).json({ message: 'Nome é obrigatório' });
  const info = db.prepare(
    'INSERT INTO clients (nome, sobrenome, idade, telefone, quantidade_cortes, total_gasto, email) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(
    nome,
    sobrenome || null,
    idade || null,
    telefone || null,
    quantidade_cortes || 0,
    total_gasto || 0,
    email || null
  );
  const created = db.prepare('SELECT * FROM clients WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(created);
});

app.put('/api/clients/:id', (req, res) => {
  const id = Number(req.params.id);
  const { nome, sobrenome, idade, telefone, quantidade_cortes, total_gasto, email } = req.body;
  db.prepare(`
    UPDATE clients
    SET nome = COALESCE(?, nome),
        sobrenome = COALESCE(?, sobrenome),
        idade = COALESCE(?, idade),
        telefone = COALESCE(?, telefone),
        quantidade_cortes = COALESCE(?, quantidade_cortes),
        total_gasto = COALESCE(?, total_gasto),
        email = COALESCE(?, email)
    WHERE id = ?
  `).run(
    nome, sobrenome, idade, telefone, quantidade_cortes, total_gasto, email, id
  );
  const updated = db.prepare('SELECT * FROM clients WHERE id = ?').get(id);
  if (!updated) return res.status(404).json({ message: 'Cliente não encontrado' });
  res.json(updated);
});

app.delete('/api/clients/:id', (req, res) => {
  const id = Number(req.params.id);
  db.prepare('DELETE FROM clients WHERE id = ?').run(id);
  res.status(204).send();
});

// --- Rotas para APPOINTMENTS ---
app.get('/api/appointments', (req, res) => {
  const rows = db.prepare(`
    SELECT a.*, c.nome as cliente_nome
    FROM appointments a
    LEFT JOIN clients c ON a.cliente = c.id
    ORDER BY a.data DESC
  `).all();
  res.json(rows);
});

app.post('/api/appointments', (req, res) => {
  const { cliente, data, horario_inicio, horario_fim, valor_corte, servico, notas } = req.body;
  if (!cliente || !data || !horario_inicio || !horario_fim) {
    return res.status(400).json({ message: 'Campos obrigatórios: cliente, data, horario_inicio, horario_fim' });
  }
  const info = db.prepare(
    'INSERT INTO appointments (cliente, data, horario_inicio, horario_fim, valor_corte, servico, notas) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(
    cliente, data, horario_inicio, horario_fim, valor_corte || null, servico || null, notas || null
  );
  const created = db.prepare('SELECT * FROM appointments WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(created);
});

app.put('/api/appointments/:id', (req, res) => {
  const id = Number(req.params.id);
  const { cliente, data, horario_inicio, horario_fim, valor_corte, servico, notas } = req.body;
  db.prepare(`
    UPDATE appointments
    SET cliente = COALESCE(?, cliente),
        data = COALESCE(?, data),
        horario_inicio = COALESCE(?, horario_inicio),
        horario_fim = COALESCE(?, horario_fim),
        valor_corte = COALESCE(?, valor_corte),
        servico = COALESCE(?, servico),
        notas = COALESCE(?, notas)
    WHERE id = ?
  `).run(cliente, data, horario_inicio, horario_fim, valor_corte, servico, notas, id);
  const updated = db.prepare('SELECT * FROM appointments WHERE id = ?').get(id);
  if (!updated) return res.status(404).json({ message: 'Agendamento não encontrado' });
  res.json(updated);
});

// Confirm payment for an appointment: create budget entry and mark appointment as paid+finalized
app.post('/api/appointments/:id/confirm-payment', (req, res) => {
  const id = Number(req.params.id);
  try {
  const ap = db.prepare('SELECT * FROM appointments WHERE id = ?').get(id);
  if (!ap) return res.status(404).json({ message: 'Agendamento não encontrado' });
  if (ap.paid && ap.finalized) return res.status(400).json({ message: 'Agendamento já marcado como pago' });

    // get client name if available
    let cliente_nome = null;
    if (ap.cliente) {
      const c = db.prepare('SELECT nome FROM clients WHERE id = ?').get(ap.cliente);
      if (c) cliente_nome = c.nome;
    }

    // create budget entry
    const info = db.prepare(
      'INSERT INTO budget (cliente, cliente_nome, valor, status_pagamento, data, notas) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(
      ap.cliente || null,
      cliente_nome,
      ap.valor_corte || 0,
      'paid',
      ap.data || null,
      `Pagamento do agendamento ${id}`
    );

    // update appointment flags
    db.prepare('UPDATE appointments SET paid = 1, finalized = 1 WHERE id = ?').run(id);

    const created = db.prepare('SELECT * FROM budget WHERE id = ?').get(info.lastInsertRowid);
    const updatedAp = db.prepare('SELECT * FROM appointments WHERE id = ?').get(id);

    // notify listeners (front-end) if needed
    try { /* no-op here on server */ } catch (e) {}

    res.json({ appointment: updatedAp, budget: created });
  } catch (err) {
    console.error('Erro ao confirmar pagamento do agendamento', err);
    res.status(500).json({ message: 'Falha ao confirmar pagamento' });
  }
});

app.delete('/api/appointments/:id', (req, res) => {
  const id = Number(req.params.id);
  db.prepare('DELETE FROM appointments WHERE id = ?').run(id);
  res.status(204).send();
});

// --- Rotas para BUDGET ---
app.get('/api/budget', (req, res) => {
  const rows = db.prepare('SELECT * FROM budget ORDER BY data DESC').all();
  res.json(rows);
});

app.post('/api/budget', (req, res) => {
  const { cliente, cliente_nome, valor, status_pagamento, data, notas } = req.body;
  if (!cliente || !valor) return res.status(400).json({ message: 'Cliente e valor são obrigatórios' });
  const info = db.prepare(
    'INSERT INTO budget (cliente, cliente_nome, valor, status_pagamento, data, notas) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(
    cliente, cliente_nome || null, valor, status_pagamento || null, data || null, notas || null
  );
  const created = db.prepare('SELECT * FROM budget WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(created);
});

app.delete('/api/budget/:id', (req, res) => {
  const id = Number(req.params.id);
  db.prepare('DELETE FROM budget WHERE id = ?').run(id);
  res.status(204).send();
});

// --- Rotas para LOGIN ---
app.get('/api/login', (req, res) => {
  const rows = db.prepare('SELECT id, user, email, telefone, nome, sobrenome, criado_em FROM login ORDER BY id DESC').all();
  res.json(rows);
});

app.post('/api/login', (req, res) => {
  const { user, email, senha, telefone, nome, sobrenome } = req.body;
  if (!user || !email || !senha) return res.status(400).json({ message: 'Usuário, email e senha são obrigatórios' });
  const info = db.prepare(
    'INSERT INTO login (user, email, senha, telefone, nome, sobrenome) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(user, email, senha, telefone || null, nome || null, sobrenome || null);
  const created = db.prepare('SELECT id, user, email, telefone, nome, sobrenome, criado_em FROM login WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(created);
});

// --- Rota de teste (healthcheck) ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});