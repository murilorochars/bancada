const express = require('express');
const mysql = require('mysql');
const app = express();

app.use(express.json());


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root123',
  database: 'comentarios_db'
});


db.connect((err) => {
  if (err) {
    console.log('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conectado ao banco de dados');
  }
});


app.post('/comment/:id', async (req, res) => {
  const id = req.params.id;
  const content = req.body.content;

  if (!content) {
    return res.sendStatus(400);
  }

  const query = 'INSERT INTO comments (id, content) VALUES (?, ?)';
  db.query(query, [id, content], (err) => {
    if (err) {
      console.log('Erro ao inserir comentário:', err);
      return res.sendStatus(500);
    }

    res.status(201).json({
      id: id
    });
  });
});


app.get('/comment/:id', (req, res) => {
  const id = req.params.id;

  const query = 'SELECT content FROM comments WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.log('Erro ao obter comentário:', err);
      return res.sendStatus(500);
    }

    if (result.length === 0) {
      return res.sendStatus(404);
    }

    res.json({
      content: result[0].content
    });
  });
});


app.patch('/comment/:id', (req, res) => {
  const id = req.params.id;
  const content = req.body.content;

  if (!content) {
    return res.sendStatus(400);
  }

  const query = 'UPDATE comments SET content = ? WHERE id = ?';
  db.query(query, [content, id], (err) => {
    if (err) {
      console.log('Erro ao atualizar comentário:', err);
      return res.sendStatus(500);
    }

    res.status(201).json({
      id: id,
      content: content
    });
  });
});


app.delete('/comment/delete/:id', (req, res) => {
  const id = req.params.id;

  const query = 'DELETE FROM comments WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.log('Erro ao excluir comentário:', err);
      return res.sendStatus(500);
    }

    if (result.affectedRows === 0) {
      return res.sendStatus(404);
    }

    res.status(201).json({
      id: id,
      status: 'deleted'
    });
  });
});

app.listen(3000, () => console.log('Ouvindo na porta 3000...'));
