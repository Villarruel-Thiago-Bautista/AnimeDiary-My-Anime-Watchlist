export function fetchAnimeDetails(anime) {
    const infoContainer = document.getElementById("anime-info-container")
    if (infoContainer) {
      infoContainer.innerHTML = `<div class="loading-spinner"></div>`
      infoContainer.style.display = "block"
    }
  
    fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(anime)}&limit=1`)
      .then((response) => response.json())
      .then(async (data) => {
        if (!infoContainer) return
  
        if (!data.data?.length) {
          infoContainer.innerHTML = `<p class="no-results">No se encontró información para el anime "${anime}".</p>`
          return
        }
  
        const animeInfo = data.data[0]
  
        // Actualiza las metaetiquetas
        updateMetaTags(animeInfo)
  
        // Renderiza la información del anime
        infoContainer.innerHTML = `
                  <section id="anime-hero">
                      <img src="${animeInfo.images.jpg.large_image_url || "/img/placeholder.jpg"}" alt="${animeInfo.title}">
                      <div id="anime-title-div">
                          <h2>${animeInfo.title}</h2>
                          <div class="anime-meta">
                              <span class="anime-type">${animeInfo.type || "Desconocido"}</span>
                              <span class="anime-year">${animeInfo.aired.from ? new Date(animeInfo.aired.from).getFullYear() : "Desconocido"}</span>
                              <span class="anime-status">${animeInfo.status === "Finished Airing" ? "Finalizado" : "En emisión"}</span>
                              ${animeInfo.episodes ? `<span class="anime-episodes">${animeInfo.episodes} episodios</span>` : ""}
                          </div>
                          <div class="anime-score">
                              <div class="stars" style="--rating: ${(animeInfo.score || 0) / 2};" aria-label="Rating de ${animeInfo.score || 0}/10"></div>
                              <span>${animeInfo.score || "N/A"}</span>
                          </div>
                      </div>
                  </section>
  
                  <section id="anime-details">
                      <div class="detail-card">
                          <h3>Información General</h3>
                          <p><strong>Tipo:</strong> ${animeInfo.type || "Desconocido"}</p>
                          <p><strong>Fecha de estreno:</strong> ${animeInfo.aired.string || "Desconocido"}</p>
                          <p><strong>Estudio:</strong> ${animeInfo.studios?.[0]?.name || "Desconocido"}</p>
                          <p><strong>Episodios:</strong> ${animeInfo.episodes || "Desconocido"}</p>
                          <p><strong>Estado:</strong> ${animeInfo.status === "Finished Airing" ? "Finalizado" : "En emisión"}</p>
                          <p><strong>Géneros:</strong> ${animeInfo.genres?.map((g) => g.name).join(", ") || "Desconocido"}</p>
                          ${animeInfo.rating ? `<p><strong>Clasificación:</strong> ${animeInfo.rating}</p>` : ""}
                          ${animeInfo.duration ? `<p><strong>Duración:</strong> ${animeInfo.duration}</p>` : ""}
                      </div>
  
                      <div class="detail-card">
                          <h3>Sinopsis</h3>
                          <p>${animeInfo.synopsis || "No hay sinopsis disponible."}</p>
                      </div>
  
                      ${
                        animeInfo.trailer?.youtube_id
                          ? `
                      <div class="detail-card">
                          <h3>Tráiler</h3>
                          <div class="trailer">
                              <iframe src="https://www.youtube.com/embed/${animeInfo.trailer.youtube_id}" frameborder="0" allowfullscreen></iframe>
                          </div>
                      </div>
                      `
                          : ""
                      }
                  </section>
              `
      })
      .catch((error) => {
        console.error("Error al obtener los detalles del anime:", error)
        if (infoContainer) {
          infoContainer.innerHTML = `<p class="no-results">Hubo un error al cargar los detalles del anime. Por favor, intenta nuevamente más tarde.</p>`
        }
      })
  }
  
  function updateMetaTags(animeInfo) {
    // Actualizar título
    document.title = `${animeInfo.title} - Anime Diary`
  
    // Actualizar meta descripción
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        `Detalles sobre ${animeInfo.title}, incluyendo sinopsis, fecha de estreno, estudio y más.`,
      )
    }
  
    // Actualizar meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]')
    if (metaKeywords) {
      const keywords = `anime, ${animeInfo.title}, ${animeInfo.genres?.map((g) => g.name).join(", ") || ""}, detalles, sinopsis`
      metaKeywords.setAttribute("content", keywords)
    }
  }
  
  