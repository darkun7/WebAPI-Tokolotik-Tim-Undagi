const express = require('express');
const env = require('dotenv');
// const cors = require("cors");

const app = express();
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
const userStoreRoute = require('./app/routes/user/store');
const storeProductRoute = require('./app/routes/user/store/product');
const compositionProductRoute = require('./app/routes/user/store/composition');
const compositionDetailRoute = require('./app/routes/user/store/compositionDetail');

// const productRoute = require('./app/routes/product');
// const storeRoute = require('./app/routes/store');

app.use('/api/users',authRoute);
app.use('/api/users/stores',userStoreRoute);
app.use('/api/users/stores/products',storeProductRoute);
app.use('/api/users/stores/compositions',compositionProductRoute);
app.use('/api/users/stores/products',compositionDetailRoute);

// app.use('/api/stores',storeRoute);
// app.use('/api/products',productRoute);

app.get("/", (request, response) => {
    response.json({ message: "API TokoLitik" });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server Running Perfectly! 😎 \n Running on port: ${PORT}`));