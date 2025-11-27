# Testing Guide for Note-Taking App

## Overview
This guide will help you test the local authentication and data storage features of the app.

## Prerequisites
- Expo Go app installed on your mobile device, OR
- iOS Simulator (Mac only), OR
- Android Emulator

## Starting the App

The Expo development server is already running. You can:

1. **On Mobile Device:**
   - Open Expo Go app
   - Scan the QR code shown in the terminal
   - Wait for the app to load

2. **On iOS Simulator (Mac only):**
   - Press `i` in the terminal
   - Wait for simulator to launch and app to load

3. **On Android Emulator:**
   - Press `a` in the terminal
   - Wait for emulator to launch and app to load

## Test Scenarios

### 1. First Launch - Registration Flow

**Expected Behavior:**
- App should show a loading screen briefly
- Then display the Login screen (since no user is logged in)

**Test Steps:**
1. On the Login screen, tap "Sign Up" link at the bottom
2. Fill in the registration form:
   - Email: `test@example.com`
   - Username: `TestUser`
   - Password: `password123`
   - Confirm Password: `password123`
3. Tap "Sign Up" button

**Expected Result:**
- Registration should succeed
- User should be automatically logged in
- Home screen should appear with the Otter logo and "TestUser" displayed
- A "NEW" folder card should be visible

### 2. Create a Course

**Test Steps:**
1. On the Home screen, tap the "NEW" card
2. Enter course name: `Computer Science 101`
3. Tap "Create"

**Expected Result:**
- Modal should close
- A new folder card labeled "Computer Science 101" should appear
- The folder should have a blue folder icon

### 3. Create Multiple Courses

**Test Steps:**
1. Tap "NEW" card again
2. Create course: `Mathematics`
3. Tap "NEW" card again
4. Create course: `Physics`

**Expected Result:**
- Three course folders should now be visible
- Courses should be sorted by date (newest first) by default

### 4. Test Sorting

**Test Steps:**
1. Tap the "Name" button in the sort toggle

**Expected Result:**
- Courses should re-sort alphabetically:
  - Computer Science 101
  - Mathematics
  - Physics

### 5. Open a Course and Create Lectures

**Test Steps:**
1. Tap on "Computer Science 101" folder
2. You should see the course detail screen with "NEW" card
3. Tap "NEW" card
4. Enter lecture title: `Introduction to Programming`
5. Tap "Create"
6. Repeat to create more lectures:
   - `Data Structures`
   - `Algorithms`

**Expected Result:**
- Each lecture should appear as a numbered card
- Lecture numbers should be sequential (1, 2, 3)
- Each card should show the lecture title and creation date

### 6. Open a Lecture and Test Recording

**Test Steps:**
1. Tap on "Introduction to Programming" lecture
2. You should see the Note Detail screen with three tabs: Summary, Transcript, Note
3. The Transcript tab should be active by default
4. You should see "No transcripts yet" message
5. Tap the floating microphone button at the bottom
6. **Grant microphone permission when prompted**
7. Speak something (e.g., "This is a test transcript")
8. Tap the microphone button again to stop recording

**Expected Result:**
- While recording, the mic button should turn red
- A "Processing audio..." banner should appear briefly
- After processing, your transcript should appear in the list
- Each transcript should show:
  - Timestamp (0:00, 0:01, etc.)
  - Your username
  - The transcribed text

### 7. Create Multiple Transcripts

**Test Steps:**
1. Record several more audio clips
2. Each time, speak different content

**Expected Result:**
- All transcripts should appear in chronological order
- Timestamps should increment (0:00, 0:01, 0:02, etc.)
- You can scroll through all transcripts

### 8. Test Navigation

**Test Steps:**
1. Tap the back arrow to return to the course detail screen
2. Tap back arrow again to return to home screen
3. Navigate through different courses and lectures

**Expected Result:**
- Navigation should work smoothly
- All data should persist (courses, lectures, transcripts)

### 9. Test Logout

**Test Steps:**
1. On the Home screen, tap the logout icon (top right)
2. Confirm logout in the alert dialog

**Expected Result:**
- User should be logged out
- Login screen should appear

### 10. Test Login with Existing Account

**Test Steps:**
1. On Login screen, enter:
   - Email: `test@example.com`
   - Password: `password123`
2. Tap "Sign In"

**Expected Result:**
- Login should succeed
- Home screen should appear
- All previously created courses should still be there
- Username "TestUser" should be displayed

### 11. Test Data Persistence

**Test Steps:**
1. Close the app completely (swipe up from app switcher)
2. Reopen the app from Expo Go

**Expected Result:**
- User should still be logged in
- All courses, lectures, and transcripts should still be there
- No data should be lost

### 12. Test Delete Functionality

**Test Steps:**
1. Long-press on a course folder
2. Confirm deletion in the alert dialog

**Expected Result:**
- Course should be deleted
- All associated lectures and transcripts should also be deleted

**Test Lecture Deletion:**
1. Open a course
2. Long-press on a lecture card
3. Confirm deletion

**Expected Result:**
- Lecture should be deleted
- All associated transcripts should also be deleted

### 13. Test Invalid Login

**Test Steps:**
1. Logout
2. Try to login with wrong password:
   - Email: `test@example.com`
   - Password: `wrongpassword`
3. Tap "Sign In"

**Expected Result:**
- Login should fail
- Error message should appear: "Invalid email or password"

### 14. Test Registration Validation

**Test Steps:**
1. Go to Register screen
2. Try to register with invalid email: `notanemail`

**Expected Result:**
- Error: "Invalid email format"

**Test password length:**
1. Try password: `123`

**Expected Result:**
- Error: "Password must be at least 6 characters"

**Test password mismatch:**
1. Password: `password123`
2. Confirm Password: `different123`

**Expected Result:**
- Error: "Passwords do not match"

## Known Limitations (Prototype)

1. **No cloud sync** - All data is stored locally on the device
2. **No password encryption** - Passwords are stored in plain text (NOT suitable for production)
3. **No password recovery** - If you forget your password, you'll need to clear app data
4. **Summary and Note tabs** - These features show "Coming soon" placeholders
5. **Language translation** - Not implemented in this version
6. **No transcript editing** - Transcripts cannot be edited or deleted individually

## Troubleshooting

### App won't load
- Make sure Expo development server is running
- Check that your device/simulator is on the same network
- Try pressing `r` in terminal to reload

### Microphone not working
- Make sure you granted microphone permission
- On iOS simulator, microphone may not work (use real device)
- Check device microphone settings

### Database errors
- Try clearing app data and restarting
- In Expo Go, shake device and tap "Clear AsyncStorage"

### Login/Registration not working
- Check terminal for error messages
- Make sure database is initialized (check for "Database initialized successfully" message)

## Success Criteria

✅ User can register a new account
✅ User can login with existing account
✅ User can create courses
✅ User can create lectures within courses
✅ User can record audio and see transcripts
✅ All data persists after app restart
✅ User can logout and login again
✅ User can delete courses and lectures
✅ All UI text is in English
✅ No Chinese text appears in the interface

## Next Steps for Production

If you want to make this production-ready, you would need to:
1. Implement proper password hashing (bcrypt, argon2)
2. Add cloud database (Firebase, Supabase, etc.)
3. Implement user authentication tokens (JWT)
4. Add data encryption for sensitive information
5. Implement proper error handling and logging
6. Add data backup and restore functionality
7. Implement the Summary and Note features
8. Add language translation functionality
9. Improve UI/UX based on user feedback
10. Add comprehensive testing (unit, integration, E2E)

