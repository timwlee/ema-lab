/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-product
 * Base block: cards
 * Source: https://www.tesla.com/
 * Generated: 2026-03-24
 * Note: Tesla.com uses React client-side rendering; parser requires fully hydrated DOM.
 *
 * Extracts product cards from Tesla homepage (vehicle lineup and energy products).
 * Each card has: image (col 1) + category/name/pricing/CTAs (col 2)
 *
 * DOM structure (from captured DOM):
 * .tcl-section > section > .tds-flex > .tds-flex-item > .block
 *   > .tcl-flex-module-carousel-glue > .tcl-flex-module-carousel
 *     > .tcl-flex-module-carousel__slides
 *       > .tcl-flex-module-carousel__slide-N
 *         > .tcl-flex-module.tcl-flex-module--product_card_carousel_slide
 *           > .tcl-react-media (optional image with img.tcl-react-media__asset)
 *           > .tcl-flex-module__content-wrapper
 *             > h6 (category e.g. "Sport Sedan")
 *             > h1 (model name e.g. "Model 3")
 *             > h5 > a.tds-link (pricing e.g. "Lease From $399/mo")
 *             > div > a.tcl-button (CTAs: "Order Now", "Learn More")
 *
 * Target table (from block library):
 * | cards-product |                              |
 * | image         | heading + description + CTAs  |
 * | image         | heading + description + CTAs  |
 */
export default function parse(element, { document }) {
  // Find product card modules
  // Selector: .tcl-flex-module--product_card_carousel_slide (individual product cards)
  const cardModules = element.querySelectorAll('.tcl-flex-module--product_card_carousel_slide');

  // Fallback: try .tcl-flex-module if specific product card class not found
  const cards = cardModules.length > 0
    ? Array.from(cardModules)
    : Array.from(element.querySelectorAll('.tcl-flex-module'));

  const cells = [];

  cards.forEach((card) => {
    // Extract product image (optional - some cards don't have images)
    // Found in DOM: img.tcl-react-media__asset
    const img = card.querySelector('img.tcl-react-media__asset');

    // Extract category label (h6 e.g. "Sport Sedan", "Midsize SUV")
    const category = card.querySelector('h6');

    // Extract product name (h1 e.g. "Model 3", "Solar Panels")
    const productName = card.querySelector('h1');

    // Extract pricing info (h5 e.g. "Lease From $399/mo")
    const pricing = card.querySelector('h5');

    // Extract CTA links (a.tcl-button buttons like "Order Now", "Learn More")
    const ctaLinks = Array.from(card.querySelectorAll('a.tcl-button, a.tds-btn'));

    // Build image cell (column 1) - use image if available, empty string otherwise
    const imageCell = img || '';

    // Build content cell (column 2): category + name + pricing + CTAs
    const contentCell = [];
    if (category) contentCell.push(category);
    if (productName) contentCell.push(productName);
    if (pricing) contentCell.push(pricing);
    contentCell.push(...ctaLinks);

    // Only add row if we have meaningful content
    if (contentCell.length > 0) {
      cells.push([imageCell, contentCell]);
    }
  });

  if (cells.length === 0) return;

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-product', cells });
  element.replaceWith(block);
}
