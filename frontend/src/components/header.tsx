import { component$ } from "@builder.io/qwik";

export const Header = component$(() => {
  return (
    <header class="body py-8 text-center">
      <h1 class="mb-4 text-4xl font-bold">
        MIS LIBROS
        <i class="fa-solid fa-book px-3"></i>
      </h1>
      <h2 class="text-3xl">Gestión de Colección Privada de Libros</h2>
    </header>
  );
});
