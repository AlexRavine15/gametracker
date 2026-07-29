import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import axios from 'axios';
import { prisma } from './db.js';

const app = express();
app.disable('x-powered-by');
const PORT: number = 3000;
const API_KEY: string = process.env.RAWG_API_KEY || '';
const PLATFORM_COLORS: Record<string, string> = {
    'pc': '#1b2838',           
    'playstation': '#003087',  
    'xbox': '#107c10',         
    'nintendo': '#e60012',     
    'ios': '#2f3640',          
    'android': '#3ddc84'       
};

function getPlatformColor(slug: string): string {
    const lowerSlug = slug.toLowerCase();
    for (const [key, color] of Object.entries(PLATFORM_COLORS)) {
        if (lowerSlug.includes(key)) {
            return color;
        }
    }
    return '#7f8c8d';
}

app.get('/misjuegos', async (req: Request, res: Response) => {
    const games = await prisma.game.findMany();
    
    if (games.length === 0) {
        return res.send(`
            <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
                <h2 style="color: #e74c3c;">❌ No hay juegos disponibles</h2>
                <p>No se encontraron juegos en la base de datos.</p>
            </div>
        `);
    }

    const gamesHtml = games.map((game: any) => {
        const availableList: string[] = game.availablePlatforms 
            ? game.availablePlatforms.split(', ') 
            : [];

        const platformsHtml = availableList.map((platformName: string) => {
            const isChosen = game.platform && (
                platformName.toLowerCase() === game.platform.toLowerCase() ||
                platformName.toLowerCase().includes(game.platform.toLowerCase()) ||
                game.platform.toLowerCase().includes(platformName.toLowerCase())
            );
            
            const backgroundColor = typeof getPlatformColor === 'function' 
                ? getPlatformColor(platformName) 
                : '#34495e';

            let designStyle = `background: ${backgroundColor}; color: #ffffff; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 4px; border: 2px solid transparent; transition: all 0.2s;`;
            
            if (isChosen) {
                designStyle += `
                    border: 2px dashed #ffffff;
                    outline: 3px solid ${backgroundColor};
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
                    transform: scale(1.1);
                    font-weight: bold;
                    z-index: 10;
                `;
            }

            const chosenMarker = isChosen ? '🎯 ' : '';

            return `
                <span style="${designStyle}">
                    ${chosenMarker}${platformName}
                </span>
            `;
        }).join('');

        let statusColor = '#b91515';
        if (game.status === 'Jugando') {
            statusColor = '#133db1';
        } else if (game.status === 'Terminado' || game.status === 'Completado') {
            statusColor = '#10aa18';
        }

        return `
            <div style="display: flex; background: white; border: 1px solid #ddd; margin-bottom: 20px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.04);">
                <img src="${game.coverImage || ''}" style="width: 170px; object-fit: cover;" alt="${game.title}">
                <div style="padding: 20px; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        <h3 style="margin: 0 0 10px 0; color: #2c3e50; font-size: 1.4rem;">${game.title}</h3>
                        <p style="margin: 5px 0;">
                            <span style="background: ${statusColor}; color: white; padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">
                                ${game.status}
                            </span>
                        </p>
                    </div>
                    
                    <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #f1f2f6;">
                        <p style="margin: 0 0 8px 0; font-size: 0.85rem; color: #a4b0be; font-weight: bold; text-transform: uppercase;">Plataformas Disponibles</p>
                        <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; padding: 5px 0;">
                            ${platformsHtml || '<span style="color: #999; font-size: 0.8rem;">No especificadas</span>'}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    res.send(`
        <body style="font-family: sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; background-color: #252525;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                <h1 style="color: #858ea1; margin: 0; font-size: 2rem;">📋 Mi Lista de Juegos</h1>
                <a href="/agregarjuego" style="padding: 10px 20px; background: #2ecc71; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; box-shadow: 0 2px 5px rgba(46, 204, 113, 0.3);">+ Agregar Juego</a>
            </div>
            <div>${gamesHtml}</div>
        </body>
    `);
});
    

app.get(`/`, (req: Request, res: Response) => {
    res.send(`<div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
            <h1 style="color: #4A90E2;">🎮 GameTracker Hub Server 🎮</h1>
            <p style="font-size: 1.2rem; color: #333;">¡El servidor deNode.js con TypeScript está vivo y respondiendo!</p>
        </div>
        `);
});

app.get('/agregarjuego', (req: Request, res: Response) => {
    res.send(`
        <body style="font-family: sans-serif; max-width: 500px; margin: 60px auto; padding: 30px; background-color: #252525; color: #3b6196;">
            <div style="background: gray; padding: 30px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                
                <div id="error-alert" style="display: none; background: #e74c3c; color: white; padding: 12px; border-radius: 6px; margin-bottom: 15px; font-weight: bold; text-align: center;">
                    ⚠️ Este juego ya está en tu lista.
                </div>

                <h2 style="margin-top: 0; color: #2f3542; text-align: center;">🎮 Agregar Nuevo Juego</h2>
                
                <form id="game-form" action="/agregar" method="GET" style="display: flex; flex-direction: column; gap: 15px;">
                    
                    <div style="display: flex; flex-direction: column; gap: 5px;">
                        <label style="font-weight: bold;">Nombre del juego:</label>
                        <input type="text" id="game-title" name="name" placeholder="Ej. Cyberpunk 2077, Metro Exodus..." required 
                               style="padding: 10px; border: 1px solid #ccc; border-radius: 5px; font-size: 1rem;">
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 5px;">
                        <label style="font-weight: bold;">Plataforma:</label>
                        <select name="platform" style="padding: 10px; border: 1px solid #ccc; border-radius: 5px; font-size: 1rem;">
                            <option value="PC">PC</option>
                            <option value="playstation5">PlayStation 5</option>
                            <option value="playstation4">PlayStation 4</option>
                            <option value="Switch">Nintendo Switch</option>
                            <option value="Xbox">Xbox Series X/S</option>
                        </select>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 5px;">
                        <label style="font-weight: bold;">Estatus:</label>
                        <select name="status" style="padding: 10px; border: 1px solid #ccc; border-radius: 5px; font-size: 1rem;">
                            <option value="Pendiente">Pendiente</option>
                            <option value="Jugando">Jugando</option>
                            <option value="Terminado">Terminado</option>
                        </select>
                    </div>

                    <button type="submit" 
                            style="margin-top: 10px; padding: 12px; background: #1e90ff; color: white; border: none; border-radius: 5px; font-size: 1rem; font-weight: bold; cursor: pointer;">
                        Buscar y Guardar Juego
                    </button>
                </form>

                <div style="text-align: center; margin-top: 20px;">
                    <a href="/misjuegos" style="color: #d4dbe4; text-decoration: none; font-size: 0.9rem;">📋 Ver mi lista actual</a>
                </div>
            </div>

            <script>
                const form = document.getElementById('game-form');
                const titleInput = document.getElementById('game-title');
                const errorAlert = document.getElementById('error-alert');

                form.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    errorAlert.style.display = 'none';

                    const title = titleInput.value.trim();
                    if (!title) return;

                    try {
                        const response = await fetch('/api/check-game?title=' + encodeURIComponent(title));
                        const data = await response.json();

                        if (data.exists) {
                            errorAlert.innerText = '⚠️ El juego "' + title + '" ya está registrado en tu lista.';
                            errorAlert.style.display = 'block';
                        } else {
                            form.submit(); 
                        }
                    } catch (error) {
                        console.error('Error checking game:', error);
                        errorAlert.innerText = '❌ Ocurrió un error al verificar el juego.';
                        errorAlert.style.display = 'block';
                    }
                });
            </script>
        </body>
    `);
});

app.get('/api/check-game', async (req: Request, res: Response) => {
  const { title } = req.query;

  if (typeof title !== 'string' || !title.trim()) {
    return res.json({ exists: false });
  }

  const existingGame = await prisma.game.findFirst({
    where: {
      title: title.trim(),
    },
  });

  return res.json({ exists: !!existingGame });
});

app.get(`/agregar`, async (req: Request, res: Response) => {
    const title = req.query.name as string;
    const status = req.query.status as string;
    const platform = req.query.platform as string;

    if (!title || !status || !platform) {
        return res.status(400).send(`<div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
            <h2 style="color: #e74c3c;">❌ Error</h2>
            <p>Faltan parámetros requeridos. Asegúrate de incluir 'Nombre', 'Estado' y 'Plataforma'.</p>
        </div>`);
    }

    try {
        const response = await axios.get(`https://api.rawg.io/api/games`, {
            params: {
                key: API_KEY,
                search: title,
                page_size: 1
            }
        });

        if (response.data.results.length === 0) {
            return res.status(404).send(`<div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
                <h2 style="color: #e74c3c;">❌ Juego no encontrado</h2>
                <p>No se encontró ningún juego con el nombre proporcionado.</p>
            </div>`);
        }

        const apiGame = response.data.results[0];

        const platformsNames = apiGame.platforms ? apiGame.platforms.map((p: any) => p.platform.name).join(', ') : 'No Disponible';

        const newGame = await prisma.game.create({
            data: {
                title: apiGame.name,                         
                rawgId: apiGame.id,                          
                platform: platform,
                availablePlatforms: platformsNames,                          
                status: status,                              
                coverImage: apiGame.background_image,
            },
        });

        res.send(`
            <body style="font-family: sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; background-color: #252525; color: white; text-align: center;">
    <div style="background: #333; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.4); border: 1px solid #444;">
      
      <h2 style="color: #2ecc71; margin-top: 0; font-size: 1.8rem;">🎉 ¡Juego agregado con éxito!</h2>
      
      <div style="margin: 20px 0;">
        <img 
          src="${newGame.coverImage}" 
          alt="${newGame.title}" 
          style="width: 200px; height: 280px; object-fit: cover; border-radius: 10px; box-shadow: 0 6px 12px rgba(0,0,0,0.5); border: 2px solid #555;"
        />
      </div>

      <h3 style="margin: 10px 0; color: #ffffff; font-size: 1.5rem;">${newGame.title}</h3>
      
      <p style="color: #a4b0be; margin-bottom: 25px; font-size: 0.95rem;">
        Guardado en: <span style="color: #2ecc71; font-weight: bold;">${newGame.platform}</span> | Estado: <span style="color: #3498db; font-weight: bold;">${newGame.status}</span>
      </p>

      <div style="display: flex; gap: 15px; justify-content: center; margin-top: 20px;">
        <a href="/misjuegos" style="padding: 12px 24px; background: #2ecc71; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; transition: all 0.2s;">
          📋 Ver Mi Lista
        </a>
        <a href="/agregarjuego" style="padding: 12px 24px; background: #444; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; border: 1px solid #666;">
          + Agregar Otro
        </a>
      </div>

    </div>
  </body>
        `);
    } catch (error) {
        console.error("Error al agregar el juego:", error);
        res.status(500).send(`<div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
            <h2 style="color: #e74c3c;">❌ Error</h2>
            <p>No se pudo agregar el juego.</p>
        </div>`);
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
});