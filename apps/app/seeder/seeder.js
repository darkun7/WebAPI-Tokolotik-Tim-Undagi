const router = require('express').Router();
const bcrypt = require("bcryptjs");

const db = require('../models');
const User = db.users;
const Store = db.stores;
const Product = db.products;
const Composition = db.compositions;
const CompositionDetail = db.compositionDetails;

router.get('/', async (request, response) => {
    const development = !!JSON.parse(String(process.env.DEVELOPMENT).toLowerCase());
    // Models
    if (development){
        db.sequelize.sync({ force: true });
    }
    //==USER==
    //User1 & Store1 @seller
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash("katasandi", salt);
    const user1 = await User.create({ 
        username: "CakIwan",
        email: "seller1@mail.com",
        password: hashPassword,
        role: "seller",
    })
    const store1 = await Store.create( {
        userId : user1.id,
        storeName : 'Ione store'
    });

    //User2 & Store2 @seller
    const user2 = await User.create({ 
        username: "Astwoty",
        email: "seller2@mail.com",
        password: hashPassword,
        role: "seller",
    })
    const store2 = await Store.create( {
        userId : user2.id,
        storeName : 'Astwoty Store'
    });

    //User3 @buyyer
    const user3 = await User.create({ 
        username: "Pengguna Buyer",
        email: "buyer1@mail.com",
        password: hashPassword,
        role: "seller",
    });

    //==Product==
    //@Store1
    const product1 = await Product.create({ 
        storeId : store1.id,
        tokopediaProductUrl: "https://www.tokopedia.com/camilancrispysri/keripik-bawang-yusri",
        productName: "Keripik Bawang Yusri",
        price: 12000,
        image: "https://images.tokopedia.net/img/cache/900/VqbcmM/2020/9/24/2063f91f-c694-489c-a5df-0cba88368338.jpg",
    });
    const product2 = await Product.create({ 
        storeId : store1.id,
        tokopediaProductUrl: "https://www.tokopedia.com/camilancrispysri/kering-kentang-pedas-manis",
        productName: "Keripik Kentang Pedas Manis",
        price: 50000,
        image: "https://images.tokopedia.net/img/cache/900/product-1/2020/9/2/14935629/14935629_d7d5b2e5-647b-4b19-866a-29f568d3e2ad_2048_2048",
    });
    const product3 = await Product.create({ 
        storeId : store1.id,
        tokopediaProductUrl: "https://www.tokopedia.com/camilancrispysri/kering-tempe-kacang-teri-medan-yu-sri-250gram",
        productName: "Keting Tempe Kacang Teri Medan Yu Sri",
        price: 30000,
        image: "https://images.tokopedia.net/img/cache/900/product-1/2020/9/3/14935629/14935629_cfa3802a-6dfa-41e4-8671-9ea19ebcebec_2048_2048",
    });
    //@Store2
    const product4 = await Product.create({ 
        storeId : store2.id,
        tokopediaProductUrl: "https://www.tokopedia.com/betawionlineshop/kembang-goyang-camilan-khas-betawi",
        productName: "Kembang Goyan Camilan Khas Betawi",
        price: 25000,
        image: "https://images.tokopedia.net/img/cache/900/VqbcmM/2021/4/20/aa32983c-6e3b-4b89-8e11-cc5d1970fad5.jpg",
    });
    const product5 = await Product.create({ 
        storeId : store2.id,
        tokopediaProductUrl: "https://www.tokopedia.com/betawionlineshop/camilan-akar-kelapa",
        productName: "Camilan Akar Kelapa",
        price: 25000,
        image: "https://images.tokopedia.net/img/cache/900/VqbcmM/2021/4/20/8cfc9a7e-a379-4e06-9f82-d0a0ca0629c7.jpg",
    });


    //==Composition
    //@Store1
    const Composition1 = await Composition.create({ 
        storeId : store1.id,
        compositionName: "Bawang",
        unit: "Item",
    });
    const Composition2 = await Composition.create({ 
        storeId : store1.id,
        compositionName: "Kentang",
        unit: "Ons",
    });
    const Composition3 = await Composition.create({ 
        storeId : store1.id,
        compositionName: "Tempe",
        unit: "Item",
    });
    const Composition4 = await Composition.create({ 
        storeId : store1.id,
        compositionName: "Cabai",
        unit: "Ons",
    });
    const Composition5 = await Composition.create({ 
        storeId : store1.id,
        compositionName: "Minyak",
        unit: "L",
    });

    //@store2
    const Composition6 = await Composition.create({ 
        storeId : store2.id,
        compositionName: "Akar Kelapa",
        unit: "Item",
    });
    const Composition7 = await Composition.create({ 
        storeId : store2.id,
        compositionName: "Minyak",
        unit: "L",
    });
    const Composition8 = await Composition.create({ 
        storeId : store2.id,
        compositionName: "Tepung",
        unit: "Kg",
    });
    const Composition9 = await Composition.create({ 
        storeId : store2.id,
        compositionName: "Gula",
        unit: "Kg",
    });
    //==CompositionDetail==
    //Store1
    const cd11 = await CompositionDetail.create({ 
        productId : product1.id,
        compositionId: Composition1.id,
        amount: 1,
    });
    const cd12 = await CompositionDetail.create({ 
        productId : product1.id,
        compositionId: Composition4.id,
        amount: 1,
    });
    const cd13 = await CompositionDetail.create({ 
        productId : product1.id,
        compositionId: Composition5.id,
        amount: 1,
    });

    const cd21 = await CompositionDetail.create({ 
        productId : product2.id,
        compositionId: Composition2.id,
        amount: 1,
    });
    const cd22 = await CompositionDetail.create({ 
        productId : product2.id,
        compositionId: Composition4.id,
        amount: 0.5,
    });
    const cd23 = await CompositionDetail.create({ 
        productId : product2.id,
        compositionId: Composition5.id,
        amount: 1,
    });

    const cd31 = await CompositionDetail.create({ 
        productId : product3.id,
        compositionId: Composition3.id,
        amount: 1,
    });
    const cd32 = await CompositionDetail.create({ 
        productId : product3.id,
        compositionId: Composition5.id,
        amount: 1,
    });
    //Store2
    const cd41 = await CompositionDetail.create({ 
        productId : product4.id,
        compositionId: Composition7.id,
        amount: 1,
    });
    const cd42 = await CompositionDetail.create({ 
        productId : product4.id,
        compositionId: Composition8.id,
        amount: 1,
    });
    const cd43 = await CompositionDetail.create({ 
        productId : product4.id,
        compositionId: Composition9.id,
        amount: 1,
    });

    const cd51 = await CompositionDetail.create({ 
        productId : product5.id,
        compositionId: Composition6.id,
        amount: 0.25,
    });
    const cd52 = await CompositionDetail.create({ 
        productId : product5.id,
        compositionId: Composition8.id,
        amount: 1,
    });

    response.status(200).send({message:"Seed successfully"})
});

module.exports = router;