function getGameIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  }
  
  async function fetchGameDetails(gameId) {
    try {
      const res = await fetch(`http://localhost:3000/api/games/${gameId}`);
      if (!res.ok) throw new Error('Game not found');
      const game = await res.json();
      displayGameDetails(game);
    } catch (error) {
      console.error('Error loading game details:', error);
    }
  }
  
  async function fetchGameReviews(gameId) {
    try {
      const res = await fetch(`http://localhost:3000/api/reviews/${gameId}`);
      if (!res.ok) throw new Error('Reviews not found');
      const reviews = await res.json();
      displayReviews(reviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  }
  
  function displayGameDetails(game) {
    document.getElementById('game-title').textContent = game.title;
    document.getElementById('game-description').textContent = game.Description;
    document.getElementById('game-image').src = game.imageURL;
  }
  
  function displayReviews(reviews) {
    const container = document.getElementById('reviews-container');
    container.innerHTML = '';
  
    if (reviews.length === 0) {
      container.innerHTML = '<p>No reviews yet.</p>';
      return;
    }
  
    reviews.forEach(review => {
      const reviewDiv = document.createElement('div');
      reviewDiv.classList.add('review');
      reviewDiv.innerHTML = `
        <p><strong>${review.Username}</strong> (${review.rating}/5)</p>
        <p>${review.text}</p>
        <small>${review.reviewDate}</small>
      `;
      container.appendChild(reviewDiv);
    });
  }
  
  // MAIN
  const gameId = getGameIdFromUrl();
  if (gameId) {
    fetchGameDetails(gameId);
    fetchGameReviews(gameId);
  } else {
    console.error('No game ID provided in URL.');
  }
  