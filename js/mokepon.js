const selectAttackSection = document.getElementById('select__attack')
const restartButton = document.getElementById('restart__button')
const cardsContainer = document.getElementById('cards__container')
const selectPetButton = document.getElementById('pet__button')

const selectPetSection = document.getElementById('select__pet')
const spanPlayerPet = document.getElementById('player__pet')
const spanEnemyPet = document.getElementById('enemy__pet')

const playerPetImage = document.getElementById('player__pet--image')
const enemyPetImage = document.getElementById('enemy__pet--image')

const remainingPlayerLives = document.getElementById('remaining__player--lives')
const remainingEnemyLives = document.getElementById('remaining__enemy--lives')

const attackButtonsContainer = document.getElementById('attack__buttons--container')
const playerAttackList = document.getElementById('player__attack--list')
const enemyAttackList = document.getElementById('enemy__attack--list')
const messagesDiv = document.getElementById('messages')

const attackTypeList = ['FIRE', 'WATER', 'EARTH']

let mokepons = []
let mokeponsOptions

let playerAttack = []
let attackButtons = []
let enemyAttack = []

let playerLives = 3
let enemyLives = 3

let playerPetAttacks
let enemyPetAttacks

let fireButton
let waterButton
let earthButton

class Mokepon {
    constructor(name, image, lives) {
        this.name = name
        this.image = image
        this.lives = lives

        this.attacks = []
    }
}

let hipodoge = new Mokepon('Hipodoge', './assets/Hipodoge.png', 3)
let capipepo = new Mokepon('Capipepo', './assets/Capipepo.png', 3)
let ratigueya = new Mokepon('Ratigueya', './assets/Ratigueya.png', 3)

hipodoge.attacks.push(
    {name: '💧', id: 'water__button'},
    {name: '💧', id: 'water__button'},
    {name: '💧', id: 'water__button'},
    {name: '🌱', id: 'earth__button'},
    {name: '🔥', id: 'fire__button'}
)

capipepo.attacks.push(
    {name: '🌱', id: 'earth__button'},
    {name: '🌱', id: 'earth__button'},
    {name: '🌱', id: 'earth__button'},
    {name: '💧', id: 'water__button'},
    {name: '🔥', id: 'fire__button'}
)

ratigueya.attacks.push(
    {name: '🔥', id: 'fire__button'},
    {name: '🔥', id: 'fire__button'},
    {name: '🔥', id: 'fire__button'},
    {name: '💧', id: 'water__button'},
    {name: '🌱', id: 'earth__button'}
)

mokepons.push(hipodoge, capipepo, ratigueya)

function startGame() {
    selectAttackSection.style.display = 'none'
    restartButton.style.display = 'none'

    mokepons.forEach((mokepon) => {
        mokeponsOptions = `
        <input type="radio" name="pet" id="${mokepon.name}">
        <label class="mokepon__card" for="${mokepon.name}">
            <img src="${mokepon.image}" alt="${mokepon.name}">
            <p>${mokepon.name}</p>
        </label>
        `

        cardsContainer.innerHTML += mokeponsOptions
    })

    selectPetButton.addEventListener('click', selectPlayerPet)
    restartButton.addEventListener('click', restartGame)
}

// SELECTING PETS
function selectPlayerPet() {
    selectPetSection.style.display = 'none'
    selectAttackSection.style.display = 'flex'

    let chosen = false
    
    for (mokepon of mokepons) {
        if(document.getElementById(mokepon.name).checked) {
            spanPlayerPet.innerHTML = mokepon.name
            playerPetImage.setAttribute('src', `${mokepon.image}`)
            playerPetAttacks = mokepon.attacks
            chosen = true
        } 
    }

    if(chosen === false) {
        alert('Select a pet.')
    }

    showAttacks()
    selectEnemyPet()
}

function selectEnemyPet() {
    spanEnemyPet.innerHTML = mokepons[random(0, mokepons.length - 1)].name

    for (mokepon of mokepons) {
        if (mokepon.name === spanEnemyPet.innerHTML) {
            enemyPetImage.setAttribute('src', `${mokepon.image}`)
            enemyPetAttacks = mokepon.attacks
            enemyPetAttacks.sort(() => Math.random() - 0.5)
        }
    }

    playerAttackSequence()
}

// ENEMY'S ATTACK
function enemyRandomAttack() {
    enemyAttack = attackTypeList[random(0, 2)]
    
    combat()
}

// AUXILIARY FUNCTIONS
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function showAttacks() {
    playerPetAttacks.forEach((attack) => {
        mokeponAttacks = `
        <button id="${attack.id}" class="attack__button">${attack.name}</button>
        `

        attackButtonsContainer.innerHTML += mokeponAttacks
    })

    fireButton = document.getElementById('fire__button')
    waterButton = document.getElementById('water__button')
    earthButton = document.getElementById('earth__button')
    attackButtons = document.querySelectorAll('.attack__button')
}

function playerAttackSequence() {
    attackButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            if(e.target.textContent === '🔥') {
                playerAttack.push('FIRE')
                button.style.background = 'rgba(255, 255, 255, 0.4)'
            } else if(e.target.textContent === '💧') {
                playerAttack.push('WATER')
                button.style.background = 'rgba(255, 255, 255, 0.4)'
            } else if(e.target.textContent === '🌱') {
                playerAttack.push('EARTH')
                button.style.background = 'rgba(255, 255, 255, 0.4)'
            }
            console.log(playerAttack)
        })
    })

    enemyAttackSequence()
}

function enemyAttackSequence() {
    enemyPetAttacks.forEach((attack) => {
        if(attack.name === '🔥') {
            enemyAttack.push('FIRE')
        } else if(attack.name === '💧') {
            enemyAttack.push('WATER')
        } else if(attack.name === '🌱') {
            enemyAttack.push('EARTH')
        }
    })
    console.log(enemyAttack)
}

function combat() {
    if(playerAttack === enemyAttack) {
        createCombatResultMessage('TIE')
    } else if(playerAttack === 'WATER' && enemyAttack === 'FIRE' || playerAttack === 'FIRE' && enemyAttack === 'EARTH' || playerAttack === 'EARTH' && enemyAttack === 'WATER') {
        createCombatResultMessage('YOU WIN')
        enemyLives -= 1
        remainingEnemyLives.innerHTML = enemyLives
    } else {
        createCombatResultMessage('YOU LOSE')
        playerLives -= 1
        remainingPlayerLives.innerHTML = playerLives
    }

    checkRemainingLives()
}

function checkRemainingLives() {
    if(enemyLives === 0) {
        createMatchResultMessage('CONGRATS! YOU WON')
    } else if(playerLives === 0) {
        createMatchResultMessage('SORRY, YOU LOST')
    }
}

function restartGame() {
    location.reload()
}

// MESSAGES
function createCombatResultMessage(combatResult) {
    let newPlayerAttack = document.createElement('p')
    newPlayerAttack.innerHTML = playerAttack
    let newEnemyAttack = document.createElement('p')
    newEnemyAttack.innerHTML = enemyAttack

    playerAttackList.appendChild(newPlayerAttack)
    enemyAttackList.appendChild(newEnemyAttack)

    messagesDiv.innerHTML = combatResult
}

function createMatchResultMessage(matchResult) {
    messagesDiv.innerHTML = matchResult

    fireButton.style.display = 'none'
    waterButton.style.display = 'none'
    earthButton.style.display = 'none'

    restartButton.style.display = 'flex'
}

// RUNNING APP
window.addEventListener('load', startGame)