// Particle settings preview
const particleNumber = document.getElementById('particleNumber');
const particleSpeed = document.getElementById('particleSpeed');
const particleColor = document.getElementById('particleColor');
const particleShape = document.getElementById('particleShape');
const particleImage = document.getElementById('particleImage');
const particleOpacityMin = document.getElementById('particleOpacityMin');
const particleOpacityMax = document.getElementById('particleOpacityMax');
const opacitySpeed = document.getElementById('opacitySpeed');
const movementType = document.getElementById('movementType');
const movementDirection = document.getElementById('movementDirection');
const lineToggle = document.getElementById('lineToggle');
const interactionToggle = document.getElementById('interactionToggle');
const particlePreview = document.getElementById('particlePreview');
let customImageBase64 = null;

// Image upload preview
particleShape.addEventListener('change', function () {
  if (particleShape.value === 'image') {
    document.getElementById('particleImage').style.display = 'inline';
    document.getElementById('imageUploadLabel').style.display = 'inline';
  } else {
    document.getElementById('particleImage').style.display = 'none';
    document.getElementById('imageUploadLabel').style.display = 'none';
    customImageBase64 = null;
  }
});

particleImage.addEventListener('change', function () {
  const file = particleImage.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      customImageBase64 = e.target.result;
      updatePreview();
    };
    reader.readAsDataURL(file);
  }
});

// Update particles preview
let updateTimeout; // To debounce the update function

function updatePreview() {
  clearTimeout(updateTimeout);

  updateTimeout = setTimeout(() => {
    const particleLimit = 150; // Max number of particles for preview
    const sizeReductionThreshold = 100; // Threshold for reducing particle size

    const particleCount = parseInt(particleNumber.value);
    const particleSize = parseInt(
      document.getElementById('particleSize').value
    ); // Get particle size from input
    const optimizedSize =
      particleCount > sizeReductionThreshold ? 8 : particleSize; // Adjust size based on count

    const particlesConfig = {
      particles: {
        number: {
          value: Math.min(particleCount, particleLimit),
        },
        size: {
          value: optimizedSize, // Set size here
        },
        color: {
          value: particleColor.value,
        },
        shape: {
          type: particleShape.value,
          image: {
            src: customImageBase64 || '',
            width: optimizedSize, // Scale image width
            height: optimizedSize, // Scale image height
          },
        },
        opacity: {
          value: parseFloat(particleOpacityMax.value),
          anim: {
            enable: true,
            opacity_min: parseFloat(particleOpacityMin.value),
            speed: parseFloat(opacitySpeed.value),
          },
        },
        move: {
          speed: parseInt(particleSpeed.value),
          direction: movementDirection.value,
          out_mode: movementType.value,
        },
        line_linked: {
          enable: lineToggle.checked,
          distance: 150,
          color: '#ffffff',
          opacity: 0.4,
          width: 1,
        },
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: {
            enable: interactionToggle.checked,
            mode: 'grab',
          },
          onclick: {
            enable: true,
            mode: 'push',
          },
        },
      },
    };

    // Call the particlesJS with the optimized configuration
    particlesJS('particlePreview', particlesConfig);
  }, 100);
}

// Event listeners for real-time updates
const inputs = document.querySelectorAll('input, select');
inputs.forEach((input) => {
  input.addEventListener('input', updatePreview);
});

// Export config as JS file
document.getElementById('exportBtn').addEventListener('click', () => {
  const particleSize = parseInt(document.getElementById('particleSize').value); // Get the particle size value

  const particlesConfig = {
    particles: {
      number: { value: parseInt(particleNumber.value) },
      size: {
        value: particleSize, // Set size for export
      },
      color: { value: particleColor.value },
      shape: {
        type: particleShape.value,
        image: {
          src: customImageBase64 || '',
          width: particleShape.value === 'image' ? particleSize : undefined, // Scale image if custom image is selected
          height: particleShape.value === 'image' ? particleSize : undefined, // Scale image height
        },
      },
      opacity: {
        value: parseFloat(particleOpacityMax.value),
        anim: {
          enable: true,
          opacity_min: parseFloat(particleOpacityMin.value),
          speed: parseFloat(opacitySpeed.value),
        },
      },
      move: {
        speed: parseInt(particleSpeed.value),
        direction: movementDirection.value,
        out_mode: movementType.value,
      },
      line_linked: {
        enable: lineToggle.checked,
        distance: 150,
        color: '#ffffff',
        opacity: 0.4,
        width: 1,
      },
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: {
          enable: interactionToggle.checked,
          mode: 'grab',
        },
        onclick: {
          enable: true,
          mode: 'push',
        },
      },
    },
  };

  const fileContent = `var particlesConfig = ${JSON.stringify(
    particlesConfig,
    null,
    2
  )};
particlesJS("particles-js", particlesConfig);`;

  const blob = new Blob([fileContent], { type: 'text/javascript' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'particlesConfig.js';
  link.click();
});

// Initial preview load
updatePreview();
