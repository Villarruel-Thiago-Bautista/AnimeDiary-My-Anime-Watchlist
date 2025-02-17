import { watchedAnimes } from "./storage.js";
import { displayWatchedAnimes, closeAnimeInfo } from "./ui.js";

export function renderPagination(filteredLength = watchedAnimes.length) {
    const totalPages = Math.ceil(filteredLength / 20);
    const paginationContainer = document.getElementById("pagination-container");

    if (!paginationContainer) return;

    const paginationDiv = document.createElement("div");
    paginationDiv.classList.add("pagination");

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;
        pageButton.addEventListener("click", () => {
            displayWatchedAnimes(i);
            closeAnimeInfo();
        });

        paginationDiv.appendChild(pageButton);
    }

    paginationContainer.innerHTML = "";
    paginationContainer.appendChild(paginationDiv);
}
