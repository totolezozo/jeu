// auth-status.js
(async function() {
    const nav = document.getElementById('main-nav');
    if (!nav) {
      console.log('auth-status: no #main-nav found, bailing.');
      return;
    }
  
    console.log('auth-status: fetching login status…');
    try {
      const res = await fetch('http://localhost:3000/api/auth/status', {
        credentials: 'include'
      });
      console.log('auth-status: response status =', res.status);
  
      const text = await res.text();
      console.log('auth-status: raw response text =', text);
  
      let body;
      try {
        body = JSON.parse(text);
        console.log('auth-status: parsed JSON =', body);
      } catch (jsonErr) {
        console.error('auth-status: JSON parse error:', jsonErr);
        throw jsonErr;
      }
  
      if (body.loggedIn) {
        console.log('auth-status: user is logged in as', body.user.Username);
        nav.innerHTML = `
        <div class="user-menu">
          <span class="nav-welcome" id="user-welcome">Welcome, ${body.user.Username}</span>
          <div id="user-rentals" class="user-rentals hidden"></div>
          <a href="#" id="logout-link" class="nav-link">Logout</a>
        </div>
        `;
        document.getElementById('logout-link').addEventListener('click', async e => {
          e.preventDefault();
          console.log('auth-status: logging out…');
          const logoutRes = await fetch('http://localhost:3000/api/auth/logout', {
            credentials: 'include'
          });
          console.log('auth-status: logout response status =', logoutRes.status);
          window.location.reload();
        });
        document.getElementById('user-welcome').addEventListener('click', async () => {
  const dropdown = document.getElementById('user-rentals');
  if (!dropdown.classList.contains('hidden')) {
    dropdown.classList.add('hidden');
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/api/rent/user/${body.user.UserId}`, {
      credentials: 'include'
    });
    const rentals = await res.json();

    if (!Array.isArray(rentals) || rentals.length === 0) {
      dropdown.innerHTML = '<p>No current rentals.</p>';
    } else {
      dropdown.innerHTML = rentals
        .map(r => `<div><strong>${r.title}</strong><br>Due: ${r.DueDate}</div>`)
        .join('<hr>');
    }

    dropdown.classList.remove('hidden');
  } catch (err) {
    console.error('Failed to load rentals:', err);
    dropdown.innerHTML = '<p>Error loading rentals</p>';
    dropdown.classList.remove('hidden');
  }
});

      } else {
        console.log('auth-status: user is NOT logged in');
        nav.innerHTML = `
          <a href="login.html">Login</a>
          <a href="register.html">Register</a>
        `;
      }
    } catch (err) {
      console.error('auth-status: error fetching status', err);
      nav.innerHTML = `
        <a href="login.html">Login</a>
        <a href="register.html">Register</a>
      `;
    }
  })();
  