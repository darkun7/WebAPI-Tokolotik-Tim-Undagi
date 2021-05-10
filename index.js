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
const productRoute = require('./app/routes/product');
const storeRoute = require('./app/routes/store');

app.use('/api/users',authRoute);
app.use('/api/stores',storeRoute);
app.use('/api/products',productRoute);

app.get("/", (request, response) => {
    response.json({ message: "API TokoLitik" });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server Running Perfectly! 😎 \n Running on port: ${PORT}`));