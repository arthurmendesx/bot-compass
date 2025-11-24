<script lang="ts">
    // This component handles the 16:9 container logic
</script>

<div class="layout-container">
    <div class="aspect-ratio-box">
        <slot />
    </div>
</div>

<style>
    .layout-container {
        width: 100vw;
        height: 100vh;
        height: 100dvh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: radial-gradient(
            circle at center,
            #0a2339 0%,
            var(--compass-navy) 100%
        );
        padding: 0; /* Remove padding to fill screen */
    }

    .aspect-ratio-box {
        width: 100%;
        height: 100%;
        max-width: none; /* Remove max width */
        aspect-ratio: auto; /* Remove fixed aspect ratio */
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        border-radius: 0; /* Remove border radius for full screen */
        border: none;
    }

    /* Mobile Responsiveness - already handled by full screen above, but keeping for safety */
    @media (max-width: 768px) {
        .layout-container {
            padding: 0;
        }
    }
</style>
