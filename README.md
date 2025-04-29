À foutre à la fin du deliverable 3:
Trigger to auto-update game status when overdue:
CREATE TRIGGER markOverdueRentals
AFTER UPDATE ON rent
FOR EACH ROW
BEGIN
  IF NEW.DueDate < CURRENT_DATE() AND NEW.status = 'ongoing' THEN
    UPDATE rent
    SET status = 'overdue'
    WHERE gameid = NEW.gameid AND UserId = NEW.UserId;
  END IF;
END;



Procedure to rent a game easily:
DELIMITER $$

CREATE PROCEDURE RentGame(
    IN p_gameid VARCHAR(50),
    IN p_userid VARCHAR(50),
    IN p_rentalDate DATE,
    IN p_dueDate DATE
)
BEGIN
  INSERT INTO rent (gameid, DueDate, status, rentalDate, UserId)
  VALUES (p_gameid, p_dueDate, 'ongoing', p_rentalDate, p_userid);

  UPDATE game
  SET stock = stock - 1
  WHERE gameid = p_gameid;
END$$

DELIMITER ;


View showing available games with details:
CREATE VIEW AvailableGamesDetails AS
SELECT 
    game.title, 
    game.description, 
    game.stock, 
    game.yearOfPublication,
    game.minplayers,
    game.maxplayers,
    game.minplaytime,
    game.maxplaytime
FROM game
WHERE game.stock > 0;


Indexes:

-- Index for fast lookup by gameid in rent table
CREATE INDEX idx_rent_gameid ON rent(gameid);

-- Index for fast lookup by UserId in rent table (for rental history)
CREATE INDEX idx_rent_userid ON rent(UserId);

-- Index for faster search by title in game table (common in searches)
CREATE INDEX idx_game_title ON game(title);
