import { PriorityQueue, Queue } from "./queue.js"


export default class Board {
    moveNorth = "Down"
    moveSouth = "Up"
    moveEast = "Left"
    moveWest = "Right"

    constructor(board) {
        this.board = board
        this.lastNodes = 0

        var solutionMap = new Map()
        var solution = newArray(this.getSize())
        for (var i = 0; i < this.getSize(); i++) {
            for (var j = 0; j < this.getSize(); j++) {
                solutionMap[solution[i][j]] = [i, j]
            }
        }

        this.solutionMap = solutionMap
    }

    getSize() {
        return this.board.length
    }

    getSuccesors(arr) {
        var moves = new Array(0)
        var auxBoard = []

        for (var i = 0; i < this.getSize(); i++) {
            for (var j = 0; j < this.getSize(); j++) {
                if (arr[i][j] == '0') {

                    if (i > 0) {
                        for (var k = 0; k < this.getSize(); k++)
                            auxBoard[k] = arr[k].slice();
                        [auxBoard[i][j], auxBoard[i-1][j]] = [auxBoard[i-1][j], auxBoard[i][j]];
                        moves.push([auxBoard.slice(), this.moveNorth])
                    }
                    if (j > 0) {
                        for (var k = 0; k < this.getSize(); k++)
                            auxBoard[k] = arr[k].slice();
                        [auxBoard[i][j], auxBoard[i][j-1]] = [auxBoard[i][j-1], auxBoard[i][j]];
                        moves.push([auxBoard.slice(), this.moveWest])
                    }
                    if (i < (this.getSize() - 1)) {
                        for (var k = 0; k < this.getSize(); k++)
                            auxBoard[k] = arr[k].slice();
                        [auxBoard[i][j], auxBoard[i+1][j]] = [auxBoard[i+1][j], auxBoard[i][j]]
                        moves.push([auxBoard.slice(), this.moveSouth])
                    }
                    if (j < (this.getSize() - 1)) {
                        for (var k = 0; k < this.getSize(); k++)
                            auxBoard[k] = arr[k].slice();
                        [auxBoard[i][j], auxBoard[i][j+1]] = [auxBoard[i][j+1], auxBoard[i][j]];
                        moves.push([auxBoard.slice(), this.moveEast]);
                    }
                    
                    return moves
                }
            }
        }
    }

    makeMove(move) {

        for (var i = 0; i < this.getSize(); i++) {
            for (var j = 0; j < this.getSize(); j++) {
                if (this.board[i][j] == '0') {
                    switch(move) {
                        case this.moveNorth:
                            if (i > 0) [this.board[i][j], this.board[i-1][j]] = [this.board[i-1][j], this.board[i][j]]
                            return;
                        case this.moveSouth:
                            if (i < (this.getSize() - 1)) [this.board[i][j], this.board[i+1][j]] = [this.board[i+1][j], this.board[i][j]]
                            return;
                        case this.moveEast:
                            if (j < (this.getSize() - 1)) [this.board[i][j], this.board[i][j+1]] = [this.board[i][j+1], this.board[i][j]]
                            return;
                        case this.moveWest:
                            if (j > 0) [this.board[i][j], this.board[i][j-1]] = [this.board[i][j-1], this.board[i][j]]
                            return;

                    }
                }
            }
        }
    }

    getHtml() {
        var html = document.createElement('div')
        html.classList.add('board')

        for (var i = 0; i < this.getSize(); i++) {
            var row = document.createElement('div')
            row.classList.add('row')
            for (var j = 0; j < this.getSize(); j++) {
                var ele = document.createElement('div')
                ele.classList.add('ele')
                if (this.board[i][j] != '0')
                    ele.innerText = this.board[i][j]
                if (i == this.solutionMap[this.board[i][j]][0] && j == this.solutionMap[this.board[i][j]][1]) ele.classList.add('correct')
                row.appendChild(ele)
            }

            html.appendChild(row)
        }

        return html
    }

    isEqual(arr1, arr2) {

        for (var i = 0; i < this.getSize(); i++) {
            for (var j = 0; j < this.getSize(); j++) {
                if (arr1[i][j] != arr2[i][j])
                    return false
            }
        }

        return true
    }

    search() {
        var queue = new Queue
        var element, flagvisited, aux, hijos, i, cont
        var path = []
        var visited = []
        var solution = newArray(this.getSize())
        queue.push([this.board, []])
        cont = 0
        while (queue.length != 0) {
            element = queue.pop()
            
            cont++

            flagvisited = 0

            for (aux in visited) {
                if (this.isEqual(element[0], visited[aux])) flagvisited = 1
            }

            visited.push(element[0])

            if (this.isEqual(element[0], solution)) {
                this.lastNodes = cont
                return element[1]
            }

            if (flagvisited == 0) {

                hijos = this.getSuccesors(element[0])
                for (i in hijos) {
                    path = element[1].slice()
                    path.push(hijos[i][1])
                    queue.push([hijos[i][0], path])
                }
            }
        }
    }

    prioritySearch() {
        var queue = new PriorityQueue((a, b) => a[2] < b[2])
        var element, flagvisited, aux, hijos, i, cont
        var path = []
        var visited = []
        var solution = newArray(this.getSize())
        queue.push([this.board, [], 0, 0])
        cont = 0
        var coste = 0
        while (!queue.isEmpty()) {
            element = queue.pop()
            cont++

            flagvisited = 0

            for (aux in visited) {
                if (this.isEqual(element[0], visited[aux])) flagvisited = 1
            }

            visited.push(element[0])

            if (this.isEqual(element[0], solution)) {
                this.lastNodes = cont
                return element[1]
            }

            if (flagvisited == 0) {

                hijos = this.getSuccesors(element[0])
                for (i in hijos) {
                    path = element[1].slice()
                    path.push(hijos[i][1])
                    coste = element[3] + 1
                    queue.push([hijos[i][0], path, this.manhattan(hijos[i][0]) + coste/2, coste])
                }
            }
        }
    }
    

    manhattan(arr) {
        var cont = 0

        for (var i = 0; i < this.getSize(); i++) {
            for (var j = 0; j < this.getSize(); j++) {
                cont += (Math.abs(i - this.solutionMap[arr[i][j]][0]) + Math.abs(j - this.solutionMap[arr[i][j]][1]))
            }
        }

        return cont
    }

    random() {
        var mov = [this.moveNorth, this.moveSouth, this.moveEast, this.moveWest]

        for (var i = 0; i < 100000; i++) {
            this.makeMove(mov[Math.floor(Math.random() * 4)])
        }
    }
}

export function newArray(size) {
    var board = Array(size).fill().map(()=>Array(size).fill())
        
    var cont = 0
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            board[i][j] = String(cont)
            cont ++
        }
    }

    return board
}

