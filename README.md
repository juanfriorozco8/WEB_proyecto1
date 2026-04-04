# BlogBoard — Proyecto 1

Aplicación web de tipo blog desarrollada con HTML, CSS y JavaScript puro. Consume la API pública DummyJSON para listar publicaciones, ver detalles, crear posts con validación, filtrar contenido y gestionar eliminación simulada en la interfaz.

## Integrantes
- Juan Francisco Orozco Mijangos — 24647
- Yehosua Hércules — 241452

## Tecnologías
- HTML5
- CSS3 (arquitectura modular)
- JavaScript ES Modules (sin frameworks ni librerías)
- API pública: [DummyJSON](https://dummyjson.com)

## Funcionalidades
- Listado de publicaciones con título, resumen, autor y botón "Ver más"
- Paginación del listado
- Vista de detalle por publicación
- Formulario de creación con validación en JavaScript
  - Título obligatorio, mínimo 5 caracteres
  - Contenido obligatorio, mínimo 20 caracteres
  - Autor obligatorio
- Solicitud POST real a la API
- Búsqueda y 3 filtros: texto, autor, tag + ordenamiento
- Eliminación simulada visualmente en frontend
- Sección adicional: Autores con filtro rápido
- Estados de UI: loading, success, error, empty
- Toasts de notificación

## Endpoints utilizados
- `GET /posts` — listado de publicaciones
- `GET /posts/:id` — detalle de publicación
- `GET /users` — listado de usuarios/autores
- `POST /posts/add` — crear publicación

## Navegación (hash router)
- `#/home` — inicio
- `#/post/:id` — detalle
- `#/create` — formulario de creación
- `#/authors` — sección de autores

## Estructura del proyecto
```
blogboard/
├── index.html
├── README.md
├── .gitignore
├── css/
│   ├── main.css
│   └── components.css
└── js/
    ├── app/
    │   ├── main.js
    │   └── router.js
    ├── core/
    │   ├── client.js
    │   └── state.js
    ├── api/
    │   ├── posts.api.js
    │   └── users.api.js
    ├── services/
    │   ├── posts.service.js
    │   └── filters.service.js
    ├── ui/
    │   ├── renderPosts.js
    │   └── renderStates.js
    ├── features/
    │   ├── home.controller.js
    │   └── detail.controller.js
    ├── controllers/
    │   ├── create.controller.js
    │   └── extra.controller.js
    └── utils/
        ├── dom.js
        └── validators.js
```

## Cómo ejecutar
1. Clonar el repositorio
2. Entrar a la carpeta del proyecto
3. Levantar un servidor local, por ejemplo:
   - VS Code: click derecho en `index.html` → Open with Live Server
4. Abrir `http://localhost:8080` en el navegador


## Notas
- DummyJSON simula escritura, por eso la eliminación se maneja localmente en el estado
- Los cambios de creación y eliminación se reflejan inmediatamente en la interfaz
