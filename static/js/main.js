// --- Fluid Smoke Effect ---
const canvas = document.getElementById('fluidCanvas');
const ctx = canvas.getContext('2d');
const cursorDot = document.getElementById('cursorDot');

let width, height;
let mouse = { x: 0, y: 0 };
let particles = [];

// Initialize Canvas
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Track Mouse & Spawn Particles
document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    if (cursorDot) {
        cursorDot.style.left = mouse.x + 'px';
        cursorDot.style.top = mouse.y + 'px';
    }

    // Spawn multiple particles per move for density
    for (let i = 0; i < 3; i++) {
        particles.push({
            x: mouse.x,
            y: mouse.y,
            vx: (Math.random() - 0.5) * 2, // Random drift X
            vy: (Math.random() - 0.5) * 2, // Random drift Y
            size: Math.random() * 20 + 10, // Base size
            life: 1, // 100% life
            // Strict Reference Colors: Pink, Purple, Blue, Cyan
            hue: Math.random() * 60 + 240 // range 240-300 (Blue to Purple/Pink)
        });
    }
});

function animate() {
    // Clear with very slight fade for "trails"
    ctx.fillStyle = 'rgba(5, 5, 8, 0.2)';
    ctx.fillRect(0, 0, width, height);

    // Additive blending makes overlapping particles glow white (key for "Fluid" look)
    ctx.globalCompositeOperation = 'lighter';

    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        ctx.beginPath();
        // Create soft gradient for each particle
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        gradient.addColorStop(0, `hsla(${p.hue}, 100%, 60%, ${p.life})`);
        gradient.addColorStop(1, `hsla(${p.hue}, 100%, 50%, 0)`);

        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Physics
        p.x += p.vx;
        p.y += p.vy;
        p.size *= 0.96; // Shrink
        p.life *= 0.95; // Fade
    }

    ctx.filter = 'none';
    ctx.globalCompositeOperation = 'source-over';

    // Cleanup
    particles = particles.filter(p => p.life > 0.01);

    requestAnimationFrame(animate);
}
animate();

// --- Chip Functionality ---
function setPrompt(text) {
    const input = document.getElementById('promptInput');
    input.value = text;
    input.focus();
}

// --- Main Processing Logic ---
async function processPrompt() {
    const input = document.getElementById('promptInput').value;
    const outputDiv = document.getElementById('outputText');
    const container = document.getElementById('resultContainer');
    const initBtn = document.querySelector('.init-btn');

    if (!input.trim()) return alert("Please enter a rough idea first.");

    // Loading State
    outputDiv.innerHTML = "<span class='pulsate'>Initializing Nexus Engine...</span>";
    container.style.display = "block";
    initBtn.innerText = "Processing...";
    initBtn.disabled = true;

    try {
        const response = await fetch('/transform', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: input })
        });

        const data = await response.json();

        if (data.optimized) {
            outputDiv.innerHTML = marked.parse(data.optimized);
        } else {
            outputDiv.innerHTML = `<span style="color: #ff4d4d; font-family: 'Inter', sans-serif;">Error: ${data.error}</span>`;
        }

    } catch (err) {
        outputDiv.innerHTML = "<span style='color: #ff4d4d'>Connection Failure. Nexus Offline.</span>";
    } finally {
        initBtn.innerHTML = 'Initialize <span class="arrow">→</span>';
        initBtn.disabled = false;
    }
}

// --- Clipboard ---
function copyToClipboard() {
    const textElement = document.getElementById('outputText');
    const textToCopy = textElement.innerText; // Get text content only

    navigator.clipboard.writeText(textToCopy).then(() => {
        const btn = document.querySelector('.copy-btn');
        const originalText = btn.innerText;
        btn.innerText = "Copied! ✓";
        btn.style.borderColor = "#4ade80";
        btn.style.color = "#4ade80";

        setTimeout(() => {
            btn.innerText = "Copy to Clipboard";
            btn.style.borderColor = "";
            btn.style.color = "";
        }, 2000);
    });
}
