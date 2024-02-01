
class ContactManager {
  constructor() {
    this.bindEvents()
    this.renderInitialContacts()
    Handlebars.registerPartial('contactPartial', document.querySelector('[data-type=partial]').innerHTML)
  }
  async getContacts() {
    try {
      const result = await fetch('/api/contacts')
      return await result.json()
    } catch (error) {
      console.error(error)
    }
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

  async getContact(id) {
    try {
      let result = await fetch(`/api/contacts/${id}`)
      if (result.ok) {
        console.log(`Success: ${result.statusText}`)
        return await result.json()
      }
    } catch(error) {
      console.error(`Error: ${error.statusText}`)
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
    let regex = new RegExp(input)
    return contacts.filter(contact => {
      return regex.test(contact.full_name)
    })
  }

  bindEvents() {
    document.addEventListener('click', this.submitFormEvent.bind(this))
    document.addEventListener('click', this.contactFormEvents.bind(this))
    document.addEventListener('keyup', this.collectInput.bind(this))
  }

  contactFormEvents(event) {
    this.addContactForm(event)
    this.cancelAddContactForm(event)
    this.editContactForm(event)
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


  // Form Events
  submitFormEvent(event) {
    if (event.target.id !== "form-submit-button") { return; }
    event.preventDefault()

    let form = document.querySelector('form')
    let json = this.convertJson(form)

    this.addContact(json)
    form.reset()
  }

  convertJson(form) {
    let data = new FormData(form)
    let obj = {}
    data.forEach((value, key) => {
      obj[key] = value;
    })
    return JSON.stringify(obj)
  }

  cancelAddContactForm(event) {
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
    this.toggleVisible(main);
  }

  async editContactForm(event) {
    event.preventDefault()
    if (!event.target.classList.contains('edit-button')) { return; }
    let contact_id = event.target.id;
    let contact_data = await this.getContact(contact_id)

    // if (contact_data.ok) {
      this.fillForm(contact_data)

      this.toggleVisible(document.querySelector('.main-container'))
      this.toggleVisible(document.querySelector('.form-container'))
    // }
  }

  async fillForm(contact) {
    let full_name = document.querySelector('form #full_name')
    let email = document.querySelector('form #email')
    let phone_number = document.querySelector('form #phone_number')
    let tags = document.querySelector('form #tags')

    full_name.value = contact.full_name
    email.value = contact.email
    phone_number.value = contact.phone_number
    tags.value = contact.tags
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