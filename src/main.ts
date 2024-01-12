<<<<<<< HEAD
const userName = document.getElementById('username') as HTMLInputElement;
const password = document.getElementById('password') as HTMLInputElement;
const loginBtn = document.getElementById('login-btn') as HTMLButtonElement;

if (localStorage.getItem('userData')) {
    window.location.href = './pages/Home/home.html';
}

const handleLogin = async (e: Event) => {
    e.preventDefault();
    if (!userName.value || !password.value) {
        alert('Please enter username and password');
        return;
    }
    const data = {
        username: userName.value,
        userpassword: password.value,
    };
    const response = await fetch('http://localhost:5011/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log(result);
    if (result.message === 'Login successful') {
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
        localStorage.setItem('userData', JSON.stringify(dataOnLocalStorage));
        window.location.href = './pages/Home/home.html';
    } else {
        alert(result.error);
    }
};

loginBtn.addEventListener('click', (e) => handleLogin(e));
=======
// Assume you have an API endpoint for authentication
const authenticationEndpoint = 'https://your-backend-api.com/authenticate';

// Function to handle the login process
async function login(username: string, password: string): Promise<boolean> {
    try {
        // Make a POST request to your authentication endpoint
        const response = await fetch(authenticationEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        // Check if the response is successful (status code 200-299)
        if (response.ok) {
            const data = await response.json();
            // Assuming your backend returns a token upon successful authentication
            const authToken = data.token;

            // Store the token in local storage or a secure cookie
            localStorage.setItem('authToken', authToken);

            // Return true to indicate successful login
            return true;
        } else {
            // If the response is not successful, handle the error
            console.error('Authentication failed:', response.statusText);
            return false;
        }
    } catch (error) {
        // Handle any other errors that may occur during the request
        console.error('Error during login:', error);
        return false;
    }
}

// Example usage in your login form or component
const usernameInput = 'user123';
const passwordInput = 'password123';

login(usernameInput, passwordInput)
    .then((isLoggedIn) => {
        if (isLoggedIn) {
            console.log('Login successful!');
            // Redirect or update UI as needed
        } else {
            console.log('Login failed!');
            // Display an error message or take appropriate action
        }
    });
>>>>>>> 402fd308f44881857e10a0749d9ac6d5d2b91506
