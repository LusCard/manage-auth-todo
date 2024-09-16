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
            <th class="border px-4 py-2">Actions</th>
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
    fetch("http://localhost:4000/todos", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, completed }),
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
              <td class="border px-4 py-2">
                <button class="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 update-btn" data-id="${
                  todo.id
                }">Edit</button>
                <button class="bg-red-500 text-white p-2 rounded hover:bg-red-600 delete-btn" data-id="${
                  todo.id
                }">Delete</button>
              </td>
            </tr>
          `;
          tbody.insertAdjacentHTML("beforeend", row);
        });

        // Add event listeners for Edit and Delete buttons
        tbody.querySelectorAll(".update-btn").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            const todoId = e.target.dataset.id;
            openModal(todoId);
          });
        });

        tbody.querySelectorAll(".delete-btn").forEach((btn) => {
          btn.addEventListener("click", async (e) => {
            const todoId = e.target.dataset.id;
            if (confirm("Are you sure you want to delete this todo?")) {
              await fetch(`http://localhost:4000/todos/${todoId}`, {
                method: "DELETE",
                credentials: "include",
              })
                .then((response) => response.json())
                .then(() => {
                  alert("Todo deleted successfully");
                  loadTodos();
                })
                .catch((error) =>
                  console.error("Error in fetch to delete:", error)
                );
            }
          });
        });
      });
  };

  const openModal = (todoId) => {
    fetch(`http://localhost:4000/todos/${todoId}`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((todo) => {
        const modal = document.createElement("div");
        modal.classList.add(
          "fixed",
          "top-0",
          "left-0",
          "w-full",
          "h-full",
          "bg-gray-900",
          "bg-opacity-50",
          "flex",
          "items-center",
          "justify-center"
        );

        modal.innerHTML = `
          <div class="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 class="text-2xl font-bold mb-4">Edit Todo</h2>
            <form id="edit-form">
              <input type="text" id="edit-title" value="${
                todo.title
              }" class="border p-2 mb-2 w-full" required>
              <label class="inline-flex items-center">
                <input type="checkbox" id="edit-completed" ${
                  todo.completed ? "checked" : ""
                } class="mr-2"> Completed
              </label>
              <button type="submit" class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-4">
                Save Changes
              </button>
              <button type="button" id="close-modal" class="bg-red-500 text-white p-2 rounded hover:bg-red-600 mt-4 ml-2">
                Cancel
              </button>
            </form>
          </div>
        `;

        document.appendChild(modal);

        const editForm = modal.querySelector("#edit-form");
        const closeModalBtn = modal.querySelector("#close-modal");

        editForm.addEventListener("submit", async (e) => {
          e.preventDefault();
          const title = modal.querySelector("#edit-title").value;
          const completed = modal.querySelector("#edit-completed").checked;

          await fetch(`http://localhost:4000/todos/${todoId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, completed }),
          })
            .then((response) => response.json())
            .then(() => {
              alert("Todo updated successfully");
              modal.remove();
              loadTodos();
            })
            .catch((error) =>
              console.error("Error in fetch to update:", error)
            );
        });

        closeModalBtn.addEventListener("click", () => {
          modal.remove();
        });
      })
      .catch((error) => {
        console.error("Error in fetch todo", error);
      });
  };

  loadTodos();

  return container;
}
