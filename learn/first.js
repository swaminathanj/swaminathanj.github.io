function one() {
  alert('You called function one');
}

count = 0;
function increment() {
  var dcounter = document.getElementById("count");
  count++;
  alert('counter incremented to ' + count);
  dcounter.value = "Clicked " + count + " times";
}
