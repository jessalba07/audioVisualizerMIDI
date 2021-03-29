// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/jEwAMgcCgOA

var song;
var amp; // volume
var button;
var chiY = 200;
var mappedAmp;
var volHistory = []; //array
var sparkleArray = [];
var starsIntersectEvent = false;

function preload() {
  city = loadImage('city.jpeg');
  song = loadSound('sound.mp3');
  chicago = loadImage('chicago.png');
  confetti = loadImage('confetti.gif');
}

function setup() {
  createCanvas(800, 400);
  chicago.resize(250, 0);
  confetti.resize(500, 0);
  song.loop();
  amp = new p5.Amplitude();
  angleMode(DEGREES);
  //fourier transform for the 'sun'
  fft = new p5.FFT(0.9, 256);
  fft.setInput();
}

function draw() {
  background(city);
  var vol = amp.getLevel();
  volHistory.push(vol);
  stroke(255);
  noFill();

  //animating the chicago text based on the volume.
  var volMapped = map(vol, 0, 1, 200, 210)
  image(chicago, 275, volMapped);

  //drawing the 'skyline' based on the volume.
  beginShape();
  for (var i = 0; i < volHistory.length; i++) {
    var y = map(volHistory[i], 0, 1, height / 1.4, 0);
    vertex(i * 2, y); //vertex(i*2,y) makes it more spaced out
  }
  endShape();
  if (volHistory.length > width / 2) {
    volHistory.splice(0, 1); //
  }

  //fourier transform for the 'sun'. draws a shape at the corner of the screen. the radius changes in respect to the fft. this is the frequency of the audio.
  spectrum = fft.analyze();
  beginShape();
  for (i = 0; i < spectrum.length; i++) {
    var spec = spectrum[i];
    var radius = map(spec, 0, 256, 40, 150);
    var x = radius * cos(i);
    var y = radius * sin(i);
    vertex(x, y);
  }
  endShape();


  if (vel > 0) { //recieving a note
    vel = 0;
    // mappedVel = map(vel, 0, 127, 1, 5);
    // console.log(mappedVel);
    let s = new Sparkle();
    sparkleArray.push(s);
  }
  //displaying all sparkles in the array
  for (let i = 0; i < sparkleArray.length; i++) {
    sparkleArray[i].show();
  }

  //check to see if star intersects with another, object interaction
  for (let s of sparkleArray) {
    for (let other of sparkleArray) {
      if (s !== other && s.intersects(other)) {
        starsIntersectEvent = true;
        setTimeout(stopConfetti,2000);
      }
    }
  }
  
  //if any of the stars intersect within a 4 pixel radius, set event to true, confetti will show and will wipe the all the current stars off the screen
  if (starsIntersectEvent == true) {
    image(confetti, 180, 20);
  }
}

class Sparkle {
  constructor() {
    this.x = random(0, 800);
    this.y = random(0, 200);
  }

  show() {
    push();
    strokeWeight(random(1, 4));
    point(this.x, this.y);
    pop();
  }

  intersects(other) {
    if (Math.abs(this.x - other.x) < 4 && Math.abs(this.y - other.y) < 4) {
      return true;
    } else {
      return false;
    }
  }
}

//if click on the screen, remove all the stars
function mousePressed() {
  sparkleArray = [];
}

function stopConfetti() {
  starsIntersectEvent = false;
  sparkleArray = [];
}