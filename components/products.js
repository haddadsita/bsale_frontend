class Products extends HTMLElement {
    constructor() {
      super();
      this.items = [];
      this.itemsProduct = '';
    }

    get category() {
      return this.getAttribute('category');
    }

    get search() {
      return this.getAttribute('search');
    }

    set category(value) {
      this.setAttribute('category', value);
    }

    set search(value) {
      this.setAttribute('search', value);
    }

    static get observedAttributes() { 
      return ['category', 'search'];
    }

    attributeChangedCallback(prop, oldValue, newValue) {
      if (prop === 'category') {
        this.getProductsData();
      }
      if (prop === 'search' && newValue !== '') {
        this.getProductsByNameData();
        this.category = 0;
      }
    }

    buildUrlAPI(value, search = false) {

      let url = `${window.API_URL_BASE}products/`;
      if (!search) {
        if (value !== 0) {
          url += `category/${value}`;
        }
      } else {
        url += `search/?q=${value}`;
      }

      return url;
    }

    getProductsData() {
      return new Promise((res, rej) => {
          fetch(this.buildUrlAPI(parseInt(this.category)))
              .then(data => data.json())
              .then((json) => {
                  this.render(this.productsHTML(json.data));
                  localStorage.setItem('products', JSON.stringify(json.data));
                  res();
              })
              .catch((error) => {
                  this.render(this.productsHTML(this.items));
                  rej(error)
              });
      })
    }

    getProductsByNameData() {
      return new Promise((res, rej) => {
          fetch(this.buildUrlAPI(this.search, true))
              .then(data => data.json())
              .then((json) => {
                  this.render(this.productsHTML(json.data));
                  localStorage.setItem('products', JSON.stringify(json.data));
                  res();
              })
              .catch((error) => {
                  this.render(this.productsHTML(this.items));
                  rej(error)
              });
      })
    }

    productsHTML(data) {
        this.itemsProduct = '';
        if (this.search !== '') {
          data = data.filter(item => item.name.toLowerCase().includes(this.search.toLowerCase()))
        }
        for (const item of data) {
            let image = item.url_image ? item.url_image : 'no-image.jpeg';
            this.itemsProduct += `
                <div class="col s3">
                    <div class="card">
                        <div class="card-image">
                            <img src="${image}">
                        </div>
                        <div class="card-content">
                            <span class="card-title" style="color:black;">${item.name}</span>
                        </div>
                        <div class="card-action right-align">
                            <span class="left">${item.price}</span>
                            <div class="right-align">
                              <button id="${item.id}" class="btn-floating btn-small waves-effect waves-light grey">
                                <i class="small material-icons add-item" id="${item.id}">add_shopping_cart</i>
                              </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        return this.itemsProduct;
    }
    
    render(data) {
      this.innerHTML = data;
    }
  }
  
  customElements.define("v-products", Products);