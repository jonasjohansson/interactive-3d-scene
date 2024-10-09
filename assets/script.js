document.querySelectorAll('.hoverable').forEach(entity => {
    entity.addEventListener('model-loaded', () => {
      const mesh = entity.getObject3D('mesh');
      if (!mesh) return;
  
      // Traverse through the model and set transparent and initial opacity
      mesh.traverse(child => {
        if (child.isMesh && child.material) {
          child.material.transparent = true; // Enable opacity change
          child.material.opacity = 1; // Set initial opacity
        }
      });
  
      // Add mouseenter event to change opacity on hover
      entity.addEventListener('mouseenter', () => {
        mesh.traverse(child => {
          if (child.isMesh && child.material) {
            child.material.transparent = true; // Make sure transparency is enabled
            child.material.opacity = 0.5; // Change opacity on hover
          }
        });
      });
  
      // Add mouseleave event to reset opacity
      entity.addEventListener('mouseleave', () => {
        mesh.traverse(child => {
          if (child.isMesh && child.material) {
            child.material.opacity = 1; // Reset opacity when the mouse leaves
          }
        });
      });
    });
  });
  
  // Enable start button after assets are loaded
  const startButton = document.getElementById("start-button");
  const sceneEl = document.querySelector("a-scene");
  
  sceneEl.addEventListener("loaded", () => {
    startButton.disabled = false;
    startButton.textContent = "Start";
  });
  
  startButton.addEventListener("click", function () {
    document.getElementById("loading-screen").style.display = "none";
    document.getElementById("scene").style.visibility = "visible";
    document.getElementById("info-box").style.display = "block";
    document.getElementById("navigation-buttons").style.display = "block";
  
    // Ensure orbit controls are properly initialized
    const camera = document.getElementById("camera");
    camera.components["orbit-controls"].controls.update();
  });
  
  const clickableElements = document.querySelectorAll(".clickable");
  let currentHotspotIndex = 0;
  
  function moveToHotspot(index) {
    const cameraRig = document.getElementById("cameraRig");
    const targetElement = clickableElements[index];
    const targetPosition = targetElement.getAttribute("position");
  
    cameraRig.setAttribute("animation__zoom", {
      property: "position",
      to: `${targetPosition.x} ${
        parseFloat(targetPosition.y) + 1.5
      } ${parseFloat(targetPosition.z) + 5}`,
      dur: 1000,
      easing: "easeInOutQuad",
    });
  
    const camera = document.getElementById("camera");
    camera.setAttribute(
      "orbit-controls",
      "target",
      `${targetPosition.x} ${targetPosition.y} ${targetPosition.z}`
    );
  
    // Fetch the text-content attribute from the target element
    const textContent = targetElement.getAttribute("text-content");
  
    // Update info-box text
    document.getElementById("info-box").textContent = textContent;
  }
  
  // Add event listener to each clickable element for zoom effect
  clickableElements.forEach((element, index) => {
    element.addEventListener("click", () => {
      moveToHotspot(index);
  
      // Fetch text content from the clicked element and update info-box
      const textContent = element.getAttribute("text-content");
      document.getElementById("info-box").innerHTML = textContent;
    });
  });
  
  document.getElementById("next-button").addEventListener("click", function (event) {
    event.stopPropagation();
    currentHotspotIndex = (currentHotspotIndex + 1) % clickableElements.length;
    moveToHotspot(currentHotspotIndex);
  });
  
  document.getElementById("prev-button").addEventListener("click", function (event) {
    event.stopPropagation();
    currentHotspotIndex =
      (currentHotspotIndex - 1 + clickableElements.length) % clickableElements.length;
    moveToHotspot(currentHotspotIndex);
  });
  