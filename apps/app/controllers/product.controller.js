const db = require("../models");
const HTTPrequest = require('request').defaults({ encoding: null });
const Product = db.products;
const CompositionDetail = db.compositionDetails;
const Composition = db.compositions;
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
    Product.findAll({ where: { id: ID_PRODUCT, storeId: ID_STORE },
        // include: [CompositionDetail]
        include: [{model: CompositionDetail, include: ["composition"] ,
         attributes:['compositionId', 'amount']}]
     })
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

// Crawl
exports.crawlReview = async (request, response, next) => {
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
                    var div_stop = 14
                    let pages_text = await page.evaluate(el => el.textContent, pages);
                    const found = pages_text.match(/[.]+/);
                    let last_page = 1
                    if (found != null){
                        last_page = pages_text.split(".").pop()
                    }else{
                        last_page = pages_text.slice(-1)
                    }
                    var testInt = parseInt(last_page)
                    if ( Number.isNaN(testInt) ){
                        div_stop = 15
                        await page.waitForXPath(PAGINATION.replace("14", 15));
                        let [pages] = await page.$x(PAGINATION.replace("14", 15));
                        let pages_text = await page.evaluate(el => el.textContent, pages);
                        const found = pages_text.match(/[.]+/);
                        if (found != null){
                            last_page = await pages_text.split(".").pop();
                        }else{
                            last_page = await pages_text.slice(-1);
                        }
                    }

                    let btn_place = await parseInt(last_page)
                    if( btn_place >= 9 ){
                        btn_place = 11;
                    }else{
                        btn_place +=2;
                    }

                    console.log(`Last page of ${URI} : ${last_page}`);
                    //@PageLimiter
                    if(last_page > 20){
                        last_page = 20
                        console.log(`Due limit of compile, page reduced to ${last_page}`)
                    }
                    //Loop based on page amount
                    for (let x = 1; x <= last_page; x++){
                        //Get Review
                        var review_block = await page.$x(REVIEW_BLOCK);
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
                        // console.log("Page: ", x);
                        if(x != last_page){
                            try{
                                await page.waitForXPath( NEXT.replace( "14", div_stop.toString())+"["+btn_place+"]" );
                                let [next_page] = await page.$x( NEXT.replace( "14", div_stop.toString())+"["+btn_place+"]" );
                                await next_page.click();
                                // await page.click(next_page[0]);
                            }catch (err) {
                                response.locals.crawlResult = result
                                FeatureReview(request,response,next);
                            }
                        }
                    }
                    response.locals.crawlResult = result
                    FeatureReview(request,response,next);
                    await browser.close();
                } catch (err) {
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


const FeatureReview = async function(request,response,next) {
    const crawl_result = await response.locals.crawlResult
    const model = await tf.loadLayersModel(process.env.MODEL_REVIEW);
    const word2indexjson = await fetch(process.env.W2I_REVIEW);
    word2index = await word2indexjson.json();
    const maxlen = 20;
    const vocab_size = 5000;
    const padding = 'post';
    const truncating = 'post';

    //concat all arrar list
    let arr = []
    arr = arr.concat(crawl_result['1']);
    arr = arr.concat(crawl_result['2']);
    arr = arr.concat(crawl_result['3']);
    arr = arr.concat(crawl_result['4']);
    arr = arr.concat(crawl_result['5']);

    //remove character except string and space, tolowercase and trim the string
    arr = arr.map(function(item) {
    item_ = item.replace(/[^a-zA-Z ]/g, " "); 
    item_ = item_.replace(/  +/g, ' '); 
    item_ = item_.toLowerCase();  
    return item_.trim(); 
    });

    //remove empity
    arr = arr.filter(function(e){ return e === 0 || e });
    //remove duplicate
    arr = [...new Set(arr)];
    //check cleaned string
    // console.log(arr)

    let result = {
        'negative' : [],
        'neutral' : [],
        'positive' : []
    }
    for (let i = 0; i < arr.length; i++) {
        let score = predict(arr[i].split(" "));
        if(score[0] >= score[1] && score[0] >= score[2]){
            result['negative'].push(arr[i]);
        }else if(score[1] >= score[2]){
            result['neutral'].push(arr[i]);
        }else{
            result['positive'].push(arr[i]);
        }
        console.log(score[0],score[1],score[2]);
    }


    function predict(inputText){

        const sequence = inputText.map(word => {
            let indexed = word2index[word];

            if (indexed === undefined){
                return 1; //change to oov value
            }
            return indexed;
        });

        const paddedSequence = padSequence([sequence], maxlen);
        console.log(paddedSequence);

        const score = tf.tidy(() => {
            const input = tf.tensor2d(paddedSequence, [1, maxlen]);
            const result = model.predict(input);
            return result.dataSync();
        });

        return score;

    }

    function padSequence(sequences, maxLen, padding='post', truncating = "post", pad_value = 0){
        return sequences.map(seq => {
            if (seq.length > maxLen) { //truncat
                if (truncating === 'pre'){
                    seq.splice(0, seq.length - maxLen);
                } else {
                    seq.splice(maxLen, seq.length - maxLen);
                }
            }

            if (seq.length < maxLen) {
                const pad = [];
                for (let i = 0; i < maxLen - seq.length; i++){
                    pad.push(pad_value);
                }
                if (padding === 'pre') {
                    seq = pad.concat(seq);
                } else {
                    seq = seq.concat(pad);
                }
            }
            return seq;
            });
    }
    // response.status(200).send(result);
    requestWordCloud(result, response)
}

//WordCloud
async function requestWordCloud(PredictResult, response) {
    new Promise( async function(resolve, reject) {
        const wc = await wordCloud(PredictResult,response);
        setTimeout(() => {
            const error = false;
            if (!error){
                resolve(wc);
            }else{
                reject("Something went wrong")
            }
        }, 10000)
    })
    .then((result)=>{
            PredictResult['image'] = result
            response.status(200).send(PredictResult);
        })
}

async function base64_encode(bitmap) {
    return new Buffer(bitmap).toString('base64');
}
async function wordCloud(json, response) {
    var wordCloud = {};
    for (const property in json) {
        // console.log(`${property}: ${PredictResult[property]}`);
        let phrase = await json[property].join(' ')
        var base64 = null
        new Promise(async function(resolve, reject) {
            HTTPrequest.post({
                "headers": {"content-type": "application/json"},
                "url": "https://quickchart.io/wordcloud",
                "body": JSON.stringify({
                "format": "png",
                "width": 600,
                "height": 600,
                "backgroundColor" : "white",
                "fontScale": 42,
                "scale": "linear",
                "removeStopwords": true,
                "minWordLength": 4,
                "colors" : ["black"],
                "text": phrase
                })
            }, async (err, res, body) =>{
                console.log(res.statusCode)
                if( err ){
                    return console.log(err.message);
                }
                base64 = await base64_encode(body);
                console.log("--converting image finished--")
                resolve();
                })
            })
            .then( async (result)=>{
                // response.status(200).send({message: result})
                // return wordCloud;
                wordCloud[property]= await base64;
            })
    }
    return wordCloud;
}