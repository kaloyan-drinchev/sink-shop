import express from 'express';
import nodemailer from 'nodemailer';

const testEmailRouter = express.Router();

// Simple email test without authentication (for testing only)
testEmailRouter.post('/send', async (req, res) => {
  try {
    // Test with a simple email service
    console.log('Test email endpoint called');
    console.log('Order data would be sent to: kalloyand@gmail.com');
    console.log('Email content:', req.body);
    
    res.json({ 
      success: true, 
      message: 'Email would be sent to kalloyand@gmail.com (test mode)' 
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ error: 'Test failed' });
  }
});

export { testEmailRouter };
