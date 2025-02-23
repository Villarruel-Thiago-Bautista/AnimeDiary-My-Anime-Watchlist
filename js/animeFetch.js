export function fetchAnimeDetails(anime) {
    const infoContainer = document.getElementById("anime-info-container");
    if (infoContainer) {
        infoContainer.innerHTML = `
            <div class="loading-spinner"></div>
        `;
    }

    fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(anime)}&limit=1`)
        .then(response => response.json())
        .then(data => {
            if (!infoContainer) return;

            if (!data.data?.length) {
                infoContainer.innerHTML = `<p>No se encontró información para el anime "${anime}".</p>`;
                return;
            }

            const animeInfo = data.data[0];
            infoContainer.style.display = "block"; // Cambiamos a "block" para el nuevo diseño

            // Actualiza las metaetiquetas
            updateMetaTags(animeInfo);

            // Renderiza la información del anime en el nuevo diseño
            infoContainer.innerHTML = `
                <section id="anime-hero">
                    <img src="${animeInfo.images.jpg.large_image_url || 'path/to/placeholder-image.jpg'}" alt="${animeInfo.title}">
                    <div id="anime-title-div">
                        <h2>${animeInfo.title}</h2>
                    </div>
    
                </section>

                <section id="anime-details">
                    <div class="detail-card">
                        <h3>Información General</h3>
                        <p><strong>Tipo:</strong> ${animeInfo.type}</p>
                        <p><strong>Fecha de estreno:</strong> ${animeInfo.aired.string || "Desconocido"}</p>
                        <p><strong>Estudio:</strong> ${animeInfo.studios?.[0]?.name || "Desconocido"}</p>
                        <p><strong>Episodios:</strong> ${animeInfo.episodes || "Desconocido"}</p>
                        <p><strong>Estado:</strong> ${animeInfo.status === "Finished Airing" ? "Finalizado" : "En emisión"}</p>
                    </div>

                    <div class="detail-card">
                        <h3>Sinopsis</h3>
                        <p>${animeInfo.synopsis}</p>
                    </div>

                    ${animeInfo.trailer?.youtube_id ? `
                    <div class="detail-card">
                        <h3>Tráiler</h3>
                        <div class="trailer">
                            <iframe src="https://www.youtube.com/embed/${animeInfo.trailer.youtube_id}" frameborder="0" allowfullscreen></iframe>
                        </div>
                    </div>
                    ` : ""}
                </section>
            `;
        })
        .catch(error => {
            console.error("Error al obtener los detalles del anime:", error);
            if (infoContainer) {
                infoContainer.innerHTML = `<p>Hubo un error al cargar los detalles del anime. Por favor, intenta nuevamente más tarde.</p>`;
            }
        });
}

function updateMetaTags(animeInfo) {
    document.querySelector('meta[name="description"]').setAttribute("content", `Detalles sobre ${animeInfo.title}, incluyendo sinopsis, fecha de estreno, estudio y más.`);
    document.querySelector('meta[name="keywords"]').setAttribute("content", `anime, ${animeInfo.title}, detalles, sinopsis, estreno`);
    document.title = `${animeInfo.title} - Anime Diary`;
}