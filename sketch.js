// Este juego interactivo se llama "Hold your Pet", el objetivo es que el usuario interactúe con un perrito, moviéndolo por el espacio disponible, esto mediante la detección del movimiento de la mano (específicamente los dedos índice y pulgar).

//Este código principalmente está basado en la creadora _____ (interacción de objetos con los dedos) y el creador _______ (creador base del juego, nuestra inspiración).

//Para comenzar asignamos las variables que más adelante vamos a utilizar.

var pxlfont; // Tipografía 1.
var stage; // Cambio de "escena" (menú juego).
let video; // Para activar la cámara.
let font2; // Tipografía 2.
let handPose; // Variable para la detección de manos.
let hands = []; // Variable para las manos.
let mc; // Variable para "llamar" a la función de la mascota (mc).
let num = 5; // Contador.

// Primero vamos a cargar las funciones del detector de manos y las tipografías a utilizar.
function preload() {
  handPose = ml5.handPose({flipped: true});
  pxlfont = loadFont('pressstart.ttf');
  font2 = loadFont('meows.ttf');

}

// Luego vamos a crear el canvas, el cual el tamaño se debe mantener constante para evitar glicheos entre la carga de las IA's y el menú del juego seleccionable.
function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, {flipped: true}); // Se crea la captura el video.
  video.hide(); // Pedimos que se oculte, pues no es lo primero que queremos ver.
  // En este punto la cámara ya se estará activando, más no se mostrará.
  handPose.detectStart(video, gotHands); // Comienza el detector de manos.
  
  mc = new Mascota(); // Llamamos a las funciones de la mascota que se encuentran en el archivo "perro.js" (para profundizar el contenido de este archivo, haga click en "perro.js").
}


//Comenzamos la creación del menú y el juego interactivo.
function draw() {
  background(220); // Creamos el fondo en donde va a cargar la cámara y el menú.
  image(video, 0, 0, width, height); // Pedimos que ya se esté cargando la imagen de la cámara de video.
  
  startMenu(); // Llamamos a la función de "startMenu()" para asignar el diseño base del juego.
  if (stage == 1){ // Primera interacción de usuario + teclas.
    startMenu();
  }
  
  if (stage == 2) { // Segunda interacción en donde se explica el juego + teclas.
    Instrucciones();
  }
  if (stage == 3){ // Comienza la experiencia de perrito + usuario y cámara.
    Interaccion();
  }

}

// Esta función es meramente por fines estéticos.
function startMenu() {
  rectMode(CORNER);
  fill('hsl(27, 65.7%, 78.8%)');
  rect(0, 0, 640, 480);

  noStroke();
  fill('hsl(10, 73%, 68.5%)');
  rect(78, 38, 460, 120, 150);
  // x, y, ancho, largo, bordes

  fill('hsl(23, 65.1%, 54.6%)');
  rect(193, 160, 250, 75, 130);

  fill(255);
  textAlign(CENTER);
  textFont(font2);
  textSize(65);
  text('HOLD YOUR', width / 2, 100);
  text('PET', width / 2, 155);

  fill(255);
  textFont(pxlfont);
  textSize(13);
  text('alterado por', width / 2, 190);
  text('Vicente y Francys', width / 2, 215);

  fill('hsl(23, 65.1%, 54.6%)');
  textSize(10);
  text('Créditos: Sidney Gardner', width / 2, 300);

  fill('hsl(23, 65.1%, 54.6%)');
  textSize(20);
  text('Para comenzar', 325, 375);

  fill('hsl(10, 73%, 68.5%)');
  rect(240, 385, 170, 30, 130);
  textSize(15);
  fill(255);
  text('Presiona "s"', 325, 410);

  rectMode(RADIUS);
}

// La función "Instrucciones()" como lo dice su nombre, le va a explicar al jugador todo lo que implica la experiencia y lo que debe y puede hacer. 
function Instrucciones() {
  rectMode(CORNER);
  fill('hsl(27, 65.7%, 78.8%)');
  rect(0, 0, 640, 480);

  noStroke();
  fill('hsl(10, 73%, 68.5%)');
  rect(120, 8, 400, 125, 110);

  fill('hsl(23, 65.1%, 54.6%)');
  rect(165, 120, 300, 45, 130);

  fill(255);
  textAlign(CENTER);
  textFont(font2);
  textSize(60);
  text('HOLD YOUR', width / 2, 65);
  text('PET', width / 2, 115);
  textFont(pxlfont);
  textSize(20);
  text('Introducción', width / 2, 153);

  rectMode(RADIUS);
  
  fill('hsl(10, 73%, 68.5%)');
  rect(320, 277, 170, 110);

  fill(255);
  push();
  noFill(255);
  stroke(235);
  strokeWeight(5);
  rect(width / 2, 280, 170, 110);
  pop();

  textFont(pxlfont);
  textSize(10);
  text('Se te va a asignar un perrito,', width / 2, 200);
  text('el cual se encuentra aburrido.', width / 2, 230);
  text('Utiliza tus dedos índice y pulgar', width / 2, 260);
  text('para poder interactuar y', width / 2, 290);
  text('jugar con él.', width / 2, 320);
  fill('hsl(23, 65.1%, 54.6%)');
  textSize(14);
  text('Presiona "P" para jugar', width / 2, 430);

  textSize(14);
  text('*P mayúscula*', width / 2, 450);

}

// "Interaccion()" es la función principal de la interacción, pues en esta parte se encuentra la parte en donde los dedos de la mano izquierda o derecha es detectado, y , a su vez, podrá detectar al perrito como un objeto movible por el usuario.
function Interaccion() {  
  background(220); // Se crea de nuevo el fondo (una vez que el usuario lo pida al apretar la tecla correspondiente).
  image(video, 0, 0, width, height); // Carga la imagen de la cámara.
  if (hands.length > 0) { // Aquí comienza la detección de la mano, pero que se va a enfocar en los dedos.
    let index = hands[0].keypoints[8]; // Dedo índice.
    let thumb = hands[0].keypoints[4]; // Dedo pulgar.
    
    noFill(); // Esta parte es para que se dibuje un círculo pintado en el dedo pulgar para que el usuario se pueda guiar, a su vez, sale un texto que indica dónde se está ubicando el dedo índice y pulgar.
    stroke(0, 255, 0);
    text("índice", index.x, index.y); // Dedo índice y distancia.
    text("pulgar", thumb.x, thumb.y); // Dedo pulgar y distancia.
  
    // Aquí detecta si los dedos están tocando al perrito.
    for (let i=0; i<num; i++) {
     mc.touch(thumb.x, thumb.y, index.x, index.y);
    }
  }
  // De ser así se genera el movimiento del perrito, en caso contrario no se moverá.
  for (let i=0; i<num; i++) {   
    mc.display();  
}
}


// Esta función es principalmente para que funcione el apretar ciertas teclas en específico, en este caso, son para que el menú avance y comience la interacción.
function keyPressed() {
  if (key == 'r') {
    print("Clickear una tecla disponible.");
  } else if (key == 'P') {
    stage = 3; // Los stage serían los distintos sectores del menú.
  } else if (key == 'm') {
    stage = 1;
  } else if (key == 's') {
    stage = 2;
  }
}// Tenemos menú principal, menú de intrucciones y menú del juego.


// Por último se encuentra esta función que es perteneciente al detector de manos, sirve para que se muestre el resultado de la detección que se está realizando.
function gotHands(results) {
  hands = results;
}