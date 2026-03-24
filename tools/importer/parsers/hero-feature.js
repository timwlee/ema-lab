/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero-feature
 * Base block: hero
 * Source: https://www.tesla.com/
 * Generated: 2026-03-24
 * Note: Tesla.com uses React client-side rendering; parser requires fully hydrated DOM.
 *
 * Extracts hero feature section from Tesla homepage (FSD feature highlight).
 * Structure: background image (row 1) + heading + subheading + CTAs (row 2)
 *
 * DOM structure (from captured DOM):
 * .tcl-section > section.tds-layout-2col-has_main
 *   > section.tcl-layout__main (hero-feature block target)
 *     > .block > .tcl-flex-module
 *       > .tcl-react-media (background image with img.tcl-react-media__asset)
 *       > .tcl-flex-module__content-wrapper
 *         > h1 (heading: "Travel Safer, Arrive Refreshed")
 *         > h5 (subheading: "Full Self-Driving (Supervised)")
 *         > div > a.tcl-button (CTAs: "Demo FSD", "Learn More")
 *
 * Target table (from block library - hero has 1 column, 3 rows):
 * | hero-feature                         |
 * | background image                     |
 * | heading + subheading + CTA links     |
 */
export default function parse(element, { document }) {
  // Find the flex module containing the hero content
  // Found in DOM: .tcl-flex-module inside .tcl-layout__main
  const module = element.querySelector('.tcl-flex-module') || element;

  // Extract background image
  // Found in DOM: img.tcl-react-media__asset inside .tcl-react-media containers
  const img = module.querySelector('img.tcl-react-media__asset, img[class*="tcl-react"]');

  // Extract heading (h1: "Travel Safer, Arrive Refreshed")
  const heading = module.querySelector('h1');

  // Extract subheading (h5: "Full Self-Driving (Supervised)")
  const subheading = module.querySelector('h5, h4');

  // Extract CTA links (a.tcl-button: "Demo FSD (Supervised)", "Learn More")
  const ctaLinks = Array.from(module.querySelectorAll('a.tcl-button, a.tds-btn'));

  const cells = [];

  // Row 1: Background image (optional per block library spec)
  if (img) {
    cells.push([img]);
  }

  // Row 2: Content - heading + subheading + CTAs
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  contentCell.push(...ctaLinks);

  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  if (cells.length === 0) return;

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-feature', cells });
  element.replaceWith(block);
}
