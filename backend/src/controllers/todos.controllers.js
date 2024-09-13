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
