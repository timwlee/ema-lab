/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Tesla site-wide cleanup.
 * Removes non-authorable content from Tesla pages.
 * Selectors from captured DOM of https://www.tesla.com/
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove React JSON data scripts that may interfere with parsing
    // Found in DOM: <script type="application/json" data-info="react-data-tesla_*">
    element.querySelectorAll('script[type="application/json"]').forEach((el) => el.remove());

    // Remove carousel tab navigation (non-authorable UI controls)
    // Found in DOM: <nav aria-label="Tab List"> with <button class="tds-tab">
    element.querySelectorAll('nav[aria-label="Tab List"]').forEach((el) => el.remove());

    // Remove video control buttons (non-authorable)
    // Found in DOM: <button class="tds-icon-btn ... tcl-video__controls">
    element.querySelectorAll('.tcl-video__controls').forEach((el) => el.remove());
  }

  if (hookName === H.after) {
    // Remove site header (non-authorable global chrome)
    // Found in DOM: <header class="tds-site-header">
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      'noscript',
      'link',
    ]);

    // Remove chat widget (non-authorable)
    // Found in DOM: <div class="chat-container">
    const chatWidget = element.querySelector('.chat-container');
    if (chatWidget) chatWidget.remove();

    // Remove "Schedule a Drive Today" floating button (non-authorable)
    // Found in DOM: <button> with "Schedule a Drive Today" text and tds-icon-btn
    element.querySelectorAll('button').forEach((btn) => {
      if (btn.textContent.includes('Schedule a Drive Today')) {
        btn.closest('div')?.remove() || btn.remove();
      }
      if (btn.textContent.includes('Ask a Question')) {
        btn.closest('div')?.remove() || btn.remove();
      }
    });

    // Remove Google Maps iframes (non-authorable interactive content)
    // Found in DOM: <iframe> inside section 5 (charging map)
    element.querySelectorAll('iframe').forEach((el) => el.remove());

    // Remove Google Maps related elements
    // Found in DOM: <div class="gm-style"> and map controls
    element.querySelectorAll('[class*="gm-"], .gm-style').forEach((el) => el.remove());

    // Remove map "Find Me" button and map camera controls
    element.querySelectorAll('button').forEach((btn) => {
      if (btn.textContent.includes('Find Me') || btn.textContent.includes('Map camera') || btn.textContent.includes('Keyboard shortcuts')) {
        btn.remove();
      }
    });
  }
}
