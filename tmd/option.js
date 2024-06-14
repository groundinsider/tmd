class Option {
  constructor(themeColor = "black", fontSize = 1) {
    this.themeColor = themeColor;
    this.fontSize = fontSize;
  }

  setThemeColor(color) {
    this.themeColor = color;
    const sideMenu = document.querySelector('.sideMenu');
    const contents = document.querySelector('.contents'); 
    const blocks = document.querySelectorAll('.block');
    document.documentElement.style.setProperty('--theme-color', this.themeColor);

    if (this.themeColor === 'black') {
      document.body.style.backgroundColor = 'black';
      contents.style.backgroundColor = 'black';
      blocks.forEach(block => {
        block.style.borderColor = 'white';
      });
      sideMenu.style.borderRight = 'white solid 0.1px';
      document.documentElement.style.setProperty('--theme-color', 'white');
    } else {
      document.body.style.backgroundColor = '';
      contents.style.backgroundColor = '';
      blocks.forEach(block => {
        block.style.borderColor = 'black';
      });
      sideMenu.style.borderRight = '';
      document.documentElement.style.setProperty('--theme-color', 'rgb(188, 188, 188)');
    }
  }

  setFontSize(size) {
    this.fontSize = size;
    const sizes = ["16px", "17px", "20px"];
    document.body.style.fontSize = sizes[this.fontSize - 1];
  }
}

const option = new Option();

document.querySelector('.b_data').addEventListener('change', function() {
  if (this.checked) {
    option.setThemeColor('black');
  } else {
    option.setThemeColor('white');
  }
});

document.querySelector('.f_data').addEventListener('change', function() {
  option.setFontSize(parseInt(this.value));
});