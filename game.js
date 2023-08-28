const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const PLAYER = '🦜';
const ENEMY = '👩‍🦱';
const PROJECTILE = '🎻';
const ENEMY_PROJECTILE1 = '音程';
const ENEMY_PROJECTILE2 = 'リズム';

let playerX = canvas.width / 2;
const playerY = canvas.height - 30;
const enemies = [];
const projectiles = [];
const enemyProjectiles = [];
let enemySpeed = 0.1;

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawEnemies() {
    for (let enemy of enemies) {
        ctx.fillText(ENEMY, enemy.x, enemy.y);
    }
}

function drawPlayer() {
    ctx.fillText(PLAYER, playerX, playerY);
}

function drawProjectiles() {
    for (let projectile of projectiles) {
        ctx.fillText(PROJECTILE, projectile.x, projectile.y);
    }
}

function checkCollision(rect1, rect2) {
    return rect1.x - 5 < rect2.x + rect2.width &&
           rect1.x + rect1.width + 5 > rect2.x &&
           rect1.y - 5 < rect2.y + rect2.height &&
           rect1.y + rect1.height + 5 > rect2.y;
}

function updateGame() {    const randomProjectile = Math.random() < 0.5 ? ENEMY_PROJECTILE1 : ENEMY_PROJECTILE2;

    clearCanvas();

    for (let enemy of enemies) {
        enemy.y += enemySpeed;

        if (enemy.y >= playerY) {
            alert('Game Over');
            location.reload();
            return;
        }
    }

    for (let i = projectiles.length - 1; i >= 0; i--) {
        projectiles[i].y -= 5;

        for (let j = enemies.length - 1; j >= 0; j--) {
            if (checkCollision({ x: projectiles[i].x, y: projectiles[i].y, width: 10, height: 10 }, 
                               { x: enemies[j].x, y: enemies[j].y, width: 10, height: 10 })) {
                enemies.splice(j, 1);
                projectiles.splice(i, 1);
                break;
            }
        }
    }

    if (enemies.length === 0) {
        alert('You Win');
        location.reload();
        return;
    }

    drawEnemies();
    drawPlayer();
    drawProjectiles();
drawEnemyProjectiles();

    
    // Enemies attack logic
    if (Math.random() < 0.02 && enemies.length > 0) {  // 2% chance every frame for an enemy to shoot
        const attackingEnemy = enemies[Math.floor(Math.random() * enemies.length)];
        enemyProjectiles.push({ x: attackingEnemy.x, y: attackingEnemy.y + 10, type: randomProjectile });
    }
    
    for (let i = enemyProjectiles.length - 1; i >= 0; i--) {
        enemyProjectiles[i].y += 3;
        
        if (checkCollision({ x: enemyProjectiles[i].x, y: enemyProjectiles[i].y, width: 25, height: 10 }, 
                           { x: playerX, y: playerY, width: 10, height: 10 })) {
            alert('Game Over');
            location.reload();
            return;
        }
        
        if (enemyProjectiles[i].y >= canvas.height) {
            enemyProjectiles.splice(i, 1);
        }
    }

    function drawEnemyProjectiles() {
        for (let projectile of enemyProjectiles) {
            ctx.fillText(projectile.type, projectile.x, projectile.y);
        }
    }
requestAnimationFrame(updateGame);
}

let moveLeftInterval, moveRightInterval, attackInterval;

function moveLeftAction() {
    if (playerX > 10) {
        playerX -= 10;
    }
}

function moveRightAction() {
    if (playerX < canvas.width - 10) {
        playerX += 10;
    }
}

function attackAction() {
    projectiles.push({ x: playerX, y: playerY });
}

document.getElementById('moveLeft').addEventListener('mousedown', function() {
    moveLeftAction();
    moveLeftInterval = setInterval(moveLeftAction, 100);
});

document.getElementById('moveRight').addEventListener('mousedown', function() {
    moveRightAction();
    moveRightInterval = setInterval(moveRightAction, 100);
});

document.getElementById('attack').addEventListener('mousedown', function() {
    attackAction();
    attackInterval = setInterval(attackAction, 100);
});

document.getElementById('moveLeft').addEventListener('mouseup', function() {
    clearInterval(moveLeftInterval);
});

document.getElementById('moveRight').addEventListener('mouseup', function() {
    clearInterval(moveRightInterval);
});

document.getElementById('attack').addEventListener('mouseup', function() {
    clearInterval(attackInterval);
});

document.getElementById('moveLeft').addEventListener('mouseleave', function() {
    clearInterval(moveLeftInterval);
});

document.getElementById('moveRight').addEventListener('mouseleave', function() {
    clearInterval(moveRightInterval);
});

document.getElementById('attack').addEventListener('mouseleave', function() {
    clearInterval(attackInterval);
});

document.getElementById('moveLeft').addEventListener('touchstart', function(event) {
    event.preventDefault();
    moveLeftAction();
    moveLeftInterval = setInterval(moveLeftAction, 100);
});

document.getElementById('moveRight').addEventListener('touchstart', function(event) {
    event.preventDefault();
    moveRightAction();
    moveRightInterval = setInterval(moveRightAction, 100);
});

document.getElementById('attack').addEventListener('touchstart', function(event) {
    event.preventDefault();
    attackAction();
    attackInterval = setInterval(attackAction, 100);
});

document.getElementById('moveLeft').addEventListener('touchend', function() {
    clearInterval(moveLeftInterval);
});

document.getElementById('moveRight').addEventListener('touchend', function() {
    clearInterval(moveRightInterval);
});

document.getElementById('attack').addEventListener('touchend', function() {
    clearInterval(attackInterval);
});

document.getElementById('moveLeft').addEventListener('touchmove', function(event) {
    if (!isTouchInsideButton(event, 'moveLeft')) {
        clearInterval(moveLeftInterval);
    }
});

document.getElementById('moveRight').addEventListener('touchmove', function(event) {
    if (!isTouchInsideButton(event, 'moveRight')) {
        clearInterval(moveRightInterval);
    }
});

document.getElementById('attack').addEventListener('touchmove', function(event) {
    if (!isTouchInsideButton(event, 'attack')) {
        clearInterval(attackInterval);
    }
});

document.getElementById('resetGame').addEventListener('click', function() {
    location.reload();
});

function isTouchInsideButton(event, buttonId) {
    const button = document.getElementById(buttonId);
    const touchX = event.touches[0].clientX;
    const touchY = event.touches[0].clientY;
    const rect = button.getBoundingClientRect();
    return (touchX >= rect.left && touchX <= rect.right && touchY >= rect.top && touchY <= rect.bottom);
}

for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 10; j++) {
        enemies.push({ x: 10 + j * 30, y: 30 + i * 40 });
    }
}

updateGame();


