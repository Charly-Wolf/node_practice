import express, { json } from 'express';
import { moviesRouter } from './routes/movies.js';
import { corsMiddleware } from './middelwares/cors.js';

const app = express();
app.use(json()); // Middleware
app.disable('x-powered-by');
app.use(corsMiddleware()); // Middleware

app.use('/movies', moviesRouter);

const PORT = process.env.PORT ?? 1234;

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
});
