(() => {
  const project = window.cloudVeyraDemo.project;
  const grid = document.getElementById('resource-grid');
  const search = document.getElementById('resource-search');
  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const resultCount = document.getElementById('resource-count');
  const activityList = document.getElementById('activity-list');
  const resourceDialog = document.getElementById('resource-dialog');
  const dialogContent = document.getElementById('resource-dialog-content');
  let activeFilter = 'all';

  const icons = {
    cluster: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h10v10H7z"/><path d="M4 9V5a1 1 0 0 1 1-1h4M15 4h4a1 1 0 0 1 1 1v4M20 15v4a1 1 0 0 1-1 1h-4M9 20H5a1 1 0 0 1-1-1v-4M10 10h4v4h-4z"/></svg>',
    container: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="m4.5 7.8 7.5 4.3 7.5-4.3M12 12.1V21"/></svg>',
    shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 5 6v5c0 4.8 2.7 8 7 10 4.3-2 7-5.2 7-10V6l-7-3Z"/><path d="m9.5 12 1.7 1.7 3.6-4"/></svg>',
    database: '<svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/></svg>'
  };

  const makeSparkline = points => {
    const max = Math.max(...points);
    const min = Math.min(...points);
    const range = max - min || 1;
    const coordinates = points.map((point, index) => {
      const x = (index / (points.length - 1)) * 120;
      const y = 38 - ((point - min) / range) * 30;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
    return `<svg class="sparkline" viewBox="0 0 120 44" role="img" aria-label="Recent ${points.length}-point metric trend"><polyline points="${coordinates}"/></svg>`;
  };

  const resourceCard = (resource, index) => `
    <article class="resource-card motion-surface" data-resource-id="${resource.id}" data-reveal data-ui-depth="${(0.034 + (index % 2) * 0.018).toFixed(3)}">
      <div class="resource-card__top">
        <div class="resource-identity">
          <span class="resource-icon">${icons[resource.icon]}</span>
          <span>
            <span class="resource-name">${resource.name}</span>
            <span class="resource-type">${resource.type}</span>
          </span>
        </div>
        <span class="health-badge"><span></span>${resource.status}</span>
      </div>
      <div class="resource-metric">
        <div>
          <span class="metric-label">${resource.metricLabel}</span>
          <strong>${resource.metricValue}</strong>
          <span class="metric-trend">${resource.metricTrend}</span>
        </div>
        ${makeSparkline(resource.points)}
      </div>
      <div class="resource-meta">
        <span>${resource.region}</span>
        <span>${resource.sku}</span>
        <span>${resource.latency ? `${resource.latency} ms` : 'Policy managed'}</span>
      </div>
      <button class="resource-action" type="button" data-inspect="${resource.id}">
        Inspect resource
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
      </button>
    </article>`;

  const visibleResources = () => {
    const query = search.value.trim().toLowerCase();
    return project.resources.filter(resource => {
      const matchesFilter = activeFilter === 'all' || resource.category === activeFilter;
      const matchesQuery = !query || [resource.name, resource.type, resource.region, ...resource.tags]
        .join(' ').toLowerCase().includes(query);
      return matchesFilter && matchesQuery;
    });
  };

  const renderResources = () => {
    const resources = visibleResources();
    resultCount.textContent = `${resources.length} resource${resources.length === 1 ? '' : 's'}`;
    grid.innerHTML = resources.length
      ? resources.map(resourceCard).join('')
      : '<div class="empty-state"><strong>No resources found</strong><span>Try a different search or filter.</span></div>';
    requestAnimationFrame(() => grid.querySelectorAll('[data-reveal]').forEach((card, index) => {
      card.style.setProperty('--reveal-delay', `${Math.min(index * 55, 180)}ms`);
      card.classList.add('is-visible');
    }));
    document.dispatchEvent(new CustomEvent('cloudveyra:motion-refresh'));
  };

  filterButtons.forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach(item => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    renderResources();
  }));

  search.addEventListener('input', renderResources);

  grid.addEventListener('click', event => {
    const button = event.target.closest('[data-inspect]');
    if (!button) return;
    const resource = project.resources.find(item => item.id === button.dataset.inspect);
    if (!resource) return;
    dialogContent.innerHTML = `
      <div class="dialog-resource-head">
        <span class="resource-icon resource-icon--large">${icons[resource.icon]}</span>
        <div><span class="dialog-kicker">${resource.type}</span><h2 id="resource-dialog-title">${resource.name}</h2></div>
      </div>
      <p>${resource.description}</p>
      <div class="dialog-stats">
        <div><span>Region</span><strong>${resource.region}</strong></div>
        <div><span>Configuration</span><strong>${resource.sku}</strong></div>
        <div><span>${resource.metricLabel}</span><strong>${resource.metricValue}</strong></div>
      </div>
      <div class="tag-row">${resource.tags.map(tag => `<span>${tag}</span>`).join('')}</div>`;
    resourceDialog.showModal();
  });

  resourceDialog.addEventListener('click', event => {
    if (event.target === resourceDialog) resourceDialog.close();
  });
  document.querySelector('[data-close-resource]')?.addEventListener('click', () => resourceDialog.close());

  activityList.innerHTML = project.activity.map(item => `
    <li>
      <span class="activity-marker activity-marker--${item.tone}"></span>
      <div><strong>${item.title}</strong><p>${item.detail}</p></div>
      <time>${item.time}</time>
    </li>`).join('');

  renderResources();
})();
