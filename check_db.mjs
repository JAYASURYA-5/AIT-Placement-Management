import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCB94cLagGujab5COyw4lHKS1wc2E4IP2I',
  authDomain: 'ait-placement-35053.firebaseapp.com',
  databaseURL: 'https://ait-placement-35053-default-rtdb.firebaseio.com',
  projectId: 'ait-placement-35053',
  storageBucket: 'ait-placement-35053.firebasestorage.app',
  messagingSenderId: '989154595495',
  appId: '1:989154595495:web:a072cfe107247b41320182'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkDatabase() {
  console.log('--- FETCHING USERS FROM FIRESTORE ---');
  const userSnapshot = await getDocs(collection(db, 'users'));
  console.log(`Total users in Firestore: ${userSnapshot.size}`);
  
  userSnapshot.forEach(docSnap => {
    const d = docSnap.data();
    console.log(`\nID: ${docSnap.id}`);
    console.log(`Name: ${d.name || d.Name || d['Name of the Student']}`);
    console.log(`RegNo: ${d.regNo || d['Register Number']}`);
    console.log(`Dept: ${d.department || d.Department || d.branch || d['Branch']}`);
    console.log(`Gender: ${d.gender || d.Gender}`);
    console.log(`10th: ${d.tenthPercentage || d['10th %']}`);
    console.log(`12th: ${d.twelfthPercentage || d['12th % or Diploma %']}`);
    console.log(`CGPA: ${d.cgpa || d['CGPA till last (VI) semester']}`);
    console.log(`Arrears: ${d.currentArrears || d['Number of CURRENT arrears']}`);
  });

  console.log('\n--- FETCHING DRIVES FROM FIRESTORE ---');
  const driveSnapshot = await getDocs(collection(db, 'drives'));
  console.log(`Total drives in Firestore: ${driveSnapshot.size}`);
  driveSnapshot.forEach(docSnap => {
    const d = docSnap.data();
    console.log(`\nDrive ID: ${docSnap.id}`);
    console.log(`Company: ${d.company}`);
    console.log(`Role: ${d.role}`);
    console.log(`MinCGPA: ${d.minCGPA}`);
    console.log(`Min10th: ${d.min10thMark}`);
    console.log(`Min12th: ${d.min12thMark}`);
    console.log(`Gender: ${d.gender}`);
    console.log(`Branches: ${d.branches}`);
    console.log(`MaxBacklogs: ${d.maxBacklogs}`);
  });
}

checkDatabase().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
