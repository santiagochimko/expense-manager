import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/index.js';
import notfound from './middlewares/notFound.middleware.js';
import errorHandler from './middlewares/error.middleware.js';

const app = express();

//Middleware para permitir JSON en el body de las request
app.use(express.json());

//CORS para permitir futuras llamadas desde el frontend
app.use(cors());

//Rutas de la API
//Todo queda colgado de /api y dentro se maneja el versionado
app.use('/api/v1', apiRoutes);

//Middleware para rutas inexistentes
//Va despues de declarar las rutas validas.
app.use(notfound);

//Middleware global de errores
// Va al final para capturar errores lanzados de controladores/services
app.use(errorHandler);

export default app;