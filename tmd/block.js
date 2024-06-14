class Block {
    constructor(type, cost, num) {
        this.type = type;
        this.cost = cost;
        this.num = num;
        this.color = null;
    }

    changeColor(color) {
        this.color = color;
    }

    updateType(newType) {
        this.type = newType;
    }

    updateCost(newCost) {
        this.cost = newCost;
    }
}

class SetBlock {
    constructor(size) {
        this.Max_size = size;
        this.blocks = new Array(this.Max_size);
        this.path_cost = [0, 0, 0];

        for (let i = 0; i < this.Max_size; i++) {
            this.blocks[i] = new Block(0, 0, i + 1);
        }
    }

    getBlock(index) {
        return this.blocks[index];
    }

    updateCostForAllBlocksOfType(type, newCost) {
        this.blocks.forEach(block => {
            if (block.type === type) {
                block.updateCost(newCost);
                const blockElement = document.querySelector(`.block[data-index='${block.num - 1}']`);
                if (blockElement) {
                    if (block.type === 4 || block.type === 5) {
                        blockElement.textContent = block.type === 4 ? `S${block.num}` : `F${block.num}`;
                    } else {
                        blockElement.textContent = newCost + "M";
                    }
                }
            }
        });
    }

    check_block(i) {
        const indices = [];
        const rowSize = 23;
        const colSize = 12;
    
        const left = i % rowSize > 0 ? i - 1 : -1;
        const right = i % rowSize < rowSize - 1 ? i + 1 : -1;
        const top = i >= rowSize ? i - rowSize : -1;
        const bottom = i < (colSize - 1) * rowSize ? i + rowSize : -1;
    
        if (left !== -1) indices.push(left);
        if (right !== -1) indices.push(right);
        if (top !== -1) indices.push(top);
        if (bottom !== -1) indices.push(bottom);
    
        return indices;
    }
    
    count_block(index) {
        const Indices = this.check_block(index);
        let count = 0;
    
        Indices.forEach(adjIndex => {
            if (this.blocks[adjIndex].color !== null) {
                count++;
            }
        });
    
        return count;
    }
    
    blockPlacementCheck(index) {
        const count = this.count_block(index);
        if (count >= 3) {
            return false;
        }
    
        const adjacentIndices = this.check_block(index);
    for (let adjIndex of adjacentIndices) {
        const adjBlock = this.blocks[adjIndex];
        if ((adjBlock.type === 1 || adjBlock.type === 2 || adjBlock.type === 3) && this.count_block(adjIndex) >= 2) {
            return false;
        }
    }
    
        return true;
    }

    savePathCost() {
        for (let i = 0; i < 3; i++) {
            const startBlock = this.blocks.find(block => block.type === 4 && block.num === i + 1);
            if (startBlock) {
                const pathCost = this.calculatePathCost(startBlock.num);
                if (pathCost !== null) {
                    this.path_cost[startBlock.num - 1] = pathCost;
                } else {
                    this.path_cost[startBlock.num - 1] = 0; 
                }
            } else {
                this.path_cost[i] = 0; 
            }
        }
        this.showPathCosts();
    }

    calculatePathCost(startNum) {
        let totalCost = 0;
        let currentBlock = this.blocks.find(block => block.type === 4 && block.num === startNum);
        let visited = new Set();
        let pathComplete = false;

        while (currentBlock && !visited.has(currentBlock.num)) {
            visited.add(currentBlock.num);

            if (currentBlock.type === 5) {
                pathComplete = true;
                break;
            }

            totalCost += currentBlock.cost;

            const adjacentIndices = this.check_block(currentBlock.num - 1);
            let nextBlock = null;

            for (let adjIndex of adjacentIndices) {
                let block = this.blocks[adjIndex];
                if (block && (block.type === 1 || block.type === 2 || block.type === 3 || block.type === 5) && !visited.has(block.num)) {
                    nextBlock = block;
                    break;
                }
            }

            if (nextBlock) {
                currentBlock = nextBlock;
            } else {
                break; 
            }
        }

        if (pathComplete) {
            return totalCost;
        } else {
            return 0;
        }
    }

    showPathCosts() {
        const messages = this.path_cost.map((cost, index) => `Path ${index + 1} cost: ${cost} minutes`).join('\n');
        document.getElementById('pathCosts').textContent = messages;
    }
    deleteBlock(block) {
        block.updateType(0);
        block.updateCost(0);
        block.changeColor(null);

        const blockElement = document.querySelector(`.block[data-index='${block.num - 1}']`);
        blockElement.textContent = '';
        blockElement.classList.remove('selected');
        blockElement.style.backgroundColor = '';
    }
}

const blocks = new SetBlock(23 * 12);

class DeleteBlock {
    constructor(type, defaultCost) {
        this.type = type;
        this.defaultCost = defaultCost;
    }

    deleteSelectedBlock(block) {
        blocks.deleteBlock(block);
    }
}

let selectedBlock = null;
let startBlockPlaced = [false, false, false];
let endBlockPlaced = [false, false, false];

document.getElementById('r_set').addEventListener('click', function () {
    handleLengthBlockClick(this);
});

document.getElementById('g_set').addEventListener('click', function () {
    handleLengthBlockClick(this);
});

document.getElementById('b_set').addEventListener('click', function () {
    handleLengthBlockClick(this);
});

document.getElementById('bd_set').addEventListener('click', function () {
    handleDeleteBlockClick(this);
});

document.getElementById('f_set').addEventListener('click', function () {
    handlePointBlockClick(this);
});

document.getElementById('e_set').addEventListener('click', function () {
    handlePointBlockClick(this);
});

function handleLengthBlockClick(block) {
    if (selectedBlock) {
        selectedBlock.classList.remove('selected');
    }
    selectedBlock = block;
    block.classList.add('selected');
}

function handleDeleteBlockClick(block) {
    if (selectedBlock) {
        selectedBlock.classList.remove('selected');
    }
    selectedBlock = block;
    block.classList.add('selected');
}

function handlePointBlockClick(block) {
    if (selectedBlock) {
        selectedBlock.classList.remove('selected');
    }
    selectedBlock = block;
    block.classList.add('selected');
}

function updateCostForAllBlocksOfType(type, newCost) {
    blocks.updateCostForAllBlocksOfType(type, newCost);
}

document.querySelectorAll('.input_cost').forEach((input, index) => {
    input.addEventListener('input', function () {
        const newCost = parseInt(this.value, 10);
        if (!isNaN(newCost) && newCost <= 60) {
            let blockType;
            switch (index) {
                case 0:
                    blockType = 1;
                    break;
                case 1:
                    blockType = 2;
                    break;
                case 2:
                    blockType = 3;
                    break;
            }
            updateCostForAllBlocksOfType(blockType, newCost);
        } else {
            alert('Please enter a valid number between 1 and 60!');
        }
    });
});

document.querySelectorAll('.input_n').forEach((input, index) => {
    input.addEventListener('input', function () {
        const newNum = parseInt(this.value, 10);
        if (!isNaN(newNum) && newNum >= 1 && newNum <= 3) {
            let blockType = index === 0 ? 4 : 5;
            blocks.blocks.forEach(block => {
                if (block.type === blockType) {
                    block.num = newNum;
                }
            });
        } else {
            alert('Please enter a valid number between 1 and 3!');
        }
    });
});

for (let i = 0; i < 23 * 12; i++) {
    const blockElement = document.createElement("div");
    blockElement.className = "block";
    blockElement.dataset.index = i;

    blockElement.addEventListener("click", function () {
        if (!selectedBlock) {
            alert('Please select a Length Block in Create menu first!');
            return;
        }

        const block = blocks.getBlock(i);

        if (selectedBlock.id === 'bd_set') {
            blocks.deleteBlock(block);

            if (block.type === 4) {
                startBlockPlaced[block.num - 1] = false;
            } else if (block.type === 5) {
                endBlockPlaced[block.num - 1] = false;
            }

            blocks.savePathCost();
            return;
        }

        let newType;
        let selectedColor;
        let newCost;

        if (selectedBlock.id === 'r_set') {
            newType = 1;
            selectedColor = "red";
            newCost = parseInt(document.querySelectorAll('.input_cost')[0].value, 10);
        } else if (selectedBlock.id === 'g_set') {
            newType = 2;
            selectedColor = "rgb(7, 181, 7)";
            newCost = parseInt(document.querySelectorAll('.input_cost')[1].value, 10);
        } else if (selectedBlock.id === 'b_set') {
            newType = 3;
            selectedColor = "rgb(53, 97, 200)";
            newCost = parseInt(document.querySelectorAll('.input_cost')[2].value, 10);
        } else if (selectedBlock.id === 'f_set') {
            newType = 4;
            selectedColor = "yellow";
            newCost = 0;
            let startNum = parseInt(document.querySelectorAll('.input_n')[0].value, 10);
            if (!isNaN(startNum) && startNum >= 1 && startNum <= 3) {
                if (startBlockPlaced[startNum - 1]) {
                    alert(`Start block ${startNum} is already placed!`);
                    return;
                } else {
                    block.num = startNum;
                    startBlockPlaced[startNum - 1] = true;
                }
            } else {
                alert('Please enter a valid start block number between 1 and 3!');
                return;
            }
        } else if (selectedBlock.id === 'e_set') {
            newType = 5;
            selectedColor = "yellow";
            newCost = 0;
            let endNum = parseInt(document.querySelectorAll('.input_n')[1].value, 10);
            if (!isNaN(endNum) && endNum >= 1 && endNum <= 3) {
                if (endBlockPlaced[endNum - 1]) {
                    alert(`End block ${endNum} is already placed!`);
                    return;
                } else if (!startBlockPlaced[endNum - 1]) {
                    alert(`Start block ${endNum} must be placed before end block ${endNum}!`);
                    return;
                } else {
                    block.num = endNum;
                    endBlockPlaced[endNum - 1] = true;
                }
            } else {
                alert('Please enter a valid end block number between 1 and 3!');
                return;
            }
        } else {
            alert('Invalid length block selected!');
            return;
        }

        if (!blocks.blockPlacementCheck(i, newType)) {
            alert('You cannot place a Block here! Too many adjacent blocks or would make a block invalid.');
            return;
        }

        if (isNaN(newCost) || newCost > 60) {
            alert('Please enter a valid number between 1 and 60!');
            return;
        }

        block.updateType(newType);
        block.updateCost(newCost);
        if (newType === 4 || newType === 5) {
            blockElement.textContent = newType === 4 ? `S${block.num}` : `F${block.num}`;
        } else {
            blockElement.textContent = newCost + "M";
        }
        blockElement.classList.add("selected");
        blockElement.style.backgroundColor = selectedColor;
        block.changeColor(selectedColor);

        blocks.savePathCost(); 

        console.log(`Block ${i} cost updated to ${newCost}`);
    });

    document.querySelector(".contents").appendChild(blockElement);
}

document.getElementById('savePathCost').addEventListener('click', function () {
    blocks.savePathCost();
    console.log('Path costs saved:', blocks.path_cost);
});


const pathCostsElement = document.createElement('div');
pathCostsElement.id = 'pathCosts';
document.body.appendChild(pathCostsElement);