class MmnWindow extends HTMLElement {
    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = /*HTML*/`
            <style>${this.getStyles()}</style>
            <div class="icon close"></div>
            <div class="content"><slot></slot></div>
            <div class="icon enlarge"></div>
        `

        this.setupInteractivity();
    }

    setupInteractivity() {
        const closeBtn = this.shadowRoot.querySelector('.close');
        const enlargeBtn = this.shadowRoot.querySelector('.enlarge');
        const content = this.shadowRoot.querySelector('.content');

        // Close button
        closeBtn.addEventListener('click', () => {
            this.style.display = 'none';
        });

        // Drag to move
        let isDragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;

        const onMouseDown = (e) => {
            // Only drag from window frame, not content or resize handle
            if (e.target === content || content.contains(e.target) || e.target === enlargeBtn) {
                return;
            }

            isDragging = true;
            const rect = this.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left;
            dragOffsetY = e.clientY - rect.top;

            document.body.style.userSelect = 'none';
        };

        const onMouseMove = (e) => {
            if (!isDragging) return;

            let newX = e.clientX - dragOffsetX;
            let newY = e.clientY - dragOffsetY;

            // Constrain to viewport
            const rect = this.getBoundingClientRect();
            const maxX = window.innerWidth - rect.width;
            const maxY = window.innerHeight - rect.height;

            newX = Math.max(0, Math.min(newX, maxX));
            newY = Math.max(0, Math.min(newY, maxY));

            this.style.left = newX + 'px';
            this.style.top = newY + 'px';
        };

        const onMouseUp = () => {
            isDragging = false;
            document.body.style.userSelect = '';
        };

        this.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        // Resize
        let isResizing = false;
        let startWidth = 0;
        let startHeight = 0;
        let startX = 0;
        let startY = 0;

        const MIN_WIDTH = 150;
        const MIN_HEIGHT = 100;

        enlargeBtn.addEventListener('mousedown', (e) => {
            isResizing = true;
            startWidth = this.offsetWidth;
            startHeight = this.offsetHeight;
            startX = e.clientX;
            startY = e.clientY;

            document.body.style.userSelect = 'none';
            e.stopPropagation();
        });

        const onResizeMove = (e) => {
            if (!isResizing) return;

            let newWidth = startWidth + (e.clientX - startX);
            let newHeight = startHeight + (e.clientY - startY);

            // Constrain to min/max
            const rect = this.getBoundingClientRect();
            const maxWidth = window.innerWidth - rect.left;
            const maxHeight = window.innerHeight - rect.top;

            newWidth = Math.max(MIN_WIDTH, Math.min(newWidth, maxWidth));
            newHeight = Math.max(MIN_HEIGHT, Math.min(newHeight, maxHeight));

            this.style.width = newWidth + 'px';
            this.style.height = newHeight + 'px';
        };

        const onResizeUp = () => {
            isResizing = false;
            document.body.style.userSelect = '';
        };

        document.addEventListener('mousemove', onResizeMove);
        document.addEventListener('mouseup', onResizeUp);
    }

    getStyles() {
        return /*CSS*/`
            * {
                box-sizing: border-box;
            }
            :host {
                display: block;
                position: absolute;
                width: 300px;
                height: 200px;
                background: var(--color-background-subtle);
                border: 1px solid var(--color-foreground-muted);
                border-top-left-radius: var(--size-2xl);
                border-bottom-right-radius: var(--size-2xl);
                padding: var(--size-lg);
                cursor: move;
            }

            .content {
                cursor: default;
                height: 100%;
                overflow: auto;
            }

            .icon {
                position: absolute;
                width: var(--size-sm);
                height: var(--size-sm);
                border-radius: 50%;
                background: var(--color-background-subtle);
                border: 1px solid var(--color-foreground-muted);
            }

            .icon:hover {
                background: var(--color-foreground-primary);
                border: 1px solid transparent;
                cursor: pointer;
            }

            .close {
                top: 0;
                left: 0;
            }

            .enlarge {
                bottom: 0;
                right: 0;
                cursor: nwse-resize;
            }

            .enlarge:hover {
                cursor: nwse-resize;
            }
        `
    }
}

customElements.define('mmn-window', MmnWindow);