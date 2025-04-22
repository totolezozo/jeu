fetch('http://localhost:3000/api/games')
  .then(res => {
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  })
  .then(games => {
    console.log('Games:', games);
    const container = document.getElementById('game-cards');
    games.forEach(game => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="images/${game.imageURL}" alt="${game.title}">
        <h3>${game.title}</h3>
        <p>${game.Description}</p>
      `;
      container.appendChild(card);
    });
  })
  .catch(err => console.error('Fetch error:', err));
