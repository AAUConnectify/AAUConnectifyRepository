var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var userName = document.getElementById('username');
var password = document.getElementById('password');
var loginBtn = document.getElementById('login-btn');
if (localStorage.getItem('userData')) {
    window.location.href = './pages/Home/home.html';
}
var handleLogin = function (e) { return __awaiter(_this, void 0, void 0, function () {
    var data, response, result, dataOnLocalStorage;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                e.preventDefault();
                if (!userName.value || !password.value) {
                    alert('Please enter username and password');
                    return [2 /*return*/];
                }
                data = {
                    username: userName.value,
                    userpassword: password.value,
                };
                return [4 /*yield*/, fetch('http://localhost:5011/api/auth/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    })];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 2:
                result = _a.sent();
                console.log(result);
                if (result.message === 'Login successful') {
                    dataOnLocalStorage = {
                        token: result.token,
                        username: result.user.username,
                        userId: result.user.userId,
                        role: result.user.role,
                        fullName: result.user.fullName,
                        fieldOfStudy: result.user.fieldOfStudy,
                        profilePic: result.user.profilePic,
                    };
                    localStorage.setItem('userData', JSON.stringify(dataOnLocalStorage));
                    window.location.href = './pages/Home/home.html';
                }
                else {
                    alert(result.error);
                }
                return [2 /*return*/];
        }
    });
}); };
loginBtn.addEventListener('click', function (e) { return handleLogin(e); });
//=======
// Assume you have an API endpoint for authentication
var authenticationEndpoint = 'https://your-backend-api.com/authenticate';
// Function to handle the login process
function login(username, password) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, authToken, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, fetch(authenticationEndpoint, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ username: username, password: password }),
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    authToken = data.token;
                    // Store the token in local storage or a secure cookie
                    localStorage.setItem('authToken', authToken);
                    // Return true to indicate successful login
                    return [2 /*return*/, true];
                case 3:
                    // If the response is not successful, handle the error
                    console.error('Authentication failed:', response.statusText);
                    return [2 /*return*/, false];
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    // Handle any other errors that may occur during the request
                    console.error('Error during login:', error_1);
                    return [2 /*return*/, false];
                case 6: return [2 /*return*/];
            }
        });
    });
}
// Example usage in your login form or component
var usernameInput = 'user123';
var passwordInput = 'password123';
login(usernameInput, passwordInput)
    .then(function (isLoggedIn) {
    if (isLoggedIn) {
        console.log('Login successful!');
        // Redirect or update UI as needed
    }
    else {
        console.log('Login failed!');
        // Display an error message or take appropriate action
    }
});
