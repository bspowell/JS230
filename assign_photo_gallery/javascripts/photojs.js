document.addEventListener('DOMContentLoaded', () => {
  let mainImage = document.querySelector('.active')

  let photos = document.querySelectorAll('ul li img')
  
  function showPhoto(event) {
    event.preventDefault();
    let image = event.target
    let imageSRC = image.getAttribute('src')
    console.log(imageSRC)
    console.log(mainImage)

    mainImage.setAttribute('src', imageSRC)

    // Add the fade class to the main image
    mainImage.classList.add('fade');

    // Wait for the transition to complete before changing the image source
    setTimeout(() => {
        mainImage.setAttribute('src', imageSRC);
        // Remove the fade class after changing the image source
        mainImage.classList.remove('fade');
    }, 500);

  }

  function mouseOver(event) {
    event.preventDefault();
    event.target.classList.add('border')
  }

  function mouseOut(event) {
    event.preventDefault();
    event.target.classList.remove('border')
  }


  photos.forEach(link => {
    link.addEventListener('click', showPhoto)
    link.addEventListener('mouseover', mouseOver);
    link.addEventListener('mouseout', mouseOut);
  });

})