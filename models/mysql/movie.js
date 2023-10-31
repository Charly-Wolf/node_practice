import mysql from 'mysql2/promise';

const config = {
  host: 'localhost',
  user: 'root',
  port: '3306',
  password: '',
  database: 'moviesdb',
};

const connection = await mysql.createConnection(config);

export class MovieModel {
  static async getAll({ genre }) {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase();

      // get genre ids from database table using genre names
      const [genres] = await connection.query(
        'SELECT id, name FROM genre WHERE LOWER(name) = ?;',
        [lowerCaseGenre]
      );

      // no genre found
      if (genres.length === 0) return [];

      // get id from the first genre result
      const [{ id }] = genres;

      // get all movies ids from database table
      const [moviesByGenre] = await connection.query(
        'SELECT BIN_TO_UUID(m.id) id, title, year, director, duration, poster, rate FROM movie m JOIN movie_genres mg ON m.id = mg.movie_id JOIN genre g ON mg.genre_id = g.id WHERE g.id = ?',
        [id]
      );

      return moviesByGenre;
    }

    const [movies] = await connection.query(
      'SELECT BIN_TO_UUID(id) id, title, year, director, duration, poster, rate FROM movie;'
    );

    return movies;
  }

  static async getById({ id }) {
    const [movies] = await connection.query(
      'SELECT BIN_TO_UUID(id) id, title, year, director, duration, poster, rate FROM movie WHERE id = UUID_TO_BIN(?);',
      [id]
    );

    if (movies.length === 0) return null;

    return movies[0];
  }

  static async create({ input }) {}

  static async delete({ id }) {}

  static async update({ id, input }) {}
}
