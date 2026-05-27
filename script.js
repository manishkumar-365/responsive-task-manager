// To-Do list program

const todo = document.getElementById("todo");
const add = document.getElementById("add");
const suggestion = document.getElementById("suggestion");
let taskcount = document.getElementById("taskcount");
taskcount.classList.add('taskcountstyle');
const showlist = document.getElementById("showlist");
const mode = document.getElementById('mode');
let taskArray = [];

mode.addEventListener('click', () => {

    const container = document.querySelector('.container');
    container.classList.toggle('nightMode');

    if(container.classList.contains('nightMode')){
        mode.textContent='☀️';
        mode.style.backgroundColor='white';
        localStorage.setItem("theme", "dark");
    }
    else{
        mode.textContent='🌙';
        mode.style.backgroundColor='#5f3589';
        localStorage.setItem("theme", "light");
    }

})

add.addEventListener("click", () => {
    if (todo.value === "") {
        suggestion.textContent = "You must enter a task first!!"
    }
    else {
        addtask();
        todo.value = "";
        suggestion.textContent = "";
        suggestion.remove();
    }
});

function addtask() {
    const tasktext = todo.value;
    const newTask = {
        text: tasktext,
        completed: false    // from start it should be false otherwise if render with taskdone
    };
    taskArray.push(newTask);
    // saving data on local storage and converting into string
    localStorage.setItem("taskArray", JSON.stringify(taskArray));

    rendertask(newTask);
    updateCounter();
}

function updateCounter(){
    const total = taskcount.textContent = `${taskArray.length}`;
    const finished = taskcount.textContent = `${taskArray.filter( task => task.completed).length }`
    taskcount.textContent = `${total} Total • ${finished} Completed • ${total-finished} Remaining`;
}

function rendertask(task) {

    const div = document.createElement("div");
    div.classList.add("taskWrapper");
    showlist.append(div);

    const leftSide = document.createElement('div');
    leftSide.classList.add('leftSide');
    div.append(leftSide);

    const checkBox = document.createElement("input");
    checkBox.type = 'checkbox';
    checkBox.classList.add('check')
    checkBox.checked = task.completed;
    leftSide.append(checkBox);

    const span = document.createElement("span");
    span.textContent = task.text;
    if(task.completed){
        span.classList.add('taskDone');
    }
    leftSide.append(span);

    const rightSide = document.createElement('div');
    rightSide.classList.add('rightSide');
    div.append(rightSide);

    const edit = document.createElement("button");
    edit.textContent="Edit";
    edit.classList.add('editButton');
    rightSide.append(edit);

    const del = document.createElement("button");
    del.textContent = "Delete"
    del.classList.add("delBtn");
    rightSide.append(del);

    checkBox.addEventListener("change", (event) => {
        taskCompleted(event, task);

    })

    edit.addEventListener("click", editTask);
    
    del.addEventListener("click", deleteTask);

    updateCounter();
}

// its runs when page refresh
function loadData() {

    const savedTask = localStorage.getItem("taskArray");

    if (savedTask !== null) {

        taskArray = JSON.parse(savedTask);

        taskArray.forEach(element => {
            rendertask(element);
        });
    }
    else {
        suggestion.textContent = "No task is saved yet!!"
    }
    updateCounter();
}

function editTask(event){
    const spantext = event.target.parentElement.parentElement.querySelector('span');
    const divLeft = spantext.parentElement;
    const inputBox = document.createElement('input');
    const divRight = event.target.parentElement;
    const editBtn = event.target;

    inputBox.type='text';
    inputBox.classList.add('editTask');
    inputBox.value=spantext.textContent;
    const oldtask = spantext.textContent;

    divLeft.replaceChild(inputBox, spantext);

    const save = document.createElement('button');
    save.textContent='Save';
    save.classList.add('saveButton');

    divRight.replaceChild( save , editBtn);

    save.addEventListener("click", (event) => {
        saveEditedtask(event, oldtask);
    });
}

function saveEditedtask(event, oldtask){
    const taskWrapper = event.target.parentElement.parentElement;
    const leftSide = taskWrapper.querySelector(".leftSide");
    const rightSide = taskWrapper.querySelector(".rightSide");
    const inputBox = leftSide.querySelector(".editTask");

    const spantext = document.createElement('span');

    spantext.textContent= inputBox.value;
    const newtask = inputBox.value;

    leftSide.replaceChild(spantext, inputBox);

    const edit = document.createElement("button");
    edit.textContent="Edit";
    edit.classList.add('editButton');
    const save = event.target;

    rightSide.replaceChild(edit, save);

    updateArray(oldtask,newtask);

    edit.addEventListener('click', editTask);
}

function updateArray(oldtask,newtask){

    taskArray = taskArray.map(element => {

        if(oldtask===element){
            return newtask;
        }

        return element;
    });

    localStorage.setItem("taskArray", JSON.stringify(taskArray));
}

function deleteTask(event) {
    const div = event.target.parentElement.parentElement;

    const deletingTask = div.querySelector("span").textContent;
    taskArray = taskArray.filter(task => task.text !== deletingTask);

    localStorage.setItem("taskArray", JSON.stringify(taskArray));

    div.remove();
    updateCounter();
}

function taskCompleted(event,task) {

    const checkBox = event.target;
    
    if (event.target.checked) {
        const div = event.target.parentElement;
        div.querySelector('span').classList.toggle('taskDone');
        task.completed = checkBox.checked;
        localStorage.setItem("taskArray", JSON.stringify(taskArray));
    }
    else {
        const div = event.target.parentElement;
        div.querySelector('span').classList.toggle('taskDone');
        task.completed = checkBox.checked;
        localStorage.setItem("taskArray", JSON.stringify(taskArray));
    }
}

loadData();

function loadTheme(){
    const theme = localStorage.getItem("theme");
    const container = document.querySelector('.container');

    if(theme==="dark"){
        container.classList.add('nightMode');
        mode.textContent='☀️';
        mode.style.backgroundColor='white';

    }
    else{
        container.classList.remove('nightMode');
    }
}

loadTheme();