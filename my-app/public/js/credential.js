'use strict';

document.addEventListener('DOMContentLoaded', function() {
    const optionBox = document.getElementById('option_box');
    const signUpOptionButton = document.getElementById('sign_up_option');
    const logInOptionButton = document.getElementById('log_in_0ption');
    const signUpBox = document.getElementById('sign_up_box');
    const logInBox = document.getElementById('log_in_box');
    const signUpForm = document.getElementById('sign_up_form');
    const logInForm = document.getElementById('log_in_form');
    const familyProfileBox = document.getElementById('family_profile_box');
    const staffProfileBox = document.getElementById('staff_profile_box');

    // Show Sign Up form
    signUpOptionButton.addEventListener('click', function() {
        signUpBox.style.display = 'block';
        logInBox.style.display = 'none';
    });

    // Show Log In form
    logInOptionButton.addEventListener('click', function() {
        logInBox.style.display = 'block';
        signUpBox.style.display = 'none';
    });

    // Handle Sign Up form submission
    signUpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(signUpForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            password: formData.get('sign_up_password'),
            type: formData.get('signUpType')
        };

        const apiUrl = data.type === 'parent' ? 'https://info442.chiptang.com/create/family' : 'https://info442.chiptang.com/create/staff';

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text || 'Error'); });
            }
            return response.json();
        })
        .then(responseData => {
            console.log(responseData);
            const id = data.type === 'parent' ? responseData.familyId : responseData.staffId;
            console.log(id);
            if (id === undefined) {
                throw new Error('ID is undefined in the response.');
            }
            alert(`Sign Up Successful! Welcome, your ID is: ${id}`);

            signUpBox.style.display = 'none';
            logInBox.style.display = 'block';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Sign Up Failed: ' + error.message);
        });
    });


    // Handle Log In form submission
    logInForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(logInForm);
        const data = {
            credential: formData.get('credential'),
            password: formData.get('log_in_password'),
            type: formData.get('logInType')
        };

        const apiUrl = data.type === 'parent' ? 'https://info442.chiptang.com/login/family' : 'https://info442.chiptang.com/login/staff';

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                credential: data.credential,
                password: data.password
            })
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text || 'Error'); });
            }
            return response.json();
        })
        .then(responseData => {
            console.log(responseData);
            const id = data.type === 'parent' ? responseData.familyId : responseData.staffId;
            console.log(id);
            if (id === undefined) {
                throw new Error('ID is undefined in the response.');
            }
            alert(`Login Successful! Welcome, your ID is: ${id}`);

            optionBox.style.display = 'none';
            logInBox.style.display = 'none';

            if (data.type === 'parent') {
                familyProfileBox.style.display = 'block';
                window.location.href = 'profile_family.html?id=' + id;
            } else {
                staffProfileBox.style.display = 'block';
                window.location.href = 'profile_staff.html?id=' + id;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Login Failed: ' + error.message);
        });
    });
});
