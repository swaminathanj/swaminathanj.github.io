function one() {
  alert('You called function one');
}


/* 
    delem = document.getElementById("elem"); // elem may be button, ol, ul, p, div or any object
    elem.value = "New text"; // For changing button text
    elem.innerHTML = "New text"; // For changing normal text
    elem.className = "newtheme"; // where css file definition includes .newtheme { color: blue; }
*/

count = 0;
function increment() {
  var dcounter = document.getElementById("count");
  count++;
  dcounter.value = "Clicked " + count + " times";
}

function changeColor() {
  var cc = document.getElementById("c1");
  cc.style.backgroundColor = "blue";
}

function fill() {
  var cc = document.getElementById("c1");
  var ctx = cc.getContext("2d");
  ctx.fillStyle = "red";
  ctx.fillRect(20,20,40,40);
  ctx.fillRect(40,40,40,40);
  ctx.fillRect(60,60,40,40);
  ctx.fillRect(100,80,100,40);
  ctx.font = "30px Arial";
  ctx.fillText("Aum Amma",60,40);
}

function cclear() {
  var cc = document.getElementById("c1");
  var ctx = cc.getContext("2d");
  ctx.clearRect(25,25,30,30);
}

function doColor() {
  var cc = document.getElementById("c2");
  var colorinput = document.getElementById("clr");
  cc.style.backgroundColor = colorinput.value;
}

function doSquare() {
  var cc = document.getElementById("c2");
  var sizeinput = document.getElementById("sldr");
  var size = sizeinput.value;
  var ctx = cc.getContext("2d");
  ctx.clearRect(0,0,cc.width,cc.height);
  ctx.fillStyle = "green";
  ctx.fillRect(10,10,size,size);
}

var image;

function imageUpload() {
  var imgcanvas = document.getElementById("c3");
  var fileinput = document.getElementById("finput");
  alert("image selected");
  image = new SimpleImage(fileinput);
  alert("image created");
  image.drawTo(imgcanvas);
}

function makeGray() {
  for (var pixel of image.values()) {
    var avg = (pixel.getRed() + pixel.getGreen() + pixel.getBlue())/3;
    pixel.setRed(avg);
    pixel.setGreen(avg);
    pixel.setBlue(avg);
  }
  var imgcanvas = document.getElementById("c4");
  image.drawTo(imgcanvas);
}

var image1=null, image2=null;
var canvas1, canvas2;
function loadfgImage() {
  canvas1 = document.getElementById("fgcanvas");
  var fileinput = document.getElementById("fgfile");
  image1 = new SimpleImage(fileinput);
  image1.drawTo(canvas1);
}

function loadbgImage() {
  canvas2 = document.getElementById("bgcanvas");
  var fileinput = document.getElementById("bgfile");
  image2 = new SimpleImage(fileinput);
  image2.drawTo(canvas2);
}

function createComposite() {
  alert("createComposite begin");
  var output = new SimpleImage(image1.getWidth(),image1.getHeight());
  for (var pixel of image1.values()) {
    var x = pixel.getX();
    var y = pixel.getY();
    if (pixel.getGreen() > pixel.getRed() + pixel.getBlue()) {
      var bgPixel = image2.getPixel(x,y);
      output.setPixel(x,y,bgPixel);
    }
    else
      output.setPixel(x,y,pixel);
  }
  clearCanvases();
  alert("drawing ....");
  output.drawTo(canvas1);
}

function clearCanvases() {
  alert("clearCanvases begin");
  var ctx1 = canvas1.getContext("2d");
  ctx1.clearRect(0,0,canvas1.width,canvas1.height);
  var ctx2 = canvas2.getContext("2d");
  ctx2.clearRect(0,0,canvas2.width,canvas2.height);
}

