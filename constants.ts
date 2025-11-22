import { Champion } from './types';

// Helper to format names for DDragon URL
const formatForUrl = (name: string): string => {
  // Special cases
  const specialCases: Record<string, string> = {
    "Wukong": "MonkeyKing",
    "Renata Glasc": "Renata",
    "Bel'Veth": "Belveth",
    "Cho'Gath": "Chogath",
    "Kai'Sa": "Kaisa",
    "Kha'Zix": "Khazix",
    "Kog'Maw": "KogMaw",
    "LeBlanc": "Leblanc",
    "Master Yi": "MasterYi",
    "Nunu & Willump": "Nunu",
    "Rek'Sai": "RekSai",
    "Vel'Koz": "Velkoz",
    "Dr. Mundo": "DrMundo",
    "Jarvan IV": "JarvanIV",
    "Lee Sin": "LeeSin",
    "Miss Fortune": "MissFortune",
    "Tahm Kench": "TahmKench",
    "Twisted Fate": "TwistedFate",
    "Xin Zhao": "XinZhao",
    "Aurelion Sol": "AurelionSol"
  };

  if (specialCases[name]) return specialCases[name];
  
  // Default: Remove spaces and non-alphanumeric characters
  return name.replace(/[^a-zA-Z0-9]/g, '');
};

// Curated list of Junglers (Meta & Viable Off-Meta)
const CHAMPION_NAMES = [
  "Amumu", "Bel'Veth", "Brand", "Briar", "Cho'Gath", "Darius", "Diana", "Dr. Mundo", 
  "Ekko", "Elise", "Evelynn", "Fiddlesticks", "Gragas", "Graves", "Gwen", "Hecarim", 
  "Ivern", "Jarvan IV", "Jax", "Karthus", "Kayn", "Kha'Zix", "Kindred", "Lee Sin", 
  "Lillia", "Malphite", "Maokai", "Master Yi", "Mordekaiser", "Morgana", "Naafiri", 
  "Nasus", "Nautilus", "Nidalee", "Nocturne", "Nunu & Willump", "Olaf", "Pantheon", 
  "Poppy", "Qiyana", "Rammus", "Rek'Sai", "Rell", "Rengar", "Rumble", "Sejuani", 
  "Shaco", "Shen", "Shyvana", "Singed", "Sion", "Skarner", "Sylas", "Taliyah", 
  "Talon", "Taric", "Teemo", "Trundle", "Tryndamere", "Twitch", "Udyr", "Urgot", 
  "Vi", "Viego", "Volibear", "Warwick", "Wukong", "Xin Zhao", "Yorick", 
  "Zaahen", "Zac", "Zed", "Zyra"
];

export const CHAMPIONS: Champion[] = CHAMPION_NAMES.map(name => {
  const id = formatForUrl(name);
  return {
    id,
    name,
    image: `https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/${id}.png`
  };
});

// Popular junglers for potential highlighting
export const POPULAR_JUNGLERS = [
  "Lee Sin", "Viego", "Kayn", "Kha'Zix", "Graves", "Hecarim", "Jarvan IV", "Evelynn", "Master Yi", "Nocturne", "Shaco", "Kindred", "Lillia", "Zac", "Briar", "Rengar", "Nidalee", "Elise", "Rek'Sai"
];