import { displayWatchedAnimes } from "./ui.js";
import { addAnimeIfNotExists } from "./storage.js";

// Lista de animes predefinidos
[
    "Your Name", "Attack on Titan", "Naruto", "Demon Slayer", 
    "Fullmetal Alchemist", "Naruto Shippuden", "Shigatsu wa Kimi no Uso", 
    "Oregairu", "Anohana", "Plastic Memories", "Dragon Ball", 
    "Dragon Ball Z", "Dragon Ball Super", "Boruto", "Tokyo Ghoul", 
    "Nanatsu no Taizai", "Fairy Tail", "Sukitte Ii na yo", "SAO", 
    "Sword Art Online II", "No Game No Life", "Dragon Ball GT", 
    "Cyberpunk: Edgerunners", "Koe no Katachi", "Attack on Titan: The Final Season", 
    "Kimetsu no Yaiba: Yuukaku-hen", "Death Note", "Oshi no Ko", "Boruto: Naruto next generation"
].forEach(addAnimeIfNotExists);

displayWatchedAnimes(1);
