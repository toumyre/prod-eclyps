export const navLinks = [
  { to: "/", label: "Accueil" },
  { to: "/team", label: "L'Équipe" },
  { to: "/roster", label: "Roster" },
  { to: "/galerie", label: "Galerie" },
  { to: "/eva-caen", label: "EVA Caen" },
  { to: "/contact", label: "Contact" },
];

export const roster = [
  {
    number: "01",
    pseudo: "Pseudo",
    name: "Prénom Nom",
    evaUrl: "#",
    photo: "/media/page-assets/roster/photo1.jpg",
  },
  {
    number: "02",
    pseudo: "Pseudo",
    name: "Prénom Nom",
    evaUrl: "#",
    photo: "/media/page-assets/roster/photo2.jpg",
  },
  {
    number: "03",
    pseudo: "Pseudo",
    name: "Prénom Nom",
    evaUrl: "#",
    photo: "/media/page-assets/roster/photo3.jpg",
  },
  {
    number: "04",
    pseudo: "Pseudo",
    name: "Prénom Nom",
    evaUrl: "#",
    photo: "/media/page-assets/roster/photo4.jpg",
  },
];

export const evacaenGallery = [
  {
    id: 1,
    title: "L'arène principale",
    src: "/media/page-assets/evacaen/photo1.jpg",
  },
  {
    id: 2,
    title: "Équipement VR",
    src: "/media/page-assets/evacaen/photo2.jpg",
  },
  {
    id: 3,
    title: "Ambiance néon",
    src: "/media/page-assets/evacaen/photo3.jpg",
  },
  {
    id: 4,
    title: "Session compétitive",
    src: "/media/page-assets/evacaen/photo4.jpg",
  },
  {
    id: 5,
    title: "Les joueurs en action",
    src: "/media/page-assets/evacaen/photo5.jpg",
  },
];

export const gallery_config = {
  columnsDesktop: 3,
  infiniteScrollMax: 36,
  initialBatch: 12,
  batchSize: 12,
  pageSizeAfterInfinite: 24,
};

export const filters = [
  { id: "all", label: "Tout voir" },
  { id: "match", label: "Matchs" },
  { id: "equipe", label: "Équipe" },
  { id: "evenements", label: "Événements" },
  { id: "autre", label: "Autre" },
];
