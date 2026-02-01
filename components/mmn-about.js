class MmnAbout extends HTMLElement {
    connectedCallback() {
        this.innerHTML = /*HTML*/`
            <h2>About</h2>
            <p>Self-taught multidisciplinary artisan. I build tools from first principles and believe in doing more with less.</p>
            <p>My work spans custom electronics, native software, and creative code — audiovisual research at the intersection of art, design, and computation. Currently focused on embedded development and software craftsmanship.</p>
        `

        this.injectStyles();
    }

    injectStyles() {
        const styleId = 'mmn-about-styles';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = /*CSS*/`
            mmn-about {
                display: flex;
                flex-direction: column;
                gap: var(--size-md);
            }
        `

        document.head.appendChild(style);
    }
}

customElements.define('mmn-about', MmnAbout);
