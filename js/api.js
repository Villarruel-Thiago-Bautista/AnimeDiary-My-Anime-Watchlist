import { cachedAnimeData, saveToSessionStorage } from "./storage.js";

const API_URL = "https://api.jikan.moe/v4/anime?q=";

export async function fetchAnimeData(animeName) {
    animeName = animeName.toLowerCase();
    
    if (cachedAnimeData[animeName]) {
        return cachedAnimeData[animeName];
    }

    for (let attempt = 0; attempt < 5; attempt++) {
        try {
            const res = await fetch(`${API_URL}${encodeURIComponent(animeName)}&limit=1`);
            
            if (res.status === 429) {
                await new Promise(res => setTimeout(res, 3000));
                continue;
            }

            if (!res.ok) throw new Error(`Error al obtener datos de ${animeName}`);

            const data = await res.json();
            if (data.data?.length > 0) {
                cachedAnimeData[animeName] = data.data[0];
                saveToSessionStorage();
                return data.data[0];
            }
        } catch (error) {
            await new Promise(res => setTimeout(res, 2000));
        }
    }
    return null;
}
