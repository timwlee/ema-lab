export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-promo-${cols.length}-cols`);

  // Detect stats variant: columns that have no images and contain short numeric/text content
  const hasImages = block.querySelector('picture, img');
  if (!hasImages) {
    block.classList.add('columns-promo-stats');
  }

  // Setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-promo-img-col');
        }
      }
    });
  });
}
