

if('serviceWorker' in navigator){
  navigator.serviceWorker.register('todo_app_sw.js')
    .then(registration => {
      console.log('registration successful at scope ' + registration.scope)
    })
}else{
  alert('browser dont support app version')
}


  /*
  
  // for each todo item
  
  <div class="todo">
  <div class="title">make todo app</div>
  <div class="descript">
    <ol>
      <li>figure the style <input class="done" type="checkbox" name="" id=""></li>
      <li>make title and todos</li>
      <li>make delet and edit</li>
      <li>make done button</li>
      <li>save to storage</li>
    </ol>
  </div>
</div>
  
  
  // if no todo
  
  <div class="nothing">
    <h1>Nothing found</h1>
    <div class="sticker">
      🚫
    </div>
    you haven't yet created any todo list please create
    to see your todos here
  </div>
  
  
  // data structure
 
   let todos = [
   {
     title: 'create todo app',
     isDone: [true,true,true,true,true,true,true],
     list_type: 'ol',
     todo_list: ['configure style','make html content','choose color and style with css',
    'plan the logic','make it interactive','save in.local storage','publish the app']
   },{...more}
   ]
 
 */
 
 
  
  // for easy selection 
  
  function select(element){
    if(element.includes('*')){
      return document.querySelectorAll(element.replace('*',''));
    }else{
      return document.querySelector(element);
    }
  }
  
 
  // for easy storage
  
  function saveData(key,value){
    localStorage.setItem(key,value);
    if(localStorage.getItem(key) !== value){
      alert ('storage full cant add another todo please delete others');
    }
  }
  
  function getData(key){
    return localStorage.getItem(key) !== null ?
    localStorage.getItem(key) : false
  }
  
  // for easy data conversion
  
  function toData(string){
    try{
      let data = JSON.parse(string);
      return data;
    }catch(er){
      return false;
    }
  }
 
 
function toString(data){
    let string = JSON.stringify(data);
    return string;
}

// for easy string removement 

function remove(string,char){
  char.forEach(charac => {
    string = string.replaceAll(charac,'')
  })
  return string.trim();
}

// delete in array 

function deleteAr(array,index){
  delete array[index] ;
  let deletedArray = [];
  array.forEach(elem => {
    if(elem){
      deletedArray.push(elem)
    }
  })
  return deletedArray
}

// for easy receiving data

function receive(data,name){
  if(data){
    return data
  }else{
    alert(`${name} must not be empty`);
  }
}


// for getting index in parent

function getIndex(element,parent){
  let index = -1;
  [...parent.children].forEach((child,ind) => {
    if(child === element){
      index = ind
    }
  })
  return index
}

// selecting element

//constant
const todosEle = select('.todos');
[createTodo,editTodo,deleteTodo] = [...select('.actions').children];
[addList,editList,deleteList] = [...select('.list_actions').children];
const createBar = select('.create_bar');
const list_type_ele = select('select');
const titleEle = select('span');
const your_list = select('.your_list');
const edit_title_btn = select('.edit');
const saveBtn = select('.save');
const searchBar = select('[type="search"]');


// changable
let currentAction = '';
let list = your_list.children[0];
let edit_index;
let emptyData;

let Data = {
  title: 'todo title',
  list_type: 'ol',
  todo_list: [],
  isDone: []
}


const no_data_found = `
<div class="nothing">
    <h1>Nothing found</h1>
    <div class="sticker">
      🚫
    </div>
    you haven't yet created any todo list please create
    to see your todos here
</div>`;


createTodo.onclick = () => {
  currentAction = 'create';
  controlTodo('create');
}

editTodo.onclick = () => {
  currentAction = 'edit';
  controlTodo('edit');
}

deleteTodo.onclick = () => {
  currentAction = 'delete'
  controlTodo('delete')
}


function update_list_type(type){
  if(type === 'ul'){
    list_type_ele.value = 'ul';
    your_list.innerHTML = `<ul>${list.innerHTML}</ul>`
  }else{
    list_type_ele.value = 'ol'
    your_list.innerHTML = `<ol>${list.innerHTML}</ol>`
  }
  list = your_list.children[0];
}


function controlList(event,action){
  let target = event.target;
  
  if(action === 'add'){
    let new_list = receive(prompt('enter new todo item'), 'todo item');
    if (new_list){
      Data.isDone.push(false);
      Data.todo_list.push(new_list);
    }
  }else if(target.tagName === 'LI'){
    if(action === 'edit'){
      let editted_list = receive(prompt(`eneter what to replace with ${target.textContent}`),'replacement');
      if(editted_list){
        let index = getIndex(target,list);
        Data.todo_list[index] = editted_list;
      }
    }else{
      let index = getIndex(target,list);
      Data.todo_list = deleteAr(Data.todo_list,index);
    }
  }
  
  your_list.onclick = '';
}

function getLi(list_type,todo_list,isDone,index){
  let list = '';
  
  todo_list.forEach((todo,ind) => {
    list += `<li>${todo}<input ${isDone[ind] ? 'checked' : ''} onclick='controlDone(this,${index},${ind})' class="done" type="checkbox" name="" id=""></li>`
  })
  
  return list_type === 'ul' ? `<ul>${list}</ul>` :
  `<ol>${list}</ol>`
}

let todos;
let searchValue;

searchBar.addEventListener('change', eve => {
  searchBar.blur();
});

function update(){
  titleEle.textContent = Data.title;
  update_list_type(Data.list_type)
  list.innerHTML = '';
  Data.todo_list.forEach(li => {
    list.innerHTML += `<li>${li}</li>`;
  });
  
  
  
 // for todo 
  
  todos = toData(getData('todos'));
  todosEle.innerHTML = '';
  
  if(todos && todos.length){
    todos.forEach((todo,ind) => {
      todosEle.innerHTML += `
      <div class="todo">
      <div class="title">${todo.title}</div>
      <div class="descript">
        ${getLi(todo.list_type,todo.todo_list,todo.isDone,ind)}
      </div>
    </div>`
    })
  }else{
    todosEle.innerHTML = no_data_found;
  }
  
  // for searching
  searchValue = searchBar.value;
  const todo_items = select('*.todo');
  
 todo_items.forEach(todo => {
   let compareVal = todo.children[0].textContent.toLowerCase().trim();
   
  if (!compareVal.includes(searchValue.toLowerCase().trim())){
    todo.style.display = 'none'
  }else{
    todo.style.display = 'block'
  }
  
})
  
 
  
}

update();




function controlDone(checkbox,todo_ind,task_ind){
   todos[todo_ind].isDone[task_ind] = checkbox.checked;
   saveData('todos',toString(todos));
}


function controlTodo(action){
  
  if(action === 'create'){
    createBar.style.animationName = 'open';
    Data.title = 'todo title';
    Data.list_type = 'ol';
    Data.isDone = [];
    Data.todo_list = [];
  }else if(action === 'edit'){
    alert('please click on the todo you want to edit');
    todosEle.onclick = (eve) => {
    let target = eve.target;
    if(target.className === 'todo') {
      let index = getIndex(target, todosEle);
      let for_edit = todos[index];
      createBar.style.animationName = 'open';
      Data = for_edit;
      edit_index = index;
    }
    todosEle.onclick = '';
  }
}else{
  alert('click on todo you want to delete')
  todosEle.onclick = (eve) => {
    let target = eve.target;
    if (target.className === 'todo') {
      let index = getIndex(target, todosEle);
      let for_delete = todos[index];
      emptyData = todos;
      emptyData = deleteAr(emptyData, index);
      saveData('todos', toString(emptyData))
      todosEle.removeChild(target);
      todosEle.onclick = '';
    }
  }
}

searchBar.value = '';
  
}



setInterval(update,50);

  // updaing the create_bar
  
    list_type_ele.addEventListener('change',() => {
      Data.list_type = list_type_ele.value;
    });
    
    
    edit_title_btn.onclick = () => {
      let new_title = receive(prompt('enter new title'),'title');
      if(new_title){
        Data.title = new_title;
      }
    }
    
    addList.onclick = () => {
      controlList('','add');
    }
    
    editList.onclick = () => {
      alert('please click on the todo you want to edit')
      your_list.onclick = (eve) => {controlList(eve,'edit')};
    }
    
    deleteList.onclick = () => {
      alert('plase click on the todo you want to delete');
      your_list.onclick = (eve) => controlList(eve,'delete');
    }
    
    
    saveBtn.onclick = () => {
      
     if(Data.todo_list.length){
      if(!todos){
        todos = [];
        todos.push(Data);
        saveData('todos',toString(todos))
      }else{
        if(currentAction === 'create'){
          emptyData = todos;
          emptyData.push(Data);
          saveData('todos',toString(emptyData))
        }else{
          emptyData = todos;
          emptyData[edit_index] = Data;
          saveData('todos',toString(emptyData))
        }
      }
     }else{
       alert('cannot save empty todo');
     }
      
      createBar.style.animationName = 'close';
    }
  
      
  


