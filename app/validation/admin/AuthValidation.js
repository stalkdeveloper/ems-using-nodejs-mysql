const User = require('../../models/User');

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password, confirmPassword) => {
    const minLength = 8;
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];

    if (password.length < minLength) {
        errors.push(`Password must be at least ${minLength} characters long.`);
    }
    if (!hasNumber) {
        errors.push('Password must contain at least one number.');
    }
    if (!hasSpecialChar) {
        errors.push('Password must contain at least one special character.');
    }
    if (password !== confirmPassword) {
        errors.push('Password and confirm password must match.');
    }

    return errors;
};

const authValidate = async (input, checkEmailUnique = true, validateType = 'register') => {
    const requiredFields = ['name', 'email', 'password', 'confirmPassword'];
    const errors = {};

    requiredFields.forEach(field => {
        if (!input[field]) {
            errors[field] = errors[field] || [];
            if (field === 'confirmPassword') {
                errors[field].push('The confirm password field is required.');
            } else {
                errors[field].push(`The ${field} field is required.`);
            }
        }
    });

    if (input.email && !validateEmail(input.email)) {
        errors.email = errors.email || [];
        errors.email.push('Invalid email format.');
    }

    if (input.password || input.confirmPassword) {
        const passwordErrors = validatePassword(input.password, input.confirmPassword);
        if (passwordErrors.length > 0) {
            errors.password = errors.password || [];
            errors.password.push(...passwordErrors);
        }
    }

    if (checkEmailUnique && input.email) {
        const emailTaken = await isEmailTaken(input.email);
        if (emailTaken) {
            errors.email = errors.email || [];
            errors.email.push('Email is already taken.');
        }
    }

    return errors;
};

const isEmailTaken = async (email) => {
    const user = await User.findOne({
        where: {
            email: email,
            deleted_at: null
        }
    });
    return user !== null;
};

module.exports = {
    authValidate,
    isEmailTaken
};