const lista = document.getElementById("lista");
const inputDescricao = document.getElementById("inputDescricao");
const btAdd = document.getElementById("btAdd");

const taskUrl = "https://parseapi.back4app.com/classes/Task";
const headers = {
  "X-Parse-Application-Id": "9JIThuwlQdJMEgce28e6lGOe6FTHETD4eEvKAiKG",
  "X-Parse-REST-API-Key": "3iqKKLOHij2k1fuuDUw2LsmD5gUV0kGSYHqJBzTr",
};

const renderizaLista = (lista, tarefas) => {
  lista.innerHTML = "";
  tarefas.forEach((tarefa) => {
    const itemText = document.createTextNode(
      `${tarefa.description} (${tarefa.done}) `
    );
    const buttonDelete = document.createElement("button");
    buttonDelete.innerHTML = "X";
    buttonDelete.onclick = () => deleteTask(tarefa.objectId);
    const buttonUpdate = document.createElement("button");
    
    

const butonCheck = document.createElement ("input");
butonCheck.type = "checkbox"
butonCheck.checked=tarefa.done
butonCheck.onchange=()=> updateTask(tarefa,butonCheck.checked)

    buttonUpdate.onclick = () => updateTask(tarefa);
    const listItem = document.createElement("li");
    listItem.appendChild(butonCheck)
    listItem.appendChild(itemText);
    listItem.appendChild(buttonDelete);

    lista.appendChild(listItem);

    if(tarefa.done){
        listItem.style.textDecorationLine="line-through"
        listItem.style.color="red"
    }
  });
};

const getTasks = () => {
  fetch(taskUrl, { headers: headers })
    .then((res) => res.json())
    .then((data) => {
      renderizaLista(lista, data.results);
    });
};

const handleBtAddClick = () => {
  const description = inputDescricao.value;
  if (!description) {
    alert("É necessário digitar uma descrição!");
    return;
  }
  btAdd.disabled = true;
  fetch(taskUrl, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ description: description }),
  })
    .then((res) => res.json())
    .then((data) => {
      getTasks();
      btAdd.disabled = false;
      inputDescricao.value = "";
      inputDescricao.focus();
      console.log("data", data);
    })
    .catch((err) => {
      btAdd.disabled = false;
      console.log(err);
    });
};

const deleteTask = (id) => {
  fetch(`${taskUrl}/${id}`, {
    method: "DELETE",
    headers: headers,
  })
    .then((res) => res.json())
    .then((data) => {
      getTasks();
      console.log("data", data);
    })
    .catch((err) => {
      console.log(err);
    });
};

const updateTask = (task) => {
  fetch(`${taskUrl}/${task.objectId}`, {
    method: "PUT",
    headers: headers,
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ done: !task.done }),
  })
    .then((res) => res.json())
    .then((data) => {
      getTasks();
      console.log("data", data);
    })
    .catch((err) => {
      console.log(err);
    });
};

getTasks();

btAdd.onclick = handleBtAddClick;