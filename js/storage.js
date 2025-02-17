export let watchedAnimes = JSON.parse(localStorage.getItem("watchedAnimes")) || [];
watchedAnimes = [...new Set(watchedAnimes.map(anime => anime.toLowerCase()))];

export const cachedAnimeData = JSON.parse(sessionStorage.getItem("cachedAnimeData")) || {};

export function saveToLocalStorage() {
    localStorage.setItem("watchedAnimes", JSON.stringify(watchedAnimes));
}

export function saveToSessionStorage() {
    sessionStorage.setItem("cachedAnimeData", JSON.stringify(cachedAnimeData));
}

export function addAnimeIfNotExists(animeName) {
    const normalizedAnimeName = animeName.toLowerCase();
    if (!watchedAnimes.includes(normalizedAnimeName)) {
        watchedAnimes.push(normalizedAnimeName);
        saveToLocalStorage();
    }
}
