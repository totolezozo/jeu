Board Game Rental - Final Project

Authors:
- Thomas Chometon
- David Khersis
- Edgar Tromparent

-----------------------------
Application Features:

User:
- Register, login, and logout (session-based)
- Browse games with filters and search
- View detailed game info (description, rating, reviews)
- Rent games online

Admin:
- View ongoing rentals (from SQL view)
- Return games (via stored procedure + trigger)
- Add new games to the catalog
- Modify existing game details

-----------------------------
Tech Stack:

- Frontend: HTML, CSS, JS (Vanilla)
- Backend: Node.js with Express
- Database: MySQL (with views, triggers, procedures)
- Session Management: express-session and cookies

-----------------------------
Database Features:

- Views:
  - game_average_rating
  - GameReviews
  - CurrentRentals

- Procedures:
  - ReturnGame
  - GetAvailableGames
  - GetUserRentalHistory

- Triggers:
  - updateStockAfterRent
  - restoreStockAfterReturn
  - trg_check_review_rating

-----------------------------
How to Run:

1. Run MySQL and import the full SQL schema with triggers, views, procedures.
2. Start the backend with: node server.js
3. Open the frontend using Live Server on the "public" folder (port 5500).
4. Use the app from your browser (localhost:5500).

-----------------------------
Notes:

- Make sure to enable cookies and CORS for cross-origin session persistence.
- Some features like review submission or rental history are ready in SQL but not yet wired to frontend.
- Admin interface is accessible via admin.html.

-----------------------------
Demo Video:
user
https://reccloud.com/fr/u/0valueh
admin
https://reccloud.com/fr/u/4z6pofe
https://reccloud.com/fr/u/4z6pofe
