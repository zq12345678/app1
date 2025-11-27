import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

let db = null;

// Initialize database
export const initDatabase = async () => {
  try {
    // Check if running in web environment
    if (Platform.OS === 'web') {
      console.warn('SQLite is not available in web environment');
      throw new Error('SQLite is not supported in web/Snack environment. Please use Expo Go app or local development.');
    }

    console.log('Opening database...');
    db = await SQLite.openDatabaseAsync('noteapp.db');
    console.log('Database opened successfully');

    // Create users table
    console.log('Creating users table...');
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Users table created');

    // Create courses table
    console.log('Creating courses table...');
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      );
    `);
    console.log('Courses table created');

    // Create lectures table
    console.log('Creating lectures table...');
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS lectures (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        course_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        lecture_number INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
      );
    `);
    console.log('Lectures table created');

    // Create transcripts table
    console.log('Creating transcripts table...');
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS transcripts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        lecture_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        timestamp INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (lecture_id) REFERENCES lectures (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
      );
    `);
    console.log('Transcripts table created');

    console.log('✅ Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Get database instance
export const getDatabase = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
};

// User operations
export const createUser = async (email, username, password) => {
  try {
    const database = getDatabase();
    const result = await database.runAsync(
      'INSERT INTO users (email, username, password) VALUES (?, ?, ?)',
      [email, username, password]
    );
    return result.lastInsertRowId;
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      throw new Error('Email already exists');
    }
    throw error;
  }
};

export const getUserByEmail = async (email) => {
  try {
    const database = getDatabase();
    const user = await database.getFirstAsync(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    const database = getDatabase();
    const user = await database.getFirstAsync(
      'SELECT id, email, username, created_at FROM users WHERE id = ?',
      [userId]
    );
    return user;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
};

// Course operations
export const createCourse = async (userId, name) => {
  try {
    const database = getDatabase();
    const result = await database.runAsync(
      'INSERT INTO courses (user_id, name) VALUES (?, ?)',
      [userId, name]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

export const getCoursesByUserId = async (userId) => {
  try {
    const database = getDatabase();
    const courses = await database.getAllAsync(
      'SELECT * FROM courses WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return courses;
  } catch (error) {
    console.error('Error getting courses:', error);
    throw error;
  }
};

export const deleteCourse = async (courseId, userId) => {
  try {
    const database = getDatabase();
    // Delete associated lectures and transcripts first
    await database.runAsync(
      'DELETE FROM transcripts WHERE lecture_id IN (SELECT id FROM lectures WHERE course_id = ? AND user_id = ?)',
      [courseId, userId]
    );
    await database.runAsync(
      'DELETE FROM lectures WHERE course_id = ? AND user_id = ?',
      [courseId, userId]
    );
    await database.runAsync(
      'DELETE FROM courses WHERE id = ? AND user_id = ?',
      [courseId, userId]
    );
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

// Lecture operations
export const createLecture = async (courseId, userId, title, lectureNumber) => {
  try {
    const database = getDatabase();
    const result = await database.runAsync(
      'INSERT INTO lectures (course_id, user_id, title, lecture_number) VALUES (?, ?, ?, ?)',
      [courseId, userId, title, lectureNumber]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error creating lecture:', error);
    throw error;
  }
};

export const getLecturesByCourseId = async (courseId, userId) => {
  try {
    const database = getDatabase();
    const lectures = await database.getAllAsync(
      'SELECT * FROM lectures WHERE course_id = ? AND user_id = ? ORDER BY created_at DESC',
      [courseId, userId]
    );
    return lectures;
  } catch (error) {
    console.error('Error getting lectures:', error);
    throw error;
  }
};

export const deleteLecture = async (lectureId, userId) => {
  try {
    const database = getDatabase();
    // Delete associated transcripts first
    await database.runAsync(
      'DELETE FROM transcripts WHERE lecture_id = ? AND user_id = ?',
      [lectureId, userId]
    );
    await database.runAsync(
      'DELETE FROM lectures WHERE id = ? AND user_id = ?',
      [lectureId, userId]
    );
  } catch (error) {
    console.error('Error deleting lecture:', error);
    throw error;
  }
};

// Transcript operations
export const createTranscript = async (lectureId, userId, content, timestamp = 0) => {
  try {
    const database = getDatabase();
    const result = await database.runAsync(
      'INSERT INTO transcripts (lecture_id, user_id, content, timestamp) VALUES (?, ?, ?, ?)',
      [lectureId, userId, content, timestamp]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error creating transcript:', error);
    throw error;
  }
};

export const getTranscriptsByLectureId = async (lectureId, userId) => {
  try {
    const database = getDatabase();
    const transcripts = await database.getAllAsync(
      'SELECT * FROM transcripts WHERE lecture_id = ? AND user_id = ? ORDER BY timestamp ASC',
      [lectureId, userId]
    );
    return transcripts;
  } catch (error) {
    console.error('Error getting transcripts:', error);
    throw error;
  }
};

export const deleteTranscript = async (transcriptId, userId) => {
  try {
    const database = getDatabase();
    await database.runAsync(
      'DELETE FROM transcripts WHERE id = ? AND user_id = ?',
      [transcriptId, userId]
    );
  } catch (error) {
    console.error('Error deleting transcript:', error);
    throw error;
  }
};

