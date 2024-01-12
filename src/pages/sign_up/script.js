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

let firstName = document.getElementById("firstName");
let lastName = document.getElementById("lastName");


let username = document.getElementById("userName");
let password = document.getElementById("password");
let studentId = document.getElementById("studentId");
let fieldOfStudy = document.getElementById("fieldOfStudy");
let studentPassword = document.getElementById("studentPassword");
let confirmPassword = document.getElementById("confirmPassword");
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
        !firstName ||
        !lastName ||
        !username ||
        !password ||
        !studentId ||
        !fieldOfStudy ||
        !studentPassword ||
        !confirmPassword ||
        !schoolPassword ||
        !profilePic ||
        !securityQuestion
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
        "studentId": studentId.value,
        "schoolPassword": schoolPassword.value,
        "userpassword": password.value,
        "username": username.value,
        "securityQuestion": securityQuestion.value,
        "fullName": firstName.value + " " + lastName.value,
        "fieldOfStudy": fieldOfStudy.value,
        "profilePic": `${profilePic.value}`
    };
    console.log(userData);
   
    const response = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });
    const result = await response.json();
    console.log(result);
    // if (response.token ) {
    //     alert("User created successfully");
    //     const dataOnLocalStorage = {
    //         token: result.token,
    //         user: result.user
    //     }
    //     console.log(dataOnLocalStorage);
    // } else {
    //     alert("An error occurred while registering the user.");
};
submit.addEventListener("click", (e) => handleRegister(e));
