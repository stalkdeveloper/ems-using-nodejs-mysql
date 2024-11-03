const User = require('../../models/User');
const { validateUserInput } = require('../../validation/api/UserValidation')
const response = require('../../utils/standardResponse');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET_KEY;


exports.index = async (req, res) => {
    try {
        let users = await User.findAll({
            where: {
                deleted_at: null
            }
        });
        return res.status(201).json(response.successResponse('Record successfully fetch!', users));
    } catch (error) {
        return res.status(500).json(response.errorResponse('Error fetch users', { error: error.message }));
    }
};

exports.store = async (req, res) => {
    try {
        // logger.log(req.body);
        const validationErrors = await validateUserInput(req.body);
        
        if (Object.keys(validationErrors).length > 0) {
            return res.status(400).json(response.errorResponse('Validation failed', validationErrors));
        }
        const { name, email, dateofbirth, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);
        const user = new User({
            name,
            email,
            dateofbirth,
            password: hashedPassword
        });

        const savedUser = await user.save();
        return res.status(201).json(response.successResponse('User created successfully!', savedUser));
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json(response.errorResponse('Internal server error', { error: error.message }));
    }
};

exports.edit = async (req, res) => {
    try {
        let user;

        const userId = req.params.id;
        let userEmail = null;   
        if (userId) {
            user = await User.findByPk(userId);
            if(!user){
                userEmail = userId;
            }
        }
        if (!user && userEmail) {
            user = await User.findOne({ where: { email: userEmail } });
        }

        if (!user) {
            return res.status(404).json(response.errorResponse('User ID or Email not found', 'Please provide valid data.'));
        }

        // await user.update(req.body);
        return res.status(200).json(response.successResponse('User found successfully!', user));
    } catch (error) {
        return res.status(500).json(response.errorResponse('Internal server error', { error: error.message }));
    }
};

exports.update = async (req, res) => {
    try {
        let userId = req.params.id;
        req.body.id = userId;
        let validationErrors;
        if (req.body.password && req.body.confirm_password) {
            validationErrors = await validateUserInput(req.body, false, true);
        } else {
            validationErrors = await validateUserInput(req.body, false, false);
        }

        if (Object.keys(validationErrors).length > 0) {
            return res.status(400).json(response.errorResponse('Validation failed', validationErrors));
        }

        let user = await User.findByPk(userId);

        if (!user) {
            userEmail = userId;
            user = await User.findOne({ where: { email: userEmail } });
            if(!user){
                return res.status(404).json(response.errorResponse('User not found', 'Please provide a valid User ID.'));
            }
        }

        await user.update(req.body);

        return res.status(200).json(response.successResponse('User updated successfully!', user));
    } catch (error) {
        return res.status(500).json(response.errorResponse('Internal server error', { error: error.message }));
    }
};


exports.delete = async (req, res) => {
    const id = req.params.id;
    try {
      const data = await User.findByIdAndDelete(id, { useFindAndModify: false });
      if (!data) {
        const message = `Cannot delete User with id=${id}. Maybe User was not found!`;
        return res.status(404).json(response.errorResponse(message, { global: [message] }));
      }
      res.status(200).json(response.successResponse('User was deleted successfully!'));
    } catch (err) {
      console.error(`Error deleting user with id=${id}:`, err);
      res.status(500).json(response.errorResponse(`Could not delete User with id=${id}`, { global: [err.message] }));
    }
  };
  
  exports.deleteAll = async (req, res) => {
    try {
      const data = await User.deleteMany({});
      res.status(200).json(response.successResponse(`${data.deletedCount} Users were deleted successfully!`));
    } catch (err) {
      console.error('Error deleting all users:', err);
      res.status(500).json(response.errorResponse('Some error occurred while removing all users', { global: [err.message] }));
    }
  };
