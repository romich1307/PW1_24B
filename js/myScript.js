const SERVER_URL = "http://localhost:8080";

/**
 * Esta función muestra un formulario de login (para fetch)
 * El botón enviar del formulario deberá invocar a la función doLogin
 * Modifica el tag div con id main en el html
 */
function showLogin(){

    const mainTag = document.getElementById("main");

    var html = `
    <p>Usuario</p> 
    <input type='text' id='usuario' name='usuario' required><br>
    <p>Contraseña</p> 
    <input type='password' id='password' name='password' required><br>
    <button style = 'margin-top: 10px' onclick='doLogin()'>Iniciar Sesion</button>`;

    mainTag.innerHTML = html;

}

/**
 * Esta función recolecta los valores ingresados en el formulario
 * y los envía al CGI login.pl
 * La respuesta del CGI es procesada por la función loginResponse
 */
function doLogin(){

    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;

    //consultamos con login.pl
    // url a momento de conectar con perl
    let url = `${SERVER_URL}/cgi-bin/login.pl?usuario=${usuario}&password=${password}`;
    console.log(url);

    let xhr = new XMLHttpRequest();

    xhr.open("GET", url, true);
    xhr.send();

    xhr.onload = function () { //llamamos a loginResponse
        loginResponse(xhr.responseXML);
    };




}
/**
 * Esta función recibe una respuesta en un objeto XML
 * Si la respuesta es correcta, recolecta los datos del objeto XML
 * e inicializa la variable userFullName y userKey (e usuario)
 * termina invocando a la funcion showLoggedIn.
 * Si la respuesta es incorrecta, borra los datos del formulario html
 * indicando que los datos de usuario y contraseña no coinciden.
 */
function loginResponse(xml) {
    if (!xml || !xml.getElementsByTagName('user')[0]) {
        document.getElementById("usuario").value = "";
        document.getElementById("password").value = "";
        alert("Error en la respuesta del servidor");
        return;
    }

    const userTag = xml.getElementsByTagName('user')[0];
    const ownerElement = userTag.getElementsByTagName('owner')[0];
    
    if (ownerElement && ownerElement.textContent.trim()) {
        // Set userKey to username instead of ID
        userKey = document.getElementById("usuario").value; // Use username instead of ID
        let firstName = userTag.getElementsByTagName('firstName')[0].textContent;
        let lastName = userTag.getElementsByTagName('lastName')[0].textContent;
        
        userFullName = firstName + " " + lastName;
        console.log("Logged in successfully as:", userKey);
        showLoggedIn();
    } else {
        document.getElementById("usuario").value = "";
        document.getElementById("password").value = "";
        alert("Usuario o contraseña incorrectos");
    }
}
/**
 * esta función usa la variable userFullName, para actualizar el
 * tag con id userName en el HTML
 * termina invocando a las functiones showWelcome y showMenuUserLogged
 */
function showLoggedIn(){

    document.getElementById("userName").textContent = userFullName;
    showWelcome();
    showMenuUserLogged();
  


}


/**
 * Esta función crea el formulario para el registro de nuevos usuarios
 * el fomulario se mostrará en tag div con id main.
 * La acción al presionar el bontón de Registrar será invocar a la 
 * función doCreateAccount
 * */
function showCreateAccount(){

    const mainTag = document.getElementById("main");

    var html = `
    <label>Nombres: </label> 
    <input type='text' id='Nombre' name='Nombre' required><br>
    <label>Apellidos: </label> 
    <input type='text' id='Apellido' name='Apellido' required><br>
    <p>Usuario</p> 
    <input type='text' id='usuario' name='usuario' required><br>
    <p>Contraseña</p> 
    <input type='password' id='password' name='password' required><br>
    <button style = 'margin-top: 10px' onclick='doCreateAccount()'>Crear cuenta</button>`;

    mainTag.innerHTML = html;


}

/* Esta función extraerá los datos ingresados en el formulario de
 * registro de nuevos usuarios e invocará al CGI register.pl
 * la respuesta de este CGI será procesada por loginResponse.
 */
function doCreateAccount(){
    
    // nombre y apellido pueden escribir letras separadas y no habra problema
    const Nombre = encodeURIComponent(document.getElementById("Nombre").value).replace(/%20/g,"+");
    const Apellido = encodeURIComponent(document.getElementById("Apellido").value).replace(/%20/g,"+");
    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;


    if (usuario == "" || password == "" || Nombre == "" || Apellido == "") {
        document.getElementById("Nombre").value = "";
        document.getElementById("Apellido").value = "";
        document.getElementById("usuario").value = "";
        document.getElementById("password").value = "";
    }
    else {

      let url = `${SERVER_URL}/cgi-bin/register.pl?usuario=${usuario}&password=${password}&Nombre=${Nombre}&Apellido=${Apellido}`
        console.log(url);

        let xhr = new XMLHttpRequest();

        xhr.open("GET", url, true);
        xhr.send();
        // registramos cuenta y la logeamos automaticamente
        xhr.onload = function () {
            loginResponse(xhr.responseXML);
        };

    }


}

/*
 * Esta función invocará al CGI list.pl usando el nombre de usuario 
 * almacenado en la variable userKey
 * La respuesta del CGI debe ser procesada por showList
 */
function doList(){
    if (!userKey) {
        console.error("No user logged in");
        document.getElementById("main").innerHTML = "<p>Por favor inicie sesión</p>";
        return;
    }

    let url = `${SERVER_URL}/cgi-bin/list.pl?usuario=${userKey}`;
    console.log("Listing articles for user:", userKey);
    
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.send();

    xhr.onload = function () {
        if (xhr.status === 200) {
            showList(xhr.responseXML);
        } else {
            console.error("Error loading list:", xhr.status);
            document.getElementById("main").innerHTML = "<p>Error al cargar la lista</p>";
        }
    };
}

/**
 * Esta función recibe un objeto XML con la lista de artículos de un usuario
 * y la muestra incluyendo:
 * - Un botón para ver su contenido, que invoca a doView.
 * - Un botón para borrarla, que invoca a doDelete.
 * - Un botón para editarla, que invoca a doEdit.
 * En caso de que lista de páginas esté vacia, deberá mostrar un mensaje
 * indicándolo.
 */
function showList(xml) {
    if (!xml || !xml.children[0]) {
        document.getElementById("main").innerHTML = "<p>No hay páginas creadas</p>";
        return;
    }

    const articlesTag = xml.children[0];
    let html = "";

    if (articlesTag.children.length === 0) {
        html = "<p>No hay páginas creadas</p>";
    } else {
        html = "<ul>";
        for (let i = 0; i < articlesTag.children.length; i++) {
            let article = articlesTag.children[i];
            let owner = article.getElementsByTagName("owner")[0].textContent;
            let title = article.getElementsByTagName("title")[0].textContent;
            
            html += `<li>
                ${title}
                <button onclick="doView('${owner}','${title}')">Ver</button>
                <button onclick="doEdit('${owner}','${title}')">Editar</button>
                <button onclick="doDelete('${owner}','${title}')">Borrar</button>
            </li>`;
        }
        html += "</ul>";
    }
    
    document.getElementById("main").innerHTML = html;
}
/**
 * Esta función deberá generar un formulario para la creación de un nuevo
 * artículo, el formulario deberá tener dos botones
 * - Enviar, que invoca a doNew 
 * - Cancelar, que invoca doList
 */
function showNew(){

    let showNew = `<p>Titulo</p>
    <input id='titulo' name='titulo' type='text'><br>
    <p>Contenido-markdown</p>
    <textarea id="cuerpo" name="cuerpo"></textarea><br>
    <button onclick='doNew()'>Enviar</button>
    <button onclick='doList()'>Cancelar</button>`;
    
    document.getElementById("main").innerHTML = showNew;

}

/*
 * Esta función invocará new.pl para resgitrar un nuevo artículo
 * los datos deberán ser extraidos del propio formulario
 * La acción de respuesta al CGI deberá ser una llamada a la 
 * función responseNew
 */
function doNew(){
    let titulo = encodeURIComponent(document.getElementById("titulo").value).replace(/%20/g, "+");
    let cuerpo = encodeURIComponent(document.getElementById("cuerpo").value).replace(/%20/g,"+");
    
    console.log("Creating new article:");
    console.log("User:", userKey);
    console.log("Title:", titulo);
    console.log("Content:", cuerpo);
    
    if(!userKey) {
        alert("Error: No hay usuario logueado");
        return;
    }
    
    if(!titulo || !cuerpo) {
        alert("Por favor complete todos los campos");
        return;
    }
    
    let url = `${SERVER_URL}/cgi-bin/new.pl?usuario=${userKey}&titulo=${titulo}&cuerpo=${cuerpo}`; 
    console.log("Sending request to:", url);
    
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.send();
    
    xhr.onload = function () {
        console.log("Response status:", xhr.status);
        console.log("Response text:", xhr.responseText);
        if(xhr.status === 200) {
            responseNew(xhr.responseXML);
        }
    };
}
function responseNew(xml) {
    if(xml && xml.getElementsByTagName('article')[0]) {
        console.log("Article created successfully");
        doList(); // Refresh the list after creation
    } else {
        alert('Error al crear la página');
    }
}
/*
 * Esta función obtiene los datos del artículo que se envían como respuesta
 * desde el CGI new.pl y los muestra en el HTML o un mensaje de error si
 * correspondiera
 */
function responseView(response){
    let pag = response.children[0];
    if(pag) {
        document.getElementById("main").innerHTML = pag.innerHTML;
    } else {
        document.getElementById("main").innerHTML = "<p>Error: No se pudo cargar la página</p>";
    }
}

/*
 * Esta función invoca al CGI view.pl, la respuesta del CGI debe ser
 * atendida por responseView
 */
function doView(owner, title){
    let url = `${SERVER_URL}/cgi-bin/view.pl?usuario=${owner}&titulo=${title}`;

    let xhr = new XMLHttpRequest();

    xhr.open("GET", url, true);
    xhr.send();

    xhr.onload = function () {
        responseView(xhr.responseXML);
    };

}

/*
 * Esta función muestra la respuesta del cgi view.pl en el HTML o 
 * un mensaje de error en caso de algún problema.
 */
function responseView(response){

    let pag = response.children[0];
    console.log(pag);
  
    document.getElementById("main").innerHTML = pag.innerHTML;
}

/*
 * Esta función invoca al CGI delete.pl recibe los datos del artículo a 
 * borrar como argumentos, la respuesta del CGI debe ser atendida por doList
 */
function doDelete(owner, title){

    let url = `${SERVER_URL}/cgi-bin/delete.pl?usuario=${owner}&titulo=${title}`;
    let xhr = new XMLHttpRequest();

    xhr.open("GET", url, true);
    xhr.send();

    xhr.onload = function () {
        doList();
    };

}

/*
 * Esta función recibe los datos del articulo a editar e invoca al cgi
 * article.pl la respuesta del CGI es procesada por responseEdit
 */
function doEdit(owner, title){

    let url = `${SERVER_URL}/cgi-bin/article.pl?usuario=${owner}&titulo=${title}`;
    console.log(url);
    let xhr = new XMLHttpRequest();
  
    xhr.open("GET", url, true);
    xhr.send();

    xhr.onload = function () {
        responseEdit(xhr.responseXML);
    };

}

/*
 * Esta función recibe la respuesta del CGI data.pl y muestra el formulario 
 * de edición con los datos llenos y dos botones:
 * - Actualizar que invoca a doUpdate
 * - Cancelar que invoca a doList
 */
function responseEdit(xml){

  let titulo = xml.children[0].children[1].textContent; // titulo
  let cuerpo = xml.children[0].children[2].textContent; // cuerpo-markdown
    console.log(titulo);
    console.log(xml.children[0]);
    let showUpdate = `<h2>${titulo}</h2>
    <p>Contenido-markdown</p>
    <textarea style = "width: 100%;" type="text" id ="cuerpo" name="cuerpo">${cuerpo}</textarea><br>
    <button onclick='doUpdate("${titulo}")'>Actualizar Pagina</button>
    <button onclick='doList()'>Cancelar</button>`;

    document.getElementById("main").innerHTML = showUpdate;

}
/*
 * Esta función recibe el título del artículo y con la variable userKey y 
 * lo llenado en el formulario, invoca a update.pl
 * La respuesta del CGI debe ser atendida por responseNew
 */
function doUpdate(title){

    console.log(title);
    title = encodeURIComponent(title).replace(/%20/g, "+"); // para reemplazar espacios en el url
    let cuerpo = encodeURIComponent(document.getElementById("cuerpo").value).replace(/%20/g,"+");
    console.log(title);
    let url = `${SERVER_URL}/cgi-bin/update.pl?usuario=${userKey}&titulo=${title}&cuerpo=${cuerpo}`; console.log

    console.log(url);
    let xhr = new XMLHttpRequest();

    xhr.open("GET", url, true);
    xhr.send();

    xhr.onload = function () {
        responseNew(xhr.responseXML); // para verificar si actualizo o no
    };


}
