const express = require('express')
const app = express()
app.use(express.json())
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

let db = null
const dbPath = path.join(__dirname, 'todoApplication.db')

const initalizationDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Started')
    })
  } catch (e) {
    console.log(e.message)
  }
}

initalizationDBAndServer()

app.get('/todos/', async (request, response) => {
  try {
    const {status = '', priority = '', search_q = ''} = request.query
    const matchingTodosQuery = `SELECT * FROM todo WHERE todo LIKE '%${search_q}%' AND priority LIKE '%${priority}%' AND status LIKE '%${status}%'`
    const matchingTodos = await db.all(matchingTodosQuery)
    response.send(matchingTodos)
  } catch (e) {
    console.log(e)
  }
})

app.get('/todos/:todoId', async (request, response) => {
  try {
    const {todoId} = request.params
    const todoQuery = `SELECT * FROM todo WHERE id = ${todoId}`
    const todo = await db.get(todoQuery)
    response.send(todo)
  } catch (e) {
    console.log(e)
  }
})

app.post('/todos/', async (request, response) => {
  try {
    const {id, todo, priority, status} = request.body
    const uploadQuery = `INSERT INTO todo(id, todo, priority, status) VALUES(${id}, '${todo}', '${priority}', '${status}')`
    const uploadtodo = await db.run(uploadQuery)
    response.send('Todo Successfully Added')
  } catch (e) {
    console.log(e)
  }
})

app.put('/todos/:todoId/', async (request, response) => {
  try {
    const {todoId} = request.params
    const {todo, status, priority} = request.body
    let arr1 = [{todo: todo}, {status: status}, {priority: priority}]
    let ark = arr1.filter(
      eachItem =>
        typeof eachItem[Object.getOwnPropertyNames(eachItem)[0]] === typeof '',
    )
    console.log(ark)
    console.log(arr1)
    let arr = {...ark[0]}
    console.log(arr)
    const updateQuery = `UPDATE todo SET ${
      Object.getOwnPropertyNames(arr)[0]
    } = '${arr[Object.getOwnPropertyNames(arr)[0]]}'`
    await db.run(updateQuery)
    response.send(
      `${Object.getOwnPropertyNames(arr)[0].replace(
        Object.getOwnPropertyNames(arr)[0][0],
        Object.getOwnPropertyNames(arr)[0][0].toUpperCase(),
      )} Updated`,
    )
  } catch (e) {
    console.log(e)
  }
})

app.delete('/todos/:todoId/', async (request, response) => {
  try {
    const {todoId} = request.params
    const deleteQuery = `DELETE FROM todo WHERE id = ${todoId}`
    await db.run(deleteQuery)
    response.send('Todo Deleted')
  } catch (e) {
    console.log(e)
  }
})

module.exports = app
