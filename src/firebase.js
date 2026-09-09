import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  addDoc,
  writeBatch
} from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Check if user set custom API key in localStorage
const storedApiKey = typeof window !== 'undefined' ? localStorage.getItem('ait_firebase_api_key') : null;
const effectiveApiKey = storedApiKey || import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCB94cLagGujab5COyw4lHKS1wc2E4IP2I';

// ── Live Firebase Configuration for Project: AIT-Placement (ait-placement-35053) ──
export const firebaseConfig = {
  apiKey: effectiveApiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'ait-placement-35053.firebaseapp.com',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || 'https://ait-placement-35053-default-rtdb.firebaseio.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'ait-placement-35053',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'ait-placement-35053.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '989154595495',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:989154595495:web:a072cfe107247b41320182',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-0MSJ1FVVKE'
};

// Initialize Firebase instance safely
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics asynchronously if supported in the browser environment
export let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch((err) => console.warn('Analytics not initialized:', err));
}

/**
 * Fetch all users/students stored in Firestore 'users' collection with full 26 attributes
 */
export async function fetchUsersFromFirestore() {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const firestoreUsers = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      firestoreUsers.push({
        id: docSnap.id,
        uid: docSnap.id,
        regNo: data.regNo || data.reg_no || '',
        name: data.name || data.email?.split('@')[0] || 'User',
        department: data.department || data.branch || '',
        tenthPercentage: data.tenthPercentage || data.tenth || '',
        twelfthPercentage: data.twelfthPercentage || data.twelfth || data.diploma || '',
        cgpa: data.cgpa || '',
        mobile: data.mobile || data.phone || '',
        email: data.email || '',
        yearOfPassing: data.yearOfPassing || data.yop || '',
        historyOfArrears: data.historyOfArrears || '0',
        currentArrears: data.currentArrears || '0',
        permanentAddress: data.permanentAddress || data.address || '',
        nativeDistrict: data.nativeDistrict || data.district || '',
        parentMobile: data.parentMobile || '',
        dob: data.dob || '',
        gender: data.gender || '',
        certifications: data.certifications || '',
        technicalSkills: data.technicalSkills || data.skills || '',
        languagesKnown: data.languagesKnown || '',
        wishToWork: data.wishToWork || '',
        willingInterviewAnyLocation: data.willingInterviewAnyLocation || 'Yes',
        willingWorkAnyLocation: data.willingWorkAnyLocation || 'Yes',
        willingWorkTN: data.willingWorkTN || 'Yes',
        willingWorkIndia: data.willingWorkIndia || 'Yes',
        futurePlan: data.futurePlan || '',
        resumeUrl: data.resumeUrl || data.resume || '',
        role: data.role || 'Student',
        status: data.status || 'Active',
        joined: data.joined || (data.createdAt ? new Date(data.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recently'),
        provider: 'firebase'
      });
    });
    return firestoreUsers;
  } catch (error) {
    console.error('Error fetching users from Firestore:', error);
    return [];
  }
}

/**
 * Add a student or user profile directly to Firestore database with full 26 attributes
 */
export async function addStudentToFirestore(studentData) {
  try {
    const docRef = doc(collection(db, 'users'));
    const dataToSave = {
      uid: docRef.id,
      regNo: studentData.regNo || '',
      name: studentData.name || '',
      department: studentData.department || studentData.branch || '',
      tenthPercentage: studentData.tenthPercentage || '',
      twelfthPercentage: studentData.twelfthPercentage || '',
      cgpa: studentData.cgpa || '',
      mobile: studentData.mobile || '',
      email: studentData.email || '',
      yearOfPassing: studentData.yearOfPassing || '',
      historyOfArrears: studentData.historyOfArrears || '0',
      currentArrears: studentData.currentArrears || '0',
      permanentAddress: studentData.permanentAddress || '',
      nativeDistrict: studentData.nativeDistrict || '',
      parentMobile: studentData.parentMobile || '',
      dob: studentData.dob || '',
      gender: studentData.gender || '',
      certifications: studentData.certifications || '',
      technicalSkills: studentData.technicalSkills || '',
      languagesKnown: studentData.languagesKnown || '',
      wishToWork: studentData.wishToWork || '',
      willingInterviewAnyLocation: studentData.willingInterviewAnyLocation || 'Yes',
      willingWorkAnyLocation: studentData.willingWorkAnyLocation || 'Yes',
      willingWorkTN: studentData.willingWorkTN || 'Yes',
      willingWorkIndia: studentData.willingWorkIndia || 'Yes',
      futurePlan: studentData.futurePlan || '',
      resumeUrl: studentData.resumeUrl || '',
      role: studentData.role || 'Student',
      status: studentData.status || 'Active',
      joined: studentData.joined || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      createdAt: new Date().toISOString()
    };
    await setDoc(docRef, dataToSave);
    console.log('✅ Student saved to Firestore with ID:', docRef.id);
    return { success: true, id: docRef.id, data: dataToSave };
  } catch (error) {
    console.error('Error adding student to Firestore:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Bulk save multiple students/users parsed from Excel/CSV to Firestore database using writeBatch
 */
export async function batchAddStudentsToFirestore(studentsArray) {
  if (!Array.isArray(studentsArray) || studentsArray.length === 0) {
    return { success: false, count: 0, error: 'No student data provided' };
  }

  try {
    const CHUNK_SIZE = 450;
    const addedRecords = [];

    for (let i = 0; i < studentsArray.length; i += CHUNK_SIZE) {
      const chunk = studentsArray.slice(i, i + CHUNK_SIZE);
      const batch = writeBatch(db);

      chunk.forEach((student) => {
        const docRef = doc(collection(db, 'users'));
        const record = {
          uid: docRef.id,
          regNo: student.regNo || student.reg_no || student['Register Number'] || student['Register No'] || student['Reg No'] || '',
          name: student.name || student.Name || student['Name of the Student'] || student['Student Name'] || 'Imported Student',
          department: student.department || student.Department || student.branch || student['Branch'] || '',
          tenthPercentage: student.tenthPercentage || student['10th %'] || student['10th Percentage'] || '',
          twelfthPercentage: student.twelfthPercentage || student['12th % or Diploma %'] || student['12th %'] || student['Diploma %'] || '',
          cgpa: student.cgpa || student['CGPA till last (VI) semester'] || student['CGPA'] || '',
          mobile: student.mobile || student['Mobile Number'] || student['Mobile'] || student['Phone'] || '',
          email: student.email || student.Email || student['Email ID'] || '',
          yearOfPassing: student.yearOfPassing || student['Year of Passing'] || student['YOP'] || '',
          historyOfArrears: student.historyOfArrears || student['History of arrears (Number of arrears cleared from first semester)'] || student['History of Arrears'] || '0',
          currentArrears: student.currentArrears || student['Number of CURRENT arrears'] || student['Current Arrears'] || '0',
          permanentAddress: student.permanentAddress || student['Permanent Address'] || student['Address'] || '',
          nativeDistrict: student.nativeDistrict || student['Native Place District'] || student['District'] || '',
          parentMobile: student.parentMobile || student["Parent's Mobile Number"] || student['Parent Mobile'] || '',
          dob: student.dob || student['Date of Birth'] || student['DOB'] || '',
          gender: student.gender || student['Gender'] || '',
          certifications: student.certifications || student['Certification Courses'] || student['Certifications'] || '',
          technicalSkills: student.technicalSkills || student['Technical Skills'] || student['Skills'] || '',
          languagesKnown: student.languagesKnown || student['Languages Known'] || student['Languages'] || '',
          wishToWork: student.wishToWork || student['I wish to work'] || '',
          willingInterviewAnyLocation: student.willingInterviewAnyLocation || student['Willing to attend interview in any location'] || 'Yes',
          willingWorkAnyLocation: student.willingWorkAnyLocation || student['Willing to work in any location'] || 'Yes',
          willingWorkTN: student.willingWorkTN || student['Willing to work in any location in Tamil Nadu'] || 'Yes',
          willingWorkIndia: student.willingWorkIndia || student['Willing to work in any location in India'] || 'Yes',
          futurePlan: student.futurePlan || student['Future plan (If you do not require placement assistance)'] || student['Future Plan'] || '',
          resumeUrl: student.resumeUrl || student['UPLOAD RESUME UPDATED RESUME'] || student['Resume Link'] || student['Resume'] || '',
          role: student.role || student.Role || 'Student',
          status: student.status || student.Status || 'Active',
          joined: student.joined || student.Joined || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          createdAt: new Date().toISOString()
        };
        batch.set(docRef, record);
        addedRecords.push({ id: docRef.id, ...record });
      });

      await batch.commit();
    }

    console.log(`✅ Bulk saved ${addedRecords.length} detailed student profiles to Firestore dataset`);
    return { success: true, count: addedRecords.length, records: addedRecords };
  } catch (error) {
    console.error('Error bulk adding students to Firestore:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update an existing student or user document in Firestore database with full 26 attributes
 */
export async function updateStudentInFirestore(id, studentData) {
  try {
    if (!id) return { success: false, error: 'No document ID provided' };
    const docRef = doc(db, 'users', id);
    const dataToUpdate = {
      regNo: studentData.regNo || '',
      name: studentData.name || '',
      department: studentData.department || studentData.branch || '',
      tenthPercentage: studentData.tenthPercentage || '',
      twelfthPercentage: studentData.twelfthPercentage || '',
      cgpa: studentData.cgpa || '',
      mobile: studentData.mobile || '',
      email: studentData.email || '',
      yearOfPassing: studentData.yearOfPassing || '',
      historyOfArrears: studentData.historyOfArrears || '0',
      currentArrears: studentData.currentArrears || '0',
      permanentAddress: studentData.permanentAddress || '',
      nativeDistrict: studentData.nativeDistrict || '',
      parentMobile: studentData.parentMobile || '',
      dob: studentData.dob || '',
      gender: studentData.gender || '',
      certifications: studentData.certifications || '',
      technicalSkills: studentData.technicalSkills || '',
      languagesKnown: studentData.languagesKnown || '',
      wishToWork: studentData.wishToWork || '',
      willingInterviewAnyLocation: studentData.willingInterviewAnyLocation || 'Yes',
      willingWorkAnyLocation: studentData.willingWorkAnyLocation || 'Yes',
      willingWorkTN: studentData.willingWorkTN || 'Yes',
      willingWorkIndia: studentData.willingWorkIndia || 'Yes',
      futurePlan: studentData.futurePlan || '',
      resumeUrl: studentData.resumeUrl || '',
      role: studentData.role || 'Student',
      status: studentData.status || 'Active',
      updatedAt: new Date().toISOString()
    };
    await updateDoc(docRef, dataToUpdate);
    console.log('✅ Student updated in Firestore for ID:', id);
    return { success: true, id, data: dataToUpdate };
  } catch (error) {
    console.error('Error updating student in Firestore:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete a single student/user document from Firestore database by document ID
 */
export async function deleteStudentFromFirestore(id) {
  try {
    if (!id) return { success: false, error: 'No document ID provided' };
    await deleteDoc(doc(db, 'users', id));
    console.log('✅ Deleted user document from Firestore:', id);
    return { success: true };
  } catch (error) {
    console.error('Error deleting user from Firestore:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete ALL student/user documents from Firestore database 'users' collection
 */
export async function clearAllUsersFromFirestore() {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    if (querySnapshot.empty) {
      return { success: true, count: 0 };
    }

    const CHUNK_SIZE = 450;
    const docs = querySnapshot.docs;
    let deletedCount = 0;

    for (let i = 0; i < docs.length; i += CHUNK_SIZE) {
      const chunk = docs.slice(i, i + CHUNK_SIZE);
      const batch = writeBatch(db);
      chunk.forEach((docSnap) => {
        batch.delete(docSnap.ref);
        deletedCount++;
      });
      await batch.commit();
    }

    console.log(`✅ Cleared all ${deletedCount} user documents from Firestore users collection`);
    return { success: true, count: deletedCount };
  } catch (error) {
    console.error('Error clearing users from Firestore:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Checks if Firebase API Key is provided or placeholder
 */
export function isFirebaseRealApiKey() {
  const key = firebaseConfig.apiKey;
  return Boolean(key && !key.includes('Placeholder') && key.trim().length > 10);
}

/**
 * Save custom API Key to local storage and refresh page to connect
 */
export function saveFirebaseApiKey(newApiKey) {
  if (!newApiKey || !newApiKey.trim()) return false;
  localStorage.setItem('ait_firebase_api_key', newApiKey.trim());
  window.location.reload();
  return true;
}

/**
 * Reset API key to default
 */
export function clearCustomApiKey() {
  localStorage.removeItem('ait_firebase_api_key');
  window.location.reload();
}

/**
 * Get Firebase Connection Details
 */
export function getFirebaseProjectInfo() {
  return {
    projectName: 'AIT-Placement',
    projectId: firebaseConfig.projectId,
    projectNumber: firebaseConfig.messagingSenderId,
    authDomain: firebaseConfig.authDomain,
    apiKey: firebaseConfig.apiKey,
    appId: firebaseConfig.appId,
    isApiKeySet: isFirebaseRealApiKey(),
    isCustomKey: Boolean(storedApiKey)
  };
}

/**
 * Log in a user using Firebase Auth and fetch/sync their profile from Firestore.
 */
export async function loginWithFirebase(email, password, expectedRole) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Check if user profile document exists in Firestore 'users' collection
    let userProfile = null;
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        userProfile = docSnap.data();
      }
    } catch (err) {
      console.warn('Firestore fetch failed during login:', err);
    }

    const role = userProfile?.role || expectedRole || 'Student';
    const name = userProfile?.name || user.displayName || email.split('@')[0];

    const resultUser = {
      uid: user.uid,
      email: user.email,
      name: name,
      role: role,
      regNo: userProfile?.regNo || userProfile?.reg_no || '',
      branch: userProfile?.branch || '',
      batch: userProfile?.batch || '',
      provider: 'firebase'
    };

    localStorage.setItem('ait-profile', JSON.stringify(resultUser));

    return {
      success: true,
      user: resultUser,
      message: `Successfully logged in via Firebase Auth! Welcome ${name}.`
    };
  } catch (error) {
    console.error('Firebase Auth Login Error:', error);
    const isApiKeyError = isApiKeyRelatedError(error);
    return {
      success: false,
      code: error.code,
      isApiKeyError: isApiKeyError,
      message: getFriendlyAuthErrorMessage(error)
    };
  }
}

/**
 * Register a new user in Firebase Auth and save user profile to Firestore database.
 */
export async function registerWithFirebase(email, password, role, name, regNo = '') {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const profileData = {
      uid: user.uid,
      name: name || email.split('@')[0],
      email: email,
      role: role,
      regNo: regNo,
      createdAt: new Date().toISOString()
    };

    // Save user profile to Firestore 'users' collection with full error reporting
    try {
      await setDoc(doc(db, 'users', user.uid), profileData);
      console.log('✅ Registered user saved to Firestore:', profileData);
    } catch (fsError) {
      console.error('❌ Firestore write failed during registration:', fsError);
      if (fsError.code === 'permission-denied') {
        return {
          success: false,
          code: fsError.code,
          message: 'Firestore Permission Denied! Go to Firebase Console -> Cloud Firestore -> Rules tab and set rules to allow read & write.'
        };
      }
    }

    localStorage.setItem('ait-profile', JSON.stringify(profileData));

    return {
      success: true,
      user: profileData,
      message: `Account created successfully in Firebase Database for ${email}!`
    };
  } catch (error) {
    console.error('Firebase Auth Register Error:', error);
    const isApiKeyError = isApiKeyRelatedError(error);
    return {
      success: false,
      code: error.code,
      isApiKeyError: isApiKeyError,
      message: getFriendlyAuthErrorMessage(error)
    };
  }
}

/**
 * Logout current user from Firebase
 */
export async function logoutFirebase() {
  try {
    await signOut(auth);
    localStorage.removeItem('ait-profile');
    return { success: true };
  } catch (error) {
    console.error('Firebase Logout Error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Check if an error object is related to an invalid/missing API key
 */
function isApiKeyRelatedError(error) {
  const codeStr = (error.code || '').toLowerCase();
  const msgStr = (error.message || '').toLowerCase();
  return (
    codeStr.includes('api-key') ||
    codeStr.includes('invalid-key') ||
    msgStr.includes('api-key') ||
    msgStr.includes('api key') ||
    msgStr.includes('invalid-api-key')
  );
}

/**
 * Helper to convert Firebase error codes to readable messages
 */
function getFriendlyAuthErrorMessage(error) {
  if (isApiKeyRelatedError(error)) {
    return '🔑 Firebase Web API Key is missing or invalid. Please check your .env configuration.';
  }

  switch (error.code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid credentials. Please verify your email and password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists in Firebase Auth. Try signing in instead.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    default:
      return error.message || 'Firebase authentication failed. Check your console logs.';
  }
}

/**
 * Fetch all placement drives from Firestore 'drives' collection
 */
export async function fetchDrivesFromFirestore() {
  try {
    const querySnapshot = await getDocs(collection(db, 'drives'));
    const firestoreDrives = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      firestoreDrives.push({
        id: docSnap.id,
        company: data.company || '',
        date: data.date || '',
        role: data.role || '',
        minCGPA: String(data.minCGPA || '6.5'),
        branches: data.branches || 'All Branches',
        maxBacklogs: String(data.maxBacklogs || '0'),
        bond: data.bond || 'No Bond',
        package: data.package || '',
        location: data.location || '',
        status: data.status || 'Upcoming',
        nominatedStudents: data.nominatedStudents || [],
        createdAt: data.createdAt || ''
      });
    });
    return firestoreDrives;
  } catch (error) {
    console.error('Error fetching drives from Firestore:', error);
    return [];
  }
}

/**
 * Add a placement drive to Firestore
 */
export async function addDriveToFirestore(driveData) {
  try {
    const docRef = doc(collection(db, 'drives'));
    const record = {
      company: driveData.company || '',
      date: driveData.date || '',
      role: driveData.role || '',
      minCGPA: String(driveData.minCGPA || '6.5'),
      branches: driveData.branches || 'CSE, IT, ECE',
      maxBacklogs: String(driveData.maxBacklogs || '0'),
      bond: driveData.bond || 'No Bond',
      package: driveData.package || '',
      location: driveData.location || '',
      status: driveData.status || 'Upcoming',
      nominatedStudents: driveData.nominatedStudents || [],
      createdAt: new Date().toISOString()
    };
    await setDoc(docRef, record);
    console.log('✅ Placement Drive saved to Firestore ID:', docRef.id);
    return { success: true, id: docRef.id, data: record };
  } catch (error) {
    console.error('Error adding drive to Firestore:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update a placement drive in Firestore (including nominated candidates)
 */
export async function updateDriveInFirestore(driveId, updatedData) {
  try {
    const docRef = doc(db, 'drives', String(driveId));
    await updateDoc(docRef, updatedData);
    console.log('✅ Placement Drive updated in Firestore:', driveId);
    return { success: true };
  } catch (error) {
    console.error('Error updating drive in Firestore:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete a placement drive from Firestore
 */
export async function deleteDriveFromFirestore(driveId) {
  try {
    const docRef = doc(db, 'drives', String(driveId));
    await deleteDoc(docRef);
    console.log('✅ Drive deleted from Firestore:', driveId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting drive from Firestore:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Batch add drives to Firestore from Excel/CSV import
 */
export async function batchAddDrivesToFirestore(drivesArray) {
  if (!Array.isArray(drivesArray) || drivesArray.length === 0) {
    return { success: false, count: 0, error: 'No drives data provided' };
  }

  try {
    const batch = writeBatch(db);
    const addedDrives = [];

    drivesArray.forEach((drive) => {
      const docRef = doc(collection(db, 'drives'));
      const record = {
        company: drive.company || '',
        date: drive.date || '',
        role: drive.role || '',
        minCGPA: String(drive.minCGPA || '6.5'),
        branches: drive.branches || 'All Branches',
        maxBacklogs: String(drive.maxBacklogs || '0'),
        bond: drive.bond || 'No Bond',
        package: drive.package || '',
        location: drive.location || '',
        status: drive.status || 'Upcoming',
        nominatedStudents: drive.nominatedStudents || [],
        createdAt: new Date().toISOString()
      };
      batch.set(docRef, record);
      addedDrives.push({ id: docRef.id, ...record });
    });

    await batch.commit();
    console.log(`✅ Batch added ${addedDrives.length} drives to Firestore`);
    return { success: true, count: addedDrives.length, records: addedDrives };
  } catch (error) {
    console.error('Error batch adding drives to Firestore:', error);
    return { success: false, error: error.message };
  }
}


export { onAuthStateChanged };
