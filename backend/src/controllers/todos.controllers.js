import { database } from "../db/database.js";

export const getAllTodosCtrl = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "No autorizado" });
  }

  console.log(req.user);
  const userTodos = database.todos.filter((todo) => todo.owner === req.user.id);

  res.json({ todos: userTodos });
};

export const addTodo = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "No autorizado jajaja" });
  }

  const { title, completed } = req.body;

  if (!title || typeof completed !== "boolean") {
    return res.status(400).json({ message: "Datos incompletos o incorrectos" });
  }
  const newTodo = {
    id: database.todos.length + 1,
    title: title,
    completed: completed,
    owner: req.user.id,
  };

  database.todos.push(newTodo);

  res.status(201).json({ message: "Todo creado exitosamente", todo: newTodo });
};

export const updateTodo = (req, res) => {
  const { todosID } = req.params;
  const { title, completed } = req.body;

  const todo = database.todos.find((todo) => todo.id === parseInt(todosID));

  if (!todo) {
    return res.status(404).json({ message: "Todo no encontrado" });
  }

  const userTodos = database.todos.filter((todo) => todo.owner === req.user.id);
  if (!userTodos) {
    return res
      .status(403)
      .json({ message: "No tienes permisos para editar este todo" });
  }
  if (title) {
    todo.title = title;
  }

  if (typeof completed === "boolean") {
    todo.completed = completed;
  }

  res.json({ message: "Todo actualizado correctamente", todo });
};

export const deleteTodo = (req, res) => {
  const { id } = req.params;

  const todoIndex = database.todos.findIndex(
    (todo) => todo.id === parseInt(id)
  );

  if (todoIndex === -1) {
    return res.status(404).json({ message: "Todo no encontrado" });
  }

  if (database.todos[todoIndex].owner !== req.user.id) {
    return res
      .status(403)
      .json({ message: "No tienes permiso para eliminar este todo" });
  }

  const deletedTodo = database.todos.splice(todoIndex, 1);

  res.json({ message: "Todo eliminado correctamente", todo: deletedTodo });
};
