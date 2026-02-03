async function processPrompt() {
    const input = document.getElementById('promptInput').value;
    const outputDiv = document.getElementById('outputText');
    const container = document.getElementById('resultContainer');

    if (!input) return alert("Please enter a prompt.");

    outputDiv.innerText = "Processing...";
    container.style.display = "block";

    const response = await fetch('/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input })
    });

    const data = await response.json();
    outputDiv.innerText = data.optimized || data.error;
}

async function processPrompt() {
    const input = document.getElementById('promptInput').value;
    const outputDiv = document.getElementById('outputText');
    const container = document.getElementById('resultContainer');

    if (!input) return alert("Please enter a prompt.");

    outputDiv.innerHTML = "<em>Architecting your prompt...</em>";
    container.style.display = "block";

    try {
        const response = await fetch('/transform', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: input })
        });

        const data = await response.json();
        
        // Use marked.parse to render the Markdown symbols into clean HTML
        // This removes the * and # symbols and turns them into styles
        outputDiv.innerHTML = marked.parse(data.optimized || data.error);
        
    } catch (err) {
        outputDiv.innerHTML = "Error connecting to server.";
    }
}

function copyToClipboard() {
    const textElement = document.getElementById('outputText');
    // Using innerText ensures we get the text without HTML tags
    const textToCopy = textElement.innerText.replace(/^["']|["']$/g, ''); 

    navigator.clipboard.writeText(textToCopy).then(() => {
        const btn = document.querySelector('.copy-btn');
        btn.innerText = "Copied! ✅";
        setTimeout(() => { btn.innerText = "Copy Prompt"; }, 2000);
    });
}

// Create the glow element dynamically
const glow = document.createElement('div');
glow.className = 'mouse-glow';
document.body.appendChild(glow);

document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
});

// // Inside your processPrompt function in main.js
// const data = await response.json();

// if (data.optimized) {
//     // .trim() removes empty lines at the start and end
//     const cleanContent = data.optimized.trim();
    
//     // Render with marked.js
//     outputDiv.innerHTML = marked.parse(cleanContent);
// }