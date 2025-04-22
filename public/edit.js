const params = new URLSearchParams(window.location.search);
const gameId = params.get('id');

fetch(`/api/games/${gameId}`)
  .then(res => res.json())
  .then(game => {
    document.getElementById('title').value = game.title;
    document.getElementById('description').value = game.Description;
    document.getElementById('imageURL').value = game.imageURL;
  });

document.getElementById('edit-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const Description = document.getElementById('description').value;
  const imageURL = document.getElementById('imageURL').value;

  fetch(`/api/games/${gameId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, Description, imageURL })
  })
  .then(res => {
    if (!res.ok) throw new Error('Update failed');
    alert('Game updated successfully!');
  })
  .catch(err => {
    console.error(err);
    alert('Error updating game');
  });
});
