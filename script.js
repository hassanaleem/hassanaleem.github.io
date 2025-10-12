const menuBtn = document.getElementById('mobile-menu-button');
const menu = document.getElementById('mobile-menu');

if (menuBtn && menu) {
  menuBtn.addEventListener('click', () => {
    menu.classList.toggle('is-open');
    const open = menu.classList.contains('is-open');
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  // Close menu on link click
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => menu.classList.remove('is-open'));
  });
}
// === Active section highlight ===
(function () {
  // All sections you want to track
  const sections = Array.from(document.querySelectorAll('main .section[id]'));
  if (!sections.length) return;

  // All nav links (desktop + mobile) that point to a section hash
  const navLinks = Array.from(document.querySelectorAll('a[href^="#"]'))
    .filter(a => a.getAttribute('href').length > 1);

  // Map: sectionId -> [all matching links]
  const linkMap = new Map();
  navLinks.forEach(link => {
    const id = link.getAttribute('href').slice(1);
    if (!linkMap.has(id)) linkMap.set(id, []);
    linkMap.get(id).push(link);
  });

  const setActive = (id) => {
    // Clear all
    navLinks.forEach(a => a.classList.remove('is-active'));
    // Set for this id
    const targets = linkMap.get(id) || [];
    targets.forEach(a => a.classList.add('is-active'));
  };

  // IntersectionObserver to detect which section is in view
  // rootMargin shrinks/grows the "viewport" considered for activation
  const observer = new IntersectionObserver((entries) => {
    // Choose the most visible section
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (visible.length) {
      const id = visible[0].target.id;
      setActive(id);
      history.replaceState(null, "", `#${id}`); // optional: update URL hash
    }
  }, {
    root: null,
    rootMargin: "-35% 0px -50% 0px", // top/bottom offsets to trigger highlight near center
    threshold: [0.1, 0.25, 0.5, 0.75]
  });

  sections.forEach(s => observer.observe(s));

  // On initial load: highlight matching hash or first section
  const initialId = location.hash ? location.hash.slice(1) : sections[0].id;
  setActive(initialId);

  // When clicking a nav link, pre-highlight target (feels snappier)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const id = link.getAttribute('href').slice(1);
      setActive(id);
    });
  });
})();
