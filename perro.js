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