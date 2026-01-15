import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, 
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendBookingConfirmationEmail = async (userEmail, bookingDetails) => {
    try {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.warn("SMTP credentials missing. Email sending skipped.");
            return;
        }

        const info = await transporter.sendMail({
            from: `"Cinefy" <${process.env.SMTP_USER}>`, 
            to: userEmail, 
            subject: "Booking Confirmation - Cinefy", 
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #F84565; margin: 0;">Cinefy</h1>
                        <p style="color: #666;">Your Movie Experience Starts Here</p>
                    </div>
                    
                    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
                        <h2 style="color: #333; margin-top: 0;">Booking Confirmed!</h2>
                        <p style="color: #555;">Hi there,</p>
                        <p style="color: #555;">Thank you for booking with Cinefy. Your tickets are confirmed.</p>
                        
                        <div style="margin: 20px 0; border-top: 1px dashed #ccc; border-bottom: 1px dashed #ccc; padding: 15px 0;">
                            <h3 style="color: #333; margin: 0 0 10px 0;">${bookingDetails.movieTitle}</h3>
                            <p style="margin: 5px 0;"><strong>Date:</strong> ${bookingDetails.date}</p>
                            <p style="margin: 5px 0;"><strong>Time:</strong> ${bookingDetails.time}</p>
                            <p style="margin: 5px 0;"><strong>Seats:</strong> ${bookingDetails.seats}</p>
                            <p style="margin: 5px 0;"><strong>Amount Paid:</strong> ₹${bookingDetails.amount}</p>
                            <p style="margin: 5px 0;"><strong>Booking ID:</strong> ${bookingDetails.bookingId}</p>
                        </div>
                        
                        <div style="text-align: center;">
                            <p style="color: #888; font-size: 12px;">Please show this email at the counter to collect your snacks or for entry assistance.</p>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px; color: #aaa; font-size: 12px;">
                        &copy; ${new Date().getFullYear()} Cinefy. All rights reserved.
                    </div>
                </div>
            `,
        });

        console.log("Message sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
    }
};
