let watchedAnimes = JSON.parse(localStorage.getItem("watchedAnimes")) || [];

// Eliminar duplicados y normalizar los nombres
watchedAnimes = [...new Set(watchedAnimes.map(anime => anime.toLowerCase()))];

const API_URL = "https://api.jikan.moe/v4/anime?q=";
const cachedAnimeData = JSON.parse(localStorage.getItem("cachedAnimeData")) || {};

async function fetchAnimeData(animeName) {
    if (cachedAnimeData[animeName]) {
        console.log(`✅ Usando caché para ${animeName}`);
        return cachedAnimeData[animeName];
    }

    for (let attempt = 0; attempt < 5; attempt++) {
        try {
            const res = await fetch(`${API_URL}${encodeURIComponent(animeName)}&limit=1`);
            
            if (res.status === 429) {
                console.warn("⚠️ Rate limit alcanzado, esperando...");
                await new Promise(res => setTimeout(res, 3000)); // Esperar antes de reintentar
                continue;
            }

            if (!res.ok) throw new Error(`❌ Error al obtener datos de ${animeName}`);

            const data = await res.json();
            if (data.data && data.data.length > 0) {
                cachedAnimeData[animeName] = data.data[0];
                localStorage.setItem("cachedAnimeData", JSON.stringify(cachedAnimeData));
                return data.data[0];
            } else {
                console.warn(`⚠️ No se encontró información para ${animeName}`);
                return null;
            }
        } catch (error) {
            console.error(`❌ Intento ${attempt + 1}: ${error.message}`);
            await new Promise(res => setTimeout(res, 2000)); // Esperar antes de reintentar
        }
    }
    return null;
}

async function displayWatchedAnimes() {
    const animeList = document.getElementById("anime-list");
    animeList.innerHTML = "";

    const animeDataArray = await Promise.all(watchedAnimes.map(anime => fetchAnimeData(anime)));

    animeDataArray
        .filter(Boolean) // Eliminar elementos nulos
        .forEach(animeData => {
            const animeDiv = document.createElement("div");
            const img = document.createElement("img");

            img.classList.add("anime-img");
            img.setAttribute("anime-name", animeData.title);
            img.setAttribute("alt", animeData.title);
            img.setAttribute("src", animeData.images.jpg.image_url);
            img.setAttribute("loading", "lazy"); // 🚀 Carga diferida

            img.addEventListener("click", () => showAnimeInfo(animeData));

            animeDiv.appendChild(img);
            animeList.appendChild(animeDiv);
        });
}

function showAnimeInfo(animeData) {
    const infoDiv = document.getElementById("info");

    infoDiv.innerHTML = `
        <img src="${animeData.images.jpg.image_url}" alt="${animeData.title}">
        <h2>${animeData.title}</h2>
        <p><strong>Género:</strong> ${animeData.genres.map(genre => genre.name).join(", ") || "Desconocido"}</p>
        <p><strong>Episodios:</strong> ${animeData.episodes || "Desconocido"}</p>
        <p><strong>Estado:</strong> ${animeData.status}</p>
        <p><strong>Estreno:</strong> ${animeData.aired.string || "Fecha desconocida"}</p>
        <p><strong>Sinopsis:</strong> ${animeData.synopsis || "Sin sinopsis disponible."}</p>
    `;

    infoDiv.classList.remove("hidden");
    infoDiv.style.display = "block";
}

function addAnimeIfNotExists(animeName) {
    const normalizedAnimeName = animeName.toLowerCase();
    if (!watchedAnimes.includes(normalizedAnimeName)) {
        watchedAnimes.push(normalizedAnimeName);
        localStorage.setItem("watchedAnimes", JSON.stringify(watchedAnimes));
    }
}

// 📌 **Lista de animes a buscar**
[
    "Your Name", "Attack on Titan", "Naruto", "Demon Slayer", 
    "Fullmetal Alchemist", "Naruto Shippuden", "Shigatsu wa Kimi no Uso", 
    "Oregairu", "Anohana", "Plastic Memories", "Dragon Ball", "Dragon Ball Z"
].forEach(addAnimeIfNotExists);

displayWatchedAnimes();
