class MmnStage extends HTMLElement {
    connectedCallback() {
        this.innerHTML = /*HTML*/`
            <h1 class="heading-lg">Do more with less</h1>
        `

        this.injectStyles();
    }

    injectStyles() {
        const styleId = 'mmn-stage-styles';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = /*CSS*/`
            mmn-stage {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: var(--size-xl);
                text-align: center;
                z-index: -10;
            }

            mmn-stage > h1 {
                margin-block-end: var(--size-2xl);
            }
        `

        document.head.appendChild(style);
    }
}

customElements.define('mmn-stage', MmnStage);