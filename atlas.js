document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Dynamic Header Clock & Telemetry Sync
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

  function animateTrail() {
    const ease = 0.15;
    trailX += (mouseX - trailX) * ease;
    trailY += (mouseY - trailY) * ease;

    if (cursorTrail) {
      cursorTrail.style.left = `${trailX}px`;
      cursorTrail.style.top = `${trailY}px`;
    }
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  function attachCursorHovers() {
    const hoverElements = document.querySelectorAll('a, button, input[type="range"], .matrix-node-cell');
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
  }
  attachCursorHovers();


  // ==========================================
  // 3. 3D Conflict Taxonomy Interactive Grid
  // ==========================================
  
  // Database of 22 Multi-Dimensional Conflict Coordinates
  const matrixDB = {
    // Row 1: Priority/Deadline Conflict
    'priority-ind-task': {
      title: 'Localized Action Discrepancy',
      desc: 'Misaligned task priorities between collaborators, resulting in immediate friction and redundant rework in immediate actions.',
      load: '94.2%', latency: '18ms', mesh: 'PR_IND_TSK'
    },
    'priority-ind-project': {
      title: 'Milestone Allocation Friction',
      desc: 'Discrepancy in project milestone allocation between peers, delaying collaborative deliverables.',
      load: '90.5%', latency: '22ms', mesh: 'PR_IND_PRJ'
    },
    'priority-team-project': {
      title: 'Departmental Milestone Clashing',
      desc: 'Conflicting priorities within a single department team, producing project queue stagnation.',
      load: '86.1%', latency: '28ms', mesh: 'PR_TEM_PRJ'
    },
    'priority-team-portfolio': {
      title: 'Tactical Allocation Drift',
      desc: 'Prioritizing team task accomplishments over long-term strategic portfolio roadmap alignment.',
      load: '79.2%', latency: '35ms', mesh: 'PR_TEM_PTF'
    },
    'priority-inter-portfolio': {
      title: 'Cross-Roadmap Alignment Drift',
      desc: 'Siloed department priorities clashing at the portfolio tier, generating systemic strategic latency.',
      load: '68.5%', latency: '45ms', mesh: 'PR_INT_PTF'
    },

    // Row 2: Resource Allocation Conflict
    'resource-team-task': {
      title: 'Capacity Collision',
      desc: 'Local capacity overload within a team, where multiple concurrent tasks bottleneck the same contributor.',
      load: '88.3%', latency: '14ms', mesh: 'RS_TEM_TSK'
    },
    'resource-team-project': {
      title: 'Project Resource Contention',
      desc: 'Different project workstreams inside a department competing for internal team member allocations.',
      load: '84.1%', latency: '18ms', mesh: 'RS_TEM_PRJ'
    },
    'resource-inter-project': {
      title: 'Cross-Functional Capacity Lock',
      desc: 'Multiple projects competing for specialized engineering or design departments, scaling cycles.',
      load: '78.2%', latency: '32ms', mesh: 'RS_INT_PRJ'
    },
    'resource-inter-portfolio': {
      title: 'Roadmap Capital Contention',
      desc: 'Budget and headcount allocations clashing at the cross-department roadmap definition tier.',
      load: '72.0%', latency: '40ms', mesh: 'RS_INT_PTF'
    },
    'resource-org-portfolio': {
      title: 'Systemic Allocation Deadlock',
      desc: 'Severe funding and capital constraints stalling core systemic organizational transformation plans.',
      load: '56.4%', latency: '60ms', mesh: 'RS_ORG_PTF'
    },

    // Row 3: Unclear Role/Boundary Conflict
    'role-ind-task': {
      title: 'Task Ownership Ambiguity',
      desc: 'Lack of clarity regarding task ownership between peers, leading to ignored queues or duplicated work.',
      load: '92.8%', latency: '11ms', mesh: 'RL_IND_TSK'
    },
    'role-team-task': {
      title: 'Team Boundary Fog',
      desc: 'Overlapping responsibilities among team members, generating localized decision delay.',
      load: '87.5%', latency: '16ms', mesh: 'RL_TEM_TSK'
    },
    'role-team-project': {
      title: 'Project Lead Ambiguity',
      desc: 'Unclear sign-off authority and project ownership nodes inside a single department team.',
      load: '81.4%', latency: '22ms', mesh: 'RL_TEM_PRJ'
    },
    'role-inter-project': {
      title: 'Functional Handoff Friction',
      desc: 'Clashes between departments regarding workflow boundaries and deliverable handoffs.',
      load: '74.1%', latency: '30ms', mesh: 'RL_INT_PRJ'
    },

    // Row 4: Communication/Alignment Conflict
    'comm-ind-task': {
      title: 'Context Discrepancy',
      desc: 'Context gaps between peers, resulting in conflicting mental models and task outputs.',
      load: '91.2%', latency: '12ms', mesh: 'CM_IND_TSK'
    },
    'comm-team-task': {
      title: 'Status Latency Index',
      desc: 'Slow information propagation loops within a team, delaying consensus on task parameters.',
      load: '86.4%', latency: '18ms', mesh: 'CM_TEM_TSK'
    },
    'comm-team-project': {
      title: 'Target Intention Drift',
      desc: 'Divergence in definition parameters inside a project workstream, producing fragmented results.',
      load: '81.0%', latency: '25ms', mesh: 'CM_TEM_PRJ'
    },
    'comm-inter-project': {
      title: 'Siloed Context Blocks',
      desc: 'Lack of communicative interfaces between collaborating departments, creating systemic context gaps.',
      load: '73.8%', latency: '32ms', mesh: 'CM_INT_PRJ'
    },
    'comm-org-task': {
      title: 'Cascade Directive Fog',
      desc: 'Poor cascade of company-wide directives, leaving contributors unaligned on strategic targets.',
      load: '66.2%', latency: '38ms', mesh: 'CM_ORG_TSK'
    },
    'comm-org-project': {
      title: 'Strategic Initiative Drift',
      desc: 'Divergence in priority parameters across company-wide transformation workstreams, eroding focus.',
      load: '60.5%', latency: '48ms', mesh: 'CM_ORG_PRJ'
    },

    // Row 5: Expectation/Performance Conflict
    'exp-ind-task': {
      title: 'Quality Baseline Variance',
      desc: 'Peer variance in definition of done baseline standards, leading to quality output conflicts.',
      load: '93.2%', latency: '10ms', mesh: 'EX_IND_TSK'
    },
    'exp-ind-project': {
      title: 'Peer Velocity Mismatch',
      desc: 'Mismatched expectations on project velocity and quality outputs between collaborators.',
      load: '89.0%', latency: '15ms', mesh: 'EX_IND_PRJ'
    },
    'exp-team-project': {
      title: 'Team Output Discrepancy',
      desc: 'Ambiguous standards for deliverables quality within a departmental project team.',
      load: '83.4%', latency: '20ms', mesh: 'EX_TEM_PRJ'
    },
    'exp-org-project': {
      title: 'Leadership Target Variance',
      desc: 'Different parameters for return targets between strategic leadership and project execution.',
      load: '71.2%', latency: '34ms', mesh: 'EX_ORG_PRJ'
    },
    'exp-org-portfolio': {
      title: 'Portfolio Return Decay',
      desc: 'Systemic return losses caused by misaligned performance benchmarks at the global portfolio tier.',
      load: '64.0%', latency: '45ms', mesh: 'EX_ORG_PTF'
    }
  };

  // Tooltip & container references
  const tooltip = document.getElementById('node-floating-tooltip');
  const scrollWrapper = document.querySelector('.matrix-scroll-wrapper');
  
  const tooltipTitle = document.getElementById('tooltip-title');
  const tooltipDesc = document.getElementById('tooltip-desc');
  const tooltipLoad = document.getElementById('tooltip-load');
  const tooltipLatency = document.getElementById('tooltip-latency');
  const tooltipMesh = document.getElementById('tooltip-mesh');
  const btnCloseTooltip = document.getElementById('btn-close-tooltip');

  const nodeCells = document.querySelectorAll('.matrix-node-cell');

  function openNodeTooltip(cell) {
    if (!tooltip || !cell || !scrollWrapper) return;

    const nodeId = cell.getAttribute('data-node');
    const nodeData = matrixDB[nodeId];

    if (nodeData) {
      // Toggle active visual highlight states
      nodeCells.forEach(c => c.classList.remove('active-node'));
      cell.classList.add('active-node');

      // Populate content dynamically
      tooltipTitle.textContent = nodeData.title;
      tooltipDesc.textContent = nodeData.desc;
      tooltipLoad.textContent = nodeData.load;
      tooltipLatency.textContent = nodeData.latency;
      tooltipMesh.textContent = nodeData.mesh;

      // Position calculations: position tooltip perfectly directly above the clicked cell
      const cellRect = cell.getBoundingClientRect();
      const wrapperRect = scrollWrapper.getBoundingClientRect();

      // Top coordinate: cell top relative to wrapper plus the scroll position
      const topPos = (cellRect.top - wrapperRect.top) + scrollWrapper.scrollTop - 8;
      // Left coordinate: center of cell relative to wrapper plus the horizontal scroll position
      const leftPos = (cellRect.left - wrapperRect.left) + (cellRect.width / 2) + scrollWrapper.scrollLeft;

      tooltip.style.top = `${topPos}px`;
      tooltip.style.left = `${leftPos}px`;

      // Animate active state in
      tooltip.classList.add('active');

      // Expand custom cursor trail moments
      if (cursorTrail) {
        cursorTrail.style.transform = 'translate(-50%, -50%) scale(2.2)';
        setTimeout(() => {
          cursorTrail.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 300);
      }
    }
  }

  // Bind click listener to each active table cell node
  nodeCells.forEach(cell => {
    cell.addEventListener('click', (e) => {
      e.stopPropagation();
      openNodeTooltip(cell);
    });
  });

  // Close triggers
  if (btnCloseTooltip) {
    btnCloseTooltip.addEventListener('click', (e) => {
      e.stopPropagation();
      closeTooltip();
    });
  }

  function closeTooltip() {
    if (tooltip) {
      tooltip.classList.remove('active');
    }
    nodeCells.forEach(c => c.classList.remove('active-node'));
  }

  // Dismiss tooltip on clicking outside the table cells or tooltip card
  document.addEventListener('click', (e) => {
    if (tooltip && tooltip.classList.contains('active')) {
      if (!tooltip.contains(e.target) && !e.target.closest('.matrix-node-cell')) {
        closeTooltip();
      }
    }
  });

  // Open default tooltip node on load to populate details immediately
  if (nodeCells.length > 0) {
    // Open Priority-Team-Project node by default (Row 1, Column 5)
    const defaultNode = document.querySelector('[data-node="priority-team-project"]');
    if (defaultNode) {
      setTimeout(() => {
        openNodeTooltip(defaultNode);
      }, 500);
    }
  }


  // ==========================================
  // 4. Interactive Sliders - Decision Engine Math
  // ==========================================
  const sliderIntent = document.getElementById('slider-intent');
  const sliderLatency = document.getElementById('slider-latency');
  const sliderEntropy = document.getElementById('slider-entropy');

  const valIntent = document.getElementById('val-intent');
  const valLatency = document.getElementById('val-latency-input');
  const valEntropy = document.getElementById('val-entropy');

  const outCoherence = document.getElementById('out-coherence');
  const outRework = document.getElementById('out-rework');
  const outVelocity = document.getElementById('out-velocity');

  const graphCurve = document.getElementById('graph-curve');
  const graphTrackerDot = document.getElementById('graph-tracker-dot');
  const graphTrackerPulse = document.getElementById('graph-tracker-pulse');
  const svgMathEq = document.getElementById('svg-math-equation');

  function updateMathVisualizer() {
    if (!sliderIntent || !sliderLatency || !sliderEntropy) return;

    const intentVal = parseFloat(sliderIntent.value);
    const latencyVal = parseFloat(sliderLatency.value);
    const entropyVal = parseFloat(sliderEntropy.value) / 100;

    // Display labels update
    if (valIntent) valIntent.textContent = `${intentVal}°`;
    if (valLatency) valLatency.textContent = `${latencyVal}ms`;
    if (valEntropy) valEntropy.textContent = entropyVal.toFixed(2);

    // Dynamic output system equations calculations
    // Coherence decay decreases as stress scales
    const coherence = Math.max(0.12, 1.0 - (intentVal/90 * 0.4) - (latencyVal/100 * 0.35) - (entropyVal * 0.25));
    // Rework index increases exponentially as stress indicators rise
    const rework = ((intentVal/30 + 0.5) * (latencyVal/25) * (1.0 + entropyVal * 1.5)).toFixed(2);
    // Decision speed decay
    const velocity = Math.max(10, Math.round((1 - (latencyVal/100) * 0.8) * 100));

    if (outCoherence) {
      outCoherence.textContent = coherence.toFixed(2);
      if (coherence < 0.4) {
        outCoherence.style.color = 'var(--color-crimson)';
      } else {
        outCoherence.style.color = 'var(--color-blue-glow)';
      }
    }
    if (outRework) outRework.textContent = rework;
    if (outVelocity) outVelocity.textContent = `${velocity}%`;

    // Recalculate SVG graph path curve coordinate coordinates based on slider math parameters
    // Standard coordinates: start M 40 60, end 360 260. Q control point moves down depending on Latency & Entropy
    const curveControlY = 60 + (intentVal/90 * 180) + (entropyVal * 120);
    const finalCoherenceY = 260 - (coherence * 200); // Higher coherence curves upwards, lower scales downwards
    const dPath = `M 40 60 Q 200 ${curveControlY} 360 ${finalCoherenceY}`;
    
    if (graphCurve) {
      graphCurve.setAttribute('d', dPath);
    }

    // Move track coordinate dot along path center (estimate quadratic bezier at t=0.5)
    // Bezier math: B(t) = (1-t)^2*P0 + 2(1-t)*t*P1 + t^2*P2
    const t = 0.5;
    const x0 = 40, y0 = 60;
    const x1 = 200, y1 = curveControlY;
    const x2 = 360, y2 = finalCoherenceY;

    const dotX = (1-t)*(1-t)*x0 + 2*(1-t)*t*x1 + t*t*x2;
    const dotY = (1-t)*(1-t)*y0 + 2*(1-t)*t*y1 + t*t*y2;

    if (graphTrackerDot) {
      graphTrackerDot.setAttribute('cx', dotX);
      graphTrackerDot.setAttribute('cy', dotY);
    }
    if (graphTrackerPulse) {
      graphTrackerPulse.setAttribute('cx', dotX);
      graphTrackerPulse.setAttribute('cy', dotY);
    }

    // Update dynamic mathematical equation in SVG text overlay
    if (svgMathEq) {
      svgMathEq.textContent = `Ψ = θ · λ = ${( (intentVal/30) * (latencyVal/25) ).toFixed(2)}`;
    }
  }

  // Attach sliders listeners
  if (sliderIntent) sliderIntent.addEventListener('input', updateMathVisualizer);
  if (sliderLatency) sliderLatency.addEventListener('input', updateMathVisualizer);
  if (sliderEntropy) sliderEntropy.addEventListener('input', updateMathVisualizer);

  // Run initial calculator update
  updateMathVisualizer();

  // ==========================================
  // 5. Scroll Reveal IntersectionObserver
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(elem => {
    revealObserver.observe(elem);
  });

});
