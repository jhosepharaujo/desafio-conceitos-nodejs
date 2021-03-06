const express = require("express");
const cors = require("cors");

const { uuid, isUuid} = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function validateRepositoryId (request, response, next) {
  const {id} = request.params
  if(!isUuid(id)) {
    return response.status(400).json({error : "Ivalid repository ID"})
  }
  return next()
}

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const {title, url, techs } = request.body
  
  const repository = {
    id : uuid(),
    title,
    url,
    techs,
    likes : 0
  }

  repositories.push(repository)

  return response.json(repository)
});

app.put("/repositories/:id", validateRepositoryId, (request, response) => {
  const { id } = request.params
  const {title, url, techs } = request.body

  const repositoryIndex = repositories.findIndex(repository => repository.id == id)

  if(repositoryIndex < 0){
    return response.status(404).json({error: "Repository not found."})
  }

  const repository = {
    id, 
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  }

  repositories[repositoryIndex] = repository

  return response.json(repository)
  
});

app.delete("/repositories/:id", validateRepositoryId, (request, response) => {
  const { id } = request.params
  const repositoryIndex = repositories.findIndex(repository => repository.id == id)

  if(repositoryIndex < 0){
    return response.status(404).json({error: "Repository not found."})
  }

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", validateRepositoryId, (request, response) => {
  const { id } = request.params
  const repository = repositories.find(repository => repository.id == id)
  if(!repository) {
    return response.status(400).json({error: "Repository not found."})
  }
  repository.likes += 1
  return response.json(repository)
});

module.exports = app;
