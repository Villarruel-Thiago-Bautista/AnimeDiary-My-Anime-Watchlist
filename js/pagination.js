// 🔹 Variables globales
let itemsPerPage = 18 // Número dinámico de elementos por página
let currentPage = 1
let currentFilter = "all"
let currentSearch = ""

// 🔹 Filtra la lista de animes según el filtro seleccionado y el cuadro de búsqueda
function filterAnimes(animeList) {
  return animeList.filter(
    (anime) =>
      (currentFilter === "all" || anime.type === currentFilter) &&
      anime.name.toLowerCase().includes(currentSearch.toLowerCase()),
  )
}

// 🔹 Ordena la lista de animes alfabéticamente por nombre
function sortAnimes(animeList) {
  return animeList.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
}

// 🔹 Pagina la lista de animes
function paginateAnimes(animeList, page) {
  const start = (page - 1) * itemsPerPage
  const end = start + itemsPerPage
  return animeList.slice(start, end)
}

// 🔹 Renderiza la lista de animes en la página
function renderAnimeList(animeList) {
  const container = document.getElementById("anime-container")
  container.innerHTML = ""

  if (animeList.length === 0) {
    container.innerHTML = `<p class="no-results">No se encontraron resultados.</p>`
    return
  }

  animeList.forEach((anime) => {
    const animeCard = document.createElement("div")
    animeCard.classList.add("anime-card")

    const img = document.createElement("img")
    img.src = `/img/${anime.name}.jpg`
    img.alt = anime.name
    img.loading = "lazy" // Carga diferida de imágenes
    img.dataset.anime = anime.name

    // Cambiar para redirigir a anime-detail.html en lugar de anime-detail.html
    img.addEventListener("click", () => {
      window.location.href = `/html/anime-detail.html?anime=${encodeURIComponent(anime.name)}`
    })

    const playIcon = document.createElement("div")
    playIcon.classList.add("play-icon")

    const title = document.createElement("p")
    title.classList.add("anime-title")
    title.textContent = anime.name

    animeCard.appendChild(img)
    animeCard.appendChild(playIcon)
    animeCard.appendChild(title)
    container.appendChild(animeCard)
  })
}

// 🔹 Renderiza la paginación con botones de navegación
function createPaginationButtons(totalPages, animeList) {
  const paginationContainer = document.getElementById("pagination")
  paginationContainer.innerHTML = ""

  // Botones de páginas
  const addButton = (page, isDisabled = false) => {
    const button = document.createElement("button")
    button.textContent = page
    button.classList.add("pagination-btn")

    if (isDisabled) {
      button.disabled = true
      button.classList.add("disabled")
    } else {
      if (page === currentPage) {
        button.classList.add("active")
      }
      button.addEventListener("click", () => {
        currentPage = page
        renderPage(currentPage, animeList)
        // Scroll suave hacia arriba
        window.scrollTo({
          top: document.getElementById("filters").offsetTop - 100,
          behavior: "smooth",
        })
      })
    }

    paginationContainer.appendChild(button)
  }

  // Botón anterior
  if (totalPages > 1) {
    const prevButton = document.createElement("button")
    prevButton.innerHTML = "&laquo;"
    prevButton.classList.add("pagination-btn")
    prevButton.disabled = currentPage === 1
    prevButton.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--
        renderPage(currentPage, animeList)
        window.scrollTo({
          top: document.getElementById("filters").offsetTop - 100,
          behavior: "smooth",
        })
      }
    })
    paginationContainer.appendChild(prevButton)
  }

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      addButton(i)
    }
  } else {
    addButton(1)
    if (currentPage > 2) addButton("...", true)

    const startPage = Math.max(2, currentPage - 1)
    const endPage = Math.min(totalPages - 1, currentPage + 1)
    for (let i = startPage; i <= endPage; i++) {
      addButton(i)
    }

    if (currentPage < totalPages - 2) addButton("...", true)
    addButton(totalPages)
  }

  // Botón siguiente
  if (totalPages > 1) {
    const nextButton = document.createElement("button")
    nextButton.innerHTML = "&raquo;"
    nextButton.classList.add("pagination-btn")
    nextButton.disabled = currentPage === totalPages
    nextButton.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++
        renderPage(currentPage, animeList)
        window.scrollTo({
          top: document.getElementById("filters").offsetTop - 100,
          behavior: "smooth",
        })
      }
    })
    paginationContainer.appendChild(nextButton)
  }
}

// 🔹 Renderiza la página completa
export function renderPage(page, animeList) {
  const infoContainer = document.getElementById("info")
  if (infoContainer) {
    infoContainer.style.display = "none"
    infoContainer.innerHTML = ""
  }

  const filteredAnimes = filterAnimes(animeList)
  const sortedAnimes = sortAnimes(filteredAnimes)
  const paginatedAnimes = paginateAnimes(sortedAnimes, page)

  renderAnimeList(paginatedAnimes)
  createPaginationButtons(Math.ceil(filteredAnimes.length / itemsPerPage), animeList)

  // Actualizar contador de resultados
  const resultsCountElement = document.querySelector(".results-count")
  if (resultsCountElement) {
    resultsCountElement.remove()
  }

  const resultsCount = document.createElement("div")
  resultsCount.classList.add("results-count")
  resultsCount.textContent = `Mostrando ${paginatedAnimes.length} de ${filteredAnimes.length} resultados`

  const filtersElement = document.getElementById("filters")
  if (filtersElement) {
    filtersElement.appendChild(resultsCount)
  }
}

// 🔹 Configura eventos para paginación, filtros y búsqueda
export function setupPagination(animeList) {
  const filterElement = document.getElementById("filter")
  if (filterElement) {
    filterElement.addEventListener("change", (event) => {
      currentFilter = event.target.value
      currentPage = 1
      renderPage(currentPage, animeList)
    })
  }

  const searchElement = document.getElementById("search")
  if (searchElement) {
    searchElement.addEventListener("input", (event) => {
      currentSearch = event.target.value
      currentPage = 1
      renderPage(currentPage, animeList)
    })
  }

  // Ajustar elementos por página según el tamaño de la pantalla
  function adjustItemsPerPage() {
    if (window.innerWidth < 480) {
      itemsPerPage = 12
    } else if (window.innerWidth < 768) {
      itemsPerPage = 15
    } else {
      itemsPerPage = 18
    }
    renderPage(currentPage, animeList)
  }

  // Ajustar al cargar y al cambiar el tamaño de la ventana
  adjustItemsPerPage()
  window.addEventListener("resize", adjustItemsPerPage)
}