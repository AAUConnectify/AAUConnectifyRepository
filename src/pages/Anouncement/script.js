if (!localStorage.getItem("userData")) {
  window.location.href = "../sign_up/index.html";
}
document.addEventListener("DOMContentLoaded", function () {
  var navToggle = document.getElementById("nav-toggle");
  var navLinks = document.getElementById("nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      navLinks.classList.toggle("hidden");
    });
  }
});
