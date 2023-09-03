const listElem = document.getElementById('list')
const newTaskElem = document.getElementById('newTask')
const storageTasksName = 'tasks'

function getTasks() {
  return JSON.parse(localStorage.getItem(storageTasksName)) || []
}

function removeAllTasks() {
  localStorage.removeItem(storageTasksName)
  listElem.replaceChildren()
}

function insertTask(task) {
  const taskElem = document.createElement('li')

  taskElem.textContent = task.content
  taskElem.setAttribute('id', task.id)

  insertIcons(taskElem, task.id)

  listElem.appendChild(taskElem)
}

function addTask(task) {
  if (!task.content?.trim()) return

  const tasks = getTasks()
  const newTask = {
    id: tasks.length,
    content: task.content,
  }

  tasks.push(newTask)
  localStorage.setItem(storageTasksName, JSON.stringify(tasks))

  return newTask
}

function editTask(id) {
  const taskElem = document.getElementById(id)
  const inputElem = document.createElement('input')
  inputElem.value = taskElem.textContent.trim()

  taskElem.innerHTML = ''
  taskElem.appendChild(inputElem)

  inputElem.focus()
  inputElem.select()

  inputElem.addEventListener('blur', () => {
    handleEdit(inputElem, taskElem, id)
  })

  inputElem.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleEdit(inputElem, taskElem, id)
    }
  })
}

function handleEdit(inputElem, taskElem, id) {
  const editedText = inputElem.value.trim() + ' '

  if (!editedText.trim()) return deleteTask(id)

  taskElem.textContent = editedText

  insertIcons(taskElem, id)

  const tasks = getTasks()
  const taskIndex = tasks.findIndex((task) => task.id == id)

  tasks[taskIndex].content = taskElem.textContent.trim()
  localStorage.setItem(storageTasksName, JSON.stringify(tasks))
}

function deleteTask(id) {
  let tasks = getTasks()

  if (tasks.length > 1) {
    const taskIndex = tasks.findIndex((task) => task.id == id)

    tasks.splice(taskIndex, 1)
  } else {
    tasks = []
  }

  document.getElementById(id).remove()
  localStorage.setItem(storageTasksName, JSON.stringify(tasks))
}

function insertIcons(taskElem, taskId) {
  taskElem.appendChild(document.createTextNode(' '))

  const editIcon = document.createElement('i')

  editIcon.className = 'fa-regular fa-pen-to-square'
  editIcon.title = 'Edit'
  editIcon.onclick = () => {
    editTask(taskId)
  }

  taskElem.appendChild(editIcon)

  const deleteIcon = document.createElement('i')

  deleteIcon.className = 'fa-solid fa-trash'
  deleteIcon.title = 'Delete'
  deleteIcon.onclick = () => {
    deleteTask(taskId)
  }

  taskElem.appendChild(document.createTextNode(' '))
  taskElem.appendChild(deleteIcon)
}

;(() => {
  const tasks = getTasks()

  if (!tasks.length) return

  tasks.forEach((task) => {
    insertTask({ content: task.content, id: task.id })
  })
})()

newTaskElem.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const newTask = addTask({ content: newTaskElem.value })
    if (newTask) insertTask(newTask)
    newTaskElem.value = null
  }
})
