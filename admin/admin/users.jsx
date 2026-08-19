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
  ChevronRight
} from 'lucide-react';
import * as XLSX from 'xlsx';

export default function UsersPage({ onNavigate }) {
  const [activeNav, setActiveNav] = useState('Users');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const fileInputRef = useRef(null);

  // Initial 25 realistic sample users (first 10 on Page 1, rest on Page 2 & 3)
  const [users, setUsers] = useState([
    { id: 1, name: 'Ananya Rao', email: 'ananya.rao@college.edu', role: 'Student', status: 'Active', joined: '12 Jan 2025', avatarBg: '#e0e7ff', avatarColor: '#4338ca', initials: 'AR' },
    { id: 2, name: 'Karthik Menon', email: 'karthik.menon@college.edu', role: 'Placement Officer', status: 'Active', joined: '03 Feb 2025', avatarBg: '#dbeafe', avatarColor: '#1e40af', initials: 'KM' },
    { id: 3, name: 'Priya Sharma', email: 'priya.sharma@college.edu', role: 'Student', status: 'Pending', joined: '28 Feb 2025', avatarBg: '#f3e8ff', avatarColor: '#6b21a8', initials: 'PS' },
    { id: 4, name: 'Rahul Verma', email: 'rahul.verma@college.edu', role: 'Admin', status: 'Active', joined: '15 Mar 2025', avatarBg: '#c7d2fe', avatarColor: '#3730a3', initials: 'RV' },
    { id: 5, name: 'Sneha Iyer', email: 'sneha.iyer@college.edu', role: 'Student', status: 'Inactive', joined: '02 Apr 2025', avatarBg: '#f1f5f9', avatarColor: '#475569', initials: 'SI' },
    { id: 6, name: 'Vikram Nair', email: 'vikram.nair@college.edu', role: 'Company Recruiter', status: 'Active', joined: '19 Apr 2025', avatarBg: '#dcfce7', avatarColor: '#166534', initials: 'VN' },
    { id: 7, name: 'Divya Pillai', email: 'divya.pillai@college.edu', role: 'Student', status: 'Active', joined: '07 May 2025', avatarBg: '#fce7f3', avatarColor: '#9d174d', initials: 'DP' },
    { id: 8, name: 'Arjun Mehta', email: 'arjun.mehta@college.edu', role: 'Student', status: 'Active', joined: '14 May 2025', avatarBg: '#e0e7ff', avatarColor: '#4338ca', initials: 'AM' },
    { id: 9, name: 'Kavya Reddy', email: 'kavya.reddy@college.edu', role: 'Student', status: 'Pending', joined: '21 May 2025', avatarBg: '#f3e8ff', avatarColor: '#6b21a8', initials: 'KR' },
    { id: 10, name: 'Rohan Gupta', email: 'rohan.gupta@college.edu', role: 'Student', status: 'Active', joined: '02 Jun 2025', avatarBg: '#dbeafe', avatarColor: '#1e40af', initials: 'RG' },
    { id: 11, name: 'Pooja Bhatt', email: 'pooja.bhatt@college.edu', role: 'Placement Officer', status: 'Active', joined: '10 Jun 2025', avatarBg: '#c7d2fe', avatarColor: '#3730a3', initials: 'PB' },
    { id: 12, name: 'Amit Joshi', email: 'amit.joshi@college.edu', role: 'Student', status: 'Active', joined: '18 Jun 2025', avatarBg: '#dcfce7', avatarColor: '#166534', initials: 'AJ' },
    { id: 13, name: 'Riya Patel', email: 'riya.patel@college.edu', role: 'Student', status: 'Inactive', joined: '25 Jun 2025', avatarBg: '#f1f5f9', avatarColor: '#475569', initials: 'RP' },
    { id: 14, name: 'Aditya Deshmukh', email: 'aditya.d@college.edu', role: 'Company Recruiter', status: 'Active', joined: '01 Jul 2025', avatarBg: '#fce7f3', avatarColor: '#9d174d', initials: 'AD' },
    { id: 15, name: 'Meera Kulkarni', email: 'meera.k@college.edu', role: 'Student', status: 'Active', joined: '09 Jul 2025', avatarBg: '#e0e7ff', avatarColor: '#4338ca', initials: 'MK' },
    { id: 16, name: 'Suresh Nambiar', email: 'suresh.n@college.edu', role: 'Admin', status: 'Active', joined: '15 Jul 2025', avatarBg: '#c7d2fe', avatarColor: '#3730a3', initials: 'SN' },
    { id: 17, name: 'Neha Kapoor', email: 'neha.kapoor@college.edu', role: 'Student', status: 'Pending', joined: '22 Jul 2025', avatarBg: '#f3e8ff', avatarColor: '#6b21a8', initials: 'NK' },
    { id: 18, name: 'Siddharth Sen', email: 'siddharth.sen@college.edu', role: 'Student', status: 'Active', joined: '30 Jul 2025', avatarBg: '#dbeafe', avatarColor: '#1e40af', initials: 'SS' },
    { id: 19, name: 'Tarun Saxena', email: 'tarun.saxena@college.edu', role: 'Student', status: 'Active', joined: '05 Aug 2025', avatarBg: '#dcfce7', avatarColor: '#166534', initials: 'TS' },
    { id: 20, name: 'Shweta Roy', email: 'shweta.roy@college.edu', role: 'Student', status: 'Active', joined: '12 Aug 2025', avatarBg: '#fce7f3', avatarColor: '#9d174d', initials: 'SR' },
    { id: 21, name: 'Varun Bose', email: 'varun.bose@college.edu', role: 'Company Recruiter', status: 'Active', joined: '20 Aug 2025', avatarBg: '#e0e7ff', avatarColor: '#4338ca', initials: 'VB' },
    { id: 22, name: 'Deepa Hegde', email: 'deepa.hegde@college.edu', role: 'Student', status: 'Inactive', joined: '28 Aug 2025', avatarBg: '#f1f5f9', avatarColor: '#475569', initials: 'DH' },
    { id: 23, name: 'Manoj Kumar', email: 'manoj.kumar@college.edu', role: 'Student', status: 'Active', joined: '04 Sep 2025', avatarBg: '#dbeafe', avatarColor: '#1e40af', initials: 'MK' },
    { id: 24, name: 'Ishita Das', email: 'ishita.das@college.edu', role: 'Student', status: 'Pending', joined: '11 Sep 2025', avatarBg: '#f3e8ff', avatarColor: '#6b21a8', initials: 'ID' },
    { id: 25, name: 'Harish Prasad', email: 'harish.p@college.edu', role: 'Student', status: 'Active', joined: '19 Sep 2025', avatarBg: '#dcfce7', avatarColor: '#166534', initials: 'HP' }
  ]);

  // Form State for Create/Edit
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Student',
    status: 'Active',
    joined: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  });

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
    { label: 'Users', icon: UsersIcon },
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

  // Filtered users for search query
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset to page 1 on search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  // CRUD: Create User
  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      showToast('Please fill in required fields', 'error');
      return;
    }

    const initials = getInitials(formData.name);
    const bgColors = ['#e0e7ff', '#dbeafe', '#f3e8ff', '#c7d2fe', '#dcfce7', '#fce7f3'];
    const textColors = ['#4338ca', '#1e40af', '#6b21a8', '#3730a3', '#166534', '#9d174d'];
    const randIdx = Math.floor(Math.random() * bgColors.length);

    const newUser = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: formData.status,
      joined: formData.joined || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      avatarBg: bgColors[randIdx],
      avatarColor: textColors[randIdx],
      initials
    };

    setUsers([newUser, ...users]);
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      email: '',
      role: 'Student',
      status: 'Active',
      joined: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    });
    setCurrentPage(1);
    showToast(`User "${newUser.name}" created successfully!`);
  };

  // CRUD: Open Edit Modal
  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      joined: user.joined
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
          name: formData.name,
          email: formData.email,
          role: formData.role,
          status: formData.status,
          joined: formData.joined,
          initials: getInitials(formData.name)
        };
      }
      return u;
    });

    setUsers(updated);
    setEditingUser(null);
    showToast(`User "${formData.name}" updated successfully!`);
  };

  // CRUD: Delete User
  const handleDeleteUser = () => {
    if (!deletingUser) return;
    const remaining = users.filter(u => u.id !== deletingUser.id);
    setUsers(remaining);
    showToast(`User "${deletingUser.name}" deleted.`, 'info');
    setDeletingUser(null);
  };

  // EXTRA FEATURE 1: Upload CSV / Excel File Import
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
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

        const bgColors = ['#e0e7ff', '#dbeafe', '#f3e8ff', '#c7d2fe', '#dcfce7', '#fce7f3'];
        const textColors = ['#4338ca', '#1e40af', '#6b21a8', '#3730a3', '#166534', '#9d174d'];

        const importedUsers = data.map((row, idx) => {
          const name = row.Name || row.name || row['Full Name'] || `Imported User ${idx + 1}`;
          const email = row.Email || row.email || `user${idx + 1}@college.edu`;
          const role = row.Role || row.role || 'Student';
          const status = row.Status || row.status || 'Active';
          const joined = row.Joined || row.joined || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
          const randIdx = Math.floor(Math.random() * bgColors.length);

          return {
            id: Date.now() + idx,
            name,
            email,
            role,
            status,
            joined,
            avatarBg: bgColors[randIdx],
            avatarColor: textColors[randIdx],
            initials: getInitials(name)
          };
        });

        setUsers(prev => [...importedUsers, ...prev]);
        setCurrentPage(1);
        showToast(`Successfully imported ${importedUsers.length} users from ${file.name}!`);
      } catch (err) {
        showToast('Error parsing CSV/Excel file. Please check format.', 'error');
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = null; // reset input
  };

  // EXTRA FEATURE 2: Export to Excel File
  const handleExportExcel = () => {
    if (users.length === 0) {
      showToast('No user data to export', 'error');
      return;
    }

    const exportData = users.map(u => ({
      'ID': u.id,
      'Full Name': u.name,
      'Email Address': u.email,
      'Role': u.role,
      'Status': u.status,
      'Joined Date': u.joined
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users List');

    // Write file & trigger browser download
    XLSX.writeFile(workbook, `Users_Export_${new Date().toISOString().slice(0, 10)}.xlsx`);
    showToast('Users exported to Excel successfully!');
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
          zIndex: 1000,
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
        Users
      </div>

      <div style={{ display: 'flex', flex: 1, minHeight: 0, paddingBottom: '24px' }}>
        
        {/* Left Sidebar - 4 Rounded Corners matching Image 2 */}
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
                All Users
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                
                {/* Search Bar */}
                <div style={{ position: 'relative', width: '280px' }}>
                  <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, email, role..."
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
                  title="Import CSV or Excel File"
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
                  title="Export Users to Excel File"
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

                {/* + Add User Button */}
                <button
                  onClick={() => setIsAddModalOpen(true)}
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

            {/* Users Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
                <thead>
                  <tr style={{ color: '#64748b', fontSize: '13px', fontWeight: 600, textAlign: 'left' }}>
                    <th style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}>User</th>
                    <th style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}>Role</th>
                    <th style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}>Status</th>
                    <th style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}>Joined</th>
                    <th style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '36px', color: '#94a3b8', fontSize: '15px' }}>
                        No users found matching your search.
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
                        {/* User Profile */}
                        <td style={{ padding: '16px', borderRadius: '12px 0 0 12px' }}>
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

                        {/* Role */}
                        <td style={{ padding: '16px', fontSize: '15px', color: '#334155', fontWeight: 500 }}>
                          {user.role}
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

                        {/* Joined Date */}
                        <td style={{ padding: '16px', fontSize: '14px', color: '#64748b', fontWeight: 500 }}>
                          {user.joined}
                        </td>

                        {/* Actions (Edit / Delete) */}
                        <td style={{ padding: '16px', borderRadius: '0 12px 12px 0', textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
                            <button
                              onClick={() => openEditModal(user)}
                              title="Edit User"
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
                              title="Delete User"
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

            {/* Pagination Controls Matching User Reference Image (1 2 3 4 5 6 7 8 9 10) */}
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

                {/* Numbered Page Buttons: 1 2 3 4 5 6 7 8 9 10 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {/* Previous Button */}
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

                  {/* Page Numbers 1..10 */}
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

                  {/* Next Button */}
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

      {/* CREATE / EDIT USER MODAL */}
      {(isAddModalOpen || editingUser) && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
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
            maxWidth: '480px',
            padding: '28px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {editingUser ? 'Edit User' : 'Add New User'}
              </h3>
              <button
                onClick={() => { setIsAddModalOpen(false); setEditingUser(null); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ananya Rao"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. ananya@college.edu"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '15px',
                      outline: 'none',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <option value="Student">Student</option>
                    <option value="Placement Officer">Placement Officer</option>
                    <option value="Admin">Admin</option>
                    <option value="Company Recruiter">Company Recruiter</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '15px',
                      outline: 'none',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setEditingUser(null); }}
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
                  style={{
                    padding: '10px 22px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#be185d',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(190, 24, 93, 0.35)'
                  }}
                >
                  {editingUser ? 'Save Changes' : 'Create User'}
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
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
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
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#ffe4e6',
              color: '#be185d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
