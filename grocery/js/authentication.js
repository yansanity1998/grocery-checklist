document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const username = this.username.value; // Get the username from the form
    const password = this.password.value; // Get the password from the form

    const userData = JSON.parse(localStorage.getItem('userData')); // Retrieve user data from local storage

    // Check if user data exists and matches the input credentials
    if (userData && userData.username === username && userData.password === password) {
        Swal.fire({
            title: 'Success!',
            text: 'You have successfully logged in.',
            icon: 'success',
            confirmButtonText: 'OK'
        });

        // Redirect to index.html after a short delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } else {
        // Show error message if credentials are invalid
        Swal.fire({
            title: 'Error!',
            text: 'Invalid username or password.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
});

function logout() {
    // Confirm logout action with the user
    Swal.fire({
        title: 'Are you sure?',
        text: 'You will be logged out.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, log me out!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('userData'); // Remove user data from local storage

            // Show success message and redirect to login page
            Swal.fire({
                title: 'Logged Out',
                text: 'You have successfully logged out.',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                window.location.href = 'login.html';
            });
        }
    });
}

// Redirect to signup page if user is not logged in and tries to access index.html
if (window.location.pathname === '/index.html' && !localStorage.getItem('userData')) {
    window.location.href = 'signup.html';
    Swal.fire({
        title: 'Login Required',
        text: 'You must login first.',
        icon: 'warning',
        confirmButtonText: 'OK'
    });
}