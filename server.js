const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const authRouter      = require('./routes/auth');
const scenariosRouter = require('./routes/scenarios');
const statsRouter     = require('./routes/stats');
const usersRouter     = require('./routes/users');

app.use('/api/auth',      authRouter);
app.use('/api/scenarios', scenariosRouter);
app.use('/api/stats',     statsRouter);
app.use('/api/users',     usersRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SafeDrive in ascolto su http://localhost:${PORT}`);
});