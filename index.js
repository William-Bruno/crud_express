const express = require('express');

const server = express();
//Express entender entradas co JSON
server.use(express.json());

//Constante para armazenar os dados na memoria
const projects = [];

//Função para verificar se o projeto existe
function checkProjectExists(req, res, next){
  const {id} = req.params;
  const project = projects.find(projectId => projectId.id == id);

  if(!project){
    return res.status(400).json({
      error: "Project not found!"
    });
  }
  return next();
}

//Função para contar as requisições no servidor
function logRequests(req, res, next){
  console.count("Number of requests");
  return next();
}

server.use(logRequests);

//Listar todos os projetos
server.get('/projects', (req, res) =>{
  return res.json(projects);
});

//Criar novo projeto
server.post('/projects', (req, res) =>{
  const {id, title} = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);
  return res.json(projects);
});

//Atualizar titulo do projeto, buscando pelo id
server.put('/projects/:id', checkProjectExists, (req, res) =>{
  const {id} = req.params;
  const {title} = req.body;

  const project = projects.find(projectId => projectId.id == id) ;

  project.title = title;

  return res.json(projects);
});

// Deletando projeto, buscando pelo id
server.delete('/projects/:id', checkProjectExists, (req, res) =>{
  const {id} = req.params;

  projects.splice(id, 1);

  return res.send();
});

//Adicionando as tarefas nos projetos, de acordo com o id do projeto
server.post('/projects/:id/tasks', checkProjectExists, (req, res) =>{
  const {id} = req.params;
  const {title} = req.body;

  const project = projects.find(projectId => projectId.id == id);
  project.tasks.push(title);

  return res.json(project);
});

// Rodando servidor na porta 3030
server.listen(3030);
