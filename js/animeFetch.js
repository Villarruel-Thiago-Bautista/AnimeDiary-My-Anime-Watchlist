export function fetchAnimeDetails(anime) {
    fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(anime)}&limit=1`)
        .then(response => response.json())
        .then(data => {
            const infoContainer = document.getElementById("info");

            if (data.data && data.data.length > 0) {
                const animeInfo = data.data[0];

                const genres = animeInfo.genres.map(g => g.name).join(", ");
                const episodes = animeInfo.episodes || "Desconocido";
                const status = animeInfo.status === "Finished Airing" ? "Finalizado" : "En emisión";

                infoContainer.innerHTML = `
                    <img src="${animeInfo.images.jpg.image_url}" alt="${animeInfo.title}">
                    <div>
                        <h2>${animeInfo.title}</h2>
                        <p><strong>Géneros:</strong> ${genres}</p>
                        <p><strong>Episodios:</strong> ${episodes}</p>
                        <p><strong>Estado:</strong> ${status}</p>
                        <p>${animeInfo.synopsis}</p>
                    </div>
                `;
            } else {
                infoContainer.innerHTML = "<p>No se encontraron detalles para este anime.</p>";
            }
        })
        .catch(error => {
            console.error("Error al obtener los detalles del anime:", error);
        });
}