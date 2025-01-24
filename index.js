(async () => {
    // Import the Faust Web Audio creation function
    const { createFaustNode } = await import("./create-node.js");

    // Create audio context
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioCtx();
    audioContext.suspend(); // Start the context in a suspended state

    // Create the Faust DSP node
    const { faustNode, dspMeta: { name } } = await createFaustNode(audioContext, "sounds", 0);
    if (!faustNode) throw new Error("Faust DSP not compiled or not found");

    // Connect the Faust node to the audio output
    faustNode.connect(audioContext.destination);

    const descriptors = faustNode.fDescriptor;

    descriptors.forEach(({ address, min, max, label }) => {
        console.log(`Configuring ${label} with range [${min}, ${max}] at ${address}`);
    });

    console.log(descriptors)

    // Select HTML elements
    const $buttonDsp = document.getElementById("button-dsp");

    let $mouseX = 0.5;
    let $mouseY = 0.5;

    // Function to update mouseX and mouseY and set faustNode parameters
    function updateInteraction(x, y) {
        $mouseX = x / window.innerWidth;
        $mouseY = y / window.innerHeight;

        const cut = mapNormalizedToRange($mouseX, 200, 2400).toFixed(2);
        const freq = mapNormalizedToRange($mouseY, 40, 160).toFixed(2);

        faustNode.setParamValue("/sounds/Cutoff", cut);
        faustNode.setParamValue("/sounds/Frequency", freq);
    }

    // Mouse move handler
    document.addEventListener("mousemove", (e) => {
        updateInteraction(e.clientX, e.clientY);
    });

    // Touch move handler
    document.addEventListener("touchmove", (e) => {
        const touch = e.touches[0]; // Get the first touch point
        updateInteraction(touch.clientX, touch.clientY);
    });

    // Optional: Touch start for immediate response on tap
    document.addEventListener("touchstart", (e) => {
        const touch = e.touches[0];
        updateInteraction(touch.clientX, touch.clientY);
    });

    $buttonDsp.disabled = true; // Disable the button until the DSP is ready

    // Toggle audio context on button click
    $buttonDsp.onclick = async () => {
        if (audioContext.state === "running") {
            $buttonDsp.textContent = "Activate Sound";
            await audioContext.suspend();
        } else {
            $buttonDsp.textContent = "Deactivate Sound";
            await audioContext.resume();
        }
    };

    $buttonDsp.disabled = false;
})();

function mapNormalizedToRange(normalizedValue, min, max) {
    return min + normalizedValue * (max - min);
}
