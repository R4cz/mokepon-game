const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

const players = []

class Player {
    constructor(id) {
        this.id = id
    }
}

class Mokepon {
    constructor(name) {
        this.name = name
    }

    assignMokepon(mokepon) {
        this.mokepon = mokepon
    }

    updatePosition(x, y) {
        this.x = x
        this.y = y
    }
}

app.get('/join', (req, res) => {
    const id = `${Math.random()}`

    const player = new Player(id)

    players.push(player)

    res.setHeader('Access-Control-Allow-Origin', '*')

    res.send(id)
})

app.post('/mokepon/:playerId', (req, res) => {
    const playerId = req.params.playerId || ''
    const name = req.body.mokepon || ''
    const mokepon = new Mokepon(name)

    const playerIndex = players.findIndex((player) => playerId === player.id)

    if(playerIndex >= 0) {
        players[playerIndex].assignMokepon(mokepon)
    }

    console.log(players)
    console.log(playerId)
    res.end()
})

app.post('/mokepon/:playerId/position', (req, res) => {
    const playerId = req.params.playerId || ''
    const x = req.body.x || 0
    const y = req.body.y || 0

    const playerIndex = players.findIndex((player) => playerId === player.id)

    if(playerIndex >= 0) {
        players[playerIndex].updatePosition(x, y)
    }

    res.end()
})

app.listen(8080, () => {
    console.log('Server working...')
})