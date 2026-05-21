const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 1000;
canvas.height = 600;

// =======================
// VARIABLES
// =======================

let score = 0;
let level = 1;

let mouseX = 300;
let mouseY = 300;

let power = 0;
let charging = false;

let launched = false;

let particles = [];

// =======================
// PELOTA
// =======================

let ball = {

    x: 100,
    y: 500,

    radius: 18,

    velocityX: 0,
    velocityY: 0,

    gravity: 0.25
};

// =======================
// CANASTA
// =======================

let hoop = {

    x: 850,
    y: 260,

    startX: 850,

    width: 15,
    height: 140,

    directionY: 1,
    directionX: 1,

    speed: 2
};

// =======================
// MOUSE
// =======================

canvas.addEventListener("mousemove", function(event){

    const rect = canvas.getBoundingClientRect();

    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
});

// =======================
// FONDO
// =======================

function drawBackground(){

    const gradient = ctx.createLinearGradient(0,0,0,600);

    gradient.addColorStop(0,"#4facfe");
    gradient.addColorStop(1,"#dff6ff");

    ctx.fillStyle = gradient;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // Sol
    ctx.beginPath();
    ctx.arc(120,90,45,0,Math.PI*2);

    ctx.fillStyle = "#ffe066";
    ctx.fill();

    // Piso
    ctx.fillStyle = "#2f9e44";
    ctx.fillRect(0,550,canvas.width,50);

    // Línea blanca
    ctx.fillStyle = "white";
    ctx.fillRect(0,545,canvas.width,5);

    // Nubes
    drawCloud(180,90);
    drawCloud(500,60);
    drawCloud(820,110);
}

// =======================
// NUBES
// =======================

function drawCloud(x,y){

    ctx.fillStyle = "rgba(255,255,255,0.9)";

    ctx.beginPath();

    ctx.arc(x,y,30,0,Math.PI*2);
    ctx.arc(x+30,y-15,35,0,Math.PI*2);
    ctx.arc(x+70,y,30,0,Math.PI*2);

    ctx.fill();
}

// =======================
// PELOTA
// =======================

function drawBall(){

    ctx.beginPath();

    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);

    const gradient = ctx.createRadialGradient(
        ball.x - 5,
        ball.y - 5,
        5,
        ball.x,
        ball.y,
        25
    );

    gradient.addColorStop(0,"#ffb347");
    gradient.addColorStop(1,"#ff5e00");

    ctx.fillStyle = gradient;

    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = 12;

    ctx.fill();

    ctx.closePath();

    ctx.shadowBlur = 0;
}

// =======================
// CANASTA
// =======================

function drawHoop(){

    ctx.fillStyle = "#ff0000";
    ctx.fillRect(hoop.x, hoop.y, hoop.width, hoop.height);

    ctx.fillStyle = "#ffae00";
    ctx.fillRect(hoop.x - 60, hoop.y + 20, 60, 8);

    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.fillRect(hoop.x - 15, hoop.y - 20, 20, 60);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;

    for(let i = 0; i < 6; i++){

        ctx.beginPath();

        ctx.moveTo(hoop.x - 60 + i * 10, hoop.y + 28);

        ctx.lineTo(hoop.x - 55 + i * 10, hoop.y + 50);

        ctx.stroke();
    }
}

// =======================
// APUNTADO
// =======================

function drawAimLine(){

    if(!launched){

        ctx.beginPath();

        ctx.moveTo(ball.x, ball.y);
        ctx.lineTo(mouseX, mouseY);

        ctx.strokeStyle = "rgba(255,255,255,0.8)";
        ctx.lineWidth = 3;

        ctx.setLineDash([10,10]);

        ctx.stroke();

        ctx.setLineDash([]);
    }
}

// =======================
// BARRA FUERZA
// =======================

function drawPowerBar(){

    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(30,30,240,25);

    const gradient = ctx.createLinearGradient(0,0,240,0);

    gradient.addColorStop(0,"#00ff88");
    gradient.addColorStop(1,"#00c3ff");

    ctx.fillStyle = gradient;

    ctx.fillRect(35,35,power * 2.2,15);

    ctx.fillStyle = "white";
    ctx.font = "18px Arial";

    ctx.fillText("Fuerza",100,80);
}

// =======================
// TEXTO
// =======================

function drawText(){

    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(760,20,200,100);

    ctx.fillStyle = "white";

    ctx.font = "28px Arial";

    ctx.fillText("Puntos: " + score, 785, 55);

    ctx.fillText("Nivel: " + level, 785, 95);

    if(!launched){

        ctx.fillStyle = "rgba(0,0,0,0.25)";
        ctx.fillRect(250,500,500,45);

        ctx.fillStyle = "white";

        ctx.font = "28px Arial";

        ctx.fillText(
            "Apunta y mantén ESPACIO",
            310,
            532
        );
    }
}

// =======================
// PARTÍCULAS
// =======================

function createParticles(x,y){

    for(let i = 0; i < 20; i++){

        particles.push({

            x: x,
            y: y,

            size: Math.random() * 6 + 2,

            speedX: (Math.random() - 0.5) * 8,
            speedY: (Math.random() - 0.5) * 8,

            life: 60
        });
    }
}

function drawParticles(){

    for(let i = 0; i < particles.length; i++){

        let p = particles[i];

        ctx.beginPath();

        ctx.arc(p.x,p.y,p.size,0,Math.PI*2);

        ctx.fillStyle = "#ffe066";

        ctx.fill();

        p.x += p.speedX;
        p.y += p.speedY;

        p.life--;

        if(p.life <= 0){

            particles.splice(i,1);
            i--;
        }
    }
}

// =======================
// REINICIAR
// =======================

function resetBall(){

    ball.x = 100;
    ball.y = 500;

    ball.velocityX = 0;
    ball.velocityY = 0;

    launched = false;

    power = 0;
}

// =======================
// BOTÓN REINICIAR
// =======================

const resetButton = document.getElementById("resetButton");

resetButton.addEventListener("click", function(){

    resetBall();
});

// =======================
// NIVELES
// =======================

function updateLevel(){

    if(score >= 5){

        level = 2;
        hoop.speed = 3;
    }

    if(score >= 10){

        level = 3;
        hoop.speed = 4;
    }

    if(score >= 15){

        level = 4;
        hoop.speed = 5;
    }

    if(score >= 20){

        level = 5;
        hoop.speed = 6;
    }
}

// =======================
// PUNTAJE
// =======================

function checkScore(){

    if(
        ball.x > hoop.x - 60 &&
        ball.x < hoop.x &&
        ball.y > hoop.y + 20 &&
        ball.y < hoop.y + 50
    ){

        score++;

        createParticles(ball.x,ball.y);

        updateLevel();

        resetBall();
    }
}

// =======================
// CONTROLES
// =======================

document.addEventListener("keydown", function(event){

    if(event.code === "Space" && !charging && !launched){

        charging = true;
    }
});

document.addEventListener("keyup", function(event){

    if(event.code === "Space" && charging && !launched){

        charging = false;

        let dx = mouseX - ball.x;
        let dy = mouseY - ball.y;

        let distance = Math.sqrt(dx * dx + dy * dy);

        dx /= distance;
        dy /= distance;

        ball.velocityX = dx * power * 0.28;
        ball.velocityY = dy * power * 0.28;

        launched = true;
    }
});

// =======================
// UPDATE
// =======================

function update(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    drawBackground();

    if(charging){

        power += 1.2;

        if(power > 100){

            power = 100;
        }
    }

    // Física
    if(launched){

        ball.velocityY += ball.gravity;

        ball.x += ball.velocityX;
        ball.y += ball.velocityY;

        ball.velocityX *= 0.995;
    }

    // Rebote
    if(ball.y + ball.radius > 550){

        ball.y = 550 - ball.radius;

        ball.velocityY *= -0.55;
    }

    // NIVEL 1
    if(level === 1){

        hoop.x = 850;
        hoop.y = 260;
    }

    // NIVEL 2
    if(level === 2){

        hoop.y += hoop.directionY * hoop.speed;

        if(hoop.y < 170 || hoop.y > 330){

            hoop.directionY *= -1;
        }
    }

    // NIVEL 3+
    if(level >= 3){

        hoop.y += hoop.directionY * hoop.speed;

        if(hoop.y < 150 || hoop.y > 350){

            hoop.directionY *= -1;
        }

        hoop.x += hoop.directionX * hoop.speed;

        if(hoop.x < 700 || hoop.x > 900){

            hoop.directionX *= -1;
        }
    }

    // Reinicio automático
    if(
        ball.x > canvas.width ||
        ball.x < 0 ||
        ball.y > canvas.height
    ){

        resetBall();
    }

    checkScore();

    drawAimLine();
    drawHoop();
    drawBall();
    drawParticles();
    drawPowerBar();
    drawText();

    requestAnimationFrame(update);
}

update();