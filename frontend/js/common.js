const BACKEND_URL = 'http://localhost:8080';

function loginCheckup() {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
        window.location.href = "sign-in.html";
    }
}


document.addEventListener('DOMContentLoaded', function() {
    loginCheckup();

    const logoutLink = document.getElementById('logout-link');
    logoutLink.addEventListener("click", async function(event) {
        event.preventDefault();
        const token = sessionStorage.getItem("authToken");        
        const response = await fetch(`${BACKEND_URL}/auth/logout`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            sessionStorage.removeItem("authToken");
            window.location.href = "index.html";
        } else {
            alert("Failed to log out. Please try again.");
        }
    });
})