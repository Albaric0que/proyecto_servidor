import { component$ } from '@builder.io/qwik';

export const Header = component$(() => {
    return (
        <header class="py-8 text-center">
        <h1 class="mb-4 text-4xl font-bold text-alanturing-800">
            MIS LIBROS
        <i class="fa-solid fa-book px-3"></i>
        </h1>
        <h2 class="text-3xl text-alanturing-400">
            Gestión de Colección Privada de Libros
        </h2>
        </header>
    )
});