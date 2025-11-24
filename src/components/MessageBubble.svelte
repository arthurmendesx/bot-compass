<script lang="ts">
    import { marked } from "marked";
    import { User } from "lucide-svelte";
    import logo from "../assets/Logo perfil Linkedin.png";
    import type { Message } from "../types";

    export let message: Message;

    // Configure marked to be secure (sanitize is deprecated in newer versions, but we trust the bot output for now or use DOMPurify if needed later)
    // For this task, basic parsing is sufficient.

    $: parsedContent = marked.parse(message.text);
    $: isAi = message.sender === "ai";
</script>

<div class="message-wrapper {isAi ? 'ai' : 'user'}">
    <div class="avatar {isAi ? 'ai-avatar' : 'user-avatar'}">
        {#if isAi}
            <img src={logo} alt="AI Logo" class="logo-img" />
        {:else}
            <User size={16} color="#fff" />
        {/if}
    </div>

    <div class="bubble glass-panel">
        <div class="content markdown-body">
            {@html parsedContent}
        </div>
        <span class="timestamp">
            {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            })}
        </span>
    </div>
</div>

<style>
    .message-wrapper {
        display: flex;
        align-items: flex-end;
        gap: var(--spacing-sm);
        margin-bottom: var(--spacing-md);
        max-width: 85%;
    }

    .message-wrapper.user {
        margin-left: auto;
        flex-direction: row-reverse;
    }

    .message-wrapper.ai {
        margin-right: auto;
        flex-direction: row;
    }

    .avatar {
        width: 32px;
        height: 32px;
        border-radius: var(--radius-full);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        overflow: hidden; /* Ensure image stays within circle */
    }

    .logo-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .ai-avatar {
        background: linear-gradient(
            135deg,
            var(--compass-blue),
            var(--compass-grey-blue)
        );
        box-shadow: var(--shadow-glow);
    }

    .user-avatar {
        background: var(--border-color);
    }

    .bubble {
        padding: var(--spacing-md);
        border-radius: var(--radius-lg);
        position: relative;
        color: var(--text-main);
        word-wrap: break-word;
        overflow-wrap: break-word;
    }

    .ai .bubble {
        border-bottom-left-radius: var(--spacing-xs);
        background: rgba(30, 41, 59, 0.8);
    }

    .user .bubble {
        border-bottom-right-radius: var(--spacing-xs);
        background: linear-gradient(
            135deg,
            var(--compass-blue),
            var(--compass-navy)
        );
        border: 1px solid var(--compass-blue);
        color: var(--compass-white);
    }

    .timestamp {
        display: block;
        font-size: 0.65rem;
        margin-top: var(--spacing-xs);
        opacity: 0.7;
        text-align: right;
    }

    /* Markdown Styles within the bubble */
    :global(.markdown-body p) {
        margin-bottom: 0.5em;
    }

    :global(.markdown-body p:last-child) {
        margin-bottom: 0;
    }

    :global(.markdown-body strong) {
        font-weight: 700;
        color: #fff;
    }

    :global(.markdown-body a) {
        color: #fff;
        text-decoration: underline;
    }
</style>
