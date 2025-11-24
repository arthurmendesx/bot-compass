<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import { ArrowRight } from "lucide-svelte";

    const dispatch = createEventDispatcher();
    let name = "";
    let canvas: HTMLCanvasElement;

    // Animation configuration
    const PARTICLE_COUNT = 50;
    const CONNECTION_DISTANCE = 150;
    const COLORS = ["#5B8FDA", "#FB9F65", "#EF6D78", "#8CA8B9"]; // Compass palette

    function handleLogin() {
        if (name.trim()) {
            dispatch("login", { name: name.trim() });
        }
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Enter") {
            handleLogin();
        }
    }

    onMount(() => {
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        let particles: Particle[] = [];

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            color: string;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
                this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        function init() {
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);

            particles.forEach((p, index) => {
                p.update();
                p.draw();

                // Draw connections
                for (let j = index + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < CONNECTION_DISTANCE) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(140, 168, 185, ${1 - distance / CONNECTION_DISTANCE})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });

            requestAnimationFrame(animate);
        }

        function handleResize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            init();
        }

        window.addEventListener("resize", handleResize);
        handleResize();
        animate();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    });
</script>

<div class="login-container">
    <canvas bind:this={canvas} class="background-canvas"></canvas>
    <div class="login-card glass-panel">
        <h1 class="title">Bem-vindo(a)</h1>
        <p class="subtitle">
            Insira seu nome para iniciar a conversa com o Compass
        </p>

        <div class="input-group">
            <input
                type="text"
                bind:value={name}
                on:keydown={handleKeydown}
                placeholder="Seu nome"
                autofocus
            />
            <button on:click={handleLogin} disabled={!name.trim()}>
                <ArrowRight size={20} />
            </button>
        </div>
    </div>
</div>

<style>
    .login-container {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        background: var(--background-dark); /* Fallback/Base color */
        overflow: hidden;
    }

    .background-canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        opacity: 0.6; /* Subtle effect */
    }

    .login-card {
        padding: var(--spacing-xl);
        border-radius: var(--radius-lg);
        width: 90%;
        max-width: 400px;
        text-align: center;
        position: relative;
        z-index: 1; /* Ensure card is above canvas */
    }

    .title {
        font-size: 2rem;
        margin-bottom: var(--spacing-xs);
        background: linear-gradient(
            to right,
            var(--primary-color),
            var(--secondary-color)
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .subtitle {
        color: var(--text-muted);
        margin-bottom: var(--spacing-xl);
    }

    .input-group {
        display: flex;
        gap: var(--spacing-sm);
    }

    input {
        flex: 1;
        padding: var(--spacing-md);
        border-radius: var(--radius-md);
        border: 1px solid var(--border-color);
        background: rgba(15, 23, 42, 0.5);
        color: var(--text-main);
        outline: none;
        transition: border-color 0.2s;
    }

    input:focus {
        border-color: var(--primary-color);
    }

    button {
        padding: var(--spacing-md);
        border-radius: var(--radius-md);
        border: none;
        background: var(--primary-color);
        color: white;
        cursor: pointer;
        transition: background-color 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    button:hover:not(:disabled) {
        background: var(--primary-hover);
    }

    button:disabled {
        background: var(--border-color);
        cursor: not-allowed;
        opacity: 0.7;
    }
</style>
