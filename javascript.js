let canvas = document.getElementById("snake");
let context = canvas.getContext("2d");
let box = 32;

let snake = [];
snake[0] = {
    x: 8 * box,
    y: 8 * box
}

let food =  {
    //comida deve ser criada randomicamente
    x: Math.floor(Math.random() * 15 + 1) * box,
    y: Math.floor(Math.random() * 15 + 1) * box
}

//define direção inicial do movimento
let direction = "right";

//cria plano (canvas do jogo)
function criarBG(){
    context.fillStyle = "lightgreen";
    context.fillRect(0, 0, 16 * box, 16 * box);
}

//desenha cobrinha no canvas
function criarCobrinha(){
    for(i=0; i < snake.length; i++){
        context.fillStyle = "green";
        context.fillRect(snake[i].x, snake[i].y, box, box);
        if(i==0){
            //desenha olhos para indicar a cabeça da cobrinha
            let q_box = box / 8;
            context.fillStyle = "black";
            context.fillRect((snake[i].x + q_box), (snake[i].y + q_box * 2), q_box * 2, q_box * 2);
            context.fillRect((snake[i].x + q_box * 5), (snake[i].y + q_box * 2), q_box * 2, q_box * 2);
        }
    }
}

//desenha comida no canvas
function drawFood(){
    context.fillStyle = "red";
    context.fillRect(food.x, food.y, box, box);
}

document.addEventListener("keydown", update);   //listener que captura quando um botão do teclado é pressionado e chama  função update

function update(event){
    //não é permitido "voltar" abruptamente de direção
    if (event.keyCode == 37 && direction != "right") direction = "left";    //key code 37 é da tecla da esquerda
    else if (event.keyCode == 39 && direction != "left") direction = "right";
    else if (event.keyCode == 38 && direction !="down") direction = "up";
    else if (event.keyCode == 40 && direction !="up") direction = "down";
}

function iniciarJogo(){
    
    //lógica para cobrinha "atravessar parede" - tamanho do canvas é 16
    if (snake[0].x > 15 * box) snake[0].x = 0;
    if (snake[0].x < 0 * box) snake[0].x = 16 * box;
    if (snake[0].y > 15 * box) snake[0].y = 0;
    if (snake[0].y < 0 * box) snake[0].y = 16 * box;

    for(i = 1; i < snake.length; i++){
        if (snake[0].x == snake[i].x && snake[0].y == snake[i].y){      //termina o jogo
            clearInterval(jogo);    //termina exeucução da função jogo - chamada no setInterval
            document.getElementsByClassName("info")[0].style.color = "red";
            alert("Pimba! Game over!\nJogou por " + (tempo_jogado/1000) + "s e comeu " + (snake.length - 1) + " comidas.\nMédia: 1 comida a cada " + ((tempo_jogado/1000)/(snake.length - 1)).toFixed(3) + "s.");
        }
    }
    
    criarBG();
    criarCobrinha();
    drawFood();


    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    //lógica de movimentação da cobrinha
    if(direction == "right") snakeX += box;
    else if (direction == "left") snakeX -= box;
    else if (direction == "up") snakeY -= box;
    else if (direction == "down") snakeY += box;

    if(snakeX != food.x || snakeY != food.y){   //cobrinha não encontrou comida
        snake.pop();
    }
    else{   //cobrinha encontrou comida
        food.x = Math.floor(Math.random() * 15 + 1) * box;
        food.y = Math.floor(Math.random() * 15 + 1) * box;
        audio.play();   //toca som da moeda do mario
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    }

    snake.unshift(newHead);     //acrescenta item no início do array

    //atualiza informação de tempo e quantidade de comidas
    tempo_jogado = Date.now() - duracao;
    document.getElementsByClassName("gameInfo")[0].innerHTML = `Comidas: ${(snake.length - 1)}`;
    document.getElementsByClassName("gameInfo")[1].innerHTML = `Tempo: ${(tempo_jogado)/1000}s`;
}

let duracao = Date.now();
let tempo_jogado = duracao;

var audio = new Audio('coin.mp3');

//atualiza a cada 100ms
let jogo = setInterval(iniciarJogo, 100);