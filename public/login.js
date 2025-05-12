// login.js
const API = 'http://localhost:3000';

document.getElementById('login-form').addEventListener('submit', async e => {
  e.preventDefault();
  const errDiv = document.getElementById('login-error');
  errDiv.textContent = '';

  const fd = new FormData(e.target);
  const payload = {
    username: fd.get('username').trim(),
    password: fd.get('password').trim()
  };

  const res  = await fetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  });
  console.log('login response headers:', [...res.headers.entries()]);
  const body = await res.json();
  if (!res.ok) {
    errDiv.textContent = body.error || 'Login failed';
    return;
  }
  // check for Set-Cookie
  if (!res.headers.get('set-cookie')) {
    console.warn('No Set-Cookie header; session cookie might not have set.');
  }
  window.location.href = 'index.html';
});
