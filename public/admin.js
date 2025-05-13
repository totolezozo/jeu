async function loadRentals() {
  try {
    const res = await fetch('http://localhost:3000/api/rent');
    const rentals = await res.json();
    const tbody = document.querySelector('#rental-table tbody');

    tbody.innerHTML = rentals
      .filter(r => r.status === 'ongoing')
      .map(r => `
        <tr>
          <td>${r.Username}</td>
          <td>${r.title}</td>
          <td>${r.rentalDate}</td>
          <td>${r.DueDate}</td>
          <td><button onclick="returnGame('${r.UserId}', '${r.gameid}', '${r.rentalDate}')">Return</button></td>

        </tr>
      `).join('');
  } catch (err) {
    console.error('Error loading rentals:', err);
  }
}

async function returnGame(userId, gameId, rentalDate) {
  try {
    const res = await fetch('http://localhost:3000/api/rent/return', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, gameId, rentalDate })
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || 'Return failed');
      return;
    }
    alert('Game returned!');
    loadRentals();
  } catch (err) {
    console.error('Return error:', err);
    alert('Something went wrong.');
  }
}


loadRentals();

document.getElementById('add-game-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  const payload = Object.fromEntries(formData.entries());

  try {
    const res = await fetch('http://localhost:3000/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || 'Game creation failed');
      return;
    }

    alert('Game added!');
    this.reset();
  } catch (err) {
    console.error('Error adding game:', err);
    alert('Error occurred');
  }
});

document.getElementById('load-game-btn').addEventListener('click', async () => {
  const title = document.getElementById('search-title').value.trim();
  if (!title) return;

  try {
    const res = await fetch(`http://localhost:3000/api/games/title/${encodeURIComponent(title)}`);
    if (!res.ok) throw new Error('Game not found');

    const game = await res.json();
    const form = document.getElementById('edit-game-form');

    // Fill form
    for (const key in game) {
      const input = form.elements[key];
      if (input) input.value = game[key];
    }

    form.classList.remove('hidden');
  } catch (err) {
    alert('Game not found or error loading game.');
    console.error(err);
  }
});

document.getElementById('edit-game-form').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    const res = await fetch(`http://localhost:3000/api/games/${data.gameid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error);
    alert('Game updated successfully!');
  } catch (err) {
    alert('Failed to update game.');
    console.error(err);
  }
});
