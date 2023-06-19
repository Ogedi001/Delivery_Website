const phoneForm = document.querySelector('.phone');
const emailForm = document.querySelector('.email');
const addressForm = document.querySelector('.addressForm');
const passwordForm = document.querySelector('.passwordForm');
const uploadForm = document.querySelector('.uploadPics');

phoneForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formDataQueryString = new URLSearchParams(new FormData(phoneForm))
    console.log(formDataQueryString)
    try {
        const response = await fetch('/customer/profile/update-phone', {
            method: 'POST',
            body: formDataQueryString
        });

        if (response.ok) {
            const result = await response.json();
            errorTimeOut(result.Message)
        } else {
            errorTimeOut('Request failed with status:', response.status);
        }
    } catch (error) {
        console.error('An error occurred:', error);
        errorTimeOut('An error occurred: Phone number cannot be updated')
    }
});


emailForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formDataQueryString = new URLSearchParams(new FormData(emailForm))
    console.log(formDataQueryString)
    try {
        const response = await fetch('/customer/profile/update-email', {
            method: 'POST',
            body: formDataQueryString
        });

        if (response.ok) {
            const result = await response.json();
            errorTimeOut(result.Message)
        } else {
            errorTimeOut('Request failed with status:', response.status);
        }
    } catch (error) {
        console.error('An error occurred:', error);
        errorTimeOut('An error occurred: Email cannot be updated')
    }
});


addressForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formDataQueryString = new URLSearchParams(new FormData(addressForm))
    console.log(formDataQueryString)
    try {
        const response = await fetch('/customer/profile/update-address', {
            method: 'POST',
            body: formDataQueryString
        });

        if (response.ok) {
            const result = await response.json();
            errorTimeOut(result.Message)
        } else {
            errorTimeOut('Request failed with status:', response.status);
        }
    } catch (error) {
        console.error('An error occurred:', error);
        errorTimeOut('An error occurred: Address cannot be updated')
    }
});

passwordForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formDataQueryString = new URLSearchParams(new FormData(passwordForm))
    console.log(formDataQueryString)
    try {
        const response = await fetch('/customer/profile/update-password', {
            method: 'POST',
            body: formDataQueryString
        });

        if (response.ok) {
            const result = await response.json();
            console.log(result)
            return errorTimeOut(result.Message)
        } else if (response.status === 400) {
            const errorResult = await response.json()
            console.log(errorResult)
            errorTimeOut(errorResult.Message);
            return
        }
        else {
            const Badresult = await response.json();
            errorTimeOut(Badresult)
            return console.log(Badresult)
        }
    } catch (error) {
        console.error('An error occurred:', error);
        errorTimeOut('An error occurred: Password cannot be updated')
    }
});


const removeProfilePicForm = document.getElementById('removeProfilePicForm');

removeProfilePicForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
        const response = await fetch('/customer/profile/remove-profile-pic', {
            method: 'POST',
        });

        if (response.ok) {
            const result = await response.json()
            async function showResult() {
                errorTimeOut(result.Message);
            }
            await showResult();

            window.location.href = '/customer/profile';

        } else if (response.status === 500) {
            const result = await response.json();
            errorTimeOut(result.error);
        } else {
            const result = await response.json();
            console.log(result);
        }
    } catch (error) {
        errorTimeOut('An error occur');
    }
});



uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(uploadForm);

    try {
        const response = await fetch('/customer/profile/update-profile-pic', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const result = await response.json()
            async function showResult() {
                errorTimeOut(result.Message);
            }
            await showResult();

            window.location.href = '/customer/profile';
            return
        } else if (response.status === 500) {
            const result = await response.text();
            errorTimeOut(result);
        } else {
            const result = await response.json();
            console.log(result);
        }

    } catch (error) {
        errorTimeOut('An error occur');
    }
});




function errorTimeOut(errMsg) {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.textContent = errMsg;
    setTimeout(() => {
        errorContainer.textContent = " "
    }, 3000);
}