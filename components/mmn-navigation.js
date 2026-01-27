
class MmnNavigation extends HTMLElement {
    connectedCallback() {
        this.innerHTML = /*HTML*/`
            <div>Test</div>
        `
    }
}

customElements.define('mmn-navigation', MmnNavigation);
