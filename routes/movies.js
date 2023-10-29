import { Router } from 'express';

import { randomUUID } from 'node:crypto';
import { validateMovie, validatePartialMovie } from '../schemas/movies.js';

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
export const readJSON = (path) => require(path);
const movies = readJSON('../movies.json');

export const moviesRouter = Router();

moviesRouter.get('/', (req, res) => {
  const { genre } = req.query;
  if (genre) {
    const filteredMovies = movies.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    );
    return res.json(filteredMovies);
  }
  res.json(movies);
});

moviesRouter.get('/:id', (req, res) => {
  const { id } = req.params;
  const movie = movies.find((movie) => movie.id === id);
  if (movie) res.json(movie);

  res.status(404).json({ message: 'Movie not found' });
});

moviesRouter.post('/', (req, res) => {
  const result = validateMovie(req.body);

  if (result.error) {
    // or 422 unprocessable entity
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const newMovie = {
    id: randomUUID(), // uuid v4
    ...result.data,
  };

  movies.push(newMovie);

  res.status(201).json(newMovie);
});

moviesRouter.delete('/:id', (req, res) => {
  // res.header('Access-Control-Allow_Origin', '*'); // Allow Cors
  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' });
  }

  movies.splice(movieIndex, 1);

  return res.json({ message: 'Movie deleted' });
});

moviesRouter.patch('/:id', (req, res) => {
  const result = validatePartialMovie(req.body);

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id === id);

  if (movieIndex < 0)
    return res.status(404).json({ message: 'Movie not found' });

  const updatedMovie = {
    ...movies[movieIndex],
    ...result.data,
  };

  movies[movieIndex] = updatedMovie;

  return res.json(updatedMovie);
});
