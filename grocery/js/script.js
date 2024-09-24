// Check if user is logged in when accessing the dashboard
if (!localStorage.getItem('userData')) {
    // Redirect to login page if not logged in
    window.location.href = 'login.html';
    Swal.fire({
        title: 'Login Required',
        text: 'You must login first.',
        icon: 'warning',
        confirmButtonText: 'OK'
    });
}

// Function to log out the user
function logout() {
    // Show confirmation modal before logging out
    Swal.fire({
        title: 'Are you sure?',
        text: 'You will be logged out.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, log me out!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            // Clear user data from local storage
            localStorage.removeItem('userData');

            // Show logout confirmation message
            Swal.fire({
                title: 'Logged Out',
                text: 'You have successfully logged out.',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                // Redirect to login page after logout confirmation
                window.location.href = 'login.html';
            });
        }
    });
}

// Attach the logout function to the logout button
document.getElementById('logout-btn').addEventListener('click', logout);