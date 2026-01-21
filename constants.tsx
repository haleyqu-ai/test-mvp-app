
import { Model } from './types';

export const EXPLORE_CHANNELS = [
  'Featured', 'Trending', '3D Print', 'Fantasy', 'Kids', 'Character', 'Detailed', 'Most Downloads'
];

export const MESH_CREDIT_ICON = "https://cdn.meshy.ai/ti_w:64,q:75,f:webp/webapp-build-assets/production/_next/static/media/mushroom-filled-24@3.197e3724.png";

const DRAGON_GLB = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DragonAttenuation/glTF-Binary/DragonAttenuation.glb";

// Pool of stable themed images using picsum.photos to ensure reliability across all channels
const THEMED_THUMBNAILS = [
  "https://picsum.photos/seed/mesh1/400/400",
  "https://picsum.photos/seed/mesh2/400/400",
  "https://picsum.photos/seed/mesh3/400/400",
  "https://picsum.photos/seed/mesh4/400/400",
  "https://picsum.photos/seed/mesh5/400/400",
  "https://picsum.photos/seed/mesh6/400/400",
  "https://picsum.photos/seed/mesh7/400/400",
  "https://picsum.photos/seed/mesh8/400/400",
  "https://picsum.photos/seed/mesh9/400/400",
  "https://picsum.photos/seed/mesh10/400/400",
  "https://picsum.photos/seed/mesh11/400/400",
  "https://picsum.photos/seed/mesh12/400/400",
];

const ASSET_THEMES = [
  { title: "Stylized Loot Crate", keyword: "box,crate,wood", prompt: "A low-poly stylized wooden crate with metal reinforcements, hand-painted textures, game asset." },
  { title: "Magma Golem", keyword: "lava,monster,golem", prompt: "Gigantic lava golem with glowing cracks, obsidian armor, 3D sculpt for RPG." },
  { title: "Frost Wolf", keyword: "wolf,animal,statue", prompt: "Epic 3D model of a white wolf standing on a snowy rock base, high detail fur." },
  { title: "Crimson Crystal Cluster", keyword: "crystal,gem,rock", prompt: "Procedurally generated red jasper crystals, sharp edges, subsurface scattering." },
  { title: "Yeti Guardian", keyword: "character,monster,stylized", prompt: "A stylized female yeti character with blue skin and white fur, cute expression, 3D game character." },
  { title: "Viking Berserker", keyword: "viking,warrior,axe", prompt: "Hyper-realistic Viking warrior with bear pelt headpiece and bloodied axe." },
  { title: "Tactical Stock Mod", keyword: "gun,part,industrial", prompt: "Hard surface model of a tactical weapon stock, carbon fiber texture, precise engineering." },
  { title: "Ancient Elven Sage", keyword: "elf,wizard,statue", prompt: "Old elven wizard bust with long beard and hooded cloak, intricate fabric folds." },
  { title: "Shadow Maiden", keyword: "goth,girl,bust", prompt: "Stylized bust of a gothic girl with pigtails, monochrome aesthetic, clean topology." },
  { title: "Leather Pauldrons", keyword: "armor,leather,fantasy", prompt: "High-poly leather armor set with fur lining and brass buckles, RPG equipment." },
  { title: "Lizardman Vanguard", keyword: "reptile,warrior,fantasy", prompt: "Anthropomorphic crocodile warrior in ancient gladiator armor, scaly skin detail." },
  { title: "Battleaxe Valkyrie", keyword: "woman,warrior,armor", prompt: "Female warrior in white and gold armor holding a massive double-headed battleaxe." }
];

const createMockModel = (id: string, index: number): Model => {
  const channel = EXPLORE_CHANNELS[index % EXPLORE_CHANNELS.length];
  const theme = ASSET_THEMES[index % ASSET_THEMES.length];
  const title = `${theme.title} #${id.slice(1)}`;
  const thumbnail = THEMED_THUMBNAILS[index % THEMED_THUMBNAILS.length];
  
  return {
    id,
    title,
    thumbnail,
    modelUrl: DRAGON_GLB,
    author: { 
      name: ['MageMaster', 'AssetForge', 'NexusSculpt', 'VertexWolf', 'PolyPrince'][index % 5], 
      avatar: `https://picsum.photos/seed/user${id}/60/60` 
    },
    stats: { 
      likes: Math.floor(Math.random() * 8000) + 500, 
      downloads: Math.floor(Math.random() * 1000) 
    },
    tags: [channel, 'Featured'],
    createdAt: 'Mar 24, 2024',
    size: `${(Math.random() * 20 + 5).toFixed(1)} MB`,
    specs: { topology: 'Quads', faces: 85000, vertices: 43000 },
    prompt: theme.prompt
  };
};

const generatedModels: Model[] = [];
for (let i = 1; i <= 80; i++) {
  generatedModels.push(createMockModel(`m${i}`, i));
}

export const MOCK_MODELS: Model[] = generatedModels;

export const ASSETS_MODELS: Model[] = [
  { ...MOCK_MODELS[0], id: 'a1', title: 'Stylized Crate v2', status: 'ready', createdAt: 'Mar 20, 2024', thumbnail: "https://picsum.photos/seed/crate_assets/400/400" },
  { ...MOCK_MODELS[3], id: 'a2', title: 'Crystal Shards Gen', status: 'generating', createdAt: 'Mar 21, 2024', thumbnail: "https://picsum.photos/seed/crystal_assets/400/400" },
  { ...MOCK_MODELS[1], id: 'a3', title: 'Abstract Void Node', status: 'ready', createdAt: 'Mar 22, 2024', thumbnail: "https://picsum.photos/seed/void_assets/400/400" }
];

export const ASSETS_IMAGES = [
  { id: 'i1', url: "https://picsum.photos/seed/tex1/400/400", title: 'Texture Sample 01' },
  { id: 'i2', url: "https://picsum.photos/seed/tex2/400/400", title: 'Height Map Alpha' },
];

export const EXPORTED_FILES = [
  { id: 'e1', name: 'crate_stylized_lp.glb', date: '2024-03-20', size: '4.2 MB' },
];
