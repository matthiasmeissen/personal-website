
class MmnNavigation extends HTMLElement {
    connectedCallback() {
        this.innerHTML = /*HTML*/`
            <nav>
                <a class="mmn-navigation-nav-item" href="#">Work</a>
                <a class="mmn-navigation-nav-item" href="#">Write</a>
                <a class="mmn-navigation-nav-item" href="#">About</a>
            </nav>
        `

        this.injectStyles();
    }

    injectStyles() {
        const styleId = 'mmn-navigation-styles';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = /*CSS*/`
            mmn-navigation {
                display: block;
            }

            mmn-navigation > nav {
                position: fixed;
                bottom: 32px;
                left: 50%;
                transform: translateX(-50%);
                padding: 10px 20px;
                display: flex;
                gap: var(--size-sm);
                background-color: #D8D8D8;
                border-radius: 40px;
                z-index: 10;
            }

            mmn-navigation .mmn-navigation-nav-item {
                color: #181818;
                font-family: var(--font-family-primary);
                font-size: var(--size-md);
            }
        `

        document.head.appendChild(style);
    }
}

customElements.define('mmn-navigation', MmnNavigation);
