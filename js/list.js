let watchedAnimes = JSON.parse(localStorage.getItem("watchedAnimes")) || [];
watchedAnimes = [...new Set(watchedAnimes.map(anime => anime.toLowerCase()))];

const API_URL = "https://api.jikan.moe/v4/anime?q=";
const cachedAnimeData = JSON.parse(localStorage.getItem("cachedAnimeData")) || {};
const ITEMS_PER_PAGE = 50;
let currentPage = 1;

async function fetchAnimeData(animeName) {
    if (cachedAnimeData[animeName]) {
        return cachedAnimeData[animeName];
    }

    for (let attempt = 0; attempt < 5; attempt++) {
        try {
            const res = await fetch(`${API_URL}${encodeURIComponent(animeName)}&limit=1`);

            if (res.status === 429) {
                await new Promise(res => setTimeout(res, 3000));
                continue;
            }

            if (!res.ok) throw new Error(`Error al obtener datos de ${animeName}`);

            const data = await res.json();
            if (data.data && data.data.length > 0) {
                cachedAnimeData[animeName] = data.data[0];
                localStorage.setItem("cachedAnimeData", JSON.stringify(cachedAnimeData));
                return data.data[0];
            }
        } catch (error) {
            await new Promise(res => setTimeout(res, 2000));
        }
    }
    return null;
}

async function displayWatchedAnimes(page = 1) {
    const animeList = document.getElementById("anime-list");
    animeList.innerHTML = "<div class='loading'>Cargando animes...</div>";

    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const animesToDisplay = watchedAnimes.slice(start, end);

    const animeDataArray = await Promise.all(animesToDisplay.map(anime => fetchAnimeData(anime)));

    animeList.innerHTML = "";

    animeDataArray.filter(Boolean).forEach(animeData => {
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

    renderPagination();
}

function displayAnimeInfo(animeData) {
    const infoDiv = document.getElementById("info");

    infoDiv.innerHTML = `
        <img src="${animeData.images.jpg.image_url}" alt="${animeData.title}" class="info-img">
        <div class="info-text">
            <h2>${animeData.title}</h2>
            <p><strong>Sinopsis:</strong> ${animeData.synopsis || "No disponible."}</p>
            <p><strong>Géneros:</strong> ${animeData.genres.map(genre => genre.name).join(", ") || "Desconocido"}</p>
            <p><strong>Episodios:</strong> ${animeData.episodes || "Desconocido"}</p>
            <p><strong>Estado:</strong> ${animeData.status}</p>
            <p><strong>Estreno:</strong> ${animeData.aired.string || "Fecha desconocida"}</p>
            <p><strong>Puntuación:</strong> ${animeData.score || "Desconocido"}</p>
        </div>
    `;

    infoDiv.classList.remove("hidden");
    infoDiv.style.display = "flex";
}

displayWatchedAnimes(currentPage);


function renderPagination() {
    const totalPages = Math.ceil(watchedAnimes.length / ITEMS_PER_PAGE);
    const paginationContainer = document.getElementById("pagination-container");
    
    if (!paginationContainer) return; // Si no existe el contenedor, salir

    const paginationDiv = document.createElement("div");
    paginationDiv.classList.add("pagination");

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;
        pageButton.addEventListener("click", () => {
            currentPage = i;
            displayWatchedAnimes(currentPage);
            closeAnimeInfo(); // Cerrar la información al cambiar de página
        });
        if (i === currentPage) {
            pageButton.classList.add("active");
        }
        paginationDiv.appendChild(pageButton);
    }

    paginationContainer.innerHTML = ""; // Limpiar el contenedor antes de añadir los botones
    paginationContainer.appendChild(paginationDiv);
}

function closeAnimeInfo() {
    const infoDiv = document.getElementById("info");
    infoDiv.style.display = "none"; // Ocultar el contenedor de información
    infoDiv.classList.add("hidden");
}

function addAnimeIfNotExists(animeName) {
    const normalizedAnimeName = animeName.toLowerCase();
    if (!watchedAnimes.includes(normalizedAnimeName)) {
        watchedAnimes.push(normalizedAnimeName);
        localStorage.setItem("watchedAnimes", JSON.stringify(watchedAnimes));
    }
}

// LISTA DE ANIMES, ACA AGREGAR
[
    "Your Name", 
    "Attack on Titan", 
    "Naruto", 
    "Demon Slayer", 
    "Fullmetal Alchemist", 
    "Naruto Shippuden", 
    "Shigatsu wa Kimi no Uso", 
    "Oregairu", 
    "Anohana", 
    "Plastic Memories", 
    "Dragon Ball", 
    "Dragon Ball Z",
    "Dragon Ball Super", 
    "Boruto", 
    "Tokyo Ghoul", 
    "Nanatsu no Taizai", 
    "Fairy Tail", 
    "Sukitte Ii na yo", 
    "SAO", 
    "Sword Art Online II", 
    "No Game No Life", 
    "Dragon Ball GT",
    "Cyberpunk: Edgerunners", 
    "Koe no Katachi", 
    "Attack on Titan: The Final Season", 
    "Kimetsu no Yaiba: Yuukaku-hen", 
    "Death Note", 
    "Oshi no Ko", 
    "Yamada-kun to 7-nin no Majo", 
    "Yamada-kun to Lv999 no Koi wo Suru", 
    "Ookami Kodomo no Ame to Yuki", 
    "Kimi no Suizou wo Tabetai", 
    "Dr. Stone"
].forEach(addAnimeIfNotExists);
displayWatchedAnimes(currentPage);
