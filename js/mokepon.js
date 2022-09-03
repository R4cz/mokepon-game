const selectAttackSection = document.getElementById('select__attack')
const restartButton = document.getElementById('restart__button')
const cardsContainer = document.getElementById('cards__container')
const selectPetButton = document.getElementById('pet__button')

const selectPetSection = document.getElementById('select__pet')
const spanPlayerPet = document.getElementById('player__pet')
const spanEnemyPet = document.getElementById('enemy__pet')

const playerPetImage = document.getElementById('player__pet--image')
const enemyPetImage = document.getElementById('enemy__pet--image')

const spanPlayerVictories = document.getElementById('span__player--victories')
const spanEnemyVictories = document.getElementById('span__enemy--victories')

const restartButtonContainer = document.getElementById('restart__button--container')
const attackButtonsContainer = document.getElementById('attack__buttons--container')
const playerAttackList = document.getElementById('player__attack--list')
const enemyAttackList = document.getElementById('enemy__attack--list')
const messagesDiv = document.getElementById('messages')

const mapContainer = document.getElementById('map__container')
const map = document.getElementById('map')

let mokepons = []
let mokeponsOptions

let playerAttack = []
let attackButtons = []
let enemyAttack = []

let indexPlayerAttack
let indexEnemyAttack

let playerVictories = 0
let enemyVictories = 0

let playerPetAttacks
let enemyPetAttacks

let fireButton
let waterButton
let earthButton

let mapCanvas = map.getContext('2d')
let interval

class Mokepon {
    constructor(name, image, lives) {
        this.name = name
        this.image = image
        this.lives = lives

        this.attacks = []

        this.x = 20
        this.y = 30
        this.width = 80
        this.height = 80
        this.mapImage = new Image()
        this.mapImage.src = image

        this.speedX = 0
        this.speedY = 0
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
    restartButtonContainer.style.display = 'none'
    mapContainer.style.display = 'none'

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
    //selectAttackSection.style.display = 'flex'
    mapContainer.style.display = 'flex'
    mapInit()

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
                button.disabled = true
            } else if(e.target.textContent === '💧') {
                playerAttack.push('WATER')
                button.style.background = 'rgba(255, 255, 255, 0.4)'
                button.disabled = true
            } else if(e.target.textContent === '🌱') {
                playerAttack.push('EARTH')
                button.style.background = 'rgba(255, 255, 255, 0.4)'
                button.disabled = true
            }
            startFight()
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
}

function startFight() {
    if(playerAttack.length === 5) {
        combat()
    }
}

function indexAttackOponents(index) {
    indexPlayerAttack = playerAttack[index]
    indexEnemyAttack = enemyAttack[index]
}

function combat() {

    for (let i = 0; i < playerAttack.length; i++) {
        if(playerAttack[i] === enemyAttack[i]) {
            indexAttackOponents(i)
            createCombatResultMessage('TIE')
        } else if(playerAttack[i] === 'WATER' && enemyAttack[i] === 'FIRE' || playerAttack[i] === 'FIRE' && enemyAttack[i] === 'EARTH' || playerAttack[i] === 'EARTH' && enemyAttack[i] === 'WATER') {
            indexAttackOponents(i)
            createCombatResultMessage('YOU WIN')
            playerVictories += 1
            spanEnemyVictories.innerHTML = playerVictories
        } else {
            indexAttackOponents(i)
            createCombatResultMessage('YOU LOSE')
            enemyVictories += 1
            spanPlayerVictories.innerHTML = enemyVictories
        }
    }

    checkRemainingLives()
}

function checkRemainingLives() {
    if(playerVictories === enemyVictories) {
        createMatchResultMessage('IT IS A TIE!!!')
    } else if(playerVictories > enemyVictories) {
        createMatchResultMessage('CONGRATS! YOU WON')
    } else if(playerVictories < enemyVictories) {
        createMatchResultMessage('SORRY, YOU LOST')
    }
}

function restartGame() {
    location.reload()
}

function paintCharacter() {
    capipepo.x += capipepo.speedX
    capipepo.y += capipepo.speedY

    mapCanvas.clearRect(0, 0, map.width, map.height)

    mapCanvas.drawImage(
        capipepo.mapImage,
        capipepo.x,
        capipepo.y,
        capipepo.width,
        capipepo.height
    )
}

function moveUp() {
    capipepo.speedY = -5
}
function moveLeft() {
    capipepo.speedX = -5
}
function moveDown() {
    capipepo.speedY = 5
}
function moveRight() {
    capipepo.speedX = 5
}

function stopMovement() {
    capipepo.speedX = 0
    capipepo.speedY = 0
}

function keyDown(event) {
    switch (event.key) {
        case 'ArrowUp':
            moveUp()
            break
        case 'ArrowLeft':
            moveLeft()
            break
        case 'ArrowDown':
            moveDown()
            break
        case 'ArrowRight':
            moveRight()
            break
    
        default:
            break
    }
}

function mapInit() {
    interval = setInterval(paintCharacter, 50)

    window.addEventListener('keydown', keyDown)
    window.addEventListener('keyup', stopMovement)
}

// MESSAGES
function createCombatResultMessage(combatResult) {
    let newPlayerAttack = document.createElement('p')
    newPlayerAttack.innerHTML = indexPlayerAttack
    let newEnemyAttack = document.createElement('p')
    newEnemyAttack.innerHTML = indexEnemyAttack

    playerAttackList.appendChild(newPlayerAttack)
    enemyAttackList.appendChild(newEnemyAttack)

    messagesDiv.innerHTML = combatResult
}

function createMatchResultMessage(matchResult) {
    messagesDiv.innerHTML = matchResult

    attackButtonsContainer.style.display = 'none'

    restartButton.style.display = 'flex'
    restartButtonContainer.style.display = 'flex'
}

// RUNNING APP
window.addEventListener('load', startGame)