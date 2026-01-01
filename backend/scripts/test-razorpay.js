import dotenv from 'dotenv';
dotenv.config();

import Razorpay from 'razorpay';

console.log('--- Razorpay Config Test ---');
console.log('KEY_ID:', process.env.RAZORPAY_KEY_ID ? 'Exists' : 'MISSING');
console.log('KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? 'Exists' : 'MISSING');

try {
    const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID || 'test_key',
        key_secret: process.env.RAZORPAY_KEY_SECRET || 'test_secret'
    });
    console.log('Razorpay instance created successfully');
} catch (error) {
    console.error('Error creating Razorpay instance:', error);
}
