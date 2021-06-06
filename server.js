const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

// Import Swagger
const swaggerUi = require('swagger-ui-express'),
  swaggerDocument = require('./swagger.json');

// Import Router
const authRouter = require('./routes/auth');
const categoryRouter = require('./routes/categories');
const genderRouter = require('./routes/genders');
const productRouter = require('./routes/products');
const orderRouter = require('./routes/orders');
const usersRouter = require('./routes/users');
const customizeRouter = require('./routes/customize');

// Import Auth middleware
const { loginCheck } = require('./middleware/auth');

// Database Connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() =>
    console.log(
      '==============Mongodb Database Connected Successfully=============='
    )
  )
  .catch((err) => console.log(err + 'Database Not Connected !!!'));

// Middleware
var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(morgan('dev'));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.use('/api', authRouter);
app.use('/api/user', usersRouter);
app.use('/api/category', categoryRouter);
app.use('/api/gender', genderRouter);
app.use('/api/product', productRouter);
app.use('/api/order', orderRouter);
app.use('/api/customize', customizeRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) =>
  res.status(200).send('welcome to My-app-backend API !')
);

// Run Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log('Server is running on ', PORT);
});
