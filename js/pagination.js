import { fetchAnimeDetails } from "./animeFetch.js";

const itemsPerPage = 30;
let currentPage = 1;
let currentFilter = "all";

export function renderPage(page, animeList) {
    const container = document.getElementById("anime-container");
    const pageIndicator = document.getElementById("pageIndicator");

    container.innerHTML = "";

    // 🔍 Filtrar animes según el tipo seleccionado
    const filteredAnimes = animeList.filter(anime => 
        currentFilter === "all" || anime.type === currentFilter
    );

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedAnimes = filteredAnimes.slice(start, end);

    paginatedAnimes.forEach(anime => {
        const animeCard = document.createElement("div");
        animeCard.classList.add("anime-card");

        const img = document.createElement("img");
        img.src = `/img/${anime.name}.jpg`;
        img.alt = anime.name;
        img.dataset.anime = anime.name;
        img.addEventListener("click", () => fetchAnimeDetails(anime.name));

        const title = document.createElement("p");
        title.classList.add("anime-title");
        title.textContent = anime.name;

        animeCard.appendChild(img);
        animeCard.appendChild(title);
        container.appendChild(animeCard);
    });

    pageIndicator.textContent = page;
    document.getElementById("prevPage").disabled = page === 1;
    document.getElementById("nextPage").disabled = end >= filteredAnimes.length;
}

export function setupPagination(animeList) {
    document.getElementById("prevPage").addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage(currentPage, animeList);
        }
    });

    document.getElementById("nextPage").addEventListener("click", () => {
        if ((currentPage * itemsPerPage) < animeList.length) {
            currentPage++;
            renderPage(currentPage, animeList);
        }
    });

    document.getElementById("filter").addEventListener("change", (event) => {
        currentFilter = event.target.value;
        currentPage = 1; // Resetear a la primera página tras filtrar
        renderPage(currentPage, animeList);
    });
}