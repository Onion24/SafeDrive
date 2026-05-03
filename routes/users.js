const express = require("express");
const router = express.Router();
const db = require("../db/database");

// GET /api/users/classifica — top 10 punteggi globali
router.get("/classifica", (req, res) => {
  const classifica = db
    .prepare(
      `
    SELECT u.username,
           SUM(s.punti) AS totale_punti,
           COUNT(s.id)  AS sessioni
    FROM scores s
    JOIN users u ON s.user_id = u.id
    GROUP BY u.id
    ORDER BY totale_punti DESC
    LIMIT 10
  `,
    )
    .all();

  res.json(classifica);
});

module.exports = router;
