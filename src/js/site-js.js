function show(el) {
  el.style.display = 'block';
  el.setAttribute('aria-hidden', false);
}

function hide(el) {
  el.style.display = 'none';
  el.setAttribute('aria-hidden', true);
}

function hideUnchecked() {
  /* Uncheck the "all" box if one of the filter boxes is unchecked */
  var allBoxes = document.querySelectorAll('input[type="checkbox"][name="filter"]');
  var checkedBoxes = document.querySelectorAll('input[type="checkbox"][name="filter"]:checked');
  if (checkedBoxes.length < allBoxes.length) {
    document.querySelector('input[type="checkbox"]#all').checked = false;
  } else {
    document.querySelector('input[type="checkbox"]#all').checked = true;
  }

  var activeFilters = [];
  checkedBoxes.forEach(function (filter) {
    activeFilters.push(filter.id);
  });

  var entries = document.getElementsByClassName('timeline-entry');
  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];
    var categories = [];
    try {
      categories = entry.dataset.category.split(',').filter((category) => category.length > 0);
    } catch {
      // Pass
    }
    if (categories.length && !isItemInCategories(categories, activeFilters)) {
      hide(entry);
    } else {
      show(entry);
    }
  }

  reflowEntries();
}

function checkAll() {
  var checkboxes = document.querySelectorAll('input[type="checkbox"][name="filter"]');
  checkboxes.forEach(function (box) {
    box.checked = true;
  });
  var entries = document.getElementsByClassName('timeline-entry');
  for (var i = 0; i < entries.length; i++) {
    show(entries[i]);
  }
  reflowEntries();
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

  /* Listen for filter changes */
  document.querySelectorAll('input[type="checkbox"][name="filter"]').forEach(function (box) {
    box.addEventListener('click', hideUnchecked);
  });
  document.querySelector('input[type="checkbox"]#all').addEventListener('click', checkAll);

  document.querySelector('.btn-sort-entries').addEventListener('click', function () {
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
