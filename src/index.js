const express = require('express');
const cors = require('cors');
const prisma = require('./db');

BigInt.prototype.toJSON = function() {
  return this.toString();
};

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/ratings', require('./routes/ratings'));
app.use('/api/users', require('./routes/users'));
app.use('/api/analytics', require('./routes/analytics'));
app.use(
  '/api/scenarios/books',
  require('./routes/bookScenario.routes')
);





app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Внутрішня помилка сервера',
    message: err.message 
  });
});


if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Сервер запущено на http://localhost:${PORT}`);
  });
}

module.exports = app;