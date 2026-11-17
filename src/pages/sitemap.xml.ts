import { SITE } from '../config';

const pages = ['', 'prestations/', 'pourquoi-nous-choisir/', 'fonctionnement-tarifs/', 'zones-intervention/', 'devis/', 'contact/'];

export function GET() {
  const urls = pages.map((p) => `  <url><loc>${new URL(p, SITE.url + '/').href}</loc></url>`).join('\n');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml' } },
  );
}
