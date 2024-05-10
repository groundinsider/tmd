class Block {
  constructor(type, cost, num) {
    this.type = type;
    this.cost = cost;
    this.num = num;
  }

  

  changeColor(color) {
    this.color = color;
  }
}

class Set_Block {
  constructor(size) {
    this.Max_size = size;
    this.blocks = new Array(this.Max_size);

    for (let i = 0; i < this.Max_size; i++) {
      this.blocks[i] = new Block(0, 0, i+1);
    }
  }
}

const blocks = new Set_Block(23 * 12);



for (let i = 0; i < 23 * 12; i++) {
  const blockElement = document.createElement("div");
  blockElement.className = "block";

  blockElement.addEventListener("click", function () {
    blockElement.classList.toggle("selected");
  });

  document.querySelector(".contents").appendChild(blockElement);
}

const setTimeInput = document.querySelector('.input_m');

