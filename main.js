const appScripts = ['cart.js', 'ui.js', 'products.js'];

function loadAppScript(index) {
    if (index >= appScripts.length) return;

    const script = document.createElement('script');
    script.src = appScripts[index];
    script.onload = () => loadAppScript(index + 1);
    script.onerror = () => console.error(`Failed to load ${appScripts[index]}`);
    document.head.appendChild(script);
}

loadAppScript(0);
