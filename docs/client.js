import { people, mobileSize } from './info.js'
import { season, team } from './pairs.js'

//Grab elements from dom
const loadingEl = document.getElementById('loadingEl')
const settingsBtn = document.getElementById('settingsButton')
const infoButton = document.getElementById('infoButton')
const infoWindow = document.getElementById('infoWindow')
const settingsWindow = document.getElementById('settingsWindow')
const squareMode = document.getElementById('squareMode')
const modeToggle = document.getElementById('modeToggle')
const fontSelect = document.getElementById('fontSelect')

let lightMode = true
let square = false

var thisPage
console.log(window.location.href.split('/'))
if (window.location.href.includes('scores')) {
    thisPage = 'scores'
} else {
    thisPage = 'main'
}

/*else if(window.location.href.split("/")[window.location.href.split("/").length - 1] != ""){
    console.log(window.location.href.split("/")[window.location.href.split("/").length - 1]);
} */

//Check for mobile (only works on reload)
let mobile = window.matchMedia(`only screen and (max-width: ${mobileSize})`).matches
const observer = new ResizeObserver((entries) => {
    mobile = window.matchMedia(`only screen and (max-width: ${mobileSize})`).matches
})
observer.observe(document.body)

let findDuplicates = (arr) => arr.filter((item, index) => arr.indexOf(item) != index)

fontSelect.value = localStorage.getItem('font') ? localStorage.getItem('font') : fontSelect.value
document.documentElement.style.setProperty('--font', fontSelect.value)
const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme)
    if (currentTheme === 'dark') {
        switchMode()
    }
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0')
}

function formatDate(date, dateOffset) {
    return [date.getFullYear(), padTo2Digits(date.getMonth() + 1), padTo2Digits(date.getDate() + dateOffset)].join('-')
}

function compareFn(a, b) {
    aMonth = parseInt(a.name.split(' ')[1].split('/')[0])
    aDay = parseInt(a.name.split(' ')[1].split('/')[1])
    bMonth = parseInt(b.name.split(' ')[1].split('/')[0])
    bDay = parseInt(b.name.split(' ')[1].split('/')[1])
    let num = 0
    if (aMonth < bMonth) num = -1
    else if (aMonth == bMonth && aDay < bDay) num = -1
    else if (aMonth == bMonth && aDay > bDay) num = 1
    else if (aMonth > bMonth) num = 1
    // else return 0
    return num
}

settingsBtn.addEventListener('click', () => {
    settingsWindow.style.display = 'block'
})
settingsWindow.addEventListener('click', (e) => {
    if (e.target == settingsWindow) settingsWindow.style.display = 'none'
})

// Toggle between light and dark mode
modeToggle.addEventListener('click', () => {
    switchMode()
})
// infoButton.addEventListener('click', () => {
//     infoWindow.style.display = 'block'
// })
// infoWindow.addEventListener('click', (e) => {
//     if (e.target == infoWindow) infoWindow.style.display = 'none'
// })

function switchMode() {
    if (!lightMode) {
        modeToggle.children[0].classList.replace('fa-sun', 'fa-moon')
        document.documentElement.setAttribute('data-theme', 'light')
        localStorage.setItem('theme', 'light')
    } else {
        modeToggle.children[0].classList.replace('fa-moon', 'fa-sun')
        document.documentElement.setAttribute('data-theme', 'dark')
        localStorage.setItem('theme', 'dark')
    }

    lightMode = !lightMode
    // console.log(lightMode, 'HI')
}
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
    console.log('Theme set to', theme)
}

// console.log(pickSternTier() + ' is assigned to do stern ties')
function pickSternTier() {
    let potentialPpl = []
    people['Fall 2022'].forEach((person) => {
        if (person.name != 'Elliott') potentialPpl.push(person.name)
    })
    return potentialPpl[Math.floor(Math.random() * potentialPpl.length)]
}

export { findDuplicates, padTo2Digits, formatDate, compareFn, switchMode, setTheme }
