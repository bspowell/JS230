function waterfallOverCallbacks(array, num) {
	array.forEach(callback => num = callback(num));
  console.log(num);
}
const double = (x) => x * 2;
waterfallOverCallbacks([double, double, double], 1);