"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunksailing_pairs"] = self["webpackChunksailing_pairs"] || []).push([["docs_info_js"],{

/***/ "./docs/info.js":
/*!**********************!*\
  !*** ./docs/info.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"mobileSize\": () => (/* binding */ mobileSize),\n/* harmony export */   \"people\": () => (/* binding */ people)\n/* harmony export */ });\n// const API_URL = 'https://bhspairs.herokuapp.com' // For deployment\n// const API_URL = 'https://bhspairs.onrender.com' // For deployment\nconst API_URL = 'http://localhost:3000' // For development\n\nconst people = {\n    'Fall 2022': {\n        Varsity: [\n            { name: 'Adam', skipper: true, crew: false, partner: 'Cyrus' },\n            { name: 'Alexander', skipper: true, crew: false, partner: 'Zephyr' },\n            { name: 'Andrea', skipper: false, crew: true, partner: '' },\n            { name: 'Ava', skipper: true, crew: true, weight: 113, partner: 'Ben' },\n            { name: 'Ben', skipper: true, crew: false, partner: 'Ava' },\n            { name: 'Beto', skipper: true, crew: false, partner: 'Fin' },\n            { name: 'Carson', skipper: false, crew: true, partner: '' },\n            {\n                name: 'Carter',\n                skipper: true,\n                crew: false,\n                weight: 152,\n                picks: ['Sabrina', 'Elliott', 'Talia', 'Jaya'],\n                pic: 'https://35b7f1d7d0790b02114c-1b8897185d70b198c119e1d2b7efd8a2.ssl.cf1.rackcdn.com/roster_full_photos/83071916/original/d436c99f-76cc-4838-a257-a84324c2599d.jpg',\n                partner: 'Sabrina',\n            },\n            { name: 'Chris', skipper: false, crew: true, partner: 'Joseph' },\n            { name: 'Cole', skipper: false, crew: true, partner: '' },\n            { name: 'Cyrus', skipper: false, crew: true, partner: 'Adam' },\n            { name: 'Elliott', skipper: true, crew: true, weight: 135, partner: 'Gretchen F' },\n            { name: 'Fin', skipper: false, crew: true, partner: 'Beto' },\n            { name: 'Gretchen F', skipper: false, crew: true, partner: 'Elliott' },\n            { name: 'Gretchen I', skipper: false, crew: true, partner: '' },\n            { name: 'Holden', skipper: false, crew: true, partner: '' },\n            { name: 'Isaia', skipper: true, crew: true, partner: '' },\n            { name: 'Jaya', skipper: true, crew: true, partner: 'Jeffery' },\n            { name: 'Jeffrey', skipper: true, crew: true, partner: 'Jaya' },\n            { name: 'Joseph', skipper: true, crew: true, partner: 'Chris' },\n            { name: 'Kai', skipper: false, crew: true, partner: 'Ryan' },\n            { name: 'Luke', skipper: true, crew: true, partner: 'Payton' },\n            { name: 'Maura', skipper: true, crew: true, partner: '' },\n            { name: 'Nelson', skipper: true, crew: true, partner: '' },\n            { name: 'Nick', skipper: false, crew: true, partner: '' },\n            { name: 'Nolan', skipper: true, crew: false, partner: 'Talia', weight: 145 },\n            { name: 'Owen', skipper: true, crew: false, partner: 'Sharkey' },\n            { name: 'Payton', skipper: false, crew: true, partner: 'Luke' },\n            { name: 'Ryan', skipper: true, crew: false, partner: 'Kai', weight: 160 },\n            { name: 'Sabrina', skipper: false, crew: true, partner: 'Carter', weight: 105 },\n            { name: 'Sharkey', skipper: false, crew: true, partner: 'Owen' },\n            { name: 'Stella', skipper: false, crew: true, partner: '' },\n            { name: 'Suraj', skipper: false, crew: true, partner: '' },\n            { name: 'Talia', skipper: false, crew: true, partner: 'Nolan', weight: 109 },\n            { name: 'Zephyr', skipper: false, crew: true, partner: 'Alexander' },\n        ],\n        'Jr. Varsity': [{ name: 'Nobody :)' }],\n    },\n    'Spring 2023': {\n        Varsity: [\n            { name: 'Adam', skipper: true, crew: false, partner: 'Cyrus' },\n            { name: 'Alexander', skipper: true, crew: false, partner: 'Zephyr' },\n            { name: 'Andrea', skipper: false, crew: true, partner: '' },\n            { name: 'Ava', skipper: true, crew: true, weight: 113, partner: 'Ben' },\n            { name: 'Ben', skipper: true, crew: false, partner: 'Ava' },\n            { name: 'Beto', skipper: true, crew: false, partner: 'Fin' },\n            { name: 'Carson', skipper: false, crew: true, partner: '' },\n            {\n                name: 'Carter',\n                skipper: true,\n                crew: false,\n                weight: 152,\n                picks: ['Sabrina', 'Elliott', 'Talia', 'Jaya'],\n                pic: 'https://35b7f1d7d0790b02114c-1b8897185d70b198c119e1d2b7efd8a2.ssl.cf1.rackcdn.com/roster_full_photos/83071916/original/d436c99f-76cc-4838-a257-a84324c2599d.jpg',\n                partner: 'Sabrina',\n            },\n            { name: 'Cascade', skipper: true, crew: true, partner: '' },\n            { name: 'Chris', skipper: false, crew: true, partner: 'Joseph' },\n            { name: 'Cole', skipper: false, crew: true, partner: '' },\n            { name: 'Cyrus', skipper: false, crew: true, partner: 'Adam' },\n            { name: 'Elliott', skipper: true, crew: true, weight: 135, partner: 'Gretchen F' },\n            { name: 'Fin', skipper: false, crew: true, partner: 'Beto' },\n            { name: 'Gretchen F', skipper: false, crew: true, partner: 'Elliott' },\n            { name: 'Gretchen I', skipper: false, crew: true, partner: '' },\n            { name: 'Holden', skipper: false, crew: true, partner: '' },\n            { name: 'Jaya', skipper: true, crew: true, partner: 'Jeffery' },\n            { name: 'Jeffrey', skipper: true, crew: true, partner: 'Jaya' },\n            { name: 'Joseph', skipper: true, crew: true, partner: 'Chris' },\n            { name: 'Kai', skipper: false, crew: true, partner: 'Ryan' },\n            { name: 'Luke', skipper: true, crew: true, partner: 'Payton' },\n            { name: 'Maura', skipper: true, crew: true, partner: '' },\n            { name: 'Nelson', skipper: true, crew: true, partner: '' },\n            { name: 'Nick', skipper: false, crew: true, partner: '' },\n            { name: 'Nolan', skipper: true, crew: false, partner: 'Talia', weight: 145 },\n            { name: 'Owen', skipper: true, crew: false, partner: 'Sharkey' },\n            { name: 'Payton', skipper: false, crew: true, partner: 'Luke' },\n            { name: 'Ryan', skipper: true, crew: false, partner: 'Kai', weight: 160 },\n            { name: 'Sabrina', skipper: false, crew: true, partner: 'Carter', weight: 105 },\n            { name: 'Sharkey', skipper: false, crew: true, partner: 'Owen' },\n            { name: 'Stella', skipper: false, crew: true, partner: '' },\n            { name: 'Suraj', skipper: false, crew: true, partner: '' },\n            { name: 'Talia', skipper: false, crew: true, partner: 'Nolan', weight: 109 },\n            { name: 'Zephyr', skipper: false, crew: true, partner: 'Alexander' },\n        ],\n        'Jr. Varsity': [{ name: 'soon™' }],\n    },\n}\n\n// Name list\n// const names = {\n//   'Fall 2022': { Varsity: ['Adam', 'Alexander', 'Andrea', 'Ava', 'Ben', 'Beto', 'Carson', 'Carter', 'Chris', 'Cole', 'Cyrus', 'Elliott', 'Fin', 'Gretchen F', 'Gretchen I', 'Holden', 'Isaia', 'Jaya', 'Jeffrey', 'Joseph', 'Kai', 'Luke', 'Maura', 'Nelson', 'Nick', 'Nolan', 'Owen', 'Payton', 'Ryan', 'Sabrina', 'Sharkey', 'Stella', 'Suraj', 'Talia', 'Zephyr'], 'Jr. Varsity': ['Yuhh', 'Shall we?', 'Yodie Gang', 'Come in', 'Fulcrum', 'Need I say more?', 'Fadedthanaho'] },\n//   'Spring 2023': { Varsity: ['Adam', 'Alexander', 'Andrea', 'Ava', 'Ben', 'Beto', 'Carson', 'Carter', 'Chris', 'Cole', 'Cyrus', 'Elliott', 'Fin', 'Gretchen F', 'Gretchen I', 'Holden', 'Isaia', 'Jaya', 'Jeffrey', 'Joseph', 'Kai', 'Luke', 'Maura', 'Nelson', 'Nick', 'Nolan', 'Owen', 'Payton', 'Ryan', 'Sabrina', 'Sharkey', 'Stella', 'Suraj', 'Talia', 'Zephyr'], 'Jr. Varsity': [] },\n// }\n\nconst mobileSize = '1000px'\n\n/* speculation lmao\nVarsity: [\n      { name: 'Adam', skipper: true, crew: false, partner: 'Cyrus' },\n      { name: 'Alexander', skipper: true, crew: false, partner: 'Zephyr' },\n      { name: 'Andrea', skipper: false, crew: true, partner: '' },\n      { name: 'Ava', skipper: true, crew: true, weight: 113, partner: 'Ben' },\n      { name: 'Ben', skipper: true, crew: false, partner: 'Ava' },\n      { name: 'Beto', skipper: true, crew: false, partner: 'Fin' },\n      {\n        name: 'Carter',\n        skipper: true,\n        crew: false,\n        weight: 152,\n        picks: ['Sabrina', 'Elliott', 'Talia', 'Jaya'],\n        pic: 'https://35b7f1d7d0790b02114c-1b8897185d70b198c119e1d2b7efd8a2.ssl.cf1.rackcdn.com/roster_full_photos/83071916/original/d436c99f-76cc-4838-a257-a84324c2599d.jpg',\n        partner: 'Sabrina',\n      },\n      { name: 'Cascade', skipper: true, crew: true, partner: '' },\n      { name: 'Chris', skipper: false, crew: true, partner: 'Joseph' },\n      { name: 'Cyrus', skipper: false, crew: true, partner: 'Adam' },\n      { name: 'Elliott', skipper: true, crew: true, weight: 135, partner: 'Gretchen F' },\n      { name: 'Fin', skipper: false, crew: true, partner: 'Beto' },\n      { name: 'Jaya', skipper: true, crew: true, partner: 'Jeffery' },\n      { name: 'Jeffrey', skipper: true, crew: true, partner: 'Jaya' },\n      { name: 'Joseph', skipper: true, crew: true, partner: 'Chris' },\n      { name: 'Kai', skipper: false, crew: true, partner: 'Ryan' },\n      { name: 'Luke', skipper: true, crew: true, partner: 'Payton' },\n      { name: 'Nelson', skipper: true, crew: true, partner: '' },\n      { name: 'Nick', skipper: false, crew: true, partner: '' },\n      { name: 'Nolan', skipper: true, crew: false, partner: 'Talia', weight: 145 },\n      { name: 'Owen', skipper: true, crew: false, partner: 'Sharkey' },\n      { name: 'Ryan', skipper: true, crew: false, partner: 'Kai', weight: 160 },\n      { name: 'Sabrina', skipper: false, crew: true, partner: 'Carter', weight: 105 },\n      { name: 'Sharkey', skipper: false, crew: true, partner: 'Owen' },\n      { name: 'Stella', skipper: false, crew: true, partner: '' },\n      { name: 'Talia', skipper: false, crew: true, partner: 'Nolan', weight: 109 },\n    ],\n    'Jr. Varsity': [\n      { name: 'Carson', skipper: false, crew: true, partner: '' },\n      { name: 'Cole', skipper: false, crew: true, partner: '' },\n      { name: 'Gretchen F', skipper: false, crew: true, partner: 'Elliott' },\n      { name: 'Gretchen I', skipper: false, crew: true, partner: '' },\n      { name: 'Holden', skipper: false, crew: true, partner: '' },\n      { name: 'Maura', skipper: true, crew: true, partner: '' },\n      { name: 'Payton', skipper: false, crew: true, partner: 'Luke' },\n      { name: 'Suraj', skipper: false, crew: true, partner: '' },\n      { name: 'Zephyr', skipper: false, crew: true, partner: 'Alexander' },\n    ],\n*/\n\n\n\n\n//# sourceURL=webpack://sailing-pairs/./docs/info.js?");

/***/ })

}]);