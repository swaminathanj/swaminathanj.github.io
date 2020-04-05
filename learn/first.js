function one() {
  alert('You called function one');
}

count = 0;
function increment() {
  var dcounter = document.getElementById("count");
  count++;
  dcounter.value("Clicked " + count + " times");
}
