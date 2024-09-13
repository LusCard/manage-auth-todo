export function todosPage() {
  const container = document.createElement("div");

  container.classList.add("container");
  container.innerHTML = `
    <div class="flex flex-col items-center justify-center h-screen bg-gray-200">
      <button id="home-btn" class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-4">
        Home
      </button>
      <h1 class="text-3xl font-bold mb-4">List of Todos</h1>
      <form id="todo-form" class="mb-4 p-4 bg-white shadow-md w-1/2">
        <input type="text" id="todo-title" placeholder="Enter todo title" class="border p-2 mb-2 w-full" required>
        <label class="inline-flex items-center">
          <input type="checkbox" id="todo-completed" class="mr-2"> Completed
        </label>
        <button type="submit" class="bg-green-500 text-white p-2 rounded hover:bg-green-600 mt-4">
          Add Todo
        </button>
      </form>
      <table class="w-1/2 bg-white shadow-md h-[700px] overflow-y-scroll">
        <thead>
          <tr>
            <th class="border px-4 py-2">ID</th>
            <th class="border px-4 py-2">Title</th>
            <th class="border px-4 py-2">Completed</th>
            <th class="border px-4 py-2">Owner Id</th>
          </tr>
        </thead>
        <tbody id="todo-list" class="text-center"></tbody>
      </table>
    </div>
  `;

  const homeBtn = container.querySelector("#home-btn");
  const todoForm = container.querySelector("#todo-form");
  const tbody = container.querySelector("#todo-list");

  homeBtn.addEventListener("click", () => {
    window.location.pathname = "/home";
  });

  todoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = container.querySelector("#todo-title").value;
    const completed = container.querySelector("#todo-completed").checked;

    //* POST REQUEST
    fetch("http://localhost:4000/todos/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: "Atitle", completed: false }),
    })
      .then((response) => response.json())
      .then(() => {
        alert("Todo added successfully");
        todoForm.reset();
        loadTodos();
      })
      .catch((error) => console.error("Error in fetch to add:", error));
  });

  //* LOAD TODOS FUNCTION
  const loadTodos = () => {
    tbody.innerHTML = "";
    fetch("http://localhost:4000/todos", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        data.todos.forEach((todo) => {
          const row = `
            <tr>
              <td class="border px-4 py-2">${todo.id}</td>
              <td class="border px-4 py-2">${todo.title}</td>
              <td class="border px-4 py-2">${todo.completed ? "Yes" : "No"}</td>
              <td class="border px-4 py-2">${todo.owner}</td>
            </tr>
          `;
          tbody.insertAdjacentHTML("beforeend", row);
        });
      });
  };

  loadTodos();

  return container;
}
