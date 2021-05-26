const express = require('express');
const path = require('path');
const env = require('dotenv');
// const cors = require("cors");

const app = express();

// View
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static('./public'));

app.use(express.json());
app.use(express.urlencoded({
      extended: true
    }));
env.config();
const development = !!JSON.parse(String(process.env.DEVELOPMENT).toLowerCase());

// Models
const db = require('./app/models');
if (development){
    db.sequelize.sync({ force: true });
}


//Import Routes
const authRoute = require('./app/routes/auth');
const userRoute = require('./app/routes/user/user');
const userStoreRoute = require('./app/routes/user/store');
const userStoreProductRoute = require('./app/routes/user/store/product');
const compositionProductRoute = require('./app/routes/user/store/composition');
const compositionDetailRoute = require('./app/routes/user/store/compositionDetail');
const transactionRoute = require('./app/routes/user/store/transaction');

const storeRoute = require('./app/routes/store');
const productRoute = require('./app/routes/product');

const dbSeeder = require('./app/seeder/seeder');
const dbSeederTransaction = require('./app/seeder/transaction');

app.use('/api/users',authRoute);
app.use('/api/users',userRoute);
app.use('/api/users/stores',userStoreRoute);
app.use('/api/users/stores/products',userStoreProductRoute);
app.use('/api/users/stores/compositions',compositionProductRoute);
app.use('/api/users/stores/products',compositionDetailRoute);
app.use('/api/users/stores',transactionRoute);

app.use('/api/stores',storeRoute);
app.use('/api/products',productRoute);

app.use('/dev/refresh',dbSeeder);
app.use('/dev/refresh',dbSeederTransaction);

app.get("/", (request, response) => {
    response.render('pages/index', { title: "API TokoLitik" });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server Running Perfectly! 😎 \n Running on http://localhost:${PORT}`));