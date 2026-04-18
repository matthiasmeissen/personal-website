
function postUrlFromUri(uri) {
    const match = uri.match(/^at:\/\/([^/]+)\/app\.bsky\.feed\.post\/([^/]+)$/);
    if (!match) return '#';
    const [, did, rkey] = match;
    return `https://bsky.app/profile/${did}/post/${rkey}`;
}

function postHasTag(post, tag) {
    const record = post?.record;
    if (!record) return false;

    const facets = record.facets || [];
    for (const facet of facets) {
        for (const feature of (facet.features || [])) {
            if (feature.$type === 'app.bsky.richtext.facet#tag' &&
                (feature.tag || '').toLowerCase() === tag) {
                return true;
            }
        }
    }

    const tags = record.tags || [];
    return tags.some((t) => (t || '').toLowerCase() === tag);
}

class MmnBskyFeed extends HTMLElement {
    connectedCallback() {
        const status = document.createElement('div');
        status.className = 'mmn-bskyfeed-status';
        status.textContent = 'Loading…';
        this.replaceChildren(status);

        this.injectStyles();
        this.setupPlayOneAtATime();
        this.loadFeed();
    }

    setupPlayOneAtATime() {
        this.addEventListener('play', (event) => {
            const current = event.target;
            if (!(current instanceof HTMLVideoElement)) return;
            this.querySelectorAll('video').forEach((v) => {
                if (v !== current && !v.paused) v.pause();
            });
        }, true);
    }

    async loadFeed() {
        const handle = this.getAttribute('handle');
        const limit = this.getAttribute('limit') || '12';
        const tag = (this.getAttribute('tag') || '').replace(/^#/, '').toLowerCase();

        if (!handle) {
            this.showError('Missing handle.');
            return;
        }

        try {
            const url = new URL('https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed');
            url.searchParams.set('actor', handle);
            url.searchParams.set('filter', 'posts_with_video');
            url.searchParams.set('limit', limit);

            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const { feed } = await res.json();

            let videos = (feed || [])
                .map((item) => item.post)
                .filter((post) => post?.embed?.$type === 'app.bsky.embed.video#view');

            if (tag) {
                videos = videos.filter((post) => postHasTag(post, tag));
            }

            if (videos.length === 0) {
                this.showError(tag ? `No video posts tagged #${tag}.` : 'No video posts found.');
                return;
            }

            const grid = document.createElement('div');
            grid.className = 'mmn-bskyfeed-grid';

            for (const post of videos) {
                const card = document.createElement('mmn-bskyvideo');
                card.setAttribute('playlist', post.embed.playlist || '');
                card.setAttribute('thumbnail', post.embed.thumbnail || '');
                card.setAttribute('text', post.record?.text || '');
                card.setAttribute('permalink', postUrlFromUri(post.uri || ''));
                grid.appendChild(card);
            }

            this.replaceChildren(grid);
        } catch (err) {
            console.error('mmn-bskyfeed:', err);
            this.showError("Couldn't load posts.");
        }
    }

    showError(message) {
        const status = document.createElement('div');
        status.className = 'mmn-bskyfeed-status';
        status.textContent = message;
        this.replaceChildren(status);
    }

    injectStyles() {
        const styleId = 'mmn-bskyfeed-styles';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = /*CSS*/`
            mmn-bskyfeed {
                display: block;
                max-width: var(--size-content-lg);
                margin: 0 auto;
                padding: var(--size-lg);
                padding-bottom: calc(var(--size-xl) * 3);
            }

            mmn-bskyfeed .mmn-bskyfeed-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: var(--size-lg);
            }

            mmn-bskyfeed .mmn-bskyfeed-status {
                color: var(--color-foreground-subtle);
                font-size: var(--size-md);
                padding: var(--size-lg);
            }
        `

        document.head.appendChild(style);
    }
}

customElements.define('mmn-bskyfeed', MmnBskyFeed);
