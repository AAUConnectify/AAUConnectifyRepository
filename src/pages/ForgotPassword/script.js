const username = document.getElementById('username')
const Ans = document.getElementById('securityQuestionAnswer')
const pass = document.getElementById('newPassword')
const resetBtn = document.getElementById('reset-btn')

if (localStorage.getItem('userData')) {
    window.location.href = '../Home/home.html';
}

const resetPassword = async (e) => {
    e.preventDefault();
    if (!username.value || !pass.value || !Ans.value){
        alert('Please fill the Feilds')
        return
    }
    const formData = {
        username: username.value,
        securityQuestionAnswer: Ans.value,
        newPassword: pass.value

    };
    
    const apiEndpoint = 'http://localhost:5001/api/auth/reset-password';
    const data = JSON.stringify(formData)
    console.log(data)
    // Make a POST request to the API endpoint
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data
    });

    const result = await response.json()


    
    if (result.message == "Password reset successful") {
   
            const storedData = localStorage.getItem('userData');

            // If data exists in local storage
            if (storedData) {
                const userData = JSON.parse(storedData);
                storedData.password = pass;
            } else {
              // Store new data if it doesn't exist
              const newData = {
                username: username,
                password: newPassword
              };
          
              localStorage.setItem('userData', JSON.stringify(newData));
            }
    
    
        window.location.href = '../Home/home.html';
        
    } else {
        alert(result.error)
    }
}
    

resetBtn.addEventListener('click', resetPassword)