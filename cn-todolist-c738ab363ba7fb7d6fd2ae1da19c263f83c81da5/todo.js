(function () {
  let tasks = [];
  const taskList = document.getElementById('list');
  const addTaskInput = document.getElementById('add');
  const tasksCounter = document.getElementById('tasks-counter');

  async function fetchDataFromAPI() {
    /*
  
    //*Way to do without using async and await syntax.
  
    fetch("https://jsonplaceholder.typicode.com/todos").then(function(response){
      return response.json();
    }).then(function (data)
    {
      tasks = data.slice(0, 10);
      renderList();
    }).catch(function(data){
        console.log(data);
    });
    */

    //* Way to do with async and await syntax.

    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/todos");
      const data = await response.json();
      tasks = data.slice(0, 10);
	console.log(data);
      renderList();
    }
    catch (error) {
      console.log(error);
    }
  }
  function addTaskToDOM(task) {
    const li = document.createElement('li');

    li.innerHTML = `
      <input type="checkbox" id="${task.id}" ${task.completed ? 'checked' : ''} class="custom-checkbox">
      <label for="${task.id}">${task.title}</label>
      <img src="delete.png" class="delete" data-id="${task.id}" />
  `;

    taskList.append(li);
  }

  function renderList() {
    /**********
     * Step 1 : clear all the html of ul
     * Step 2 : for one object one li tag should be created.
     * Step 3: iterate over array and pass object to dom manipulation so it can add html inside.
     * 
     *  */

    taskList.innerHTML = "";

    for (let i of tasks) {
      addTaskToDOM(i);
    }
    tasksCounter.innerHTML = tasks.length;
  }

  function toggleTask(taskId) {
    if (tasks.length === 0) {
      showNotification("No task found...!!!");
      return;
    }
    for (let i of tasks) {
      if (i.id === Number(taskId)) {
        i.completed = !i.completed;
        if (i.completed) {
          showNotification("Task marked as completed...!!")
        }
        else {
          showNotification("Task marked as incomplete...!!!");
        }
        renderList();
        return;
      }
    }
  }

  function deleteTask(taskId) {
    tasks = tasks.filter(work => {
      return taskId != work.id;
    });
  }

  function addTask(task) {
    if (task) {
      tasks.push(task);
      renderList();
      showNotification("Task added successfully...!!!");
      return;
    }
    showNotification("Task cannot be added...!!!");
  }

  function showNotification(text) {
    alert(text);
  }

  function getUserTypedText(event) {
    if (event.key === 'Enter') {
      const text = event.target.value;

      console.log(text);
      if (!text) {
        showNotification("Task cannot be empty..!!")
        return;
      }

      const task = {
        title: text,
        id: Date.now(),
        completed: false
      };
      event.target.value = "";
      addTask(task);
    }
  }


  //*Performing event deligation 

  function findClickedTarget(event) {
    if (event.target.className === "delete") {
      deleteTask(event.target.dataset.id);
      renderList();
    }
    else if (event.target.className == "custom-checkbox") {
      toggleTask(event.target.id);
    }
  }


  function initializeApp() {
    fetchDataFromAPI();
    document.addEventListener('click', findClickedTarget);
    addTaskInput.addEventListener('keyup', getUserTypedText);
  }

  initializeApp();

})();