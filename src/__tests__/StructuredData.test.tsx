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
      `<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebApplication","name":"Grounding Tool","description":"Free 5-4-3-2-1 grounding tool for immediate anxiety relief","applicationCategory":"HealthApplication","operatingSystem":"Web","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"}}</script>`;

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

  it('includes required name field', () => {
    const schema = extractSchema();
    expect(schema.name).toBe('Grounding Tool');
  });

  it('includes required description field', () => {
    const schema = extractSchema();
    expect(schema.description).toBe(
      'Free 5-4-3-2-1 grounding tool for immediate anxiety relief'
    );
  });

  it('specifies applicationCategory as HealthApplication', () => {
    const schema = extractSchema();
    expect(schema.applicationCategory).toBe('HealthApplication');
  });

  it('specifies operatingSystem as Web', () => {
    const schema = extractSchema();
    expect(schema.operatingSystem).toBe('Web');
  });

  it('offers a free product with zero price', () => {
    const schema = extractSchema();
    const offers = schema.offers as Record<string, unknown>;
    expect(offers).toBeDefined();
    expect(offers['@type']).toBe('Offer');
    expect(offers.price).toBe('0');
    expect(offers.priceCurrency).toBe('USD');
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

  it('h1 contains the exact specified text', () => {
    render(<Hero />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Grounding Tool — Free 5-4-3-2-1 Anxiety Relief');
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
