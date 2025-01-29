function show(el) {
  el.style.display = 'block';
  el.setAttribute('aria-hidden', false);
}

function hide(el) {
  el.style.display = 'none';
  el.setAttribute('aria-hidden', true);
}

function isItemInCategories(categories, visibleCategories) {
  return visibleCategories.some(function (id) {
    return categories.indexOf(id) >= 0;
  });
}

function reflowEntries(isSorted) {
  const entriesContainer = document.querySelector('.timeline'); 
  var entries = entriesContainer.querySelectorAll('.timeline-entry[aria-hidden="false"]');

  if (isSorted) {  
    entries = Array.from(entries).reverse();
    
    entries.forEach(function (entry) {
      entriesContainer.appendChild(entry);
    });
  }

  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];
    entry.classList.remove('odd', 'even', 'first');
    if (i === 0) {
      entry.classList.add('first');
      entry.classList.remove('short');
    }
    if (i % 2 === 0) {
      entry.classList.add('even');
    } else {
      entry.classList.add('odd');
    }
  }
}

function onload() {
  /* We have JS! */
  var root = document.documentElement;
  root.classList.remove('no-js');

  document.querySelector('.filters__sort-button').addEventListener('click', function () {
    const icon = this.querySelector('.fas');
    const textElement = this.querySelector('.sort-text');

    if (this.getAttribute('data-sort') === "asc") {
      icon.classList.remove('fa-caret-down');
      icon.classList.add('fa-caret-up');
      textElement.innerText = 'Mais recente';
      this.setAttribute('data-sort', 'desc');
    } else {
      icon.classList.remove('fa-caret-up');
      icon.classList.add('fa-caret-down');
      textElement.innerText = 'Mais antigo';
      this.setAttribute('data-sort', 'asc');
    }

    reflowEntries(true);
  });

  const expandFiltersButton = document.querySelector('.filters__expand-button');

  expandFiltersButton.addEventListener('click', function (event) { 
    event.preventDefault();
    
    const filterOptions = document.querySelector('.filters__options');
    const icon = this.querySelector('.fas');

    if (!filterOptions.classList.contains('expanded')) {
      this.setAttribute('aria-expanded', 'true');
      filterOptions.classList.add('expanded');
      icon.classList.remove('fa-caret-down');
      icon.classList.add('fa-caret-up');
    } else {
      this.setAttribute('aria-expanded', 'false');
      filterOptions.classList.remove('expanded');
      icon.classList.remove('fa-caret-up');
      icon.classList.add('fa-caret-down');
    }
  })

  /* Back to top button */
  const btnBackToTop = document.querySelector('.btn-back-to-top');
  const header = document.querySelector('.page-header');

  btnBackToTop.addEventListener('click', function (event) {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  const observer = new IntersectionObserver((entries) => {
    (entries[0].isIntersecting ? btnBackToTop.classList.add('hide') : btnBackToTop.classList.remove('hide'))
  });

  window.addEventListener('scroll', () => {
    observer.unobserve(header);
    observer.observe(header);
  });

  new SlimSelect({
    select: '#categories',
    settings: {
      focusSearch: false,
      hideSelected: true,
      placeholderText: 'Categorias',
      searchPlaceholder: 'Pesquisar...'
    },
  });

  new SlimSelect({
    select: '#years',
    settings: {
      placeholderText: 'Anos',
      hideSelected: true,
      showSearch: false
    },
  });

  /* Flow entries */
  reflowEntries();

  // Clean up
  document.removeEventListener('DOMContentLoaded', onload);
}

if (document.readyState != 'loading') {
  onload();
} else {
  document.addEventListener('DOMContentLoaded', onload);
}
