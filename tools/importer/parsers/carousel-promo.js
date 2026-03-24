/* eslint-disable */
/* global WebImporter */

/**
 * Parser: carousel-promo
 * Base block: carousel
 * Source: https://www.tesla.com/
 * Generated: 2026-03-24
 * Note: Tesla.com uses React client-side rendering; parser requires fully hydrated DOM.
 *
 * Extracts carousel slides from Tesla homepage hero carousel.
 * Each slide has: background image (col 1) + heading + subheading + CTA links (col 2)
 *
 * DOM structure (from captured DOM):
 * .tcl-section > section > .tds-flex > .tds-flex-item > .block > .tcl-flex-module-carousel-glue
 *   > .tcl-flex-module-carousel > .tcl-flex-module-carousel__slides
 *     > .tcl-flex-module-carousel__slide.tcl-flex-module-carousel__slide-N
 *       > .tcl-flex-module (each slide)
 *         > .tcl-react-media (background image with img.tcl-react-media__asset)
 *         > .tcl-flex-module__content-wrapper
 *           > h1 (heading)
 *           > h4 (subheading)
 *           > div > a.tcl-button (CTAs)
 *
 * Target table (from block library):
 * | carousel-promo |          |
 * | image          | heading + subheading + CTAs |
 * | image          | heading + subheading + CTAs |
 */
export default function parse(element, { document }) {
  // Find individual slides within the carousel
  // Selector: .tcl-flex-module-carousel__slide (individual slides, not the container)
  const slides = element.querySelectorAll('.tcl-flex-module-carousel__slide');

  // Fallback: if no carousel slides, try individual tcl-flex-module elements
  const slideElements = slides.length > 0
    ? Array.from(slides)
    : Array.from(element.querySelectorAll('.tcl-flex-module'));

  const cells = [];

  slideElements.forEach((slide) => {
    // Each slide contains a .tcl-flex-module with the actual content
    const module = slide.classList.contains('tcl-flex-module')
      ? slide
      : slide.querySelector('.tcl-flex-module');
    if (!module) return;

    // Extract background image
    // Found in DOM: img.tcl-react-media__asset inside .tcl-react-media containers
    const img = module.querySelector('img.tcl-react-media__asset');

    // Extract heading (h1 with class tcl-text-line)
    const heading = module.querySelector('h1');

    // Extract subheading (h4 with class tcl-text-line)
    const subheading = module.querySelector('h4');

    // Extract CTA links (a.tcl-button or a.tds-btn)
    const ctaLinks = Array.from(module.querySelectorAll('a.tcl-button, a.tds-btn'));

    // Build image cell (column 1)
    const imageCell = img ? img : '';

    // Build content cell (column 2): heading + subheading + CTAs
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    contentCell.push(...ctaLinks);

    // Only add row if we have meaningful content
    if (contentCell.length > 0) {
      cells.push([imageCell, contentCell]);
    }
  });

  // If no slides found, skip block creation
  if (cells.length === 0) return;

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-promo', cells });
  element.replaceWith(block);
}
