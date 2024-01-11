/*

convert HTML section into template funciotn

create on click event
- when clicked, get img source and name
- create object of person
- pass in person on click to template function

// converts our HTML into a template function.
let modalTemplate = Handlebars.compile(document.getElementbyId('modalOverlay').html())

desc
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
*/ 

document.addEventListener('DOMContentLoaded', () => {
  let modalSource = document.getElementById('modalOverlay').innerHTML
  let modalTemplate = Handlebars.compile(modalSource)
  let personList = document.querySelector('main article ul')

  personList.addEventListener('click', (e) => {
    e.preventDefault();
    let img;
    if (e.target.tagName !== 'IMG') {
      img = e.target.querySelector('img')
    } else {
      img = e.target
    }
    let pName = img.getAttribute('alt')
    let imgLink = img.getAttribute('src')

    let modalContainer = document.createElement('div')
    modalContainer.innerHTML = modalTemplate({ name: pName, imgSource: imgLink })
    document.body.appendChild(modalContainer);

    let closeButton = modalContainer.querySelector('.close-btn');
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modalContainer);
    });
    
  })
})