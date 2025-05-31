class SiteTeaser extends HTMLElement {
    constructor() {
        super();
        this.render();
    }

    static get observedAttributes() {
        return ['title', 'url', 'image', 'alt'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    get title() {
        return this.getAttribute('title') || 'Default Title';
    }

    get url() {
        return this.getAttribute('url') || '#';
    }

    get image() {
        return this.getAttribute('image') || '';
    }

    get alt() {
        return this.getAttribute('alt') || this.title;
    }

    get imageStyle() {
        if (this.image) {
            return `background-image: url('${this.image}');`;
        }
        return '';
    }

    render() {
        this.innerHTML = `
            <a class="teaser-container" href="${this.url}" aria-label="${this.alt}">
                <div class="teaser-image" style="${this.imageStyle}" role="img" aria-label="${this.alt}"></div>
                <h2 class="teaser-title">${this.title}</h2>
            </a>
        `;
    }
}

customElements.define('site-teaser', SiteTeaser);