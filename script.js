

const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rules');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let score = 0;
const brickRowCount = 9;
const brickColumnCount = 5;





// Create Ball Props, direction, position and size 
const ball = { 
  // Get the middle position 
  x: canvas.width / 2, 
  y: canvas.height /2,
  size: 10, 
  speed: 4,
  // Pixels to move on x and y axis 
  dx: 4,
  // - so it doesn't go down:
  dy: -4,
}

// Create paddle  Properties
const paddle ={
  x: canvas.width / 2 - 40, // total width 80 , we need it to be half way 
  y: canvas.height - 20, // Close to the bottom
  w: 80,
  h:10,
  speed: 8, 
  dx: 0


}// Create brick props
const brickInfo = {
  w: 70,
  h:20,
  padding: 10,
  //Position of the brick 
  offsetX:45,
  offsetY:60, 
  // visible property 
  visible: true 
}

const bricks = [];
// Loop through the number of rows, increase if less than count
for(let i = 0; i < brickRowCount; i++){
  // have an array for each row
  bricks[i] = [];
  // loop throught the column count 
  for(let j = 0; j < brickColumnCount; j++)  { 
    // x = i * number of brick+padding, we get the postions 
    
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = {x, y, ...brickInfo }
  }
  
}

// We have to draw a path: MZN document. We call a function begin arc 
//Draw ball on canvas
function drawBall() { 
  ctx.beginPath(); 
  // x, and y values, radius , start angle - 0 for perfect circle, end angle 
  ctx.arc(ball.x,ball.y, ball.size, 0, Math.PI * 2);

  // Fill up the canvas 
  ctx.fillStyle = '#0095dd';
  ctx.fill();
  // close path on completion
  ctx.closePath();
}
// Draw paddle on canvas
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillStyle = '#0095dd';
    ctx.fill();
    ctx.closePath();
}
// Draw score on canvas
function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}
// Draw bricks on canvas
function drawBricks() {
    bricks.forEach(column => {
        column.forEach(brick => {
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.w, brick.h);
            ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent';
            ctx.fill();
            ctx.closePath();
        });
    });
}

// Move paddle on canvas 
function movePaddle() { 
  // paddle would move only in the x direction by a factor of dx which would be determined by keyboard press events 
  paddle.x += paddle.dx;

  // Wall detection to avoid overflow of paddle, when it gets to the wall it stops. 
  if(paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }
// Avoid overflow from the other direction, stops at 0
  if (paddle.x < 0 ) {
    paddle.x = 0;
  }
}




// Move Ball 
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
  // Wall collision (x), check if it's less or greater than the canvas size 
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
      ball.dx *= -1; // ball.dx = ball.dx * -1
  }
  //Wall collision (y)
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
      ball.dy *= -1;
  }
  // console.log(ball.x, ball.y);

  // Paddle collision 
  if(ball.x - ball.size > paddle.x && ball.x + ball.size < paddle.x + paddle.w && ball.y + ball.size > paddle.y) { 
    ball.dy = -ball.speed;
  }
  
  //Brick collision 
  bricks.forEach(column => { 
    column.forEach(brick => {
      if(brick.visible) {
        if(ball.x - ball.size > brick.x && // left brick side check
          ball.x + ball.size < brick.x + brick.w && // right brick side check 
          ball.y + ball.size > brick.y && // top brick side check 
          ball.y - ball.size < brick.y + brick.h //bottom brick side check
          ) {
            ball.dy *= -1; 
            brick.visible = false;

            increaseScore();
      }
    }
  });
});

// Hit bottom wall - Lose 
if(ball.y + ball.size > canvas.height) {
  showAllBricks();
  score = 0;

}


}

// Increase score 
function increaseScore() { 
  score++;

  if(score % (brickRowCount * brickRowCount) === 0) {
    // Change a little functionality
    showAllBricks;
  }
}


// Make all bricks appear 
function showAllBricks() { 
  bricks.forEach(column => { 
    column.forEach(brick => brick.visible = true);
  })
}


  // Draw everything 
function draw() {
  // clear canvas
  ctx.clearRect(0,0, canvas.width, canvas.height);
  
  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
}


// Update canvas drawing and animation 
function update() { 

  moveBall();
  draw(); 
  movePaddle();

  requestAnimationFrame(update);

}

update();

// Keydown Event , when you press a key
function keyDown(e) { 
  console.log(e.key);
  if(e.key === 'Right' || e.key === 'ArrowRight'){
    paddle.dx = paddle.speed;
  } else if (e.key == 'Left' || e.key === 'ArrowLeft') {
    paddle.dx = -paddle.speed;
  }
}



// keyup Event, stops moving at keyUP
function keyUp(e) {
  if(e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'Left' || e.key === 'ArrowLeft'){
    // Stop moving on Keyup
    paddle.dx = 0;

  }
  // console.log(2);
}

// Keyboard Event Handles 
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
// Rules and close event handlers
rulesBtn.addEventListener('click', () => rules.classList.add('show'));
closeBtn.addEventListener('click', () => rules.classList.remove('show'));




