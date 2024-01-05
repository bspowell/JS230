function flakyService() {
  return new Promise((resolve, reject) => {
    if (Math.random() > 0.5) {
      resolve("Operation successful");
    } else {
      reject("Operation failed");
    }
  });
}

function loadData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      // loadData always resolves this time
      resolve("Data loaded");
    }, 1000);
  });
}

const primaryOperation = flakyService();
const fallbackOperation = loadData();