// Photos : Scan récursif des sous-dossiers (match, equipe, etc.)
// NOTE: Les images dans ../media/page-assets/ sont exclues de la galerie
const discoveredPhotoModules = import.meta.glob(
  "../media/gallery/photos/*/*.{jpg,jpeg,png,webp,gif,avif}",
  { eager: true, import: "default" },
);

// Images fixes pour les pages (hors galerie)
const teamPhotoModules = import.meta.glob(
  "../media/team/*.{jpg,jpeg,png,webp,gif,avif}",
  { eager: true, import: "default" },
);

const evacaenPhotoModules = import.meta.glob(
  "../media/evacaen/*.{jpg,jpeg,png,webp,gif,avif}",
  { eager: true, import: "default" },
);

const homePhotoModules = import.meta.glob(
  "../media/home/*.{jpg,jpeg,png,webp,gif,avif}",
  { eager: true, import: "default" },
);

// Images pour les joueurs du Roster (photos individuelles)
const rosterPhotoModules = import.meta.glob(
  "../media/roster/*.{jpg,jpeg,png,webp,gif,avif}",
  { eager: true, import: "default" },
);

// Vidéos : Scan du dossier videos
// IMPORTANT : Déplace tes vidéos de /public vers /src/media/gallery/videos/
const discoveredVideoModules = import.meta.glob(
  "../media/gallery/videos/*.{mp4,webm}",
  { eager: true, import: "default" },
);

// --- 3. LOGIQUE DE PARSING ---
function parsePhotoMeta(moduleUrl, fileName, folderCategory) {
  const baseName = fileName.replace(/\.[^.]+$/, "");
  const dateMatch = baseName.match(/^(\d{4})-(\d{2})-/);
  const date = dateMatch ? `${dateMatch[1]}-${dateMatch[2]}-01` : "1970-01-01";
  const category = folderCategory || "autre";

  const title = baseName
    .replace(/^\d{4}-\d{2}-/, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .trim();

  return {
    id: `pho-${category}-${baseName}`
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-"),
    type: "photo",
    category,
    title,
    label: category.charAt(0).toUpperCase() + category.slice(1),
    date,
    src: moduleUrl,
    tags: [],
  };
}

// Exportation des photos traitées
export const galleryItems = Object.entries(discoveredPhotoModules)
  .map(([path, url]) => {
    const parts = path.split("/");
    const fileName = parts.pop();
    const folderCategory = parts.pop();
    return parsePhotoMeta(url, fileName, folderCategory);
  })
  .sort((a, b) => b.date.localeCompare(a.date));

// Exportation des vidéos traitées
export const videoItems = Object.entries(discoveredVideoModules).map(
  ([path, url]) => {
    const fileName = path.split("/").pop();
    const baseName = fileName.replace(/\.[^.]+$/, "");

    return {
      id: `vid-${baseName}`,
      type: "video",
      category: "match", // Ajustable si tu ajoutes des sous-dossiers vidéos
      title: baseName
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      subtitle: "EVA Caen — Saison 2025",
      src: url,
    };
  },
);

// Exportation des assets fixes pour les pages
export const teamAssets = Object.entries(teamPhotoModules).map(([path, url]) => {
  const fileName = path.split("/").pop();
  const baseName = fileName.replace(/\.[^.]+$/, "");

  return {
    id: `team-${baseName.toLowerCase().replace(/[^a-z0-9-]+/g, "-")}`,
    title: baseName.replace(/[-_]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    src: url,
  };
});

export const evacaenAssets = Object.entries(evacaenPhotoModules).map(([path, url]) => {
  const fileName = path.split("/").pop();
  const baseName = fileName.replace(/\.[^.]+$/, "");

  return {
    id: `evacaen-${baseName.toLowerCase().replace(/[^a-z0-9-]+/g, "-")}`,
    title: baseName.replace(/[-_]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    src: url,
  };
});

export const homeAssets = Object.entries(homePhotoModules).map(([path, url]) => {
  const fileName = path.split("/").pop();
  const baseName = fileName.replace(/\.[^.]+$/, "");

  return {
    id: `home-${baseName.toLowerCase().replace(/[^a-z0-9-]+/g, "-")}`,
    title: baseName.replace(/[-_]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    src: url,
  };
});

// Exportation des photos des joueurs pour le Roster
export const rosterAssets = Object.entries(rosterPhotoModules).map(([path, url]) => {
  const fileName = path.split("/").pop();
  const baseName = fileName.replace(/\.[^.]+$/, "");

  // Parse player number from filename (format: 01-Pseudo.jpg or 01-Pseudo-Nom.jpg)
  const numberMatch = baseName.match(/^(\d{2})-(.+)/);
  const playerNumber = numberMatch ? numberMatch[1] : "00";
  const rest = numberMatch ? numberMatch[2] : baseName;
  // Split remaining part: first segment = pseudo, rest = real name (if any)
  const parts = rest.split("-");
  const playerPseudo = parts[0] || baseName;
  const playerName = parts.slice(1).join(" ") || "";

  return {
    id: `roster-${baseName.toLowerCase().replace(/[^a-z0-9-]+/g, "-")}`,
    number: playerNumber,
    pseudo: playerPseudo.replace(/[-_]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    name: playerName.replace(/[-_]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    photo: url,
    evaUrl: "#", // À personnaliser manuellement si besoin
  };
});

// --- 4. HELPERS EXPORTÉS ---
export function getGalleryPhotosFiltered(filterId) {
  if (!filterId || filterId === "all") return galleryItems;
  return galleryItems.filter((p) => p.category === filterId);
}

export function getLightboxItemsFromPhotos(photos) {
  return photos.filter((p) => Boolean(p?.src));
}
