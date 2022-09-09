const appVersion = "1.0.1";

var appScript = document.querySelector('script[src="app.js"]');
appScript.src = "app.js?v=" + appVersion;


window.onload = function (){
  const page = localStorage.getItem("page");
  if(page === null){
    selectPage("tasks");
  } else {
    selectPage(page);
  }
  loadTasks();
  updateList();
}

//PWA
   if ("serviceWorker" in navigator) {
       navigator.serviceWorker.register("sw.js").then(registration => {
           console.log("SW Registered!");
           console.log(registration);
       }).catch(error => {
        console.log("SW Registration Failed!");
        console.log(error);
       });
   }

// "frontend"
function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault) {
    e.preventDefault();
  } else {
    e.returnValue = false;
  }
}

document.querySelectorAll("button").forEach(el => {
  el.addEventListener("click", function(){
    preventDefault();
  })
});

//Výška úvodní sekce (fix na mobily při zapnutí virtuální klávesnice)

if (window.innerHeight > 680){
  document.querySelectorAll(".entry").forEach(el => {
    el.style.height = (window.innerHeight / 3) + "px";
  });
} else {
  document.querySelectorAll(".entry").forEach(el => {
    el.style.height = (window.innerHeight * 0.4) + "px";
  });
}

// Priority settings

const dropdownButtons = document.querySelectorAll(".btn.dropdown"),
      fulfillSetButton = document.getElementById("fulfillSetButton");

dropdownButtons.forEach(button => {
  button.addEventListener("click", function() {
    button.nextElementSibling.classList.toggle("show");
  });
});

const priorityInpSet = document.getElementById("taskPriority"),
      priorityInp = priorityInpSet.querySelectorAll("li"),
      btnDropdown = document.getElementsByClassName("btn dropdown")[0];

let taskPriority = 1;

priorityInp.forEach(function(link) {
  link.addEventListener("click", function() {
    priorityInpSet.classList.remove("show");
    if( Array.prototype.indexOf.call(priorityInpSet.children, link) == 0){
      taskPriority = 2;
      btnDropdown.className = "btn dropdown high";
    } else if(Array.prototype.indexOf.call(priorityInpSet.children, link) == 1) {
      taskPriority = 1;
      btnDropdown.className = "btn dropdown";
    } else {
      taskPriority = 0;
      btnDropdown.className = "btn dropdown low"
    }
  });
});

const html = document.querySelector("html");

html.addEventListener("click", function(e){
  dropdownMenu.classList.remove("show");
});

// Dark/Light theme settings

const themeButton = document.getElementsByName("theme")[0],
      prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

      if(themeStored === "true"){
        themeButton.textContent = "Zapnutý"
      } else if(themeStored === "false"){
        themeButton.textContent = "Vypnutý"
      } else if(themeStored === null){
        const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
        if (prefersDarkScheme.matches)
        {
          themeButton.textContent = "Zapnutý"
        } else {
          themeButton.textContent = "Vypnutý"
        }
      }

themeButton.addEventListener("click", function() {
  let themeStored = localStorage.getItem("theme");
  if(themeStored === "true"){
    localStorage.setItem("theme", false);
    root.style.setProperty("--background","#fff");
    root.style.setProperty("--color","#000");
    themeButton.textContent = "Vypnutý";
  } else {
    localStorage.setItem("theme", true);
    root.style.setProperty("--background","#000");
    root.style.setProperty("--color","#fff");
    themeButton.textContent = "Zapnutý";
  }
})

// Menu control

const hamburger = document.querySelector(".hamburger"),
      mainMenu = document.querySelector(".main-menu"),
      options = mainMenu.querySelector(".options").querySelectorAll("p");

hamburger.addEventListener("click", function() {
  mainMenu.classList.toggle("active");
  let text = mainMenu.querySelector("p");
  if(text.textContent == "MENU"){
    text.textContent = "ZAVŘÍT";
  } else {
    text.textContent = "MENU";
  }
});

options.forEach(link => {
  link.addEventListener("click", function() {
    mainMenu.classList.remove("active");
    mainMenu.querySelector("p").textContent = "MENU";
  });
});

function selectPage(name) {
  document.querySelectorAll(".page").forEach(page => {
    if (page.id === name) {
      page.style.display = "block";
    } else {
      page.style.display = "none";
    }
  });
  localStorage.setItem("page", name);
}

// Completion date settings in TASKS

fulfillSetButton.addEventListener("click", function() {
  document.getElementsByClassName("completion-date")[0].classList.add("active");
})

document.getElementsByClassName("completion-date")[0].lastElementChild.addEventListener(
  "click", function () {
    preventDefault();
    document.getElementsByClassName("completion-date")[0].classList.remove("active");
  }
)

// Closing the date settings by clicking outside
html.addEventListener('click', function(e){
    if( document.getElementsByClassName("completion-date")[0].contains(e.target) || fulfillSetButton.contains(e.target)){
  } else{
    document.getElementsByClassName("completion-date")[0].classList.remove("active");
  }
});

const minutes = document.getElementById("minutes"),
      hours = document.getElementById("hours"),
      days = document.getElementById("days"),
      weeks = document.getElementById("weeks"),
      months = document.getElementById("months");

let completionDate;

function increaseValue(input) {
  preventDefault();
  input.value = parseInt(input.value) + 1;
    if (input.value > parseInt(input.getAttribute("max"))) {
      decreaseValue(input);
    }
}

function decreaseValue(input) {
  preventDefault();
  input.value = parseInt(input.value) - 1;
    if (input.value < parseInt(input.getAttribute("min"))) {
      increaseValue(input);
    }
}

function updateDate() {
  if(setDateInp.textContent == "Datum"){
    completionDate =  moment().add(parseInt(months.value), "months")
                              .add(parseInt(weeks.value), "weeks")
                              .add(parseInt(days.value), "days")
                              .add(parseInt(hours.value), "hours")
                              .add(parseInt(minutes.value), "minutes");
    months.value = "0";
    weeks.value = "0";
    days.value = "0";
    hours.value = "0";
    minutes.value = "0";
  } else {
    let inp = document.querySelector("#set-datetime-inp").value;
    completionDate = moment(inp);
  }
}

const setDateInp = document.querySelector("#setDateInp");

setDateInp.addEventListener("click", function() {
  let time = document.getElementById("tasks").querySelector("#completion-date_time"),
      date = document.getElementById("tasks").querySelector("#completion-date_date");
  if(setDateInp.textContent == "Datum"){
    setDateInp.textContent = "Čas";
    time.style.display = "none";
    date.style.display = "flex";
  } else {
    setDateInp.textContent = "Datum";
    time.style.display = "flex";
    date.style.display = "none";
  }
});

// Color picker
const colorInputs = document.querySelectorAll("input[type='color']");
let transLeftCol = getComputedStyle(root).getPropertyValue('--trans-left'),
    transRightCol = getComputedStyle(root).getPropertyValue('--trans-right');

colorInputs[0].value = transLeftCol;
colorInputs[1].value = transRightCol;

colorInputs.forEach((input, i) => {
  input.addEventListener("change", function() {
    if(i == 0){
      root.style.setProperty("--trans-left", this.value);
      localStorage.setItem("transLeftCol", this.value);
    } else {
      root.style.setProperty("--trans-right", this.value);
      localStorage.setItem("transRightCol", this.value);
    }
  })
});


// "backend"
let tasks = [];
const taskForm = document.getElementById("tasks").getElementsByTagName("form")[0],
      tasksList = document.getElementById("tasks").getElementsByClassName("list")[0];

// Třída pro úkol
let timeLeftFnc = function(){ // Funkce, která se přiřadí k úkolům jako metoda (Kvůli LS)
  let currentDate, ms, minutes, hours, days, weeks, months;

  currentDate = new Date();
  ms = this.date - currentDate;

  if (ms < 60000) {
    return false;

  } else {
    minutes = ms / (1000 * 60);

    if (minutes > 59) {
      hours = minutes / 60;
      minutes = minutes % 60;
    }

    if (hours > 23) {
      days = hours / 24;
      hours = hours % 24;
    }

    if (days > 29) {
      months = days / 30;
      days = days % 30;
    }

    if (days > 6) {
      weeks = days / 7;
      days = days % 7;
    }

    let dateField = [months, weeks, days, hours, minutes];

    dateField[0] = Math.floor(dateField[0]) + "m ";
    dateField[1] = Math.floor(dateField[1]) + "t ";
    dateField[2] = Math.floor(dateField[2]) + "d ";
    dateField[3] = Math.floor(dateField[3]) + "h ";
    dateField[4] = Math.floor(dateField[4]) + "m";

    filteredDateField = dateField.filter(function(str) {
      return(str.substring(0,3) !== "NaN" && str.substring(0,1) !== "0");
    });

    return filteredDateField.join("");
  }
};

function Task(text, priority, date, done){
  return {
    text,
    priority,
    date,
    done
  };
}

function tasksAssFnc(){
  tasks.forEach(task => {
  task.timeLeft = timeLeftFnc;
});
}

// Vložení úkolu do DOM
function listTask(task, i) {
  const template = document.querySelector(".template > .task");
  let newTaskDiv = template.cloneNode(true),
      textElement = newTaskDiv.getElementsByClassName("text")[0],
      priorityElement = newTaskDiv.getElementsByClassName("priority")[0],
      deleteAttr = newTaskDiv.getElementsByClassName("delete")[0],
      fulfillAttr = newTaskDiv.getElementsByClassName("fulfill")[0],
      timeElement = newTaskDiv.getElementsByClassName("time")[0].getElementsByTagName("span")[0];

  newTaskDiv.dataset.index = i;
  textElement.textContent = task.text;

  if (task.priority === 0) {
    priorityElement.classList.add("low");
  }if (task.priority === 2) {
    priorityElement.classList.add("high");
  }

  let nodeDeleteAtr = document.createAttribute("onclick");
  nodeDeleteAtr.nodeValue = "deleteTask(" + i + ")";
  deleteAttr.setAttributeNode(nodeDeleteAtr);

  let nodeFulfillAtr = document.createAttribute("onclick");
  nodeFulfillAtr.nodeValue = "fulfillTaskToggle(" + i + ")";
  fulfillAttr.setAttributeNode(nodeFulfillAtr);

  if (task.done === true) {
  textElement.classList.add("done");
  priorityElement.classList.add("done");
  fulfillAttr.textContent = "Vrátit"
  }

  if (task.timeLeft() === false) {
    let timeElementParent = newTaskDiv.getElementsByClassName("time")[0];
    timeElementParent.innerHTML = "";
    let outOfTimeText = document.createTextNode("Úkol již měl být splněn!");
    let outOfTimeEl = document.createElement("span");

    outOfTimeEl.appendChild(outOfTimeText);

    timeElementParent.appendChild(outOfTimeEl);

  } else {
    timeElement.textContent = task.timeLeft();
  }

  tasksList.appendChild(newTaskDiv);
}

// Třízení úkolů
function sortTasks() {
  tasks.sort(function (a, b) {
     return a.date - b.date;
  });
  tasks.sort(function (a, b) {
     return b.priority - a.priority;
  });
  tasks.sort(function (a, b) {
     return a.done - b.done;
  });
}

// Přidání úkolu
taskForm.querySelector(".second-item").lastElementChild.onclick = function() {
  let textInput = document.getElementById("taskText");
  if (textInput.value === "") {
    alert("Zadejte úkol.");
  } else {
    updateDate();
    let task = new Task(textInput.value, taskPriority, completionDate._d, false);
    tasks.push(task);
    updateList();
    textInput.value = "";
    taskPriority = 1;
    dropdownToggle.className = "btn dropdown";
    dropdownMenu.classList.remove("show");
    saveTasks();
  }
};

// Update listu
function updateList() {
  tasksAssFnc();
  sortTasks();
  tasksList.textContent = "";  // Vyčištění listu před přidáním setřízených úkolů
  tasks.forEach(function(task){
    listTask(task, tasks.indexOf(task));
  });
}

// Toggle na dokončení úkolu
function fulfillTaskToggle(i) {
  let div = tasksList.querySelector("[data-index='"+ i +"']");
  function update(){
    saveTasks();
    updateList();
  }
  if (tasks[i].done === true) {
    div.classList.add("slideaway");
    div.addEventListener("transitionend",function(){
        tasks[i].done = false;
        update();
    });
  } else {
    div.classList.add("slideaway");
    div.addEventListener("transitionend",function(){
        tasks[i].done = true;
        update();
    });
  }
}

function deleteTask(i) {
  let div = tasksList.querySelector("[data-index='"+ i +"']");
  div.classList.add("slideaway");
  div.addEventListener("transitionend",function(){
    tasks.splice(i, 1);
    saveTasks();
    updateList();
  });
}

// Automatické ukládání do Lokálního úložiště

function loadTasks() {
  let ls = localStorage.getItem("tasks");
  if (ls.length === 0 || ls === null) {
    return;
  }
  let tasksDeserialized = JSON.parse(localStorage.getItem("tasks"));
  tasks = tasksDeserialized;
  tasks.forEach(task => {
    if(typeof task.date === "string"){
      task.date = Date.parse(task.date);
    }
  });
}

function saveTasks() {
  let tasksSerialized = JSON.stringify(tasks);
  localStorage.setItem("tasks", tasksSerialized);
}
