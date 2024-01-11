document.addEventListener('DOMContentLoaded', () => {

  let groceryList = document.getElementById('grocery-list')
  let form = document.querySelector('form')

  form.addEventListener('submit', (e) => {
    e.preventDefault()

    let name = document.getElementById('name').value
    let quantity = document.getElementById('quantity').value

    let li = document.createElement('li')
    li.appendChild(document.createTextNode(`${(quantity || '1')} ${name}`))
    groceryList.appendChild(li)
    
    form.reset()
  })

})