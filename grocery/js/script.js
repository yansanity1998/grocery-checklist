// Add event listener for the logout button
document.getElementById('logout-btn').addEventListener('click', function() {
    Swal.fire({
        title: 'Are you sure?',
        text: 'Do you really want to log out?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, log out!',
        cancelButtonText: 'No, cancel!'
    }).then((result) => {
        if (result.isConfirmed) {
            // Redirect or perform logout action
            window.location.href = 'login.html'; // Change this to your desired logout action
        }
    });
});
