class MenuCategories extends HTMLElement {
    constructor() {
      super();
      this.categories = [];
    }

    get category() {
        return this.getAttribute('category');
    }

    static get observedAttributes() { 
        return ['category'];
    }

    attributeChangedCallback(prop, oldValue, newValue) {
        if (prop === 'category') {
            localStorage.setItem('category', newValue);
            this.getCategories();
        }
      }

    getCategories() {
        return new Promise((res, rej) => {
            fetch(`${window.API_URL_BASE}categories/`)
                .then(data => data.json())
                .then((json) => {
                    this.render(this.menuHTML(json.data));
                    res();
                })
                .catch((error) => {
                    this.render(this.menuHTML(this.categories));
                    rej(error)
                });
        })
    }

    getActiveCategory() {
        return parseInt(localStorage.getItem('category'));
    }

    isActive(categoryId) {
        return categoryId === this.getActiveCategory() ? 'active' : '';
    }

    menuHTML(categories) {
        let html = `
            <ul class="collection with-header">
                <li class="collection-header"><h4>Categorías</h4></li>
        `;
        for (const category of categories) {
            html += `
                <li
                    id="${category.id}"
                    class="collection-item select-category search_category ${this.isActive(category.id)}"
                >
                    ${category.name}
                </li>`;
        }
        html += `
            <li id="0" class="collection-item select-category search_category ${this.isActive(0)}">
                Todos
            </li>`;
        html += `</ul>`;

        return html;
    }

    render(data) {
      this.innerHTML = data;
    }
  }

  customElements.define("v-menu", MenuCategories);