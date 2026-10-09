const header = document.querySelector(".site-header");
const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
const sectionTargets = [document.querySelector("#top"), ...navLinks.map((link) => document.querySelector(link.getAttribute("href")))]
    .filter(Boolean);
const updateActiveLink = () => {
    let activeId = "top";
    const scrollPadding = Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const topOffset = Math.max((header?.getBoundingClientRect().height ?? 0) + 24, scrollPadding) + 1;

    sectionTargets.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= topOffset) {
            activeId = section.id;
        }
    });

    navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${activeId}`;
        link.classList.toggle("is-active", isActive);
        if (isActive) {
            link.setAttribute("aria-current", "location");
        } else {
            link.removeAttribute("aria-current");
        }
    });
};

if (sectionTargets.length) {
    updateActiveLink();
    window.addEventListener("scroll", updateActiveLink, { passive: true });
    window.addEventListener("resize", updateActiveLink);
}
