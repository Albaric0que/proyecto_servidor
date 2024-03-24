// Funciones de acceso a la API de usuarios.

import { Book } from "~/models/book";

// Obtiene libro por IBSN
export const getBookByIbsn = async (ibsn: string, book: Book) => {
  try {
    const response = await fetch(`http://localhost:8000/books/${ibsn}`);
    const book = response.json();
    return book;
  } catch (error) {
    console.error(error);
  }

  return book;
};

// Obtiene todos los libros
export const getBooks = async (): Promise<Book[]> => {
  try {
    const response = await fetch("http://localhost:8000/books/");
    const books = response.json();
    return books;
  } catch (error) {
    console.error(error);
  }

  return <Book[]>(<unknown>null);
};

// Obtiene todos los libros por Editorial  MÉTODO A MODIFICAR !!!!
export const getBooksByEditorial = async (editorial: string, book: Book) => {
  try {
    const response = await fetch(
      `http://localhost:8000/books/editorial/${editorial}`,
    );
    const editorialBooks = response.json();
    return editorialBooks;
  } catch (error) {
    console.error(error);
  }

  return <Book[]>(<unknown>null);
};

// Obtiene todos los libros por Género   método a modificar !!!!
export const getBooksByGenre = async (genre: string, book: Book) => {
  try {
    const response = await fetch(`http://localhost:8000/books/genre/${genre}`);
    const genreBooks = response.json();
    return genreBooks;
  } catch (error) {
    console.error(error);
  }

  return <Book[]>(<unknown>null);
};

// Obtiene todos los libros por Autor   método a modificar !!!!
export const getBooksByAuthor = async (author_name: string, book: Book) => {
  try {
    const response = await fetch(
      `http://localhost:8000/books/author/${author_name}`,
    );
    const authorBooks = response.json();
    return authorBooks;
  } catch (error) {
    console.error(error);
  }

  return <Book[]>(<unknown>null);
};

// Añade un libro.
export const addBook = async (book: Book) => {
  try {
    await fetch("http://localhost:8000/books/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(book),
    });
  } catch (error) {
    console.error(error);
  }
};

// Modifica un libro.
export const updateBook = async (ibsn: string, book: Book) => {
  try {
    await fetch(`http://localhost:8000/books/${ibsn}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(book),
    });
  } catch (error) {
    console.error(error);
  }
};

// Elimina un libro.
export const deleteBookByIbsn = async (ibsn: string) => {
  try {
    await fetch(`http://localhost:8000/books/${ibsn}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error(error);
  }
};
