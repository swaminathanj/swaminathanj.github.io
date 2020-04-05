function one() {
  alert('You called function one');
}

count = 1;
function increment() {
  var dcounter = document.getElementById("count");
  dcounter.value("Clicked " + count + " times");
  count++;
}
