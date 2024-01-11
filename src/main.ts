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
