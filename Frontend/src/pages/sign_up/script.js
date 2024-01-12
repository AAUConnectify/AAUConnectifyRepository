// **POST /register**

// ### Request Body

// ```json
// {
//   "studentId": "string",
//   "schoolPassword": "string",
//   "userpassword": "string",
//   "username": "string",
//   "securityQuestion": "string",
//   "fullName": "string",
//   "fieldOfStudy": "string",
//   "profilePic": "string"
// };
// ```

if (localStorage.getItem("userData")) {
  window.location.href = "../Home/home.html";
}

let firstName = document.getElementById("firstName");
let lastName = document.getElementById("lastName");

let username = document.getElementById("userName");
let password = document.getElementById("password");
let studentId = document.getElementById("studentId");
let fieldOfStudy = document.getElementById("fieldOfStudy");
let studentPassword = document.getElementById("studentPassword");
let schoolPassword = document.getElementById("studentPassword");
// take the profile pic
let profilePic = document.getElementById("profilePic");
// take the security question
let securityQuestion = document.getElementById("securityQuestion");
// submit the form
let submit = document.getElementById("submit");
//log all the data with name and value

const handleRegister = async (e) => {
  e.preventDefault();

  if (
    !firstName.value ||
    !lastName.value ||
    !username.value ||
    !password.value ||
    !studentId.value ||
    !fieldOfStudy.value ||
    !studentPassword.value ||
    !confirmPassword.value ||
    !schoolPassword.value ||
    !profilePic.value ||
    !securityQuestion.value
  ) {
    alert("Please enter all the data");
    return;
  }
  if (password.value != confirmPassword.value) {
    alert("Passwords don't match");
    return;
  }

  // {
  //   "studentId": "string",
  //   "schoolPassword": "string",
  //   "userpassword": "string",
  //   "username": "string",
  //   "securityQuestion": "string",
  //   "fullName": "string",
  //   "fieldOfStudy": "string",
  //   "profilePic": "string"
  // };

  let userData = {
    studentId: studentId.value,
    schoolPassword: schoolPassword.value,
    userpassword: password.value,
    username: username.value,
    securityQuestion: securityQuestion.value,
    fullName: firstName.value + " " + lastName.value,
    fieldOfStudy: fieldOfStudy.value,
    profilePic: `${profilePic.value}`,
  };
  console.log(userData);

  studentId.value = "";
  confirmPassword.value = "";
  password.value = "";
  username.value = "";
  securityQuestion.value = "";
  firstName.value = "";
  lastName.value = "";
  fieldOfStudy.value = "";
  profilePic.value = "";
  studentPassword.value = "";
  firstName.value = "";
  lastName.value = "";
  const response = await fetch("http://localhost:5011/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  const result = await response.json();
  if (result.token) {
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
    localStorage.setItem("userData", JSON.stringify(dataOnLocalStorage));
    window.location.href = "../Home/home.html";
  } else {
    alert(result.message);
  }
};
submit.addEventListener("click", (e) => handleRegister(e));
