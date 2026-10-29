(() => {
  'use strict';
  const key = 'shashank-portfolio-notice';
  const version = '2026-10-12.1';
  function initialize() {
    if (document.getElementById('site-notice-dialog')) return;
    const dialog = document.createElement('dialog');
    dialog.id = 'site-notice-dialog';
    dialog.setAttribute('aria-labelledby', 'site-notice-title');
    dialog.innerHTML = `
      <p class="notice-eyebrow">Before you explore · Updated October 12, 2026</p>
      <h1 id="site-notice-title" tabindex="-1">Site terms &amp; privacy notice</h1>
      <p>Welcome to Shashank Chandra’s personal portfolio. Please read these terms and the privacy notice before continuing.</p>
      <h2>Using this site</h2>
      <p>This portfolio and its demos are provided for information and illustration, as available, without a promise of accuracy, uptime, or suitability for your needs. CloudVeyra uses sample telemetry and local simulations. Some images are generated editorial concepts; employer scenes and decorative certification medals are not official photographs or credential documents.</p>
      <p>Use the site lawfully. Do not attempt unauthorized access or interfere with its operation. Portfolio materials and third-party brands remain subject to their owners’ rights. Viewing this site does not grant permission to reuse protected material beyond applicable licenses or legal rights. External sites have their own terms and privacy practices.</p>
      <h2>Your privacy</h2>
      <p>The owner does not operate visitor analytics, accounts, or a form that collects visitor data on this portfolio. GitHub Pages logs visitor IP addresses for security. Some demo pages request Google Fonts, which sends your IP address to Google to deliver fonts. Hosting and font requests may occur before you choose an option.</p>
      <p>Demo preferences and your acceptance of this notice are saved only in this browser using local storage. Acceptance is not sent to the owner. Clear this site’s browser storage to remove it. If storage is unavailable, you may be asked again on another visit.</p>
      <p>Read <a href="https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection" target="_blank" rel="noopener noreferrer">GitHub Pages’ data collection information</a> and <a href="https://fonts.googleblog.com/2022/11/your-privacy-and-google-fonts.html" target="_blank" rel="noopener noreferrer">Google Fonts’ privacy information</a>. If you email the owner, your email and its contents are received through the email provider.</p>
      <p>Questions: <a href="mailto:shashankchandra97@gmail.com">shashankchandra97@gmail.com</a>.</p>
      <p>By choosing “Agree and continue,” you agree to the site terms and acknowledge this privacy notice. This does not waive your statutory rights.</p>
      <div class="notice-actions"><button type="button" class="notice-accept">Agree and continue</button><button type="button" class="notice-exit">Exit site</button></div>`;
    document.body.append(dialog);
    const reopen = document.createElement('button');
    reopen.id = 'site-notice-reopen';
    reopen.type = 'button';
    reopen.textContent = 'Terms & privacy';
    document.body.append(reopen);
    let returnFocus = null;
    function open() {
      returnFocus = document.activeElement;
      dialog.showModal();
      dialog.querySelector('#site-notice-title').focus();
      dialog.scrollTop = 0;
    }
    function exit() {
      try { localStorage.removeItem(key); } catch { /* Browser storage is optional. */ }
      window.location.replace('about:blank');
    }
    dialog.querySelector('.notice-accept').addEventListener('click', () => {
      try { localStorage.setItem(key, version); } catch { /* Continue for this document. */ }
      document.documentElement.setAttribute('data-site-notice-accepted', version);
      dialog.close();
      if (returnFocus instanceof HTMLElement && returnFocus !== document.body) returnFocus.focus();
      else { const main = document.querySelector('main'); if (main) { main.setAttribute('tabindex', '-1'); main.focus(); } }
    });
    dialog.querySelector('.notice-exit').addEventListener('click', exit);
    dialog.addEventListener('cancel', event => {
      if (!document.documentElement.hasAttribute('data-site-notice-accepted')) {
        event.preventDefault();
        dialog.querySelector('.notice-exit').focus();
      }
    });
    reopen.addEventListener('click', open);
    let accepted = false;
    try { accepted = localStorage.getItem(key) === version; } catch { /* Show the notice. */ }
    if (accepted) document.documentElement.setAttribute('data-site-notice-accepted', version);
    else open();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();
