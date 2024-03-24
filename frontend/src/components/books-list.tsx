import {
  component$,
  useStore,
  useTask$,
  useVisibleTask$,
  $,
  useSignal,
} from "@builder.io/qwik";
import { Book } from "~/models/book";
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

  const form = useStore({
    ibsn: "",
    title: "",
    published: 0,
    genre: "",
    editorial: "",
    author_name: "",
  });

  const addOrModify = useSignal("Añadir");

  const oldIbsn = useSignal("");

  const usersByAge = useSignal("Todos");

  useTask$(async () => {
    console.log("Desde useTask");
  });

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
    <div class="flex w-full justify-center">
      <div>
        <div class="rounded-xl bg-alanturing-100 px-6 py-4">
          <table class="border-separate border-spacing-2">
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
                      class="bg-red-600"
                      onClick$={() => deletebook(book.ibsn)}
                    >
                      <i class="fa-solid fa-trash"></i>
                      Borrar
                    </button>
                  </td>
                  <td>
                    <button
                      class="bg-orange-600"
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
                    <button class="bg-green-600" type="submit">
                      <i class="fa-solid fa-check"></i>
                      Aceptar
                    </button>
                  </td>
                  <td>
                    <span
                      class="button bg-red-600"
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
      </div>
    </div>
  );
});
