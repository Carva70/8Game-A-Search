import Board from "./board.js"
import { newArray } from "./board.js"

var boardSize = 3


var all = document.querySelector('.all')
var board = new Board(newArray(boardSize))
var solution

board.random()

document.addEventListener('keydown', (event) => {
    
    
    switch (event.key) {
        
        case ('ArrowUp'):
            board.makeMove(board.moveSouth)
            all.innerText = ''
            all.append(board.getHtml())
            break;
        case ('ArrowDown'):
            board.makeMove(board.moveNorth)
            all.innerText = ''
            all.append(board.getHtml())
            break;
        case ('ArrowRight'):
            board.makeMove(board.moveWest)
            all.innerText = ''
            all.append(board.getHtml())
            break;
        case ('ArrowLeft'):
            board.makeMove(board.moveEast)
            all.innerText = ''
            all.append(board.getHtml())
            break;
        case (' '):
            console.log("buscando solucion...")
            solution = board.search()
            document.querySelector('.text').innerText = `Nodos visitados: ${board.lastNodes}`
            console.log(solution)
            for (var i in solution) {
                demo(solution[i], i)
            }
            break;
        case('s'):
            console.log("buscando solucion...")
            solution = board.prioritySearch()
            document.querySelector('.text').innerText = `Nodos visitados: ${board.lastNodes}`
            console.log(solution)
            for (var i in solution) {
                demo(solution[i], i)
            }
            break;
            
    }

})



all.append(board.getHtml())

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function demo(s, i) {
    await sleep(i * 100);
    board.makeMove(s)
    all.innerText = ''
    all.append(board.getHtml())
    console.log(board.manhattan(board.board))

}
