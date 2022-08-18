const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const authenticationRoutes = require('./routes/authenticationRoutes');
const criteraRoutes = require('./routes/criteriaRoutes');
const emailRoutes = require('./routes/emailRoutes');

const deserializeUser = require('./middleware/deserializeUser');
const errorControllers = require('./middleware/error');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(deserializeUser);

app.use(cors({ credentials: true }));

app.use('/api/auth', authenticationRoutes);
app.use('/api', userRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/criteria', criteraRoutes);
app.use('/api/email/', emailRoutes);

app.get('/error', (req, res) => {
  res.status(404).send('Oops, not found!');
});

app.use(errorControllers.errorLogger);
app.use(errorControllers.errorResponder);
app.use(errorControllers.invalidPathHandler);

app.listen(PORT, () => {
  console.log(`Server listening at http://${process.env.HOST}:${PORT}`);
});
