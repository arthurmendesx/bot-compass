<script lang="ts">
  import { onMount, tick } from "svelte";
  import { fade, fly, slide } from "svelte/transition";
  import { v4 as uuidv4 } from "uuid";
  import ChatLayout from "./components/ChatLayout.svelte";
  import Header from "./components/Header.svelte";
  import MessageBubble from "./components/MessageBubble.svelte";
  import InputArea from "./components/InputArea.svelte";
  import Login from "./components/Login.svelte";
  import { chatStore } from "./stores/chatStore";
  import { sendMessageToBot } from "./services/api";
  import type { Message } from "./types";

  let chatContainer: HTMLElement;

  // Subscribe to store
  $: messages = $chatStore.messages;
  $: currentUser = $chatStore.currentUser;
  $: isLoading = $chatStore.isLoading;
  $: sessionId = $chatStore.sessionId;

  async function scrollToBottom() {
    await tick();
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

  // Scroll on new messages
  $: if (messages.length) {
    scrollToBottom();
  }

  function handleLogin(event: CustomEvent) {
    chatStore.setUser({
      id: uuidv4(),
      name: event.detail.name,
    });
  }

  async function handleSend(event: CustomEvent) {
    const text = event.detail;
    if (!text) return;

    // Add user message
    const userMsg: Message = {
      id: uuidv4(),
      text,
      sender: "user",
      timestamp: Date.now(),
    };
    chatStore.addMessage(userMsg);
    chatStore.setLoading(true);

    try {
      // Send to API
      const responseText = await sendMessageToBot(text, sessionId);

      // Add AI response
      const aiMsg: Message = {
        id: uuidv4(),
        text: responseText,
        sender: "ai",
        timestamp: Date.now(),
      };
      chatStore.addMessage(aiMsg);
    } catch (error) {
      // Handle error (maybe add a system message or toast)
      const errorMsg: Message = {
        id: uuidv4(),
        text: "*Error: Could not connect to the AI agent. Please try again.*",
        sender: "ai",
        timestamp: Date.now(),
      };
      chatStore.addMessage(errorMsg);
    } finally {
      chatStore.setLoading(false);
    }
  }

  onMount(() => {
    scrollToBottom();
  });
</script>

<ChatLayout>
  {#if !currentUser}
    <div
      in:fade={{ duration: 300 }}
      out:fade={{ duration: 200 }}
      style="width: 100%; height: 100%;"
    >
      <Login on:login={handleLogin} />
    </div>
  {:else}
    <div in:fly={{ y: -20, duration: 500, delay: 200 }}>
      <Header isOnline={!isLoading} />
    </div>

    <div class="chat-messages" bind:this={chatContainer}>
      {#if messages.length === 0}
        <div class="empty-state" in:fade={{ duration: 500, delay: 400 }}>
          <p>O que você gostaria de saber?</p>
        </div>
      {/if}

      {#each messages as msg (msg.id)}
        <div in:fly={{ y: 20, duration: 300 }}>
          <MessageBubble message={msg} />
        </div>
      {/each}

      {#if isLoading}
        <div
          class="typing-indicator"
          in:slide={{ duration: 200 }}
          out:slide={{ duration: 200 }}
        >
          <span></span><span></span><span></span>
        </div>
      {/if}
    </div>

    <div in:fly={{ y: 20, duration: 500, delay: 200 }}>
      <InputArea on:send={handleSend} disabled={isLoading} />
    </div>
  {/if}
</ChatLayout>

<style>
  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-md);
    display: flex;
    flex-direction: column;
    scroll-behavior: smooth;
  }

  .empty-state {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    font-style: italic;
  }

  .typing-indicator {
    display: flex;
    gap: 4px;
    padding: var(--spacing-md);
    margin-left: var(--spacing-md);
  }

  .typing-indicator span {
    width: 8px;
    height: 8px;
    background: var(--text-muted);
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out both;
    opacity: 0.6;
  }

  .typing-indicator span:nth-child(1) {
    animation-delay: -0.32s;
  }
  .typing-indicator span:nth-child(2) {
    animation-delay: -0.16s;
  }

  @keyframes bounce {
    0%,
    80%,
    100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
</style>
