import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { BooksList } from "~/components/books-list";

export default component$(() => {
  return (
    <BooksList/>
  );
});

export const head: DocumentHead = {
  title: "App de Libros",
  meta: [
    {
      name: "description",
      content: "Gestión de Colección Privada de Libros",
    },
  ],
};
