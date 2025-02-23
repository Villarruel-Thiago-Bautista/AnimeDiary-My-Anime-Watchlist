import { animeList } from "./animeData.js";
import { renderPage, setupPagination } from "./pagination.js";
import { fetchAnimeDetails } from "./animeFetch.js";

document.addEventListener("DOMContentLoaded", () => {
    const animeName = new URLSearchParams(window.location.search).get("anime");

    if (animeName) {
        // Si hay un nombre de anime en la URL, carga los detalles del anime
        fetchAnimeDetails(animeName);
    } else {
        // Si no hay un nombre de anime, carga la lista de animes con paginación
        renderPage(1, animeList);
        setupPagination(animeList);
    }
});