export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && (div.querySelector('picture') || div.querySelector('img'))) {
        div.className = 'cards-product-card-image';
      } else {
        div.className = 'cards-product-card-body';
      }
    });
    ul.append(li);
  });
  block.textContent = '';
  block.append(ul);

  // Add horizontal scroll navigation
  const navPrev = document.createElement('button');
  navPrev.classList.add('cards-product-nav', 'cards-product-nav-prev');
  navPrev.setAttribute('aria-label', 'Scroll left');
  navPrev.type = 'button';

  const navNext = document.createElement('button');
  navNext.classList.add('cards-product-nav', 'cards-product-nav-next');
  navNext.setAttribute('aria-label', 'Scroll right');
  navNext.type = 'button';

  const scrollAmount = () => {
    const card = ul.querySelector('li');
    return card ? card.offsetWidth + 16 : 300;
  };

  navPrev.addEventListener('click', () => {
    ul.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
  });

  navNext.addEventListener('click', () => {
    ul.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
  });

  const updateNavVisibility = () => {
    const { scrollLeft, scrollWidth, clientWidth } = ul;
    navPrev.classList.toggle('hidden', scrollLeft <= 0);
    navNext.classList.toggle('hidden', scrollLeft + clientWidth >= scrollWidth - 2);
  };

  ul.addEventListener('scroll', updateNavVisibility);
  block.append(navPrev, navNext);

  requestAnimationFrame(updateNavVisibility);
}
