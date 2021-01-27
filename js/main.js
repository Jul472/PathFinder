//Node Object
function Node(i, j) {
    this.i = i;
    this.j = j;
    this.g = 0;
    this.f = 0;
    this.h = 0;

    this.startNode = false;
    this.endNode = false;

    this.visited = false
    this.neighbors = []

    this.previous = undefined;

    this.node = gridColumns.childNodes[this.i].childNodes[this.j]
    //Obstacles
    this.wall = false

    this.addNeighbors = function (array) {

        for (node = 0; node < array.length; node++) {
            if (array[node].i == i + 1 && array[node].j == j) {
                this.neighbors.push(array[node])
            }
            if (array[node].i == i - 1 && array[node].j == j) {
                this.neighbors.push(array[node])
            }
            if (array[node].j == j + 1 && array[node].i == i) {
                this.neighbors.push(array[node])
            }
            if (array[node].j == j - 1 && array[node].i == i) {
                this.neighbors.push(array[node])
            }
            //Diagonals
            if (array[node].i == i - 1 && array[node].j == j - 1) {
                this.neighbors.push(array[node])
            }
            if (array[node].i == i + 1 && array[node].j == j - 1) {
                this.neighbors.push(array[node])
            }
            if (array[node].i == i - 1 && array[node].j == j + 1) {
                this.neighbors.push(array[node])
            }
            if (array[node].i == i + 1 && array[node].j == j + 1) {
                this.neighbors.push(array[node])
            }
        }

    }
}

//Functions
function removeFromArray(array, element) {
    for (let i = array.length - 1; i >= 0; i--) {
        if (array[i] == element) {
            array.splice(i, 1)
        }
    }
}

function reset(){
    location.reload()
}

function heuristic(a, b) {
    let distance = Math.abs(a.i - b.i) + Math.abs(a.j - b.j)
    return distance
}

function addPath(pathArray){
    for(let i = 0; i < pathArray.length; i++){
        let column = pathArray[i].i
        let row = pathArray[i].j
        gridColumns.childNodes[column].childNodes[row].classList.add("pathNode")
        if(pathArray[i].startNode){
            gridColumns.childNodes[pathArray[i].i].childNodes[pathArray[i].j].classList.remove("pathNode")
        }
    }

}

function clearGrid(){
    for(let i = 0; i < columns; i++){
        for(let j = 0; j < rows; j++){
            gridColumns.childNodes[i].childNodes[j].classList.remove("pathNode")
        }
    }
}

const gridGenerator = (rows, cols) => {
    let column = document.createElement("div")

    for (let i = 0; i < rows; i++) {
        let cell = document.createElement("div")
        cell.classList.add("cell")

        column.appendChild(cell)
    }

    const content = column.innerHTML

    for (let j = 0; j < cols; j++) {
        let columns = document.createElement("div")
        columns.innerHTML = content
        gridColumns.appendChild(columns)
    }

    //Adding Obstacles
    let totalNodes = rows*cols
    
    for(let p = 0; p < totalNodes*0.4; p++){
        let randomColumn = Math.floor(Math.random() * (cols - 0)) + 0;
        let randomRow = Math.floor(Math.random() * (rows - 0)) + 0;

        const randomNode = gridColumns.childNodes[randomColumn].childNodes[randomRow]
        randomNode.classList.add("obstacle")
    }

}

let gridColumns = document.getElementById("columns")
const columns = 20;
const rows = 10;

gridGenerator(rows, columns)

// Drag and Drop functionality;
var selectedNode;

const nodes = document.querySelectorAll(".node")
const cells = document.querySelectorAll(".cell")

nodes.forEach(node => {
    node.addEventListener("dragstart", e => {
        let nodeId = e.target.getAttribute("id")
        selectedNode = document.getElementById(nodeId)
    })
})


cells.forEach(cell => {
    cell.addEventListener("dragover", e => {
        if (cell.children.length != 1 && !cell.classList.contains("obstacle")) {
            e.preventDefault()
            cell.appendChild(selectedNode)
        }
    })
})

//Variables and A* algorithm
var path = [];
var openSet = [];
var closedSet = [];
var end;
var objectNodes = [];

function aStar(){
    setInterval(function(){

        clearGrid()
        objectNodes = []
    
        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
    
                let node = gridColumns.childNodes[i].childNodes[j]
                if(node.children[0]){
    
                    if(node.children[0].getAttribute("id") == "startNode"){
                        node = new Node(i, j)
                        node.startNode = true
                        node.wall = false
                        objectNodes.push(node)
                        openSet.splice(0, 1, node)
                    } else if(node.children[0].getAttribute("id") == "endNode"){
                        node = new Node(i, j)
                        node.endNode = true
                        node.wall = false
                        end = node
                        objectNodes.push(node)
                    }
    
                } else {
    
                    node = new Node(i, j)
                    if(gridColumns.childNodes[i].childNodes[j].classList.contains("obstacle")){
                        node.wall = true
                    }
                    objectNodes.push(node)
                }
            }
        }
        
        //Adding Neighbors to each Node Object
        for (let i = 0; i < objectNodes.length; i++) {
            objectNodes[i].addNeighbors(objectNodes)
        }
    
        // console.log(openSet)
    
        while(openSet.length > 0){
    
            let lowestId = 0
            for(let i = 0; i < openSet.length; i++){
                if(openSet[i].f < openSet[lowestId].f){
                    lowestId = i;
                }
            }
        
            let current = openSet[lowestId]
            
            if(current.i == end.i && current.j == end.j){
                path = []
                
                let temp = current
    
                while(temp.previous){
                    path.push(temp.previous)
                    temp = temp.previous
                }
        
                addPath(path)
        
                console.log("DONE")
            }
        
            removeFromArray(openSet, current)
            closedSet.push(current)
        
            let neighbors = current.neighbors
            // n stands for neighbor
            for(let n = 0; n < neighbors.length; n++){
        
                let neighbor = neighbors[n]
        
                if(!closedSet.includes(neighbor) && !neighbor.wall){
                    let tentativeGScore = current.g + 1
                    let newPath = false
                    if(openSet.includes(neighbor)){
                        if (tentativeGScore < neighbor.g){
                            neighbor.g = tentativeGScore
                            newPath = true
                        }
                    } else {
                        neighbor.g = tentativeGScore
                        openSet.push(neighbor)
                        newPath = true
                    }
                    if(newPath){
                        neighbor.h = heuristic(neighbor, end)
                        neighbor.f = neighbor.g + neighbor.h
                        neighbor.previous = current 
                    }
                }
            }
        }
    },10)
}