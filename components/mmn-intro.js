
class MmnIntro extends HTMLElement {
    connectedCallback() {
        this.innerHTML = /*HTML*/`
            <h1 class="heading-lg">Design Engineering</h1>
	        <p>by matthiasmeissen</p>
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
                width: fit-content;
                display: flex;
                flex-direction: column;
                align-items: center;
                margin: 30vh auto 20vh;
                padding: 32px;
            }

            mmn-intro > p {
                width: 100%;
                font-size: var(--size-md);
                text-align: end;
                color: var(--color-foreground-subtle);
                padding-top: 8px;
            }

            @media (max-width: 420px) {
                mmn-intro {
                    margin: 25vh auto 10vh;
                }
                mmn-intro > h1 {
                    text-align: center;
                }
                mmn-intro > p {
                    text-align: center;
                }
            }
        `

        document.head.appendChild(style);
    }
}

customElements.define('mmn-intro', MmnIntro);
