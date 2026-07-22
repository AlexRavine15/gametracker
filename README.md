# 🎮 Game Backlog Tracker (API Integration)

¡Bienvenido! Este es un proyecto de gestión de *backlog* de videojuegos desarrollado con **Node.js**, **Express** y **TypeScript**. La aplicación se conecta directamente con la API pública de **RAWG** para buscar información real de los juegos (títulos, portadas y plataformas disponibles) y permite al usuario guardar su estatus de juego y la plataforma específica donde lo está jugando.

El backend no solo procesa los datos de forma segura, sino que además renderiza una interfaz limpia con un sutil sistema de estilos dinámicos que resalta visualmente la plataforma elegida utilizando bordes personalizados y efectos de elevación según la consola (PS4, PS5, Xbox Series, PC, etc.).

---

## 🚀 Características Clave

* **Arquitectura Backend:** Construido sobre Node.js utilizando Express con soporte nativo de tipado robusto gracias a TypeScript.
* **Integración con API Externa:** Consumo de la API de RAWG mediante Axios para la búsqueda precisa de metadatos de videojuegos en tiempo real.
* **Persistencia de Datos Local:** Almacenamiento local mediante un archivo estructurado en formato JSON (`juegos.json`) utilizando el módulo nativo `fs/promises`.
* **UI Dinámica e Inteligente:** Renderizado del lado del servidor (SSR) con un diseño personalizado. Cuenta con lógica avanzada en el pintado de etiquetas que detecta y resalta automáticamente la plataforma seleccionada (por ejemplo, diferenciando entre generaciones como PS4/PS5 o Xbox One/Series) sin alterar la paleta cromática original de cada marca.
* **Seguridad Básica:** Remoción de cabeceras vulnerables mediante la desactivación de `x-powered-by`.

---

## 🛠️ Tecnologías Utilizadas

* **Lenguaje:** TypeScript / JavaScript (ES6+)
* **Framework de Servidor:** Express.js
* **Cliente HTTP:** Axios
* **Entorno de Ejecución:** Node.js
* **Estilos:** HTML5 / CSS Inline con soporte dinámico de variables de marca

---

## 📦 Instalación y Configuración

Sigue estos pasos para clonar y ejecutar el proyecto de forma local:

### 1. Clonar el repositorio
```bash
git clone git clone https://github.com/AlexRavine15/gametracker.git
cd gametracker-node
```

### 2. Instalación y Ejecución automatizada desde `package.json`
A partir de este punto, toda la gestión de entornos, módulos y comandos de arranque se lee y ejecuta directamente desde las especificaciones nativas de nuestro archivo de configuración general (`package.json`):

* **Instalación de paquetes de entorno:** Al ejecutar el siguiente comando, Node.js leerá el bloque de `dependencies` y `devDependencies` del archivo para montar el entorno exacto de TypeScript y Express:
  ```bash
  npm install
  ```

* **Comando de Arranque en Desarrollo:** Para levantar el servidor con recarga en tiempo real, el entorno mapea el script configurado en el archivo. Solo debes ejecutar:
  ```bash
  npm run dev
  ```
  *(El servidor se iniciará automáticamente en: `http://localhost:3000`)*

---

### 3. Configurar la API Key de RAWG
Consigue una clave gratuita en [RAWG API](https://rawg.io/apidocs). Luego, abre el archivo `src/index.ts` y reemplaza el valor de la constante con tu propia clave:

```typescript
const RAWG_API_KEY: string = 'TU_RAWG_API_KEY_AQUI';
```

### 4. Inicializar el almacenamiento local
Crea un archivo vacío llamado `juegos.json` dentro de la carpeta `src/` con un arreglo inicial vacío:
```json
[]
```

---

## 🗺️ Endpoints Disponibles

| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| **`GET`** | `/new-game` | Muestra el formulario visual para buscar un juego en RAWG, seleccionar la plataforma de destino y definir su estatus ("Pendiente", "Jugando", "Terminado"). |
| **`GET`** | `/add` | Endpoint de procesamiento que recibe los datos del formulario, consulta la API externa y persiste la información en el archivo local. |
| **`GET`** | `/my-games` | Renderiza la lista completa de tu backlog en un panel oscuro estilizado, mostrando las carátulas oficiales y encendiendo con un borde de neón la plataforma que elegiste. |

---

## 📈 Próximas Mejoras (Evolución Fullstack)

Este proyecto se encuentra en constante evolución. Los siguientes pasos planificados en la hoja de ruta son:

1. **Migración a Variables de Entorno (.env):** Ocultar credenciales sensibles usando `dotenv`.
2. **Base de Datos Relacional:** Sustituir el archivo `juegos.json` por una base de datos real (SQLite/PostgreSQL) utilizando **Prisma ORM**.
3. **Autenticación de Usuarios:** Implementar un sistema de registro e inicio de sesión seguro con contraseñas encriptadas (`bcrypt`) y tokens de sesión (**JWT**).
4. **Desacoplamiento (API REST + Frontend Dedicado):** Transformar el backend en una API pura que responda únicamente datos JSON y construir un cliente independiente utilizando **React** y **Vite**.