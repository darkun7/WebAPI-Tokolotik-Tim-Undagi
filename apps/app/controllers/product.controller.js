const db = require("../models");
const Product = db.products;
const Op = db.Sequelize.Op;
const puppeteer = require('puppeteer')
const tf = require('@tensorflow/tfjs');
const fetch = require('node-fetch');

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
                    request.body.storeId : response.locals.storeID;
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
               request.params.id : response.locals.storeID;
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

exports.testPredict = async (request, response) => {
    const crawl_result = {
        "1": [],
        "2": [],
        "3": [
            "Kripik bawang nya enak , sayang nya hancur aja, mungkin perlu dipikirkan kemasan dan cara pengirimannya"
        ],
        "4": [],
        "5": [
            "enak. renyah.",
            "",
            "Trmksh, paket sdah diterima dg baik.",
            "⭐️⭐️⭐️⭐️⭐️",
            "mantap pokonya mah... ",
            "gak cukup 2 plastik.. pingin lagi n lagi",
            "Renyah dan tidak berminyak.",
            "Enak, gurih..  pokoknya manteeb bngt deh, mks sis",
            ""
        ]
    }
    const model = await tf.loadLayersModel(process.env.MODEL_REVIEW);
    const word2indexjson = await fetch(process.env.W2I_REVIEW);
    word2index = await word2indexjson.json();
    const input = tf.tensor2d([[65, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]);
    const result = model.predict(input);
    response.status(200).send({message:result.dataSync()});
    console.log( result.dataSync());
}

// Crawl
exports.crawlReview = async (request, response) => {
    const ID = request.params.id;
    await Product.findByPk(ID)
        .then(async (data) => {
            response.locals.productURI = data.toJSON().tokopediaProductUrl
            if( response.locals.productURI == '' ){
                return response.status(403).send({
                        message: `Produk tidak terhubung dengan layanan Tokopedia`,
                        error: "Need to bind product by update product URL"
                    })
            }
            // next()
            await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
                })
                .then(async function(browser) {
                const URI            = response.locals.productURI
                const PAGINATION     = process.env.TOPED_PAGINATION
                const NEXT           = process.env.TOPED_PAGINATION_NEXT
                const REVIEW_BLOCK   = process.env.TOPED_REVIEW_BLOCK
        
                let result = {
                    '1': [],
                    '2': [],
                    '3': [],
                    '4': [],
                    '5': []
                };
        
                const page = await browser.newPage();
                const iPhone = puppeteer.devices['iPhone X'];
                await page.setDefaultNavigationTimeout(0);
                await page.emulate(iPhone);
                await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36');
                try {
                    await page.goto(URI, {waitUntil: 'networkidle0'});
                    await page.evaluate(async() => {
                        window.scrollBy(0, 1000);
                    });
                    //Pagination
                    await page.waitForXPath(PAGINATION);
                    let [pages] = await page.$x(PAGINATION);
                    let pages_text = await page.evaluate(el => el.textContent, pages);
                    const found = pages_text.match(/[.]+/);
                    let last_page = 1
                    if (found != null){
                        last_page = pages_text.split(".").pop()
                    }else{
                        last_page = pages_text.slice(-1)
                    }
                    console.log(`Last page of ${URI} : ${last_page}`);
                    //Loop based on page amount
                    for (let x = 1; x <= last_page; x++){
                        //Get Review
                        let review_block = await page.$x(REVIEW_BLOCK);
                        for (let i = 0; i < review_block.length; i++) {
                            review_element = await page.evaluate(el => el.innerHTML , review_block[i]); //REVIEW BLOCK
                            review = await review_element.match(/<span>(.*?)<\/span>/);
        
                            if(review != null && review[0] != ""){
                                review = review[0].replace(/<\/?span[^>]*>/g,"");
                                review = review.replace(/<br\s*\/?>/gi,' '); //REVIEW
                                rating = review_element.match(/icnGivenRatingFilter[0-9]+-[1-5]/);
                                rating = rating[0].slice(-1); //RATING
                                result[rating].push(review);
                            }
                        }
                        console.log("Page: ",x);
                        if(x != last_page){
                            try{
                                await page.waitForXPath(NEXT);
                                let [next_page] = await page.$x(NEXT);
                                await page.click(next_page[0]);
                            }catch (err) {
                                response.status(200).send(result);
                            }
                        }
                    }
                    console.log(result);
                } catch (err) {
                    console.error(err);
                    throw new Error('page.goto/waitForSelector timed out.');
                }
                // Reference: https://github.com/H4rfu1/ML-project-TokoLitik-tim-Undagi/blob/main/Response/CrawlToped.ipynb
            });
        }).catch((err) => {
            response.status(500).send({
                message: `Gagal memperoleh data dengan ID: ${ID}`,
                error: err.message
            });
        }
    )}
