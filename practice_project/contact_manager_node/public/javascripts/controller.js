
class ContactManager {
  constructor() {
    this.bindEvents()
    this.renderInitialContacts()
    Handlebars.registerPartial('contactPartial', document.querySelector('[data-type=partial]').innerHTML)
    // this.form = document.querySelector('form')
  }
  async getContacts() {
    try {
      const result = await fetch('/api/contacts')
      return await result.json()
    } catch (error) {
      console.error(error)
    }
    // .then(data => this.renderContactsSection(data))
  }

  async addContact(data) {
    try {
      let options = {
        method: "POST",
        body: data,
        headers: { "Content-Type": "application/json"}
      }
      const result = await fetch('/api/contacts/', options)
      if (result.ok) {
        console.log(`Success: ${result.statusText}`)
      }
    } catch (error) {
      console.log(`Error: ${error.responseText}`)
    }
  }

  async renderInitialContacts() {
    let result = await this.getContacts()
    this.renderContactsSection(result)
  }

  bindEvents() {
    document.addEventListener('click', this.submitFormEvent.bind(this))
    document.addEventListener('click', this.addContactForm.bind(this))
    document.addEventListener('click', this.cancelForm.bind(this))
    document.addEventListener('keyup', this.collectInput.bind(this))
  }

  renderContactsSection(contacts) {
    let section = document.querySelector('.list-contacts-section')
    let input = document.querySelector('#search-bar').value

    if (contacts.length > 0) {
      section.textContent = '';

      let contactTemplateSource = document.querySelector('#contacts').innerHTML
      let contactTemplate = Handlebars.compile(contactTemplateSource)
      section.innerHTML = contactTemplate({ contact: contacts })
    } 
  }
// Search Query

  async collectInput(event) {
    if (event.target.id !== 'search-bar') { return; }

    let input = document.querySelector('#search-bar').value
    let contacts;
    if (input) {
      contacts = await this.filterContacts(String(input))
    } else {
      contacts = await this.getContacts();
    }
    this.renderContactsSection(contacts)
  }

  async filterContacts(input) {
    let contacts = await this.getContacts()
    // contacts = contacts.slice()
    let regex = new RegExp(input)
    return contacts.filter(contact => {
      return regex.test(contact.full_name)
    })
  }

  // Form Events
  submitFormEvent(event) {
    if (event.target.id !== "form-submit-button") { return; }
    event.preventDefault()

    let form = document.querySelector('form')
    let json = this.convertJson(form)

    this.addContact(json)
  }

  convertJson(form) {
    let data = new FormData(form)
    let obj = {}
    data.forEach((value, key) => {
      obj[key] = value;
    })
    return JSON.stringify(obj)
  }

  cancelForm(event) {
    event.preventDefault()

    if (event.target.id !== "form-cancel-button") { return; }

    let form = document.querySelector('.form-container')
    let main = document.querySelector('.main-container')
    this.toggleVisible(form)
    this.toggleVisible(main)
  }

  addContactForm(event) {
    event.preventDefault()

    if (!event.target.classList.contains('add-contact-button')) { return; }

    let form = document.querySelector('.form-container')
    let main = document.querySelector('.main-container')
    this.toggleVisible(form);
    this.toggleVisible(main)
  }

  toggleVisible(element) {
    if (element.style.display === "none") {
      element.style.display = "";
    } else {
      element.style.display = "none";
    }
  }
}


document.addEventListener('DOMContentLoaded', () => {
  let contact_manager = new ContactManager();
})