<script>

</script>

<div class="container">
    <div class="image"></div>
    <div class="text">
        <h3>Title</h3>
        <p>Details</p>
    </div>
</div>

<style>
    .container {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
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