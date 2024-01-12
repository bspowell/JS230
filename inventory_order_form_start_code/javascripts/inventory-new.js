
let inventory = {
  lastId: 0,
  collection: [],
  setDate: function() {
    var date = new Date();
    document.querySelector('#order_date').textContent = date.toUTCString();
  },
  cacheTemplate: function() {
    var iTmpl = document.getElementById('inventory_item')
    if (iTmpl) {
      this.template = iTmpl.innerHTML;
      iTmpl.parentNode.removeChild(iTmpl);
    }
  },
  add: function() {
    this.lastId++;
    var item = {
      id: this.lastId,
      name: "",
      stock_number: "",
      quantity: 1
    };
    this.collection.push(item);

    return item;
  },
  remove: function(idx) {
    this.collection = this.collection.filter(function(item) {
      return item.id !== idx;
    });
  },
  get: function(id) {
    var found_item;

    this.collection.forEach(function(item) {
      if (item.id === id) {
        found_item = item;
        return false;
      }
    });

    return found_item;
  },
  update: function(item) {
    var id = this.findID(item),
        itemUpdate = this.get(id);

    itemUpdate.name = item.querySelector("[name^=item_name]").value;
    itemUpdate.stock_number = item.querySelector("[name^=item_stock_number]").value;
    itemUpdate.quantity = item.querySelector("[name^=item_quantity]").value;
  },
  newItem: function(e) {
    e.preventDefault();
    var item = this.add()
    var item2 = document.createElement('tr')
    item2.innerHTML = this.template.replace(/ID/g, item.id);

    document.getElementById("inventory").appendChild(item2);
  },
  findParent: function(e) {
    return e.target.closest('tr');
    // return $(e.target).closest("tr");
  },
  findID: function(item) {
    return +item.querySelector("input[type=hidden]").value;
  },
  deleteItem: function(e) {
    e.preventDefault();
    var item = this.findParent(e).remove();

    this.remove(this.findID(item));
  },
  updateItem: function(e) {
    var item = this.findParent(e);

    this.update(item);
  },
  bindEvents: function() {
    let addItem = document.getElementById('add_item')
    addItem.addEventListener('click', this.newItem.bind(this));
    
    let inventory = document.querySelector('#inventory')
    inventory.addEventListener("click", function (event) {
        if (event.target.matches("a.delete")) {
          this.deleteItem(event);
      }
    }.bind(this));

    inventory.addEventListener("blur", function (event) {
        if (event.target.matches(":input")) {
          this.updateItem.call(this, event);
      }
    }.bind(this));
  },
  init: function() {
    this.setDate();
    this.cacheTemplate();
    this.bindEvents();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  inventory.init()    
})