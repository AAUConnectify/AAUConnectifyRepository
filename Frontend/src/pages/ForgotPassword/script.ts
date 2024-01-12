const username = document.getElementById("username") as HTMLInputElement;
const Ans = document.getElementById("securityQuestionAnswer") as HTMLInputElement;
const pass = document.getElementById("newPassword") as HTMLInputElement;
const resetBtn = document.getElementById("reset-btn") as HTMLButtonElement;

if (localStorage.getItem("userData")) {
  window.location.href = "../Home/home.html";
}

interface FormData {
  username: string;
  securityQuestionAnswer: string;
  newPassword: string;
}

const resetPassword = async (e: Event) => {
  e.preventDefault();
  if (!username.value || !pass.value || !Ans.value) {
    alert("Please fill the Fields");
    return;
  }
  const formData: FormData = {
    username: username.value,
    securityQuestionAnswer: Ans.value,
    newPassword: pass.value,
  };

  const apiEndpoint = "http://localhost:5011/api/auth/reset-password";
  const data = JSON.stringify(formData);
  console.log(data);
  // Make a POST request to the API endpoint
  const response = await fetch(apiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  });

  const result = await response.json();

  if (result.message == "Password reset successful") {
    const storedData = localStorage.getItem("userData");

    // If data exists in local storage
    if (storedData) {
      const userData = JSON.parse(storedData);
      userData.password = pass.value;
      localStorage.setItem("userData", JSON.stringify(userData));
    } else {
      // Store new data if it doesn't exist
      const newData = {
        username: username.value,
        password: pass.value,
      };

      localStorage.setItem("userData", JSON.stringify(newData));
    }

    window.location.href = "../Home/home.html";
  } else {
    alert(result.error);
  }
};

resetBtn.addEventListener("click", resetPassword);