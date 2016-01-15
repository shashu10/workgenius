angular.module('workgenius.constants', [])

.constant('fakeShifts', [
      {
        company: 'Luxe', date: "2016-01-15",
        startsAt: new Date("January 14, 2016 12:00:00"),
        endsAt: new Date("January 14, 2016 15:30:00"),
      },
      {
        company: 'Caviar', date: "2016-01-16",
        startsAt: new Date("January 15, 2016 8:00:00"),
        endsAt: new Date("January 15, 2016 11:00:00"),
      },
      {
        company: 'Instacart', date: "2016-01-17",
        startsAt: new Date("January 16, 2016 07:00:00"),
        endsAt: new Date("January 16, 2016 10:00:00"),
      },
      {
        company: 'Luxe', date: "2016-01-17",
        startsAt: new Date("January 16, 2016 11:00:00"),
        endsAt: new Date("January 16, 2016 14:00:00"),
      },
      {
        company: 'Caviar', date: "2016-01-19",
        startsAt: new Date("January 18, 2016 12:00:00"),
        endsAt: new Date("January 18, 2016 16:00:00"),
      },
      {
        company: 'Luxe', date: "2016-02-05",
        startsAt: new Date("February 5, 2016 8:00:00"),
        endsAt: new Date("February 5, 2016 11:30:00"),
      },
      {
        company: 'Instacart', date: "2016-02-13",
        startsAt: new Date("February 12, 2016 07:00:00"),
        endsAt: new Date("February 12, 2016 10:00:00"),
      },
      {
        company: 'Caviar', date: "2016-02-13",
        startsAt: new Date("February 12, 2016 11:00:00"),
        endsAt: new Date("February 12, 2016 14:00:00"),
      },
    ])

.constant('companies', [{
        name: 'instacart',
        description: "Instacart is an on-demand grocery delivery company. The job consists of purchasing, packing and delivering groceries."
    }, {
        name: 'saucey',
        description: "Saucey is an on-demand Alcohol and tobacco delivery service. Drivers must be over 21 and have exceptional people skills."
    }, {
        name: 'bento',
        description: "Bento is an on-demand delivery startup for delicious Asian meals. The job involves delivering meals from our kitchens."
    }, {
        name: 'shyp',
        description: "Shyp is an on-demand . Must be able to package and handle items with care and have great people skills."
    }, {
        name: 'caviar',
        description: "Caviar is a restaurant delivery services for individuals and businesses. Must have a customer-service mentality."
    }, {
        name: 'luxe',
        description: "Luxe is an on-demand parkign service. Drive cars to and from garages to drivers. A valid license is required."
    }, {
        name: 'sprig',
        description: "Sprig is an on-demand organic and locally sourced meal delivery service. Deliver meals from our kitchens to customers."
    }, {
        name: 'munchery',
        description: "Munchery is an on-demand food delivery service that hires world class chefs to prepare meals. A bike is required."
    }, {
        name: 'doordash',
        description: "DoorDash is an on-demand restaurant delivery service. Pick up food items and deliver them to customers efficiently."
    }, ])

.constant('workTypes', 
    [{
        name: 'Meal',
        title: 'Meal Delivery',
        icon: "ion-pizza",
        requirements: ['car', 'bike', '18+'],
        companies: [{
                name: 'caviar',
                available: true,
                info: 'Description',
                longInfo: 'Deliver food from local restaurants'
            }, {
                name: 'bento',
                available: true,
                info: 'Description',
                longInfo: 'Assemble and deliver asian Bento boxes'
            }, {
                name: 'munchery',
                available: false,
                info: 'Description',
                longInfo: 'Deliver meals cooked by Munchery\'s own chefs'
            }, {
                name: 'doordash',
                available: false,
                info: 'Description',
                longInfo: 'Deliver from local restaurants'
            }, {
                name: 'sprig',
                available: false,
                info: 'Description',
                longInfo: 'Healthy food delivered from Sprig\'s own chefs'
            }, {
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
        companies: [{
            name: 'instacart',
            available: true,
            info: 'Description',
            longInfo: 'Buy, pack and delkiver groceries to customers from various grocery stores'
        }, {
            name: 'good_eggs',
            available: false,
            info: 'Description',
            longInfo: 'Deliver groceries from local producers to customers'
        }, {
            name: 'amazon_fresh',
            available: false,
            info: 'Description',
            longInfo: 'Deliver groceries and household items to customers'
        }, {
            name: 'google_express',
            available: false,
            info: 'Description',
            longInfo: 'Deliver groceries and household items to customers'
        }, ]
    }, {
        name: 'Alcohol',
        title: 'Alcohol Delivery',
        icon: "ion-beer",
        requirements: ['car', 'bike', '18+'],
        companies: [{
            name: 'saucey',
            available: true,
            info: 'Description',
            longInfo: 'Deliver alcohol, tobacco and snacks to thirsty customers. It\'s always 5pm!'
        }, {
            name: 'thirstie',
            available: false,
            info: 'Description',
            longInfo: 'Deliver alcohol to thirsty customers'
        }, {
            name: 'swill',
            available: false,
            info: 'Description',
            longInfo: 'Deliver alcohol to thirsty customers'
        }, ]
    }, {
        name: 'Package',
        title: 'Package Delivery',
        icon: "ion-cube",
        requirements: ['car', 'bike', '18+'],
        companies: [{
            name: 'shyp',
            available: true,
            info: 'Description',
            longInfo: 'Pickup packages from customers'
        }, {
            name: 'doorman',
            available: false,
            info: 'Description',
            longInfo: 'Deliver packages to customers'
        }, ]
    }, {
        name: 'Valet',
        title: 'Valet Services',
        icon: "ion-key",
        requirements: ['car', 'bike', '18+'],
        companies: [{
            name: 'luxe',
            available: true,
            info: 'Description',
            longInfo: 'Meet customers curb side, park their cars and deliver it back when requested'
        }, {
            name: 'zirx',
            available: false,
            info: 'Description',
            longInfo: 'Meet customers curb side, park their cars and deliver it back when requested'
        }, ]
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
