if (!localStorage.getItem("userData")) {
    window.location.href = "../../index.html";
  }
  
  document.addEventListener("DOMContentLoaded", function () {
    var navToggle = document.getElementById("nav-toggle") as HTMLElement;
    var navLinks = document.getElementById("nav-links") as HTMLElement;
    
    if (navToggle && navLinks) {
      navToggle.addEventListener("click", function () {
        navLinks.classList.toggle("hidden");
      });
    }
  });