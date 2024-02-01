
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

  async addContact(jsonFormData) {
    try {
      let options = {
        method: "POST",
        body: jsonFormData,
        headers: { "Content-Type": "application/json"}
      }
      const result = await fetch('/api/contacts/', options)
      if (result.ok) {
        console.log(`Added new contact successfully!: ${result.statusText}`)
      }
    } catch (error) {
      console.error(`Error: ${error.statusText}`)
    }
  }

  async updateContact(jsonFormData, id) {
    try {
      let options = {
        method: "PUT",
        body: jsonFormData,
        headers: { "Content-Type": "application/json" }
      }
      const result = await fetch(`/api/contacts/${id}`, options)
      if (result.ok) {
        console.log(`Updated contact successfully! ${result.statusText}`)
      }
    } catch (error) {
      console.error(`Error: ${error.statusText}`)
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
        console.log(`Received contact successfully: ${result.statusText}`)
        return await result.json()
      }
    } catch(error) {
      console.error(`Error: ${error.statusText}`)
    }

  }

  async deleteContact(id) {
    try {
      let result = await fetch(`/api/contacts/${id}`, { method: "DELETE" })
      if (result.ok) {
        console.log(`Successfully deleted contact: ${result.statusText}`)
      }
    } catch(error) {
      console.error(`Error Deleting Contact: ${error.statusText}`)
    }
  }
  // form async
  async editContactForm(event) {
    event.preventDefault()
    if (!event.target.classList.contains('edit-button')) { return; }
    let contact_id = event.target.id;
    let contact_data = await this.getContact(contact_id)

    this.fillForm(contact_data)

    this.toggleVisible(document.querySelector('.main-container'))
    this.toggleVisible(document.querySelector('.form-container'))
  }

  async fillForm(contact) {
    let full_name = document.querySelector('form #full_name')
    let email = document.querySelector('form #email')
    let phone_number = document.querySelector('form #phone_number')
    let tags = document.querySelector('form #tags')
    let id = document.createElement('input')
    let form = document.querySelector('form')
    id.setAttribute('type', 'hidden')
    id.setAttribute('name', 'id')
    id.setAttribute('id', 'id')
    id.value = contact.id
    form.append(id)

    full_name.value = contact.full_name
    email.value = contact.email
    phone_number.value = contact.phone_number
    tags.value = contact.tags
  }

  // Search Query

  async findContactsFromSearch(event) {
    if (event.target.id !== 'search-bar') { return; }

    let input = document.querySelector('#search-bar').value
    let contacts;
    if (input) {
      contacts = await this.filterContacts(String(input))
      console.log(contacts)
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
    document.addEventListener('click', this.deleteContactEvent.bind(this))
    document.addEventListener('keyup', this.findContactsFromSearch.bind(this))
  }

  contactFormEvents(event) {
    this.addContactForm(event)
    this.cancelAddContactForm(event)
    this.editContactForm(event)
  }

  renderContactsSection(contacts) {
    let section = document.querySelector('.list-contacts-section')

    let contactTemplateSource = document.querySelector('#contacts').innerHTML
    let contactTemplate = Handlebars.compile(contactTemplateSource)

    if (contacts.length > 0) {
      section.textContent = '';
      section.innerHTML = contactTemplate({ contact: contacts })
    } else {
      section.textContent = '';
    }
  }

  deleteContactEvent(event) {
    if (!event.target.classList.contains('delete-button')) { return; }
    event.preventDefault();

    let result = window.confirm('Do you want to delete the contact?')

    if (result) {
      this.deleteContact(event.target.id)
      // this.renderInitialContacts()
    }
  }

  // Form Events
  submitFormEvent(event) {
    if (event.target.id !== "form-submit-button") { return; }
    event.preventDefault()
    let form = document.querySelector('form')
    let json = this.convertJson(form)
    let id = form.querySelector('#id') || null
    console.log(json)

    if(id) {
      this.updateContact(json, id.value)
    } else {
      this.addContact(json)
    }
    this.toggleVisible(document.querySelector('.form-container'))
    this.toggleVisible(document.querySelector('.main-container'))
    this.renderInitialContacts()

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

    let idElement = document.querySelector('form > #id')
    if (idElement) {
      idElement.remove()
    }

    let form = document.querySelector('form')
    
    form.reset()
    this.toggleVisible(document.querySelector('.form-container'))
    this.toggleVisible(document.querySelector('.main-container'))
  }

  addContactForm(event) {
    event.preventDefault()

    if (!event.target.classList.contains('add-contact-button')) { return; }

    this.toggleVisible(document.querySelector('.form-container'));
    this.toggleVisible(document.querySelector('.main-container'));
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