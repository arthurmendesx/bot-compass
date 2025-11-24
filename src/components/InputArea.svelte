<script lang="ts">
    import { Send } from "lucide-svelte";
    import { createEventDispatcher } from "svelte";

    export let disabled = false;

    const dispatch = createEventDispatcher();
    let text = "";
    let textarea: HTMLTextAreaElement;

    function handleInput() {
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
        }
    }

    function handleSubmit() {
        if (!text.trim() || disabled) return;
        dispatch("send", text.trim());
        text = "";
        if (textarea) {
            textarea.style.height = "auto";
            textarea.focus();
        }
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    }
</script>

<div class="input-area glass-panel">
    <textarea
        bind:this={textarea}
        bind:value={text}
        on:input={handleInput}
        on:keydown={handleKeydown}
        placeholder="Type a message..."
        rows="1"
        {disabled}
    ></textarea>

    <button
        class="send-btn"
        on:click={handleSubmit}
        disabled={!text.trim() || disabled}
        aria-label="Send message"
    >
        <Send size={20} />
    </button>
</div>

<style>
    .input-area {
        display: flex;
        align-items: flex-end;
        gap: var(--spacing-sm);
        padding: var(--spacing-md);
        border-top: 1px solid var(--border-color);
        background: var(--compass-navy);
    }

    textarea {
        flex: 1;
        background: rgba(15, 23, 42, 0.5);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-lg);
        padding: var(--spacing-sm) var(--spacing-md);
        color: var(--text-main);
        font-family: inherit;
        font-size: 0.95rem;
        resize: none;
        outline: none;
        transition:
            border-color 0.2s,
            box-shadow 0.2s;
        max-height: 120px;
        overflow-y: auto;
    }

    textarea:focus {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
    }

    textarea:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .send-btn {
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: var(--radius-md);
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition:
            background-color 0.2s,
            transform 0.1s;
        flex-shrink: 0;
    }

    .send-btn:hover:not(:disabled) {
        background: var(--primary-hover);
    }

    .send-btn:active:not(:disabled) {
        transform: scale(0.95);
    }

    .send-btn:disabled {
        background: var(--border-color);
        color: var(--text-muted);
        cursor: not-allowed;
    }
</style>
