
/**
 * Crea DB appstore en IndexDB
 * Object Store: categorias
 */
function crearDB() {
    const crearDB = window.indexedDB.open('appstore', 1);
    crearDB.onerror = () => {
        console.log('Hubo un error');
    }
    crearDB.onsuccess = () => {
        DB = crearDB.result;
    }
    crearDB.onupgradeneeded = e => {
        const db = e.target.result;
        const objectStore = db.createObjectStore('categorias', {keyPath: 'nombreCategoria', autoIncrement: true});
        //Columnas
        objectStore.createIndex('nombreCategoria', 'nombreCategoria', {unique: true});
        objectStore.createIndex('descripcion', 'descripcion', {unique: false});
        objectStore.createIndex('aplicaciones', 'aplicaciones', {unique: false});
        console.log('DB lista y creada.');
    }
}

/**
 * Genera strellas para la calificacion de las apps
 */
function generarEstrellas(num) {
    let stars = '';
    for (let i = 1; i <= num; i++) {
        stars += '<i class="fa-solid fa-star"></i>';
    }
    for (let i = 1; i <= (5 - num); i++) {
        stars += '<i class="fa-regular fa-star"></i>';
    }
    return stars;
}

/**
 * Limpia las apps que se cargan dependiendo de la categoria
 */
function resetApps(e) {
    while (e.firstChild) {
        e.removeChild(e.firstChild);
    }
}
