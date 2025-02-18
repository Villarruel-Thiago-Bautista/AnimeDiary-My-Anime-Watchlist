import { fetchAnimeDetails } from "./animeFetch.js";

// 🔹 Constantes y variables globales
const itemsPerPage = 20; 
let currentPage = 1;
let currentFilter = "all"; 
let currentSearch = ""; 

// 🔹 Filtra la lista de animes según el filtro seleccionado y el cuadro de búsqueda
function filterAnimes(animeList) {
    return animeList.filter(anime => 
        (currentFilter === "all" || anime.type === currentFilter) &&
        anime.name.toLowerCase().includes(currentSearch.toLowerCase())
    );
}

// 🔹 Ordena la lista de animes alfabéticamente por nombre
function sortAnimes(animeList) {
    return animeList.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
}

// 🔹 Pagina la lista de animes
function paginateAnimes(animeList, page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return animeList.slice(start, end);
}

// 🔹 Renderiza la lista de animes en la página
function renderAnimeList(animeList) {
    const container = document.getElementById("anime-container");
    container.innerHTML = "";

    animeList.forEach(anime => {
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
}

// 🔹 Renderiza la paginación
function createPaginationButtons(totalPages, animeList) {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";

    const addButton = (page, isDisabled = false) => {
        const button = document.createElement("button");
        button.textContent = page;
        button.classList.add("pagination-btn");

        if (isDisabled) {
            button.disabled = true;
            button.classList.add("disabled");
        } else {
            if (page === currentPage) {
                button.classList.add("active");
            }
            button.addEventListener("click", () => {
                currentPage = page;
                renderPage(currentPage, animeList);
            });
        }

        paginationContainer.appendChild(button);
    };

    if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) {
            addButton(i);
        }
    } else {
        addButton(1);
        if (currentPage > 2) addButton("...", true);
        
        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);
        for (let i = startPage; i <= endPage; i++) {
            addButton(i);
        }

        if (currentPage < totalPages - 2) addButton("...", true);
        addButton(totalPages);
    }
}

// 🔹 Renderiza la página completa
export function renderPage(page, animeList) {
    const infoContainer = document.getElementById("info");
    infoContainer.style.display = "none";
    infoContainer.innerHTML = "";

    let filteredAnimes = filterAnimes(animeList);
    let sortedAnimes = sortAnimes(filteredAnimes);
    let paginatedAnimes = paginateAnimes(sortedAnimes, page);

    renderAnimeList(paginatedAnimes);
    createPaginationButtons(Math.ceil(filteredAnimes.length / itemsPerPage), animeList);
}

// 🔹 Configura eventos para paginación, filtros y búsqueda
export function setupPagination(animeList) {
    document.getElementById("filter").addEventListener("change", (event) => {
        currentFilter = event.target.value;
        currentPage = 1;
        renderPage(currentPage, animeList);
    });

    document.getElementById("search").addEventListener("input", (event) => {
        currentSearch = event.target.value;
        currentPage = 1;
        renderPage(currentPage, animeList);
    });
}
