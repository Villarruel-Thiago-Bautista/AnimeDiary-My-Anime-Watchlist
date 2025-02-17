import { animeList } from "./animeData.js";
import { renderPage, setupPagination } from "./pagination.js";

document.addEventListener("DOMContentLoaded", () => {
    renderPage(1, animeList);
    setupPagination(animeList);
});
