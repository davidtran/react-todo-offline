const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

let todos = [];
let id = 99999;
let port = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('combine'));
app.get('/', (req,res) => {
  res.json(todos).send();
});

app.post('/', bodyParser.json(), (req, res) => {
  console.log(req.body);
  todos.push({
    content: req.body.content,
    id: id++
  });
  res.json({id: id}).send();
});

app.delete('/:id', (req, res) => {
  let index = todos.findIndex(item => item.id === req.query.id);
  todos.splice(index, 1);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log('App is started at port ' + port);
});