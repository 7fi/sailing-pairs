"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunksailing_pairs"] = self["webpackChunksailing_pairs"] || []).push([["docs_client_js"],{

/***/ "./docs/client.js":
/*!************************!*\
  !*** ./docs/client.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"compareFn\": () => (/* binding */ compareFn),\n/* harmony export */   \"compareFnObj\": () => (/* binding */ compareFnObj),\n/* harmony export */   \"findDuplicates\": () => (/* binding */ findDuplicates),\n/* harmony export */   \"formatDate\": () => (/* binding */ formatDate),\n/* harmony export */   \"padTo2Digits\": () => (/* binding */ padTo2Digits),\n/* harmony export */   \"setTheme\": () => (/* binding */ setTheme),\n/* harmony export */   \"switchMode\": () => (/* binding */ switchMode)\n/* harmony export */ });\n/* harmony import */ var _info_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./info.js */ \"./docs/info.js\");\n\r\n//import { season, team } from './pairs.js'\r\n\r\n//Grab elements from dom\r\nconst loadingEl = document.getElementById('loadingEl')\r\nconst settingsBtn = document.getElementById('settingsButton')\r\nconst infoButton = document.getElementById('infoButton')\r\nconst infoWindow = document.getElementById('infoWindow')\r\nconst settingsWindow = document.getElementById('settingsWindow')\r\nconst squareMode = document.getElementById('squareMode')\r\nconst modeToggle = document.getElementById('modeToggle')\r\nconst fontSelect = document.getElementById('fontSelect')\r\n\r\nlet lightMode = true\r\nlet square = false\r\n\r\nvar thisPage\r\nconsole.log(window.location.href.split('/'))\r\nif (window.location.href.includes('scores')) {\r\n    thisPage = 'scores'\r\n} else {\r\n    thisPage = 'main'\r\n}\r\n\r\n/*else if(window.location.href.split(\"/\")[window.location.href.split(\"/\").length - 1] != \"\"){\r\n    console.log(window.location.href.split(\"/\")[window.location.href.split(\"/\").length - 1]);\r\n} */\r\n\r\n//Check for mobile (only works on reload)\r\nlet mobile = window.matchMedia(`only screen and (max-width: ${_info_js__WEBPACK_IMPORTED_MODULE_0__.mobileSize})`).matches\r\nconst observer = new ResizeObserver((entries) => {\r\n    mobile = window.matchMedia(`only screen and (max-width: ${_info_js__WEBPACK_IMPORTED_MODULE_0__.mobileSize})`).matches\r\n})\r\nobserver.observe(document.body)\r\n\r\nlet findDuplicates = (arr) => arr.filter((item, index) => arr.indexOf(item) != index)\r\n\r\nfontSelect.value = localStorage.getItem('font') ? localStorage.getItem('font') : fontSelect.value\r\ndocument.documentElement.style.setProperty('--font', fontSelect.value)\r\nconst currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null\r\nif (currentTheme) {\r\n    document.documentElement.setAttribute('data-theme', currentTheme)\r\n    if (currentTheme === 'dark') {\r\n        switchMode()\r\n    }\r\n}\r\n\r\nfunction padTo2Digits(num) {\r\n    return num.toString().padStart(2, '0')\r\n}\r\n\r\nfunction formatDate(date, dateOffset) {\r\n    return [date.getFullYear(), padTo2Digits(date.getMonth() + 1), padTo2Digits(date.getDate() + dateOffset)].join('-')\r\n}\r\n\r\nfunction compareFn(a, b, obj) {\r\n    let aMonth = parseInt(a.split(' ')[1].split('/')[0])\r\n    let aDay = parseInt(a.split(' ')[1].split('/')[1])\r\n    let bMonth = parseInt(b.split(' ')[1].split('/')[0])\r\n    let bDay = parseInt(b.split(' ')[1].split('/')[1])\r\n    let num = 0\r\n    if (aMonth < bMonth) num = -1\r\n    else if (aMonth == bMonth && aDay < bDay) num = -1\r\n    else if (aMonth == bMonth && aDay > bDay) num = 1\r\n    else if (aMonth > bMonth) num = 1\r\n    // else return 0\r\n    return num\r\n}\r\n\r\nfunction compareFnObj(a, b) {\r\n    let aMonth = parseInt(a.name.split(' ')[1].split('/')[0])\r\n    let aDay = parseInt(a.name.split(' ')[1].split('/')[1])\r\n    let bMonth = parseInt(b.name.split(' ')[1].split('/')[0])\r\n    let bDay = parseInt(b.name.split(' ')[1].split('/')[1])\r\n    let num = 0\r\n    if (aMonth < bMonth) num = -1\r\n    else if (aMonth == bMonth && aDay < bDay) num = -1\r\n    else if (aMonth == bMonth && aDay > bDay) num = 1\r\n    else if (aMonth > bMonth) num = 1\r\n    // else return 0\r\n    return num\r\n}\r\n\r\nsettingsBtn.addEventListener('click', () => {\r\n    settingsWindow.style.display = 'block'\r\n})\r\nsettingsWindow.addEventListener('click', (e) => {\r\n    if (e.target == settingsWindow) settingsWindow.style.display = 'none'\r\n})\r\n\r\n// Toggle between light and dark mode\r\nmodeToggle.addEventListener('click', () => {\r\n    switchMode()\r\n})\r\n// infoButton.addEventListener('click', () => {\r\n//     infoWindow.style.display = 'block'\r\n// })\r\n// infoWindow.addEventListener('click', (e) => {\r\n//     if (e.target == infoWindow) infoWindow.style.display = 'none'\r\n// })\r\n\r\nfunction switchMode() {\r\n    if (!lightMode) {\r\n        modeToggle.children[0].classList.replace('fa-sun', 'fa-moon')\r\n        document.documentElement.setAttribute('data-theme', 'light')\r\n        localStorage.setItem('theme', 'light')\r\n    } else {\r\n        modeToggle.children[0].classList.replace('fa-moon', 'fa-sun')\r\n        document.documentElement.setAttribute('data-theme', 'dark')\r\n        localStorage.setItem('theme', 'dark')\r\n    }\r\n\r\n    lightMode = !lightMode\r\n    // console.log(lightMode, 'HI')\r\n}\r\nfunction setTheme(theme) {\r\n    document.documentElement.setAttribute('data-theme', theme)\r\n    localStorage.setItem('theme', theme)\r\n    console.log('Theme set to', theme)\r\n}\r\n\r\n// console.log(pickSternTier() + ' is assigned to do stern ties')\r\nfunction pickSternTier() {\r\n    let potentialPpl = []\r\n    _info_js__WEBPACK_IMPORTED_MODULE_0__.people[\"Fall 2022\"].forEach((person) => {\r\n        if (person.name != 'Elliott') potentialPpl.push(person.name)\r\n    })\r\n    return potentialPpl[Math.floor(Math.random() * potentialPpl.length)]\r\n}\r\n\r\n\r\n\n\n//# sourceURL=webpack://sailing-pairs/./docs/client.js?");

/***/ }),

/***/ "./docs/info.js":
/*!**********************!*\
  !*** ./docs/info.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"firebaseConfig\": () => (/* binding */ firebaseConfig),\n/* harmony export */   \"mobileSize\": () => (/* binding */ mobileSize),\n/* harmony export */   \"people\": () => (/* binding */ people)\n/* harmony export */ });\nconst firebaseConfig = {\r\n    apiKey: 'AIzaSyAIlmAr8qfAjVweURTIvOmvNbZzlii1QXc',\r\n    authDomain: 'bhspairs.firebaseapp.com',\r\n    projectId: 'bhspairs',\r\n    storageBucket: 'bhspairs.appspot.com',\r\n    messagingSenderId: '853792589116',\r\n    appId: '1:853792589116:web:0d634d29b62ae7cab90a39',\r\n    measurementId: 'G-KPRQEN42TT',\r\n}\r\n\r\nlet localHost = false\r\nif (localHost) {\r\n    firebaseConfig = {}\r\n}\r\n\r\nconst people = {\r\n    'Fall 2022': {\r\n        Varsity: [\r\n            { name: 'Adam', skipper: true, crew: false, partner: 'Cyrus' },\r\n            { name: 'Alexander', skipper: true, crew: false, partner: 'Zephyr' },\r\n            { name: 'Andrea', skipper: false, crew: true, partner: '' },\r\n            { name: 'Ava', skipper: true, crew: true, weight: 113, partner: 'Ben' },\r\n            { name: 'Ben', skipper: true, crew: false, partner: 'Ava' },\r\n            { name: 'Beto', skipper: true, crew: false, partner: 'Fin' },\r\n            { name: 'Carson', skipper: false, crew: true, partner: '' },\r\n            {\r\n                name: 'Carter',\r\n                skipper: true,\r\n                crew: false,\r\n                weight: 152,\r\n                picks: ['Sabrina', 'Elliott', 'Talia', 'Jaya'],\r\n                pic: 'https://35b7f1d7d0790b02114c-1b8897185d70b198c119e1d2b7efd8a2.ssl.cf1.rackcdn.com/roster_full_photos/83071916/original/d436c99f-76cc-4838-a257-a84324c2599d.jpg',\r\n                partner: 'Sabrina',\r\n            },\r\n            { name: 'Chris', skipper: false, crew: true, partner: 'Joseph' },\r\n            { name: 'Cole', skipper: false, crew: true, partner: '' },\r\n            { name: 'Cyrus', skipper: false, crew: true, partner: 'Adam' },\r\n            { name: 'Elliott', skipper: true, crew: true, weight: 135, partner: 'Gretchen F' },\r\n            { name: 'Fin', skipper: false, crew: true, partner: 'Beto' },\r\n            { name: 'Gretchen F', skipper: false, crew: true, partner: 'Elliott' },\r\n            { name: 'Gretchen I', skipper: false, crew: true, partner: '' },\r\n            { name: 'Holden', skipper: false, crew: true, partner: '' },\r\n            { name: 'Isaia', skipper: true, crew: true, partner: '' },\r\n            { name: 'Jaya', skipper: true, crew: true, partner: 'Jeffery' },\r\n            { name: 'Jeffrey', skipper: true, crew: true, partner: 'Jaya' },\r\n            { name: 'Joseph', skipper: true, crew: true, partner: 'Chris' },\r\n            { name: 'Kai', skipper: false, crew: true, partner: 'Ryan' },\r\n            { name: 'Luke', skipper: true, crew: true, partner: 'Payton' },\r\n            { name: 'Maura', skipper: true, crew: true, partner: '' },\r\n            { name: 'Nelson', skipper: true, crew: true, partner: '' },\r\n            { name: 'Nick', skipper: false, crew: true, partner: '' },\r\n            { name: 'Nolan', skipper: true, crew: false, partner: 'Talia', weight: 145 },\r\n            { name: 'Owen', skipper: true, crew: false, partner: 'Sharkey' },\r\n            { name: 'Payton', skipper: false, crew: true, partner: 'Luke' },\r\n            { name: 'Ryan', skipper: true, crew: false, partner: 'Kai', weight: 160 },\r\n            { name: 'Sabrina', skipper: false, crew: true, partner: 'Carter', weight: 105 },\r\n            { name: 'Sharkey', skipper: false, crew: true, partner: 'Owen' },\r\n            { name: 'Stella', skipper: false, crew: true, partner: '' },\r\n            { name: 'Suraj', skipper: false, crew: true, partner: '' },\r\n            { name: 'Talia', skipper: false, crew: true, partner: 'Nolan', weight: 109 },\r\n            { name: 'Zephyr', skipper: false, crew: true, partner: 'Alexander' },\r\n        ],\r\n        'Jr. Varsity': [{ name: 'Nobody :)' }],\r\n    },\r\n    'Spring 2023': {\r\n        Varsity: [\r\n            { name: 'Adam', skipper: true, crew: false, partner: 'Cyrus' },\r\n            { name: 'Alexander', skipper: true, crew: false, partner: 'Zephyr' },\r\n            { name: 'Andrea', skipper: false, crew: true, partner: '' },\r\n            { name: 'Ava', skipper: true, crew: true, weight: 113, partner: 'Ben' },\r\n            { name: 'Ben', skipper: true, crew: false, partner: 'Ava' },\r\n            { name: 'Beto', skipper: true, crew: false, partner: 'Fin' },\r\n            { name: 'Carson', skipper: false, crew: true, partner: '' },\r\n            {\r\n                name: 'Carter',\r\n                skipper: true,\r\n                crew: false,\r\n                weight: 152,\r\n                picks: ['Sabrina', 'Elliott', 'Talia', 'Jaya'],\r\n                pic: 'https://35b7f1d7d0790b02114c-1b8897185d70b198c119e1d2b7efd8a2.ssl.cf1.rackcdn.com/roster_full_photos/83071916/original/d436c99f-76cc-4838-a257-a84324c2599d.jpg',\r\n                partner: 'Sabrina',\r\n            },\r\n            { name: 'Cascade', skipper: true, crew: true, partner: '' },\r\n            { name: 'Chris', skipper: false, crew: true, partner: 'Joseph' },\r\n            { name: 'Cole', skipper: false, crew: true, partner: '' },\r\n            { name: 'Cyrus', skipper: false, crew: true, partner: 'Adam' },\r\n            { name: 'Elliott', skipper: true, crew: true, weight: 135, partner: 'Gretchen F' },\r\n            { name: 'Fin', skipper: false, crew: true, partner: 'Beto' },\r\n            { name: 'Gretchen F', skipper: false, crew: true, partner: 'Elliott' },\r\n            { name: 'Gretchen I', skipper: false, crew: true, partner: '' },\r\n            { name: 'Holden', skipper: false, crew: true, partner: '' },\r\n            { name: 'Jaya', skipper: true, crew: true, partner: 'Jeffery' },\r\n            { name: 'Jeffrey', skipper: true, crew: true, partner: 'Jaya' },\r\n            { name: 'Joseph', skipper: true, crew: true, partner: 'Chris' },\r\n            { name: 'Kai', skipper: false, crew: true, partner: 'Ryan' },\r\n            { name: 'Luke', skipper: true, crew: true, partner: 'Payton' },\r\n            { name: 'Maura', skipper: true, crew: true, partner: '' },\r\n            { name: 'Nelson', skipper: true, crew: true, partner: '' },\r\n            { name: 'Nick', skipper: false, crew: true, partner: '' },\r\n            { name: 'Nolan', skipper: true, crew: false, partner: 'Talia', weight: 145 },\r\n            { name: 'Owen', skipper: true, crew: false, partner: 'Sharkey' },\r\n            { name: 'Payton', skipper: false, crew: true, partner: 'Luke' },\r\n            { name: 'Ryan', skipper: true, crew: false, partner: 'Kai', weight: 160 },\r\n            { name: 'Sabrina', skipper: false, crew: true, partner: 'Carter', weight: 105 },\r\n            { name: 'Sharkey', skipper: false, crew: true, partner: 'Owen' },\r\n            { name: 'Stella', skipper: false, crew: true, partner: '' },\r\n            { name: 'Suraj', skipper: false, crew: true, partner: '' },\r\n            { name: 'Talia', skipper: false, crew: true, partner: 'Nolan', weight: 109 },\r\n            { name: 'Zephyr', skipper: false, crew: true, partner: 'Alexander' },\r\n        ],\r\n        'Jr. Varsity': [{ name: 'soon™' }],\r\n    },\r\n}\r\n\r\n// Name list\r\n// const names = {\r\n//   'Fall 2022': { Varsity: ['Adam', 'Alexander', 'Andrea', 'Ava', 'Ben', 'Beto', 'Carson', 'Carter', 'Chris', 'Cole', 'Cyrus', 'Elliott', 'Fin', 'Gretchen F', 'Gretchen I', 'Holden', 'Isaia', 'Jaya', 'Jeffrey', 'Joseph', 'Kai', 'Luke', 'Maura', 'Nelson', 'Nick', 'Nolan', 'Owen', 'Payton', 'Ryan', 'Sabrina', 'Sharkey', 'Stella', 'Suraj', 'Talia', 'Zephyr'], 'Jr. Varsity': ['Yuhh', 'Shall we?', 'Yodie Gang', 'Come in', 'Fulcrum', 'Need I say more?', 'Fadedthanaho'] },\r\n//   'Spring 2023': { Varsity: ['Adam', 'Alexander', 'Andrea', 'Ava', 'Ben', 'Beto', 'Carson', 'Carter', 'Chris', 'Cole', 'Cyrus', 'Elliott', 'Fin', 'Gretchen F', 'Gretchen I', 'Holden', 'Isaia', 'Jaya', 'Jeffrey', 'Joseph', 'Kai', 'Luke', 'Maura', 'Nelson', 'Nick', 'Nolan', 'Owen', 'Payton', 'Ryan', 'Sabrina', 'Sharkey', 'Stella', 'Suraj', 'Talia', 'Zephyr'], 'Jr. Varsity': [] },\r\n// }\r\n\r\nconst mobileSize = '800px'\r\n\r\n/* speculation lmao\r\nVarsity: [\r\n      { name: 'Adam', skipper: true, crew: false, partner: 'Cyrus' },\r\n      { name: 'Alexander', skipper: true, crew: false, partner: 'Zephyr' },\r\n      { name: 'Andrea', skipper: false, crew: true, partner: '' },\r\n      { name: 'Ava', skipper: true, crew: true, weight: 113, partner: 'Ben' },\r\n      { name: 'Ben', skipper: true, crew: false, partner: 'Ava' },\r\n      { name: 'Beto', skipper: true, crew: false, partner: 'Fin' },\r\n      {\r\n        name: 'Carter',\r\n        skipper: true,\r\n        crew: false,\r\n        weight: 152,\r\n        picks: ['Sabrina', 'Elliott', 'Talia', 'Jaya'],\r\n        pic: 'https://35b7f1d7d0790b02114c-1b8897185d70b198c119e1d2b7efd8a2.ssl.cf1.rackcdn.com/roster_full_photos/83071916/original/d436c99f-76cc-4838-a257-a84324c2599d.jpg',\r\n        partner: 'Sabrina',\r\n      },\r\n      { name: 'Cascade', skipper: true, crew: true, partner: '' },\r\n      { name: 'Chris', skipper: false, crew: true, partner: 'Joseph' },\r\n      { name: 'Cyrus', skipper: false, crew: true, partner: 'Adam' },\r\n      { name: 'Elliott', skipper: true, crew: true, weight: 135, partner: 'Gretchen F' },\r\n      { name: 'Fin', skipper: false, crew: true, partner: 'Beto' },\r\n      { name: 'Jaya', skipper: true, crew: true, partner: 'Jeffery' },\r\n      { name: 'Jeffrey', skipper: true, crew: true, partner: 'Jaya' },\r\n      { name: 'Joseph', skipper: true, crew: true, partner: 'Chris' },\r\n      { name: 'Kai', skipper: false, crew: true, partner: 'Ryan' },\r\n      { name: 'Luke', skipper: true, crew: true, partner: 'Payton' },\r\n      { name: 'Nelson', skipper: true, crew: true, partner: '' },\r\n      { name: 'Nick', skipper: false, crew: true, partner: '' },\r\n      { name: 'Nolan', skipper: true, crew: false, partner: 'Talia', weight: 145 },\r\n      { name: 'Owen', skipper: true, crew: false, partner: 'Sharkey' },\r\n      { name: 'Ryan', skipper: true, crew: false, partner: 'Kai', weight: 160 },\r\n      { name: 'Sabrina', skipper: false, crew: true, partner: 'Carter', weight: 105 },\r\n      { name: 'Sharkey', skipper: false, crew: true, partner: 'Owen' },\r\n      { name: 'Stella', skipper: false, crew: true, partner: '' },\r\n      { name: 'Talia', skipper: false, crew: true, partner: 'Nolan', weight: 109 },\r\n    ],\r\n    'Jr. Varsity': [\r\n      { name: 'Carson', skipper: false, crew: true, partner: '' },\r\n      { name: 'Cole', skipper: false, crew: true, partner: '' },\r\n      { name: 'Gretchen F', skipper: false, crew: true, partner: 'Elliott' },\r\n      { name: 'Gretchen I', skipper: false, crew: true, partner: '' },\r\n      { name: 'Holden', skipper: false, crew: true, partner: '' },\r\n      { name: 'Maura', skipper: true, crew: true, partner: '' },\r\n      { name: 'Payton', skipper: false, crew: true, partner: 'Luke' },\r\n      { name: 'Suraj', skipper: false, crew: true, partner: '' },\r\n      { name: 'Zephyr', skipper: false, crew: true, partner: 'Alexander' },\r\n    ],\r\n*/\r\n\r\n\r\n\n\n//# sourceURL=webpack://sailing-pairs/./docs/info.js?");

/***/ })

}]);