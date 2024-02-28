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

    // Role form
    const signUpTypeSelect = document.getElementById('sign_up_type');

    function handleSignUpTypeChange() {
        const selectedType = signUpTypeSelect.value;
        const roleInputExists = document.getElementById('role'); // Check if the Role input already exists

        // Add the Role input if 'staff' is selected and it doesn't already exist
        if (selectedType === 'staff' && !roleInputExists) {
            const roleDiv = document.createElement('div');
            roleDiv.innerHTML = `
                <label for="role">Role:</label>
                <input type="text" id="role" name="role" required>
            `;
            signUpForm.insertBefore(roleDiv, signUpForm.querySelector('button')); // Insert before the submit button
        } 
        // Remove the Role input if it exists and 'staff' is not selected
        else if (selectedType !== 'staff' && roleInputExists) {
            roleInputExists.parentNode.remove();
        }
    }

    // Listen for changes to the sign-up type select element
    signUpTypeSelect.addEventListener('change', handleSignUpTypeChange);

    // Handle Sign Up form submission
    signUpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(signUpForm);
        const accountType = formData.get('signUpType');
        const role = accountType === 'parent' ? 'family' : formData.get('role');

        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            password: formData.get('sign_up_password'),
            ...(accountType === 'staff' && { role: formData.get('role') })
        };

        const apiUrl = accountType === 'parent' ? 'https://info442.chiptang.com/create/family' : 'https://info442.chiptang.com/create/staff';

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
            const id = accountType === 'parent' ? responseData.familyId : responseData.staffId;
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
                window.location.href = 'profile_family.html?id=' + id;
            } else {
                window.location.href = 'profile_staff.html?id=' + id;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Login Failed: ' + error.message);
        });
    });
});
