
function postUrlFromUri(uri) {
    const match = uri.match(/^at:\/\/([^/]+)\/app\.bsky\.feed\.post\/([^/]+)$/);
    if (!match) return '#';
    const [, did, rkey] = match;
    return `https://bsky.app/profile/${did}/post/${rkey}`;
}

function parseTagList(value) {
    if (!value) return [];
    return value
        .split(/[,\s]+/)
        .map((t) => t.replace(/^#/, '').trim().toLowerCase())
        .filter(Boolean);
}

async function fetchByAuthorFeed(handle, limit) {
    const url = new URL('https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed');
    url.searchParams.set('actor', handle);
    url.searchParams.set('filter', 'posts_with_video');
    url.searchParams.set('limit', limit);

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { feed } = await res.json();
    return (feed || []).map((item) => item.post);
}

async function fetchBySearch(handle, tag, limit) {
    const url = new URL('https://api.bsky.app/xrpc/app.bsky.feed.searchPosts');
    url.searchParams.set('q', `#${tag} from:${handle}`);
    url.searchParams.set('limit', limit);

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { posts } = await res.json();
    return posts || [];
}

class MmnBskyFeed extends HTMLElement {
    connectedCallback() {
        this.injectStyles();
        this.setupPlayOneAtATime();

        this.availableTags = parseTagList(this.getAttribute('tags'));
        const initialTag = (this.getAttribute('tag') || '').replace(/^#/, '').toLowerCase();
        this.activeTag = initialTag || null;

        this.tagBar = this.availableTags.length ? this.renderTagBar() : null;
        this.content = document.createElement('div');
        this.content.className = 'mmn-bskyfeed-content';

        const children = [];
        if (this.tagBar) children.push(this.tagBar);
        children.push(this.content);
        this.replaceChildren(...children);

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

    renderTagBar() {
        const nav = document.createElement('nav');
        nav.className = 'mmn-bskyfeed-tags';

        const makeButton = (label, value) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'mmn-bskyfeed-tag';
            btn.textContent = label;
            btn.dataset.tag = value || '';
            if ((value || null) === this.activeTag) btn.setAttribute('aria-pressed', 'true');
            btn.addEventListener('click', () => this.selectTag(value || null));
            return btn;
        };

        nav.appendChild(makeButton('All', null));
        for (const tag of this.availableTags) {
            nav.appendChild(makeButton(`#${tag}`, tag));
        }
        return nav;
    }

    selectTag(tag) {
        if (this.activeTag === tag) return;
        this.activeTag = tag;

        if (this.tagBar) {
            this.tagBar.querySelectorAll('.mmn-bskyfeed-tag').forEach((btn) => {
                const value = btn.dataset.tag || null;
                if (value === this.activeTag) {
                    btn.setAttribute('aria-pressed', 'true');
                } else {
                    btn.removeAttribute('aria-pressed');
                }
            });
        }

        this.loadFeed();
    }

    async loadFeed() {
        const handle = this.getAttribute('handle');
        const limit = this.getAttribute('limit') || '25';
        const tag = this.activeTag;

        if (!handle) {
            this.showStatus('Missing handle.');
            return;
        }

        this.showStatus('Loading…');

        const requestId = ++this.requestSeq || (this.requestSeq = 1);

        try {
            const posts = tag
                ? await fetchBySearch(handle, tag, limit)
                : await fetchByAuthorFeed(handle, limit);

            if (requestId !== this.requestSeq) return;

            const videos = posts.filter((p) => p?.embed?.$type === 'app.bsky.embed.video#view');

            if (videos.length === 0) {
                this.showStatus(tag ? `No video posts tagged #${tag}.` : 'No video posts found.');
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

            this.content.replaceChildren(grid);
        } catch (err) {
            if (requestId !== this.requestSeq) return;
            console.error('mmn-bskyfeed:', err);
            this.showStatus("Couldn't load posts.");
        }
    }

    showStatus(message) {
        const status = document.createElement('div');
        status.className = 'mmn-bskyfeed-status';
        status.textContent = message;
        this.content.replaceChildren(status);
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

            mmn-bskyfeed .mmn-bskyfeed-tags {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: var(--size-xs);
                margin-bottom: var(--size-lg);
            }

            mmn-bskyfeed .mmn-bskyfeed-tag {
                font-family: inherit;
                font-size: var(--size-sm);
                color: var(--color-foreground-subtle);
                background: var(--color-background-subtle);
                border: none;
                border-radius: 999px;
                padding: calc(var(--size-xs) / 2) var(--size-sm);
                cursor: pointer;
                transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out;
            }

            mmn-bskyfeed .mmn-bskyfeed-tag:hover {
                color: var(--color-foreground-primary);
            }

            mmn-bskyfeed .mmn-bskyfeed-tag[aria-pressed="true"] {
                color: var(--color-background-primary);
                background: var(--color-foreground-primary);
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
