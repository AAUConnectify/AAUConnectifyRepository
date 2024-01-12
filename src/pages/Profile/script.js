// get data from the local storage
// check the existance of the data on the local storage
if (!localStorage.getItem('userData')) {
    window.location.href = "../../index.html";
}

const dataOnLocalStorage = JSON.parse(localStorage.getItem('userData'));
// 


const profile_body =  document.getElementById('profile_body');
/* 
const dataOnLocalStorage = {
            token: result.token,
            username: result.user.username,
            userId: result.user.userId,
            role: result.user.role,
            email: result.user.email,
            fullName: result.user.fullName,
            fieldOfStudy: result.user.fieldOfStudy,
            profilePic: result.user.profilePic,
            
        };

*/



let html = `<div class="container mx-auto p-8 mt-8 bg-white shadow-md rounded-md">` +
    `<h1 class="text-3xl font-bold mb-6">User Profile</h1>` +

    `<!-- User Information Section -->` +
    `<div class="grid grid-cols-1 md:grid-cols-2 gap-6">` +
      `<!-- Left Column - User Details -->` +
      `<div class="mb-4">` +
        `<label class="block text-gray-600">User ID:</label>` +
        `<p class="text-lg font-semibold">{dataOnLocalStorage.userId}</p>` +
      `</div>` +

      `<div class="mb-4">` +
        `<label class="block text-gray-600">User Name:</label>` +
        `<p class="text-lg font-semibold">{dataOnLocalStorage.username}</p>` +
      `</div>` +

      `<div class="mb-4">` +
        `<label class="block text-gray-600">Full Name:</label>` +
        `<p class="text-lg font-semibold">{dataOnLocalStorage.fullName}</p>` +
      `</div>` +

      `<div class="mb-4">` +
        `<label class="block text-gray-600">Field of Study:</label>` +
        `<p class="text-lg font-semibold">{dataOnLocalStorage.fieldOfStudy}</p>` +
      `</div>` +

      `<!-- Right Column - Profile Picture -->` +
      `<div class="col-span-2 md:col-span-1">` +
        `<label class="block text-gray-600">Profile Picture:</label>` +
        `<img src="{dataOnLocalStorage.profilePic}" alt="Profile Picture" class="w-32 h-32 rounded-full object-cover" />` +
      `</div>` +
    `</div>` +

    `<!-- Update Button -->` +
    `<button class="mt-8 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800">` +
      `Update Profile` +
    `</button>` +
  `</div>`;

  profile_body.innerHTML = profile_body.innerHTML = html;

