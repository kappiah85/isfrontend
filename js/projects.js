// Projects related functions

// Base URL for the backend API
const API_BASE_URL = 'https://isbackend-i56s.onrender.com/api';
const FRONTEND_URL = 'https://isfrontend.onrender.com';

// Function to submit a new project
async function submitProject(event) {
    event.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = `${FRONTEND_URL}/login.html`;
        return;
    }

    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('category', document.getElementById('category').value);
    formData.append('tags', document.getElementById('tags').value);
    formData.append('video', document.getElementById('video').value);

    // Handle file uploads
    const fileInput = document.getElementById('files');
    for (let i = 0; i < fileInput.files.length; i++) {
        formData.append('files', fileInput.files[i]);
    }

    try {
        const response = await fetch(`${API_BASE_URL}/projects`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            alert('Project submitted successfully!');
            window.location.href = '/projects.html';
        } else {
            alert(data.message || 'Project submission failed');
        }
    } catch (error) {
        console.error('Project submission error:', error);
        alert('Project submission failed. Please try again.');
    }
}

// Function to load and display projects
async function loadProjects() {
    try {
        const queryParams = new URLSearchParams(window.location.search);
        const category = queryParams.get('category');
        const tag = queryParams.get('tag');
        
        let url = `${API_BASE_URL}/projects`;
        if (category || tag) {
            url += '?';
            if (category) url += `category=${category}`;
            if (tag) url += `${category ? '&' : ''}tag=${tag}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
            displayProjects(data.projects);
        } else {
            console.error('Failed to load projects:', data.message);
        }
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Function to display projects in the UI
function displayProjects(projects) {
    const projectsContainer = document.getElementById('projectsContainer');
    if (!projectsContainer) return;

    projectsContainer.innerHTML = '';

    if (projects.length === 0) {
        projectsContainer.innerHTML = '<p>No projects found.</p>';
        return;
    }

    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.innerHTML = `
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="project-meta">
                <span class="category">Category: ${project.category}</span>
                <span class="tags">Tags: ${project.tags.join(', ')}</span>
            </div>
            <div class="project-actions">
                <a href="${FRONTEND_URL}/project-details.html?id=${project.id}" class="btn">View Details</a>
            </div>
        `;
        projectsContainer.appendChild(projectCard);
    });
}

// Add event listeners if elements exist
document.addEventListener('DOMContentLoaded', () => {
    const submitForm = document.getElementById('submitProjectForm');
    const projectsContainer = document.getElementById('projectsContainer');

    if (submitForm) {
        submitForm.addEventListener('submit', submitProject);
    }

    if (projectsContainer) {
        loadProjects();
    }
}); 