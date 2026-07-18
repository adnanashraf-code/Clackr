export function triggerConfetti() {
  if (typeof window === "undefined") return;

  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "9999";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const handleResize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  window.addEventListener("resize", handleResize);

  // Colors mapping directly to Clackr theme accents (blue, green, red, yellow, pink, purple, cyan)
  const colors = ["#6C93D9", "#7FB88F", "#D96C58", "#E2B714", "#D16075", "#A277FF", "#66D9EF"];
  
  const particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    r: number;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
  }> = [];

  // Generate 150 particles bursting from left and right bottom corners and top center
  const particleCount = 140;
  for (let i = 0; i < particleCount; i++) {
    const fromLeft = Math.random() < 0.4;
    const fromRight = !fromLeft && Math.random() < 0.67;
    
    let x: number;
    let y: number;
    let vx: number;
    let vy: number;

    if (fromLeft) {
      // Left bottom launch
      x = 0;
      y = height * 0.8;
      vx = Math.random() * 8 + 4;
      vy = -(Math.random() * 12 + 8);
    } else if (fromRight) {
      // Right bottom launch
      x = width;
      y = height * 0.8;
      vx = -(Math.random() * 8 + 4);
      vy = -(Math.random() * 12 + 8);
    } else {
      // Top center drops
      x = Math.random() * width;
      y = -20;
      vx = Math.random() * 4 - 2;
      vy = Math.random() * 6 + 3;
    }

    particles.push({
      x,
      y,
      vx,
      vy,
      color: colors[Math.floor(Math.random() * colors.length)],
      r: Math.random() * 6 + 4,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: Math.random() * 0.2 - 0.1,
      opacity: 1,
    });
  }

  let frames = 0;
  let active = true;

  function update() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    let hasVisibleParticles = false;

    particles.forEach((p) => {
      // Apply gravity and drag
      p.vy += 0.35; // Gravity
      p.vx *= 0.98; // Friction
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;

      // Start fading out when particle goes below 75% of screen height
      if (p.y > height * 0.6) {
        p.opacity -= 0.015;
      }

      if (p.opacity > 0 && p.x > -20 && p.x < width + 20 && p.y < height + 20) {
        hasVisibleParticles = true;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity));

        // Draw rectangle or circle style confetti
        if (p.r > 7) {
          ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    });

    frames++;
    if (hasVisibleParticles && frames < 240 && active) {
      requestAnimationFrame(update);
    } else {
      window.removeEventListener("resize", handleResize);
      if (canvas.parentNode) {
        document.body.removeChild(canvas);
      }
    }
  }

  update();

  return () => {
    active = false;
  };
}
