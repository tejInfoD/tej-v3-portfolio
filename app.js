document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Dynamic Header Clock
  // ==========================================
  const clockElement = document.getElementById('nav-node-clock');
  function updateClock() {
    const now = new Date();
    const timeString = now.toTimeString().split(' ')[0];
    if (clockElement) {
      clockElement.textContent = `SYS_TIME: ${timeString}`;
    }
  }
  setInterval(updateClock, 1000);
  updateClock();

  // ==========================================
  // 2. Custom Cinematic Cursor & Ambient Tracker
  // ==========================================
  const cursorDot = document.getElementById('cursor-dot');
  const cursorTrail = document.getElementById('cursor-trail');
  const glowTracker = document.getElementById('ui-glow-tracker');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let trailX = mouseX;
  let trailY = mouseY;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Set custom HSL glow coordinates on body
    document.body.style.setProperty('--mouse-x', `${mouseX}px`);
    document.body.style.setProperty('--mouse-y', `${mouseY}px`);

    if (cursorDot) {
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }
  });

  // Smooth trail physics interpolator
  function animateTrail() {
    const ease = 0.15; // interpolation weight
    trailX += (mouseX - trailX) * ease;
    trailY += (mouseY - trailY) * ease;

    if (cursorTrail) {
      cursorTrail.style.left = `${trailX}px`;
      cursorTrail.style.top = `${trailY}px`;
    }
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Highlight cursor on hoverable interactive items
  const hoverElements = document.querySelectorAll('a, button, tr, .work-card, input, textarea');
  hoverElements.forEach(elem => {
    elem.addEventListener('mouseenter', () => {
      if (cursorTrail) {
        cursorTrail.style.transform = 'translate(-50%, -50%) scale(1.6)';
        cursorTrail.style.borderColor = 'var(--color-crimson-glow)';
      }
      if (cursorDot) {
        cursorDot.style.background = 'var(--color-crimson-glow)';
      }
    });
    elem.addEventListener('mouseleave', () => {
      if (cursorTrail) {
        cursorTrail.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorTrail.style.borderColor = 'rgba(220, 38, 38, 0.3)';
      }
      if (cursorDot) {
        cursorDot.style.background = 'var(--color-crimson)';
      }
    });
  });

  // ==========================================
  // 3. Hero Particle Constellation Grid & Parallax
  // ==========================================
  const matrixCanvas = document.getElementById('matrix-canvas');
  if (matrixCanvas) {
    const ctx = matrixCanvas.getContext('2d');
    let particles = [];
    let width = matrixCanvas.width = matrixCanvas.offsetWidth;
    let height = matrixCanvas.height = matrixCanvas.offsetHeight;

    window.addEventListener('resize', () => {
      if (matrixCanvas) {
        width = matrixCanvas.width = matrixCanvas.offsetWidth;
        height = matrixCanvas.height = matrixCanvas.offsetHeight;
      }
    });

    // Particle Object Blueprint with cursor repulsion
    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.radius = Math.random() * 1.8 + 0.6;
      }
      update() {
        // Core drift velocities
        this.x += this.vx;
        this.y += this.vy;

        // Mouse coordinates repulsion physics
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) {
          const force = (160 - dist) / 160;
          this.x -= (dx / dist) * force * 1.8;
          this.y -= (dy / dist) * force * 1.8;
        }

        // Bounce bounds with subtle friction
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(226, 232, 240, 0.16)';
        ctx.fill();
      }
    }

    // Populate particle matrix
    const particleCount = Math.min(75, Math.floor((width * height) / 12000));
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function renderMatrix() {
      ctx.clearRect(0, 0, width, height);

      // Draw faint background coordinate grids
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
      ctx.lineWidth = 0.5;
      const gridSize = 65;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Concentric Glowing Telemetry Rings on Canvas
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = 'rgba(220, 38, 38, 0.02)';
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 160, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(59, 130, 246, 0.012)';
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 280, 0, Math.PI * 2);
      ctx.stroke();

      // Draw particle connectors
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.14;
            ctx.strokeStyle = `rgba(226, 232, 240, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(renderMatrix);
    }
    renderMatrix();
  }

  // Multi-layered mouse-parallax handler for Hero
  document.addEventListener('mousemove', (e) => {
    const normX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
    const normY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);

    const parallaxElements = document.querySelectorAll('.parallax-element');
    parallaxElements.forEach(elem => {
      const speed = parseFloat(elem.getAttribute('data-speed')) || 0.02;
      const tx = normX * speed * 75; // max translation px
      const ty = normY * speed * 75;

      if (elem.id === 'hero-central-hologram') {
        // Central hologram base translation
        elem.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px))`;

        // Tilt and translate sub-layers for genuine 3D glass depth
        const lBack = elem.querySelector('.layer-back');
        const lMiddle = elem.querySelector('.layer-middle');
        const lFront = elem.querySelector('.layer-front');

        if (lBack) lBack.style.transform = `translate(${tx * -0.6}px, ${ty * -0.6}px)`;
        if (lMiddle) lMiddle.style.transform = `translate(${tx * 0.25}px, ${ty * 0.25}px)`;
        if (lFront) lFront.style.transform = `translate(${tx * 0.75}px, ${ty * 0.75}px) scale(1.04)`;
      } else {
        elem.style.transform = `translate(${tx}px, ${ty}px)`;
      }
    });
  });

  // ==========================================
  // 4. Systems Thinking Canvas (Ecosystem Map)
  // ==========================================
  const systemsCanvas = document.getElementById('systems-canvas');
  if (systemsCanvas) {
    const sCtx = systemsCanvas.getContext('2d');
    let sWidth = systemsCanvas.width = systemsCanvas.offsetWidth;
    let sHeight = systemsCanvas.height = systemsCanvas.offsetHeight;

    window.addEventListener('resize', () => {
      if (systemsCanvas) {
        sWidth = systemsCanvas.width = systemsCanvas.offsetWidth;
        sHeight = systemsCanvas.height = systemsCanvas.offsetHeight;
        positionNodes();
      }
    });

    // Strategy Nodes Metadata
    const nodes = [
      {
        id: 0,
        name: 'COORDINATION ENGINE',
        x: 0.5, y: 0.5,
        radius: 20,
        color: '#dc2626', // Crimson Hub
        coherence: '0.998',
        stability: '99.1%',
        latency: '8ms',
        desc: 'Core neural command registry orchestrating autonomous multi-agent operational models and human alignment feedback signals.'
      },
      {
        id: 1,
        name: 'DECISION PROTOCOLS',
        x: 0.25, y: 0.35,
        radius: 12,
        color: '#3b82f6', // Electric Blue Node
        coherence: '0.984',
        stability: '97.2%',
        latency: '14ms',
        desc: 'Continuous real-time policy modeling networks compiling market vectors into dynamic organizational decision patterns.'
      },
      {
        id: 2,
        name: 'AUTONOMOUS SUB-AGENTS',
        x: 0.75, y: 0.35,
        radius: 12,
        color: '#3b82f6',
        coherence: '0.995',
        stability: '98.8%',
        latency: '10ms',
        desc: 'Semantic agent swarm executed in sandboxed operational loops to simulate, test, and adapt corporate workflows dynamically.'
      },
      {
        id: 3,
        name: 'SYSTEMIC ALIGNMENT',
        x: 0.3, y: 0.7,
        radius: 12,
        color: '#10b981', // Emerald Green Node
        coherence: '0.979',
        stability: '96.5%',
        latency: '16ms',
        desc: 'Sovereign transparency ledger charting organizational carbon resources and financial allocations to guarantee zero decay.'
      },
      {
        id: 4,
        name: 'FEEDBACK ROUTING',
        x: 0.7, y: 0.7,
        radius: 12,
        color: '#10b981',
        coherence: '0.991',
        stability: '99.4%',
        latency: '12ms',
        desc: 'Decentralized operational metadata loops feeding execution statistics directly back into primary strategic paradigms.'
      }
    ];

    // Node connection graph edges
    const links = [
      { source: 0, target: 1 },
      { source: 0, target: 2 },
      { source: 0, target: 3 },
      { source: 0, target: 4 },
      { source: 1, target: 2 },
      { source: 3, target: 4 }
    ];

    // Compute node pixel coordinates based on container size
    function positionNodes() {
      nodes.forEach(node => {
        node.px = node.x * sWidth;
        node.py = node.y * sHeight;
      });
    }
    positionNodes();

    let activeNode = null;
    let hoveredNode = null;

    // Canvas Mouse Click/Hover Handlers
    const container = document.getElementById('interactive-canvas-container');
    container.addEventListener('mousemove', (e) => {
      const rect = systemsCanvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      let found = null;
      nodes.forEach(node => {
        const dx = clickX - node.px;
        const dy = clickY - node.py;
        if (Math.sqrt(dx*dx + dy*dy) < node.radius + 15) {
          found = node;
        }
      });
      
      hoveredNode = found;
      if (found) {
        document.body.style.cursor = 'none'; // preserve beautiful custom cursor
      }
    });

    container.addEventListener('click', (e) => {
      const rect = systemsCanvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      nodes.forEach(node => {
        const dx = clickX - node.px;
        const dy = clickY - node.py;
        if (Math.sqrt(dx*dx + dy*dy) < node.radius + 15) {
          activeNode = node;
          updateTelemetryPanel(node);
        }
      });
    });

    function updateTelemetryPanel(node) {
      document.getElementById('active-node-name').textContent = node.name;
      document.getElementById('active-node-coherence').textContent = node.coherence;
      document.getElementById('active-node-stability').textContent = node.stability;
      document.getElementById('active-node-latency').textContent = node.latency;
      document.getElementById('active-node-desc').textContent = node.desc;
      
      // Flash glowing color briefly on status board
      const panel = document.getElementById('canvas-telemetry-panel');
      panel.style.borderColor = node.color;
      setTimeout(() => {
        panel.style.borderColor = 'var(--color-dark-border)';
      }, 800);
    }

    let globalPulsePhase = 0;

    function renderSystemsMap() {
      sCtx.clearRect(0, 0, sWidth, sHeight);
      globalPulsePhase += 0.05;

      // Draw faint layout background nodes
      sCtx.strokeStyle = 'rgba(255,255,255,0.01)';
      sCtx.lineWidth = 1;
      sCtx.strokeRect(40, 40, sWidth - 80, sHeight - 80);

      // Draw Connections (Edges)
      links.forEach(link => {
        const s = nodes[link.source];
        const t = nodes[link.target];

        sCtx.beginPath();
        sCtx.moveTo(s.px, s.py);
        sCtx.lineTo(t.px, t.py);

        // Highlight linked path if active or hovered
        const isHighlight = (activeNode && (activeNode.id === s.id || activeNode.id === t.id)) ||
                            (hoveredNode && (hoveredNode.id === s.id || hoveredNode.id === t.id));

        if (isHighlight) {
          sCtx.strokeStyle = 'rgba(220, 38, 38, 0.45)';
          sCtx.lineWidth = 1.5;
        } else {
          sCtx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
          sCtx.lineWidth = 0.75;
        }
        sCtx.stroke();

        // Draw routing pulse particle flows along cables
        if (isHighlight) {
          const flowPos = (globalPulsePhase * 0.15) % 1;
          const px = s.px + (t.px - s.px) * flowPos;
          const py = s.py + (t.py - s.py) * flowPos;
          sCtx.beginPath();
          sCtx.arc(px, py, 2.5, 0, Math.PI * 2);
          sCtx.fillStyle = 'var(--color-crimson-glow)';
          sCtx.fill();
        }
      });

      // Draw Nodes
      nodes.forEach(node => {
        const isHovered = hoveredNode && hoveredNode.id === node.id;
        const isActive = activeNode && activeNode.id === node.id;

        // Render ambient glow ring
        sCtx.beginPath();
        sCtx.arc(node.px, node.py, node.radius * (isHovered || isActive ? 1.6 : 1.3), 0, Math.PI*2);
        
        const pulseGlow = Math.sin(globalPulsePhase) * 0.15 + 0.25;
        sCtx.fillStyle = isActive ? `rgba(220, 38, 38, ${pulseGlow + 0.15})` : `rgba(255,255,255,${isHovered ? 0.08 : 0.03})`;
        sCtx.fill();

        // Render core node circle
        sCtx.beginPath();
        sCtx.arc(node.px, node.py, node.radius, 0, Math.PI * 2);
        sCtx.fillStyle = node.color;
        sCtx.shadowColor = node.color;
        sCtx.shadowBlur = isHovered || isActive ? 18 : 6;
        sCtx.fill();
        sCtx.shadowBlur = 0; // reset shadow index

        // Render node titles beside node
        sCtx.fillStyle = isHovered || isActive ? '#fff' : 'var(--color-silver-dim)';
        sCtx.font = `bold 9px var(--font-mono)`;
        sCtx.fillText(node.name, node.px + node.radius + 8, node.py + 3);
      });

      requestAnimationFrame(renderSystemsMap);
    }
    renderSystemsMap();
  }

  // ==========================================
  // 5. Cinematic Scroll Reveal Observer
  // ==========================================
  const scrollElements = document.querySelectorAll('.reveal-on-scroll');
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        // Trigger case studies count-up metrics once visible
        if (entry.target.id === 'work') {
          triggerNumericCounter();
        }
      }
    });
  }, {
    threshold: 0.18
  });

  scrollElements.forEach(elem => {
    scrollObserver.observe(elem);
  });

  // ==========================================
  // 6. Selected Work Stats Increments (Count Up)
  // ==========================================
  let metricsTriggered = false;

  function triggerNumericCounter() {
    if (metricsTriggered) return;
    metricsTriggered = true;

    const statsElements = document.querySelectorAll('.stat-val');
    statsElements.forEach(stat => {
      const target = parseFloat(stat.getAttribute('data-target'));
      const suffix = stat.textContent.replace(/[0-9.]/g, ''); // Extract %, +, - symbols
      let currentVal = 0;
      const duration = 2000; // 2 seconds animate duration
      const steps = 60;
      const increment = target / steps;
      let stepCount = 0;

      const counterInterval = setInterval(() => {
        stepCount++;
        currentVal += increment;
        
        if (stepCount >= steps) {
          clearInterval(counterInterval);
          stat.textContent = `${target}${suffix}`;
        } else {
          // Adjust formats based on decimal layout requirements
          if (target % 1 !== 0) {
            stat.textContent = `${currentVal.toFixed(2)}${suffix}`;
          } else {
            stat.textContent = `${Math.floor(currentVal)}${suffix}`;
          }
        }
      }, duration / steps);
    });
  }

  // ==========================================
  // 7. Interactive Terminal Typing Decryption
  // ==========================================
  const transmissionContent = document.getElementById('transmission-text-content');
  const decryptObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        triggerTerminalDecryption();
        decryptObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  if (transmissionContent) {
    decryptObserver.observe(transmissionContent);
  }

  function triggerTerminalDecryption() {
    const paragraphs = transmissionContent.querySelectorAll('p');
    let textBuffers = [];

    // Cache original inner html text nodes and replace with blank strings
    paragraphs.forEach(p => {
      textBuffers.push(p.innerHTML);
      p.innerHTML = '';
    });

    let currentParagraphIndex = 0;
    let currentCharIndex = 0;

    // Custom mechanical type decrypt loop
    function typeChar() {
      if (currentParagraphIndex < paragraphs.length) {
        const targetP = paragraphs[currentParagraphIndex];
        const buffer = textBuffers[currentParagraphIndex];

        // Type simple characters while preserving html tag nodes cleanly
        if (currentCharIndex < buffer.length) {
          // Detect HTML tags (like <strong>) and inject immediately
          if (buffer[currentCharIndex] === '<') {
            const closingAngle = buffer.indexOf('>', currentCharIndex);
            targetP.innerHTML += buffer.substring(currentCharIndex, closingAngle + 1);
            currentCharIndex = closingAngle + 1;
          } else {
            targetP.innerHTML += buffer[currentCharIndex];
            currentCharIndex++;
          }
          setTimeout(typeChar, Math.random() * 12 + 6); // typewriter speed randomness
        } else {
          // Append custom blinking terminal cursor cursor element
          if (currentParagraphIndex === paragraphs.length - 1) {
            targetP.innerHTML += '<span class="cursor-line"></span>';
          }
          currentParagraphIndex++;
          currentCharIndex = 0;
          setTimeout(typeChar, 250); // Pause briefly before writing next line
        }
      }
    }
    typeChar();
  }

  // ==========================================
  // 8. Secure Contact Submit Console Output
  // ==========================================
  const form = document.getElementById('secure-transmission-form');
  const statusMsg = document.getElementById('transmission-status-msg');

  if (form && statusMsg) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let phase = 0;
      statusMsg.textContent = 'ESTABLISHING HANDSHAKE...';
      statusMsg.style.color = 'var(--color-crimson)';

      const steps = [
        'ROUTING PROTOCOL ENCRYPT...',
        'TRANSMITTING METADATA PACKETS...',
        'SECURE CONNECTION STABLE // COHERENCE ACKNOWLEDGED // THANK YOU'
      ];

      const interval = setInterval(() => {
        statusMsg.textContent = steps[phase];
        phase++;
        
        if (phase >= steps.length) {
          clearInterval(interval);
          statusMsg.style.color = '#10b981'; // Success Green Console
          form.reset();
        }
      }, 1000);
    });
  }

  // ==========================================
  // 9. Editorial Signals Reader Mode & Database
  // ==========================================
  const articlesDB = {
    'SIG-7712': {
      id: '[SIG-7712]',
      title: 'Decentralized Multi-Agent Coordination Protocols',
      category: 'ORCHESTRATION',
      date: '04.12.2026',
      time: '7 MIN READ',
      content: `
        <p>In the post-singularity enterprise ecosystem, computational capacity has transitioned from a scarce commodity to an ambient infrastructure. Value no longer resides in the generation of intelligence, but in its orchestration.</p>
        
        <p>As autonomous AI agents begin operating at sub-millisecond latencies across enterprise processes, traditional human consensus structures are transformed into the primary operational bottleneck. We are witnessing the emergence of "organizational latency"—the delay introduced when decentralized systems are forced to align with slow-moving hierarchical models.</p>

        <blockquote>
          “The goal is not to eliminate human agency, but to transition humans from active bottleneck controllers to sovereign boundary setters.”
        </blockquote>

        <h3>The Mechanics of Autonomous Alignment</h3>
        <p>To operate coherently without central orchestration checkpoints, agent swarms utilize decentralized coordination protocols derived from distributed systems and physics. These structures rely on three fundamental principles:</p>
        
        <ul>
          <li><strong>Mutual Telemetry Broadcast:</strong> Agents continuously broadcast coordinate vectors representing their execution state, local context, and confidence limits.</li>
          <li><strong>Active Repulsion Fields:</strong> To prevent redundant computation and resource collisions, active nodes maintain a mathematically defined repelling force against overlapping tasks.</li>
          <li><strong>Dynamic Coherence Envelopes:</strong> The boundaries of a team's execution space are calculated programmatically, allowing agents to shift workloads dynamically as localized stressors scale.</li>
        </ul>

        <h3>Deploying Behavioral Protocols</h3>
        <p>Institutions that implement these coordination models experience a profound reduction in rework and communication debt. By designing interfaces that visualize these invisible systems, orchestrators can monitor organizational coherence in real time, transforming conflict from an emotional friction into structured telemetry.</p>
      `
    },
    'SIG-8924': {
      id: '[SIG-8924]',
      title: 'The Post-AI Enterprise Operating Model',
      category: 'SYSTEMS',
      date: '02.28.2026',
      time: '9 MIN READ',
      content: `
        <p>The legacy corporation was designed to solve coordination challenges through information compression. In traditional structures, raw operational insights are systematically flattened, compressed, and funneled up through management hierarchies to decision nodes. In the era of ambient machine intelligence, this model is obsolete.</p>
        
        <p>When intelligence is ubiquitous, compression is no longer a necessity. The modern operating model must be built around information expansion and real-time behavioral loops. Rather than managing teams, we are organizing living ecosystems of coordinated computation and human intent.</p>

        <blockquote>
          “We are moving from static organizational architecture to self-regulating, living networks that evolve hourly.”
        </blockquote>

        <h3>The Coherence Decay Loop</h3>
        <p>Without continuous feedback loops, high-growth institutions undergo a process we define as Coherence Decay. This decay follows a predictable mathematical loop:</p>
        <ol>
          <li><strong>Execution Divergence:</strong> Daily actions drift subtly away from the core strategic intent.</li>
          <li><strong>Evaporation of Meaning:</strong> High-level concepts become performative buzzwords, losing their specific technical parameters.</li>
          <li><strong>Latency Accumulation:</strong> Decision loops lengthen as managers seek consensus rather than clear tradeoffs.</li>
          <li><strong>Entropic Collapse:</strong> The organization splinters into competing factions operating on conflicting models of reality.</li>
        </ol>

        <h3>Building Self-Healing Operating Models</h3>
        <p>To resist entropic decay, systems designers must implement continuous self-healing feedback vectors. Strategic plans must transition from static quarterly slides into live-updating digital operating engines. By tracking behavioral indicators directly, institutions can maintain systemic coherence, adapting their structures to navigate volatility before collapse begins.</p>
      `
    },
    'SIG-3310': {
      id: '[SIG-3310]',
      title: 'Designing Against Entropy: Feedback Loop Aesthetics',
      category: 'DESIGN',
      date: '11.15.2025',
      time: '6 MIN READ',
      content: `
        <p>For decades, user interface design has been dominated by a singular, transaction-oriented paradigm: minimize friction, maximize velocity, and drive the user toward conversion. While highly effective for simple transactions, this philosophy fails catastrophically when applied to complex decision systems.</p>
        
        <p>When users navigate high-consequence ecosystems—such as global supply networks, sovereign policy frameworks, or complex organization topologies—speed is often the enemy of coherence. When interfaces hide systemic tradeoffs to make an action feel effortless, they invite long-term operational debt.</p>

        <blockquote>
          “Brutalist editorial design is not a retro aesthetic choice; it is an active cognitive strategy to slow down perception and encourage deep systems thinking.”
        </blockquote>

        <h3>The Principle of Reflective Friction</h3>
        <p>To help users make intelligent, high-coherence choices, we design interfaces that integrate intentional "reflective friction." This is achieved through carefully calibrated aesthetic decisions:</p>
        
        <ul>
          <li><strong>Generous Whitespace:</strong> Allows information to breathe, reducing cognitive overload and letting the hierarchy carry weight.</li>
          <li><strong>Dot-Matrix Grid Systems:</strong> Simulates precision, framing data points as coordinate networks rather than isolated statistics.</li>
          <li><strong>High-Contrast Typography:</strong> Employs sharp serifs alongside precise monospaced details, signaling that words carry mathematical gravity.</li>
          <li><strong>Dynamic Visual Math Loops:</strong> Embeds live vector curves that transform shapes as values are modified, illustrating how adjusting one lever cascades throughout the ecosystem.</li>
        </ul>

        <p>By treating feedback loop design as a structural discipline, we help users navigate complex worldviews, transforming digital spaces from transactional paths into scientific observatories.</p>
      `
    },
    'SIG-1108': {
      id: '[SIG-1108]',
      title: 'Verifiable Coherence Metrics for Global Teams',
      category: 'STRATEGY',
      date: '09.05.2025',
      time: '8 MIN READ',
      content: `
        <p>How do you measure team alignment? Traditionally, organizations rely on subjective telemetry—annual engagement surveys, retrospective performance reviews, and subjective alignment feedback. These mechanisms do not measure alignment; they capture post-hoc narrative rationalizations.</p>
        
        <p>True strategic coherence is not an attitude; it is a measurable state of coordination. We propose a new mathematical framework for assessing team health based on objective behavioral data.</p>

        <blockquote>
          "Teams rarely suffer from a lack of alignment. They suffer from invisible trade-offs that have never been mapped."
        </blockquote>

        <h3>Three Key Telemetry Vectors</h3>
        <p>To assess an organization's real-time coherence, strategic designers track three core vectors:</p>
        <ol>
          <li><strong>Alignment Drift Angle (θ):</strong> The mathematical angular variance between strategic intent vectors and actual day-to-day execution output.</li>
          <li><strong>Response Latency (λ):</strong> The time delay between a critical signal appearing in the market environment and the organization executing an adjusted response.</li>
          <li><strong>Psychological Safety Margin (S):</strong> The frequency of dissenting opinions or critical telemetry reported by edge nodes, relative to standard performance communications.</li>
        </ol>

        <p>By mapping these parameters into a live-updating dashboard interface, leadership swarms can verify their operational coherence, transforming strategic alignment from a performative theater into a verifiable, high-precision science.</p>
      `
    }
  };

  // Select reader nodes
  const readerOverlay = document.getElementById('blog-reader-overlay');
  const btnCloseReader = document.getElementById('btn-close-reader');
  const scrollContainer = document.getElementById('reader-scroll-container');
  const progressFill = document.getElementById('reader-progress-indicator');
  const readerTelemetry = document.getElementById('reader-telemetry');

  const artId = document.getElementById('art-id');
  const artTitle = document.getElementById('art-title');
  const artCat = document.getElementById('art-cat');
  const artDate = document.getElementById('art-date');
  const artTime = document.getElementById('art-time');
  const artContent = document.getElementById('art-content');

  // Dynamic row bindings
  const blogRows = document.querySelectorAll('.blog-row');
  blogRows.forEach(row => {
    row.addEventListener('click', (e) => {
      const articleId = row.getAttribute('data-article-id');
      if (!articleId) return; // Allow natural navigation for static/external links
      e.preventDefault();
      const article = articlesDB[articleId];

      if (article) {
        artId.textContent = article.id;
        artTitle.textContent = article.title;
        artCat.textContent = article.category;
        artDate.textContent = article.date;
        artTime.textContent = article.time;
        artContent.innerHTML = article.content;

        if (scrollContainer) scrollContainer.scrollTop = 0;
        if (progressFill) progressFill.style.width = '0%';
        if (readerTelemetry) readerTelemetry.textContent = `PORT: SECURE_READ_${articleId} // STATUS: ACTIVE_STREAM`;
        if (readerOverlay) readerOverlay.classList.add('active');
        
        if (cursorTrail) {
          cursorTrail.style.transform = 'translate(-50%, -50%) scale(2.2)';
          setTimeout(() => {
            cursorTrail.style.transform = 'translate(-50%, -50%) scale(1)';
          }, 300);
        }
      }
    });
  });

  if (btnCloseReader) {
    btnCloseReader.addEventListener('click', () => {
      if (readerOverlay) readerOverlay.classList.remove('active');
    });
  }

  if (readerOverlay) {
    readerOverlay.addEventListener('click', (e) => {
      if (e.target === readerOverlay) {
        readerOverlay.classList.remove('active');
      }
    });
  }

  if (scrollContainer && progressFill) {
    scrollContainer.addEventListener('scroll', () => {
      const scrollTop = scrollContainer.scrollTop;
      const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
      if (scrollHeight > 0) {
        const percent = (scrollTop / scrollHeight) * 100;
        progressFill.style.width = `${percent}%`;
      }
    });
  }

  // ==========================================
  // 10. Secure Archive Decryption Modal Validation
  // ==========================================
  const decryptModal = document.getElementById('secure-decrypt-modal');
  const closeDecryptModal = document.getElementById('close-decrypt-modal');
  const btnDecryptArchive = document.getElementById('btn-decrypt-archive');
  const passcodeInput = document.getElementById('archive-passcode-input');
  const modalStatusText = document.getElementById('modal-decrypt-status');
  const targetProjectLabel = document.getElementById('target-project-label');
  
  let activeProjectCard = null;
  
  // Attach click listener to each project card
  const projectCards = document.querySelectorAll('.work-grid .work-card');
  projectCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      
      activeProjectCard = card;
      const projectName = card.getAttribute('data-project-name');
      
      // Update label and show modal
      if (targetProjectLabel) {
        targetProjectLabel.textContent = projectName;
      }
      if (decryptModal) {
        decryptModal.classList.add('active');
      }
      if (passcodeInput) {
        passcodeInput.value = '';
        passcodeInput.focus();
      }
      if (modalStatusText) {
        modalStatusText.textContent = 'CONNECTION: WAITING_FOR_PASSCODE';
        modalStatusText.style.color = 'var(--color-silver-dim)';
      }
    });
  });

  // Close modal triggers
  if (closeDecryptModal) {
    closeDecryptModal.addEventListener('click', () => {
      decryptModal.classList.remove('active');
    });
  }

  // Close when clicking outside content area
  if (decryptModal) {
    decryptModal.addEventListener('click', (e) => {
      if (e.target === decryptModal) {
        decryptModal.classList.remove('active');
      }
    });
  }

  function validatePasscode() {
    const code = passcodeInput.value.trim().toUpperCase();
    
    if (code === 'COHERENCE') {
      modalStatusText.textContent = 'DECRYPTING ARCHIVE... SYNC ESTABLISHED // ACCESS GRANTED';
      modalStatusText.style.color = '#10b981'; // Glowing Green Success
      
      setTimeout(() => {
        decryptModal.classList.remove('active');
        const projectName = activeProjectCard.getAttribute('data-project-name');
        alert(`[ACCESS GRANTED]: Decrypting strategic archives for ${projectName}.\nOrchestration vectors loaded successfully.`);
      }, 1200);
    } else {
      modalStatusText.textContent = 'ACCESS DENIED // CORRUPTED SIGNAL VECTORS';
      modalStatusText.style.color = 'var(--color-crimson)'; // Glowing Red Warning
      
      // Shakes input briefly
      passcodeInput.style.borderColor = 'var(--color-crimson)';
      setTimeout(() => {
        passcodeInput.style.borderColor = 'var(--color-dark-border)';
        passcodeInput.value = '';
        passcodeInput.focus();
      }, 1000);
    }
  }

  if (btnDecryptArchive) {
    btnDecryptArchive.addEventListener('click', validatePasscode);
  }

  if (passcodeInput) {
    passcodeInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        validatePasscode();
      }
    });
  }

});
