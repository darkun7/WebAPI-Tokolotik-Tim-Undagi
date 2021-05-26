const router = require('express').Router();
const rand = require('random')
const db = require('../models');
const Transaction = db.transactions;

router.get('/transactions', async (request, response) => {
    //==Transaction==
    //i = productId
    for (let i = 1; i <= 5; i++){
        let storeId = 1;
        if(i>3){
            storeId = 2;
        }
        for (let y = 2015; y <= 2020 ; y++) {
            for (let m= 1; m <= 12; m++ ){
                let month = m.toString()
                if (m<10) {
                    month = "0"+m.toString()
                    let d = rand.int(1, 27).toString()
                        for (d; d < (27); d++) {
                        var record = rand.int(5, 12);
                        for (let j = 1; j <= record; j++){
                            await Transaction.create({
                                storeId: storeId,
                                productId : i,
                                time: y+"-0"+j.toString()+"-"+d.toString(),
                                amount: rand.int(25, 125)
                            });   
                        }
                    }
                }
            }
        }
    }  
    response.status(200).send({message:"Seed Transaction successfully"})
});

module.exports = router;