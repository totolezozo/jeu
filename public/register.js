// register.js
const API = 'http://localhost:3000';

document.getElementById('register-form').addEventListener('submit', async e => {
  e.preventDefault();
  const errDiv = document.getElementById('register-error');
  errDiv.textContent = '';

  const fd = new FormData(e.target);
  const payload = {
    username: fd.get('username').trim(),
    email:    fd.get('email').trim(),
    password: fd.get('password').trim()
  };

  const res = await fetch(`${API}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  });
  console.log('register response headers:', [...res.headers.entries()]);
  const body = await res.json();
  if (!res.ok) {
    errDiv.textContent = body.error || 'Registration failed';
    return;
  }
  window.location.href = 'login.html?registered=1';
});
