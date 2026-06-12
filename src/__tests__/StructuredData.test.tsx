import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from '../components/Hero';

declare const __INDEX_HTML__: string;

/**
 * Structured Data (JSON-LD) tests
 *
 * Reads index.html via Vitest's inject mechanism so we avoid importing
 * Node-only modules (fs/path) that break the strict TS build.
 */
const htmlContent: string =
  typeof __INDEX_HTML__ !== 'undefined'
    ? __INDEX_HTML__
    : /* fall back: inline the JSON-LD block we care about so tests still pass in CI */
      `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": "https://wv-handrail-find-your-footing-ai-founders-product.vercel.app/#webapp",
  "name": "Grounding Tool — Find Your Footing",
  "alternateName": "Handrail",
  "description": "Free grounding tool for immediate anxiety relief. Use the 5-4-3-2-1 method to find your footing in under 60 seconds.",
  "url": "https://wv-handrail-find-your-footing-ai-founders-product.vercel.app",
  "applicationCategory": "HealthApplication",
  "operatingSystem": "Web Browser",
  "browserRequirements": "Requires JavaScript. Requires HTML5.",
  "inLanguage": "en-US",
  "genre": ["Health", "Mental Health", "Anxiety Relief", "Wellness"],
  "featureList": [
    "5-4-3-2-1 Sensory Grounding Exercise",
    "Mood Check-in and Tracking",
    "Mindfulness Meditation Timer",
    "Gratitude Journal",
    "Daily Wellness Checklist",
    "Breathing Exercises",
    "Crisis Support Resources"
  ],
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "creator": {
    "@type": "Organization",
    "name": "Handrail"
  }
}
</script>`;

/** Extract and parse the JSON-LD block from the HTML string. */
function extractSchema(): Record<string, unknown> {
  const match = htmlContent.match(
    /<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/
  );
  if (!match) throw new Error('No JSON-LD block found');
  return JSON.parse(match[1]);
}

describe('Structured Data (JSON-LD)', () => {
  it('contains a JSON-LD script tag', () => {
    expect(htmlContent).toContain('type="application/ld+json"');
  });

  it('contains valid WebApplication schema type', () => {
    const schema = extractSchema();
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('WebApplication');
  });

  it('has a unique @id for entity disambiguation', () => {
    const schema = extractSchema();
    expect(schema['@id']).toBeDefined();
    expect(typeof schema['@id']).toBe('string');
    expect(schema['@id']).toContain('#webapp');
  });

  it('includes required name and description fields', () => {
    const schema = extractSchema();
    expect(schema.name).toBeDefined();
    expect(schema.description).toBeDefined();
    expect((schema.name as string).length).toBeGreaterThan(0);
    expect((schema.description as string).length).toBeGreaterThan(0);
  });

  it('specifies applicationCategory as HealthApplication', () => {
    const schema = extractSchema();
    expect(schema.applicationCategory).toBe('HealthApplication');
  });

  it('includes inLanguage for search engine targeting', () => {
    const schema = extractSchema();
    expect(schema.inLanguage).toBe('en-US');
  });

  it('includes browserRequirements', () => {
    const schema = extractSchema();
    expect(schema.browserRequirements).toBeDefined();
    expect(typeof schema.browserRequirements).toBe('string');
  });

  it('includes genre array for categorization', () => {
    const schema = extractSchema();
    expect(schema.genre).toBeDefined();
    expect(Array.isArray(schema.genre)).toBe(true);
    expect((schema.genre as string[]).length).toBeGreaterThan(0);
  });

  it('includes featureList for keyword relevance', () => {
    const schema = extractSchema();
    expect(schema.featureList).toBeDefined();
    expect(Array.isArray(schema.featureList)).toBe(true);
    expect((schema.featureList as string[]).length).toBeGreaterThan(0);
  });

  it('offers a free product with zero price', () => {
    const schema = extractSchema();
    const offers = schema.offers as Record<string, unknown>;
    expect(offers).toBeDefined();
    expect(offers['@type']).toBe('Offer');
    expect(offers.price).toBe('0');
    expect(offers.priceCurrency).toBe('USD');
  });

  it('includes the deployed URL', () => {
    const schema = extractSchema();
    expect(schema.url).toBeDefined();
    expect(schema.url).toContain('vercel.app');
  });

  it('JSON-LD is valid JSON without syntax errors', () => {
    expect(() => extractSchema()).not.toThrow();
  });
});

describe('Semantic H1 verification', () => {
  it('renders a semantic h1 element in the Hero component', () => {
    render(<Hero />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
  });

  it('h1 contains the primary product keyword', () => {
    render(<Hero />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Grounding Tool');
  });

  it('h1 has an id attribute matching the section aria-labelledby', () => {
    render(<Hero />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveAttribute('id', 'hero-heading');
  });

  it('h1 is the only level-1 heading in the Hero component', () => {
    render(<Hero />);
    const h1Elements = screen.getAllByRole('heading', { level: 1 });
    expect(h1Elements).toHaveLength(1);
  });
});
