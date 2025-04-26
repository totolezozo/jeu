let allGames = [];
let selectedCategories = new Set();

// === FETCH ALL GAMES ===
fetch('http://localhost:3000/api/games')
  .then(res => {
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  })
  .then(games => {
    allGames = games;
    renderCategoryFilters(games);
    renderGames(games);
  
    // Hook up filters
    ['min-players', 'max-players', 'min-duration', 'max-duration'].forEach(id => {
      document.getElementById(id).addEventListener('input', filterAndRender);
    });
    document.getElementById('search-input').addEventListener('input', filterAndRender);
  
    // 🔥 Render Most Recent Games
    const mostRecentGames = [...games]
      .sort((a, b) => b.yearOfPublication - a.yearOfPublication) // newest first
      .slice(0, 10); // take only top 10 newest
  
    renderCarousel('mostrecent-carousel', mostRecentGames);
    setupCarouselButtons('mostrecent-carousel', 'mostrecent-left', 'mostrecent-right');
  })
  
  .catch(err => console.error('Fetch error:', err));

// === FETCH BEST SELLERS ===
fetch('http://localhost:3000/api/best-sellers')
  .then(res => {
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  })
  .then(bestSellers => {
    renderCarousel('bestsellers-carousel', bestSellers);
    setupCarouselButtons('bestsellers-carousel', 'bestsellers-left', 'bestsellers-right');
  })
  .catch(err => console.error('Best Sellers fetch error:', err));

// === RENDER CATEGORY FILTERS ===
function renderCategoryFilters(games) {
  const filterContainer = document.getElementById('category-filters');
  const allCategories = new Set();
  games.forEach(game => game.categories.forEach(cat => allCategories.add(cat)));

  Array.from(allCategories).sort().forEach(category => {
    const label = document.createElement('label');
    label.innerHTML = `
      <input type="checkbox" value="${category}">
      ${category}
    `;
    filterContainer.appendChild(label);
  });

  filterContainer.addEventListener('change', (e) => {
    if (e.target.checked) {
      selectedCategories.add(e.target.value);
    } else {
      selectedCategories.delete(e.target.value);
    }
    filterAndRender();
  });
}

// === MAIN FILTERING FUNCTION ===
function filterAndRender() {
  const query = document.getElementById('search-input').value.toLowerCase();
  const minPlayers = parseInt(document.getElementById('min-players').value);
  const maxPlayers = parseInt(document.getElementById('max-players').value);
  const minDuration = parseInt(document.getElementById('min-duration').value);
  const maxDuration = parseInt(document.getElementById('max-duration').value);

  const filtered = allGames.filter(game => {
    const matchesSearch =
      game.title.toLowerCase().includes(query) ||
      game.Description.toLowerCase().includes(query);

    const matchesCategory =
      selectedCategories.size === 0 ||
      game.categories.some(cat => selectedCategories.has(cat));

    const minP = parseInt(game.minPlayers);
    const maxP = parseInt(game.maxPlayers);
    const minT = parseInt(game.minTime);
    const maxT = parseInt(game.maxTime);

    const matchesPlayers =
      (!isNaN(minPlayers) && !isNaN(maxPlayers)) &&
      minP <= maxPlayers && maxP >= minPlayers;

    const matchesTime =
      (!isNaN(minDuration) && !isNaN(maxDuration)) &&
      minT <= maxDuration && maxT >= minDuration;

    return matchesSearch && matchesCategory && matchesPlayers && matchesTime;
  });

  renderGames(filtered);
}

// === RENDER FEATURED GAMES ===
function renderGames(games) {
  const container = document.getElementById('featured-carousel');
  container.innerHTML = '';

  games.forEach(game => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${game.imageURL}" alt="${game.title}">
      <h3>${game.title}</h3>
      <p>${game.Description}</p>
    `;
    container.appendChild(card);
  });

  setupCarouselButtons('featured-carousel', 'left-btn', 'right-btn');
}

// === GENERIC CAROUSEL RENDERING ===
function renderCarousel(containerId, games) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  games.forEach(game => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${game.imageURL}" alt="${game.title}">
      <h3>${game.title}</h3>
      <p>${game.Description}</p>
    `;
    container.appendChild(card);
  });
}

// === SCROLL BUTTON HANDLING ===
function setupCarouselButtons(carouselId, leftBtnId, rightBtnId) {
  const container = document.getElementById(carouselId);
  const scrollAmount = 240;

  const leftBtn = document.getElementById(leftBtnId);
  const rightBtn = document.getElementById(rightBtnId);

  if (leftBtn && rightBtn) {
    leftBtn.onclick = () => container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    rightBtn.onclick = () => container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
}

document.getElementById('toggle-filters').addEventListener('click', () => {
  const content = document.getElementById('filter-content');
  content.style.display = content.style.display === 'none' ? 'block' : 'none';

  const icon = document.getElementById('toggle-filters');
  icon.textContent = content.style.display === 'none' ? '▼ Filter by Category' : '▲ Filter by Category';
});
