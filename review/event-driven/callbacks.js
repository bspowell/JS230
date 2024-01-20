function startCounter(callback) {
  let count = 1;

  let timer = setInterval( () => {
    if(!callback(count)) {
      count++;
    } else {
      clearInterval(timer)
    }
  }, 1000)
}


// Example usage:
startCounter((count) => {
  console.log(count);
  return count === 5;
});
// Logs 1, 2, 3, 4, 5, then stops