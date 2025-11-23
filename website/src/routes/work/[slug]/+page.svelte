<script>
	import { page } from '$app/stores';
	import { getProject } from '$lib/data/data.js';
	import FormattedText from '$lib/components/FormattedText.svelte';
	
	const slug = $derived($page.params.slug);
	const project = $derived(getProject(slug));
</script>

<svelte:head>
	{#if project}
		<title>{project.title}</title>
	{/if}
</svelte:head>

{#if project}
    <main>
        <FormattedText content={project.markdown} />
    </main>
{:else}
    <main>
        <h1>Project not found</h1>
    </main>
{/if}

<style>

</style>