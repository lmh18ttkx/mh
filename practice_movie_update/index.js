const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// 数据库连接配置
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mh18ttkx',  // 确保使用正确的数据库密码
  database: 'myapp'
});

// 建立数据库连接
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to the database.');
});

// 中间件配置
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// 获取所有电影
app.get('/movies', (req, res) => {
  db.query('SELECT * FROM movies', (err, results) => {
    if (err) return res.status(500).json({ error: 'Database query failed' });
    res.json(results);
  });
});

// 添加新电影
app.post('/movies', (req, res) => {
  const { title } = req.body;  // 电影名称修改为 title
  if (!title) return res.status(400).json({ error: 'Title is required' });

  db.query('INSERT INTO movies (title) VALUES (?)', [title], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database insert failed' });
    res.status(201).json({ id: result.insertId, title });  // 使用 title
  });
});

// 更新电影
app.put('/movies/:id', (req, res) => {
  const { id } = req.params;
  const { title } = req.body;  // 电影名称修改为 title
  if (!title) return res.status(400).json({ error: 'Title is required' });

  db.query('UPDATE movies SET title = ? WHERE id = ?', [title, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database update failed' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Movie not found' });
    res.json({ id, title });  // 使用 title
  });
});

// 删除电影
app.delete('/movies/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM movies WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database delete failed' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Movie not found' });
    res.status(204).send();
  });
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
