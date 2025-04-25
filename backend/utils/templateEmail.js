
export const templateEmail = (otp) => {
    const temp = `
        <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
            <h2>OTP Verification for your MERN AUTH REDUX-TOOLKIT Account</h2>
            <p>Your One Time Password (OTP) for account verification is:</p>
            <p style="font-size: 24px; font-weight: bold; color: #007bff;">${otp}</p>
            <p>Please do not share this OTP with anyone for security reasons.</p>
        </div>
    `;
    return temp;
};
