export default function decorate(block) {
  const rows = [...block.children];

  if (rows.length >= 2) {
    // First row = background, second row = content
    rows[0].classList.add('hero-feature-background');
    rows[1].classList.add('hero-feature-content');
  } else if (rows.length === 1) {
    // Single row - check if it has an image
    const hasImage = rows[0].querySelector('picture, img');
    if (hasImage) {
      rows[0].classList.add('hero-feature-background');
    } else {
      rows[0].classList.add('hero-feature-content');
      block.classList.add('no-image');
    }
  }

  if (!block.querySelector('picture') && !block.querySelector('img')) {
    block.classList.add('no-image');
  }
}
