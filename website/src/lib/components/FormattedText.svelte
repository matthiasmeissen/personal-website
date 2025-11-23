<script>
	import { marked } from 'marked';

	let { 
		content, 
		class: className = ''
	} = $props();

	const renderer = new marked.Renderer();
	renderer.image = function(details) {
		return `<img src="/images/${details.href}" alt="${details.text}" loading="lazy" />`;
	};

	marked.use({ renderer });

	const htmlContent = $derived(
		content ? marked.parse(content) : ''
	);
</script>

<div class="formatted-text {className}">
	{@html htmlContent}
</div>

<style>
	.formatted-text :global(h1) {
		font-size: var(--font-size-xl);
		font-weight: 700;
	}

	.formatted-text :global(h2) {
		font-size: var(--font-size-lg);
		font-weight: 700;
		margin: 2em 0 0 0;
	}

	.formatted-text :global(h3) {
		font-size: var(--font-size-md);
		font-weight: 700;
		margin: 2em 0 0 0;
	}

	.formatted-text :global(p) {
		font-size: var(--font-size-sm);
		line-height: 1.6;
		margin: 1.5em 0 0 0;
		color: var(--color-text);
	}

	.formatted-text :global(strong) {
		font-weight: 700;
		display: block;
	}

	.formatted-text :global(em) {
		font-style: italic;
	}

	.formatted-text :global(ul),
	.formatted-text :global(ol) {
		margin: 1rem 0;
		padding-left: 1.5rem;
	}

	.formatted-text :global(li) {
		margin: 0.5rem 0;
		line-height: 1.6;
	}

	.formatted-text :global(code) {
		background: var(--color-background-subtle);
		padding: 0.125rem 0.375rem;
		border-radius: 4px;
		font-family: 'Monaco', 'Courier New', monospace;
		font-size: 0.9em;
	}

	.formatted-text :global(pre) {
		background: var(--color-background-subtle);
		padding: 1rem;
		border-radius: 8px;
		overflow-x: auto;
		margin: 1rem 0;
	}

	.formatted-text :global(pre code) {
		background: none;
		padding: 0;
	}

	.formatted-text :global(blockquote) {
		border-left: 4px solid var(--color-border-primary);
		padding-left: 1rem;
		margin: 1rem 0;
		font-style: italic;
	}

	.formatted-text :global(a) {
		text-decoration: underline;
	}

	.formatted-text :global(a:hover) {
		text-decoration: none;
	}

	.formatted-text :global(hr) {
		border: none;
		border-top: 2px solid var(--color-border-primary);
		margin: 2rem 0;
	}
</style>