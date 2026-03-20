const taskArr = [];
const url = "/api/todos";
let editingId = null;
let btn = document.querySelector(".formSection button");
let currentFilter = "";
let currentPage = 1;
let limit = 5;
let totalPages = 1;

const fetchData = async () => {
  try {
    let newUrl = `${url}?page=${currentPage}&limit=${limit}`;
    // let newUrl = url;
    if (currentFilter) {
      newUrl += `&status=${currentFilter}`;
    }
    const res = await fetch(newUrl);
    const resVal = await res.json();
    taskArr.length = 0;
    taskArr.push(...resVal.todos);
    totalPages = resVal.totalPages;

    renderPagination();
  } catch (err) {
    console.log(err.message);
  }
};
document.addEventListener("DOMContentLoaded", async () => {
  await fetchData();
  renderTask();
  const input = document.getElementById("task");
  input.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
      e.preventDefault();
      addTasks();
    }
  });
  console.log("taskArr", taskArr);
  taskArr.map((item, index) => {
    console.log(item.statusCode);
  });
});

async function addTasks() {
  const taskInput = document.getElementById("task");
  const taskValue = taskInput.value;
  if (taskValue == "") {
    alert("please enter a task");
    return;
  }

  try {
    if (editingId !== null) {
      const res = await fetch(`${url}/${editingId}`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tasks: taskValue }),
      });
      if (!res.ok) {
        throw new Error("Failed to add task");
      }
      editingId = null;
      btn.textContent = "Add";
    } else {
      const res = await fetch(url, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tasks: taskValue }),
      });
      if (!res.ok) {
        throw new Error("Failed to add task");
      }
    }
    taskInput.value = "";
    await fetchData();
    renderTask();
  } catch (err) {
    console.log(err);
  }
}

function renderTask() {
  const taskList = document.querySelector(".taskPlace");
  taskList.innerHTML = "";

  taskArr.map((task, index) => {
    const li = document.createElement("li");
    const taskText = document.createElement("span");
    taskText.textContent = task.tasks;
    taskText.className = "task-text";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "edit-btn";
    editBtn.onclick = function () {
      editTask(task);
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.onclick = function () {
      deleteTask(index);
    };

    if (task.taskStatus === "completed") {
      taskText.classList.add("completed-text");
    }

    const completedBtn = document.createElement("button");
    completedBtn.textContent = "Complete";
    completedBtn.className = "completed-btn";
    completedBtn.onclick = () => {
      changeStatus(task.id, "completed");
    };

    const pendingBtn = document.createElement("button");
    pendingBtn.textContent = "Undo";
    pendingBtn.className = "pending-btn";
    pendingBtn.onclick = () => {
      changeStatus(task.id, "pending");
    };

    completedBtn.disabled = task.taskStatus === "completed";
    pendingBtn.disabled = task.taskStatus === "pending";

    const btnGroup = document.createElement("div");
    btnGroup.classList = "btn-group";
    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(deleteBtn);
    btnGroup.appendChild(completedBtn);
    btnGroup.appendChild(pendingBtn);

    li.appendChild(taskText);
    li.appendChild(btnGroup);

    taskList.appendChild(li);
  });
}

function editTask(task) {
  const taskInput = document.getElementById("task");
  taskInput.value = task.tasks;
  editingId = task.id;
  btn.textContent = "Update";
  taskInput.focus();
}

async function deleteTask(index) {
  const deleteTaskId = taskArr[index].id;
  try {
    const deletedTask = await fetch(`${url}/${deleteTaskId}`, {
      method: "DELETE",
    });
    if (!deletedTask.ok) {
      throw new Error("Failed to delete task");
    }
    await fetchData();
    renderTask();
  } catch (err) {
    console.log(err);
  }
}

async function changeStatus(id, status) {
  try {
    await fetch(`${url}/${id}/${status}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    await fetchData();
    renderTask();
  } catch (err) {
    console.log(err);
  }
}

function filterList() {
  document
    .getElementById("filterStatus")
    .addEventListener("change", async (e) => {
      currentFilter = e.target.value;
      currentPage = 1;
      await fetchData();
      renderTask();
    });
}

filterList();

const renderPagination = () => {
  const pageInfo = document.getElementById("pageInfo");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  pageInfo.textContent = `Page No ${currentPage} of ${totalPages}`;

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
};

document.addEventListener("click", async (e) => {
  if (e.target.id == "prev-btn" && currentPage > 1) {
    currentPage--;
    await fetchData();
    renderTask();
  }

  if (e.target.id == "next-btn" && currentPage < totalPages) {
    currentPage++;
    await fetchData();
    renderTask();
  }
});

const limitSelectVal = document.getElementById("limitSelect");

limitSelectVal.addEventListener("change", async (e) => {
  limit = Number(e.target.value);
  currentPage = 1;
  await fetchData();
  renderTask();
});
