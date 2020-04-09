
Aum Amma

## Codepen
A good site to practice html, css and javascript is (https://codepen.io/swaminathanj/pen/JjdVNLp)[codepen]. The code written as part of practice session can be found in first.html, first.css and first.js in the parent folder.

## Duke - Learn To Program
A support site for working with Javascritp as part of Coursera course Programming Fundamentals with HTML, CSS and Javascript by Duke University is (http://www.dukelearntoprogram.com/course1/example/index.php)[dukelearntoprogram]

``` js
var img = new SimpleImage(200,200);
for (var px of img.values()){
  var x = px.getX();
  var y = px.getY();
  if (y > img.getHeight()/2) {
    px.setBlue(255);
  }
  else {
        if (x > img.getWidth()/2) {
            px.setGreen(255);
        }
  }
  if (x < img.getWidth()/2){
    px.setRed(255);
  }
}
print (img);

var panda = new SimpleImage("smallpanda.png")
for (var pixel of panda.values()) {
    if (pixel.getX()<10 || pixel.getY()<10) {
        setBlack(pixel);
    }
    else if (pixel.getX()>panda.getWidth()-10 || pixel.getY()>panda.getHeight()-10) {
        setBlack(pixel);
    }
}
print(panda);

function setBlack(pixel) {
    pixel.setRed(0);
    pixel.setGreen(0);
    pixel.setBlue(0);
}

var img = new SimpleImage("duke_blue_devil.png");
print(img);
for (var pixel of img.values()) {
    if (pixel.getRed() != 255 && pixel.getGreen() != 255 && pixel.getBlue() != 255) {
        pixel.setRed(255);
        pixel.setGreen(255);
        pixel.setBlue(0);
    }
}
print(img);
img = new SimpleImage("smallpanda.png");
for (var pixel of img.values()) {
    if (pixel.getX() < img.getWidth()/3) {
        pixel.setRed(255);
    }
    else if (pixel.getX() >= img.getWidth()/3 && pixel.getX() < 2*img.getWidth()/3) {
        pixel.setGreen(255);
    }
    else {
        pixel.setBlue(255);
    }
}
print(img);
for (var pixel of img.values()) {
    var red = pixel.getRed();
    var green = pixel.getGreen();
    pixel.setGreen(red);
    pixel.setRed(green);
}
print(img);
```
