if (localStorage.getItem("userData")) {
    window.location.href = "../Home/home.html";
  }
  
  let firstName = document.getElementById("firstName") as HTMLInputElement;
  let lastName = document.getElementById("lastName") as HTMLInputElement;
  
  let username = document.getElementById("userName") as HTMLInputElement;
  let password = document.getElementById("password") as HTMLInputElement;
  let studentId = document.getElementById("studentId") as HTMLInputElement;
  let fieldOfStudy = document.getElementById("fieldOfStudy") as HTMLInputElement;
  let studentPassword = document.getElementById("studentPassword") as HTMLInputElement;
  let schoolPassword = document.getElementById("studentPassword") as HTMLInputElement;
  let profilePic = document.getElementById("profilePic") as HTMLInputElement;
  let securityQuestion = document.getElementById("securityQuestion") as HTMLInputElement;
  let submit = document.getElementById("submit") as HTMLButtonElement;
  
  interface UserData {
    studentId: string;
    schoolPassword: string;
    userpassword: string;
    username: string;
    securityQuestion: string;
    fullName: string;
    fieldOfStudy: string;
    profilePic: string;
  }
  
  const handleRegister = async (e: Event) => {
    e.preventDefault();
  
    if (
      !firstName.value ||
      !lastName.value ||
      !username.value ||
      !password.value ||
      !studentId.value ||
      !fieldOfStudy.value ||
      !studentPassword.value ||
      !schoolPassword.value ||
      !profilePic.value ||
      !securityQuestion.value
    ) {
      alert("Please enter all the data");
      return;
    }
  
    let userData: UserData = {
      studentId: studentId.value,
      schoolPassword: schoolPassword.value,
      userpassword: password.value,
      username: username.value,
      securityQuestion: securityQuestion.value,
      fullName: firstName.value + " " + lastName.value,
      fieldOfStudy: fieldOfStudy.value,
      profilePic: `${profilePic.value}`,
    };
  
    studentId.value = "";
    password.value = "";
    username.value = "";
    securityQuestion.value = "";
    firstName.value = "";
    lastName.value = "";
    fieldOfStudy.value = "";
    profilePic.value = "";
    studentPassword.value = "";
  
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