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
