var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/carousel-promo.js
  function parse(element, { document }) {
    const slides = element.querySelectorAll(".tcl-flex-module-carousel__slide");
    const slideElements = slides.length > 0 ? Array.from(slides) : Array.from(element.querySelectorAll(".tcl-flex-module"));
    const cells = [];
    slideElements.forEach((slide) => {
      const module = slide.classList.contains("tcl-flex-module") ? slide : slide.querySelector(".tcl-flex-module");
      if (!module) return;
      const img = module.querySelector("img.tcl-react-media__asset");
      const heading = module.querySelector("h1");
      const subheading = module.querySelector("h4");
      const ctaLinks = Array.from(module.querySelectorAll("a.tcl-button, a.tds-btn"));
      const imageCell = img ? img : "";
      const contentCell = [];
      if (heading) contentCell.push(heading);
      if (subheading) contentCell.push(subheading);
      contentCell.push(...ctaLinks);
      if (contentCell.length > 0) {
        cells.push([imageCell, contentCell]);
      }
    });
    if (cells.length === 0) return;
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-product.js
  function parse2(element, { document }) {
    const cardModules = element.querySelectorAll(".tcl-flex-module--product_card_carousel_slide");
    const cards = cardModules.length > 0 ? Array.from(cardModules) : Array.from(element.querySelectorAll(".tcl-flex-module"));
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector("img.tcl-react-media__asset");
      const category = card.querySelector("h6");
      const productName = card.querySelector("h1");
      const pricing = card.querySelector("h5");
      const ctaLinks = Array.from(card.querySelectorAll("a.tcl-button, a.tds-btn"));
      const imageCell = img || "";
      const contentCell = [];
      if (category) contentCell.push(category);
      if (productName) contentCell.push(productName);
      if (pricing) contentCell.push(pricing);
      contentCell.push(...ctaLinks);
      if (contentCell.length > 0) {
        cells.push([imageCell, contentCell]);
      }
    });
    if (cells.length === 0) return;
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-promo.js
  function parse3(element, { document }) {
    const layoutChildren = element.querySelectorAll(".tcl-layout__child, .tds-layout-item");
    if (layoutChildren.length >= 2) {
      const row = [];
      Array.from(layoutChildren).forEach((col) => {
        const cellContent = [];
        const img = col.querySelector("img.tcl-react-media__asset");
        if (img) cellContent.push(img);
        const heading = col.querySelector("h1, h2");
        const subheading = col.querySelector("h4, h5");
        if (heading) cellContent.push(heading);
        if (subheading) cellContent.push(subheading);
        const ctaLinks = Array.from(col.querySelectorAll("a.tcl-button, a.tds-btn, a[href]"));
        const ctas = ctaLinks.filter((a) => !a.classList.contains("tds-link"));
        cellContent.push(...ctas);
        row.push(cellContent.length > 0 ? cellContent : "");
      });
      if (row.some((cell) => cell !== "")) {
        const cells = [row];
        const block = WebImporter.Blocks.createBlock(document, { name: "columns-promo", cells });
        element.replaceWith(block);
        return;
      }
    }
    const headings = element.querySelectorAll("h1, h2, h3, h4, p");
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
        const block = WebImporter.Blocks.createBlock(document, { name: "columns-promo", cells });
        element.replaceWith(block);
      }
    }
  }

  // tools/importer/parsers/hero-feature.js
  function parse4(element, { document }) {
    const module = element.querySelector(".tcl-flex-module") || element;
    const img = module.querySelector('img.tcl-react-media__asset, img[class*="tcl-react"]');
    const heading = module.querySelector("h1");
    const subheading = module.querySelector("h5, h4");
    const ctaLinks = Array.from(module.querySelectorAll("a.tcl-button, a.tds-btn"));
    const cells = [];
    if (img) {
      cells.push([img]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    contentCell.push(...ctaLinks);
    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
    if (cells.length === 0) return;
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/tesla-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      element.querySelectorAll('script[type="application/json"]').forEach((el) => el.remove());
      element.querySelectorAll('nav[aria-label="Tab List"]').forEach((el) => el.remove());
      element.querySelectorAll(".tcl-video__controls").forEach((el) => el.remove());
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        "noscript",
        "link"
      ]);
      const chatWidget = element.querySelector(".chat-container");
      if (chatWidget) chatWidget.remove();
      element.querySelectorAll("button").forEach((btn) => {
        var _a, _b;
        if (btn.textContent.includes("Schedule a Drive Today")) {
          ((_a = btn.closest("div")) == null ? void 0 : _a.remove()) || btn.remove();
        }
        if (btn.textContent.includes("Ask a Question")) {
          ((_b = btn.closest("div")) == null ? void 0 : _b.remove()) || btn.remove();
        }
      });
      element.querySelectorAll("iframe").forEach((el) => el.remove());
      element.querySelectorAll('[class*="gm-"], .gm-style').forEach((el) => el.remove());
      element.querySelectorAll("button").forEach((btn) => {
        if (btn.textContent.includes("Find Me") || btn.textContent.includes("Map camera") || btn.textContent.includes("Keyboard shortcuts")) {
          btn.remove();
        }
      });
    }
  }

  // tools/importer/transformers/tesla-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const document = element.ownerDocument || element.getRootNode();
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selector = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selector) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.append(sectionMetadata);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Tesla homepage featuring vehicle lineup, energy products, and brand messaging with full-width hero sections",
    urls: [
      "https://www.tesla.com/"
    ],
    blocks: [
      {
        name: "carousel-promo",
        instances: [
          ".tcl-homepage-no-scroll-snapping > .tcl-section:nth-child(1)"
        ]
      },
      {
        name: "cards-product",
        instances: [
          ".tcl-homepage-no-scroll-snapping > .tcl-section:nth-child(2)",
          ".tcl-homepage-no-scroll-snapping > .tcl-section:nth-child(6)"
        ]
      },
      {
        name: "columns-promo",
        instances: [
          ".tcl-homepage-no-scroll-snapping > .tcl-section:nth-child(3)",
          ".tcl-homepage-no-scroll-snapping > .tcl-section:nth-child(5)"
        ]
      },
      {
        name: "hero-feature",
        instances: [
          ".tcl-homepage-no-scroll-snapping > .tcl-section:nth-child(4) .tds-layout__col--main"
        ]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Carousel",
        selector: ".tcl-homepage-no-scroll-snapping > .tcl-section:nth-child(1)",
        style: null,
        blocks: ["carousel-promo"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Vehicle Lineup",
        selector: ".tcl-homepage-no-scroll-snapping > .tcl-section:nth-child(2)",
        style: null,
        blocks: ["cards-product"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Promotional Grid",
        selector: ".tcl-homepage-no-scroll-snapping > .tcl-section:nth-child(3)",
        style: null,
        blocks: ["columns-promo"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "FSD Feature and Standard Features",
        selector: ".tcl-homepage-no-scroll-snapping > .tcl-section:nth-child(4)",
        style: "dark",
        blocks: ["hero-feature"],
        defaultContent: ["h1", "button"]
      },
      {
        id: "section-5",
        name: "Find Your Charge",
        selector: ".tcl-homepage-no-scroll-snapping > .tcl-section:nth-child(5)",
        style: null,
        blocks: ["columns-promo"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Energy Products",
        selector: ".tcl-homepage-no-scroll-snapping > .tcl-section:nth-child(6)",
        style: "dark",
        blocks: ["cards-product"],
        defaultContent: []
      },
      {
        id: "section-7",
        name: "Footnotes",
        selector: ".tcl-homepage-no-scroll-snapping > .tcl-section:nth-child(7)",
        style: null,
        blocks: [],
        defaultContent: ["p"]
      }
    ]
  };
  var parsers = {
    "carousel-promo": parse,
    "cards-product": parse2,
    "columns-promo": parse3,
    "hero-feature": parse4
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
