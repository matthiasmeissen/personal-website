<script>
    let { 
		title = 'Course Title',
		details = 'Course description',
        target = "/"
	} = $props();
</script>

<a class="container" href={target}>
    <div class="image"></div>
    <div class="text">
        <h3>{title}</h3>
        <p>{details}</p>
    </div>
</a>

<style>
    .container {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
    }

    a {
        text-decoration: none;
        color: var(--color-foreground-primary);
    }

    .image {
        width: 100%;
        aspect-ratio: 5/3;
        background-color: var(--color-background-subtle);
    }

    .text {
        display: flex;
        gap: var(--spacing-sm);
    }

    h3 {
        width: 100%;
    }

    p {
        color: var(--color-foreground-subtle);
    }
</style>