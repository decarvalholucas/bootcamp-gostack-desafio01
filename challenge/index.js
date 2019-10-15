const express = require('express')
const server = express()

server.use(express.json())

const projects = []
let quantityRequests = 0

server.use((req, res, next) => {
  quantityRequests++
  console.log(`Quantidade de requisições: ${quantityRequests}`)
  return next()
})

function verifyProjectExists(req, res, next) {
  const { project_id } = req.params
  if (!projects.find(project => project.id === project_id)) {
    return res.status(400).json({ error: "Project not found" })
  }
  return next()
}

server.get('/projects', (req, res) => {
  return res.json(projects)
})

server.post('/projects', (req, res) => {
  const { id, title } = req.body
  projects.push({ id, title, tasks: [] })
  return res.json(projects)
})

server.post('/projects/:project_id/tasks', verifyProjectExists, (req, res) => {
  const { project_id } = req.params
  const { task_title } = req.body
  const project = projects.find(project => project.id === project_id)
  project.tasks.push(task_title)
  return res.json(projects)
})

server.put('/projects/:project_id', verifyProjectExists, (req, res) => {
  const { project_id } = req.params
  const { title } = req.body
  const project = projects.find(project => project.id === project_id)
  project.title = title
  return res.json(projects)
})

server.delete('/projects/:project_id', verifyProjectExists, (req, res) => {
  const { project_id } = req.params
  const project = projects.find(project => project.id === project_id)
  projects.splice(projects.indexOf(project), 1)
  return res.send()
})

server.listen(3000)