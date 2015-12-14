angular.module('workgenius.constants', [])

.constant('workTypes', 
	[{
        name: 'Meal',
        title: 'Meal Delivery',
        icon: "ion-pizza",
        requirements: ['car', 'bike', '18+'],
        companies: [
            {
                name: 'caviar',
                available: true,
                info: 'Description',
                longInfo: 'Deliver food from local restaurants'
            },
            {
                name: 'bento',
                available: true,
                info: 'Description',
                longInfo: 'Assemble and deliver asian Bento boxes'
            },
            {
                name: 'munchery',
                available: false,
                info: 'Description',
                longInfo: 'Deliver meals cooked by Munchery\'s own chefs'
            },
            {
                name: 'doordash',
                available: false,
                info: 'Description',
                longInfo: 'Deliver from local restaurants'
            },
            {
                name: 'sprig',
                available: false,
                info: 'Description',
                longInfo: 'Healthy food delivered from Sprig\'s own chefs'
            },
            {
                name: 'spoonrocket',
                available: false,
                info: 'Description',
                longInfo: 'Chef cooked meals delivered in under 20 minutes'
            },
            // {
            //   name: 'postmates',
            //   available: false,
            //   info: 'Description',
            //   longInfo: 'Deliver mostly food but also other items for poeple around the city'
            // },
        ]
    }, {
        name: 'Grocery',
        title: 'Grocery Delivery',
        icon: "ion-ios-nutrition",
        requirements: ['car', 'bike', '18+'],
        companies: [
            {
                name: 'instacart',
                available: true,
                info: 'Description',
                longInfo: 'Buy, pack and delkiver groceries to customers from various grocery stores'
            },
            {
                name: 'good_eggs',
                available: false,
                info: 'Description',
                longInfo: 'Deliver groceries from local producers to customers'
            },
            {
                name: 'amazon_fresh',
                available: false,
                info: 'Description',
                longInfo: 'Deliver groceries and household items to customers'
            },
            {
                name: 'google_express',
                available: false,
                info: 'Description',
                longInfo: 'Deliver groceries and household items to customers'
            },
        ]
    }, {
        name: 'Alcohol',
        title: 'Alcohol Delivery',
        icon: "ion-beer",
        requirements: ['car', 'bike', '18+'],
        companies: [
            {
                name: 'saucey',
                available: true,
                info: 'Description',
                longInfo: 'Deliver alsohol, tobacco and snacks to thirsty customers. It\'s always 5pm!'
            },
            {
                name: 'thirstie',
                available: false,
                info: 'Description',
                longInfo: 'Deliver alcohol to thirsty customers'
            },
            {
                name: 'swill',
                available: false,
                info: 'Description',
                longInfo: 'Deliver alcohol to thirsty customers'
            },
        ]
    }, {
        name: 'Package',
        title: 'Package Delivery',
        icon: "ion-cube",
        requirements: ['car', 'bike', '18+'],
        companies: [
            {
                name: 'shyp',
                available: true,
                info: 'Description',
                longInfo: 'Pickup packages from customers'
            },
            {
                name: 'doorman',
                available: false,
                info: 'Description',
                longInfo: 'Deliver packages to customers'
            },
        ]
    }, {
        name: 'Valet',
        title: 'Valet Services',
        icon: "ion-key",
        requirements: ['car', 'bike', '18+'],
        companies: [
            {
                name: 'luxe',
                available: true,
                info: 'Description',
                longInfo: 'Meet customers curb side, park their cars and deliver it back when requested'
            },
            {
                name: 'zirx',
                available: false,
                info: 'Description',
                longInfo: 'Meet customers curb side, park their cars and deliver it back when requested'
            },
        ]
    },
    // {
    //     name: 'Rideshare',
    //     title: 'Ridesharing Jobs',
    //     icon: "ion-android-car",
    //     requirements: ['car', 'bike', '18+'],
    //     companies: [
    //         {
    //             name: 'lyft',
    //             available: true,
    //             info: 'Description',
    //             longInfo: 'Drive people to their desired destinations'
    //         },
    //         {
    //             name: 'uber',
    //             available: false,
    //             info: 'Description',
    //             longInfo: 'Drive people to their desired destinations'
    //         },
    //         {
    //             name: 'sidecar',
    //             available: false,
    //             info: 'Description',
    //             longInfo: 'Help small businesses deliver their goods to their customers'
    //         },
    //         {
    //             name: 'carma',
    //             available: false,
    //             info: 'Description',
    //             longInfo: 'Drive your neighbors to their work place through carpooling'
    //         },
    //     ]
    // },
    // {
    //   name:'Marijuana',
    //   title: 'Medical Marijuana Delivery',
    //   icon: "ion-ios-flower-outline",
    //   requirements : ['car', 'bike', '18+'],
    //   companies: [
    //     {
    //       name: 'meadow',
    //       available: false,
    //       info: 'Description',
    //       longInfo: 'Deliver medical marijuana to patients'
    //     },
    //     {
    //       name: 'eaze',
    //       available: false,
    //       info: 'Description',
    //       longInfo: 'Deliver medical marijuana to patients'
    //     },
    //     {
    //       name: 'nugg',
    //       available: false,
    //       info: 'Description',
    //       longInfo: 'Deliver medical marijuana to patients'
    //     },
    //   ]
    // },
    // {
    //   name:'Pharmacy',
    //   icon: "ion-medkit",
    //   requirements : ['car', 'bike', '18+'],
    //   companies: [
    //
    //   ]
    // }
	]);
