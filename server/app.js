const express = require('express');
const cors = require('cors');
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const loanRoutes = require('./routes/loanRoutes');
const simulatorRoutes = require('./routes/simulatorRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/loan', loanRoutes);
app.use('/api/simulator', simulatorRoutes);
app.use('/api/marketplace', marketplaceRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
