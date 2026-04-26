import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/index.js';
import notfound from './middlewares/notFound.middleware.js';
import errorHandler from './middlewares/error.middleware.js';
import xssSanitizer from './middlewares/sanitizer-middleware.mjs';

const app = express();

//CORS para permitir futuras llamadas desde el frontend
const corsOptions = {
    origin: [
        "http://localhost:3000",
        "https://expense-manager-backend-mrhhcene1-santiagochimkos-projects.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // solo si usás cookies/sesión
};

app.use(cors(corsOptions));

//Middleware para permitir JSON en el body de las request
app.use(express.json());

app.use(xssSanitizer);
//Rutas de la API
//Todo queda colgado de /api y dentro se maneja el versionado
app.use('/api', apiRoutes);

//Middleware para rutas inexistentes
//Va despues de declarar las rutas validas.
app.use(notfound);

//Middleware global de errores
// Va al final para capturar errores lanzados de controladores/services
app.use(errorHandler);

export default app;