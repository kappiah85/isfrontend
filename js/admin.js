// Admin related functions

// Base URL for the backend API
const API_BASE_URL = 'https://isbackend-i56s.onrender.com/api';
const FRONTEND_URL = 'https://isfrontend.onrender.com';

// Function to load admin dashboard
async function loadAdminDashboard() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || user?.role !== 'admin') {
        window.location.href = `${FRONTEND_URL}/login.html`;
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/admin/projects`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            displayAdminProjects(data.projects);
        } else {
            console.error('Failed to load projects:', data.message);
        }
    } catch (error) {
        console.error('Error loading admin dashboard:', error);
    }
}

// Function to display projects in admin view
function displayAdminProjects(projects) {
    const projectsContainer = document.getElementById('adminProjectsContainer');
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
                <span class="status">Status: ${project.status}</span>
            </div>
            <div class="admin-actions">
                <select id="status-${project.id}" class="status-select">
                    <option value="pending" ${project.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="approved" ${project.status === 'approved' ? 'selected' : ''}>Approved</option>
                    <option value="rejected" ${project.status === 'rejected' ? 'selected' : ''}>Rejected</option>
                </select>
                <button onclick="updateProjectStatus('${project.id}')" class="btn">Update Status</button>
                <button onclick="deleteProject('${project.id}')" class="btn btn-danger">Delete</button>
            </div>
        `;
        projectsContainer.appendChild(projectCard);
    });
}

// Function to update project status
async function updateProjectStatus(projectId) {
    const token = localStorage.getItem('token');
    const statusSelect = document.getElementById(`status-${projectId}`);
    const newStatus = statusSelect.value;

    try {
        const response = await fetch(`${API_BASE_URL}/admin/projects/${projectId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus })
        });

        const data = await response.json();

        if (data.success) {
            alert('Project status updated successfully!');
            loadAdminDashboard();
        } else {
            alert(data.message || 'Failed to update project status');
        }
    } catch (error) {
        console.error('Error updating project status:', error);
        alert('Failed to update project status. Please try again.');
    }
}

// Function to delete project
async function deleteProject(projectId) {
    if (!confirm('Are you sure you want to delete this project?')) {
        return;
    }

    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${API_BASE_URL}/admin/projects/${projectId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            alert('Project deleted successfully!');
            loadAdminDashboard();
        } else {
            alert(data.message || 'Failed to delete project');
        }
    } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project. Please try again.');
    }
}

// Add event listeners if elements exist
document.addEventListener('DOMContentLoaded', () => {
    const adminDashboard = document.getElementById('adminProjectsContainer');
    
    if (adminDashboard) {
        loadAdminDashboard();
    }
}); 