import {Injectable, signal, computed} from '@angular/core';
import {Category, GCP, Place} from '../models/place.model';

export const CATEGORIES: Record<string, Category> = {
  nature: {label: 'Nature & Hiking', icon: '🏔', color: '#4a7c59', emoji: '🌲'},
  attractions: {label: 'Attractions', icon: '🏛', color: '#8b7355', emoji: '🗺'},
  sports: {label: 'Sports & Activities', icon: '⛷', color: '#3a7ca5', emoji: '⛷'},
  restaurants: {label: 'Restaurants', icon: '🍽', color: '#c8823a', emoji: '🍽'},
  cafes: {label: 'Cafés & Bakeries', icon: '☕', color: '#9c6b3c', emoji: '☕'},
  skiing: {label: 'Ski & Mountain Resorts', icon: '🎿', color: '#5b8fb9', emoji: '🎿'},
  pharmacy: {label: 'Pharmacy', icon: '💊', color: '#c0392b', emoji: '💊'},
  grocery: {label: 'Grocery Stores', icon: '🛒', color: '#27ae60', emoji: '🛒'},
  fuel: {label: 'Gas Stations', icon: '⛽', color: '#e67e22', emoji: '⛽'},
  ev: {label: 'EV Charging', icon: '⚡', color: '#8e44ad', emoji: '⚡'},
};

export const GCP_POINTS: GCP[] = [
  {lat: 62.073, lon: 12.470, px: 189.5, py: 149.4},
  {lat: 62.153, lon: 11.968, px: 52.9, py: 98.2},
  {lat: 62.028, lon: 12.060, px: 68.3, py: 228.7},
  {lat: 61.760, lon: 11.970, px: 70.8, py: 332.9},
  {lat: 61.785, lon: 12.578, px: 207.4, py: 335.4},
  {lat: 61.889, lon: 12.832, px: 315.8, py: 159.6},
  {lat: 61.862, lon: 12.718, px: 325.2, py: 271.4},
  {lat: 61.958, lon: 13.048, px: 453.2, py: 217.6},
  {lat: 62.130, lon: 13.645, px: 487.3, py: 87.9},
  {lat: 62.107, lon: 14.290, px: 746.8, py: 111.0},
  {lat: 62.034, lon: 14.365, px: 802.2, py: 186.1},
  {lat: 61.790, lon: 14.090, px: 742.5, py: 290.2},
  {lat: 61.595, lon: 12.496, px: 214.2, py: 456.6},
  {lat: 61.693, lon: 13.135, px: 427.6, py: 367.0},
  {lat: 61.540, lon: 12.182, px: 95.6, py: 550.5},
  {lat: 61.517, lon: 13.160, px: 409.6, py: 527.5},
  {lat: 61.440, lon: 12.720, px: 262.9, py: 563.3},
  {lat: 61.278, lon: 13.192, px: 315.8, py: 614.5},
  {lat: 61.229, lon: 14.036, px: 739.9, py: 674.3},
  {lat: 61.155, lon: 13.185, px: 448.1, py: 729.7},
  {lat: 61.102, lon: 13.048, px: 324.3, py: 716.9},
  {lat: 61.010, lon: 13.440, px: 435.3, py: 796.3},
  {lat: 61.000, lon: 14.200, px: 765.5, py: 809.1},
  {lat: 62.300, lon: 13.800, px: 478.8, py: 46.9},
];

export const IMG_W = 920;
export const IMG_H = 833;

export const MAPS_LINKS: Record<string, string> = {
  'fulufjallet': 'https://www.google.com/maps/place/Fulufjällets+nationalpark/@61.5473,12.753,12z',
  'njupeskar': 'https://www.google.com/maps/place/Njupeskär+Waterfall/@61.6345,12.6848,14z',
  'stadjan': 'https://www.google.com/maps/place/Städjan-Nipfjällets+naturreservat/@61.914,12.8819,13z',
  'trollvagen': 'https://www.google.com/maps/place/Trollvägen+Idre/@61.9488,12.8265,14z',
  'lilladalen': 'https://www.google.com/maps/place/Lillådalen+Husky/@61.647,12.4981,14z',
  'stops-vattenfall': 'https://www.google.com/maps/place/Stops+Vattenfall/@61.3189,13.8893,14z',
  'sodra-trollegrav': 'https://www.google.com/maps/place/Södra+Trollegrav/@61.5685,13.6373,14z',
  'styggforsen': 'https://www.google.com/maps/place/Styggforsen/@61.0072,15.1915,14z',
  'bunkris': 'https://www.google.com/maps/place/Bunkris+Utsiktstorn/@61.428,13.4728,14z',
  'porfyrmuseet': 'https://www.google.com/maps/place/Porfyrmuseet+Älvdalen/@61.2293,14.0362,16z',
  'rots-skans': 'https://www.google.com/maps/place/Rots+Skans+Älvdalen/@61.2546,14.0332,15z',
  'anglerman': 'https://www.google.com/maps/place/Anglerman+Fishing+Älvdalen/@61.2358,14.0345,15z',
  'simhall': 'https://www.google.com/maps/place/Älvdalens+Simhall/@61.2277,14.0298,16z',
  'ishall': 'https://www.google.com/maps/place/Älvdalens+Ishall/@61.2276,14.0307,16z',
  'golfklubb': 'https://www.google.com/maps/place/Älvdalens+Golfklubb/@61.2487,14.0554,15z',
  'sportkullan': 'https://www.google.com/maps/place/Sportkullan+Älvdalen/@61.2318,14.0384,16z',
  'idre-fjall': 'https://www.google.com/maps/place/Idre+Fjäll/@61.8893,12.8322,13z',
  'dalgatan118': 'https://www.google.com/maps/place/Restaurang+Dalgatan+118/@61.2318,14.0367,16z',
  'ellies': 'https://www.google.com/maps/place/Ellies+Street+Food+Älvdalen/@61.2236,14.0447,16z',
  'pizzeria-dala': 'https://www.google.com/maps/place/Restaurang+Pizzeria+Dala/@61.2329,14.0356,16z',
  'lodjuret': 'https://www.google.com/maps/place/Restaurang+Lodjuret+Idre/@61.8573,12.7221,15z',
  'renen-algen': 'https://www.google.com/maps/place/Renen+Älgen+Idre/@61.89,12.7784,15z',
  'toppstugan': 'https://www.google.com/maps/place/Toppstugan+Idrefjäll/@61.8878,12.8571,14z',
  'lilla-vildt': 'https://www.google.com/maps/place/Lilla+Vildt+Idre/@61.8893,12.8338,15z',
  'morins': 'https://www.google.com/maps/place/Morins+Bageri+Älvdalen/@61.2292,14.0382,16z',
  'stopfallet': 'https://www.google.com/maps/place/Stopfallet+Älvdalen/@61.3195,13.8835,14z',
  'silverfallet': 'https://www.google.com/maps/place/Silverfallet+Idre/@62.0961,12.2516,14z',
  'fjatfallen': 'https://www.google.com/maps/place/Fjätfallen+Särna/@61.9395,13.0498,14z',
  'stora-fjatfallet': 'https://www.google.com/maps/place/Stora+Fjätfallet+Särna/@61.6707,13.2555,14z',
  'hornafallet': 'https://www.google.com/maps/place/Hornåfallet/@61.5708,13.3936,14z',
  'gryvalan': 'https://www.google.com/maps/place/Gryvålans+naturreservat/@61.3901,13.4767,13z',
  'bjornan': 'https://www.google.com/maps/place/Björnån+Naturreservat/@61.3784,13.2697,14z',
  'norra-mora-vildmark': 'https://www.google.com/maps/place/Norra+Mora+Vildmark/@61.5027,14.1929,13z',
  'fallen-lovbacken': 'https://www.google.com/maps/place/Fallen+Lövåsbäcken/@61.3908,14.008,14z',
  'sarnaadventures': 'https://www.google.com/maps/place/Särna+Adventures/@61.6937,13.1369,15z',
  'alvdalen-camping': 'https://www.google.com/maps/place/Älvdalens+Camping/@61.2295,14.028,15z',
  'skistar-salen': 'https://www.google.com/maps/place/SkiStar+Sälen/@61.1643,13.1873,13z',
  'lindvallen': 'https://www.google.com/maps/place/SkiStar+Lindvallen/@61.1604,13.1958,14z',
  'idregrillen': 'https://www.google.com/maps/place/Idregrillen+Idre/@61.858,12.7264,15z',
  'pizzeria-capri': 'https://www.google.com/maps/place/Pizzeria+Capri+Särna/@61.6942,13.1358,15z',
  'cafe-gosen': 'https://www.google.com/maps/place/Café+Gosen+Gördalen/@61.5952,12.4959,14z',
  'turistgarden': 'https://www.google.com/maps/place/Turistgården+Särna/@61.6938,13.1245,15z',
  'jotli-cafe': 'https://www.google.com/maps/place/Jotli+Café/@62.0702,12.3157,14z',
  'apotek-bjornen': 'https://www.google.com/maps/place/Apoteket+Björnen/@61.2309,14.0377,17z',
  'ica-olssons': 'https://www.google.com/maps/place/ICA+Supermarket+Olssons/@61.2301,14.0341,17z',
  'ica-idrebua': 'https://www.google.com/maps/place/ICA+Supermarket+Idrebua/@61.8574,12.7215,16z',
  'coop-idre': 'https://www.google.com/maps/place/Coop+Konsum+Idre/@61.86,12.723,16z',
  'coop-sarna': 'https://www.google.com/maps/place/Coop+Konsum+Särna/@61.6942,13.1213,16z',
  'ica-idrefjall': 'https://www.google.com/maps/place/ICA+Nära+Idre+Fjäll/@61.89,12.834,15z',
  'narlivs-fjatervalen': 'https://www.google.com/maps/place/Närlivsbutik+Fjätervålen/@61.96,13.05,14z',
  'ica-salen': 'https://www.google.com/maps/place/ICA+Nära+Sälen/@61.158,13.208,15z',
  'circlek-alvdalen': 'https://www.google.com/maps/place/Circle+K+Älvdalen/@61.2285,14.0365,17z',
  'okq8-sarna': 'https://www.google.com/maps/place/OKQ8+Särna/@61.6933,13.1421,16z',
  'gulf-idre': 'https://www.google.com/maps/place/Gulf+Idre/@61.8615,12.7228,16z',
  'okq8-salen': 'https://www.google.com/maps/place/OKQ8+Sälen/@61.156,13.2045,15z',
  'ev-alvdalen': 'https://www.google.com/maps/place/Laddstation+Älvdalen/@61.2295,14.036,17z',
  'ev-sarna': 'https://www.google.com/maps/place/Laddstation+Elbil+Särna/@61.6933,13.1421,16z',
  'ev-idre': 'https://www.google.com/maps/place/Laddstation+Idre/@61.862,12.7268,16z',
  'ev-idrefjall': 'https://www.google.com/maps/place/Laddstation+Idre+Fjäll/@61.8893,12.8322,14z',
  'ev-salen': 'https://www.google.com/maps/place/Laddstation+Sälen/@61.1576,13.2041,15z',
  'ev-fjatervalen': 'https://www.google.com/maps/place/Laddstation+Fjätervålen/@61.96,13.05,14z',
};

const ALL_PLACES: Place[] = [
  {
    id: 'fulufjallet',
    name: 'Fulufjället National Park',
    category: 'nature',
    lat: 61.5473, lon: 12.7530,
    rating: 4.8, ratingCount: 2195,
    address: 'Älvdalen, Sweden',
    phone: '+46 10 225 03 49',
    hours: ['Mon–Sun: Open 24 hours'],
    description: 'One of Sweden\'s most spectacular national parks featuring Njupeskär — the country\'s tallest waterfall at 93 m — ancient spruce forests, and the famous Old Tjikko tree. Accessible wooden boardwalks make it family-friendly while longer trails challenge serious hikers.',
    reviews: [
      'One of the most peaceful and unspoiled natural areas I\'ve ever visited. The landscape is striking — from dense, ancient spruce forests to the flat, wind-swept plateau.',
      'The hike to Njupeskär waterfall is very accessible, with wooden boardwalks and gentle terrain, great for families.'
    ],
    tip: 'Visit in the morning for the best waterfall photos. The trail is open year-round — frozen in winter, spectacular in summer.'
  },
  {
    id: 'njupeskar',
    name: 'Njupeskär Waterfall',
    category: 'nature',
    lat: 61.6345, lon: 12.6848,
    rating: 4.8, ratingCount: 1801,
    address: 'Njupeskär, Särna',
    phone: '+46 10 225 03 49',
    hours: ['Mon–Sun: Open 24 hours'],
    description: 'Sweden\'s tallest waterfall at 93 meters, located within Fulufjället National Park. Breathtaking year-round — frozen solid in winter, roaring in spring melt. The round trail offers stunning views from both bottom and top.',
    reviews: [
      'Visiting in winter was an emotional experience. The waterfall stood completely frozen — nature feels untouched and time seems to pause.',
      'Breathtaking with very beautiful but also challenging trails. Restrooms are free and very clean.'
    ],
    tip: 'Morning light is perfect for photography. The longer loop back is more challenging but more rewarding.'
  },
  {
    id: 'stadjan',
    name: 'Städjan-Nipfjället Reserve',
    category: 'nature',
    lat: 61.9140, lon: 12.8819,
    rating: 4.8, ratingCount: 185,
    address: '797 92 Idre, Sweden',
    hours: ['Mon–Sun: Open 24 hours'],
    description: 'A stunning nature reserve with a distinctive volcano-shaped mountain visible for miles. The Städjan hike offers panoramic views over Idre and its mountains. Experience the mysterious "Trollvägen" optical illusion nearby where cars appear to roll uphill.',
    reviews: [
      'Climbing Städjan in winter is a beautiful experience. It looks like a volcano and can be seen from far away.',
      'Really lovely hike — beautiful views and a unique place for a Swedish fika!'
    ],
    tip: 'Combine with the Trollvägen optical illusion just a few km away for a memorable day.'
  },
  {
    id: 'trollvagen',
    name: 'Trollvägen (Optical Illusion)',
    category: 'nature',
    lat: 61.9488, lon: 12.8265,
    rating: 4.6, ratingCount: 184,
    address: '797 92 Idre, Sweden',
    hours: ['Mon–Sun: Open 24 hours'],
    description: 'A fascinating natural optical illusion where cars appear to roll uphill on their own, but are actually going downhill. A great starting point for hikes up Mulen or Städjan mountain. Natural water springs with some of the freshest water in the world.',
    reviews: [
      'Amazing place to start a beautiful hike up Mulen or Städjan! Natural water sources with some of the freshest water in the world.',
      'Very weird, interesting and beautiful place. An impressive natural optical illusion.'
    ],
    tip: 'Turn off your engine and watch your car roll "uphill"! Kids love it.'
  },
  {
    id: 'lilladalen',
    name: 'Lillådalen – Husky Tours',
    category: 'nature',
    lat: 61.6470, lon: 12.4981,
    rating: 5.0, ratingCount: 1,
    address: '797 91 Särna, Sweden',
    hours: ['Mon–Sun: Open 24 hours'],
    description: 'A wonderfully organized husky dog sled tour through stunning winter landscapes on a plateau near cross-country ski trails near Särna. Run by friendly operators with knowledgeable guides fluent in English, German, and Swedish/Norwegian.',
    reviews: [
      'A wonderfully organized husky tour in a stunning winter landscape. Fantastic team — guides speak English, German, and Swedish/Norwegian.'
    ],
    tip: 'Book in advance during winter season. Perfect for families and unforgettable for first-timers.'
  },
  {
    id: 'stops-vattenfall',
    name: 'Stops Vattenfall',
    category: 'nature',
    lat: 61.3189, lon: 13.8893,
    rating: 4.6, ratingCount: 108,
    address: 'Älvdalen municipality',
    hours: [],
    description: 'A hidden gem waterfall tucked in the wilderness south of Älvdalen. Feels like a secret spot — surrounded by pure wilderness with nothing but the sound of rushing water and birds. The path down can be steep and rocky, especially after rain.',
    reviews: [
      'One of the most beautiful waterfalls we came across. The hike down there and back up was short but very steep.',
      'A beautiful waterfall — pure wilderness, nothing but the sound of rushing water and birds.'
    ],
    tip: 'Wear sturdy footwear. The rocks can be slippery after rain. Best with higher water levels in spring.'
  },
  {
    id: 'sodra-trollegrav',
    name: 'Södra Trollegrav (Gorge)',
    category: 'nature',
    lat: 61.5685, lon: 13.6373,
    rating: 5.0, ratingCount: 2,
    address: '796 99 Älvdalen, Sweden',
    hours: [],
    description: 'A truly magical and remote gorge in Älvdalen municipality — a demanding hike through a wild valley following a stream, requiring multiple crossings. Almost guaranteed solitude. One of the most wild and inaccessible places in the region.',
    reviews: [
      'A truly magical place — you will most likely have it all to yourself. The stream needs crossing several times. When you come out, the view along the edge is breathtaking.',
      'Incredibly magical, wild and inaccessible. Guaranteed to meet no more people here.'
    ],
    tip: 'Experienced hikers only. Go in summer when water levels allow easy crossings. Bring waterproof boots.'
  },
  {
    id: 'styggforsen',
    name: 'Styggforsen Waterfall',
    category: 'nature',
    lat: 61.0072, lon: 15.1915,
    rating: 4.6, ratingCount: 1324,
    address: 'Boda Kyrkby',
    phone: '+46 248 405 30',
    hours: ['Mon–Sun: Open 24 hours'],
    description: 'A beautiful waterfall with historical significance — formed by a meteorite impact 360 million years ago. Easy round trail through the forest, with wooden steps leading to the view. A cozy log café nearby serves ice cream, coffee and light food.',
    reviews: [
      'Beautiful walk and the waterfall is incredible. Very easy access to a lovely spot in clean, pure nature.',
      'Incredible to see how 360 million years ago a meteorite impact formed the landscape!'
    ],
    tip: 'The café next to the parking is a lovely spot for fika before or after your walk.'
  },
  {
    id: 'bunkris',
    name: 'Bunkris Fire Lookout Tower',
    category: 'nature',
    lat: 61.4280, lon: 13.4728,
    rating: 4.7, ratingCount: 173,
    address: '796 99 Älvdalen',
    hours: ['Mon–Sun: Open 24 hours'],
    description: 'A historical fire lookout tower with spectacular panoramic views over the Dalarna countryside. A perfect picnic spot on the way to or from Fulufjället National Park. Steep stairways but worth the climb. Maintained by volunteers — donations welcome.',
    reviews: [
      'A perfect spot for a picnic on the way to Fulufjället. Beautiful views over the area from the top.',
      'Awesome view from the top! Make sure to donate and write in the guest book.'
    ],
    tip: 'Donate to the wonderful people maintaining this tower. Stunning at sunset!'
  },

  // ─── ATTRACTIONS ───
  {
    id: 'porfyrmuseet',
    name: 'Porfyrmuseet (Porphyry Museum)',
    category: 'attractions',
    lat: 61.2293, lon: 14.0362,
    rating: 4.4, ratingCount: 254,
    address: 'Dalgatan 81D, Älvdalen',
    phone: '+46 251 314 02',
    hours: ['Sat: 10:00 AM – 3:00 PM', 'Mon–Fri, Sun: Closed'],
    description: 'A fascinating double museum in central Älvdalen covering two unique local legacies: the historic porphyry stone craftsmanship that made Älvdalen famous across Europe, and the legendary Hagström guitar factory that helped shape Swedish music history.',
    reviews: [
      'Excellent — seeing all the different rocks that make up this part of Sweden plus the guitars made at the Hagström workshop.',
      'Wonderfully interesting introduction to the Hagström brand and how an entrepreneur in small Älvdalen helped create Swedish music wonder.'
    ],
    tip: 'The Hagström guitar collection is surprisingly impressive! Open Saturdays only — check current hours before visiting.'
  },
  {
    id: 'rots-skans',
    name: 'Rots Skans (Open-Air Museum)',
    category: 'attractions',
    lat: 61.2546, lon: 14.0332,
    rating: 4.3, ratingCount: 83,
    address: 'Ribbvägen 4, Älvdalen',
    hours: ['Wed: 1–4 PM', 'Thu–Fri: 9 AM–12 PM'],
    description: 'A remarkable open-air museum of historic buildings and Sweden\'s oldest border fort, built in 1677 as a defense against Norwegian incursions. Located on the banks of the Rot River with many interesting historic structures. Hosts an old-fashioned Christmas market in late November.',
    reviews: [
      'We enjoyed this open-air museum more than Skansen in Stockholm! Many interesting buildings and history.',
      'A cool little place. Definitely worth a visit if you like a bit of old history.'
    ],
    tip: 'Visit for the Christmas market in late November/early December — an atmospheric and cozy experience.'
  },
  {
    id: 'anglerman',
    name: 'Anglerman Fishing Adventures',
    category: 'attractions',
    lat: 61.2358, lon: 14.0345,
    rating: 4.5, ratingCount: 8,
    address: 'Dalgatan 146, Älvdalen',
    hours: ['Mon–Fri: 8 AM–5 PM', 'Sat: 9 AM–1 PM'],
    description: 'World-class guided fly fishing experiences on the beautiful Dalälven river with local expert Micke. Whether you\'re a beginner or seasoned angler, Micke tailors each trip to you — combining fly fishing with local food, Swedish culture, and stunning Älvdalen nature.',
    reviews: [
      'My partner and I had a fantastic time on our guided fly fishing trip! Micke combined fishing with good conversation, local culture, and great food surrounded by incredible nature.',
      'To anyone thinking about booking with Micke, do it. It isn\'t just about the world class fishing — he\'s a guide to local food and culture.'
    ],
    tip: 'Even if you\'ve never fly fished before, Micke will have you casting beautifully within hours.'
  },

  // ─── SPORTS & ACTIVITIES ───
  {
    id: 'simhall',
    name: 'Älvdalens Simhall (Swimming)',
    category: 'sports',
    lat: 61.2277, lon: 14.0298,
    rating: 4.6, ratingCount: 157,
    address: 'Ribbholmsvägen 27, Älvdalen',
    phone: '+46 251 312 83',
    hours: ['Tue: 12–8:30 PM', 'Wed: 12–7 PM', 'Thu–Sun: 10 AM–4 PM', 'Mon: Closed'],
    description: 'A top-class sports facility featuring a 50-meter competition pool with 9 lanes, a smaller pool with water slide, a toddler pool, whirlpool, sauna, and gym. One of the best swimming halls in Dalarna, recently renovated with a spectacular hot tub.',
    reviews: [
      'A 50-meter pool with 9 lanes, 27°C in the water — perfect for a workout. Really like this bathhouse.',
      'Fantastic staff, newly renovated top class hot tub, a really hot sauna with 3 floors — all for only 50 kronor!'
    ],
    tip: 'Entry is very affordable. Can rent swimwear on-site if you forgot yours.'
  },
  {
    id: 'ishall',
    name: 'Älvdalens Ishall (Ice Rink)',
    category: 'sports',
    lat: 61.2276, lon: 14.0307,
    rating: 3.9, ratingCount: 13,
    address: 'Ribbholmsvägen 29, Älvdalen',
    hours: [],
    description: 'Local indoor ice skating rink adjacent to the swimming hall in central Älvdalen. Great for ice skating sessions during the winter months.',
    reviews: ['Quite an ok ice rink. Cold and simple.'],
    tip: 'Check local schedules for public skating sessions — usually evenings and weekends.'
  },
  {
    id: 'golfklubb',
    name: 'Älvdalens Golfklubb',
    category: 'sports',
    lat: 61.2487, lon: 14.0554,
    rating: 4.2, ratingCount: 5,
    address: 'Porfyrgårdsvägen 41, Älvdalen',
    phone: '+46 70 565 44 45',
    hours: [],
    description: 'Scenic 9-hole golf course set in the beautiful Dalarna countryside just north of Älvdalen. A nice facility with a good community feel — perfect for a round surrounded by Swedish forest.',
    reviews: ['A really nice facility and good community.', 'Fun track!'],
    tip: 'Relaxed and welcoming. Great for a casual summer round in stunning natural surroundings.'
  },
  {
    id: 'sportkullan',
    name: 'Sportkullan (Gym & Massage)',
    category: 'sports',
    lat: 61.2318, lon: 14.0384,
    rating: 4.4, ratingCount: 12,
    address: 'Gamla Näsvägen 6, Älvdalen',
    phone: '+46 72 522 80 04',
    hours: ['Mon–Fri: 8 AM–4 PM', 'Sat–Sun: Closed'],
    description: 'Local sports center offering gym facilities, expert massage therapy, and sports equipment. Particularly known for excellent sports massage — staff are highly knowledgeable in training and recovery.',
    reviews: [
      'Fantastic massage and friendly service. The hip flexor massage has cured 15 years of back pain!',
      'Very knowledgeable in training and massage. Well-stocked sports shop with personal service.'
    ],
    tip: 'Book a sports massage after a long hike — highly recommended for recovery.'
  },

  // ─── SKI & MOUNTAIN RESORTS ───
  {
    id: 'idre-fjall',
    name: 'Idre Fjäll Ski Resort',
    category: 'skiing',
    lat: 61.8893, lon: 12.8322,
    rating: 4.4, ratingCount: 3129,
    address: 'Idre Fjäll 113, Idre',
    phone: '+46 253 410 00',
    hours: ['Mon–Sun: 10 AM–4 PM (ski season)'],
    description: 'One of Sweden\'s most popular mountain resorts — excellent skiing and snowboarding in winter, and mountain biking, hiking, and rafting in summer. Good range of slopes from beginner-friendly to steep, family-friendly layout with multiple smaller parking areas and good slope access.',
    reviews: [
      'Less commercial than many resorts, good skiing and no long lift lines. Very family friendly.',
      'Amazing views and experiences everywhere. Nice supermarket, winter clothes shop and different restaurants.'
    ],
    tip: 'Avoid peak winter school holidays for shorter lift queues. Summer activities are underrated!'
  },

  // ─── RESTAURANTS ───
  {
    id: 'dalgatan118',
    name: 'Restaurang Dalgatan 118',
    category: 'restaurants',
    lat: 61.2318, lon: 14.0367,
    rating: 4.7, ratingCount: 565,
    address: 'Dalgatan 118, Älvdalen',
    phone: '+46 251 109 80',
    hours: ['Mon–Wed: 11 AM–3 PM', 'Thu: 11 AM–3 PM & 5–9 PM', 'Fri: 11 AM–3 PM & 5–10 PM', 'Sat: 12–3 PM & 5–10 PM', 'Sun: 12–3 PM'],
    description: 'The best restaurant in Älvdalen by a clear margin — beloved by both locals and passing travelers. Exceptional Swedish lunch buffet packed with fresh salads, local dishes and more, served 12–15. Evening à la carte menu with quality seasonal cooking. Vegan-friendly with advance notice.',
    reviews: [
      'Absolute winner for lunch. Buffet with plenty of local salads, main dishes and drinks. Very crowded during lunch — many locals come too!',
      'Exceptional kitchen, very tasty true Swedish meal. Amazing food, gorgeous interior and such a homely small town feel.'
    ],
    tip: 'Arrive before 12:30 for lunch or you\'ll wait for a table. Call ahead if you need vegan options for dinner.'
  },
  {
    id: 'ellies',
    name: "Ellie's Street Food",
    category: 'restaurants',
    lat: 61.2236, lon: 14.0447,
    rating: 4.0, ratingCount: 180,
    address: 'Dalgatan 49, Älvdalen',
    phone: '+46 70 399 41 49',
    hours: ['Mon–Sun: 10 AM–9 PM'],
    description: 'Popular street food spot in Älvdalen serving the best burgers in town — juicy, flavorful, and well-priced. Quick service and a casual, friendly atmosphere. Great for a filling meal while passing through.',
    reviews: [
      'The most delicious and juicy burgers I\'ve eaten! Great burgers and fries.',
      'One of the best burgers I\'ve had — 150g prime rib burger with bacon. Super nice staff, fast service.'
    ],
    tip: 'Try the prime rib burger. One of the best value meals in town.'
  },
  {
    id: 'pizzeria-dala',
    name: 'Restaurang & Pizzeria Dala',
    category: 'restaurants',
    lat: 61.2329, lon: 14.0356,
    rating: 4.1, ratingCount: 265,
    address: 'Dalgatan 107b, Älvdalen',
    phone: '+46 251 103 17',
    hours: ['Mon–Thu: 11 AM–9 PM', 'Fri–Sat: 11 AM–11 PM', 'Sun: 11 AM–9 PM'],
    description: 'Don\'t let the simple exterior fool you — this is a hidden gem. Thin, crispy pizza with fresh toppings, friendly staff, and reliable quality. One of the most popular spots in Älvdalen, especially on weekends.',
    reviews: [
      'The pizzas are really really good! Don\'t get fooled by the boring atmosphere. Dough is thin and crispy but still moist, everything felt really fresh.',
      'Friendly place, the owner knew some English. The Mexican pizza and Aztec pizza were both tasty!'
    ],
    tip: 'It fills up fast on Friday evenings. Order early or prepare to wait — it\'s worth it!'
  },
  {
    id: 'lodjuret',
    name: 'Restaurang Lodjuret (Idre)',
    category: 'restaurants',
    lat: 61.8573, lon: 12.7221,
    rating: 3.9, ratingCount: 613,
    address: 'Framgårdsvägen 1, Idre',
    phone: '+46 253 200 12',
    hours: ['Mon–Sun: 11 AM–10 PM'],
    description: 'Conveniently located restaurant in Idre with a great interior and spacious parking. Serves classic Swedish fare and burgers. Popular spot for après-ski, with occasional reindeer sightings just outside!',
    reviews: [
      'Very good and QUICK service. Great meal. Also chance of reindeers just outside!',
      'Good food, perfect fries, hamburger cooked to perfection. Friendly and helpful staff even when we came late.'
    ],
    tip: 'Watch for reindeer in the car park — it happens more often than you\'d think!'
  },
  {
    id: 'renen-algen',
    name: 'RENEN & ÄLGEN Restaurant',
    category: 'restaurants',
    lat: 61.8900, lon: 12.7784,
    rating: 3.9, ratingCount: 232,
    address: 'Jupitervägen, Idre',
    phone: '+46 253 260 66',
    hours: ['Mon–Sun: 9 AM–9 PM'],
    description: 'A beloved Idre institution serving wild game specialties including reindeer meat and elk. The Friday night buffet with creative salads and varied meats is excellent. Great kids menu, quick service, and a spectacular interior with antlers throughout.',
    reviews: [
      'Very good food — the reindeer meat was delicious, the kids got elk burgers and it was the best burger they\'d ever tried. Service is top!',
      'The menu is varied, serves quickly, the halloumi burger with sweet potato fries is great. Staff are super friendly.'
    ],
    tip: 'Don\'t miss the Friday evening buffet — locals consider it the best value in the area.'
  },
  {
    id: 'toppstugan',
    name: 'Toppstugan Idrefjäll',
    category: 'restaurants',
    lat: 61.8878, lon: 12.8571,
    rating: 4.1, ratingCount: 356,
    address: '797 92 Idre (mountain top)',
    hours: ['Mon–Sun: 9 AM–6 PM'],
    description: 'Ski resort restaurant perched at the top of Idre Fjäll with sweeping mountain views. Famous for their Wednesday fondue evenings — picked up and returned by snowmobile! Cider on tap (rare in Sweden), hearty ski-day lunches, and cozy mountain atmosphere.',
    reviews: [
      'Cider on tap — which is rare in Sweden! Highly recommended.',
      'Cosy fondue night every Wednesday — picked up and driven back by snowmobile. Highly recommended!'
    ],
    tip: 'Book the snowmobile fondue Wednesday in advance — it sells out fast!'
  },
  {
    id: 'lilla-vildt',
    name: 'Lilla Vildt (Fine Dining, Idre)',
    category: 'restaurants',
    lat: 61.8893, lon: 12.8338,
    rating: 4.3, ratingCount: 72,
    address: '797 92 Idre',
    phone: '+46 253 414 39',
    hours: ['Tue–Sat: 3–11 PM', 'Mon, Sun: Closed'],
    description: 'The gourmet gem of the Idre area — a stylish restaurant with an innovative Nordic wild game menu. Tapas-style sharing plates featuring local ingredients: pickled pine shoots, raw reindeer, arctic char sashimi paired with wines. The chef\'s tasting menu with wine pairings is extraordinary.',
    reviews: [
      'OMG! This might have been the best restaurant experience I\'ve ever had! They hacked their menu to accommodate everyone. No problems seems to be their guiding star!',
      'Who knew pickled \'granskott\' is such a good combo with raw reindeer, or arctic char sashimi paired with chablis?! Truly unique.'
    ],
    tip: 'Reserve well in advance and go for the chef\'s tasting menu with wine pairing. A mountain dining experience you won\'t forget.'
  },

  // ─── CAFÉS ───
  {
    id: 'morins',
    name: 'Morins Bageri & Café',
    category: 'cafes',
    lat: 61.2292, lon: 14.0382,
    rating: 4.2, ratingCount: 162,
    address: 'Dalgatan 98, Älvdalen',
    phone: '+46 251 100 06',
    hours: ['Mon–Fri: 10 AM–5 PM', 'Sat: 11 AM–3 PM', 'Sun: Closed'],
    description: 'A must-visit bakery in Älvdalen where time stands still. Old-school Swedish bakery atmosphere with outstanding pastries baked according to traditional recipes. Famous for the Lars-Kristerz pastry and irresistible Mandelkubben. Hot, strong coffee and a wonderfully cozy atmosphere.',
    reviews: [
      'A must visit in Älvdalen. Time stands still here — old style touch and a cozy atmosphere. Try the Lars-Kristerz pastry!',
      'VERY cozy little café. Bakes according to old recipes. The Mandelkubben is WOW — buy a bag!'
    ],
    tip: 'Grab a Lars-Kristerz pastry and a Mandelkubben. Pair with a strong Swedish coffee — best fika in the region.'
  },

  // ─── ADDITIONAL NATURE & HIKING (full municipality) ───
  {
    id: 'stopfallet',
    name: 'Stopfallet Waterfall',
    category: 'nature',
    lat: 61.3195, lon: 13.8835,
    rating: 4.7, ratingCount: 133,
    address: '796 90 Älvdalen',
    hours: [],
    description: 'A scenic waterfall set among striking red porphyry rock formations south of Älvdalen. Short but steep walk to reach it. The colourful rock surroundings make this waterfall especially photogenic — one local reviewer calls it a top attraction in all of Dalarna.',
    reviews: [
      'Short trekking, but a scenic waterfall in the wild — the red rocks add more beauty to the place.',
      'This should be one of the top attractions in Dalarna. A place for meditation.'
    ],
    tip: 'Very close to Stops Vattenfall — combine both into one short trip. Good walking shoes essential for the steep path.'
  },
  {
    id: 'silverfallet',
    name: 'Silverfallet Waterfall',
    category: 'nature',
    lat: 62.0961, lon: 12.2516,
    rating: 4.5, ratingCount: 173,
    address: 'Near Grövelsjön, Idre',
    hours: ['Mon–Sun: Open 24 hours'],
    description: 'A beautiful, secluded waterfall near Grövelsjön Fjällstation in the far north of Älvdalen municipality. Easy walk on wooden planks through pristine sub-alpine nature. The water is crystal clear and very cold. A perfect day-hike destination from the mountain station.',
    reviews: [
      'Not a big waterfall but beautiful — really nice walk destination from Grövelsjön Fjällstation.',
      'Very beautiful, nice hike with wood planks to make it extra easy. Really nice and small secluded waterfall.'
    ],
    tip: 'Accessible year-round but especially magical in late summer and autumn colours. The water is glacier-cold — swim at your own risk!'
  },
  {
    id: 'fjatfallen',
    name: 'Fjätfallen Waterfall & Trail',
    category: 'nature',
    lat: 61.9395, lon: 13.0498,
    rating: 4.6, ratingCount: 330,
    address: '797 91 Särna',
    hours: ['Mon–Sun: Open 24 hours'],
    description: 'A wonderfully enchanting nature spot near Särna — a 6.2 km marked loop trail past a beautiful waterfall with excellent fish-watching spots in the river. The new bridge and riverside picnic areas make it a perfect family day out. Free and easily accessible parking.',
    reviews: [
      'Super day trip — saw the falls, watched fish, took the 6.2 km hike. It was just right.',
      'A wonderfully enchanting nature that has something magical. Scenic and well worth a visit with free parking and picnic areas.'
    ],
    tip: 'The 6.2 km loop is well-signed with some rocky parts. Bring a picnic and enjoy the riverside benches on the far side of the bridge.'
  },
  {
    id: 'stora-fjatfallet',
    name: 'Stora Fjätfallet Nature Reserve',
    category: 'nature',
    lat: 61.6707, lon: 13.2555,
    rating: 4.7, ratingCount: 124,
    address: '797 91 Särna',
    hours: ['Mon–Sun: Open 24 hours'],
    description: 'A spectacular waterfall reserve just 10 minutes from Särna. A powerful waterfall set in pristine forest with a picnic area, fireplace, and weather shelter. Great for kids to explore the rocks. The roaring water and forest setting make it unforgettable.',
    reviews: [
      'Wonderful place — 10 minutes distance from Särna. We saw lots of fish in the water and kids climbed around and had a great time.',
      'Very beautiful picnic area next to waterfall. A nice place for a visit after a rest at Sporthotell Särna.'
    ],
    tip: 'Winter road may be impassable by car — worth a 3 km snowshoe walk in. In summer, normal cars reach it easily.'
  },
  {
    id: 'hornafallet',
    name: 'Hornåfallet Waterfall',
    category: 'nature',
    lat: 61.5708, lon: 13.3936,
    rating: 4.5, ratingCount: 14,
    address: 'Near Kryptjärn, Älvdalen',
    hours: ['Mon–Sun: Open 24 hours'],
    description: 'A hidden gem waterfall reached by a scenic gravel road and short forest walk through Älvdalen municipality. Very secluded with few visitors. Drive from Särna towards Sveg, after Kryptjärn take the gravel road right towards Skrullvre for about 15 km, then walk 5 minutes.',
    reviews: [
      'Very nice little waterfall. Drive from Särna towards Sveg — after Kryptjärn follow the gravel road, park and walk 5 minutes.',
      'Steep climb from the road through the forest. Slightly poorly signposted. Beautiful nature experience!'
    ],
    tip: 'The 15 km gravel approach road is rough — go slowly. Worth it for the solitude and beauty.'
  },
  {
    id: 'gryvalan',
    name: 'Gryvålans Naturreservat',
    category: 'nature',
    lat: 61.3901, lon: 13.4767,
    rating: 4.5, ratingCount: 11,
    address: '796 99 Älvdalen',
    hours: ['Mon–Sun: Open 24 hours'],
    description: 'A rich nature reserve of fine bogs, natural forest, and small lakes deep in Älvdalen municipality. Trails range from 1.3 to 5 km on boardwalks through marsh and woodland. Preserved historic buildings illustrate past uses: bog mowing, forestry, and bog iron production — all with informative signs.',
    reviews: [
      'Beautiful hikes! Shorter and longer ones, the longest about 5 km. Comparable to Hamra National Park.',
      'Total silence, a beautiful brook, a small forest lake. Beautiful paths across boardwalks through marsh and woodland.'
    ],
    tip: 'The 7 km approach is rough gravel with limited passing places — go carefully. Sturdy footwear essential due to wood ants on the trail!'
  },
  {
    id: 'bjornan',
    name: 'Björnån Circular Trail & Lake',
    category: 'nature',
    lat: 61.3784, lon: 13.2697,
    rating: 5.0, ratingCount: 6,
    address: 'Sörsjon, Älvdalen municipality',
    hours: [],
    description: 'A beautiful 3.5 km circular hiking trail around a pristine forest lake, partly on boardwalks. Crystal-clear lake water, a cozy shelter with fire pit, and excellent birdwatching — osprey and raven sightings reported. A quiet overnight spot in the heart of the forest.',
    reviews: [
      'Crystal clear water in the lake, super cozy shelter with a good fire pit and a very nice walk around it.',
      'Beautiful walk, definitely recommended! Spotted an osprey and raven along the way.'
    ],
    tip: 'Bring firewood and food — the shelter is perfect for an overnight stay under the stars.'
  },
  {
    id: 'norra-mora-vildmark',
    name: 'Norra Mora Vildmark Reserve',
    category: 'nature',
    lat: 61.5027, lon: 14.1929,
    rating: 4.2, ratingCount: 5,
    address: '796 99 Älvdalen (eastern side)',
    hours: ['Mon–Sun: Open 24 hours'],
    description: 'A high-plateau nature reserve on the eastern edge of Älvdalen municipality with vast marshland, small trees, and well-signposted hiking trails right alongside the road. Beautiful panoramic views. Winter arrives early and stays late at this elevation.',
    reviews: [
      'Very accessible with hiking trails right next to the road! Located on a high plateau — winter comes earlier and ends later.',
      'Beautiful hiking trails in beautiful nature! For nature lovers... great!'
    ],
    tip: 'Pack layers — the plateau is exposed and cold even in summer. Great for solitude and birdwatching.'
  },
  {
    id: 'fallen-lovbacken',
    name: 'Fallen i Lövåsbäcken',
    category: 'nature',
    lat: 61.3908, lon: 14.0080,
    rating: 4.5, ratingCount: 2,
    address: 'Bössbo, Älvdalen municipality',
    hours: [],
    description: 'A hidden little waterfall in rugged terrain near Bössbo — no on-site signage or trail markings, making it a true off-the-beaten-path find for adventurous explorers. The surrounding forest and stream make the effort worthwhile for those who seek it out.',
    reviews: [
      'There is no information on site that tells you there are waterfalls. It is rugged terrain, but it is worth the trouble.',
      'Lovely little cascade!'
    ],
    tip: 'Use GPS coordinates to navigate — there are no signs. Best visited in spring for highest water levels.'
  },

  // ─── ADDITIONAL SPORTS & ACTIVITIES ───
  {
    id: 'sarnaadventures',
    name: 'Särna Adventures',
    category: 'sports',
    lat: 61.6937, lon: 13.1369,
    rating: 5.0, ratingCount: 32,
    address: 'Särnavägen 133, Särna',
    phone: '+46 73 600 04 56',
    hours: ['Mon–Sat: 8 AM–8 PM', 'Sun: 8 AM–4 PM'],
    description: 'A perfect 5-star adventure company in Särna offering ice bathing with sauna tent, wilderness navigation courses, climbing, outdoor cooking (bush-cooked waffles!), wood chopping, and guided nature experiences. Run by passionate guide Daniel, deeply knowledgeable about local nature.',
    reviews: [
      'We had a wonderful experience — ice bathing with a sauna tent! Daniel was a fantastic host. His coffee, bread and fika were perfect!',
      'Super fun, great guidance. Challenging climbing course, good equipment, and fantastic outdoor cooking!'
    ],
    tip: 'Book the ice bath + sauna experience in winter — one of the most memorable things to do in Dalarna. Perfect for groups and families.'
  },
  {
    id: 'alvdalen-camping',
    name: 'Älvdalens Camping',
    category: 'sports',
    lat: 61.2295, lon: 14.0280,
    rating: 4.2, ratingCount: 657,
    address: 'Ribbholmsvägen 26, Älvdalen',
    phone: '+46 251 123 44',
    hours: ['Mon–Fri: 8 AM–5 PM'],
    description: 'Well-located campsite on the banks of the Österdalälven river in central Älvdalen. Options range from tent pitches to cozy tent cabins and larger cottages. Adjacent to the swimming hall, with BBQ areas, fishing shop, and just 5 minutes walk to restaurants and shops.',
    reviews: [
      'Tent cabin was very cosy with great heating. Area is beautiful — mountains all around and a big river just outside the cabins.',
      'Perfect place to camp and refresh. Very good showers, clean toilets, enough kitchen space. Small stuga for only 350 SEK!'
    ],
    tip: 'Book the riverside tent cabins for the best views of the Dalälven. Bring your fishing gear — great river access from the site.'
  },

  // ─── ADDITIONAL SKI RESORTS ───
  {
    id: 'skistar-salen',
    name: 'SkiStar Sälen',
    category: 'skiing',
    lat: 61.1643, lon: 13.1873,
    rating: 4.0, ratingCount: 238,
    address: 'Sälfällsgården, 780 91 Sälen',
    phone: '+46 77 184 00 00',
    hours: [],
    description: 'Sweden\'s largest ski resort area in the southwest corner of Älvdalen municipality. Sälen encompasses multiple interconnected resorts — Lindvallen, Tandådalen, Hundfjället, and Högfjället — with a huge variety of runs for all levels. Summer activities include swimming, cycling, frisbee golf, minigolf, and climbing parks.',
    reviews: [
      'Fantastic place with lots of activities for the whole family — minigolf, swimming, cycling, skiing, frisbee golf, climbing park.',
      'The best SkiStar resort I\'ve been to. Many fun routes and summer activities are great too.'
    ],
    tip: 'Download the SkiStar app before you go — the resort is cashless. Summer activities are underrated here!'
  },
  {
    id: 'lindvallen',
    name: 'SkiStar Lindvallen',
    category: 'skiing',
    lat: 61.1604, lon: 13.1958,
    rating: 4.4, ratingCount: 1780,
    address: 'Fjällvägen 25, 780 91 Sälen',
    phone: '+46 77 184 00 00',
    hours: [],
    description: 'The most popular of the Sälen ski resorts — a great family-friendly mountain with a good mix of slopes from beginner to intermediate. Excellent snow from Christmas to Easter. Multiple accommodation options, shops, and restaurants on-site. Bus connections between all Sälen mountains.',
    reviews: [
      'Great small family resort with amazing snow conditions and something for everyone.',
      'Excellent family-orientated ski resort — significantly cheaper than Norway with plenty of snow from Christmas to Easter.'
    ],
    tip: 'Easiest to reach via Oslo airport (4 hrs drive) or across the Øresund Bridge. A car is very helpful for getting around the resort.'
  },

  // ─── ADDITIONAL RESTAURANTS ───
  {
    id: 'idregrillen',
    name: 'Idregrillen',
    category: 'restaurants',
    lat: 61.8580, lon: 12.7264,
    rating: 4.3, ratingCount: 1003,
    address: 'Gläntsvägen 2, Idre',
    phone: '+46 253 205 80',
    hours: ['Mon–Sun: 11 AM–9 PM'],
    description: 'The most popular restaurant in Idre village — reliable, varied menu of pizza, kebab, burgers, and pasta with quick service and generous portions. Gluten-free pizza available on request. Great English-speaking staff and very good value for a mountain area.',
    reviews: [
      'Perfect place to have food before going on hikes. Kebab meat is the best option.',
      'Gluten-free options available — both the gluten-free and normal pizza were tasty! Great service.'
    ],
    tip: 'The large oxfile pizza is enormous — order regular size unless feeding a family. Gluten-free pizza always available on request.'
  },
  {
    id: 'pizzeria-capri',
    name: 'Pizzeria Capri Särna',
    category: 'restaurants',
    lat: 61.6942, lon: 13.1358,
    rating: 4.0, ratingCount: 869,
    address: 'Särnavägen 137A, Särna',
    phone: '+46 253 100 55',
    hours: ['Mon–Thu: 11 AM–9 PM', 'Fri–Sat: 11 AM–10 PM', 'Sun: 11 AM–9 PM'],
    description: 'The go-to restaurant in Särna — warm, family-friendly atmosphere with a wide menu of pizza, kebab, and Swedish specials. Quick and efficient service. The special pizza assortment with creative combinations is particularly recommended.',
    reviews: [
      'On a snowy winter day, we had lunch here with our family and really enjoyed it. Warm and friendly, quick service.',
      'Go for the special pizza assortment — really fun and tasty combinations! Very efficient service.'
    ],
    tip: 'Order from the special pizza menu for the best experience. Great value for a mountain-area restaurant.'
  },
  {
    id: 'cafe-gosen',
    name: 'Café Gosen Gördalens Bystuga',
    category: 'restaurants',
    lat: 61.5952, lon: 12.4959,
    rating: 4.5, ratingCount: 112,
    address: 'Gördalen 40, Särna',
    phone: '+46 70 277 61 13',
    hours: ['Thu–Sat: 11 AM–9 PM', 'Sun: 11 AM–7 PM', 'Mon–Wed: Closed'],
    description: 'A beloved village café-restaurant tucked in the remote Gördalen valley near Fulufjället. Generous portions of omelettes, plank steak, burgers, and pizza in a warm, attentive atmosphere. A legendary destination for hikers completing the trail from Sälen over Fulufjället.',
    reviews: [
      'We ordered an omelette and it was one of the tastiest I have eaten — very filling too.',
      'After hiking from Sälen over Fulufjället to reach Gördalen, there was an extremely big reward — wonderful place, service, and food!!'
    ],
    tip: 'Check their Facebook page for current hours. An unmissable stop for Fulufjället through-hikers.'
  },

  // ─── ADDITIONAL CAFÉS ───
  {
    id: 'turistgarden',
    name: 'B&B Turistgården Särna – Café & Restaurant',
    category: 'cafes',
    lat: 61.6938, lon: 13.1245,
    rating: 4.7, ratingCount: 177,
    address: 'Sjukstugevägen 4, Särna',
    phone: '+46 253 58 03 33',
    hours: ['Mon–Sun: 7 AM–10 PM'],
    description: 'A true hidden gem in Särna — a charming historic doctor\'s house turned B&B with an outstanding restaurant serving locally foraged multi-course dinners. The café is legendary for fresh-baked cardamom buns, hjortronbullar (cloudberry rolls), and cinnamon pastries. A 5-star kitchen in the heart of the wilderness.',
    reviews: [
      'The true star is the restaurant — hand-picked local fruits and vegetables made into a multi-course dinner. An actual 5-star restaurant with a master chef.',
      'The best kanel and kardamombullar in Sweden! So juicy, delicious, and sweet. The owners put so much love into it.'
    ],
    tip: 'Even if not staying overnight, stop for legendary cardamom buns and coffee. Book dinner well in advance — it fills up fast.'
  },
  {
    id: 'jotli-cafe',
    name: 'Jotli Café (Mountain Farm)',
    category: 'cafes',
    lat: 62.0702, lon: 12.3157,
    rating: 4.7, ratingCount: 14,
    address: 'Near Grövelsjön, Idre',
    hours: ['Summer season — check ahead (Thu guided tours 3 PM)'],
    description: 'An extraordinary café in a historic mountain farm deep in the sub-alpine landscape near Grövelsjön. Accessible on foot or skis only. Serves homemade waffles with cloudberry jam, stomp with reindeer steak, cinnamon buns, and hot chocolate. Guided farm tours on Thursdays.',
    reviews: [
      'Genuine mountain farm in old environment. Delicious hot chocolate with whipped cream. Homemade stomp with reindeer steak.',
      'A great day trip destination! The old farm is very interesting. The café is lovingly decorated with delicious cakes.'
    ],
    tip: 'Guided farm tours every Thursday at 3 PM in summer. Accessible by ski in winter — a truly magical experience. Check Facebook for open days.'
  },

  // ─── PHARMACY ───
  {
    id: 'apotek-bjornen',
    name: 'Apoteket Björnen',
    category: 'pharmacy',
    lat: 61.2309, lon: 14.0377,
    rating: 4.2, ratingCount: 38,
    address: 'Furuvägen 3, 796 30 Älvdalen',
    phone: '+46 771 450 450',
    hours: ['Mon–Fri: 09:30–18:00', 'Sat: 10:00–13:00', 'Sun: Closed'],
    description: 'The only full pharmacy in the entire Älvdalen municipality. Stocks prescription and over-the-counter medicines, pharmacy goods, and health products. Also serves as the nearest pickup point for online pharmacy orders. The Coop stores in Idre and Särna act as pharmacy agents (apoteksombud) for basic OTC products.',
    reviews: [
      'The only pharmacy in the municipality — essential stop before heading north to Idre or Särna where there is no pharmacy.',
      'Friendly and helpful staff. Small but well-stocked for a local pharmacy.'
    ],
    tip: 'Stock up on all medicines here before heading to Idre or Särna — there are no full pharmacies further north. Coop Idre and Coop Särna carry limited OTC items as pharmacy agents.'
  },

  // ─── GROCERY STORES ───
  {
    id: 'ica-olssons',
    name: 'ICA Supermarket Olssons',
    category: 'grocery',
    lat: 61.2301, lon: 14.0341,
    rating: 4.1, ratingCount: 312,
    address: 'Dalgatan 75, 796 30 Älvdalen',
    phone: '+46 251 100 30',
    hours: ['Mon–Fri: 08:00–20:00', 'Sat: 08:00–18:00', 'Sun: 10:00–18:00'],
    description: 'The main supermarket in Älvdalen — a full-range ICA Supermarket with a wide selection of groceries, fresh produce, meat counter, bakery, and household goods. The best-stocked store in the municipality. Also carries local Dalarna specialties.',
    reviews: [
      'Well stocked for a small town supermarket. Good fresh meat and produce section.',
      'The go-to shop in Älvdalen — has pretty much everything you need for a mountain stay.'
    ],
    tip: 'Best grocery stop before heading north to Idre or Särna. Stock up here as choices thin out dramatically further up the valley.'
  },
  {
    id: 'ica-idrebua',
    name: 'ICA Supermarket Idrebua',
    category: 'grocery',
    lat: 61.8574, lon: 12.7215,
    rating: 4.0, ratingCount: 187,
    address: 'Byvägen 19, 796 90 Idre',
    phone: '+46 253 201 22',
    hours: ['Mon–Fri: 08:00–20:00', 'Sat: 08:00–18:00', 'Sun: 10:00–17:00'],
    description: 'The largest grocery store in Idre village — a well-stocked ICA Supermarket with a good range of food, drinks, and essentials. Popular with locals and tourists heading to or from Idre Fjäll. Has a deli counter and local products.',
    reviews: [
      'Good selection for a mountain town — much better than the small shop at the ski resort.',
      'Reliable supermarket. Staff are friendly and it\'s well stocked especially in ski season.'
    ],
    tip: 'Shop here rather than at the resort ICA — far better selection and lower prices. Opens early for ski-day supplies.'
  },
  {
    id: 'coop-idre',
    name: 'Coop Konsum Idre',
    category: 'grocery',
    lat: 61.8600, lon: 12.7230,
    rating: 3.9, ratingCount: 94,
    address: 'Byvägen 23A, 796 90 Idre',
    phone: '+46 253 200 78',
    hours: ['Mon–Fri: 08:00–20:00', 'Sat: 09:00–18:00', 'Sun: 10:00–17:00'],
    description: 'A Coop Konsum grocery store in Idre village, also serving as a pharmacy agent (apoteksombud) with a selection of over-the-counter medicines. Convenient alternative to ICA Idrebua just across the road.',
    reviews: [
      'Handy for top-ups. Also sells basic OTC medicines as a pharmacy agent.',
      'Smaller than ICA but well located and friendly staff.'
    ],
    tip: 'Acts as a pharmacy agent — pick up basic OTC medicines here if you forgot something from the pharmacy in Älvdalen.'
  },
  {
    id: 'coop-sarna',
    name: 'Coop Konsum Särna',
    category: 'grocery',
    lat: 61.6942, lon: 13.1213,
    rating: 4.0, ratingCount: 143,
    address: 'Särnavägen 121C, 790 90 Särna',
    phone: '+46 10 747 4800',
    hours: ['Mon–Fri: 08:00–20:00', 'Sat: 08:00–18:00', 'Sun: 10:00–17:00'],
    description: 'The main grocery store in Särna, also serving as a pharmacy agent with OTC medicines. Good range of essentials, local products, and basic outdoor supplies. The last well-stocked grocery option before heading northwest towards Fulufjället or Gördalen.',
    reviews: [
      'A decent supermarket for a small mountain village. Good range of essentials and local products.',
      'Serves as pharmacy agent too — good to know when travelling in the area without a full pharmacy nearby.'
    ],
    tip: 'Last proper grocery stop before Fulufjället and Gördalen heading northwest. Stock up for multi-day hikes here.'
  },
  {
    id: 'ica-idrefjall',
    name: 'ICA Nära Idre Fjäll',
    category: 'grocery',
    lat: 61.8900, lon: 12.8340,
    rating: 3.8, ratingCount: 76,
    address: 'Idre Fjäll, 796 92 Idre',
    phone: '+46 253 410 45',
    hours: ['Mon–Sun: 07:00–22:00 (digital 24h access)'],
    description: 'A small ICA Nära convenience store at the Idre Fjäll ski resort, open daily with extended hours. Features digital 24-hour self-service access with BankID outside staffed hours — ideal for late arrivals or early risers. Basic groceries, ski snacks, and essentials.',
    reviews: [
      'Very convenient for the resort — open early and late. The 24h digital access is genuinely useful.',
      'Small but covers the basics. Prices are resort-level but the convenience is worth it.'
    ],
    tip: 'Use the 24-hour digital BankID entry outside staffed hours. Handy but pricey — shop at ICA Idrebua in the village for better value.'
  },
  {
    id: 'narlivs-fjatervalen',
    name: 'Närlivsbutik Fjätervålen',
    category: 'grocery',
    lat: 61.9600, lon: 13.0500,
    rating: 4.3, ratingCount: 28,
    address: 'Fjätervålen, 796 92 Idre',
    phone: '+46 253 211 42',
    hours: ['Mon–Sun: 07:00–22:00 (digital BankID 24h)'],
    description: 'A small unmanned grocery store at the Fjätervålen ski resort, run on digital self-service with BankID. Focus on local products with a curated range of quality food items. Open 24 hours with BankID access — one of the most remote convenience stores in Dalarna.',
    reviews: [
      'Brilliant concept — 24h access with BankID. Great range of local products.',
      'Very convenient for the resort. Local products and fresh food. Open round the clock!'
    ],
    tip: 'Download the BankID app before arriving if you don\'t have it — you\'ll need it for out-of-hours access. Focus on local Swedish products.'
  },
  {
    id: 'ica-salen',
    name: 'ICA Nära Sälen',
    category: 'grocery',
    lat: 61.1580, lon: 13.2080,
    rating: 3.9, ratingCount: 110,
    address: 'Sälenvägen, 780 91 Sälen',
    phone: '+46 280 200 20',
    hours: ['Mon–Fri: 08:00–20:00', 'Sat: 08:00–18:00', 'Sun: 10:00–17:00'],
    description: 'Convenience grocery store in the Sälen ski resort area. Covers the basics for a mountain stay with groceries, fresh items, and resort essentials. Multiple grocery options exist across the various Sälen sub-resorts (Lindvallen, Tandådalen, Hundfjället).',
    reviews: [
      'Decent selection for a resort store. Prices are typical resort level.',
      'Covers everything you need for a week\'s stay. The bakery section is good.'
    ],
    tip: 'Multiple ICA and Coop stores across the Sälen resort area — the one at Lindvallen is typically the most accessible.'
  },

  // ─── GAS STATIONS ───
  {
    id: 'circlek-alvdalen',
    name: 'Circle K Älvdalen',
    category: 'fuel',
    lat: 61.2285, lon: 14.0365,
    rating: 3.8, ratingCount: 42,
    address: 'Villavägen 56, 796 30 Älvdalen',
    phone: '+46 20 32 03 00',
    hours: ['Mon–Sun: Open 24 hours (automated)'],
    description: 'The main fuel station in Älvdalen — a 24-hour automated Circle K station with petrol, diesel, and HVO100 (renewable diesel). Card payment only at the pump. Also has basic snacks and car essentials available. The primary fuel stop before heading north towards Idre and Särna.',
    reviews: [
      'Works well as an automated station — 24h card payment at the pump.',
      'Essential stop before heading up to Idre and Särna. Fill up here as there are fewer options further north.'
    ],
    tip: 'Fill up here before heading north — fuel options are limited in Idre and non-existent on the road between. Card payment only.'
  },
  {
    id: 'okq8-sarna',
    name: 'OKQ8 Särna',
    category: 'fuel',
    lat: 61.6933, lon: 13.1421,
    rating: 3.7, ratingCount: 31,
    address: 'Särnavägen 114, 790 90 Särna',
    phone: '+46 253 103 66',
    hours: ['Mon–Fri: 07:00–20:00', 'Sat–Sun: 08:00–18:00'],
    description: 'OKQ8 fuel station in Särna — the main fuel stop in the Särna area. Sells petrol and diesel with a staffed shop. Also has the Dalakraft EV fast charger on site (Mer network). A convenient stop combining fuel, EV charging, and basic shop on the route north.',
    reviews: [
      'Good to have a staffed fuel station in Särna. EV charger available on the same site.',
      'Clean station, friendly staff. Good stop on the way to Idre or Fulufjället.'
    ],
    tip: 'EV fast charger (50kW, Mer network) is located on-site. Good combined stop for both petrol and EV drivers.'
  },
  {
    id: 'gulf-idre',
    name: 'Gulf Idre',
    category: 'fuel',
    lat: 61.8615, lon: 12.7228,
    rating: 3.6, ratingCount: 24,
    address: 'Byvägen 24, 796 90 Idre',
    phone: '+46 253 201 12',
    hours: ['Mon–Sun: 07:00–21:00'],
    description: 'The main Gulf fuel station in Idre village with petrol and diesel. Staffed with a small convenience shop. One of the few fuel options in the Idre area — conveniently located in the village near the ICA and Coop stores.',
    reviews: [
      'Reliable fuel stop in Idre. Good location near the supermarkets.',
      'Small but functional. Only real fuel option in Idre village.'
    ],
    tip: 'Fill up before heading to Idre Fjäll or Fjätervålen — no fuel at the resorts themselves (except the private tank at Idre Fjäll).'
  },
  {
    id: 'okq8-salen',
    name: 'OKQ8 Sälen',
    category: 'fuel',
    lat: 61.1560, lon: 13.2045,
    rating: 3.9, ratingCount: 87,
    address: 'Sälenvägen, 780 91 Sälen',
    phone: '+46 280 880 00',
    hours: ['Mon–Sun: Open 24 hours'],
    description: 'Main OKQ8 fuel station at Sälen with 24-hour automated pumps for petrol and diesel. Staffed shop during daytime hours. Well located at the entrance to the Sälen resort area.',
    reviews: [
      'Well placed for arriving and departing from the resort. 24h pumps are handy.',
      'Good automated station — easy to use, accepts all major cards.'
    ],
    tip: 'Fill up on arrival or before leaving Sälen — queues can build up on weekend departure days (Sunday afternoon).'
  },

  // ─── EV CHARGING ───
  {
    id: 'ev-alvdalen',
    name: 'EV Charging – Älvdalen (Dalakraft/Mer)',
    category: 'ev',
    lat: 61.2295, lon: 14.0360,
    rating: 4.1, ratingCount: 19,
    address: 'Dalgatan 81C, 796 30 Älvdalen',
    phone: '+46 248 48 80 00',
    hours: ['Mon–Sun: Open 24 hours'],
    description: 'Dalakraft fast charger in central Älvdalen, part of the Mer network. CCS and CHAdeMO connectors available at up to 50kW. Use the Mer Sverige app or contactless payment to start charging. One of the most important charging stops in northern Dalarna — the next fast charger north is in Särna (80km away).',
    reviews: [
      'Essential stop for EV drivers going north. Works well with the Mer app.',
      'Good location in town near shops and restaurants — easy to combine with a lunch break.'
    ],
    tip: 'Use the Mer Sverige app for easiest payment. Plan ahead — Älvdalen to Idre is 80+ km with no fast charger in between except Särna.'
  },
  {
    id: 'ev-sarna',
    name: 'EV Charging – Särna (Dalakraft/Mer)',
    category: 'ev',
    lat: 61.6933, lon: 13.1421,
    rating: 3.9, ratingCount: 34,
    address: 'Särnavägen 114, 790 90 Särna (at OKQ8)',
    phone: '+46 77 44 33 900',
    hours: ['Mon–Sun: Open 24 hours'],
    description: 'Fast charger at the OKQ8 station in Särna, operated by Mer (Dalakraft network). CCS and CHAdeMO at 50kW. Critical charging point midway between Älvdalen and Idre. Three parking spaces with charge points. Pay via Mer app or EasyPark.',
    reviews: [
      'Vital charging stop on the way north. Charged at 39-50kW. Worked well.',
      'Good location next to the OKQ8 shop. Nice to have a coffee while charging.'
    ],
    tip: 'The only fast charger between Älvdalen and Idre. Don\'t skip it if battery is below 60% — the road to Idre is hilly and cold in winter.'
  },
  {
    id: 'ev-idre',
    name: 'EV Charging – Idre (Grövelsjövägen)',
    category: 'ev',
    lat: 61.8620, lon: 12.7268,
    rating: 4.0, ratingCount: 22,
    address: 'Grövelsjövägen 495, 796 90 Idre',
    hours: ['Mon–Sun: Open 24 hours'],
    description: 'Public EV fast charger in Idre village with CCS connectors. Two charging points serving the Idre area. Ideal stop for drivers continuing north to Grövelsjön or returning south after a stay at Idre Fjäll.',
    reviews: [
      'Works well. Two CCS connectors available. Used the Mer app.',
      'Reliable charger in Idre — charged up before continuing to Grövelsjön.'
    ],
    tip: 'Charge here before driving up to Idre Fjäll or Grövelsjön — no fast charger available at the top.'
  },
  {
    id: 'ev-idrefjall',
    name: 'EV Charging – Idre Fjäll (EasyPark)',
    category: 'ev',
    lat: 61.8893, lon: 12.8322,
    rating: 4.2, ratingCount: 41,
    address: 'Idre Fjäll Shop, 796 92 Idre',
    hours: ['Mon–Sun: Open 24 hours'],
    description: 'Four EV charging points at the Idre Fjäll resort shop, operated via EasyPark app. Both CCS and Type 2 connectors available. Conveniently located at the main resort hub. Download the EasyPark app before arriving for seamless payment.',
    reviews: [
      'Four chargers at the shop — handy for overnight resort guests.',
      'EasyPark app works well. Good to charge while skiing or dining at the resort.'
    ],
    tip: 'Download the EasyPark app before arriving — it\'s the only payment method. Great for overnight charging while you sleep at the resort.'
  },
  {
    id: 'ev-salen',
    name: 'EV Charging – Sälen (Dalakraft/Mer)',
    category: 'ev',
    lat: 61.1576, lon: 13.2041,
    rating: 4.0, ratingCount: 53,
    address: 'Sälen centrum, 780 91 Sälen',
    hours: ['Mon–Sun: Open 24 hours'],
    description: 'Dalakraft fast charger in Sälen, part of the Mer network. Multiple connectors including CCS/Combo and CHAdeMO. Located in the main Sälen village parking area. Additional Type 2 chargers available at individual resort hotels (Lindvallen, Tandådalen). Also EV chargers at ICA Nära Sälen parking.',
    reviews: [
      'Good fast charger in Sälen. Works well with the Mer app.',
      'Multiple options in the area — this one at centrum is the most centrally located.'
    ],
    tip: 'The Sälen area has the most EV charging options in the municipality — Dalakraft, Bee, and individual hotel chargers all available. Book ahead for hotel chargers in peak season.'
  },
  {
    id: 'ev-fjatervalen',
    name: 'EV Charging – Fjätervålen (EasyPark)',
    category: 'ev',
    lat: 61.9600, lon: 13.0500,
    rating: 4.1, ratingCount: 17,
    address: 'Fjätervålen Shop, 796 92 Idre',
    hours: ['Mon–Sun: Open 24 hours'],
    description: 'Four EV charging outlets at Fjätervålen resort shop via EasyPark. Located by the shop entrance. A convenient and often overlooked charging option for those staying at Fjätervålen — the chargers are rarely busy.',
    reviews: [
      'Four outlets at the shop — easy to use with EasyPark. Rarely congested.',
      'Great setup at the resort. Charged overnight and it was perfect.'
    ],
    tip: 'Download the EasyPark app in advance. Much less busy than Idre Fjäll chargers. Perfect for overnight charging during your stay.'
  },
];

@Injectable({providedIn: 'root'})
export class PlacesService {
  readonly categories = CATEGORIES;
  readonly allPlaces = ALL_PLACES;

  readonly searchTerm = signal('');
  readonly activeCategoryFilters = signal(new Set(Object.keys(CATEGORIES)));

  readonly filteredPlaces = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const filters = this.activeCategoryFilters();
    return this.allPlaces.filter(p =>
      filters.has(p.category) &&
      (!term || p.name.toLowerCase().includes(term))
    );
  });

  readonly totalPlaces = ALL_PLACES.length;
  readonly totalCategories = Object.keys(CATEGORIES).length;

  getPlaceById(id: string): Place | undefined {
    return this.allPlaces.find(p => p.id === id);
  }

  getMapsLink(place: Place): string {
    return MAPS_LINKS[place.id] ?? `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lon}`;
  }

  toggleCategory(key: string): void {
    this.activeCategoryFilters.update(filters => {
      const next = new Set(filters);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }

  geoToImg(lat: number, lon: number): { px: number; py: number } {
    let wpx = 0, wpy = 0, tw = 0;
    for (const g of GCP_POINTS) {
      const d = Math.sqrt((lat - g.lat) ** 2 + (lon - g.lon) ** 2);
      if (d < 1e-9) return {px: g.px, py: g.py};
      const w = 1 / Math.pow(d, 2.5);
      wpx += w * g.px;
      wpy += w * g.py;
      tw += w;
    }
    return {px: wpx / tw, py: wpy / tw};
  }
}
