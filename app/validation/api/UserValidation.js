const User = require('../../models/User');
const validateUserInput = async (input, checkEmailUnique = true, checkPassword = true) => {
    const errors = {};

    const requiredFields = checkPassword 
    ? ['name', 'email', 'dateofbirth', 'password', 'confirm_password'] 
    : ['name', 'email', 'dateofbirth'];
    
    if (!input || typeof input !== 'object' || Array.isArray(input)) {
        return { general: ['Invalid input data. Expected an object.'] };
    }
    
    requiredFields.forEach(field => {
        if (!input[field]) {
            errors[field] = errors[field] || [];
            if (field === 'dateofbirth') {
                errors[field].push('The date of birth is required.');
            } else if (field === 'confirm_password') {
                errors[field].push('The confirm password is required.');
            } else {
                errors[field].push(`The ${field} field is required.`);
            }
        }
    });

    if (input.email) {
        if (!/\S+@\S+\.\S+/.test(input.email)) {
            errors.email = errors.email || [];
            errors.email.push('The email format is invalid.');
        } else if (checkEmailUnique && await isEmailTaken(input.email)) {
            errors.email = errors.email || [];
            errors.email.push('The email address is already in use.');
        }
    }

    if ((input.password !== input.confirm_password) && checkPassword) {
        errors.confirm_password = errors.confirm_password || [];
        errors.confirm_password.push('The password and confirm password should be match.');
    }

    return errors;
};

const isEmailTaken = async (email) => {
    const user = await User.findOne({
        where: {
            email: email
        }
    });
    return !!user;
};

module.exports = {
    validateUserInput
};
