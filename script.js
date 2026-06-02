// A real, high-quality festive popper "pop" sound effect embedded directly as code data
const POP_SOUND_DATA = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQQAAAAAgICA"; 

// Short backup pop synth using an audio buffer cluster to make it sound full and organic
function playRealisticPop() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        
        // Setup Primary Crisp Click Node
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(800, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.05);
        gain1.gain.setValueAtTime(0.4, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        
        // Setup Secondary Hollow Air Burst Node (Creates the "thump" of a popper)
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(180, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.12);
        gain2.gain.setValueAtTime(0.6, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        
        // Connect both nodes to sound output
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        
        // Fire both sounds simultaneously to blend into a single realistic crunch pop
        osc1.start(ctx.currentTime);
        osc1.stop(ctx.currentTime + 0.05);
        osc2.start(ctx.currentTime);
        osc2.stop(ctx.currentTime + 0.12);
        
    } catch (e) {
        console.log("Audio trigger failed: ", e);
    }
}

// --- Confetti & Sound on Click ---
function revealCode(event, element) {
    if (!element.classList.contains('revealed')) {
        element.classList.add('revealed');
        
        // Play the multi-layered organic pop sound
        playRealisticPop();
        
        // Trigger the confetti layout
        const x = event.clientX / window.innerWidth;
        const y = event.clientY / window.innerHeight;

        confetti({
            particleCount: 150,
            spread: 70,
            origin: { x: x, y: y },
            colors: ['#ff4a75', '#ffd700', '#ffffff']
        });
    }
}

// --- Background Floating Animation ---
function createBackgroundElements() {
    const container = document.getElementById('background-animation');
    if (!container) return;
    
    const elementCount = 30; // Optimized count for stable performance on low-end mobile viewports
    const symbols = [
        { type: 'text', val: '❤️', class: 'heart' },
        { type: 'text', val: '★', class: 'star' },
        { type: 'div', class: 'bokeh' }
    ];

    for (let i = 0; i < elementCount; i++) {
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        const element = symbol.type === 'text' ? document.createElement('span') : document.createElement('div');
        
        if (symbol.type === 'text') {
            element.innerText = symbol.val;
        }

        element.className = `background-element ${symbol.class}`;
        element.style.left = `${Math.random() * 95}vw`; /* Keeps particles slightly inside viewport boundary edges */
        element.style.fontSize = `${Math.random() * 20 + 10}px`; 
        
        if (symbol.class === 'bokeh') {
            const size = Math.random() * 50 + 10;
            element.style.width = `${size}px`;
            element.style.height = `${size}px`;
        }

        const randomStartDelay = -(Math.random() * 20); 
        element.style.animationDelay = `${randomStartDelay}s`; 
        element.style.animationDuration = `${Math.random() * 12 + 10}s`; 

        container.appendChild(element);
    }
}

document.addEventListener("DOMContentLoaded", createBackgroundElements);

// --- Clipboard Copy Handler Engine ---
function copyToClipboard(event, button) {
    // Blocks the click from accidentally triggering the outer gift card container re-render
    event.stopPropagation();
    
    // Traverses layout structural layers to find the targeted inner text content string
    const codeBox = button.previousElementSibling;
    if (!codeBox) return;
    
    const textToCopy = codeBox.innerText;
    
    // Modern asynchronous clipboard engine executor
    navigator.clipboard.writeText(textToCopy).then(() => {
        // Toggles visual notification popover alert flag
        button.classList.add('show-tooltip');
        
        // Timeout window to automatically reset tooltip visibility state
        setTimeout(() => {
            button.classList.remove('show-tooltip');
        }, 1500);
    }).catch(err => {
        console.error('System failed text buffer export isolation profiles: ', err);
    });
}