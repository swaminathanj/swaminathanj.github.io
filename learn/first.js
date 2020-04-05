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
