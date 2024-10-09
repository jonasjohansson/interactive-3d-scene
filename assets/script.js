document.querySelectorAll('.hoverable').forEach(entity => {
    entity.addEventListener('model-loaded', () => {
      const mesh = entity.getObject3D('mesh');
      if (!mesh) return;
  
      // Traverse model once and set initial transparency
      mesh.traverse(child => {
        if (child.isMesh && child.material) {
          child.material.transparent = true; // Enable transparency
          child.material.opacity = 1; // Initial opacity
        }
      });
  
      // Handle opacity change on hover
      const setOpacity = (opacity) => {
        mesh.traverse(child => {
          if (child.isMesh && child.material) {
            child.material.opacity = opacity;
          }
        });
      };
  
      entity.addEventListener('mouseenter', () => setOpacity(0.5));
      entity.addEventListener('mouseleave', () => setOpacity(1));
    });
  });
  
  // Enable start button after assets are loaded
  const startButton = document.getElementById("start-button");
  const sceneEl = document.querySelector("a-scene");
  
  sceneEl.addEventListener("loaded", () => {
    startButton.disabled = false;
    startButton.textContent = "Start";
  });
  
  startButton.addEventListener("click", () => {
    document.getElementById("loading-screen").style.display = "none";
    document.getElementById("scene").style.visibility = "visible";
    document.getElementById("info-box").style.display = "block";
    document.getElementById("navigation-buttons").style.display = "block";
  
    // Initialize orbit controls
    const camera = document.getElementById("camera");
    camera.components["orbit-controls"].controls.update();
  });
  
  const clickableElements = document.querySelectorAll(".clickable");
  let currentHotspotIndex = 0;
  
  function moveToHotspot(index) {
    const cameraRig = document.getElementById("cameraRig");
    const targetElement = clickableElements[index];
    const targetPosition = targetElement.getAttribute("position");
  
    // Animate camera to target position
    cameraRig.setAttribute("animation__zoom", {
      property: "position",
      to: `${targetPosition.x} ${parseFloat(targetPosition.y) + 1.5} ${parseFloat(targetPosition.z) + 5}`,
      dur: 1000,
      easing: "easeInOutQuad",
    });
  
    const camera = document.getElementById("camera");
    camera.setAttribute("orbit-controls", "target", `${targetPosition.x} ${targetPosition.y} ${targetPosition.z}`);
  
    // Update info-box text
    document.getElementById("info-box").textContent = targetElement.getAttribute("text-content");
  }
  
  // Add event listeners for each clickable element
  clickableElements.forEach((element, index) => {
    element.addEventListener("click", () => moveToHotspot(index));
  });
  
  document.getElementById("next-button").addEventListener("click", event => {
    event.stopPropagation();
    currentHotspotIndex = (currentHotspotIndex + 1) % clickableElements.length;
    moveToHotspot(currentHotspotIndex);
  });
  
  document.getElementById("prev-button").addEventListener("click", event => {
    event.stopPropagation();
    currentHotspotIndex = (currentHotspotIndex - 1 + clickableElements.length) % clickableElements.length;
    moveToHotspot(currentHotspotIndex);
  });
  