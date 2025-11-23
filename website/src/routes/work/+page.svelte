<script>
	import { getAllProjects } from '$lib/data/data.js';
    import Teaser from '$lib/components/Teaser.svelte';
	
	const allProjects = getAllProjects();
</script>

<svelte:head>
	<title>Work</title>
</svelte:head>

<main>
    <h1>Work</h1>

    {#each allProjects as project}
        <Teaser title={project.title} details={project.details} target="/work/{project.slug}" />
	{/each}
</main>
