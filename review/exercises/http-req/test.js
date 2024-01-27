
let url = 'http://worldtimeapi.org/api/timezone/America/Seattle'

async function getData() {
  let responseObj = await fetch(url)
  let data = responseObj.json()
  console.log(data)
}

getData() 

