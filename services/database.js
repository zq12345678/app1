import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const USERS_KEY = '@users_storage';
const COURSES_KEY = '@courses_storage';
const LECTURES_KEY = '@lectures_storage';
const TRANSCRIPTS_KEY = '@transcripts_storage';

// ID counters
let userIdCounter = 1;
let courseIdCounter = 1;
let lectureIdCounter = 1;
let transcriptIdCounter = 1;

// Initialize database (AsyncStorage version)
export const initDatabase = async () => {
  try {
    // Initialize all storage keys if they don't exist
    const keys = [USERS_KEY, COURSES_KEY, LECTURES_KEY, TRANSCRIPTS_KEY];
    for (const key of keys) {
      const existing = await AsyncStorage.getItem(key);
      if (!existing) {
        await AsyncStorage.setItem(key, JSON.stringify([]));
      }
    }

    // Calculate max IDs
    const users = JSON.parse(await AsyncStorage.getItem(USERS_KEY) || '[]');
    const courses = JSON.parse(await AsyncStorage.getItem(COURSES_KEY) || '[]');
    const lectures = JSON.parse(await AsyncStorage.getItem(LECTURES_KEY) || '[]');
    const transcripts = JSON.parse(await AsyncStorage.getItem(TRANSCRIPTS_KEY) || '[]');

    if (users.length > 0) userIdCounter = Math.max(...users.map(u => u.id)) + 1;
    if (courses.length > 0) courseIdCounter = Math.max(...courses.map(c => c.id)) + 1;
    if (lectures.length > 0) lectureIdCounter = Math.max(...lectures.map(l => l.id)) + 1;
    if (transcripts.length > 0) transcriptIdCounter = Math.max(...transcripts.map(t => t.id)) + 1;

    console.log('✅ AsyncStorage database initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Get database instance (for compatibility)
export const getDatabase = () => {
  return { initialized: true };
};

// User operations
export const createUser = async (email, username, password) => {
  try {
    const users = JSON.parse(await AsyncStorage.getItem(USERS_KEY) || '[]');

    // Check if email already exists
    if (users.find(u => u.email === email)) {
      throw new Error('Email already exists');
    }

    const newUser = {
      id: userIdCounter++,
      email,
      username,
      password,
      created_at: new Date().toISOString(),
    };

    users.push(newUser);
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    return newUser.id;
  } catch (error) {
    throw error;
  }
};

export const getUserByEmail = async (email) => {
  try {
    const users = JSON.parse(await AsyncStorage.getItem(USERS_KEY) || '[]');
    return users.find(u => u.email === email) || null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    const users = JSON.parse(await AsyncStorage.getItem(USERS_KEY) || '[]');
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

export const updateUsername = async (userId, newUsername) => {
  try {
    const users = JSON.parse(await AsyncStorage.getItem(USERS_KEY) || '[]');
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    users[userIndex].username = newUsername;
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));

    const { password, ...userWithoutPassword } = users[userIndex];
    return userWithoutPassword;
  } catch (error) {
    console.error('Error updating username:', error);
    throw error;
  }
};

// Course operations
export const createCourse = async (userId, name) => {
  try {
    const courses = JSON.parse(await AsyncStorage.getItem(COURSES_KEY) || '[]');

    const newCourse = {
      id: courseIdCounter++,
      user_id: userId,
      name,
      created_at: new Date().toISOString(),
    };

    courses.push(newCourse);
    await AsyncStorage.setItem(COURSES_KEY, JSON.stringify(courses));
    return newCourse.id;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

export const getCoursesByUserId = async (userId) => {
  try {
    const courses = JSON.parse(await AsyncStorage.getItem(COURSES_KEY) || '[]');
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
    // Delete associated lectures and transcripts first
    const lectures = JSON.parse(await AsyncStorage.getItem(LECTURES_KEY) || '[]');
    const lectureIds = lectures.filter(l => l.course_id === courseId && l.user_id === userId).map(l => l.id);

    const transcripts = JSON.parse(await AsyncStorage.getItem(TRANSCRIPTS_KEY) || '[]');
    const filteredTranscripts = transcripts.filter(t => !lectureIds.includes(t.lecture_id));
    await AsyncStorage.setItem(TRANSCRIPTS_KEY, JSON.stringify(filteredTranscripts));

    const filteredLectures = lectures.filter(l => !(l.course_id === courseId && l.user_id === userId));
    await AsyncStorage.setItem(LECTURES_KEY, JSON.stringify(filteredLectures));

    const courses = JSON.parse(await AsyncStorage.getItem(COURSES_KEY) || '[]');
    const filteredCourses = courses.filter(c => !(c.id === courseId && c.user_id === userId));
    await AsyncStorage.setItem(COURSES_KEY, JSON.stringify(filteredCourses));
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

// Lecture operations
export const createLecture = async (courseId, userId, title, lectureNumber) => {
  try {
    const lectures = JSON.parse(await AsyncStorage.getItem(LECTURES_KEY) || '[]');

    const newLecture = {
      id: lectureIdCounter++,
      course_id: courseId,
      user_id: userId,
      title,
      lecture_number: lectureNumber,
      created_at: new Date().toISOString(),
    };

    lectures.push(newLecture);
    await AsyncStorage.setItem(LECTURES_KEY, JSON.stringify(lectures));
    return newLecture.id;
  } catch (error) {
    console.error('Error creating lecture:', error);
    throw error;
  }
};

export const getLecturesByCourseId = async (courseId, userId) => {
  try {
    const lectures = JSON.parse(await AsyncStorage.getItem(LECTURES_KEY) || '[]');
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
    // Delete associated transcripts first
    const transcripts = JSON.parse(await AsyncStorage.getItem(TRANSCRIPTS_KEY) || '[]');
    const filteredTranscripts = transcripts.filter(t => !(t.lecture_id === lectureId && t.user_id === userId));
    await AsyncStorage.setItem(TRANSCRIPTS_KEY, JSON.stringify(filteredTranscripts));

    const lectures = JSON.parse(await AsyncStorage.getItem(LECTURES_KEY) || '[]');
    const filteredLectures = lectures.filter(l => !(l.id === lectureId && l.user_id === userId));
    await AsyncStorage.setItem(LECTURES_KEY, JSON.stringify(filteredLectures));
  } catch (error) {
    console.error('Error deleting lecture:', error);
    throw error;
  }
};

// Transcript operations
export const createTranscript = async (lectureId, userId, content, timestamp = 0) => {
  try {
    const transcripts = JSON.parse(await AsyncStorage.getItem(TRANSCRIPTS_KEY) || '[]');

    const newTranscript = {
      id: transcriptIdCounter++,
      lecture_id: lectureId,
      user_id: userId,
      content,
      timestamp,
      created_at: new Date().toISOString(),
    };

    transcripts.push(newTranscript);
    await AsyncStorage.setItem(TRANSCRIPTS_KEY, JSON.stringify(transcripts));
    return newTranscript.id;
  } catch (error) {
    console.error('Error creating transcript:', error);
    throw error;
  }
};

export const getTranscriptsByLectureId = async (lectureId, userId) => {
  try {
    const transcripts = JSON.parse(await AsyncStorage.getItem(TRANSCRIPTS_KEY) || '[]');
    return transcripts
      .filter(t => t.lecture_id === lectureId && t.user_id === userId)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  } catch (error) {
    console.error('Error getting transcripts:', error);
    throw error;
  }
};

export const deleteTranscript = async (transcriptId, userId) => {
  try {
    const transcripts = JSON.parse(await AsyncStorage.getItem(TRANSCRIPTS_KEY) || '[]');
    const filteredTranscripts = transcripts.filter(t => !(t.id === transcriptId && t.user_id === userId));
    await AsyncStorage.setItem(TRANSCRIPTS_KEY, JSON.stringify(filteredTranscripts));
  } catch (error) {
    console.error('Error deleting transcript:', error);
    throw error;
  }
};

export const updateTranscript = async (transcriptId, userId, newContent) => {
  try {
    const transcripts = JSON.parse(await AsyncStorage.getItem(TRANSCRIPTS_KEY) || '[]');
    const transcriptIndex = transcripts.findIndex(t => t.id === transcriptId && t.user_id === userId);

    if (transcriptIndex === -1) {
      throw new Error('Transcript not found');
    }

    transcripts[transcriptIndex].content = newContent;
    transcripts[transcriptIndex].updated_at = new Date().toISOString();
    await AsyncStorage.setItem(TRANSCRIPTS_KEY, JSON.stringify(transcripts));

    return transcripts[transcriptIndex];
  } catch (error) {
    console.error('Error updating transcript:', error);
    throw error;
  }
};
