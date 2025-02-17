import { fetchAnimeData } from "./api.js";
import { watchedAnimes } from "./storage.js";
import { renderPagination } from "./pagination.js";

const ITEMS_PER_PAGE = 20;
let currentPage = 1;
let currentFilter = "tv"; // 'all', 'movie', 'tv'

document.addEventListener("DOMContentLoaded", () => {
    const filterDropdown = document.getElementById("filter-dropdown");
    filterDropdown.addEventListener("change", (event) => {
        currentFilter = event.target.value;
        closeAnimeInfo(); // Cierra la información al cambiar de filtro
        displayWatchedAnimes(1);
    });
});

export async function displayWatchedAnimes(page = 1) {
    const animeList = document.getElementById("anime-list");
    animeList.innerHTML = "<div class='loading'>Cargando animes...</div>";

    const filteredAnimes = await filterAnimesByType(watchedAnimes, currentFilter);
    
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const animesToDisplay = filteredAnimes.slice(start, end);

    const animeDataArray = await Promise.allSettled(animesToDisplay.map(anime => fetchAnimeData(anime)));

    animeList.innerHTML = "";

    animeDataArray
        .filter(result => result.status === "fulfilled" && result.value)
        .forEach(({ value: animeData }) => {
            const animeDiv = document.createElement("div");
            animeDiv.classList.add("anime-card");

            const img = document.createElement("img");
            img.src = animeData.images.jpg.image_url;
            img.alt = animeData.title;
            img.classList.add("anime-img");
            img.addEventListener("click", () => displayAnimeInfo(animeData));

            const title = document.createElement("p");
            title.textContent = animeData.title;
            title.classList.add("anime-title");

            animeDiv.appendChild(img);
            animeDiv.appendChild(title);
            animeList.appendChild(animeDiv);
        });

    renderPagination(filteredAnimes.length);
}

async function filterAnimesByType(animeList, filter) {
    if (filter === "all") return animeList;

    const animeDataArray = await Promise.allSettled(animeList.map(anime => fetchAnimeData(anime)));

    return animeDataArray
        .filter(result => result.status === "fulfilled" && result.value)
        .filter(({ value: animeData }) => animeData.type.toLowerCase() === filter)
        .map(({ value: animeData }) => animeData.title);
}

export function displayAnimeInfo(animeData) {
    const infoDiv = document.getElementById("info");

    infoDiv.innerHTML = `
        <img src="${animeData.images.jpg.image_url}" alt="${animeData.title}" class="info-img">
        <div class="info-text">
            <h2>${animeData.title}</h2>
            <p><strong>Tipo:</strong> ${animeData.type}</p>
            <p><strong>Sinopsis:</strong> ${animeData.synopsis || "No disponible."}</p>
            <p><strong>Géneros:</strong> ${animeData.genres.map(genre => genre.name).join(", ") || "Desconocido"}</p>
            <p><strong>Episodios:</strong> ${animeData.episodes || "Desconocido"}</p>
            <p><strong>Estado:</strong> ${animeData.status}</p>
            <p><strong>Estreno:</strong> ${animeData.aired?.string || "Fecha desconocida"}</p>
            <p><strong>Puntuación:</strong> ${animeData.score || "Desconocido"}</p>
        </div>
    `;

    infoDiv.classList.remove("hidden");
    infoDiv.style.display = "flex";
}

export function closeAnimeInfo() {
    const infoDiv = document.getElementById("info");
    infoDiv.style.display = "none";
    infoDiv.classList.add("hidden");
}
