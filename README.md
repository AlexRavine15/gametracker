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

## 🚀 Estado del Proyecto (v1.1.0)
El proyecto cuenta con integración a base de datos relacional, consumo de API externa y validaciones dinámicas en el cliente para evitar duplicados.

### ✨ Características Implementadas:
* **📋 Vista de Tarjetas (`/misjuegos`):** Renderizado dinámico de juegos guardados con portadas en alta resolución, badges visuales por plataforma (PC 🎯, PlayStation 5, Xbox Series S/X, Switch) y etiquetas de estado (*Jugando*, *Pendiente*, *Terminado*).
* **🔍 Búsqueda e Integración API:** Conexión optimizada a la API de RAWG para obtener nombres, portadas e información de plataformas automáticamente.
* **🛡️ Validación Anti-Duplicados en Tiempo Real:** Micro-endpoint `/api/check-game` que verifica en la base de datos si el juego ya existe antes de enviar el formulario, mostrando una alerta visual sin recargar ni perder los campos ingresados.
* **🎉 Confirmación de Guardado:** Vista de éxito detallada que despliega la portada cargada y los datos recién almacenados.
* **🗄️ Persistencia de Datos:** Configuración robusta con Prisma ORM y MariaDB/MySQL con manejo de conexiones y tipos seguros en TypeScript.
---

## 🛠️ Tecnologías Utilizadas

* **Lenguaje:** TypeScript / JavaScript (ES6+)
* **Backend:** Node.js, Express.js
 **Consumo de API:** API pública de RAWG (Video Games Database)
* **Cliente HTTP:** Axios
* **Base de Datos & ORM:** MariaDB / MySQL + Prisma ORM
* **Frontend:** HTML5, CSS Inline/scoped, JavaScript Asíncrono (`fetch` API)

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
* **Configuracion de variables de entorno:** Crear un archivo .env en la raiz del proyecto con la estructura
  ```(.env)
  DATABASE_URL="mysql://USUARIO:PASSWORD@localhost:3306/NOMBRE_BD"
  RAWG_API_KEY="TU_RAWG_API_KEY_AQUI"
  PORT=3000
  ```
* **Sincronizar la Base de Datos:** Esto para que la app se sincronice con la Base de Datos creada y guarde correctamente los juegos a añadir
```bash
  npx prisma db push
  ```

* **Comando de Arranque en Desarrollo:** Para levantar el servidor con recarga en tiempo real, el entorno mapea el script configurado en el archivo. Solo debes ejecutar:
  ```bash
  npm run dev
  ```
  *(El servidor se iniciará automáticamente en: `http://localhost:3000`)*

---

### 3. Configurar la API Key de RAWG
Consigue una clave gratuita en [RAWG API](https://rawg.io/apidocs). Luego, abre el archivo `.env` y reemplaza el valor con tu propia clave:

```(.env)
 RAWG_API_KEY="TU_RAWG_API_KEY_AQUI"
```

---

## 🗺️ Endpoints Disponibles

| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| **`GET`** | `/agregarjuego` | Muestra el formulario visual para buscar un juego en RAWG, seleccionar la plataforma de destino y definir su estatus ("Pendiente", "Jugando", "Terminado"). |
| **`GET`** | `/agregar` | Endpoint de procesamiento que recibe los datos del formulario, consulta la API externa y persiste la información en la base de datos. |
| **`GET`** | `/misjuegos` | Renderiza la lista completa de tu backlog en un panel oscuro estilizado, mostrando las carátulas oficiales y encendiendo con un borde de neón la plataforma que elegiste. |

---

## 📈 Próximas Mejoras

Este proyecto se encuentra en constante evolución. Los siguientes pasos planificados en la hoja de ruta son:

1. **Página de Inicio (`/`):** Transformar la vista inicial básica en un dashboard funcional (resumen de juegos en curso, estadísticas rápidas o accesos directos).
2. **Autenticación de Usuarios:** Implementar un sistema de registro e inicio de sesión seguro con contraseñas encriptadas (`bcrypt`) y tokens de sesión (**JWT**).
3. **Desacoplamiento (API REST + Frontend Dedicado):** Transformar el backend en una API pura que responda únicamente datos JSON y construir un cliente independiente utilizando **React** y **Vite**.