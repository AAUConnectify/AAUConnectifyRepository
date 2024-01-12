
document.addEventListener('DOMContentLoaded', function () {
    var navToggle = document.getElementById('nav-toggle');
    var navLinks = document.getElementById('nav-links') as HTMLElement;
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            navLinks.classList.toggle('hidden');
        });
    }
});
