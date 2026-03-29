import express from 'express';
import appConfig from './config/appConfig.js';
import roadmapRoute from './routes/roadmapRoute.js';
import userRoute from './routes/userRoute.js';
import statisticRouter from './routes/statisticRouter.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
appConfig(app);
app.use('/api/roadmap', roadmapRoute);
app.use('/api/user', userRoute);
app.use('/stats', statisticRouter);


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// AFTER all routes
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../Public/index.html'));
});

export default app;