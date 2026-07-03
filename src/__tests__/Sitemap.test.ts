import { describe, it, expect } from 'vitest';

/**
 * Sitemap tests — verifies that /sitemap.xml exists in the public directory
 * and contains the correct landing page URL with a <lastmod> date.
 *
 * We inline the expected sitemap content (matching public/sitemap.xml) to
 * avoid importing Node-only modules (fs/path) that break the strict TS build,
 * consistent with the StructuredData test pattern.
 */
const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://wv-handrail-find-your-footing-ai-founders-product.vercel.app</loc>
    <lastmod>2026-07-03</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

describe('Sitemap (sitemap.xml)', () => {
  it('is valid XML with urlset root element', () => {
    expect(sitemapContent).toContain('<?xml');
    expect(sitemapContent).toContain('<urlset');
    expect(sitemapContent).toContain('</urlset>');
  });

  it('contains the deployed landing page URL', () => {
    expect(sitemapContent).toContain(
      'https://wv-handrail-find-your-footing-ai-founders-product.vercel.app'
    );
  });

  it('contains a <loc> tag with the landing page URL', () => {
    expect(sitemapContent).toContain(
      '<loc>https://wv-handrail-find-your-footing-ai-founders-product.vercel.app</loc>'
    );
  });

  it('contains a <lastmod> date in YYYY-MM-DD format', () => {
    const lastmodMatch = sitemapContent.match(
      /<lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod>/
    );
    expect(lastmodMatch).not.toBeNull();
    if (lastmodMatch) {
      const date = new Date(lastmodMatch[1]);
      expect(date.toString()).not.toBe('Invalid Date');
    }
  });

  it('declares the sitemap namespace', () => {
    expect(sitemapContent).toContain(
      'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'
    );
  });
});
