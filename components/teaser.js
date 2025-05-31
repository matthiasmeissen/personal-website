// Teaser
// Takes its styles from .teaser class

class SiteTeaser extends HTMLElement {
    constructor() {
        super();
        this.render();
    }

    static get observedAttributes() {
        return ['title', 'url'];
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

    render() {
        this.innerHTML = `
                    <a class="teaser-container" href="${this.url}">
                        <div class="teaser-image"></div>
                        <h2 class="teaser-title">${this.title}</h2>
                    </a>
                `;
    }
}

customElements.define('site-teaser', SiteTeaser);