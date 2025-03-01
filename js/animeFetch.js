export function fetchAnimeDetails(anime) {
  const infoContainer = document.getElementById("anime-info-container");
  if (infoContainer) {
      infoContainer.innerHTML = `<div class="loading-spinner"></div>`;
      infoContainer.style.display = "block";
  }

  fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(anime)}&limit=1`)
      .then((response) => response.json())
      .then(async (data) => {
          if (!infoContainer) return;

          if (!data.data?.length) {
              infoContainer.innerHTML = `<p class="no-results">No se encontró información para el anime "${anime}".</p>`;
              return;
          }

          const animeInfo = data.data[0];

          // Actualiza las metaetiquetas
          updateMetaTags(animeInfo);

          // Renderiza la información del anime con el nuevo diseño
          infoContainer.innerHTML = `
              <!-- Hero Section con backdrop -->
              <section id="anime-hero">
                  <div class="hero-backdrop" style="background-image: url('${animeInfo.images.jpg.large_image_url}')"></div>
                  <div class="hero-content">
                      <div class="anime-poster">
                          <img src="${animeInfo.images.jpg.large_image_url || "/img/placeholder.jpg"}" alt="${animeInfo.title}">
                      </div>
                      <div class="anime-info">
                          <h2 class="anime-title">${animeInfo.title}</h2>
                          <div class="anime-meta">
                              <span class="meta-item">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                      <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
                                      <polyline points="17 2 12 7 7 2"></polyline>
                                  </svg>
                                  ${animeInfo.type || "Desconocido"}
                              </span>
                              <span class="meta-item">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                      <circle cx="12" cy="12" r="10"></circle>
                                      <polyline points="12 6 12 12 16 14"></polyline>
                                  </svg>
                                  ${animeInfo.duration || "Desconocido"}
                              </span>
                              <span class="meta-item">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                      <line x1="16" y1="2" x2="16" y2="6"></line>
                                      <line x1="8" y1="2" x2="8" y2="6"></line>
                                      <line x1="3" y1="10" x2="21" y2="10"></line>
                                  </svg>
                                  ${animeInfo.aired.from ? new Date(animeInfo.aired.from).getFullYear() : "Desconocido"}
                              </span>
                              <span class="meta-item">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                                  </svg>
                                  ${animeInfo.status === "Finished Airing" ? "Finalizado" : "En emisión"}
                              </span>
                              ${animeInfo.episodes ? `
                              <span class="meta-item">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                      <polygon points="23 7 16 12 23 17 23 7"></polygon>
                                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                                  </svg>
                                  ${animeInfo.episodes} episodios
                              </span>` : ""}
                          </div>
                          <div class="anime-score">
                              <div class="score-value">${animeInfo.score || "?"}<span class="score-max">/10</span></div>
                              <div class="stars" style="--rating: ${(animeInfo.score || 0) / 2};" aria-label="Rating de ${animeInfo.score || 0}/10"></div>
                          </div>
                      </div>
                  </div>
              </section>

              <!-- Contenido detallado con tabs y sidebar -->
              <div class="details-section">
                  <!-- Tabs de contenido principal -->
                  <div class="tabs-container">
                      <div class="tabs-header">
                          <button class="tab-button active" data-tab="synopsis">Sinopsis</button>
                          <button class="tab-button" data-tab="info">Información</button>
                          ${animeInfo.trailer?.youtube_id ? `<button class="tab-button" data-tab="trailer">Tráiler</button>` : ''}
                      </div>
                      
                      <div class="tab-content">
                          <!-- Tab Sinopsis -->
                          <div class="tab-pane active" id="synopsis">
                              <p class="synopsis">${animeInfo.synopsis || "No hay sinopsis disponible para este anime."}</p>
                          </div>
                          
                          <!-- Tab Información -->
                          <div class="tab-pane" id="info">
                              <div class="info-grid">
                                  <div class="info-item">
                                      <div class="info-label">Tipo</div>
                                      <div class="info-value">${animeInfo.type || "Desconocido"}</div>
                                  </div>
                                  <div class="info-item">
                                      <div class="info-label">Episodios</div>
                                      <div class="info-value">${animeInfo.episodes || "Desconocido"}</div>
                                  </div>
                                  <div class="info-item">
                                      <div class="info-label">Estado</div>
                                      <div class="info-value">${animeInfo.status === "Finished Airing" ? "Finalizado" : "En emisión"}</div>
                                  </div>
                                  <div class="info-item">
                                      <div class="info-label">Fecha de estreno</div>
                                      <div class="info-value">${animeInfo.aired.string || "Desconocido"}</div>
                                  </div>
                                  <div class="info-item">
                                      <div class="info-label">Estudio</div>
                                      <div class="info-value">${animeInfo.studios?.[0]?.name || "Desconocido"}</div>
                                  </div>
                                  <div class="info-item">
                                      <div class="info-label">Fuente</div>
                                      <div class="info-value">${animeInfo.source || "Desconocido"}</div>
                                  </div>
                                  ${animeInfo.rating ? `
                                  <div class="info-item">
                                      <div class="info-label">Clasificación</div>
                                      <div class="info-value">${animeInfo.rating}</div>
                                  </div>` : ""}
                                  <div class="info-item">
                                      <div class="info-label">Duración</div>
                                      <div class="info-value">${animeInfo.duration || "Desconocido"}</div>
                                  </div>
                              </div>
                          </div>
                          
                          <!-- Tab Tráiler -->
                          ${animeInfo.trailer?.youtube_id ? `
                          <div class="tab-pane" id="trailer">
                              <div class="trailer-container">
                                  <iframe src="https://www.youtube.com/embed/${animeInfo.trailer.youtube_id}" frameborder="0" allowfullscreen></iframe>
                              </div>
                          </div>` : ''}
                      </div>
                  </div>
                  
                  <!-- Sidebar con información adicional -->
                  <div class="anime-sidebar">
                      <!-- Géneros -->
                      <div class="sidebar-card">
                          <div class="sidebar-card-header">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                              </svg>
                              <h3>Géneros</h3>
                          </div>
                          <div class="sidebar-card-body">
                              <div class="genres-list">
                                  ${animeInfo.genres?.map(g => `<span class="genre-tag">${g.name}</span>`).join('') || "Desconocido"}
                              </div>
                          </div>
                      </div>
                      
                      <!-- Estadísticas -->
                      <div class="sidebar-card">
                          <div class="sidebar-card-header">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                                  <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                              </svg>
                              <h3>Estadísticas</h3>
                          </div>
                          <div class="sidebar-card-body">
                              <div class="stats-list">
                                  <div class="stat-item">
                                      <div class="stat-value">${animeInfo.score || "?"}</div>
                                      <div class="stat-label">Puntuación</div>
                                  </div>
                                  <div class="stat-item">
                                      <div class="stat-value">${animeInfo.rank ? "#" + animeInfo.rank : "?"}</div>
                                      <div class="stat-label">Ranking</div>
                                  </div>
                                  <div class="stat-item">
                                      <div class="stat-value">${animeInfo.popularity ? "#" + animeInfo.popularity : "?"}</div>
                                      <div class="stat-label">Popularidad</div>
                                  </div>
                                  <div class="stat-item">
                                      <div class="stat-value">${animeInfo.members?.toLocaleString() || "?"}</div>
                                      <div class="stat-label">Miembros</div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          `;
          
          // Agregar funcionalidad de tabs
          const tabButtons = document.querySelectorAll('.tab-button');
          const tabPanes = document.querySelectorAll('.tab-pane');
          
          tabButtons.forEach(button => {
              button.addEventListener('click', () => {
                  // Desactivar todos los tabs
                  tabButtons.forEach(btn => btn.classList.remove('active'));
                  tabPanes.forEach(pane => pane.classList.remove('active'));
                  
                  // Activar el tab seleccionado
                  button.classList.add('active');
                  const tabId = button.getAttribute('data-tab');
                  document.getElementById(tabId).classList.add('active');
              });
          });
      })
      .catch((error) => {
          console.error("Error al obtener los detalles del anime:", error);
          if (infoContainer) {
              infoContainer.innerHTML = `<p class="no-results">Hubo un error al cargar los detalles del anime. Por favor, intenta nuevamente más tarde.</p>`;
          }
      });
}

function updateMetaTags(animeInfo) {
  // Actualizar título
  document.title = `${animeInfo.title} - Anime Diary`;

  // Actualizar meta descripción
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
      metaDescription.setAttribute(
          "content",
          `Detalles sobre ${animeInfo.title}, incluyendo sinopsis, fecha de estreno, estudio y más.`
      );
  }

  // Actualizar meta keywords
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaKeywords) {
      const keywords = `anime, ${animeInfo.title}, ${animeInfo.genres?.map((g) => g.name).join(", ") || ""}, detalles, sinopsis`;
      metaKeywords.setAttribute("content", keywords);
  }
}