const passwordToggleIcon = document.querySelectorAll('.password-toggle-icon');
const confirmPasswordInput = document.getElementById('confirm-password');
const passwordInput = document.getElementById('password');

passwordToggleIcon.forEach(icon => {
    icon.addEventListener('click', (e) => {
        if (icon === passwordToggleIcon[0]) {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                passwordToggleIcon[0].innerHTML = '<i class="fas fa-eye-slash"></i>';
            } else {
                passwordInput.type = 'password';
                passwordToggleIcon[0].innerHTML = '<i class="fas fa-eye"></i>';
            }
        }
        else if (icon === passwordToggleIcon[1]) {
            if (confirmPasswordInput.type === 'password') {
                confirmPasswordInput.type = 'text';
                passwordToggleIcon[1].innerHTML = '<i class="fas fa-eye-slash"></i>';
            } else {
                confirmPasswordInput.type = 'password';
                passwordToggleIcon[1].innerHTML = '<i class="fas fa-eye"></i>';
            }
        }
        return
    });
});