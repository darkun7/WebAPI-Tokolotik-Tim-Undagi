const db = require("../models");
const Product = db.products;
const Op = db.Sequelize.Op;
// const crawl = require('../config/crawl');
const puppeteer = require('puppeteer')

// Create
exports.create = async (request, response) => {
    const product = {
        storeId : request.body.storeId ? request.body.storeId : response.locals.storeID,
        tokopediaProductId: request.body.tokopediaProductId,
        tokopediaProductUrl: request.body.tokopediaProductUrl ? request.body.tokopediaProductUrl : '',
        productName: request.body.productName,
        price: request.body.price,
        image: request.body.image ? request.body.image: '',
    }

    Product.create(product)
        .then((data) => {
            response.status(201).send(data);
        }).catch((err) => {
            response.status(500).send({
                message: "Gagal membuat produk",
                error: err.message
            });
        });
};

// Select All
exports.global = async (request, response) => {
    Product.findAll()
        .then((data) => {
            response.send(data);
        }).catch((err) => {
            response.status(500).send({
                message: "Gagal memperoleh produk",
                error: err.message
            });
        });
};

// Select All record from Store
exports.all = async (request, response) => {
    const storeId = request.body.storeId ? 
                    request.body.storeId : response.locals.ID;
    Product.findAll({ where: { storeId: storeId } })
        .then((data) => {
            response.send(data);
        }).catch((err) => {
            response.status(500).send({
                message: "Gagal memperoleh produk",
                error: err.message
            });
        });
};


// Find One
exports.findOne = (request, response) => {
    const ID = request.params.id ? 
               request.params.id : response.locals.productID;
    Product.findByPk(ID)
        .then((data) => {
            response.send(data);
        }).catch((err) => {
            response.status(500).send({
                message: `Gagal memperoleh data dengan ID: ${ID}`,
                error: err.message
            });
        });
};

// Find One, Product of
exports.findOneProductOfStore = (request, response) => {
    const ID_STORE = response.locals.storeID
    const ID_PRODUCT = response.locals.productID ? 
               response.locals.productID : request.params.id;
    Product.findAll({ where: { id: ID_PRODUCT, storeId: ID_STORE } })
        .then((data) => {
            response.send(data);
        }).catch((err) => {
            response.status(500).send({
                message: `Gagal memperoleh data dengan ID: ${ID_PRODUCT}`,
                error: err.message
            });
        });
};

// Update
exports.update = (request, response) => {
    const ID = request.params.id ? 
               request.params.id : response.locals.ID;
    Product.update(request.body, { where: { id: ID }})
        .then((result) => {
            if ( result == 1 ) {
                response.status(200).send({
                    message: "Informasi produk berhasil diperbarui"
                });
            } else {
                response.status(403).send({
                    message: `Gagal memperbarui data dengan ID: ${ID}`,
                    error: "Don't have access to do this action"
                })
            }
        }).catch((err) => {
            response.status(500).send({
                message: `Gagal memperbarui data dengan ID: ${ID}`,
                error: err.message
            })
        });
};

// Delete
exports.delete = (request, response) => {
    const ID = request.params.id ? 
               request.params.id : response.locals.ID;
    Product.destroy({ where: { id: ID } })
        .then((result) => {
            if (result == 1) {
                response.status(200).send({
                    message: "Produk berhasil dihapus"
                })
            } else {
                response.status(403).send({
                    message: `Gagal menghapus data dengan ID: ${ID}`,
                    error: "Don't have access to do this action"
                    
                })
            }})
        .catch((err) => {
            response.status(500).send({
                message: `Gagal menghapus data dengan ID: ${ID}`,
                error: err.message
            })
        });
};

// Crawl
exports.crawlReview = async (request, response, next) => {
    const ID = request.params.id;
    await Product.findByPk(ID)
        .then((data) => {
            response.locals.productURI = data.toJSON().tokopediaProductUrl
            if( response.locals.productURI == '' ){
                return response.status(403).send({
                        message: `Produk tidak terhubung dengan layanan Tokopedia`,
                        error: "Need to bind product by update product URL"
                    })
            }
            next()
        }).catch((err) => {
            response.status(500).send({
                message: `Gagal memperoleh data dengan ID: ${ID}`,
                error: err.message
            });
        }
    ),
    await puppeteer.launch().then(async function(browser) {
        const page = await browser.newPage();
        const iPhone = puppeteer.devices['iPhone X'];
        await page.setDefaultNavigationTimeout(0);
        await page.emulate(iPhone);
        await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36');
        try {
            await page.goto(response.locals.productURI, {waitUntil: 'networkidle0'});
            await page.evaluate(() => {
                window.scrollBy(0, 1000);

            });
            await page.screenshot({path: 'try.png'})
        } catch (err) {
            console.error(err);
            throw new Error('page.goto/waitForSelector timed out.');
        }
        
    });
}