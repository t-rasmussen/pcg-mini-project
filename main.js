const express = require('express')
const path = require('path')
const fs = require('fs')
const PORT = process.env.PORT || 8000
const app = express()

app.use(express.static(path.join(__dirname, 'public')))

app.get('/linearregression', (req, resp) => {
    resp.sendFile('linear_regression.html', {root: path.join(__dirname, 'public')})
})

app.get('/layerstutorial', (req, resp) => {
    resp.sendFile('layers_tutorial.html', {root: path.join(__dirname, 'public')})
})

app.get('/cppntutorial', (req, resp) => {
    resp.sendFile('cppn_tutorial.html', {root: path.join(__dirname, 'public')})
})

app.get('/cppnflowers', (req, resp) => {
    resp.sendFile('cppn_flowers.html', {root: path.join(__dirname, 'public')})
})

app.get('/cppnflowers2', (req, resp) => {
    resp.sendFile('cppn_flowers2.html', {root: path.join(__dirname, 'public')})
})

app.get('/cppnflowers3', (req, resp) => {
    resp.sendFile('cppn_flowers3.html', {root: path.join(__dirname, 'public')})
})

app.get('/cppnshirtpatterns', (req, resp) => {
    resp.sendFile('cppn_shirtpatterns.html', {root: path.join(__dirname, 'public')})
})

app.get('/cppn-2dspaceships', (req, resp) => {
    resp.sendFile('cppn_2dspaceships.html', {root: path.join(__dirname, 'public')})
})

app.get('/flappy', (req, resp) => {
    resp.sendFile('flappy.html', {root: path.join(__dirname, 'public')})
})

app.get('/dungeon-partitioning', (req, resp) => {
    resp.sendFile('dungeon_partitioning.html', {root: path.join(__dirname, 'public')})
})

app.get('/dungeon-cellularautomata', (req, resp) => {
    resp.sendFile('dungeon_cellular_automata.html', {root: path.join(__dirname, 'public')})
})


var server = app.listen(PORT, () =>{
    console.log("server is listening on port " + PORT)
})