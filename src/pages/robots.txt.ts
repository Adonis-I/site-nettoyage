import { SITE, link } from '../config';

export function GET() {
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}${link('/sitemap.xml')}\n`, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
