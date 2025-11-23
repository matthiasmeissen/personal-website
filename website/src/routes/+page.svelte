<script>
    import { getAllProjects } from '$lib/data/data.js';
    import Teaser from "$lib/components/Teaser.svelte";

    const allProjects = getAllProjects();
</script>

<svelte:head>
	<title>MMN.EARTH</title>
</svelte:head>

<main>
    <section class="block">
        <h1>MMN Earth</h1>
        <p>Design Engineering</p>
    </section>

    <section class="block grid">
        {#each allProjects as project}
            <Teaser title={project.title} details={project.details} target="/work/{project.slug}" />
	    {/each}
    </section>

</main>

<style>

</style>