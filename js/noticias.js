
// Función para direccionar de manera suave a la sección que le llega como parámetro
function moverSeccion(event, idSeccion) {
  event.preventDefault(); 
  document.getElementById(idSeccion).scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}


// Función para encapsular favoritos
function agregarAFavoritos(card) {
  const id = card.getAttribute('data-id');     
  const titulo = card.querySelector('h5').innerText;
  const descripcion = card.querySelector('.Dscrpcn').innerText; 
  const imagen = card.querySelector('img').getAttribute('src');

  const noticia = { id, titulo, descripcion, imagen };

  let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
  const existe = favoritos.some(fav => fav.id === id);

  //Aca validamos que la noticia no exista con el fin de evitar duplicados
  if (!existe) {
    favoritos.push(noticia);
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    alert('Noticia agregada a favoritos!');
    mostrarFavoritos(); 
  } else {
    alert('Esta noticia ya está en favoritos.');
  }
}

function mostrarFavoritos() {
  const lista = document.getElementById('lista-fav');
  lista.innerHTML = ''; 

  const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

  favoritos.forEach(noticia => {
    const div = document.createElement('div');
    div.classList.add('noticia-card');
    div.innerHTML = `
      <img src="${noticia.imagen}" alt="${noticia.titulo}">
      <h5>${noticia.titulo}</h5>
      <p>${noticia.descripcion}</p>
      <p><button class="boton-rmv" data-id="${noticia.id}">Quitar de favoritos</button></p>
    `;
    lista.appendChild(div);
  });

  document.querySelectorAll('.boton-rmv').forEach(boton => {
    boton.addEventListener('click', () => {
      quitarFavorito(boton.dataset.id);
      alert('Noticia eliminada de favoritos');
    });
  });
}

function quitarFavorito(id) {
  let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
  favoritos = favoritos.filter(fav => fav.id !== id);
  localStorage.setItem('favoritos', JSON.stringify(favoritos));
  mostrarFavoritos(); 
}


function mostrarNoticias() {
  const grid = document.querySelector('.noticias-grid');

  // añadimos las noticias dinamicas a la sección de noticias
  const noticias = JSON.parse(localStorage.getItem('noticias')) || [];

  // Primero eliminamos solo las dinámicas previas para evitar duplicados
  grid.querySelectorAll('.noticia-card[data-id^="noticia-"]').forEach(el => el.remove());

  noticias.forEach(noticia => {
    const div = document.createElement('div');
    div.classList.add('noticia-card');
    div.setAttribute('data-id', noticia.id);
    div.innerHTML = `
      <img src="${noticia.imagen}" alt="${noticia.titulo}">
      <h5>${noticia.titulo}</h5>
      <p class="Dscrpcn">${noticia.contenido}</p>
      <div class="acciones">
        <button class="ver-mas">Ver más</button>
        <button class="boton-fav">Favorito</button>
      </div>
    `;
    grid.appendChild(div);

    const botonVerMas = div.querySelector('.ver-mas');
    const descripcion = div.querySelector('.Dscrpcn');
    botonVerMas.addEventListener('click', () => {
      descripcion.classList.toggle('expandida');
      botonVerMas.textContent = descripcion.classList.contains('expandida')
        ? 'Ver menos'
        : 'Ver más';
    });

    const botonFav = div.querySelector('.boton-fav');
    botonFav.addEventListener('click', () => {
      agregarAFavoritos(div);
    });
  });
}


document.getElementById('explorar').addEventListener('click', function(event) {
  moverSeccion(event, 'Noticias');
});
document.getElementById('ir-noticia').addEventListener('click', function(event) {
  moverSeccion(event, 'Noticias');
});
document.getElementById('contactar').addEventListener('click', function(event) {
  moverSeccion(event, 'Contactenos');
});
document.getElementById('ir-contacto').addEventListener('click', function(event) {
  moverSeccion(event, 'Contactenos');
});
document.getElementById('crearnoticia').addEventListener('click', function(event) {
  moverSeccion(event,'crear-noticia');
});

// este evento toma las noticias que ya estan fijas y les pone las acciones de ver mas y ver menos
document.querySelectorAll('.noticia-card').forEach(card => {
  const boton = card.querySelector('.ver-mas');
  const descripcion = card.querySelector('.Dscrpcn');

  boton.addEventListener('click', () => {
    descripcion.classList.toggle('expandida');
    boton.textContent = descripcion.classList.contains('expandida')
      ? 'Ver menos'
      : 'Ver más';
  });
});

// Este evento toma las noticias fijas para agregar a favoritos
document.querySelectorAll('.boton-fav').forEach(boton => {
  boton.addEventListener('click', () => {
    const card = boton.closest('.noticia-card');
    agregarAFavoritos(card);
  });
});

//este evento funciona para el formulario de crear noticias
const form = document.getElementById('form-noticia');
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const titulo = document.getElementById('titulo').value.trim();
  const contenido = document.getElementById('msje').value.trim(); 
  const imagenInput = document.getElementById('imagen');

  let urlImagen = '';
  if (imagenInput.files[0]) {
    urlImagen = URL.createObjectURL(imagenInput.files[0]);
  } else {
    urlImagen ="imagenes/img.jpeg";
  }

  const noticiaId = `noticia-${Date.now()}`;

  // acá guardamos las noticias en el localstorage
  let noticias = JSON.parse(localStorage.getItem('noticias')) || [];
  noticias.push({
    id: noticiaId,
    titulo: titulo,
    contenido: contenido,
    imagen: urlImagen
  });
  localStorage.setItem('noticias', JSON.stringify(noticias));

  //apenas se guarde la noticia llamamos la función para que ahora se muestren con la nueva noticia
  mostrarNoticias();
  form.reset();
  alert('Noticia publicada con éxito ✅');
});

/* este bloque lo utilizamos para hacer la animación de la sección contactenos
   utilizamos la librería de JavaScript SweetAlert2 */
const formu = document.getElementById('form-contacto');
formu.addEventListener('submit', function(e) {
  e.preventDefault();

  Swal.fire({
    title: '¡Mensaje enviado!',
    text: 'Gracias por contactarnos, te responderemos en menos de 24 horas.',
    icon: 'success',
    confirmButtonText: 'Cerrar',
    showClass: {
      popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp'
    }
  });

  // acá limpiamos el formulario cuando se envía el mensaje de éxito.
  formu.reset();
});

// Al cargar la página mostramos noticias y favoritos guardados
document.addEventListener('DOMContentLoaded', () => {
  const fechaSpan = document.getElementById("fecha");
  const hoy = new Date();
  const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  fechaSpan.textContent = hoy.toLocaleDateString('es-CO', opciones);
  mostrarNoticias();   
  mostrarFavoritos();  
});


