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
db.sequelize.sync({ force: development });


//Import Routes
const authRoute = require('./app/routes/auth');
const productRoute = require('./app/routes/product');

app.use('/api/user',authRoute);
app.use('/api/product',productRoute);

app.get("/", (request, response) => {
    response.json({ message: "API TokoLitik" });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server Running Perfectly! 😎 \n Running on port: ${PORT}`));