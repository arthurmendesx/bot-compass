<script lang="ts">
    import logo from "../assets/Logo perfil Linkedin.png";

    export let isOnline = true;
</script>

<header class="chat-header glass-panel">
    <div class="profile-container">
        <div class="avatar">
            <!-- Placeholder for AI Image, using an icon for now or a generic URL -->
            <div class="avatar-placeholder">
                <img src={logo} alt="AI Logo" class="logo-img" />
            </div>
            {#if isOnline}
                <span class="status-indicator online"></span>
            {/if}
        </div>
        <div class="info">
            <h2 class="name">AI Compass</h2>
            <span class="status-text">{isOnline ? "Online" : "Offline"}</span>
        </div>
    </div>

    <div class="actions">
        <!-- Add any header actions here if needed -->
    </div>
</header>

<style>
    .chat-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--spacing-md) var(--spacing-lg);
        border-bottom: 1px solid var(--border-color);
        height: 70px;
        flex-shrink: 0;
        z-index: 10;
    }

    .profile-container {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
    }

    .avatar {
        position: relative;
        width: 40px;
        height: 40px;
    }

    .avatar-placeholder {
        width: 100%;
        height: 100%;
        border-radius: var(--radius-full);
        background: linear-gradient(
            135deg,
            var(--compass-blue),
            var(--compass-grey-blue)
        );
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: var(--shadow-glow);
        overflow: hidden;
    }

    .logo-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .status-indicator {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: 2px solid var(--background-card);
    }

    .status-indicator.online {
        background-color: var(--success-color);
    }

    .info {
        display: flex;
        flex-direction: column;
    }

    .name {
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-main);
    }

    .status-text {
        font-size: 0.75rem;
        color: var(--text-muted);
    }
</style>
