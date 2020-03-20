/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
/* eslint-disable no-console */

// GLOBALS
const size = 20;
let pause = false;
let gameTimer;
let snake = [];
const apple = {};
let xv = 0;
let yv = 0;
let prevXV = 0;
let prevYV = 0;
let changedDirection = false;

function createCell(rowId, id, wall) {
  const cell = document.createElement('div');
  cell.id = `cell_${rowId}_${id}`;
  cell.className = 'cell';
  if (wall) cell.classList.add('wall');
  return cell;
}

function createRow(id, wall) {
  const row = document.createElement('div');
  row.id = `row_${id}`;
  row.className = 'row';
  row.appendChild(createCell(id, 0, true));
  for (let j = 1; j <= size; j += 1) {
    row.appendChild(createCell(id, j, wall));
  }
  row.appendChild(createCell(id, size + 1, true));
  return row;
}

const handleKey = (e) => {
  if (!changedDirection) {
    switch (e.keyCode) {
      case 37:
        prevXV = xv; prevYV = yv;
        xv = xv === 1 ? 1 : -1;
        yv = 0;
        changedDirection = true;
        break;
      case 39:
        prevXV = xv; prevYV = yv;
        xv = xv === -1 ? -1 : 1;
        yv = 0;
        changedDirection = true;
        break;
      case 38:
        prevXV = xv; prevYV = yv;
        xv = 0;
        yv = yv === 1 ? 1 : -1;
        changedDirection = true;
        break;
      case 40:
        prevXV = xv; prevYV = yv;
        xv = 0;
        yv = yv === -1 ? -1 : 1;
        changedDirection = true;
        break;
      default:
    }
  }
};

const placeApple = () => {
  if (document.getElementsByClassName('apple')[0]) {
    document.getElementsByClassName('apple')[0].classList.remove('apple');
  }
  let row;
  let col;
  row = Math.floor(Math.random() * size) + 1;
  col = Math.floor(Math.random() * size) + 1;
  while (Array.from(document.getElementById(`cell_${row}_${col}`).classList).includes('snake')) {
    row = Math.floor(Math.random() * size) + 1;
    col = Math.floor(Math.random() * size) + 1;
  }
  document.getElementById(`cell_${row}_${col}`).classList.add('apple');
  apple.row = row;
  apple.col = col;
};

const gameOver = () => {
  xv = 0; yv = 0;
  pause = true;
  console.log(gameTimer);
  if (gameTimer) {
    clearInterval(gameTimer);
  }
  alert(`Score: ${snake.length - 3}`);
  snake = [];
};

const move = () => {
  snake.map((element) => ({
    ...element,
    id: element.id + 1,
  }));
  const next = { id: 0, x: snake[0].x + xv, y: snake[0].y + yv };

  if (!(xv === 0 && yv === 0)) {
    for (let i = 0; i < snake.length; i += 1) {
      if (snake[i].x === next.x && snake[i].y === next.y) {
        gameOver();
        return 0;
      }
    }
  }

  const firstCell = document.getElementById(`cell_${next.y}_${next.x}`);

  if (Array.from(firstCell.classList).includes('wall')) {
    gameOver();
    return 0;
  }

  firstCell.classList.add('head');
  firstCell.classList.add('snake');
  firstCell.style.transform = `rotate(${90 * xv}deg)`;
  if (yv === 1) firstCell.style.transform = `rotate(${180}deg)`;
  snake.unshift(next);
  const second = document.getElementById(`cell_${snake[1].y}_${snake[1].x}`);
  second.classList.remove('head');
  second.style.transform = `rotate(${90 * xv}deg)`;
  if (yv === 1) second.style.transform = `rotate(${180}deg)`;

  if (prevXV === 1 && yv === -1) {
    second.classList.add('left');
    second.style.transform = `rotate(${90}deg)`;
    prevXV = 0;
  } else
  if (prevXV === 1 && yv === 1) {
    second.classList.add('right');
    second.style.transform = `rotate(${90}deg)`;
    prevXV = 0;
  } else
  if (prevXV === -1 && yv === -1) {
    second.classList.add('right');
    second.style.transform = `rotate(${-90}deg)`;
    prevXV = 0;
  } else
  if (prevXV === -1 && yv === 1) {
    second.classList.add('left');
    second.style.transform = `rotate(${-90}deg)`;
    prevXV = 0;
  } else

  if (prevYV === -1 && xv === -1) {
    second.classList.add('left');
    second.style.transform = `rotate(${0}deg)`;
    prevYV = 0;
  } else
  if (prevYV === -1 && xv === 1) {
    second.classList.add('right');
    second.style.transform = `rotate(${0}deg)`;
    prevYV = 0;
  } else
  if (prevYV === 1 && xv === -1) {
    second.classList.add('right');
    second.style.transform = `rotate(${180}deg)`;
    prevYV = 0;
  } else
  if (prevYV === 1 && xv === 1) {
    second.classList.add('left');
    second.style.transform = `rotate(${180}deg)`;
    prevYV = 0;
  }

  const tail = snake[snake.length - 2];
  const tailCell = document.getElementById(`cell_${tail.y}_${tail.x}`);
  if (Array.from(tailCell.classList).includes('right')) tailCell.classList.remove('right');
  if (Array.from(tailCell.classList).includes('left')) tailCell.classList.remove('left');
  const beforeTail = snake[snake.length - 3];
  const beforeTailCell = document.getElementById(`cell_${beforeTail.y}_${beforeTail.x}`);
  const beforeTailRotation = Number(beforeTailCell.style.transform.split('(')[1].split('d')[0]);
  tailCell.style.transform = `rotate(${beforeTailRotation}deg)`;
  tailCell.classList.add('tail');

  const last = snake[snake.length - 1];
  const lastCell = document.getElementById(`cell_${last.y}_${last.x}`);
  if (!(xv === 0 && yv === 0)) {
    lastCell.classList.remove('snake');
    lastCell.classList.remove('tail');
  }
  if (!(snake[0].x === apple.col && snake[0].y === apple.row)) {
    snake.pop();
  } else {
    document.getElementById('score').innerHTML = Number(snake.length - 3);
    placeApple();
  }
  return 0;
};

const game = () => {
  if (!pause) {
    move();
    changedDirection = false;
  }
};

function createField() {
  const field = document.getElementById('field');
  field.innerHTML = '';
  field.appendChild(createRow(0, true));
  for (let i = 1; i <= size; i += 1) {
    field.appendChild(createRow(i, false));
  }
  field.appendChild(createRow(size + 1, true));
  document.body.onkeydown = (e) => handleKey(e);
  snake.push({ id: 0, x: Math.floor(size / 2), y: Math.floor(size / 2) });
  snake.push({ id: 0, x: Math.floor(size / 2) - 1, y: Math.floor(size / 2) });
  snake.push({ id: 0, x: Math.floor(size / 2) - 2, y: Math.floor(size / 2) });
  xv = 1;
  placeApple();
  pause = false;
  gameTimer = setInterval(game, 150);
} window.onload = () => {
  createField();
};
