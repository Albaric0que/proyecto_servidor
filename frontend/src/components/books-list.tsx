import {
  component$,
  useStore,
  useTask$,
  useVisibleTask$,
  $,
  useSignal,
} from "@builder.io/qwik";

import { Book } from "~/models/Book";
import { Subservice_book } from "~/models/Subservice_book";
import {
  addBook,
  deleteBookByIbsn,
  getBookByIbsn,
  getBooksByGenre,
  getBooksByAuthor,
  getBooksByEditorial,
  getBooks,
  updateBook,
} from "~/utils/books-provider";

export const BooksList = component$(() => {
  const store = useStore<{ books: Book[] }>({
    books: [],
  });

  const form = useStore<Book>({
    ibsn: "",
    title: "",
    published: 0,
    genre: "",
    editorial: "",
    author_name: "",
  });

  const bookParam = useStore<Subservice_book>({
    sub_ibsn: "",
    sub_title: "",
    sub_published: 0,
    sub_genre: "",
    sub_editorial: "",
    sub_author_name: "",
  });

  const addOrModify = useSignal("Añadir");

  const oldIbsn = useSignal("");

  const showEditorialForm = useSignal(false);
  const showGenreForm = useSignal(false);
  const showAuthorForm = useSignal(false);

  const activeForm = useSignal("");

  useVisibleTask$(async () => {
    console.log("Desde useVisibleTask");

    store.books = await getBooks();
  });

  const handleSubmit = $(async (event: any) => {
    event.preventDefault(); // evita el comportamiento por defecto
    if (addOrModify.value === "Añadir") {
      await addBook(form);
    } else {
      await updateBook(oldIbsn.value, form);
      addOrModify.value = "Añadir";
    }
  });

  const handleFormSubmit = $(async (event: any) => {
    event.preventDefault(); // evita el comportamiento por defecto
    const { sub_editorial, sub_genre, sub_author_name } = bookParam;

    let newBooks = [];

    if (activeForm.value === "editorial") {
      newBooks = await getBooksByEditorial(sub_editorial, bookParam);
    } else if (activeForm.value === "genre") {
      newBooks = await getBooksByGenre(sub_genre, bookParam);
    } else if (activeForm.value === "author_name") {
      newBooks = await getBooksByAuthor(sub_author_name, bookParam);
    }

    // Actualiza el estado con los nuevos libros
    store.books = newBooks;
  });

  const handleInputChange = $((event: any) => {
    const target = event.target as HTMLInputElement;
    form[target.name] = target.value;
  });

  const copyForm = $((book: Book) => {
    form.ibsn = book.ibsn;
    form.title = book.title;
    form.published = book.published;
    form.genre = book.genre;
    form.editorial = book.editorial;
    form.author_name = book.author_name;
  });

  const cleanForm = $(() => {
    form.ibsn = "";
    form.title = "";
    form.published = 0;
    form.genre = "";
    form.editorial = "";
    form.author_name = "";
  });

  const deletebook = $(async (ibsn: string) => {
    await deleteBookByIbsn(ibsn);
    store.books = await getBooks();
  });

  return (
    <div class="body flex w-full justify-center">
      <div>
        <div>
          <table class="table-scroll">
            <thead>
              <tr>
                <th class="title">IBSN</th>
                <th class="title">Título</th>
                <th class="title">Año de Publicación</th>
                <th class="title">Género</th>
                <th class="title">Editorial</th>
                <th class="title">Nombre del Autor</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {store.books.map((book) => (
                <tr key={book.ibsn}>
                  <td>{book.ibsn}</td>
                  <td>{book.title}</td>
                  <td>{book.published}</td>
                  <td>{book.genre}</td>
                  <td>{book.editorial}</td>
                  <td>{book.author_name}</td>
                  <td>
                    <button
                      class="bg-buttons-delete"
                      onClick$={() => deletebook(book.ibsn)}
                    >
                      <i class="fa-solid fa-trash"></i>
                      Borrar
                    </button>
                  </td>
                  <td>
                    <button
                      class="bg-buttons-update"
                      onClick$={() => {
                        addOrModify.value = "Modificar";
                        oldIbsn.value = book.ibsn;
                        copyForm(book);
                      }}
                    >
                      <i class="fa-solid fa-pencil"></i>
                      Modificar
                    </button>
                  </td>
                </tr>
              ))}
              <tr></tr>
              <tr>
                <form onSubmit$={handleSubmit}>
                  <td>
                    <input
                      name="ibsn"
                      type="text"
                      value={form.ibsn}
                      onInput$={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      name="title"
                      type="text"
                      value={form.title}
                      onInput$={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      name="published"
                      type="number"
                      value={form.published}
                      onInput$={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      name="genre"
                      type="text"
                      value={form.genre}
                      onInput$={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      name="editorial"
                      type="text"
                      value={form.editorial}
                      onInput$={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      name="author_name"
                      type="text"
                      value={form.author_name}
                      onInput$={handleInputChange}
                    />
                  </td>
                  <td>
                    <button class="bg-buttons-create" type="submit">
                      <i class="fa-solid fa-check"></i>
                      Aceptar
                    </button>
                  </td>
                  <td>
                    <span
                      class="button bg-buttons-delete text-black"
                      style={`visibility: ${addOrModify.value === "Añadir" ? "hidden" : "visible"}`}
                      onClick$={() => {
                        addOrModify.value = "Añadir";
                        cleanForm();
                      }}
                    >
                      <i class="fa-solid fa-x"></i>
                      Cancelar
                    </span>
                  </td>
                </form>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="sub-forms">
          <div class="sub-form">
            {/* Botón para mostrar/ocultar el formulario editorial */}
            <button
              class={
                showEditorialForm.value === false
                  ? "button-book-highlighted"
                  : "button-book"
              }
              onClick$={() => {
                activeForm.value = "editorial";
                showEditorialForm.value = !showEditorialForm.value;
              }}
            >
              <i class="fa-solid fa-truck-fast pr-2"></i>
              Por Editorial
            </button>
            {/* Formulario obtener libros por editorial */}
            <div
              style={`visibility: ${showEditorialForm.value === false ? "hidden" : "visible"}`}
            >
              <input
                type="text"
                placeholder="Nombre de la Editorial"
                name="editorial"
                value={bookParam.sub_editorial}
                onInput$={handleInputChange}
              />
              <button class="bg-buttons-create" onClick$={handleFormSubmit}>
                <i class="fa-solid fa-check"></i>
                Aceptar
              </button>
            </div>
            {bookParam.sub_editorial}
          </div>
          {/* Botón mostrar/ocultar formulario género */}
          <div class="sub-form">
            <button
              class={
                showGenreForm.value === false
                  ? "button-book-highlighted"
                  : "button-book"
              }
              onClick$={() => {
                activeForm.value = "genre";
                showGenreForm.value = !showGenreForm.value;
              }}
            >
              <i class="fa-solid fa-masks-theater pr-2"></i>
              Por Género
            </button>
            {/* Formulario obtener libros por género */}
            <div
              style={`visibility: ${showGenreForm.value === false ? "hidden" : "visible"}`}
            >
              <input
                type="text"
                placeholder="Nombre del Género"
                name="genre"
                value={bookParam.sub_genre}
                onInput$={handleInputChange}
              />
              <button class="bg-buttons-create" onClick$={handleFormSubmit}>
                <i class="fa-solid fa-check"></i>
                Aceptar
              </button>
            </div>
            {bookParam.sub_genre}
          </div>
          <div class="sub-form">
            <button
              class={
                showAuthorForm.value === false
                  ? "button-book-highlighted"
                  : "button-book"
              }
              onClick$={() => {
                activeForm.value = "author_name";
                showAuthorForm.value = !showAuthorForm.value;
              }}
            >
              <i class="fa-regular fa-user pr-2"></i>
              Por Autor
            </button>

            {/* Formulario obtener libros por autor */}
            <div
              style={`visibility: ${showAuthorForm.value === false ? "hidden" : "visible"}`}
            >
              <input
                type="text"
                placeholder="Nombre del Autor"
                name="author_name"
                value={bookParam.sub_author_name}
                onInput$={handleInputChange}
              />
              <button class="bg-buttons-create" onClick$={handleFormSubmit}>
                <i class="fa-solid fa-check"></i>
                Aceptar
              </button>
            </div>
            {bookParam.sub_author_name}
          </div>
        </div>
      </div>
    </div>
  );
});
