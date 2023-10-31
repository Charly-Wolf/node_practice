import express, { json } from 'express';
import { createMovieRouter } from './routes/movies.js';
import { corsMiddleware } from './middelwares/cors.js';
import 'dotenv/config.js';

export const createApp = ({ movieModel }) => {
  const app = express();
  app.use(json()); // Middleware
  app.disable('x-powered-by');
  app.use(corsMiddleware()); // Middleware

  app.use('/movies', createMovieRouter({ movieModel }));

  const PORT = process.env.PORT ?? 1234;

  app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`);
  });
};
