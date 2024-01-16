document.addEventListener('DOMContentLoaded', () => {
  let photos;
  let currentPhoto;

  fetch('/photos')
  .then(response => response.json())
  .then(json => {
    photos = json;
    renderPhotos();
    renderPhotoInfo(photos[0])
    fetchComments(photos[0].id)
    currentPhoto = photos[0]
  })

  function renderPhotos() {
    let photosTemplateSource = document.getElementById('photos').innerHTML
    let photoTemplate = Handlebars.compile(photosTemplateSource)
    let html = photoTemplate({ photos: photos })

    let slides = document.getElementById('slides')
    slides.innerHTML = html;
    document.querySelector("[data-id='1']").classList.add('show')
  }

  function renderPhotoInfo(photo) {
    let photoInfoTempSource = document.getElementById('photo_information').innerHTML
    let photoInfoTemplate = Handlebars.compile(photoInfoTempSource)
    let photoInfoHtml = photoInfoTemplate({
      title: photo.title, 
      created_at: photo.created_at, 
      likes: photo.likes, 
      favorites: photo.favorites, 
      id: photo.id
    })

    let photoInfoHeader = document.querySelector('section header')
    photoInfoHeader.innerHTML = photoInfoHtml
  }

  function fetchComments(photoId) {
    Handlebars.registerPartial('photo_comment', document.querySelector('[data-type=partial]').innerHTML)
    
    fetch('/comments?photo_id=' + photoId)
    .then(response => response.json())
    .then(comment_json => {
      let comments_list = document.querySelector('#comments ul')
      let commentsTempSource = document.getElementById('photo_comments').innerHTML
      let commentsTemplate = Handlebars.compile(commentsTempSource)
      comments_list.innerHTML = commentsTemplate({ comments: comment_json })
    })
  }

  // fades photos
  function fadePhoto(photoId) {
    let figureToFade = document.querySelector(`figure[data-id='${photoId}']`)
    figureToFade.classList.toggle('show')
  }

  // show + hides next photos
  function nextPhoto(nextId) {
    // hide current photo
    fadePhoto(currentPhoto.id)
    // unhide next photo
    fadePhoto(nextId)
    // set current photo
    currentPhoto = photos[nextId - 1]

    // render photo info and comments
    renderPhotoInfo(currentPhoto)
    fetchComments(currentPhoto.id)
  }

  // gets photo id
  function getNextId(num) {
    let nextId;

    if (num) {
      if(currentPhoto.id === photos.length) { 
        nextId = 1;
      } else {
        nextId = currentPhoto.id + 1;
      }
    } else {
      if(currentPhoto.id === 1) { 
        nextId = photos.length;
      } else {
        nextId = currentPhoto.id - 1;
      }
    }
    return nextId;
  }
  
  document.querySelector('#slideshow ul').addEventListener('click', (e) => {
    e.preventDefault();

    if (e.target.classList.contains('prev')) { 
      let num = getNextId(0);
      nextPhoto(num); 
    }
    if (e.target.classList.contains('next')) { 
      let num = getNextId(1);
      nextPhoto(num); 
    }
  })

  document.querySelector("section > header").addEventListener("click", function(e) {
    e.preventDefault();
    let button = e.target;
    let buttonType = button.getAttribute("data-property"); // likes or favorites
    if (buttonType) {
      let href = button.getAttribute("href");
      let dataId = button.getAttribute("data-id");
      let text = button.textContent;
  
      // send the photo id to the server, returns a json object { total: # }
      fetch(href, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: 'photo_id=' + dataId
      })
      .then(response => response.json())
      .then(json => {
        // change text content on button
        button.textContent = text.replace(/\d+/, json.total);
        // adjust photos to equal updated photos
        fetch("/photos")
          .then(response => response.json())
          .then(json => photos = json);
      });
    }
  });
  
  document.querySelector("form").addEventListener('submit', (e) => {
    e.preventDefault();
    let form = e.target;
    let currentSlideId = document.querySelector('#slideshow .show').getAttribute('data-id')
    let input = document.querySelectorAll('form [name]');
    let body = {};

    // inputting each attr/value pair into body object {photo_id: '1', name: '', email: '', body: ''}
    input.forEach(ele => {
      let formEle = ele.getAttribute('name')
      body[formEle] = ele.value;
    })
    body.photo_id = currentSlideId;

    // serializing the data
    let serialized = new URLSearchParams(body)

    // post data to server and get json back with date and gravatar
    fetch("/comments/new", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: serialized.toString()
    })
      .then(response => response.json())
      .then(json => {
        fetchComments(json.photo_id)
        form.reset();
      })
  })
})


