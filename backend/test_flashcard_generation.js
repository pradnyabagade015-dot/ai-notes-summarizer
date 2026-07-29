const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('./server'); // Assuming your express app is exported from server.js
const connectDB = require('./config/db');
const mongoose = require('mongoose');


// This is a simplified test runner. In a real app, you'd use a test framework like Jest.
async function runTest() {
    try {
        await connectDB();
        let token;
        let noteId;

        // 1. Register a new user
        const userCredentials = {
            fullName: 'Test User',
            email: `testuser_${Date.now()}@example.com`,
            password: 'password123',
        };
        await request(app)
            .post('/api/auth/register')
            .send(userCredentials)
            .expect(201)
            .then(response => {
                console.log('User registered successfully.');
            });

        // 2. Login to get a token
        await request(app)
            .post('/api/auth/login')
            .send({ email: userCredentials.email, password: userCredentials.password })
            .expect(200)
            .then(response => {
                token = response.body.token;
                console.log('User logged in successfully.');
            });

        // 3. Upload a note to get a noteId
        const filePath = path.join(__dirname, 'test_note.txt');
        await request(app)
            .post('/api/notes/upload')
            .set('Authorization', `Bearer ${token}`)
            .attach('file', filePath)
            .expect(201)
            .then(response => {
                noteId = response.body.note.id;
                console.log(`Note uploaded successfully. Note ID: ${noteId}`);
            });

        // 4. Generate flashcards for the note
        await request(app)
            .post('/api/flashcards/generate')
            .set('Authorization', `Bearer ${token}`)
            .send({ noteId })
            .expect(201)
            .then(response => {
                console.log('Flashcard generation successful!');
                console.log(response.body.flashcards);
            });

    } catch (error) {
        console.error('Test failed:', error.message);
    } finally {
        // In a real test suite, you'd close the server connection.
        await mongoose.connection.close();
        // For this script, we'll just exit.
        process.exit();
    }
}

runTest();
