
class MmnIntro extends HTMLElement {
    connectedCallback() {
        this.innerHTML = /*HTML*/`
            <h1>Do more with less</h1>
            <mmn-glyphnavigation></mmn-glyphnavigation>
            <div class="subline">Design Engineering by matthiasmeissen</div>
        `

        this.injectStyles();
    }

    injectStyles() {
        const styleId = 'mmn-intro-styles';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = /*CSS*/`
            mmn-intro {
                width: 100vw;
                height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: var(--size-md);
            }

            mmn-intro > mmn-glyphnavigation {
                position: initial;
                transform: unset;
                max-width: 820px;
            }

            mmn-intro > h1 {
                font-size: var(--size-xl);
            }

            mmn-intro > .subline {
                font-size: var(--size-md);
            }
        `

        document.head.appendChild(style);
    }
}

customElements.define('mmn-intro', MmnIntro);