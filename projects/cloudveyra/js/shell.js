(() => {
  const root = document.documentElement;
  const storageKey = 'cloudveyra-demo-preferences';
  const systemTheme = window.matchMedia('(prefers-color-scheme: light)');
  const defaults = { theme: 'dark', density: 'comfortable' };
  let preferences = { ...defaults };

  try {
    preferences = { ...defaults, ...JSON.parse(localStorage.getItem(storageKey) || '{}') };
  } catch (error) {
    preferences = { ...defaults };
  }

  const resolveTheme = () => preferences.theme === 'system'
    ? (systemTheme.matches ? 'light' : 'dark')
    : preferences.theme;

  const syncPreferenceControls = () => {
    document.querySelectorAll('[data-preference]').forEach(group => {
      const key = group.dataset.preference;
      group.querySelectorAll('button[data-value]').forEach(button => {
        const selected = button.dataset.value === preferences[key];
        button.classList.toggle('is-selected', selected);
        button.setAttribute('aria-pressed', String(selected));
      });
    });
  };

  const applyPreferences = (persist = false) => {
    root.dataset.theme = resolveTheme();
    root.dataset.density = preferences.density;
    root.style.colorScheme = resolveTheme();
    syncPreferenceControls();
    if (persist) localStorage.setItem(storageKey, JSON.stringify(preferences));
  };

  applyPreferences();
  systemTheme.addEventListener('change', () => preferences.theme === 'system' && applyPreferences());

  document.querySelectorAll('[data-preference]').forEach(group => {
    group.addEventListener('click', event => {
      const button = event.target.closest('button[data-value]');
      if (!button) return;
      preferences[group.dataset.preference] = button.dataset.value;
      applyPreferences(true);
      document.dispatchEvent(new CustomEvent('cloudveyra:preference-change', { detail: { ...preferences } }));
    });
  });

  const settingsDrawer = document.getElementById('settings-drawer');
  const settingsScrim = document.getElementById('settings-scrim');
  const settingsButtons = document.querySelectorAll('[data-open-settings]');
  const settingsClose = document.querySelector('[data-close-settings]');
  let settingsTrigger = null;

  const drawerFocusable = () => settingsDrawer
    ? [...settingsDrawer.querySelectorAll('button, a, input, select, [tabindex]:not([tabindex="-1"])')]
    : [];

  const setSettingsOpen = open => {
    if (!settingsDrawer || !settingsScrim) return;
    if (open) settingsTrigger = document.activeElement;
    settingsDrawer.classList.toggle('is-open', open);
    settingsScrim.classList.toggle('is-open', open);
    settingsDrawer.setAttribute('aria-hidden', String(!open));
    settingsButtons.forEach(button => button.setAttribute('aria-expanded', String(open)));
    document.body.classList.toggle('drawer-open', open);
    if (open) window.requestAnimationFrame(() => settingsClose?.focus());
    else settingsTrigger?.focus();
  };

  settingsButtons.forEach(button => button.addEventListener('click', () => setSettingsOpen(true)));
  settingsClose?.addEventListener('click', () => setSettingsOpen(false));
  settingsScrim?.addEventListener('click', () => setSettingsOpen(false));

  const sidebar = document.getElementById('sidebar');
  const sidebarScrim = document.getElementById('sidebar-scrim');
  const menuButton = document.querySelector('[data-menu-toggle]');

  const setMenuOpen = open => {
    if (!sidebar || !sidebarScrim || !menuButton) return;
    sidebar.classList.toggle('is-open', open);
    sidebarScrim.classList.toggle('is-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  };

  menuButton?.addEventListener('click', () => setMenuOpen(!sidebar.classList.contains('is-open')));
  sidebarScrim?.addEventListener('click', () => setMenuOpen(false));
  sidebar?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenuOpen(false)));

  const onKubernetesPage = window.location.pathname.endsWith('/kubernetes.html');
  const dashboardHref = section => onKubernetesPage ? `index.html#${section}` : `#${section}`;
  const commandMarkup = `
    <dialog class="command-menu" id="command-menu" aria-labelledby="command-menu-title">
      <div class="command-menu__surface">
        <div class="command-menu__search">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16 16 4 4"/></svg>
          <label class="sr-only" for="command-search">Search CloudVeyra navigation</label>
          <input id="command-search" type="search" placeholder="Where do you want to go?" autocomplete="off" aria-controls="command-results"/>
          <button class="command-menu__close" type="button" data-close-command aria-label="Close quick jump"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>
        </div>
        <h2 class="sr-only" id="command-menu-title">Quick jump</h2>
        <div class="command-menu__results" id="command-results">
          <div class="command-group">
            <span class="command-group__label">Explore CloudVeyra</span>
            <a class="command-item" href="${dashboardHref('overview')}" data-command-item data-command-search="overview dashboard home signals">
              <span class="command-item__icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13h6V4H4v9Zm0 7h6v-3H4v3Zm10 0h6v-9h-6v9Zm0-16v3h6V4h-6Z"/></svg></span>
              <span><strong>Overview</strong><small>Platform health and service topology</small></span><kbd>01</kbd>
            </a>
            <a class="command-item" href="${dashboardHref('resources')}" data-command-item data-command-search="resources infrastructure search azure">
              <span class="command-item__icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="m4.5 7.8 7.5 4.3 7.5-4.3M12 12.1V21"/></svg></span>
              <span><strong>Resources</strong><small>Search and inspect the Azure estate</small></span><kbd>02</kbd>
            </a>
            <a class="command-item" href="${dashboardHref('activity')}" data-command-item data-command-search="activity events changes timeline">
              <span class="command-item__icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V5M4 19h16M8 16v-5M12 16V7M16 16v-3M20 16V9"/></svg></span>
              <span><strong>Activity</strong><small>Changes, decisions, and architecture context</small></span><kbd>03</kbd>
            </a>
            <a class="command-item" href="kubernetes.html" data-command-item data-command-search="kubernetes aks pods scaling simulation">
              <span class="command-item__icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/><circle cx="12" cy="12" r="5"/></svg></span>
              <span><strong>AKS simulation</strong><small>Scale a workload and watch deployment events</small></span><kbd>04</kbd>
            </a>
          </div>
          <div class="command-group">
            <span class="command-group__label">Actions</span>
            <button class="command-item" type="button" data-command-item data-command-action="settings" data-command-search="settings preferences appearance density">
              <span class="command-item__icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h7M15 18h5"/><circle cx="16" cy="6" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="13" cy="18" r="2"/></svg></span>
              <span><strong>Preferences</strong><small>Change theme and interface density</small></span><kbd>↵</kbd>
            </button>
            <a class="command-item" href="../../index.html" data-command-item data-command-search="portfolio back shashank">
              <span class="command-item__icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
              <span><strong>Return to portfolio</strong><small>Continue exploring Shashank's work</small></span><kbd>↗</kbd>
            </a>
          </div>
          <p class="command-empty" data-command-empty>No matching destination. Try “resources” or “AKS”.</p>
        </div>
        <div class="command-menu__footer"><span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span><span><kbd>Enter</kbd> Open</span><span><kbd>Esc</kbd> Close</span></div>
      </div>
    </dialog>`;

  document.body.insertAdjacentHTML('beforeend', commandMarkup);

  const commandMenu = document.getElementById('command-menu');
  const commandInput = document.getElementById('command-search');
  const commandButtons = document.querySelectorAll('[data-open-command]');
  const commandClose = document.querySelector('[data-close-command]');
  const commandEmpty = document.querySelector('[data-command-empty]');
  const commandItems = [...document.querySelectorAll('[data-command-item]')];
  let selectedCommand = 0;

  const visibleCommands = () => commandItems.filter(item => !item.hidden);

  const selectCommand = index => {
    const visible = visibleCommands();
    if (!visible.length) return;
    selectedCommand = (index + visible.length) % visible.length;
    commandItems.forEach(item => item.classList.remove('is-selected'));
    visible[selectedCommand].classList.add('is-selected');
    visible[selectedCommand].scrollIntoView({ block: 'nearest' });
  };

  const filterCommands = query => {
    const normalized = query.trim().toLowerCase();
    const terms = normalized.split(/\s+/).filter(Boolean);
    commandItems.forEach(item => {
      item.hidden = terms.some(term => !item.dataset.commandSearch.includes(term));
    });
    document.querySelectorAll('.command-group').forEach(group => {
      group.hidden = !group.querySelector('[data-command-item]:not([hidden])');
    });
    commandEmpty.classList.toggle('is-visible', !visibleCommands().length);
    selectedCommand = 0;
    selectCommand(0);
  };

  const openCommandMenu = () => {
    if (!commandMenu.open) commandMenu.showModal();
    commandInput.value = '';
    filterCommands('');
    window.requestAnimationFrame(() => commandInput.focus());
  };

  commandButtons.forEach(button => button.addEventListener('click', openCommandMenu));
  commandClose.addEventListener('click', () => commandMenu.close());
  commandMenu.addEventListener('click', event => {
    if (event.target === commandMenu) commandMenu.close();
  });
  commandInput.addEventListener('input', () => filterCommands(commandInput.value));
  commandInput.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      selectCommand(selectedCommand + (event.key === 'ArrowDown' ? 1 : -1));
    }
    if (event.key === 'Enter') {
      const selected = visibleCommands()[selectedCommand];
      if (selected) {
        event.preventDefault();
        selected.click();
      }
    }
  });
  commandItems.forEach(item => {
    item.addEventListener('pointerenter', () => {
      const index = visibleCommands().indexOf(item);
      if (index >= 0) selectCommand(index);
    });
    item.addEventListener('click', () => {
      if (item.dataset.commandAction === 'settings') {
        commandMenu.close();
        window.requestAnimationFrame(() => setSettingsOpen(true));
      } else {
        commandMenu.close();
      }
    });
  });

  const shortcutLabel = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘ K' : 'Ctrl K';
  commandButtons.forEach(button => {
    const key = button.querySelector('kbd');
    if (key) key.textContent = shortcutLabel;
  });

  document.addEventListener('keydown', event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (commandMenu.open) commandMenu.close();
      else openCommandMenu();
      return;
    }

    if (event.key === 'Escape') {
      if (settingsDrawer?.classList.contains('is-open')) setSettingsOpen(false);
      else if (sidebar?.classList.contains('is-open')) setMenuOpen(false);
    }

    if (event.key === 'Tab' && settingsDrawer?.classList.contains('is-open')) {
      const focusable = drawerFocusable();
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  const revealElements = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(element => element.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
    revealElements.forEach(element => revealObserver.observe(element));
  }

  const sectionLinks = [...document.querySelectorAll('[data-section-link]')];
  const sections = sectionLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const sideNav = document.querySelector('.side-nav');
  const currentSectionLabel = document.querySelector('[data-current-section]');
  const pageProgress = document.querySelector('[data-page-progress]');

  const syncNavigationIndicator = () => {
    const activeLink = sideNav?.querySelector('a.is-active');
    if (!sideNav || !activeLink) return;
    sideNav.style.setProperty('--nav-y', `${activeLink.offsetTop}px`);
    sideNav.style.setProperty('--nav-h', `${activeLink.offsetHeight}px`);
    window.requestAnimationFrame(() => sideNav.classList.add('is-motion-ready'));
  };

  const setActiveSection = sectionId => {
    sectionLinks.forEach(link => {
      const active = link.getAttribute('href') === `#${sectionId}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    const activeLink = sectionLinks.find(link => link.classList.contains('is-active'));
    if (currentSectionLabel && activeLink) currentSectionLabel.textContent = activeLink.textContent.trim();
    syncNavigationIndicator();
  };

  let progressFrame = null;
  const updatePageProgress = () => {
    const maximum = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maximum > 0 ? Math.max(0, Math.min(1, window.scrollY / maximum)) : 1;
    pageProgress?.style.setProperty('--page-progress', progress.toFixed(4));
    progressFrame = null;
  };

  const schedulePageProgress = () => {
    if (!progressFrame) progressFrame = window.requestAnimationFrame(updatePageProgress);
  };

  if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        setActiveSection(entry.target.id);
      });
    }, { rootMargin: '-22% 0px -68% 0px', threshold: 0 });
    sections.forEach(section => sectionObserver.observe(section));
  }

  window.addEventListener('scroll', schedulePageProgress, { passive: true });
  window.addEventListener('resize', () => {
    syncNavigationIndicator();
    schedulePageProgress();
  }, { passive: true });
  syncNavigationIndicator();
  updatePageProgress();

  const parallaxElements = [...document.querySelectorAll('[data-depth]')];
  let targetScroll = window.scrollY;
  let renderedScroll = targetScroll;
  let parallaxFrame = null;

  const renderParallax = () => {
    renderedScroll += (targetScroll - renderedScroll) * 0.09;
    parallaxElements.forEach(element => {
      const depth = Number(element.dataset.depth || 0);
      const offset = Math.max(-120, Math.min(120, renderedScroll * depth));
      element.style.setProperty('--parallax-y', `${offset.toFixed(2)}px`);
    });

    if (Math.abs(targetScroll - renderedScroll) > 0.1) parallaxFrame = requestAnimationFrame(renderParallax);
    else parallaxFrame = null;
  };

  window.addEventListener('scroll', () => {
    targetScroll = window.scrollY;
    if (!parallaxFrame) parallaxFrame = requestAnimationFrame(renderParallax);
  }, { passive: true });

  // Give the dashboard surfaces their own restrained depth plane. This stays
  // separate from CSS transforms so reveal and hover interactions still work.
  const uiMotionState = new WeakMap();
  let uiLayers = [];
  let uiMotionFrame = null;
  let pointerX = window.innerWidth * 0.5;
  let pointerY = window.innerHeight * 0.5;
  let pointerActive = false;

  const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value));

  const scheduleUiMotion = () => {
    if (!uiMotionFrame) uiMotionFrame = requestAnimationFrame(renderUiMotion);
  };

  const bindSurfaceLens = element => {
    if (element.dataset.motionBound === 'true') return;
    element.dataset.motionBound = 'true';
    element.addEventListener('pointermove', event => {
      const bounds = element.getBoundingClientRect();
      const x = clamp(((event.clientX - bounds.left) / bounds.width) * 100, 0, 100);
      const y = clamp(((event.clientY - bounds.top) / bounds.height) * 100, 0, 100);
      element.style.setProperty('--surface-x', `${x.toFixed(1)}%`);
      element.style.setProperty('--surface-y', `${y.toFixed(1)}%`);
    });
    element.addEventListener('pointerleave', () => {
      element.style.setProperty('--surface-x', '50%');
      element.style.setProperty('--surface-y', '50%');
    });
  };

  const refreshUiMotion = () => {
    uiLayers = [...document.querySelectorAll('[data-ui-depth]')];
    uiLayers.forEach(element => {
      if (!uiMotionState.has(element)) uiMotionState.set(element, { x: 0, y: 0 });
      if (element.classList.contains('motion-surface')) bindSurfaceLens(element);
    });
    scheduleUiMotion();
  };

  function renderUiMotion() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const viewportX = pointerX / Math.max(viewportWidth, 1) - 0.5;
    const viewportY = pointerY / Math.max(viewportHeight, 1) - 0.5;
    const reads = uiLayers.map(element => ({
      element,
      bounds: element.getBoundingClientRect(),
      state: uiMotionState.get(element)
    }));
    let unsettled = false;

    reads.forEach(({ element, bounds, state }) => {
      const depth = Number(element.dataset.uiDepth || 0.03);
      const baseCenter = bounds.top + bounds.height * 0.5 - state.y;
      const inRange = bounds.bottom > -160 && bounds.top < viewportHeight + 160;
      const scrollShift = inRange ? clamp((viewportHeight * 0.5 - baseCenter) * depth, -22, 22) : 0;
      const pointerShiftX = pointerActive && inRange ? viewportX * depth * 170 : 0;
      const pointerShiftY = pointerActive && inRange ? viewportY * depth * 70 : 0;
      const targetX = pointerShiftX;
      const targetY = scrollShift + pointerShiftY;

      state.x += (targetX - state.x) * 0.12;
      state.y += (targetY - state.y) * 0.12;
      element.style.setProperty('--ui-shift-x', `${state.x.toFixed(2)}px`);
      element.style.setProperty('--ui-shift-y', `${state.y.toFixed(2)}px`);

      if (Math.abs(targetX - state.x) > 0.08 || Math.abs(targetY - state.y) > 0.08) unsettled = true;
    });

    uiMotionFrame = unsettled ? requestAnimationFrame(renderUiMotion) : null;
  }

  window.addEventListener('scroll', scheduleUiMotion, { passive: true });
  window.addEventListener('resize', scheduleUiMotion, { passive: true });
  window.addEventListener('pointermove', event => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    pointerActive = true;
    scheduleUiMotion();
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => {
    pointerActive = false;
    scheduleUiMotion();
  });
  document.addEventListener('cloudveyra:motion-refresh', refreshUiMotion);
  refreshUiMotion();

  const topology = document.querySelector('[data-topology]');
  if (topology) {
    let pointerFrame = null;
    topology.addEventListener('pointermove', event => {
      const bounds = topology.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
      if (pointerFrame) cancelAnimationFrame(pointerFrame);
      pointerFrame = requestAnimationFrame(() => {
        topology.style.setProperty('--pointer-x', x.toFixed(3));
        topology.style.setProperty('--pointer-y', y.toFixed(3));
      });
    });
    topology.addEventListener('pointerleave', () => {
      topology.style.setProperty('--pointer-x', '0');
      topology.style.setProperty('--pointer-y', '0');
    });
  }
})();
