import { animeList } from "./animeData.js"
import { renderPage, setupPagination } from "./pagination.js"
import { fetchAnimeDetails } from "./animeFetch.js"

document.addEventListener("DOMContentLoaded", () => {
  const animeName = new URLSearchParams(window.location.search).get("anime")

  if (animeName) {
    // Si hay un nombre de anime en la URL, carga los detalles del anime
    fetchAnimeDetails(animeName)
  } else {
    // Si no hay un nombre de anime, carga la lista de animes con paginación
    renderPage(1, animeList)
    setupPagination(animeList)
  }

  // Añadir animaciones de entrada
  const animeContainer = document.getElementById("anime-container")
  animeContainer.style.opacity = "0"
  animeContainer.style.transform = "translateY(20px)"
  animeContainer.style.transition = "opacity 0.5s ease, transform 0.5s ease"

  setTimeout(() => {
    animeContainer.style.opacity = "1"
    animeContainer.style.transform = "translateY(0)"
  }, 100)

  // Añadir efecto de desplazamiento suave para todos los enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href")
      if (targetId === "#") return

      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
        })
      }
    })
  })
})
