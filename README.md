## Hold your Pet

integrantes:

* Vicente Tapia <https://github.com/VicentilloTF>
* Francys Vásquez <https://github.com/Francys-vs>

```md
mi equipo de trabajo es <https://github.com/Francys-vs> y <https://github.com/VicentilloTF>, entregamos en el repositorio en este enlacen: 
 <https://github.com/Francys-vs/HoldYourPet>
```

## acerca del proyecto

"Hold your Pet" es un juego interactivo en donde el principal objetivo es pasear a un perrito mediante la interacción de detección de dedos, el jugador tendrá a su disposición un menú en donde se explicará el objetivo y función principal del juego, en donde luego de apretar teclas para navegar por el menú e instrucciones, se activará la cámara, aparecerá la mascota (un perrito) y el usuario podrá interactuar con su dedo índice y pulgar con el animal, este pidiendo desplazarse por el espacio disponible.</p>
Fue desarrollado en p5.js y ml5.js, en el primer caso, siendo usado el primer motor de programación para la activación de cámara, crfeación de personaje, y diseño de juego, mientra que, con ml5.js se utilizó la plantilla de HandPose para la detección de manos, dedos e interacción de ojeto y usuario.

"Hold your Pet" funciona en base a dos creaciones de código distintas, la primera es de Sidney Gardner, quien creó el juego "Space Shooters", donde utilizamos principalmente su parte del código para poder generar un menú seleccionador mediante teclas del computador. Luego utilizamos el código de "Patt vira" quien creó la forma de generar detección de objetos y agarre de estos con los dedos, usando esa base y adaptándola para el caso del perrito.

## código del proyecto

el código original que desarrollamos es:

Primera parte: Creación mascota y detección como "objeto".

```javascript
class Mascota {
  constructor() {
    this.t = "🐶"; 
    this.x = random(100, 300);
    this.y = random(100, 300);
    this.angle = random(TWO_PI);
    this.c = color(255);

    this.pos = createVector(this.x, this.y);
    this.w = 80;
    this.h = 80;
    
    this.fingerx = 0;
    this.fingery = 0;
  }
  
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    this.dibujarPerrito();
//    fill(this.c);
//    rect(0, 0, this.w, this.h);
    pop();
    
    fill(255, 0, 0);
    ellipse(this.fingerx, this.fingery, 10, 10);
  }
 dibujarPerrito() {
    rectMode(RADIUS);
    ellipseMode(RADIUS);
    noStroke();

    // orejas
    fill(76, 43, 32);
    rect(-25, -30, 15, 20, 14); // izquierda
    rect(25, -30, 15, 20, 14);  // derecha
    fill(80, 35, 30);
    rect(-37, -40, 13, 12, 8); // interna izquierda
    rect(37, -40, 13, 12, 8);  // interna derecha

    // cuerpo
    fill(155, 103, 60);
    ellipse(0, 0, 35, 35);

    // ojos
    fill(80);
    ellipse(-25, -15, 13, 13); // ojo izq
    ellipse(25, -15, 13, 13);  // ojo der

    // brillos ojos
    fill(250);
    ellipse(-32, -20, 3, 3);   // brillo arriba izq
    ellipse(-27, -17, 5, 5);   // brillo abajo izq
    ellipse(32, -20, 3, 3);    // brillo arriba der
    ellipse(27, -17, 5, 5);    // brillo abajo der

    // nariz
    fill(100);
    ellipse(0, 5, 10, 9);

    // patas
    fill(139, 69, 19);
    ellipse(-20, 35, 11, 11); // pata izq
    ellipse(20, 35, 11, 11);  // pata der
  }
  
  touch(thumbx, thumby, indexx, indexy) {
    let distBetweenFingers = dist(thumbx, thumby, indexx, indexy);
    this.fingerx = abs(thumbx - indexx) + min(thumbx, indexx);
    this.fingery = abs(thumby - indexy) + min(thumby, indexy);
    
    let distFromFingers = dist(this.pos.x, this.pos.y, this.fingerx, this.fingery);
    
    if (distBetweenFingers < 40 && distFromFingers < this.w/2) {
      this.c = color(255, 0, 0);
      this.pos.x = this.fingerx;
      this.pos.y = this.fingery;
    } else {
      this.c = color(255);
    }
  }
}
```
Segunda parte: Activación menú, animal, cámara y detección de manos.
``` javascript
// Este juego interactivo se llama "Hold your Pet", el objetivo es que el usuario interactúe con un perrito, moviéndolo por el espacio disponible, esto mediante la detección del movimiento de la mano (específicamente los dedos índice y pulgar).

//Este código principalmente está basado en la creadora Patt Vira (interacción de objetos con los dedos) y el creador Sidney Gardner (creador base del juego, nuestra inspiración).

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
```

## enlace del proyecto

lo hicimos en editor de [p5.js] (https://editor.p5js.org/francys.vasquez/sketches/P5jcv24c7).

## documentación multimedia / audiovisual del proyecto funcionando

Uno de los principales desafíos fue tener que crear a la mascota desde 0, puesto que al intentar que una imagen se moviera no ocurría, por lo que, se vió la necesidad de disminuir la cantidad de mascotas a una por motivos de saber aplicar el código principal de detección.  

![image](https://github.com/user-attachments/assets/542b5946-836d-49dd-bda8-49b1fd8af598)
![image](https://github.com/user-attachments/assets/3af77ca2-a379-404d-b178-e1281185239d)
![image](https://github.com/user-attachments/assets/f3d1c42d-7b7d-42a6-9cac-6564aa61f155)



## bibliografía

**link 1** (inspiración y guía para base juego):<https://editor.p5js.org/francys.vasquez/sketches/XcgRNIiso></p>
**link 2** (guía para interactividad de objetos con la cámara):<https://www.youtube.com/watch?v=72pAzuD8tqE&t=1731s></p>
**link 3** (otro referente del uso de p5js):<https://www.youtube.com/@TheCodingTrain/videos></p>
**link 4** (referente de interactividad 2):<https://www.youtube.com/watch?v=K7b5MEhPCuo&t=251s></p>
**link 6** (guías de teclas):<https://p5js.org/es/reference/p5/keyPressed/></p>

## conclusiones

Es difícil que al detección de objetos de IA es mucho más complicado cuando se trata de querer detectar objetos más complejos como un dibujo, a su vez, cuando queremos agregarlo a condicionales, debemos enfocarnos en mantener un mismo formato estándar para que no se corrompa o tire error. A futuro nos gustaría poder seguir jugando con el código de este proyecto, y a si, conseguir una variedad de mascotas e interacciones.
