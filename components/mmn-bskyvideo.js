
function supportsNativeHls(video) {
    return !!video.canPlayType('application/vnd.apple.mpegurl');
}

async function attachHlsJs(video, src) {
    const { default: Hls } = await import('https://cdn.jsdelivr.net/npm/hls.js@1/+esm');
    const hls = new Hls();
    hls.loadSource(src);
    hls.attachMedia(video);
}

class MmnBskyVideo extends HTMLElement {
    connectedCallback() {
        const playlist = this.getAttribute('playlist') || '';
        const thumbnail = this.getAttribute('thumbnail') || '';
        const text = this.getAttribute('text') || '';
        const permalink = this.getAttribute('permalink') || '#';

        const figure = document.createElement('figure');

        const video = document.createElement('video');
        video.preload = 'none';
        video.playsInline = true;
        video.loop = true;
        if (thumbnail) video.poster = thumbnail;

        const figcaption = document.createElement('figcaption');

        const caption = document.createElement('p');
        caption.className = 'mmn-bskyvideo-caption';
        caption.textContent = text;

        const link = document.createElement('a');
        link.className = 'mmn-bskyvideo-link';
        link.href = permalink;
        link.target = '_blank';
        link.rel = 'noopener';
        link.textContent = 'View on Bluesky';

        figcaption.appendChild(caption);
        figcaption.appendChild(link);
        figure.appendChild(video);
        figure.appendChild(figcaption);

        this.replaceChildren(figure);

        const hasHover = window.matchMedia('(hover: hover)').matches;

        let sourceReady = false;
        const ensureSource = async () => {
            if (sourceReady || !playlist) return;
            sourceReady = true;
            if (supportsNativeHls(video)) {
                video.src = playlist;
            } else {
                await attachHlsJs(video, playlist);
            }
        };

        let hovered = false;
        const updateControls = () => {
            video.controls = !hasHover || hovered || !video.paused;
        };
        updateControls();

        const observer = new IntersectionObserver((entries, obs) => {
            if (entries.some((e) => e.isIntersecting)) {
                obs.disconnect();
                ensureSource();
            }
        }, { rootMargin: '200px' });
        observer.observe(video);

        if (hasHover) {
            this.addEventListener('pointerenter', (e) => {
                if (e.pointerType !== 'mouse') return;
                hovered = true;
                updateControls();
            });
            this.addEventListener('pointerleave', (e) => {
                if (e.pointerType !== 'mouse') return;
                hovered = false;
                updateControls();
            });
        }
        video.addEventListener('play', updateControls);
        video.addEventListener('pause', updateControls);

        this.injectStyles();
    }

    injectStyles() {
        const styleId = 'mmn-bskyvideo-styles';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = /*CSS*/`
            mmn-bskyvideo {
                display: block;
            }

            mmn-bskyvideo figure {
                display: flex;
                flex-direction: column;
                gap: var(--size-sm);
            }

            mmn-bskyvideo video {
                width: 100%;
                aspect-ratio: 3 / 4;
                background: var(--color-background-subtle);
                border-radius: 12px;
                display: block;
                object-fit: cover;
            }

            mmn-bskyvideo figcaption {
                display: flex;
                flex-direction: column;
                gap: var(--size-xs);
            }

            mmn-bskyvideo .mmn-bskyvideo-caption {
                display: none;
                font-size: var(--size-sm);
                color: var(--color-foreground-primary);
            }

            mmn-bskyvideo .mmn-bskyvideo-link {
                font-size: var(--size-xs);
                color: var(--color-foreground-subtle);
            }
        `

        document.head.appendChild(style);
    }
}

customElements.define('mmn-bskyvideo', MmnBskyVideo);
