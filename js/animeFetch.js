export function fetchAnimeDetails(anime) {
    fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(anime)}&limit=1`)
        .then(response => response.json())
        .then(data => {
            const infoContainer = document.getElementById("info");

            if (!anime) {
                infoContainer.style.display = "none"
            }

            infoContainer.style.display = "flex"
            if (data.data && data.data.length > 0) {
                const animeInfo = data.data[0];

                const genres = animeInfo.genres.map(g => g.name).join(", ");
                const episodes = animeInfo.episodes || "Desconocido";
                const status = animeInfo.status === "Finished Airing" ? "Finalizado" : "En emisión";

                let trailerContent = ""; // Variable para el trailer

                // Si existe un trailer de YouTube, agregar el iframe
                if (animeInfo.trailer && animeInfo.trailer.youtube_id) {
                    trailerContent = `
                        <div class="trailer">
                            <iframe width="560" height="315" 
                                src="https://www.youtube.com/embed/${animeInfo.trailer.youtube_id}" 
                                frameborder="0" allowfullscreen></iframe>
                        </div>
                    `;
                }

                infoContainer.innerHTML = `
                    <div class="parent">
                        <div class="div1">
                            <img src="${animeInfo.images.jpg.image_url}" alt="${animeInfo.title}">
                        </div>
                        <div class="div2">
                            <h2>${animeInfo.title}</h2>
                            <p><strong>Géneros:</strong> ${genres}</p>
                            <p><strong>Episodios:</strong> ${episodes}</p>
                            <p><strong>Estado:</strong> ${status}</p>
                            <p>${animeInfo.synopsis}</p>
                        </div>
                    </div>
                    ${trailerContent}  <!-- Aquí se agrega el trailer si existe -->
                `;
            } else {
                infoContainer.innerHTML = "<p>No se encontraron detalles para este anime.</p>";
            }
        })
        .catch(error => {
            console.error("Error al obtener los detalles del anime:", error);
        });
}