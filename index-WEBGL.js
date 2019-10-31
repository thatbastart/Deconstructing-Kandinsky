let canvas = undefined;
let cX = [], cY = [], cZ = [], cR = [], cH = [], cS = [], cV = [], cA = [];
let lX1 = [], lX2 = [], lY1 = [], lY2 = [], lZ1 = [], lZ2 = [], lSW = [];
let lamt, camt;

function setup() {
  canvas = createCanvas(2000, 2000, WEBGL);
  canvas.parent("sketch");
  smooth(16);
}

function draw() {
  background(255);
  colorMode(HSB);
  //let camX=map(mouseX,0,width,-2000,2000);
  //let camY=map(mouseY,0,height,-2000,2000);
  //camera(camX,camY,(height/2)/tan(PI/6),0,0,0,0,1,0);
  orbitControl();

  for (let i = 0; i <= 10; i++) {
    stroke(0);
    strokeWeight(lSW[i]);
    line(lX1[i], lY1[i], lZ1[i], lX2[i], lY2[i], lZ2[i]);
  }
  for (let i = 0; i <= 10; i++) {
    translate(cX[i], cY[i], cZ[i]);
    noStroke();
    fill(cH[i], 100, 70, cA[i]);
    sphere(cR[i]);
  }
}

function keyPressed() {
  if (key === "s" || key === "S") {
    if (canvas === undefined) {
      throw new Error("Could not find your canvas");
    }
    saveCanvas(canvas, "sketch", "png");
  } else if (key === "n" || key === "N") {
    colorGen();
    for (let i = 0; i <= 20; i++) {
      //Circle
      camt = 5 + random(15);
      cX[i] = -500 + random(1000);
      cY[i] = -500 + random(1000);
      cZ[i] = -random(400);
      cR[i] = random(300); //Radius
      cA[i] = 0.05 + random(0.8); //Alpha

      //Line
      lamt = 5 + random(15);
      lX1[i] = -1000 + random(2000);
      lX2[i] = -1000 + random(2000);
      lY1[i] = -1000 + random(2000);
      lY2[i] = -1000 + random(2000);
      lZ1[i] = -random(2000);
      lZ2[i] = -random(2000);
      lSW[i] = 1 + random(10);
    }
  }
}

//COLOR GEN
function colorGen() {
  let Hseed = Math.floor(random(360));
  for (let i = 0; i <= 20; i++) {
    switch (Math.round(random(1))) {
      case 0:
        switch (Math.round(random(1))) {
          case 0: cH[i] = Hseed + Math.floor(random(5)); break;
          case 1: cH[i] = Hseed - Math.floor(random(5)); break;
        }
        cS[i] = 50 + random(50);
        cV[i] = 50 + random(50);
        break;
      case 1:
        switch (Math.round(random(1))) {
          case 0: cH[i] = hue_comp(Hseed) + Math.floor(random(5)); break;
          case 1: cH[i] = hue_comp(Hseed) - Math.floor(random(5)); break;
        }
        cS[i] = 50 + random(50);
        cV[i] = 50 + random(50);
        break;
    }
  }
}

//HUE COMP
function hue_comp(H) {
  let aR, aG, aB;
  let bR, bY, bB;
  let cH;
  let S = 100;
  let V = 100;

  aR = HSV2RGB(H, S, V)[0];
  aG = HSV2RGB(H, S, V)[1];
  aB = HSV2RGB(H, S, V)[2];

  bR = RGB2RYB(aR, aG, aB)[0];
  bY = RGB2RYB(aR, aG, aB)[1];
  bB = RGB2RYB(aR, aG, aB)[2];

  bR = 255 - bR;
  bY = 255 - bY;
  bB = 255 - bB;

  aR = RYB2RGB(bR, bY, bB)[0];
  aG = RYB2RGB(bR, bY, bB)[1];
  aB = RYB2RGB(bR, bY, bB)[2];

  cH = RGB2HSV(aR, aG, aB)[0];

  return cH;
}

//RGB<->RYB Conversion Code adopted from http://www.deathbysoftware.com/colors/index.html
function RGB2RYB(R, G, B) {
  let W = Math.min(R, G, B);
  R -= W;
  G -= W;
  B -= W;
  let MaxG = Math.max(R, G, B);

  let Y = Math.min(R, G);
  R -= Y;
  G -= Y;

  if (B > 0 && G > 0) {
    B /= 2;
    G /= 2;
  }

  Y += G;
  B += G;

  let MaxY = Math.max(R, Y, B);
  if (MaxY > 0) {
    let N = MaxG / MaxY;

    R *= N;
    Y *= N;
    B *= N;
  }

  R += W;
  Y += W;
  B += W;

  return [Math.floor(R), Math.floor(Y), Math.floor(B)];
}

function RYB2RGB(R, Y, B) {
  let W = Math.min(R, Y, B);
  R -= W;
  Y -= W;
  B -= W;
  let MaxY = Math.max(R, Y, B);

  let G = Math.min(Y, B);
  Y -= G;
  B -= G;

  if (B > 0 && G > 0) {
    B *= 2.0;
    G *= 2.0;
  }

  R += Y;
  G += Y;

  let MaxG = Math.max(R, G, B);

  if (MaxG > 0) {
    let N = MaxY / MaxG;

    R *= N;
    G *= N;
    B *= N;
  }

  R += W;
  G += W;
  B += W;

  return [Math.floor(R), Math.floor(G), Math.floor(B)];
}

//HSV<->RGB Conversion Code adopted from https://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
function RGB2HSV(r, g, b) {
  (r = r / 255), (g = g / 255), (b = b / 255);
  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    v = max;

  let d = max - min;
  s = max == 0 ? 0 : d / max;

  if (max == min) {
    h = 0;
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }
  s *= 100;
  v *= 100;
  h = Math.floor(h);
  return [h, s, v];
}

function HSV2RGB(h, s, v) {
  let r, g, b;

  h /= 360;
  s /= 100;
  v /= 100;

  let i = Math.floor(h * 6);
  let f = h * 6 - i;
  let p = v * (1 - s);
  let q = v * (1 - f * s);
  let t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0: (r = v), (g = t), (b = p); break;
    case 1: (r = q), (g = v), (b = p); break;
    case 2: (r = p), (g = v), (b = t); break;
    case 3: (r = p), (g = q), (b = v); break;
    case 4: (r = t), (g = p), (b = v); break;
    case 5: (r = v), (g = p), (b = q); break;
  }

  return [r * 255, g * 255, b * 255];
}
