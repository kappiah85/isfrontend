// Authentication related functions

// Base URL for the backend API
const API_BASE_URL = 'https://isbackend-i56s.onrender.com/api';
const FRONTEND_URL = 'https://isfrontend.onrender.com';

// Function to handle user registration
async function registerUser(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password, role })
        });

        const data = await response.json();

        if (data.success) {
            // Store the token and user info
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Redirect based on role
            if (data.user.role === 'admin') {
                window.location.href = `${FRONTEND_URL}/admin/dashboard.html`;
            } else {
                window.location.href = `${FRONTEND_URL}/projects.html`;
            }
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed. Please try again.');
    }
}

// Function to handle user login
async function loginUser(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            // Store the token and user info
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Redirect based on role
            if (data.user.role === 'admin') {
                window.location.href = `${FRONTEND_URL}/admin/dashboard.html`;
            } else {
                window.location.href = `${FRONTEND_URL}/projects.html`;
            }
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
    }
}

// Function to check if user is authenticated
function isAuthenticated() {
    return localStorage.getItem('token') !== null;
}

// Function to get current user
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// Function to logout user
function logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = `${FRONTEND_URL}/login.html`;
}

// Add event listeners if elements exist
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const logoutBtn = document.getElementById('logoutBtn');

    if (loginForm) {
        loginForm.addEventListener('submit', loginUser);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', registerUser);
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', logoutUser);
    }
}); 