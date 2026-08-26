export interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
}

export const TAX = 0.08;

export const products: Product[] = [
    {
        id: 0,
        name: 'Sauce Labs Bike Light',
        price: 9.99,
        description: "A red light isn't the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included.",
        imageUrl: '/assets/bike-light-1200x1500-DxcZRFOA.jpg',
    },
    {
        id: 1,
        name: 'Sauce Labs Bolt T-Shirt',
        price: 15.99,
        description: 'Get your testing superhero on with the Sauce Labs bolt T-shirt. From American Apparel, 100% ringspun combed cotton, heather gray with red bolt.',
        imageUrl: '/assets/bolt-shirt-1200x1500-mR0ldpVS.jpg',
    },
    {
        id: 2,
        name: 'Sauce Labs Onesie',
        price: 7.99,
        description: "Rib snap infant onesie for the junior automation engineer in development. Reinforced 3-snap bottom closure, two-needle hemmed sleeved and bottom won't unravel.",
        imageUrl: '/assets/red-onesie-1200x1500-BrSuq0ic.jpg',
    },
    {
        id: 3,
        name: 'Test.allTheThings() T-Shirt (Red)',
        price: 15.99,
        description: 'This classic Sauce Labs t-shirt is perfect to wear when cozying up to your keyboard to automate a few tests. Super-soft and comfy ringspun combed cotton.',
        imageUrl: '/assets/red-tatt-1200x1500-E-qp6aYf.jpg',
    },
    {
        id: 4,
        name: 'Sauce Labs Backpack',
        price: 29.99,
        description: 'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.',
        imageUrl: '/assets/sauce-backpack-1200x1500-CjRW-Djj.jpg',
    },
    {
        id: 5,
        name: 'Sauce Labs Fleece Jacket',
        price: 49.99,
        description: "It's not every day that you come across a midweight quarter-zip fleece jacket capable of handling everything from a relaxing day outdoors to a busy day at the office.",
        imageUrl: '/assets/sauce-pullover-1200x1500-BfbI-PSd.jpg',
    },
];

export const productsWithUnknown: Product[] = [
    {
        id: -1,
        name: 'ITEM NOT FOUND',
        price: -1,
        description: 'We\'re sorry, but your call could not be completed as dialled. Please check your number, and try your call again. If you are in need of assistance, please dial 0 to be connected with an operator. This is a recording. 4 T 1.',
        imageUrl: '/assets/sl-404-Cq1a9k9X.jpg'
    },
    {
        id: 0,
        name: 'Sauce Labs Bike Light',
        price: 9.99,
        description: "A red light isn't the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included.",
        imageUrl: '/assets/bike-light-1200x1500-DxcZRFOA.jpg',
    },
    {
        id: 1,
        name: 'Sauce Labs Bolt T-Shirt',
        price: 15.99,
        description: 'Get your testing superhero on with the Sauce Labs bolt T-shirt. From American Apparel, 100% ringspun combed cotton, heather gray with red bolt.',
        imageUrl: '/assets/bolt-shirt-1200x1500-mR0ldpVS.jpg',
    },
    {
        id: 2,
        name: 'Sauce Labs Onesie',
        price: 7.99,
        description: "Rib snap infant onesie for the junior automation engineer in development. Reinforced 3-snap bottom closure, two-needle hemmed sleeved and bottom won't unravel.",
        imageUrl: '/assets/red-onesie-1200x1500-BrSuq0ic.jpg',
    },
    {
        id: 3,
        name: 'Test.allTheThings() T-Shirt (Red)',
        price: 15.99,
        description: 'This classic Sauce Labs t-shirt is perfect to wear when cozying up to your keyboard to automate a few tests. Super-soft and comfy ringspun combed cotton.',
        imageUrl: '/assets/red-tatt-1200x1500-E-qp6aYf.jpg',
    },
    {
        id: 4,
        name: 'Sauce Labs Backpack',
        price: 29.99,
        description: 'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.',
        imageUrl: '/assets/sauce-backpack-1200x1500-CjRW-Djj.jpg',
    },
    {
        id: 5,
        name: 'Sauce Labs Fleece Jacket',
        price: 49.99,
        description: "It's not every day that you come across a midweight quarter-zip fleece jacket capable of handling everything from a relaxing day outdoors to a busy day at the office.",
        imageUrl: '/assets/sauce-pullover-1200x1500-BfbI-PSd.jpg',
    },
]