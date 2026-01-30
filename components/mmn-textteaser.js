
class MMnTextTeaser extends HTMLElement {
    connectedCallback() {
        const title = this.getAttribute('title') || 'Title';
        const description = this.getAttribute('description') || 'Description';
        const year = this.getAttribute('year') || 'Year';
        const href = this.getAttribute('href') || '#';

        this.innerHTML = /*HTML*/`
            <a href="${href}">
                <div class="mmn-textteaser-title">${title}</div>
                <div class="mmn-textteaser-description">${description}</div>
                <div class="mmn-textteaser-year">${year}</div>
            </a>
        `

        this.injectStyles();
    }

    injectStyles() {
        const styleId = 'mmn-textteaser-styles';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = /*CSS*/`
            mmn-textteaser {
                display: block;
                max-width: 820px;
                padding-inline: var(--size-lg);
                margin: 0 auto;
            }

            mmn-textteaser > a {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: var(--size-md);
                padding: var(--size-sm) 0;
                margin: var(--size-sm) 0;
                color: var(--color-foreground-primary);
                background-color: var(--color-background-primary);
                border-radius: 12px;
                font-size: var(--size-md);
                text-decoration: none;
                overflow: hidden;
                transition: all 0.2s ease-in-out;
            }

            mmn-textteaser > a:hover {
                filter: invert(1);
                transform: scale(1.02);
                padding: var(--size-sm);
                text-decoration: none;
                cursor: pointer;
            }

            mmn-textteaser .mmn-textteaser-title {
                flex-grow: 1;
            }

            mmn-textteaser .mmn-textteaser-description {
                color: var(--color-foreground-subtle);
            }

            mmn-textteaser .mmn-textteaser-year {
                color: var(--color-foreground-subtle);
            }

            mmn-textteaser .mmn-textteaser-preview {
                position: absolute;
                right: 0;
                width: 40%;
                opacity: 10%;
            }

            @media (max-width: 480px) {
                mmn-textteaser > a {
                    padding: 12px 8px;
                }

                mmn-textteaser .mmn-textteaser-description {
                    display: none;
                }
            }
        `

        document.head.appendChild(style);
    }
}

customElements.define('mmn-textteaser', MMnTextTeaser);
