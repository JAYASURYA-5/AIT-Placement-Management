import React, { useState, useRef, useEffect } from 'react';
import {
  Crown,
  LayoutDashboard,
  Users as UsersIcon,
  Building2,
  Briefcase,
  FileText,
  Sliders,
  Settings,
  Search,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Download,
  X,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Phone,
  Mail,
  GraduationCap,
  Award,
  MapPin,
  ExternalLink,
  Calendar,
  Check,
  Filter
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { fetchUsersFromFirestore, addStudentToFirestore, batchAddStudentsToFirestore, deleteStudentFromFirestore, clearAllUsersFromFirestore } from '../../src/firebase';

export default function UsersPage({ onNavigate }) {
  const [activeNav, setActiveNav] = useState('Student');
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [cgpaFilter, setCgpaFilter] = useState('All');
  const [arrearsFilter, setArrearsFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 10;
  const fileInputRef = useRef(null);

  // Users State initialized empty (No mock data)
  const [users, setUsers] = useState([]);

  // Initial form state supporting all 26 student fields
  const initialFormState = {
    regNo: '',
    name: '',
    department: '',
    tenthPercentage: '',
    twelfthPercentage: '',
    cgpa: '',
    mobile: '',
    email: '',
    yearOfPassing: '',
    historyOfArrears: '0',
    currentArrears: '0',
    permanentAddress: '',
    nativeDistrict: '',
    parentMobile: '',
    dob: '',
    gender: 'Male',
    certifications: '',
    technicalSkills: '',
    languagesKnown: '',
    wishToWork: '',
    willingInterviewAnyLocation: 'Yes',
    willingWorkAnyLocation: 'Yes',
    willingWorkTN: 'Yes',
    willingWorkIndia: 'Yes',
    futurePlan: '',
    resumeUrl: '',
    role: 'Student',
    status: 'Active',
    joined: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  };

  // Form State for Create/Edit
  const [formData, setFormData] = useState(initialFormState);

  // Calculate live stats
  const totalUsersCount = users.length;
  const activeUsersCount = users.filter(u => u.status === 'Active').length;
  const pendingUsersCount = users.filter(u => u.status === 'Pending').length;
  const adminUsersCount = users.filter(u => u.role === 'Admin').length;

  const statCards = [
    { title: 'Total Users', value: totalUsersCount },
    { title: 'Active', value: activeUsersCount },
    { title: 'Pending', value: pendingUsersCount },
    { title: 'Admins', value: adminUsersCount },
  ];

  // Sidebar navigation items
  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Student', icon: UsersIcon },
    { label: 'Companies', icon: Building2 },
    { label: 'Drives', icon: Briefcase },
    { label: 'Reports', icon: FileText },
    { label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (label) => {
    setActiveNav(label);
    if (onNavigate) {
      onNavigate(label);
    }
  };

  // Helper for notification toasts
  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Generate Initials
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  // Format student records from Firestore with avatars & initials
  const formatUsersList = (rawUsers) => {
    const bgColors = ['#e0e7ff', '#dbeafe', '#f3e8ff', '#c7d2fe', '#dcfce7', '#fce7f3'];
    const textColors = ['#4338ca', '#1e40af', '#6b21a8', '#3730a3', '#166534', '#9d174d'];
    return rawUsers.map((u, idx) => ({
      ...u,
      avatarBg: bgColors[idx % bgColors.length],
      avatarColor: textColors[idx % textColors.length],
      initials: getInitials(u.name)
    }));
  };

  const isFilterActive = deptFilter !== 'All' || cgpaFilter !== 'All' || arrearsFilter !== 'All' || statusFilter !== 'All' || searchQuery !== '';

  const handleResetFilters = () => {
    setSearchQuery('');
    setDeptFilter('All');
    setCgpaFilter('All');
    setArrearsFilter('All');
    setStatusFilter('All');
  };

  // Filtered users for search query & multi-criteria filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchQuery || (
      (user.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.regNo || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.department || user.branch || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.role || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.status || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const dept = (user.department || user.branch || '').toUpperCase();
    const matchesDept = deptFilter === 'All' || dept.includes(deptFilter.toUpperCase());

    const userCgpa = parseFloat(user.cgpa) || 0;
    const minCgpa = parseFloat(cgpaFilter) || 0;
    const matchesCgpa = cgpaFilter === 'All' || userCgpa >= minCgpa;

    const userArrears = parseInt(user.currentArrears) || 0;
    let matchesArrears = true;
    if (arrearsFilter === '0') matchesArrears = userArrears === 0;
    else if (arrearsFilter === '1') matchesArrears = userArrears <= 1;
    else if (arrearsFilter === '2') matchesArrears = userArrears <= 2;
    else if (arrearsFilter === 'hasArrears') matchesArrears = userArrears > 0;

    const matchesStatus = statusFilter === 'All' || (user.status || 'Active') === statusFilter;

    return matchesSearch && matchesDept && matchesCgpa && matchesArrears && matchesStatus;
  });

  // Load live student/user records directly from Firebase Firestore Database ONLY
  useEffect(() => {
    async function loadFirestoreUsers() {
      setLoading(true);
      const fsUsers = await fetchUsersFromFirestore();
      if (fsUsers && fsUsers.length > 0) {
        setUsers(formatUsersList(fsUsers));
      } else {
        setUsers([]);
      }
      setLoading(false);
    }
    loadFirestoreUsers();
  }, []);

  // Reset to page 1 on search or filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, deptFilter, cgpaFilter, arrearsFilter, statusFilter]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  // CRUD: Create User (Saves all 26 fields directly to Firebase Firestore Database)
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      showToast('Please fill in required fields (Name & Email)', 'error');
      return;
    }

    setIsSaving(true);
    showToast('Saving student profile to Firebase dataset...', 'info');

    const initials = getInitials(formData.name);
    const bgColors = ['#e0e7ff', '#dbeafe', '#f3e8ff', '#c7d2fe', '#dcfce7', '#fce7f3'];
    const textColors = ['#4338ca', '#1e40af', '#6b21a8', '#3730a3', '#166534', '#9d174d'];
    const randIdx = Math.floor(Math.random() * bgColors.length);

    const userPayload = {
      ...formData,
      joined: formData.joined || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    // Save to Firebase Firestore Database
    const res = await addStudentToFirestore(userPayload);
    setIsSaving(false);

    if (res && res.success) {
      const newUser = {
        id: res.id,
        uid: res.id,
        ...userPayload,
        avatarBg: bgColors[randIdx],
        avatarColor: textColors[randIdx],
        initials,
        provider: 'firebase'
      };

      setUsers([newUser, ...users]);
      setIsAddModalOpen(false);
      setFormData(initialFormState);
      setCurrentPage(1);
      showToast(`User "${newUser.name}" saved to Firebase Dataset!`);
    } else {
      showToast(`Error saving user to Firebase: ${res?.error || 'Unknown error'}`, 'error');
    }
  };

  // CRUD: Open Edit Modal with full 26 fields
  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      regNo: user.regNo || '',
      name: user.name || '',
      department: user.department || user.branch || '',
      tenthPercentage: user.tenthPercentage || '',
      twelfthPercentage: user.twelfthPercentage || '',
      cgpa: user.cgpa || '',
      mobile: user.mobile || '',
      email: user.email || '',
      yearOfPassing: user.yearOfPassing || '',
      historyOfArrears: user.historyOfArrears || '0',
      currentArrears: user.currentArrears || '0',
      permanentAddress: user.permanentAddress || '',
      nativeDistrict: user.nativeDistrict || '',
      parentMobile: user.parentMobile || '',
      dob: user.dob || '',
      gender: user.gender || 'Male',
      certifications: user.certifications || '',
      technicalSkills: user.technicalSkills || '',
      languagesKnown: user.languagesKnown || '',
      wishToWork: user.wishToWork || '',
      willingInterviewAnyLocation: user.willingInterviewAnyLocation || 'Yes',
      willingWorkAnyLocation: user.willingWorkAnyLocation || 'Yes',
      willingWorkTN: user.willingWorkTN || 'Yes',
      willingWorkIndia: user.willingWorkIndia || 'Yes',
      futurePlan: user.futurePlan || '',
      resumeUrl: user.resumeUrl || '',
      role: user.role || 'Student',
      status: user.status || 'Active',
      joined: user.joined || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    });
  };

  // CRUD: Update User
  const handleUpdateUser = (e) => {
    e.preventDefault();
    if (!editingUser) return;

    const updated = users.map(u => {
      if (u.id === editingUser.id) {
        return {
          ...u,
          ...formData,
          initials: getInitials(formData.name)
        };
      }
      return u;
    });

    setUsers(updated);
    setEditingUser(null);
    setFormData(initialFormState);
    showToast(`User "${formData.name}" updated successfully!`);
  };

  // CRUD: Delete User from Firestore
  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    setIsSaving(true);
    if (deletingUser.id) {
      await deleteStudentFromFirestore(deletingUser.id);
    }
    const remaining = users.filter(u => u.id !== deletingUser.id);
    setUsers(remaining);
    showToast(`User "${deletingUser.name}" deleted from Firebase dataset.`, 'info');
    setDeletingUser(null);
    setIsSaving(false);
  };

  // CRUD: Clear ALL Users from Firestore
  const handleClearAllUsers = async () => {
    if (users.length === 0) {
      showToast('No user data to clear.', 'info');
      return;
    }
    if (window.confirm(`Are you sure you want to permanently delete ALL ${users.length} users from Firebase dataset?`)) {
      setIsSaving(true);
      const res = await clearAllUsersFromFirestore();
      setIsSaving(false);
      if (res && res.success) {
        setUsers([]);
        showToast('All user data removed from Firebase dataset!', 'success');
      } else {
        showToast(`Failed to clear users: ${res?.error || 'Unknown error'}`, 'error');
      }
    }
  };

  // Upload CSV / Excel File Import (Flexible mapping of all 26 column headers directly to Firebase)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        if (!data || data.length === 0) {
          showToast('No data found in uploaded file', 'error');
          return;
        }

        showToast(`Uploading ${data.length} student profiles to Firebase dataset...`, 'info');

        const studentsToUpload = data.map((row, idx) => ({
          regNo: String(row['Register Number'] || row['Register No'] || row['Reg No'] || row['RegNo'] || row.regNo || ''),
          name: String(row['Name of the Student'] || row['Student Name'] || row['Name'] || row.name || `Student ${idx + 1}`),
          department: String(row['Department'] || row['Branch'] || row.department || row.branch || ''),
          tenthPercentage: String(row['10th %'] || row['10th Percentage'] || row['10th'] || row.tenthPercentage || ''),
          twelfthPercentage: String(row['12th % or Diploma %'] || row['12th %'] || row['Diploma %'] || row.twelfthPercentage || ''),
          cgpa: String(row['CGPA till last (VI) semester'] || row['CGPA'] || row.cgpa || ''),
          mobile: String(row['Mobile Number'] || row['Mobile'] || row['Phone'] || row.mobile || ''),
          email: String(row['Email ID'] || row['Email'] || row.email || `student${idx + 1}@college.edu`),
          yearOfPassing: String(row['Year of Passing'] || row['YOP'] || row.yearOfPassing || ''),
          historyOfArrears: String(row['History of arrears (Number of arrears cleared from first semester)'] || row['History of Arrears'] || row.historyOfArrears || '0'),
          currentArrears: String(row['Number of CURRENT arrears'] || row['Current Arrears'] || row.currentArrears || '0'),
          permanentAddress: String(row['Permanent Address'] || row['Address'] || row.permanentAddress || ''),
          nativeDistrict: String(row['Native Place District'] || row['District'] || row.nativeDistrict || ''),
          parentMobile: String(row["Parent's Mobile Number"] || row['Parent Mobile'] || row.parentMobile || ''),
          dob: String(row['Date of Birth'] || row['DOB'] || row.dob || ''),
          gender: String(row['Gender'] || row.gender || ''),
          certifications: String(row['Certification Courses'] || row['Certifications'] || row.certifications || ''),
          technicalSkills: String(row['Technical Skills'] || row['Skills'] || row.technicalSkills || ''),
          languagesKnown: String(row['Languages Known'] || row['Languages'] || row.languagesKnown || ''),
          wishToWork: String(row['I wish to work'] || row.wishToWork || ''),
          willingInterviewAnyLocation: String(row['Willing to attend interview in any location'] || row.willingInterviewAnyLocation || 'Yes'),
          willingWorkAnyLocation: String(row['Willing to work in any location'] || row.willingWorkAnyLocation || 'Yes'),
          willingWorkTN: String(row['Willing to work in any location in Tamil Nadu'] || row.willingWorkTN || 'Yes'),
          willingWorkIndia: String(row['Willing to work in any location in India'] || row.willingWorkIndia || 'Yes'),
          futurePlan: String(row['Future plan (If you do not require placement assistance)'] || row['Future Plan'] || row.futurePlan || ''),
          resumeUrl: String(row['UPLOAD RESUME UPDATED RESUME'] || row['Resume Link'] || row['Resume'] || row.resumeUrl || ''),
          role: String(row['Role'] || row.role || 'Student'),
          status: String(row['Status'] || row.status || 'Active'),
          joined: String(row['Joined'] || row.joined || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }))
        }));

        // Batch add to Firebase Firestore Dataset
        const res = await batchAddStudentsToFirestore(studentsToUpload);

        if (res && res.success) {
          const bgColors = ['#e0e7ff', '#dbeafe', '#f3e8ff', '#c7d2fe', '#dcfce7', '#fce7f3'];
          const textColors = ['#4338ca', '#1e40af', '#6b21a8', '#3730a3', '#166534', '#9d174d'];

          const formattedSaved = res.records.map((u, idx) => ({
            ...u,
            avatarBg: bgColors[idx % bgColors.length],
            avatarColor: textColors[idx % textColors.length],
            initials: getInitials(u.name),
            provider: 'firebase'
          }));

          setUsers(prev => [...formattedSaved, ...prev]);
          setCurrentPage(1);
          showToast(`🎉 Successfully saved ${res.count} detailed student profiles to Firebase Dataset!`);
        } else {
          showToast(`Error uploading students to Firebase: ${res?.error || 'Unknown error'}`, 'error');
        }
      } catch (err) {
        console.error('Error uploading Excel/CSV file:', err);
        showToast('Error parsing CSV/Excel file. Please check column format.', 'error');
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = null; // reset input
  };

  // Export to Excel File containing all 26 student columns
  const handleExportExcel = () => {
    if (users.length === 0) {
      showToast('No user data to export', 'error');
      return;
    }

    const exportData = users.map(u => ({
      'Register Number': u.regNo || '',
      'Name of the Student': u.name || '',
      'Department': u.department || u.branch || '',
      '10th %': u.tenthPercentage || '',
      '12th % or Diploma %': u.twelfthPercentage || '',
      'CGPA till last (VI) semester': u.cgpa || '',
      'Mobile Number': u.mobile || '',
      'Email ID': u.email || '',
      'Year of Passing': u.yearOfPassing || '',
      'History of arrears (Number of arrears cleared from first semester)': u.historyOfArrears || '0',
      'Number of CURRENT arrears': u.currentArrears || '0',
      'Permanent Address': u.permanentAddress || '',
      'Native Place District': u.nativeDistrict || '',
      "Parent's Mobile Number": u.parentMobile || '',
      'Date of Birth': u.dob || '',
      'Gender': u.gender || '',
      'Certification Courses': u.certifications || '',
      'Technical Skills': u.technicalSkills || '',
      'Languages Known': u.languagesKnown || '',
      'I wish to work': u.wishToWork || '',
      'Willing to attend interview in any location': u.willingInterviewAnyLocation || 'Yes',
      'Willing to work in any location': u.willingWorkAnyLocation || 'Yes',
      'Willing to work in any location in Tamil Nadu': u.willingWorkTN || 'Yes',
      'Willing to work in any location in India': u.willingWorkIndia || 'Yes',
      'Future plan (If you do not require placement assistance)': u.futurePlan || '',
      'UPLOAD RESUME UPDATED RESUME': u.resumeUrl || '',
      'Role': u.role || 'Student',
      'Status': u.status || 'Active',
      'Joined Date': u.joined || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students Data');

    XLSX.writeFile(workbook, `Students_Placement_Data_${new Date().toISOString().slice(0, 10)}.xlsx`);
    showToast('Students data exported to Excel with all 26 columns successfully!');
  };

  // Common Glassmorphism Card Style
  const glassCardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.85)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.04), 0 2px 10px 0 rgba(0, 0, 0, 0.02)',
    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh', backgroundColor: '#f6f4ee', fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* Toast Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          zIndex: 1200,
          backgroundColor: notification.type === 'error' ? '#ef4444' : notification.type === 'info' ? '#3b82f6' : '#10b981',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '12px',
          fontSize: '15px',
          fontWeight: 600,
          boxShadow: '0 10px 25px rgba(0,0,0,0.18)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'dashboardFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          {notification.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Hidden File Input for CSV/Excel Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".csv, .xlsx, .xls"
        style={{ display: 'none' }}
      />

      {/* Top Header Label */}
      <div style={{
        padding: '22px 36px 10px 36px',
        fontSize: '24px',
        fontWeight: 800,
        color: '#0f172a',
        letterSpacing: '-0.02em'
      }}>
        Student
      </div>

      <div style={{ display: 'flex', flex: 1, minHeight: 0, paddingBottom: '24px' }}>
        
        {/* Left Sidebar */}
        <aside style={{
          width: '260px',
          backgroundColor: '#16151a',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          padding: '32px 20px',
          flexShrink: 0,
          borderRadius: '24px',
          margin: '12px 0 16px 20px',
          boxShadow: '0 12px 36px rgba(0,0,0,0.22)'
        }}>
          {/* Logo / Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '0 8px 42px 8px' }}>
            <Crown size={26} color="#ffffff" strokeWidth={2.5} />
            <span style={{ fontSize: '21px', fontWeight: 800, color: '#ffffff', letterSpacing: '0.01em' }}>
              Admin Panel
            </span>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.label)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '14px 22px',
                    borderRadius: '14px',
                    border: 'none',
                    backgroundColor: isActive ? '#be185d' : 'transparent',
                    color: isActive ? '#ffffff' : '#a1a1aa',
                    fontSize: '17px',
                    fontWeight: isActive ? 700 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                    textAlign: 'left',
                    boxShadow: isActive ? '0 6px 20px rgba(190, 24, 93, 0.45)' : 'none',
                    transform: isActive ? 'scale(1.02)' : 'scale(1)'
                  }}
                >
                  <Icon size={22} color={isActive ? '#ffffff' : '#a1a1aa'} strokeWidth={2.3} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main style={{ flex: 1, padding: '12px 36px 24px 30px', overflowY: 'auto' }}>
          
          {/* Top Row: 4 Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '28px' }}>
            {statCards.map((card, idx) => (
              <div
                key={idx}
                style={{
                  ...glassCardStyle,
                  padding: '28px 22px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#4b5563', marginBottom: '10px' }}>
                  {card.title}
                </div>
                <div style={{ fontSize: '36px', fontWeight: 800, color: '#000000', letterSpacing: '-0.03em' }}>
                  {card.value}
                </div>
              </div>
            ))}
          </div>

          {/* Main Users Table Glass Card */}
          <div style={{
            ...glassCardStyle,
            padding: '30px'
          }}>
            
            {/* Header & Controls Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                All Students
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                
                {/* Search Bar */}
                <div style={{ position: 'relative', width: '300px' }}>
                  <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by reg no, name, dept, email..."
                    style={{
                      width: '100%',
                      padding: '10px 16px 10px 40px',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                      fontSize: '14px',
                      color: '#1e293b',
                      outline: 'none',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                    }}
                  />
                </div>

                {/* Upload CSV/Excel Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  title="Import CSV or Excel File with Student Data"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: '#334155',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                  }}
                >
                  <Upload size={18} color="#0284c7" />
                  <span>Upload CSV/Excel</span>
                </button>

                {/* Export Excel Button */}
                <button
                  onClick={handleExportExcel}
                  title="Export All 26 Columns to Excel File"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    borderRadius: '12px',
                    border: '1px solid #bbf7d0',
                    backgroundColor: '#f0fdf4',
                    color: '#166534',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 6px rgba(22, 101, 52, 0.05)'
                  }}
                >
                  <Download size={18} color="#15803d" />
                  <span>Export Excel</span>
                </button>

                {/* Clear All Users Button */}
                <button
                  onClick={handleClearAllUsers}
                  disabled={isSaving || users.length === 0}
                  title="Delete ALL Users from Firebase Dataset"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    borderRadius: '12px',
                    border: '1px solid #fecdd3',
                    backgroundColor: '#fff1f2',
                    color: '#e11d48',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: users.length === 0 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    opacity: users.length === 0 ? 0.6 : 1,
                    boxShadow: '0 2px 6px rgba(225, 29, 72, 0.05)'
                  }}
                >
                  <Trash2 size={18} color="#e11d48" />
                  <span>Clear All Data</span>
                </button>

                {/* + Add User Button */}
                <button
                  onClick={() => { setFormData(initialFormState); setIsAddModalOpen(true); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: '#be185d',
                    color: '#ffffff',
                    fontSize: '15px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 14px rgba(190, 24, 93, 0.4)'
                  }}
                >
                  <Plus size={18} strokeWidth={2.5} />
                  <span>+ Add User</span>
                </button>

              </div>
            </div>

            {/* Filter Options Toolbar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#f8fafc',
              padding: '12px 18px',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', fontWeight: 700, color: '#334155' }}>
                <Filter size={17} color="#be185d" />
                <span>Filters:</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', flex: 1 }}>
                {/* Department Filter */}
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    fontWeight: 600,
                    backgroundColor: '#ffffff',
                    color: '#1e293b',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="All">All Departments</option>
                  <option value="IT">IT</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="AI&DS">AI&DS</option>
                  <option value="MECH">MECH</option>
                  <option value="EEE">EEE</option>
                  <option value="CIVIL">CIVIL</option>
                </select>

                {/* Min CGPA Filter */}
                <select
                  value={cgpaFilter}
                  onChange={(e) => setCgpaFilter(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    fontWeight: 600,
                    backgroundColor: '#ffffff',
                    color: '#1e293b',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="All">All CGPA</option>
                  <option value="7.5">7.5+ CGPA (Distinction)</option>
                  <option value="7.0">7.0+ CGPA</option>
                  <option value="6.5">6.5+ CGPA (Placement Eligible)</option>
                  <option value="6.0">6.0+ CGPA</option>
                </select>

                {/* Arrears Filter */}
                <select
                  value={arrearsFilter}
                  onChange={(e) => setArrearsFilter(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    fontWeight: 600,
                    backgroundColor: '#ffffff',
                    color: '#1e293b',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="All">All Arrear Statuses</option>
                  <option value="0">0 Arrears (No Standing Arrears)</option>
                  <option value="1">Max 1 Arrear</option>
                  <option value="2">Max 2 Arrears</option>
                  <option value="hasArrears">Has Active Arrears</option>
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    fontWeight: 600,
                    backgroundColor: '#ffffff',
                    color: '#1e293b',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                </select>

                {/* Clear Filters Button */}
                {isFilterActive && (
                  <button
                    onClick={handleResetFilters}
                    title="Reset all filters and search query"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '7px 12px',
                      borderRadius: '10px',
                      border: '1px solid #fca5a5',
                      backgroundColor: '#fff1f2',
                      color: '#e11d48',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <X size={14} /> Clear Filters
                  </button>
                )}
              </div>

              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
                Showing <strong style={{ color: '#0f172a' }}>{filteredUsers.length}</strong> of <strong style={{ color: '#0f172a' }}>{users.length}</strong> Students
              </div>
            </div>

            {/* Users Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
                <thead>
                  <tr style={{ color: '#64748b', fontSize: '13px', fontWeight: 600, textAlign: 'left' }}>
                    <th style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}>Reg No</th>
                    <th style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}>Student</th>
                    <th style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}>Department</th>
                    <th style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}>CGPA & Arrears</th>
                    <th style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}>Mobile</th>
                    <th style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}>Status</th>
                    <th style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: '#94a3b8', fontSize: '15px' }}>
                        {loading
                          ? 'Loading users from Firebase dataset...'
                          : searchQuery
                          ? 'No users found matching your search query.'
                          : 'No users found in Firebase dataset. Click "+ Add User" or "Upload CSV/Excel" to add students.'}
                      </td>
                    </tr>
                  ) : (
                    currentUsers.map((user) => (
                      <tr
                        key={user.id}
                        style={{
                          backgroundColor: '#ffffff',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                          transition: 'all 0.2s ease',
                          borderRadius: '12px'
                        }}
                      >
                        {/* Reg No */}
                        <td style={{ padding: '16px', borderRadius: '12px 0 0 12px', fontSize: '14px', fontWeight: 700, color: '#3b82f6' }}>
                          {user.regNo || '-'}
                        </td>

                        {/* Student Name & Email */}
                        <td style={{ padding: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: '50%',
                              backgroundColor: user.avatarBg,
                              color: user.avatarColor,
                              fontWeight: 800,
                              fontSize: '15px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              {user.initials}
                            </div>
                            <div>
                              <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                                {user.name}
                              </div>
                              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Department */}
                        <td style={{ padding: '16px', fontSize: '14px', color: '#334155', fontWeight: 600 }}>
                          {user.department || user.branch || '-'}
                        </td>

                        {/* CGPA & Arrears */}
                        <td style={{ padding: '16px' }}>
                          <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                            {user.cgpa ? `${user.cgpa} CGPA` : '-'}
                          </div>
                          <div style={{ fontSize: '12px', color: Number(user.currentArrears) > 0 ? '#dc2626' : '#166534', marginTop: '2px', fontWeight: 600 }}>
                            Arrears: {user.currentArrears || '0'}
                          </div>
                        </td>

                        {/* Mobile */}
                        <td style={{ padding: '16px', fontSize: '14px', color: '#475569', fontWeight: 500 }}>
                          {user.mobile || '-'}
                        </td>

                        {/* Status Badge */}
                        <td style={{ padding: '16px' }}>
                          <span style={{
                            padding: '5px 14px',
                            borderRadius: '999px',
                            fontSize: '13px',
                            fontWeight: 700,
                            display: 'inline-block',
                            backgroundColor: user.status === 'Active' ? '#dcfce7' : user.status === 'Pending' ? '#fef3c7' : '#f1f5f9',
                            color: user.status === 'Active' ? '#166534' : user.status === 'Pending' ? '#b45309' : '#64748b'
                          }}>
                            {user.status}
                          </span>
                        </td>

                        {/* Actions (View Details / Edit / Delete) */}
                        <td style={{ padding: '16px', borderRadius: '0 12px 12px 0', textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                            {/* Eye Icon for View Full 26 Attributes */}
                            <button
                              onClick={() => setViewingUser(user)}
                              title="View Full Student Profile (All 26 Details)"
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '6px',
                                color: '#2563eb',
                                borderRadius: '8px',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => openEditModal(user)}
                              title="Edit Student Profile"
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '6px',
                                color: '#94a3b8',
                                borderRadius: '8px',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => setDeletingUser(user)}
                              title="Delete Student"
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '6px',
                                color: '#e11d48',
                                borderRadius: '8px',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredUsers.length > 0 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '24px',
                paddingTop: '16px',
                borderTop: '1px solid #e2e8f0',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>
                  Showing <strong style={{ color: '#0f172a' }}>{indexOfFirstItem + 1}</strong> to <strong style={{ color: '#0f172a' }}>{Math.min(indexOfLastItem, filteredUsers.length)}</strong> of <strong style={{ color: '#0f172a' }}>{filteredUsers.length}</strong> users
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '7px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      color: currentPage === 1 ? '#cbd5e1' : '#334155',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <ChevronLeft size={16} />
                    <span>Previous</span>
                  </button>

                  {Array.from({ length: Math.min(10, totalPages) }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        border: pageNum === currentPage ? 'none' : '1px solid #e2e8f0',
                        backgroundColor: pageNum === currentPage ? '#be185d' : '#ffffff',
                        color: pageNum === currentPage ? '#ffffff' : '#334155',
                        fontSize: '15px',
                        fontWeight: pageNum === currentPage ? 700 : 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: pageNum === currentPage ? '0 4px 12px rgba(190, 24, 93, 0.35)' : 'none'
                      }}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '7px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      color: currentPage === totalPages ? '#cbd5e1' : '#334155',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>Next</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

          </div>

        </main>
      </div>

      {/* VIEW FULL STUDENT DETAILS MODAL (All 26 Attributes Displayed) */}
      {viewingUser && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '850px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '32px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  backgroundColor: viewingUser.avatarBg || '#e0e7ff',
                  color: viewingUser.avatarColor || '#4338ca',
                  fontSize: '24px', fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {viewingUser.initials}
                </div>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {viewingUser.name}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px', fontSize: '14px', color: '#64748b', flexWrap: 'wrap' }}>
                    <span><strong>Reg No:</strong> {viewingUser.regNo || 'N/A'}</span>
                    <span>•</span>
                    <span><strong>Dept:</strong> {viewingUser.department || viewingUser.branch || 'N/A'}</span>
                    <span>•</span>
                    <span style={{
                      padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700,
                      backgroundColor: viewingUser.status === 'Active' ? '#dcfce7' : '#fef3c7',
                      color: viewingUser.status === 'Active' ? '#166534' : '#b45309'
                    }}>
                      {viewingUser.status}
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={() => setViewingUser(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '6px' }}>
                <X size={24} />
              </button>
            </div>

            {/* 4 Organised Sections Cards for 26 Attributes */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              
              {/* Card 1: Academic Performance */}
              <div style={{ backgroundColor: '#f8fafc', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '14px' }}>
                  <GraduationCap size={20} color="#2563eb" /> Academic Performance
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
                  <div><span style={{ color: '#64748b', fontSize: '12px' }}>10th Score</span><div style={{ fontWeight: 700, color: '#0f172a' }}>{viewingUser.tenthPercentage ? `${viewingUser.tenthPercentage}%` : 'N/A'}</div></div>
                  <div><span style={{ color: '#64748b', fontSize: '12px' }}>12th / Diploma</span><div style={{ fontWeight: 700, color: '#0f172a' }}>{viewingUser.twelfthPercentage ? `${viewingUser.twelfthPercentage}%` : 'N/A'}</div></div>
                  <div><span style={{ color: '#64748b', fontSize: '12px' }}>CGPA (till VI Sem)</span><div style={{ fontWeight: 800, color: '#2563eb', fontSize: '16px' }}>{viewingUser.cgpa || 'N/A'}</div></div>
                  <div><span style={{ color: '#64748b', fontSize: '12px' }}>Year of Passing</span><div style={{ fontWeight: 700, color: '#0f172a' }}>{viewingUser.yearOfPassing || 'N/A'}</div></div>
                  <div><span style={{ color: '#64748b', fontSize: '12px' }}>Arrears Cleared</span><div style={{ fontWeight: 700, color: '#166534' }}>{viewingUser.historyOfArrears || '0'}</div></div>
                  <div><span style={{ color: '#64748b', fontSize: '12px' }}>Current Arrears</span><div style={{ fontWeight: 800, color: Number(viewingUser.currentArrears) > 0 ? '#dc2626' : '#166534' }}>{viewingUser.currentArrears || '0'}</div></div>
                </div>
              </div>

              {/* Card 2: Contact & Personal Details */}
              <div style={{ backgroundColor: '#f8fafc', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '14px' }}>
                  <Phone size={20} color="#059669" /> Contact & Personal Info
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px' }}>
                  <div><span style={{ color: '#64748b' }}>Email:</span> <strong style={{ color: '#0f172a' }}>{viewingUser.email}</strong></div>
                  <div><span style={{ color: '#64748b' }}>Student Mobile:</span> <strong style={{ color: '#0f172a' }}>{viewingUser.mobile || 'N/A'}</strong></div>
                  <div><span style={{ color: '#64748b' }}>Parent Mobile:</span> <strong style={{ color: '#0f172a' }}>{viewingUser.parentMobile || 'N/A'}</strong></div>
                  <div><span style={{ color: '#64748b' }}>Date of Birth:</span> <strong style={{ color: '#0f172a' }}>{viewingUser.dob || 'N/A'}</strong> &nbsp;|&nbsp; <span style={{ color: '#64748b' }}>Gender:</span> <strong style={{ color: '#0f172a' }}>{viewingUser.gender || 'N/A'}</strong></div>
                  <div><span style={{ color: '#64748b' }}>Native District:</span> <strong style={{ color: '#0f172a' }}>{viewingUser.nativeDistrict || 'N/A'}</strong></div>
                  <div><span style={{ color: '#64748b' }}>Permanent Address:</span> <span style={{ color: '#334155', fontWeight: 500 }}>{viewingUser.permanentAddress || 'N/A'}</span></div>
                </div>
              </div>

              {/* Card 3: Skills & Certifications */}
              <div style={{ backgroundColor: '#f8fafc', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '14px' }}>
                  <Award size={20} color="#7c3aed" /> Skills & Certifications
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13.5px' }}>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Technical Skills:</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {viewingUser.technicalSkills ? viewingUser.technicalSkills.split(',').map((skill, sIdx) => (
                        <span key={sIdx} style={{ backgroundColor: '#ede9fe', color: '#6d28d9', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700 }}>
                          {skill.trim()}
                        </span>
                      )) : <span style={{ color: '#94a3b8' }}>None listed</span>}
                    </div>
                  </div>
                  <div><span style={{ color: '#64748b', fontSize: '12px' }}>Certification Courses:</span> <div style={{ color: '#0f172a', fontWeight: 600 }}>{viewingUser.certifications || 'None'}</div></div>
                  <div><span style={{ color: '#64748b', fontSize: '12px' }}>Languages Known:</span> <div style={{ color: '#0f172a', fontWeight: 600 }}>{viewingUser.languagesKnown || 'English'}</div></div>
                </div>
              </div>

              {/* Card 4: Placement Preferences & Resume */}
              <div style={{ backgroundColor: '#f8fafc', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '14px' }}>
                  <MapPin size={20} color="#d97706" /> Placement Preferences & Resume
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px' }}>
                  <div><span style={{ color: '#64748b' }}>Wish to Work:</span> <strong style={{ color: '#0f172a' }}>{viewingUser.wishToWork || 'IT / Software Industry'}</strong></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12.5px' }}>
                    <div><span>Interview Anywhere:</span> <strong style={{ color: '#166534' }}>{viewingUser.willingInterviewAnyLocation || 'Yes'}</strong></div>
                    <div><span>Work Anywhere:</span> <strong style={{ color: '#166534' }}>{viewingUser.willingWorkAnyLocation || 'Yes'}</strong></div>
                    <div><span>Work in TN:</span> <strong style={{ color: '#166534' }}>{viewingUser.willingWorkTN || 'Yes'}</strong></div>
                    <div><span>Work in India:</span> <strong style={{ color: '#166534' }}>{viewingUser.willingWorkIndia || 'Yes'}</strong></div>
                  </div>
                  {viewingUser.futurePlan && (
                    <div><span style={{ color: '#64748b' }}>Future Plan:</span> <span style={{ color: '#334155' }}>{viewingUser.futurePlan}</span></div>
                  )}
                  <div style={{ marginTop: '8px' }}>
                    {viewingUser.resumeUrl ? (
                      <a href={viewingUser.resumeUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#be185d', color: '#ffffff', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
                        <ExternalLink size={16} /> View / Download Resume
                      </a>
                    ) : (
                      <span style={{ color: '#94a3b8', fontSize: '13px' }}>📄 No resume link available</span>
                    )}
                  </div>
                </div>
              </div>

            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setViewingUser(null)} style={{ padding: '10px 24px', borderRadius: '12px', backgroundColor: '#0f172a', color: '#ffffff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT USER MODAL (With All Detailed Fields) */}
      {(isAddModalOpen || editingUser) && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(5px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '750px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '30px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {editingUser ? 'Edit Student Profile' : 'Add New Student Profile'}
              </h3>
              <button
                onClick={() => { setIsAddModalOpen(false); setEditingUser(null); setFormData(initialFormState); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser}>
              
              {/* Section 1: Personal & Basic Info */}
              <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#be185d', margin: '0 0 12px 0' }}>1. Basic & Contact Details</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Full Name *</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Ananya Rao" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Email Address *</label>
                    <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="e.g. ananya@college.edu" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Register Number</label>
                    <input type="text" value={formData.regNo} onChange={(e) => setFormData({ ...formData, regNo: e.target.value })} placeholder="e.g. 710021104001" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Department / Branch</label>
                    <input type="text" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} placeholder="e.g. CSE / IT" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Student Mobile</label>
                    <input type="text" value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} placeholder="e.g. 9876543210" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Parent Mobile</label>
                    <input type="text" value={formData.parentMobile} onChange={(e) => setFormData({ ...formData, parentMobile: e.target.value })} placeholder="e.g. 9876500000" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
                  </div>
                </div>
              </div>

              {/* Section 2: Academic Record */}
              <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#2563eb', margin: '0 0 12px 0' }}>2. Academic Marks & Arrears</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>10th %</label>
                    <input type="text" value={formData.tenthPercentage} onChange={(e) => setFormData({ ...formData, tenthPercentage: e.target.value })} placeholder="e.g. 88.5" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>12th / Diploma %</label>
                    <input type="text" value={formData.twelfthPercentage} onChange={(e) => setFormData({ ...formData, twelfthPercentage: e.target.value })} placeholder="e.g. 91.2" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>CGPA (VI Sem)</label>
                    <input type="text" value={formData.cgpa} onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })} placeholder="e.g. 8.4" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Cleared Arrears</label>
                    <input type="text" value={formData.historyOfArrears} onChange={(e) => setFormData({ ...formData, historyOfArrears: e.target.value })} placeholder="0" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Current Arrears</label>
                    <input type="text" value={formData.currentArrears} onChange={(e) => setFormData({ ...formData, currentArrears: e.target.value })} placeholder="0" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Year of Passing</label>
                    <input type="text" value={formData.yearOfPassing} onChange={(e) => setFormData({ ...formData, yearOfPassing: e.target.value })} placeholder="e.g. 2025" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
                  </div>
                </div>
              </div>

              {/* Section 3: Skills & Preferences */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#7c3aed', margin: '0 0 12px 0' }}>3. Technical Skills & Placement Preferences</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Technical Skills</label>
                    <input type="text" value={formData.technicalSkills} onChange={(e) => setFormData({ ...formData, technicalSkills: e.target.value })} placeholder="e.g. Java, React, Python, SQL" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Wish to Work In</label>
                    <input type="text" value={formData.wishToWork} onChange={(e) => setFormData({ ...formData, wishToWork: e.target.value })} placeholder="e.g. Core Software / IT" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Resume URL / File Link</label>
                    <input type="text" value={formData.resumeUrl} onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })} placeholder="e.g. https://drive.google.com/..." style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setEditingUser(null); setFormData(initialFormState); }}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: '#64748b',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: isSaving ? '#94a3b8' : '#be185d',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 12px rgba(190, 24, 93, 0.35)'
                  }}
                >
                  {isSaving ? 'Saving...' : editingUser ? 'Save Profile Changes' : 'Create Student Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingUser && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.55)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '420px',
            padding: '28px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              backgroundColor: '#ffe4e6', color: '#be185d',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <Trash2 size={24} />
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
              Delete User?
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 24px 0' }}>
              Are you sure you want to delete <strong>{deletingUser.name}</strong>? This action cannot be undone.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button
                onClick={() => setDeletingUser(null)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#64748b',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                style={{
                  padding: '10px 22px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#e11d48',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(225, 29, 72, 0.35)'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
