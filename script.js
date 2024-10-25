const player = document.getElementById('player');
const gameContainer = document.querySelector('.game-container');
const scoreBoard = document.getElementById('score');
let score = 0;
let bullets = [];
let enemies = [];
let gameInterval;

function movePlayer(event) {
    const playerLeft = player.offsetLeft;
    if (event.key === 'ArrowLeft' && playerLeft > 0) {
        player.style.left = `${playerLeft - 20}px`;
    } else if (event.key === 'ArrowRight' && playerLeft < (gameContainer.clientWidth - player.clientWidth)) {
        player.style.left = `${playerLeft + 20}px`;
    }
}

function createBullet() {
    const bullet = document.createElement('div');
    bullet.classList.add('bullet');
    bullet.style.left = `${player.offsetLeft + player.clientWidth / 2 - 2}px`;
    bullet.style.bottom = '60px';
    gameContainer.appendChild(bullet);
    bullets.push(bullet);
}

function createEnemy() {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    const randomPosition = Math.floor(Math.random() * (gameContainer.clientWidth - 40));
    enemy.style.left = `${randomPosition}px`;
    gameContainer.appendChild(enemy);
    enemies.push(enemy);
}

function moveBullets() {
    bullets.forEach((bullet, index) => {
        bullet.style.bottom = `${bullet.offsetTop - 10}px`;

        // 移除超出螢幕的子彈
        if (bullet.offsetTop < 0) {
            bullet.remove();
            bullets.splice(index, 1);
        }
    });
}

function moveEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.style.top = `${enemy.offsetTop + 5}px`;

        // 移除超出螢幕的敵人
        if (enemy.offsetTop > gameContainer.clientHeight) {
            enemy.remove();
            enemies.splice(index, 1);
        }
    });
}

function checkCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (isCollision(bullet, enemy)) {
                bullet.remove();
                enemy.remove();
                bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);
                score++;
                scoreBoard.textContent = score;
            }
        });
    });
}

function isCollision(bullet, enemy) {
    const bulletRect = bullet.getBoundingClientRect();
    const enemyRect = enemy.getBoundingClientRect();
    return (
        bulletRect.top <= enemyRect.bottom &&
        bulletRect.bottom >= enemyRect.top &&
        bulletRect.left <= enemyRect.right &&
        bulletRect.right >= enemyRect.left
    );
}

function gameLoop() {
    moveBullets();
    moveEnemies();
    checkCollisions();

    if (Math.random() < 0.02) {
        createEnemy();
    }

    if (enemies.length > 0 && enemies.some(enemy => enemy.offsetTop > gameContainer.clientHeight - 40)) {
        clearInterval(gameInterval);
        alert('遊戲結束！你的分數是：' + score);
    }
}

function startGame() {
    score = 0;
    scoreBoard.textContent = score;
    gameInterval = setInterval(gameLoop, 100);
}

document.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        createBullet();
    } else {
        movePlayer(event);
    }
});

startGame();
