/**
 * CONFIGURATION CENTRALE DU SITE
 * ------------------------------------------------------------
 * Modifiez ici le nom de l'entreprise et les coordonnées :
 * la modification s'applique automatiquement à toutes les pages
 * (titres, balises SEO, en-tête, pied de page, formulaires…).
 */
export const SITE = {
  /** Nom de l'entreprise (à remplacer quand il sera choisi). */
  nom: '[NOM]',

  /** URL publique du site, utilisée pour le SEO (Open Graph, canonical, sitemap). */
  url: 'https://www.exemple.fr',

  /** Téléphone affiché et version internationale pour les liens tel: / WhatsApp. */
  telephone: '06 98 68 19 97',
  telephoneLien: '+33698681997',
  whatsapp: '33698681997',

  email: 'd.cesare@hotmail.com',

  /**
   * >>> À CONFIGURER : endpoint Formspree <<<
   * Créez un formulaire sur https://formspree.io puis collez l'URL ici,
   * par ex. 'https://formspree.io/f/abcdwxyz'. Voir README.md.
   */
  formEndpoint: 'https://formspree.io/f/VOTRE_ID_FORMSPREE',

  /** Description par défaut (SEO). */
  description:
    "Ménage Airbnb et nettoyage pour conciergeries, locations courte durée et bureaux à Noisiel, Marne-la-Vallée (77), Corbeil-Essonnes (91) et Stains (93). Devis sur mesure.",
};

export const ZONES = [
  {
    id: 'noisiel',
    titre: 'Noisiel & Marne-la-Vallée',
    departement: 'Seine-et-Marne (77)',
    texte: 'Noisiel, Champs-sur-Marne, Torcy, Lognes, Noisy-le-Grand et le secteur de Marne-la-Vallée.',
    lat: 48.8486,
    lng: 2.6236,
  },
  {
    id: 'corbeil',
    titre: 'Corbeil-Essonnes & environs',
    departement: 'Essonne (91)',
    texte: 'Corbeil-Essonnes, Évry-Courcouronnes, Saint-Germain-lès-Corbeil, Étiolles et communes alentour.',
    lat: 48.6139,
    lng: 2.4823,
  },
  {
    id: 'stains',
    titre: 'Stains & environs',
    departement: 'Seine-Saint-Denis (93)',
    texte: 'Stains, Saint-Denis, Pierrefitte-sur-Seine, Villetaneuse, Garges-lès-Gonesse et alentours.',
    lat: 48.9506,
    lng: 2.3828,
  },
];

export const NAV = [
  { href: '/', label: 'Accueil' },
  { href: '/prestations/', label: 'Prestations' },
  { href: '/pourquoi-nous-choisir/', label: 'Pourquoi nous ?' },
  { href: '/fonctionnement-tarifs/', label: 'Fonctionnement & tarifs' },
  { href: '/zones-intervention/', label: "Zones d'intervention" },
  { href: '/contact/', label: 'Contact' },
];
