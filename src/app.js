const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request,response, next){
  const {id} = request.params
  if(!isUuid(id)){
    return response.status(400).json({error: 'Invalid Project: ID'})
  }

  return next();
}

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories)
});

app.post("/repositories" , (request, response) => {
  const { url, title, techs} = request.body;
  
  const repository = {
    id: uuid(),
    url,
    title,
    techs,
    likes:0
  }
  
  repositories.push(repository)

  // Toda vez que criar um novo repository, e necessario retorna ele... tem um test la para isso...
  return response.json(repository)

});

app.put("/repositories/:id", validateRepositoryId, (request, response) => {
  const {title, url, techs} = request.body;
  const {id} = request.params;
  
  const repositoriesIndex = repositories.findIndex(repository=> repository.id===id)

  if(repositoriesIndex<0){
    return response.status(400).json({error:"project not found"})
  }

  const repository= {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoriesIndex].likes
  }

  repositories[repositoriesIndex] = repository

  return response.json(repository)

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
    return response.status(400).json({error:"repository not found"})
  }
  // soh estou com o discord no noot, caso esteja enviando mensagem por lá
  const likes = repositories[repositoriesIndex].likes += 1

  console.log(likes);//PERA SOH UM MINUTO
  return response.json({ likes })

});

module.exports = app;
