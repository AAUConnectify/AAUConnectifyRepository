if (!localStorage.getItem("userData")) {
  window.location.href = "../../index.html";
}

const navToggler = document.getElementById("toggler");
const navMenu = document.getElementById("nav-menu");
const cancel = document.getElementById("cancel");

navToggler.addEventListener("click", () => {
  navMenu.classList.toggle("hidden");
  navToggler.classList.toggle("hidden");
  cancel.classList.toggle("hidden");
});
cancel.addEventListener("click", () => {
  navMenu.classList.toggle("hidden");
  navToggler.classList.toggle("hidden");
  cancel.classList.toggle("hidden");
});

// fetch All Announcemtnts
// like announcement

const userData = JSON.parse(localStorage.getItem("userData"));

const isAdmin = userData.role == "admin";
console.log(isAdmin);
const announcementForm = document.getElementById("announcement-form");
const announcementContainer = document.getElementById("announcement-container");

if (isAdmin) {
  fetchAdminAnnouncements();
} else {
  document.getElementById("admin-form").style.display = "none";
  fetchUserAnnouncements();
}

function fetchAdminAnnouncements() {
  fetch("http://localhost:5011/api/announcement/list", {
    headers: {
      Authorization: `Bearer ${userData.token}`,
    },
  })
    .then((response) => response.json())
    .then((announcements) => {
      console.log(announcements);
      announcements.forEach((announcement) => {
        const announcementCard = createAdminAnnouncementCard(announcement);
        announcementContainer.appendChild(announcementCard);
      });
    })
    .catch((error) => console.error("Error fetching announcements:", error));
}

function fetchUserAnnouncements() {
  fetch("http://localhost:5011/api/announcement/list", {
    headers: {
      Authorization: `Bearer ${userData.token}`,
    },
  })
    .then((response) => response.json())
    .then((announcements) => {
      console.log(announcements);
      announcements.forEach((announcement) => {
        const announcementCard = createUserAnnouncementCard(announcement);
        announcementContainer.appendChild(announcementCard);
      });
    })
    .catch((error) => console.error("Error fetching announcements:", error));
}

function createAdminAnnouncementCard(announcement) {
  const card = document.createElement("div");
  card.className =
    "bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-8 rounded-lg shadow-lg my-3";

  card.innerHTML = `
            <h2 class="text-3xl font-semibold mb-2">${announcement.title}</h2>
            <p class="text-gray-300 mb-4">Date:</p>
            // announcement.annProfile.length > 0 && announcement.annProfile 
            <img src=${
              announcement.annProfile &&
              announcement.annProfile.length > 0 &&
              announcement.annProfile
            } alt="Announcement Image" class="w-full h-auto mb-4">
            <p class="mb-4">${announcement.content}</p>
            <p class="bg-white w-24 text-blue-500 px-4 py-2 mb-2 rounded-md hover:bg-cyan-500 hover:text-white transition duration-300 ml-4" onclick="updateAnnouncement('${
              announcement._id
            }')"> Update </p>
            <p class="bg-white w-24 text-red-500 px-4 py-2 rounded-md mb-2 hover:bg-red-700 hover:text-white transition duration-300 ml-4" onclick="deleteAnnouncement('${
              announcement._id
            }')"> Delete </p>
            <p id="like-${
              announcement._id
            }" class="bg-white w-24 text-blue-500 px-4 py-2 rounded-md hover:bg-cyan-500 hover:text-white transition duration-300 ml-4" onclick="likeAnnouncement('${
    announcement._id
  }')"> Like </p>
        `;

  return card;
}

function createUserAnnouncementCard(announcement) {
  const card = document.createElement("div");
  card.className =
    "bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-8 rounded-lg shadow-lg my-3";

  card.innerHTML = `
            <h2 class="text-3xl font-semibold mb-2">${announcement.title}</h2>
            <p class="text-gray-300 mb-4">Date:</p>
            //   announcement.annProfile.length > 0 && announcement.annProfile
            <img src=${
              announcement.annProfile &&
              announcement.annProfile.length > 0 &&
              announcement.annProfile
            } alt="Announcement Image" class="w-full h-auto mb-4">
            <p class="mb-4">${announcement.content}</p>
            <p id="like-${
              announcement._id
            }" class="bg-white w-24 text-blue-500 px-4 py-2 rounded-md hover:bg-cyan-500 hover:text-white transition duration-300 ml-4" onclick="likeAnnouncement('${
    announcement._id
  }')"> Like </p>
        `;

  return card;
}

function likeAnnouncement(announcementId) {
  const likeParagraph = document.getElementById(`like-${announcementId}`);
  const userId = userData._id;

  fetch(`http://localhost:5011/api/announcements/${announcementId}/like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userData.token}`,
    },
    body: JSON.stringify({ id: userId }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Like successful:", data);
      likeParagraph.style.backgroundColor = "green";
      likeParagraph.style.color = "white";
    })
    .catch((error) => console.error("Error liking announcement:", error));
}

function updateAnnouncement(announcementId) {
  const updatedTitle = prompt("Enter updated title:");
  const updatedContent = prompt("Enter updated content:");
  const updatedImageUrl = prompt("Enter updated image URL:");

  fetch(`http://localhost:5011/api/announcement/update/${announcementId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userData.token}`,
    },
    body: JSON.stringify({
      title: updatedTitle,
      content: updatedContent,
      annProfile: updatedImageUrl,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Update successful:", data);
      // Refresh announcements after update
      announcementContainer.innerHTML = "";
      fetchAdminAnnouncements();
    })
    .catch((error) => console.error("Error updating announcement:", error));
}

function deleteAnnouncement(announcementId) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this announcement?"
  );

  if (confirmDelete) {
    fetch(`http://localhost:5011/api/announcement/delete/${announcementId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Delete successful:", data);
        // Refresh announcements after delete
        announcementContainer.innerHTML = "";
        fetchAdminAnnouncements();
      })
      .catch((error) => console.error("Error deleting announcement:", error));
  }
}

announcementForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = document.getElementById("announcement-title").value;
  const content = document.getElementById("announcement-desc").value;
  const imageUrl = document.getElementById("imageURL").value;

  fetch("http://localhost:5011/api/announcement/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userData.token}`,
    },
    body: JSON.stringify({
      title: title,
      content: content,
      annProfile: imageUrl,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Announcement created successfully:", data);
      // Refresh announcements after creating a new one
      announcementContainer.innerHTML = "";
      fetchAdminAnnouncements();
    })
    .catch((error) => console.error("Error creating announcement:", error));
});
