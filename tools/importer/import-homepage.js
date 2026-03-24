/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS - Import all parsers needed for this template
import carouselPromoParser from './parsers/carousel-promo.js';
import cardsProductParser from './parsers/cards-product.js';
import columnsPromoParser from './parsers/columns-promo.js';
import heroFeatureParser from './parsers/hero-feature.js';

// TRANSFORMER IMPORTS - Import all transformers found in tools/importer/transformers/
import teslaCleanupTransformer from './transformers/tesla-cleanup.js';
import teslaSectionsTransformer from './transformers/tesla-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Tesla homepage featuring vehicle lineup, energy products, and brand messaging with full-width hero sections',
  urls: [
    'https://www.tesla.com/',
  ],
  blocks: [
    {
      name: 'carousel-promo',
      instances: [
        '.tcl-homepage-no-scroll-snapping > .tcl-section:nth-child(1)',
      ],
    },
    {
      name: 'cards-product',
      instances: [
        '.tcl-homepage-no-scroll-snapping > .tcl-section:nth-child(2)',
        '.tcl-homepage-no-scroll-snapping > .tcl-section:nth-child(6)',
      ],
    },
    {
      name: 'columns-promo',
      instances: [
        '.tcl-homepage-no-scroll-snapping > .tcl-section:nth-child(3)',
        '.tcl-homepage-no-scroll-snapping > .tcl-section:nth-child(5)',
      ],
    },
    {
      name: 'hero-feature',
      instances: [
        '.tcl-homepage-no-scroll-snapping > .tcl-section:nth-child(4) .tds-layout__col--main',
      ],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Carousel',
      selector: '.tcl-homepage-no-scroll-snapping > .tcl-section:nth-child(1)',
      style: null,
      blocks: ['carousel-promo'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Vehicle Lineup',
      selector: '.tcl-homepage-no-scroll-snapping > .tcl-section:nth-child(2)',
      style: null,
      blocks: ['cards-product'],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'Promotional Grid',
      selector: '.tcl-homepage-no-scroll-snapping > .tcl-section:nth-child(3)',
      style: null,
      blocks: ['columns-promo'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'FSD Feature and Standard Features',
      selector: '.tcl-homepage-no-scroll-snapping > .tcl-section:nth-child(4)',
      style: 'dark',
      blocks: ['hero-feature'],
      defaultContent: ['h1', 'button'],
    },
    {
      id: 'section-5',
      name: 'Find Your Charge',
      selector: '.tcl-homepage-no-scroll-snapping > .tcl-section:nth-child(5)',
      style: null,
      blocks: ['columns-promo'],
      defaultContent: [],
    },
    {
      id: 'section-6',
      name: 'Energy Products',
      selector: '.tcl-homepage-no-scroll-snapping > .tcl-section:nth-child(6)',
      style: 'dark',
      blocks: ['cards-product'],
      defaultContent: [],
    },
    {
      id: 'section-7',
      name: 'Footnotes',
      selector: '.tcl-homepage-no-scroll-snapping > .tcl-section:nth-child(7)',
      style: null,
      blocks: [],
      defaultContent: ['p'],
    },
  ],
};

// PARSER REGISTRY - Map parser names to functions
const parsers = {
  'carousel-promo': carouselPromoParser,
  'cards-product': cardsProductParser,
  'columns-promo': columnsPromoParser,
  'hero-feature': heroFeatureParser,
};

// TRANSFORMER REGISTRY - Array of transformer functions
// Section transformer runs after cleanup (in afterTransform hook)
const transformers = [
  teslaCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [teslaSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - The payload containing { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
