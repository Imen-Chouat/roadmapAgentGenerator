import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appConfig = (app) => {
    app.use(express.json());
    app.use(cors());

    // Serve frontend static files
    app.use(express.static(path.join(__dirname, '../project')));

    // Global error handler
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({ error: 'Internal server error' });
    });
};

export default appConfig;
