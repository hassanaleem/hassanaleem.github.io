const nav = document.querySelector(".site-nav");
const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const sectionTargets = [document.querySelector("#top"), ...navLinks.map((link) => document.querySelector(link.getAttribute("href")))]
    .filter(Boolean);
const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        document.body.classList.remove("nav-open");
    });
});

const updateActiveLink = () => {
    let activeId = "top";

    sectionTargets.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 130) {
            activeId = section.id;
        }
    });

    navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${activeId}`);
    });
};

if (sectionTargets.length) {
    updateActiveLink();
    window.addEventListener("scroll", updateActiveLink, { passive: true });
}
