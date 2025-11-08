// Archivo: server.js  se uso npm install express multer cors
// usar node server.js para ctivar
// Este script crea un servidor Express simple para simular la subida local.
// Recibe un archivo, lo mueve a la carpeta de assets de Angular, y devuelve la ruta relativa.

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors'); // Necesario para permitir llamadas desde Angular

const app = express();
const PORT = 3000;

// 1. Configuración de CORS para permitir la llamada desde Angular
app.use(cors({
    origin: 'http://localhost:4200' // O el puerto donde corra tu app Angular
}));

// 2. RUTA CRÍTICA: Ajusta esto a la ubicación REAL de tu carpeta assets/images
const pathToAssets = path.join(__dirname, '..', 'src', 'assets', 'images');
const relativePathPrefix = 'assets/images/'; // Ruta relativa que se guarda en Firebase

//  FIX CRÍTICO: Configura Express para servir los archivos de la carpeta assets/images 
// cuando se pide la URL /assets-local/...
app.use('/assets-local', express.static(pathToAssets));

// 3. Configuración de Multer para manejar el archivo
// Usamos el disco de almacenamiento y definimos el destino temporal
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Guarda temporalmente en una carpeta 'temp'
        if (!fs.existsSync('temp')) {
            fs.mkdirSync('temp');
        }
        cb(null, 'temp/');
    },
    filename: (req, file, cb) => {
        // Usa el nombre original del archivo
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// 4. Endpoint para manejar la subida local
app.post('/upload-local', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se subió ningún archivo.' });
    }

    const file = req.file;
    const oldPath = file.path;
    const fileName = file.originalname;
    const newPath = path.join(pathToAssets, fileName);

    // Asegúrate de que el directorio de destino final exista
    if (!fs.existsSync(pathToAssets)) {
        fs.mkdirSync(pathToAssets, { recursive: true });
    }

    // Mueve el archivo desde el directorio temporal al directorio de assets
    fs.rename(oldPath, newPath, (err) => {
        if (err) {
            console.error('Error al mover el archivo a assets:', err);
            return res.status(500).json({ error: 'Error interno del servidor al guardar el archivo.' });
        }

        // ÉXITO: Devuelve la ruta que Angular necesita guardar en Firebase
        const filePath = relativePathPrefix + fileName;
        console.log(`[BACKEND LOCAL] Archivo guardado en: ${newPath}`);
        console.log(`[BACKEND LOCAL] Ruta devuelta a Angular: ${filePath}`);
        
        // El frontend recibirá este objeto JSON
        res.json({
            message: 'Archivo movido y ruta lista para Firebase.',
            filePath: filePath 
        });
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor local de subida corriendo en http://localhost:${PORT}`);
    console.log(`La ruta de guardado es: ${pathToAssets}`);
    console.log(`Las imágenes se sirven desde http://localhost:${PORT}/assets-local/`); //  Nuevo URL para servir
});