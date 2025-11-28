import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const KEYS = {
  USERS: '@users',
  COURSES: '@courses',
  LECTURES: '@lectures',
  TRANSCRIPTS: '@transcripts',
  CURRENT_USER: '@current_user',
};

// Helper functions
const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error(`Error reading ${key}:`, error);
    return [];
  }
};

const setData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
    throw error;
  }
};

// Initialize database (for compatibility)
export const initDatabase = async () => {
  console.log('✅ AsyncStorage initialized (Snack-compatible mode)');
  return true;
};

// Get database instance (for compatibility)
export const getDatabase = () => {
  return true;
};

// User operations
export const createUser = async (email, username, password) => {
  try {
    const users = await getData(KEYS.USERS);

    // Check if email already exists
    if (users.find(u => u.email === email)) {
      throw new Error('Email already exists');
    }

    const newUser = {
      id: Date.now(),
      email,
      username,
      password,
      created_at: new Date().toISOString(),
    };

    users.push(newUser);
    await setData(KEYS.USERS, users);

    return newUser.id;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getUserByEmail = async (email) => {
  try {
    const users = await getData(KEYS.USERS);
    return users.find(u => u.email === email) || null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    const users = await getData(KEYS.USERS);
    const user = users.find(u => u.id === userId);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
};

// Course operations
export const createCourse = async (userId, name) => {
  try {
    const courses = await getData(KEYS.COURSES);

    const newCourse = {
      id: Date.now(),
      user_id: userId,
      name,
      created_at: new Date().toISOString(),
    };

    courses.push(newCourse);
    await setData(KEYS.COURSES, courses);

    return newCourse.id;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

export const getCoursesByUserId = async (userId) => {
  try {
    const courses = await getData(KEYS.COURSES);
    return courses
      .filter(c => c.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } catch (error) {
    console.error('Error getting courses:', error);
    throw error;
  }
};

export const deleteCourse = async (courseId, userId) => {
  try {
    // Delete course
    const courses = await getData(KEYS.COURSES);
    const updatedCourses = courses.filter(c => !(c.id === courseId && c.user_id === userId));
    await setData(KEYS.COURSES, updatedCourses);

    // Delete associated lectures
    const lectures = await getData(KEYS.LECTURES);
    const lectureIds = lectures.filter(l => l.course_id === courseId && l.user_id === userId).map(l => l.id);
    const updatedLectures = lectures.filter(l => !(l.course_id === courseId && l.user_id === userId));
    await setData(KEYS.LECTURES, updatedLectures);

    // Delete associated transcripts
    const transcripts = await getData(KEYS.TRANSCRIPTS);
    const updatedTranscripts = transcripts.filter(t => !lectureIds.includes(t.lecture_id));
    await setData(KEYS.TRANSCRIPTS, updatedTranscripts);
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

export const getLecturesByCourseId = async (courseId, userId) => {
  try {
    const lectures = await getData(KEYS.LECTURES);
    return lectures
      .filter(l => l.course_id === courseId && l.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } catch (error) {
    console.error('Error getting lectures:', error);
    throw error;
  }
};

export const deleteLecture = async (lectureId, userId) => {
  try {
    // Delete lecture
    const lectures = await getData(KEYS.LECTURES);
    const updatedLectures = lectures.filter(l => !(l.id === lectureId && l.user_id === userId));
    await setData(KEYS.LECTURES, updatedLectures);

    // Delete associated transcripts
    const transcripts = await getData(KEYS.TRANSCRIPTS);
    const updatedTranscripts = transcripts.filter(t => !(t.lecture_id === lectureId && t.user_id === userId));
    await setData(KEYS.TRANSCRIPTS, updatedTranscripts);
  } catch (error) {
    console.error('Error deleting lecture:', error);
    throw error;
  }
};

// Transcript operations
export const createTranscript = async (lectureId, userId, content, timestamp = 0) => {
  try {
    const transcripts = await getData(KEYS.TRANSCRIPTS);

    const newTranscript = {
      id: Date.now(),
      lecture_id: lectureId,
      user_id: userId,
      content,
      timestamp,
      created_at: new Date().toISOString(),
    };

    transcripts.push(newTranscript);
    await setData(KEYS.TRANSCRIPTS, transcripts);

    return newTranscript.id;
  } catch (error) {
    console.error('Error creating transcript:', error);
    throw error;
  }
};

export const getTranscriptsByLectureId = async (lectureId, userId) => {
  try {
    const transcripts = await getData(KEYS.TRANSCRIPTS);
    return transcripts
      .filter(t => t.lecture_id === lectureId && t.user_id === userId)
      .sort((a, b) => a.timestamp - b.timestamp);
  } catch (error) {
    console.error('Error getting transcripts:', error);
    throw error;
  }
};

export const deleteTranscript = async (transcriptId, userId) => {
  try {
    const transcripts = await getData(KEYS.TRANSCRIPTS);
    const updatedTranscripts = transcripts.filter(t => !(t.id === transcriptId && t.user_id === userId));
    await setData(KEYS.TRANSCRIPTS, updatedTranscripts);
  } catch (error) {
    console.error('Error deleting transcript:', error);
    throw error;
  }
};

