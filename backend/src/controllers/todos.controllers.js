import { database } from "../db/database.js";

export const getAllTodosCtrl = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "No autorizado" });
  }

  // Filtrar los todos del usuario autenticado
  console.log(req.user);
  const userTodos = database.todos.filter((todo) => todo.owner === req.user.id);

  res.json({ todos: userTodos });
};

export const addTodo = (req, res) => {
  const { title, completed } = req.body;

  if (!title || completed === undefined) {
    return res
      .status(400)
      .json({ message: "Missing required fields: title or completed" });
  }

  const newId = database.todos.length
    ? database.todos[database.todos.length - 1].id + 1
    : 1;

  const newTodo = {
    id: newId,
    title,
    completed,
  };

  database.todos.push(newTodo);

  return res.status(201).json(newTodo);
};
