const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories)
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  const techsArrays = techs.split(',').map(tech=>tech.trim())
  const likes = 0;
  
  const repository = {
    id: uuid(),
    title,
    url,
    techs:techsArrays,
    likes
  }
  
  repositories.push(repository)

  return response.status(201).json(repository)

});

app.put("/repositories/:id", (request, response) => {
  const {title, url, techs} = request.body;
  const techsArrays = techs.split(',').map(tech=>tech.trim())
  const {id} = request.params;
  

  const repositoriesIndex = repositories.findIndex(repository=> repository.id===id)

  if(repositoriesIndex<0){
    return response.status(400).json({error:"project not found"})
  }

  const {likes} = repositories[repositoriesIndex]
  console.log(likes) 
  const repository= {
    id,
    title,
    url,
    tech:techsArrays,
    likes
  }

  repositories[repositoriesIndex] = repository

  return response.status(200).json(repository)

});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const repositoriesIndex = repositories.findIndex(repository=> repository.id===id)

  if(repositoriesIndex<0){
    return response.status(400).json({error:"project not found"})
  }

  repositories.splice(repositoriesIndex, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;
  
  const repositoriesIndex = repositories.findIndex(repository=> repository.id===id)

  if(repositoriesIndex<0){
    return response.status(400).json({error:"project not found"})
  }

  const {title, url, techs} = repositories[repositoriesIndex]
  console.log(techs)
  let {likes} = repositories[repositoriesIndex]
  likes+=1

  const repository= {
    id,
    title,
    url,
    techs,
    likes
  }

  repositories[repositoriesIndex] = repository

  return response.status(200).json(repository)

});

module.exports = app;
