"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunksailing_pairs"] = self["webpackChunksailing_pairs"] || []).push([["docs_randomize_js"],{

/***/ "./docs/randomize.js":
/*!***************************!*\
  !*** ./docs/randomize.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _pairs_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pairs.js */ \"./docs/pairs.js\");\n/* harmony import */ var _info_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./info.js */ \"./docs/info.js\");\n\r\n\r\nrandomPairs.addEventListener('click', async () => {\r\n    // console.log(byBoatCount)\r\n    console.log('settings', _pairs_js__WEBPACK_IMPORTED_MODULE_0__.byPos, _pairs_js__WEBPACK_IMPORTED_MODULE_0__.byBoatCount, _pairs_js__WEBPACK_IMPORTED_MODULE_0__.byPrevParts)\r\n    //Create locked pair list with blank slots\r\n    let lockedPairs = []\r\n    for (let i = 0; i < _pairs_js__WEBPACK_IMPORTED_MODULE_0__.slotsLength / 3; i++) {\r\n        for (let j = 1; j < 3; j++) {\r\n            if (pairingHolder.children[i].children[j] != undefined && pairingHolder.children[i].children[j].children[0] != undefined && _pairs_js__WEBPACK_IMPORTED_MODULE_0__.locked.includes(pairingHolder.children[i].children[j].children[0].innerHTML)) {\r\n                // console.log(i)\r\n                lockedPairs.push(pairingHolder.children[i].children[j].children[0].innerHTML)\r\n            } else lockedPairs.push('')\r\n        }\r\n    }\r\n    console.log(lockedPairs)\r\n\r\n    //Get list of non absent people\r\n    let shuffledNames = _pairs_js__WEBPACK_IMPORTED_MODULE_0__.names.slice()\r\n    if (_pairs_js__WEBPACK_IMPORTED_MODULE_0__.byBoatCount) {\r\n        shuffledNames = await getBoatCount(true)\r\n    }\r\n    console.log(shuffledNames)\r\n    for (let i = shuffledNames.length - 1; i >= 0; i--) {\r\n        console.log(shuffledNames[i])\r\n        if (_pairs_js__WEBPACK_IMPORTED_MODULE_0__.absent.includes(shuffledNames[i]) || lockedPairs.includes(shuffledNames[i])) {\r\n            console.log(`${shuffledNames[i]} is absent or locked`)\r\n            shuffledNames.splice(i, 1)\r\n            // console.log(shuffledNames)\r\n        }\r\n    }\r\n    console.log(shuffledNames)\r\n\r\n    let newNames = []\r\n    if (_pairs_js__WEBPACK_IMPORTED_MODULE_0__.byPos) {\r\n        let skippers = []\r\n        let crews = []\r\n        for (let i = 0; i < shuffledNames.length; i++) {\r\n            if (_info_js__WEBPACK_IMPORTED_MODULE_1__.people[_pairs_js__WEBPACK_IMPORTED_MODULE_0__.season][_pairs_js__WEBPACK_IMPORTED_MODULE_0__.team][_info_js__WEBPACK_IMPORTED_MODULE_1__.people[_pairs_js__WEBPACK_IMPORTED_MODULE_0__.season][_pairs_js__WEBPACK_IMPORTED_MODULE_0__.team].findIndex((e) => e.name == shuffledNames[i])].skipper && !(skippers.length >= shuffledNames.length / 2)) {\r\n                skippers.push(shuffledNames[i])\r\n                // console.log(shuffledNames[i], \" is a skipper \", people[people.findIndex((e) => e.name == shuffledNames[i])].skipper);\r\n            } else {\r\n                crews.push(shuffledNames[i])\r\n            }\r\n        }\r\n        console.log(skippers, crews)\r\n\r\n        let currentIndex = skippers.length,\r\n            randomIndex\r\n        if (!_pairs_js__WEBPACK_IMPORTED_MODULE_0__.byBoatCount) {\r\n            while (currentIndex != 0) {\r\n                randomIndex = Math.floor(Math.random() * currentIndex)\r\n                currentIndex--\r\n                ;[skippers[currentIndex], skippers[randomIndex]] = [skippers[randomIndex], skippers[currentIndex]]\r\n            }\r\n        }\r\n\r\n        //shuffle crews\r\n        ;(currentIndex = crews.length), randomIndex\r\n\r\n        while (currentIndex != 0) {\r\n            randomIndex = Math.floor(Math.random() * currentIndex)\r\n            currentIndex--\r\n            ;[crews[currentIndex], crews[randomIndex]] = [crews[randomIndex], crews[currentIndex]]\r\n        }\r\n        console.log(skippers, crews)\r\n\r\n        //Shuffle skippers here\r\n\r\n        let pairings\r\n        if (_pairs_js__WEBPACK_IMPORTED_MODULE_0__.byPrevParts) {\r\n            // options = {\r\n            //     method: 'POST',\r\n            //     headers: { 'Content-Type': 'application/json' },\r\n            //     body: JSON.stringify({}),\r\n            // }\r\n            // loadingEl.style.display = 'block'\r\n            // const response = await fetch(API_URL + '/getPairsOfficial', options)\r\n            // pairings = await response.json()\r\n            pairings = await (0,_pairs_js__WEBPACK_IMPORTED_MODULE_0__.getPairsOfficial)()\r\n        }\r\n\r\n        let lpI = 0\r\n        for (let i = 0; i < _pairs_js__WEBPACK_IMPORTED_MODULE_0__.slotsLength / 3; i++) {\r\n            // find crew for given skipper\r\n            // console.log('Locked pair', lockedPairs[lpI], lpI)\r\n            let skipper\r\n            if (lockedPairs[lpI] != '') {\r\n                skipper = lockedPairs[lpI]\r\n                newNames.push(lockedPairs[lpI])\r\n            } else {\r\n                skipper = skippers[0]\r\n                newNames.push(skippers[0])\r\n                skippers.splice(skippers.indexOf(skippers[0]), 1)\r\n            }\r\n            console.log('Skipper:', skipper)\r\n            lpI++\r\n            if (skipper) {\r\n                let crew\r\n                let prevPairs\r\n                if (lockedPairs[lpI] != '') crew = lockedPairs[lpI]\r\n                else {\r\n                    if (_pairs_js__WEBPACK_IMPORTED_MODULE_0__.byPrevParts) {\r\n                        prevPairs = await (0,_pairs_js__WEBPACK_IMPORTED_MODULE_0__.getPrevPartners)(skipper, pairings)\r\n                        for (let j = 0; j < crews.length; j++) {\r\n                            if (!prevPairs.includes(crews[j])) {\r\n                                crew = crews[j]\r\n                                break\r\n                            }\r\n                        }\r\n                    } else {\r\n                        crew = crews[0]\r\n                    }\r\n                    if (crew == undefined && _pairs_js__WEBPACK_IMPORTED_MODULE_0__.byPrevParts) {\r\n                        let frequency = {}\r\n                        for (let i = 0; i < prevPairs.length; i++) {\r\n                            frequency[prevPairs[i]] = prevPairs.filter((x) => x === prevPairs[i]).length\r\n                        }\r\n                        console.log('Frequency', frequency)\r\n                        const sortable = Object.entries(frequency)\r\n                            .sort((a, b) => a[1] - b[1])\r\n                            .map((el) => el[0])\r\n                        let j = 0\r\n                        while (_pairs_js__WEBPACK_IMPORTED_MODULE_0__.locked.includes(sortable[j]) || _pairs_js__WEBPACK_IMPORTED_MODULE_0__.absent.includes(sortable[j])) j++\r\n                        crew = sortable[j]\r\n                    }\r\n                }\r\n                newNames.push(crew)\r\n                crews.splice(crews.indexOf(crew), 1)\r\n            }\r\n            console.log('Crews:', crews)\r\n            lpI++\r\n            console.log('skippers:', skippers)\r\n        }\r\n    } else {\r\n        let currentIndex = shuffledNames.length,\r\n            randomIndex\r\n        if (!_pairs_js__WEBPACK_IMPORTED_MODULE_0__.byBoatCount) {\r\n            while (currentIndex != 0) {\r\n                randomIndex = Math.floor(Math.random() * currentIndex)\r\n                currentIndex--\r\n                ;[shuffledNames[currentIndex], shuffledNames[randomIndex]] = [shuffledNames[randomIndex], shuffledNames[currentIndex]]\r\n            }\r\n        }\r\n        newNames = shuffledNames\r\n        if (newNames.length > (_pairs_js__WEBPACK_IMPORTED_MODULE_0__.slotsLength / 3) * 2) {\r\n            newNames = newNames.slice(0, (_pairs_js__WEBPACK_IMPORTED_MODULE_0__.slotsLength / 3) * 2)\r\n        }\r\n    }\r\n\r\n    (0,_pairs_js__WEBPACK_IMPORTED_MODULE_0__.makeNames)(newNames)\r\n    ;(0,_pairs_js__WEBPACK_IMPORTED_MODULE_0__.makePairs)(newNames)\r\n})\r\n\n\n//# sourceURL=webpack://sailing-pairs/./docs/randomize.js?");

/***/ })

}]);