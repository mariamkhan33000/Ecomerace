
const sanitizeUser = (user) => {
    return {
        _id: user._id,
        email: user.email,
        isVerified: user.isVerified
    };
};

export default sanitizeUser;
