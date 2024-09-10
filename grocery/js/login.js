document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Show SweetAlert
    Swal.fire({
        title: 'Success!',
        text: 'You have successfully logged in.',
        icon: 'success',
        confirmButtonText: 'OK'
    });

    // Optionally, redirect to the index page after a delay
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000); // Redirect after 2 seconds
});
