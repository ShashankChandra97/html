(() => {
  const podGrid = document.getElementById('pod-grid');
  const replicaOutput = document.getElementById('replica-output');
  const readyOutput = document.getElementById('ready-output');
  const consoleOutput = document.getElementById('console-output');
  const liveStatus = document.getElementById('scale-status');
  let target = 3;
  let current = 3;
  let pending = false;

  const podIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="m4.5 7.8 7.5 4.3 7.5-4.3M12 12.1V21"/></svg>';

  const timestamp = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const appendEvent = (message, tone = 'info') => {
    const line = document.createElement('div');
    line.className = 'console-line';
    line.innerHTML = `<time>${timestamp()}</time><span>${tone === 'success' ? '<strong>ready</strong>' : '<strong>event</strong>'} · ${message}</span>`;
    consoleOutput.prepend(line);
  };

  const render = () => {
    replicaOutput.value = target;
    replicaOutput.textContent = target;
    readyOutput.textContent = pending ? `${current} / ${target}` : `${current} / ${current}`;
    podGrid.innerHTML = Array.from({ length: Math.max(current, target) }, (_, index) => {
      const isPending = pending && index >= current;
      return `<div class="pod${isPending ? ' is-pending' : ''}" style="animation-delay:${index * 45}ms" title="Pod ${index + 1}: ${isPending ? 'Pending' : 'Running'}">${podIcon}</div>`;
    }).join('');
  };

  document.querySelector('[data-scale-down]').addEventListener('click', () => {
    target = Math.max(1, target - 1);
    render();
  });

  document.querySelector('[data-scale-up]').addEventListener('click', () => {
    target = Math.min(12, target + 1);
    render();
  });

  document.querySelector('[data-apply-scale]').addEventListener('click', () => {
    if (target === current || pending) {
      liveStatus.textContent = target === current ? `Deployment is already running ${current} replicas.` : 'A simulated rollout is already in progress.';
      return;
    }

    const previous = current;
    appendEvent(`Scale request accepted: ${previous} → ${target} replicas.`);
    liveStatus.textContent = `Applying simulated scale from ${previous} to ${target} replicas.`;

    if (target < current) {
      current = target;
      render();
      appendEvent(`Deployment stabilized at ${current} ready replicas.`, 'success');
      liveStatus.textContent = `Scale complete. ${current} replicas are ready.`;
      return;
    }

    pending = true;
    render();
    window.setTimeout(() => {
      current = target;
      pending = false;
      render();
      appendEvent(`Deployment stabilized at ${current} ready replicas.`, 'success');
      liveStatus.textContent = `Scale complete. ${current} replicas are ready.`;
    }, 1200);
  });

  appendEvent('Telemetry stream initialized for deployment/jarvis-ai-api.', 'success');
  appendEvent('Horizontal pod autoscaler policy loaded: min 1, max 12.');
  render();
})();
