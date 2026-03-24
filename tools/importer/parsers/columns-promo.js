/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-promo
 * Base block: columns
 * Source: https://www.tesla.com/
 * Generated: 2026-03-24
 * Note: Tesla.com uses React client-side rendering; parser requires fully hydrated DOM.
 *
 * Extracts side-by-side promotional columns from Tesla homepage.
 * Used for: Promotional Grid (section 3) and Find Your Charge stats (section 5).
 *
 * DOM structure for section 3 (from captured DOM):
 * .tcl-section > section.tds-layout-2col
 *   > section.tcl-layout__child (column 1)
 *     > .block > .tcl-flex-module
 *       > .tcl-react-media (bg image with img.tcl-react-media__asset)
 *       > .tcl-flex-module__content-wrapper
 *         > h2 (heading e.g. "Current Offers")
 *         > h5 (description)
 *         > a (CTA link e.g. "Learn More")
 *   > section.tcl-layout__child (column 2)
 *     > (same structure)
 *
 * DOM structure for section 5 (charging stats):
 * .tcl-section > section > section.tcl-layout__main
 *   > .block > .tcl-react-glue-container
 *     > heading/paragraph content
 *     > stat counters (p + h4)
 *     > button CTAs
 *
 * Target table (from block library):
 * | columns-promo |                              |
 * | col1 content  | col2 content                 |
 */
export default function parse(element, { document }) {
  // Strategy 1: Two-column layout with .tcl-layout__child columns (section 3 promo grid)
  const layoutChildren = element.querySelectorAll('.tcl-layout__child, .tds-layout-item');

  if (layoutChildren.length >= 2) {
    const row = [];

    Array.from(layoutChildren).forEach((col) => {
      const cellContent = [];

      // Extract image
      const img = col.querySelector('img.tcl-react-media__asset');
      if (img) cellContent.push(img);

      // Extract headings (h2 for title, h5 for description)
      const heading = col.querySelector('h1, h2');
      const subheading = col.querySelector('h4, h5');
      if (heading) cellContent.push(heading);
      if (subheading) cellContent.push(subheading);

      // Extract CTA links
      const ctaLinks = Array.from(col.querySelectorAll('a.tcl-button, a.tds-btn, a[href]'));
      // Filter out non-CTA links (e.g. pricing links)
      const ctas = ctaLinks.filter((a) => !a.classList.contains('tds-link'));
      cellContent.push(...ctas);

      row.push(cellContent.length > 0 ? cellContent : '');
    });

    if (row.some((cell) => cell !== '')) {
      const cells = [row];
      const block = WebImporter.Blocks.createBlock(document, { name: 'columns-promo', cells });
      element.replaceWith(block);
      return;
    }
  }

  // Strategy 2: Single column with stats (section 5 charging)
  // Extract headings, stats, and CTAs as two columns
  const headings = element.querySelectorAll('h1, h2, h3, h4, p');
  const buttons = element.querySelectorAll('a.tcl-button, a.tds-btn, button[class*="tcl-button"]');

  if (headings.length > 0) {
    const contentCell = [];
    Array.from(headings).forEach((h) => {
      if (h.textContent.trim()) contentCell.push(h);
    });
    Array.from(buttons).forEach((btn) => {
      if (btn.textContent.trim()) contentCell.push(btn);
    });

    if (contentCell.length > 0) {
      const cells = [contentCell];
      const block = WebImporter.Blocks.createBlock(document, { name: 'columns-promo', cells });
      element.replaceWith(block);
    }
  }
}
