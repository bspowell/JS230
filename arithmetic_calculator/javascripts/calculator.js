
document.addEventListener('DOMContentLoaded', () => {
  let submit = document.querySelector('[type=submit]')

  let result = document.getElementById('result')
  let total;

  submit.addEventListener('click', (e) => {
    e.preventDefault()
    let inputOne = document.querySelector('#first-number').value
    let inputTwo = document.querySelector('#second-number').value
    let operator = document.querySelector('#operator').value

    switch (operator) {
      case '+':
        total = Number(inputOne) + Number(inputTwo)
        break;
      case '-':
        total = Number(inputOne) - Number(inputTwo)
        break;
      case '*':
        total = Number(inputOne) * Number(inputTwo)
        break;
      case '/':
        total = Number(inputOne) / Number(inputTwo)
    }

    result.textContent = total

  })

})