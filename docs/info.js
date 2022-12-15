// const API_URL = 'https://bhspairs.herokuapp.com' // For deployment
// const API_URL = 'https://bhspairs.onrender.com' // For deployment
// const API_URL = 'http://localhost:3000' // For development

const firebaseConfig = {
    apiKey: 'AIzaSyAIlmAr8qfAjVweURTIvOmvNbZzlii1QXc',
    authDomain: 'bhspairs.firebaseapp.com',
    projectId: 'bhspairs',
    storageBucket: 'bhspairs.appspot.com',
    messagingSenderId: '853792589116',
    appId: '1:853792589116:web:0d634d29b62ae7cab90a39',
    measurementId: 'G-KPRQEN42TT',
}

const people = {
    'Fall 2022': {
        Varsity: [
            { name: 'Adam', skipper: true, crew: false, partner: 'Cyrus' },
            { name: 'Alexander', skipper: true, crew: false, partner: 'Zephyr' },
            { name: 'Andrea', skipper: false, crew: true, partner: '' },
            { name: 'Ava', skipper: true, crew: true, weight: 113, partner: 'Ben' },
            { name: 'Ben', skipper: true, crew: false, partner: 'Ava' },
            { name: 'Beto', skipper: true, crew: false, partner: 'Fin' },
            { name: 'Carson', skipper: false, crew: true, partner: '' },
            {
                name: 'Carter',
                skipper: true,
                crew: false,
                weight: 152,
                picks: ['Sabrina', 'Elliott', 'Talia', 'Jaya'],
                pic: 'https://35b7f1d7d0790b02114c-1b8897185d70b198c119e1d2b7efd8a2.ssl.cf1.rackcdn.com/roster_full_photos/83071916/original/d436c99f-76cc-4838-a257-a84324c2599d.jpg',
                partner: 'Sabrina',
            },
            { name: 'Chris', skipper: false, crew: true, partner: 'Joseph' },
            { name: 'Cole', skipper: false, crew: true, partner: '' },
            { name: 'Cyrus', skipper: false, crew: true, partner: 'Adam' },
            { name: 'Elliott', skipper: true, crew: true, weight: 135, partner: 'Gretchen F' },
            { name: 'Fin', skipper: false, crew: true, partner: 'Beto' },
            { name: 'Gretchen F', skipper: false, crew: true, partner: 'Elliott' },
            { name: 'Gretchen I', skipper: false, crew: true, partner: '' },
            { name: 'Holden', skipper: false, crew: true, partner: '' },
            { name: 'Isaia', skipper: true, crew: true, partner: '' },
            { name: 'Jaya', skipper: true, crew: true, partner: 'Jeffery' },
            { name: 'Jeffrey', skipper: true, crew: true, partner: 'Jaya' },
            { name: 'Joseph', skipper: true, crew: true, partner: 'Chris' },
            { name: 'Kai', skipper: false, crew: true, partner: 'Ryan' },
            { name: 'Luke', skipper: true, crew: true, partner: 'Payton' },
            { name: 'Maura', skipper: true, crew: true, partner: '' },
            { name: 'Nelson', skipper: true, crew: true, partner: '' },
            { name: 'Nick', skipper: false, crew: true, partner: '' },
            { name: 'Nolan', skipper: true, crew: false, partner: 'Talia', weight: 145 },
            { name: 'Owen', skipper: true, crew: false, partner: 'Sharkey' },
            { name: 'Payton', skipper: false, crew: true, partner: 'Luke' },
            { name: 'Ryan', skipper: true, crew: false, partner: 'Kai', weight: 160 },
            { name: 'Sabrina', skipper: false, crew: true, partner: 'Carter', weight: 105 },
            { name: 'Sharkey', skipper: false, crew: true, partner: 'Owen' },
            { name: 'Stella', skipper: false, crew: true, partner: '' },
            { name: 'Suraj', skipper: false, crew: true, partner: '' },
            { name: 'Talia', skipper: false, crew: true, partner: 'Nolan', weight: 109 },
            { name: 'Zephyr', skipper: false, crew: true, partner: 'Alexander' },
        ],
        'Jr. Varsity': [{ name: 'Nobody :)' }],
    },
    'Spring 2023': {
        Varsity: [
            { name: 'Adam', skipper: true, crew: false, partner: 'Cyrus' },
            { name: 'Alexander', skipper: true, crew: false, partner: 'Zephyr' },
            { name: 'Andrea', skipper: false, crew: true, partner: '' },
            { name: 'Ava', skipper: true, crew: true, weight: 113, partner: 'Ben' },
            { name: 'Ben', skipper: true, crew: false, partner: 'Ava' },
            { name: 'Beto', skipper: true, crew: false, partner: 'Fin' },
            { name: 'Carson', skipper: false, crew: true, partner: '' },
            {
                name: 'Carter',
                skipper: true,
                crew: false,
                weight: 152,
                picks: ['Sabrina', 'Elliott', 'Talia', 'Jaya'],
                pic: 'https://35b7f1d7d0790b02114c-1b8897185d70b198c119e1d2b7efd8a2.ssl.cf1.rackcdn.com/roster_full_photos/83071916/original/d436c99f-76cc-4838-a257-a84324c2599d.jpg',
                partner: 'Sabrina',
            },
            { name: 'Cascade', skipper: true, crew: true, partner: '' },
            { name: 'Chris', skipper: false, crew: true, partner: 'Joseph' },
            { name: 'Cole', skipper: false, crew: true, partner: '' },
            { name: 'Cyrus', skipper: false, crew: true, partner: 'Adam' },
            { name: 'Elliott', skipper: true, crew: true, weight: 135, partner: 'Gretchen F' },
            { name: 'Fin', skipper: false, crew: true, partner: 'Beto' },
            { name: 'Gretchen F', skipper: false, crew: true, partner: 'Elliott' },
            { name: 'Gretchen I', skipper: false, crew: true, partner: '' },
            { name: 'Holden', skipper: false, crew: true, partner: '' },
            { name: 'Jaya', skipper: true, crew: true, partner: 'Jeffery' },
            { name: 'Jeffrey', skipper: true, crew: true, partner: 'Jaya' },
            { name: 'Joseph', skipper: true, crew: true, partner: 'Chris' },
            { name: 'Kai', skipper: false, crew: true, partner: 'Ryan' },
            { name: 'Luke', skipper: true, crew: true, partner: 'Payton' },
            { name: 'Maura', skipper: true, crew: true, partner: '' },
            { name: 'Nelson', skipper: true, crew: true, partner: '' },
            { name: 'Nick', skipper: false, crew: true, partner: '' },
            { name: 'Nolan', skipper: true, crew: false, partner: 'Talia', weight: 145 },
            { name: 'Owen', skipper: true, crew: false, partner: 'Sharkey' },
            { name: 'Payton', skipper: false, crew: true, partner: 'Luke' },
            { name: 'Ryan', skipper: true, crew: false, partner: 'Kai', weight: 160 },
            { name: 'Sabrina', skipper: false, crew: true, partner: 'Carter', weight: 105 },
            { name: 'Sharkey', skipper: false, crew: true, partner: 'Owen' },
            { name: 'Stella', skipper: false, crew: true, partner: '' },
            { name: 'Suraj', skipper: false, crew: true, partner: '' },
            { name: 'Talia', skipper: false, crew: true, partner: 'Nolan', weight: 109 },
            { name: 'Zephyr', skipper: false, crew: true, partner: 'Alexander' },
        ],
        'Jr. Varsity': [{ name: 'soon™' }],
    },
}

// Name list
// const names = {
//   'Fall 2022': { Varsity: ['Adam', 'Alexander', 'Andrea', 'Ava', 'Ben', 'Beto', 'Carson', 'Carter', 'Chris', 'Cole', 'Cyrus', 'Elliott', 'Fin', 'Gretchen F', 'Gretchen I', 'Holden', 'Isaia', 'Jaya', 'Jeffrey', 'Joseph', 'Kai', 'Luke', 'Maura', 'Nelson', 'Nick', 'Nolan', 'Owen', 'Payton', 'Ryan', 'Sabrina', 'Sharkey', 'Stella', 'Suraj', 'Talia', 'Zephyr'], 'Jr. Varsity': ['Yuhh', 'Shall we?', 'Yodie Gang', 'Come in', 'Fulcrum', 'Need I say more?', 'Fadedthanaho'] },
//   'Spring 2023': { Varsity: ['Adam', 'Alexander', 'Andrea', 'Ava', 'Ben', 'Beto', 'Carson', 'Carter', 'Chris', 'Cole', 'Cyrus', 'Elliott', 'Fin', 'Gretchen F', 'Gretchen I', 'Holden', 'Isaia', 'Jaya', 'Jeffrey', 'Joseph', 'Kai', 'Luke', 'Maura', 'Nelson', 'Nick', 'Nolan', 'Owen', 'Payton', 'Ryan', 'Sabrina', 'Sharkey', 'Stella', 'Suraj', 'Talia', 'Zephyr'], 'Jr. Varsity': [] },
// }

const mobileSize = '800px'

/* speculation lmao
Varsity: [
      { name: 'Adam', skipper: true, crew: false, partner: 'Cyrus' },
      { name: 'Alexander', skipper: true, crew: false, partner: 'Zephyr' },
      { name: 'Andrea', skipper: false, crew: true, partner: '' },
      { name: 'Ava', skipper: true, crew: true, weight: 113, partner: 'Ben' },
      { name: 'Ben', skipper: true, crew: false, partner: 'Ava' },
      { name: 'Beto', skipper: true, crew: false, partner: 'Fin' },
      {
        name: 'Carter',
        skipper: true,
        crew: false,
        weight: 152,
        picks: ['Sabrina', 'Elliott', 'Talia', 'Jaya'],
        pic: 'https://35b7f1d7d0790b02114c-1b8897185d70b198c119e1d2b7efd8a2.ssl.cf1.rackcdn.com/roster_full_photos/83071916/original/d436c99f-76cc-4838-a257-a84324c2599d.jpg',
        partner: 'Sabrina',
      },
      { name: 'Cascade', skipper: true, crew: true, partner: '' },
      { name: 'Chris', skipper: false, crew: true, partner: 'Joseph' },
      { name: 'Cyrus', skipper: false, crew: true, partner: 'Adam' },
      { name: 'Elliott', skipper: true, crew: true, weight: 135, partner: 'Gretchen F' },
      { name: 'Fin', skipper: false, crew: true, partner: 'Beto' },
      { name: 'Jaya', skipper: true, crew: true, partner: 'Jeffery' },
      { name: 'Jeffrey', skipper: true, crew: true, partner: 'Jaya' },
      { name: 'Joseph', skipper: true, crew: true, partner: 'Chris' },
      { name: 'Kai', skipper: false, crew: true, partner: 'Ryan' },
      { name: 'Luke', skipper: true, crew: true, partner: 'Payton' },
      { name: 'Nelson', skipper: true, crew: true, partner: '' },
      { name: 'Nick', skipper: false, crew: true, partner: '' },
      { name: 'Nolan', skipper: true, crew: false, partner: 'Talia', weight: 145 },
      { name: 'Owen', skipper: true, crew: false, partner: 'Sharkey' },
      { name: 'Ryan', skipper: true, crew: false, partner: 'Kai', weight: 160 },
      { name: 'Sabrina', skipper: false, crew: true, partner: 'Carter', weight: 105 },
      { name: 'Sharkey', skipper: false, crew: true, partner: 'Owen' },
      { name: 'Stella', skipper: false, crew: true, partner: '' },
      { name: 'Talia', skipper: false, crew: true, partner: 'Nolan', weight: 109 },
    ],
    'Jr. Varsity': [
      { name: 'Carson', skipper: false, crew: true, partner: '' },
      { name: 'Cole', skipper: false, crew: true, partner: '' },
      { name: 'Gretchen F', skipper: false, crew: true, partner: 'Elliott' },
      { name: 'Gretchen I', skipper: false, crew: true, partner: '' },
      { name: 'Holden', skipper: false, crew: true, partner: '' },
      { name: 'Maura', skipper: true, crew: true, partner: '' },
      { name: 'Payton', skipper: false, crew: true, partner: 'Luke' },
      { name: 'Suraj', skipper: false, crew: true, partner: '' },
      { name: 'Zephyr', skipper: false, crew: true, partner: 'Alexander' },
    ],
*/

export { people, mobileSize, firebaseConfig }
