// get data from the local storage
// check the existance of the data on the local storage
if (!localStorage.getItem('userData')) {
  window.location.href = "../../index.html";
}

const dataOnLocalStorage = JSON.parse(localStorage.getItem('userData'));
// 


const profile_body = document.getElementById('profile_body');
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
  `<p class="text-lg font-semibold">${dataOnLocalStorage.userId}</p>` +
  `</div>` +

  `<div class="mb-4">` +
  `<label class="block text-gray-600">User Name:</label>` +
  `<p class="text-lg font-semibold">${dataOnLocalStorage.username}</p>` +
  `</div>` +

  `<div class="mb-4">` +
  `<label class="block text-gray-600">Full Name:</label>` +
  `<p class="text-lg font-semibold">${dataOnLocalStorage.fullName}</p>` +
  `</div>` +

  `<div class="mb-4">` +
  `<label class="block text-gray-600">Field of Study:</label>` +
  `<p class="text-lg font-semibold">${dataOnLocalStorage.fieldOfStudy}</p>` +
  `</div>` +

  `<!-- Right Column - Profile Picture -->` +
  `<div class="col-span-2 md:col-span-1">` +
  `<label class="block text-gray-600">Profile Picture:</label>` +
  `<img src="${dataOnLocalStorage.profilePic}" alt="Profile Picture" class="w-32 h-32 rounded-full object-cover" />` +
  `</div>` +
  `</div>` +

  `<!-- Update Button -->` +
  `<button id = "update_pro" onClick = "handleUpdateProfile" class="mt-8 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800">` +
  `Update Profile` +
  `</button>` +
  `    <button id = "log_out" class="mt-8 px-4 py-2 bg-red-400  text-white rounded-md hover:bg-red-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800" >Log Out</button>` +

  `</div>`;

profile_body.innerHTML = profile_body.innerHTML = html;


const log_out = document.getElementById('log_out');
log_out.addEventListener('click', function () {
  if (confirm('Are you sure you want to log out?')) {
    localStorage.removeItem('userData');
    window.location.href = "../../index.html";
  };


});

let update_form = `<div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-md shadow-md">` +
  `<h1 class="text-2xl font-semibold mb-6">User Profile Form</h1>` +

  `<form>` +
  `<!-- Username -->` +
  `<div class="mb-4">` +
  `<label for="username" class="block text-gray-700 text-sm font-bold mb-2">Username</label>` +
  `<input type="text" id="username" name="username" class="w-full px-3 py-2 border rounded-md outline-none" placeholder="Enter your username" required>` +
  `</div>` +

  `<!-- Full Name (First and Last) -->` +
  `<div class="grid grid-cols-2 gap-4">` +
  `<div class="mb-4">` +
  `<label for="firstName" class="block text-gray-700 text-sm font-bold mb-2">First Name</label>` +
  `<input type="text" id="firstName" name="firstName" class="w-full px-3 py-2 border rounded-md outline-none" placeholder="Enter your first name" required>` +
  `</div>` +

  `<div class="mb-4">` +
  `<label for="lastName" class="block text-gray-700 text-sm font-bold mb-2">Last Name</label>` +
  `<input type="text" id="lastName" name="lastName" class="w-full px-3 py-2 border rounded-md outline-none" placeholder="Enter your last name" required>` +
  `</div>` +
  `</div>` +

  `<!-- Field of Study -->` +
  `<div class="mb-4">` +
  `<label for="fieldOfStudy" class="block text-gray-700 text-sm font-bold mb-2">Field of Study</label>` +
  `<input type="text" id="fieldOfStudy" name="fieldOfStudy" class="w-full px-3 py-2 border rounded-md outline-none" placeholder="Enter your field of study" required>` +
  `</div>` +

  `<!-- Profile Picture -->` +
  `<div class="mb-4">` +
  `<label for="profilePic" class="block text-gray-700 text-sm font-bold mb-2">Profile Picture</label>` +
  `<input type="file" id="profilePic" name="profilePic" accept="image/*" class="w-full px-3 py-2 border rounded-md outline-none" required>` +
  `</div>` +

  `<!-- Submit Button -->` +
  `<button type="submit" id ="submit_form" class="bg-blue-500 text-white px-4  py-2 rounded-md hover:bg-blue-600 transition">Submit</button>` +
  `</form>` +
  `</div>`;

//UPDATE PROFILE
const handleUpdateProfile = () => {
  if (confirm("Are you sure you want to update your profile?")) {


    const form = document.createElement("div");


    form.innerHTML = update_form;
    document.body.appendChild(form);
    console.log(form)

    // put the form in the middle of the screen with absolute positioning
    form.style.position = "absolute";
    form.style.top = "70%";
    form.style.left = "50%";
    form.style.transform = "translate(-50%, -50%)";
    form.style.zIndex = 1000;
    // submit the form data
    const submit_form = document.getElementById("submit_form");
    console.log(submit_form);
    submit_form.addEventListener("click", async (e) => {

      e.preventDefault();
      let username = document.getElementById("username");
      let firstName = document.getElementById("firstName");
      let lastName = document.getElementById("lastName");
      let fieldOfStudy = document.getElementById("fieldOfStudy");
      let profilePic = document.getElementById("profilePic");
      console.log(username.value, firstName.value, lastName.value, fieldOfStudy.value, profilePic.value)
      if (!username.value || !firstName.value || !lastName.value || !fieldOfStudy.value || !profilePic.value) {
        alert("Please enter all the data");
        return;
      }
      let userData = {
        username: username.value,
        fullName: firstName.value + " " + lastName.value,
        fieldOfStudy: fieldOfStudy.value,
        profilePic: `${profilePic.value}`,
      };

      username.value = "";
      firstName.value = "";
      lastName.value = "";
      fieldOfStudy.value = "";
      profilePic.value = "";
      // send the data to the server  
      console.log(userData);
      const response = await fetch("http://localhost:5011/api/auth/update-profile", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${dataOnLocalStorage.token}`,
        },
        body: JSON.stringify(userData),
      });
      console.log(response)

      const result = await response.json();
      if (result.username) {
        alert("Profile Updated");
        console.log(result);
        //update the local storage
        dataOnLocalStorage.username = result.username;
        dataOnLocalStorage.fullName = result.fullName;
        dataOnLocalStorage.fieldOfStudy = result.fieldOfStudy;
        dataOnLocalStorage.profilePic = result.profilePic;
        localStorage.setItem('userData', JSON.stringify(dataOnLocalStorage));
        //remove the form

        //update the html
        //refresh the page
        window.location.href = "./profile.html";
      }
      else {
        alert(result.message);
      }
      //save the data on the local storage

      form.remove();
    });
  }
  else {
    return;
  }




};


const update_pro = document.getElementById('update_pro');
update_pro.addEventListener('click', handleUpdateProfile);






