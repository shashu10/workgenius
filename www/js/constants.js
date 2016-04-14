angular.module('workgenius.constants', [])

.constant('fakeAvailableShifts', [{
        startsAt: moment({hour: 6}).add(0, 'days').toDate(),
        endsAt: moment({hour: 8}).add(0, 'days').toDate(),
        company: "postmates",
        location: "san Francisco"
    }, {
        startsAt: moment({hour: 7}).add(0, 'days').toDate(),
        endsAt: moment({hour: 11}).add(0, 'days').toDate(),
        company: "doordash",
        location: "san Francisco"
    }, {
        startsAt: moment({hour: 10}).add(0, 'days').toDate(),
        endsAt: moment({hour: 8}).add(0, 'days').toDate(),
        company: "luxe",
        location: "san Francisco"
    }, {
        startsAt: moment({hour: 11}).add(0, 'days').toDate(),
        endsAt: moment({hour: 14}).add(0, 'days').toDate(),
        company: "sprig",
        location: "san Francisco"
    }, {
        startsAt: moment({hour: 16}).add(0, 'days').toDate(),
        endsAt: moment({hour: 19}).add(0, 'days').toDate(),
        company: "luxe",
        location: "san Francisco"
    }, {
        startsAt: moment({hour: 17}).add(0, 'days').toDate(),
        endsAt: moment({hour: 20}).add(0, 'days').toDate(),
        company: "postmates",
        location: "san Francisco"
    }, {
        startsAt: moment({hour: 18}).add(0, 'days').toDate(),
        endsAt: moment({hour: 21}).add(0, 'days').toDate(),
        company: "sprig",
        location: "san Francisco"
    }, {
        startsAt: moment({hour: 6}).add(1, 'days').toDate(),
        endsAt: moment({hour: 8}).add(1, 'days').toDate(),
        company: "luxe",
        location: "san Francisco"
    }, {
        startsAt: moment({hour: 7}).add(1, 'days').toDate(),
        endsAt: moment({hour: 11}).add(1, 'days').toDate(),
        company: "doordash",
        location: "san Francisco"
    }, {
        startsAt: moment({hour: 10}).add(1, 'days').toDate(),
        endsAt: moment({hour: 8}).add(1, 'days').toDate(),
        company: "sprig",
        location: "san Francisco"
    }, {
        startsAt: moment({hour: 11}).add(1, 'days').toDate(),
        endsAt: moment({hour: 14}).add(1, 'days').toDate(),
        company: "sprig",
        location: "san Francisco"
    }, {
        startsAt: moment({hour: 16}).add(1, 'days').toDate(),
        endsAt: moment({hour: 19}).add(1, 'days').toDate(),
        company: "doordash",
        location: "san Francisco"
    }, {
        startsAt: moment({hour: 18}).add(1, 'days').toDate(),
        endsAt: moment({hour: 21}).add(1, 'days').toDate(),
        company: "postmates",
        location: "san Francisco"
    }, {
        startsAt: moment({hour: 6}).add(2, 'days').toDate(),
        endsAt: moment({hour: 8}).add(2, 'days').toDate(),
        company: "luxe",
        location: "san Francisco"
    }, {
        startsAt: moment({hour: 7}).add(2, 'days').toDate(),
        endsAt: moment({hour: 11}).add(2, 'days').toDate(),
        company: "sprig",
        location: "san Francisco"
    }, {
        startsAt: moment({hour: 10}).add(2, 'days').toDate(),
        endsAt: moment({hour: 8}).add(2, 'days').toDate(),
        company: "doordash",
        location: "san Francisco"
    }, {
        startsAt: moment({hour: 11}).add(2, 'days').toDate(),
        endsAt: moment({hour: 14}).add(2, 'days').toDate(),
        company: "postmates",
        location: "san Francisco"
    }, {
        startsAt: moment({hour: 16}).add(2, 'days').toDate(),
        endsAt: moment({hour: 19}).add(2, 'days').toDate(),
        company: "doordash",
        location: "san Francisco"
    }, {
        startsAt: moment({hour: 18}).add(2, 'days').toDate(),
        endsAt: moment({hour: 21}).add(2, 'days').toDate(),
        company: "sprig",
        location: "san Francisco"
    }, {
        startsAt: moment({hour: 6}).add(3, 'days').toDate(),
        endsAt: moment({hour: 8}).add(3, 'days').toDate(),
        company: "luxe",
        location: "san Francisco"
    }, {
        startsAt: moment({hour: 7}).add(3, 'days').toDate(),
        endsAt: moment({hour: 11}).add(3, 'days').toDate(),
        company: "doordash",
        location: "san Francisco"
    }, {
        startsAt: moment({hour: 10}).add(3, 'days').toDate(),
        endsAt: moment({hour: 8}).add(3, 'days').toDate(),
        company: "sprig",
        location: "san Francisco"
    }, {
        startsAt: moment({hour: 11}).add(3, 'days').toDate(),
        endsAt: moment({hour: 14}).add(3, 'days').toDate(),
        company: "sprig",
        location: "san Francisco"
    }, {
        startsAt: moment({hour: 16}).add(3, 'days').toDate(),
        endsAt: moment({hour: 19}).add(3, 'days').toDate(),
        company: "sprig",
        location: "san Francisco"
    }, {
        startsAt: moment({hour: 18}).add(3, 'days').toDate(),
        endsAt: moment({hour: 21}).add(3, 'days').toDate(),
        company: "sprig",
        location: "san Francisco"
    }, {
        startsAt: moment({hour: 6}).add(4, 'days').toDate(),
        endsAt: moment({hour: 8}).add(4, 'days').toDate(),
        company: "luxe",
        location: "san Francisco"
    }, {
        startsAt: moment({hour: 7}).add(4, 'days').toDate(),
        endsAt: moment({hour: 11}).add(4, 'days').toDate(),
        company: "sprig",
        location: "san Francisco"
    }, {
        startsAt: moment({hour: 10}).add(4, 'days').toDate(),
        endsAt: moment({hour: 8}).add(4, 'days').toDate(),
        company: "sprig",
        location: "san Francisco"
    }, {
        startsAt: moment({hour: 11}).add(4, 'days').toDate(),
        endsAt: moment({hour: 14}).add(4, 'days').toDate(),
        company: "postmates",
        location: "san Francisco"
    }, {
        startsAt: moment({hour: 16}).add(4, 'days').toDate(),
        endsAt: moment({hour: 19}).add(4, 'days').toDate(),
        company: "doordash",
        location: "san Francisco"
    }, {
        startsAt: moment({hour: 18}).add(4, 'days').toDate(),
        endsAt: moment({hour: 21}).add(4, 'days').toDate(),
        company: "sprig",
        location: "san Francisco"
    }, {
        startsAt: moment({hour: 6}).add(5, 'days').toDate(),
        endsAt: moment({hour: 8}).add(5, 'days').toDate(),
        company: "sprig",
        location: "san Francisco"
    }, {
        startsAt: moment({hour: 7}).add(5, 'days').toDate(),
        endsAt: moment({hour: 11}).add(5, 'days').toDate(),
        company: "luxe",
        location: "san Francisco"
    }, {
        startsAt: moment({hour: 10}).add(5, 'days').toDate(),
        endsAt: moment({hour: 8}).add(5, 'days').toDate(),
        company: "sprig",
        location: "san Francisco"
    }, {
        startsAt: moment({hour: 11}).add(5, 'days').toDate(),
        endsAt: moment({hour: 14}).add(5, 'days').toDate(),
        company: "sprig",
        location: "san Francisco"
    }, {
        startsAt: moment({hour: 16}).add(5, 'days').toDate(),
        endsAt: moment({hour: 19}).add(5, 'days').toDate(),
        company: "sprig",
        location: "san Francisco"
    }, {
        startsAt: moment({hour: 18}).add(5, 'days').toDate(),
        endsAt: moment({hour: 21}).add(5, 'days').toDate(),
        company: "luxe",
        location: "san Francisco"
    }, {
        startsAt: moment({hour: 19}).add(5, 'days').toDate(),
        endsAt: moment({hour: 22}).add(5, 'days').toDate(),
        company: "sprig",
        location: "san Francisco"
    }, {
        startsAt: moment({hour: 6}).add(6, 'days').toDate(),
        endsAt: moment({hour: 8}).add(6, 'days').toDate(),
        company: "doordash",
        location: "san Francisco"
    }, {
        startsAt: moment({hour: 7}).add(6, 'days').toDate(),
        endsAt: moment({hour: 11}).add(6, 'days').toDate(),
        company: "doordash",
        location: "san Francisco"
    }, {
        startsAt: moment({hour: 10}).add(6, 'days').toDate(),
        endsAt: moment({hour: 8}).add(6, 'days').toDate(),
        company: "doordash",
        location: "san Francisco"
    }, {
        startsAt: moment({hour: 11}).add(6, 'days').toDate(),
        endsAt: moment({hour: 14}).add(6, 'days').toDate(),
        company: "luxe",
        location: "san Francisco"
    }, {
        startsAt: moment({hour: 16}).add(6, 'days').toDate(),
        endsAt: moment({hour: 19}).add(6, 'days').toDate(),
        company: "doordash",
        location: "san Francisco"
    }, {
        startsAt: moment({hour: 18}).add(6, 'days').toDate(),
        endsAt: moment({hour: 21}).add(6, 'days').toDate(),
        company: "postmates",
        location: "san Francisco"
    }
])
.constant('fakeShifts', [
      {
        company: 'Luxe', date: moment(0, "HH").add(1, 'day').toDate(),
        startsAt: moment(12, "HH").add(1, 'days').toDate(),
        endsAt: moment(14, "HH").add(1, 'days').toDate(),
      },
      {
        company: 'Instacart', date: moment(0, "HH").add(2, 'days').toDate(),
        startsAt: moment(07, "HH").add(2, 'days').toDate(),
        endsAt: moment(10, "HH").add(2, 'days').toDate(),
      },
      {
        company: 'Caviar', date: moment(0, "HH").add(2, 'days').toDate(),
        startsAt: moment(11, "HH").add(2, 'days').toDate(),
        endsAt: moment(15, "HH").add(2, 'days').toDate(),
      },
      {
        company: 'Luxe', date: moment(0, "HH").add(3, 'days').toDate(),
        startsAt: moment(11, "HH").add(3, 'days').toDate(),
        endsAt: moment(14, "HH").add(3, 'days').toDate(),
      },
      {
        company: 'Luxe', date: moment(0, "HH").add(6, 'days').toDate(),
        startsAt: moment(8, "HH").add(6, 'days').toDate(),
        endsAt: moment(11, "HH").add(6, 'days').toDate(),
      },
      {
        company: 'Caviar', date: moment(0, "HH").add(6, 'days').toDate(),
        startsAt: moment(12, "HH").add(6, 'days').toDate(),
        endsAt: moment(16, "HH").add(6, 'days').toDate(),
      },
      {
        company: 'Instacart', date: moment(0, "HH").add(7, 'days').toDate(),
        startsAt: moment(07, "HH").add(7, 'days').toDate(),
        endsAt: moment(10, "HH").add(7, 'days').toDate(),
      },
      {
        company: 'Luxe', date: moment(0, "HH").add(10, 'days').toDate(),
        startsAt: moment(8, "HH").add(10, 'days').toDate(),
        endsAt: moment(11, "HH").add(10, 'days').toDate(),
      },
      {
        company: 'Caviar', date: moment(0, "HH").add(10, 'days').toDate(),
        startsAt: moment(12, "HH").add(10, 'days').toDate(),
        endsAt: moment(15, "HH").add(10, 'days').toDate(),
      },
      {
        company: 'Instacart', date: moment(0, "HH").add(12, 'days').toDate(),
        startsAt: moment(07, "HH").add(12, 'days').toDate(),
        endsAt: moment(10, "HH").add(12, 'days').toDate(),
      },
      {
        company: 'Caviar', date: moment(0, "HH").add(12, 'days').toDate(),
        startsAt: moment(11, "HH").add(12, 'days').toDate(),
        endsAt: moment(14, "HH").add(12, 'days').toDate(),
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
