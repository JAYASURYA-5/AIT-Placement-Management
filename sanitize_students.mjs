import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

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

async function fixStudentRecords() {
  console.log('--- SANITIZING FIRESTORE STUDENT PERCENTAGES ---');
  const userSnapshot = await getDocs(collection(db, 'users'));
  
  for (const docSnap of userSnapshot.docs) {
    const d = docSnap.data();
    const updates = {};
    
    // Fix 12th percentage if stored as decimal fraction (0.76 -> 76%, 0.798 -> 79.8%)
    let raw12th = d.twelfthPercentage || d['12th % or Diploma %'] || d['12th %'] || '';
    let num12th = parseFloat(String(raw12th).replace(/[^0-9.]/g, ''));
    if (!isNaN(num12th) && num12th > 0 && num12th <= 1.0) {
      updates.twelfthPercentage = `${(num12th * 100).toFixed(2).replace(/\.00$/, '')}%`;
    }

    // Fix 10th percentage if stored as decimal fraction
    let raw10th = d.tenthPercentage || d['10th %'] || '';
    let num10th = parseFloat(String(raw10th).replace(/[^0-9.]/g, ''));
    if (!isNaN(num10th) && num10th > 0 && num10th <= 1.0) {
      updates.tenthPercentage = `${(num10th * 100).toFixed(2).replace(/\.00$/, '')}%`;
    }

    // Fix department typo 'clvil' -> 'Civil'
    let dept = d.department || d.Department || d.branch || '';
    if (String(dept).toLowerCase().includes('clvil')) {
      updates.department = 'Civil';
    }

    if (Object.keys(updates).length > 0) {
      console.log(`Updating student ID ${docSnap.id} (${d.name}):`, updates);
      await updateDoc(doc(db, 'users', docSnap.id), updates);
    }
  }

  console.log('✅ Student records in Firestore sanitized successfully!');
}

fixStudentRecords().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
