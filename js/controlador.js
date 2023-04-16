var categorias = [];
//Codigo para generar información de categorias y almacenarlas en un arreglo.
(() => {
    //Este arreglo es para generar textos de prueba
    let textosDePrueba = [
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolore, modi!",
        "Quos numquam neque animi ex facilis nesciunt enim id molestiae.",
        "Quaerat quod qui molestiae sequi, sint aliquam omnis quos voluptas?",
        "Non impedit illum eligendi voluptas. Delectus nisi neque aspernatur asperiores.",
        "Ducimus, repellendus voluptate quo veritatis tempora recusandae dolorem optio illum."
    ]
    //Genera dinamicamente los JSON de prueba para esta evaluacion,
    //Primer ciclo para las categorias y segundo ciclo para las apps de cada categoria
    let contador = 1;
    for (let i = 0; i < 5; i++) {//Generar 5 categorias
        let categoria = {
            nombreCategoria: "Categoria " + i,
            descripcion: textosDePrueba[Math.floor(Math.random() * (5 - 1))],
            aplicaciones: []
        };
        for (let j = 0; j < 10; j++) {//Generar 10 apps por categoria
            let aplicacion = {
                codigo: contador,
                nombre: "App " + contador,
                descripcion: textosDePrueba[Math.floor(Math.random() * (5 - 1))],
                icono: `img/app-icons/${contador}.webp`,
                instalada: contador % 3 == 0 ? true : false,
                app: "app/demo.apk",
                calificacion: Math.floor(Math.random() * (5 - 1)) + 1,
                descargas: 1000,
                desarrollador: `Desarrollador ${(i + 1) * (j + 1)}`,
                imagenes: ["img/app-screenshots/1.webp", "img/app-screenshots/2.webp", "img/app-screenshots/3.webp"],
                comentarios: [
                    { comentario: textosDePrueba[Math.floor(Math.random() * (5 - 1))], calificacion: Math.floor(Math.random() * (5 - 1)) + 1, fecha: "12/12/2012", usuario: "Juan" },
                    { comentario: textosDePrueba[Math.floor(Math.random() * (5 - 1))], calificacion: Math.floor(Math.random() * (5 - 1)) + 1, fecha: "12/12/2012", usuario: "Pedro" },
                    { comentario: textosDePrueba[Math.floor(Math.random() * (5 - 1))], calificacion: Math.floor(Math.random() * (5 - 1)) + 1, fecha: "12/12/2012", usuario: "Maria" },
                ]
            };
            contador++;
            categoria.aplicaciones.push(aplicacion);
        }
        categorias.push(categoria);
    }

    document.addEventListener('DOMContentLoaded', () => {
        crearDB();
        mostrarCategorias(listaCategorias);
        mostrarCategorias(listaCategoriasAdd);
        cargarDataIndexDB();
        cargarAplicaciones();
        agregarNuevaApp();
        btnGuardar.addEventListener('click', agregarNuevaApp);
        for (let i=1; i <=50; i++) {
            document.getElementById('lista-imagenes').innerHTML +=`<option value="img/app-icons/${i}.webp">Imagen ${i}</option>`;
        }
    });
    console.log(categorias);
})();

let DB;
const myModal = bootstrap.Modal.getOrCreateInstance('#modalNuevaApp');
const listaCategorias = document.querySelector('#categoria');
const listaCategoriasAdd = document.querySelector('#categoria-add');
const btnGuardar = document.querySelector('#guardar-app');

/**
 * Carga la informacion Inicial al IndexDB
 */
function cargarDataIndexDB() {
    const abrirConexion = window.indexedDB.open('appstore', 1);
    let data = {};
    abrirConexion.onerror = () => {
        console.log('Hubo un error');
    }
    abrirConexion.onsuccess = () => {
        DB = abrirConexion.result;
        const transaction = DB.transaction(['categorias'], 'readwrite');
        const objectStore = transaction.objectStore('categorias');
        categorias.forEach(element => {
            data.nombreCategoria = element.nombreCategoria;
            data.descripcion = element.descripcion;
            data.aplicaciones = element.aplicaciones;
            objectStore.put(data);
        });
        transaction.oncomplete = () => {
            console.log('cargando correctamente');
        }
        transaction.onerror = () => {
            console.log('Hubo error al editar cliente');
        }
    }
}

/**
 * Muestra las categorias disponibles
 * Extrae el nombre de las categorias de DB: appstore alojada en IndexDB
 */
function mostrarCategorias(element) {
    const abrirConexion = window.indexedDB.open('appstore', 1);
    abrirConexion.onerror = () => {
        console.log('Hubo un error');
    }
    abrirConexion.onsuccess = () => {
        DB = abrirConexion.result;
        const transaction = DB.transaction(['categorias'], 'readwrite');
        const objectStore = transaction.objectStore('categorias');
        const aplicaciones = objectStore.openCursor();
        aplicaciones.onsuccess = e => {
            const cursor = e.target.result;
            if (cursor) {
                element.innerHTML += `<option data-value="${cursor.value.nombreCategoria}">${cursor.value.nombreCategoria}</option>`;
                cursor.continue();
            }
        }
    }
}

/**
 * Elimina una aplicacion de la categoria
 */
let categoria;
function eliminarAplicacion(id) {
    const confirmar = confirm('Deseas eliminar esta aplicacion?');
    const card = document.querySelector(`#btn-${id}`).parentElement.parentElement.parentElement;
    if(confirmar){
        const transaction = DB.transaction(['categorias'], 'readwrite');
        const objectStore = transaction.objectStore('categorias');
        const apps = objectStore.openCursor();
        apps.onsuccess = e => {
            const cursor = e.target.result;
            if (cursor) {
                if (cursor.value.nombreCategoria === categoria) {
                    cursor.value.aplicaciones.splice(id, 1);
                    objectStore.put(cursor.value);
                    card.remove();
                }
            }
        }
        transaction.oncomplete = () => {
            console.log('Eliminando');
        }
        transaction.onerror = () => {
            console.log('Hubo un error');
        }
    }
}

/**
 * Muestra las categorias dependiendo de la categorias seleccionada
 */
function cargarAplicaciones() {
    const abrirConexion = window.indexedDB.open('appstore', 1);
    const contApps = document.querySelector('#aplicaciones');
    abrirConexion.onerror = () => {
        console.log('Hubo un error');
    }
    abrirConexion.onsuccess = () => {
        DB = abrirConexion.result;
        const transaction = DB.transaction(['categorias'], 'readwrite');
        const objectStore = transaction.objectStore('categorias');
        const aplicaciones = objectStore.openCursor();
        aplicaciones.onsuccess = e => {
            const cursor = e.target.result;
            if (cursor) {
                if (cursor.value.nombreCategoria === listaCategorias.value) {
                    resetApps(contApps);
                    cursor.value.aplicaciones.forEach((element, index) => {
                        let estrellas = generarEstrellas(element.calificacion);
                        categoria = listaCategorias.value;
                        contApps.innerHTML += `
                            <div id="app-card" class="col-sm-6 col-md-3 col-xl-2 p-1">
                                <div class="card card-color">
                                    <img src="${element.icono}" class="card-img-top" alt="..." onClick="detalleApp(${index})">
                                    <div class="card-body">
                                        <h5 class="card-title">${element.nombre}</h5>
                                        <p class="card-text">${element.desarrollador}</p>
                                        <div class="estrella-amarilla">
                                            ${estrellas}
                                        </div>
                                        <button id="btn-${index}" type="button" class="btn btn-danger mt-3" onclick="eliminarAplicacion(${index})">Eliminar</button>
                                    </div>
                                </div>
                            </div>`;
                    });
                }
                cursor.continue();
            }
        }
    }
}

/**
 * Muestra una ventana modal al dar click en la imagen de la app
 */
function detalleApp(id) {
    myModal.show();
    const abrirConexion = window.indexedDB.open('appstore', 1);
    abrirConexion.onerror = () => {
        console.log('Hubo un error');
    }
    abrirConexion.onsuccess = () => {
        DB = abrirConexion.result;
        const objectStore = DB.transaction('categorias').objectStore('categorias');
        const imgModal = document.querySelector('#modal-header');
        const bodyModal = document.querySelector('#modal-body');
        const estrellasModal = document.querySelector('#estrellas');
        const comentarios = document.querySelector('#comentarios');
        const btnInstalar = document.querySelector('#btn-guardar');
        objectStore.openCursor().onsuccess = e => {
            const cursor = e.target.result;
            if (cursor) {
                let estrellas = generarEstrellas(cursor.value.aplicaciones[id].calificacion);
                //boton instalar
                console.log(cursor.value.aplicaciones[id].instalada);
                btnInstalar.classList.remove('ocultar');
                if (cursor.value.aplicaciones[id].instalada) {
                    btnInstalar.classList.add('ocultar');
                }
                //imagenes
                imgModal.innerHTML = `
                    <div id="carouselExampleIndicators" class="carousel slide">
                        <div class="carousel-indicators">
                            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                        </div>
                        <div class="carousel-inner">
                            <div class="carousel-item active">
                                <img src="${cursor.value.aplicaciones[id].imagenes[0]}" class="d-block w-100" alt="...">
                            </div>
                            <div class="carousel-item">
                                <img src="${cursor.value.aplicaciones[id].imagenes[1]}" class="d-block w-100" alt="...">
                            </div>
                            <div class="carousel-item">
                                <img src="${cursor.value.aplicaciones[id].imagenes[2]}" class="d-block w-100" alt="...">
                            </div>
                        </div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                        </button>
                    </div>`;
                //Cuerpo modal
                bodyModal.innerHTML = `
                    <div class="card mb-3" style="max-width: 540px;">
                        <div class="row g-0">
                            <div class="col-md-4">
                                <img src="${cursor.value.aplicaciones[id].icono}" class="img-fluid rounded-start" alt="...">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <h5 class="card-title">${cursor.value.aplicaciones[id].nombre}</h5>
                                    <p class="card-text"><small class="text-muted">${cursor.value.aplicaciones[id].desarrollador}</small></p>
                                    <p class="card-text">${cursor.value.aplicaciones[id].descripcion}</p>
                                </div>
                            </div>
                        </div>
                    </div>`;
                //estrellas
                if (cursor.value.aplicaciones[id].calificacion >= 3) {
                    estrellasModal.classList.remove('estrellas-rojas');
                    estrellasModal.classList.add('estrellas-verdes');
                } else if (cursor.value.aplicaciones[id].calificacion < 3) {
                    estrellasModal.classList.remove('estrellas-verdes');
                    estrellasModal.classList.add('estrellas-rojas');
                }
                estrellasModal.innerHTML = `${estrellas} ${cursor.value.aplicaciones[id].calificacion.toFixed(1)}`;
                //Comentarios
                cursor.value.aplicaciones[id].comentarios.forEach(comentario => {
                    comentarios.innerHTML += `
                        <div class="card mb-3" style="max-width: 540px;">
                            <div class="row g-0">
                                <div class="col-md-4 center-div">
                                    <img src="/img/user.webp" class="img-fluid rounded-start" alt="...">
                                </div>
                                <div class="col-md-8">
                                    <div class="card-body">
                                        <h6 class="card-title">${comentario.usuario}</h6>
                                        <p class="card-text">${comentario.comentario}</p>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                });
            }
        }
    }
}

/**
 * 
 */
function agregarNuevaApp() {
    const abrirConexion = window.indexedDB.open('appstore', 1);

    const formulario = document.querySelector('#formulario');
    const codigoInput = document.querySelector('#codigo-nuevo');
    const nombreInput = document.querySelector('#form-nombreApp');
    const descripcionInput = document.querySelector('#form-descripcion');
    const calificacionInput = document.querySelector('#form-calificacion');
    const desarrolladorInput = document.querySelector('#form-desarrollador');
    const descargasInput = document.querySelector('#form-descargas');
    const urlImg = document.getElementById('lista-imagenes');
    let appActualizada;
    let appNueva = {};

    abrirConexion.onerror = () => {
        console.log('Hubo un error');
    }

    abrirConexion.onsuccess = () => {
        DB = abrirConexion.result;
        const transaction = DB.transaction(['categorias'], 'readwrite');
        const objectStore = transaction.objectStore('categorias');
        const aplicaciones = objectStore.openCursor();
        
        aplicaciones.onsuccess = e => {
            const cursor = e.target.result;
            if (cursor) {
                if(cursor.value.nombreCategoria === listaCategoriasAdd.value) {
                    let codigoUltimaApp = cursor.value.aplicaciones[cursor.value.aplicaciones.length-1].codigo + 1;
                    codigoInput.value = codigoUltimaApp;
                    appNueva = {
                        codigo: codigoUltimaApp,
                        nombre: nombreInput.value,
                        descripcion: descripcionInput.value,
                        icono: urlImg.value,
                        calificacion: calificacionInput.value,
                        descargas: descargasInput.value,
                        instalada: false,
                        desarrollador: desarrolladorInput.value,
                        comentarios: [],
                        imagenes: [],
                    };
                    cursor.value.aplicaciones.push(appNueva);
                    appActualizada = cursor.value;
                    objectStore.put(appActualizada);
                    cargarAplicaciones();

                    transaction.oncomplete = () => {
                        console.log('Editado correctamente');
                        formulario.reset();
                    }
                    transaction.onerror = () => {
                        console.log('Hubo error al editar cliente');
                    }
                }
                cursor.continue();
            }
        }
    }
}

