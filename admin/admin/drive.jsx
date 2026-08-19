import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import {
  Crown,
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  FileText,
  Settings as SettingsIcon,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  CheckCircle,
  AlertCircle,
  Filter,
  Calendar,
  MapPin,
  DollarSign,
  Briefcase as JobIcon,
  Upload,
  Download,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Award,
  AlertTriangle,
  FileCheck
} from 'lucide-react';

export default function DriveManagement({ onNavigate }) {
  const [activeNav, setActiveNav] = useState('Drives');
  const [toast, setToast] = useState(null);

  // Hidden File Input Ref for Uploading Excel/CSV
  const fileInputRef = useRef(null);

  // Initial Placement Drives Dataset with Eligibility, CGPA, and Bond details
  const [drives, setDrives] = useState([
    { id: 1, company: 'TCS', date: 'Jun 12, 2025', role: 'Software Engineer', minCGPA: '6.5', branches: 'CSE, IT, ECE, AI&DS', maxBacklogs: '0', bond: '2 Years', package: '7 LPA', location: 'Chennai', status: 'Completed' },
    { id: 2, company: 'Infosys', date: 'Jun 20, 2025', role: 'Systems Engineer', minCGPA: '6.0', branches: 'All Branches', maxBacklogs: '1', bond: '1 Year', package: '6.5 LPA', location: 'Bengaluru', status: 'Completed' },
    { id: 3, company: 'Amazon', date: 'Jul 05, 2025', role: 'SDE-1', minCGPA: '7.5', branches: 'CSE, IT, AI&DS', maxBacklogs: '0', bond: 'No Bond', package: '18 LPA', location: 'Hyderabad', status: 'Completed' },
    { id: 4, company: 'Wipro', date: 'Jul 18, 2025', role: 'Project Engineer', minCGPA: '6.0', branches: 'CSE, IT, ECE, EEE', maxBacklogs: '0', bond: '1 Year', package: '5.5 LPA', location: 'Coimbatore', status: 'Ongoing' },
    { id: 5, company: 'Cognizant', date: 'Aug 02, 2025', role: 'Programmer Analyst', minCGPA: '6.5', branches: 'CSE, IT, ECE', maxBacklogs: '0', bond: '2 Years', package: '6 LPA', location: 'Chennai', status: 'Upcoming' },
    { id: 6, company: 'Zoho', date: 'Aug 10, 2025', role: 'Software Developer', minCGPA: '7.0', branches: 'CSE, IT, AI&DS', maxBacklogs: '0', bond: 'No Bond', package: '9 LPA', location: 'Chennai', status: 'Upcoming' },
    { id: 7, company: 'HCL Technologies', date: 'May 15, 2025', role: 'Associate Engineer', minCGPA: '6.0', branches: 'All Branches', maxBacklogs: '1', bond: '1 Year', package: '4.5 LPA', location: 'Coimbatore', status: 'Completed' },
    { id: 8, company: 'Accenture', date: 'Aug 22, 2025', role: 'Associate SE', minCGPA: '6.5', branches: 'CSE, IT, ECE, EEE', maxBacklogs: '0', bond: 'No Bond', package: '5.8 LPA', location: 'Bengaluru', status: 'Upcoming' },
    { id: 9, company: 'Capgemini', date: 'Sep 05, 2025', role: 'Senior Analyst', minCGPA: '6.5', branches: 'CSE, IT, AI&DS', maxBacklogs: '0', bond: '2 Years', package: '7.5 LPA', location: 'Pune', status: 'Upcoming' },
    { id: 10, company: 'LTI Mindtree', date: 'Sep 12, 2025', role: 'Software Developer', minCGPA: '6.8', branches: 'CSE, IT', maxBacklogs: '0', bond: '2 Years', package: '6.8 LPA', location: 'Mumbai', status: 'Upcoming' },
    { id: 11, company: 'Tech Mahindra', date: 'Sep 20, 2025', role: 'Software Engineer', minCGPA: '6.0', branches: 'All Branches', maxBacklogs: '1', bond: '1 Year', package: '5.2 LPA', location: 'Hyderabad', status: 'Upcoming' },
    { id: 12, company: 'Deloitte', date: 'Oct 02, 2025', role: 'Tech Consultant', minCGPA: '7.5', branches: 'CSE, IT, ECE, AI&DS', maxBacklogs: '0', bond: 'No Bond', package: '9.5 LPA', location: 'Bengaluru', status: 'Upcoming' }
  ]);

  // Search, Filter, and Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [cgpaFilter, setCgpaFilter] = useState('All');
  const [branchFilter, setBranchFilter] = useState('All');
  const [bondFilter, setBondFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 10 items per page

  // Modal State for Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDrive, setEditingDrive] = useState(null);
  const [formData, setFormData] = useState({
    company: '',
    date: '',
    role: '',
    minCGPA: '6.5',
    branches: 'CSE, IT, ECE, AI&DS',
    maxBacklogs: '0',
    bond: 'No Bond',
    package: '',
    location: '',
    status: 'Upcoming'
  });

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Users', icon: Users },
    { label: 'Companies', icon: Building2 },
    { label: 'Drives', icon: Briefcase },
    { label: 'Reports', icon: FileText },
    { label: 'Settings', icon: SettingsIcon },
  ];

  const handleNavClick = (label) => {
    setActiveNav(label);
    if (onNavigate) {
      onNavigate(label);
    }
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // EXPORT TO EXCEL (Includes Bond Details)
  const handleExportExcel = () => {
    if (drives.length === 0) {
      showToast('No drives data available to export!', 'error');
      return;
    }

    try {
      const exportData = drives.map(d => ({
        Company: d.company,
        Date: d.date,
        Role: d.role,
        'Min CGPA': d.minCGPA,
        'Eligible Branches': d.branches,
        'Max Backlogs': d.maxBacklogs,
        'Service Bond': d.bond,
        Package: d.package,
        Location: d.location,
        Status: d.status
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Placement Drives');

      XLSX.writeFile(workbook, `Placement_Drives_Bonds_${new Date().toISOString().split('T')[0]}.xlsx`);

      showToast('Placement drives exported to Excel successfully!');
    } catch (err) {
      console.error('Export error:', err);
      showToast('Error exporting Excel file!', 'error');
    }
  };

  // UPLOAD EXCEL / CSV
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileName = file.name;
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (!rows || rows.length <= 1) {
          showToast('Uploaded Excel file is empty or missing headers!', 'error');
          return;
        }

        const importedDrives = [];
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (row && row.length > 0 && row[0]) {
            importedDrives.push({
              id: Date.now() + i,
              company: String(row[0] || '').trim(),
              date: String(row[1] || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })).trim(),
              role: String(row[2] || 'Software Engineer').trim(),
              minCGPA: String(row[3] || '6.5').trim(),
              branches: String(row[4] || 'CSE, IT, ECE').trim(),
              maxBacklogs: String(row[5] || '0').trim(),
              bond: String(row[6] || 'No Bond').trim(),
              package: String(row[7] || '6 LPA').trim(),
              location: String(row[8] || 'Chennai').trim(),
              status: ['Completed', 'Ongoing', 'Upcoming'].includes(String(row[9] || '').trim()) ? String(row[9]).trim() : 'Upcoming'
            });
          }
        }

        if (importedDrives.length > 0) {
          setDrives(prev => [...importedDrives, ...prev]);
          setCurrentPage(1);
          showToast(`Successfully imported ${importedDrives.length} drive(s) from ${fileName}!`);
        } else {
          showToast('No valid placement drive rows found in Excel file!', 'error');
        }
      } catch (err) {
        console.error('File import error:', err);
        showToast('Failed to parse Excel file! Ensure valid .xlsx or .csv format.', 'error');
      }
    };

    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  const handleOpenCreateModal = () => {
    setEditingDrive(null);
    setFormData({
      company: '',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      role: '',
      minCGPA: '6.5',
      branches: 'CSE, IT, ECE, AI&DS',
      maxBacklogs: '0',
      bond: 'No Bond',
      package: '',
      location: '',
      status: 'Upcoming'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (drive) => {
    setEditingDrive(drive);
    setFormData({ ...drive });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.company || !formData.role || !formData.package) {
      showToast('Please fill in all required fields!', 'error');
      return;
    }

    if (editingDrive) {
      setDrives(drives.map(d => d.id === editingDrive.id ? { ...formData, id: editingDrive.id } : d));
      showToast(`Drive for ${formData.company} updated successfully!`);
    } else {
      const newDrive = {
        ...formData,
        id: Date.now()
      };
      setDrives([newDrive, ...drives]);
      showToast(`New drive for ${formData.company} added!`);
    }

    setIsModalOpen(false);
  };

  const handleDeleteDrive = (id, companyName) => {
    setDrives(drives.filter(d => d.id !== id));
    showToast(`Drive for ${companyName} deleted!`, 'info');
  };

  // Filtered dataset with Search, Status, CGPA, Branch, and Bond Filters
  const filteredDrives = drives.filter(d => {
    const matchesSearch = d.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.branches.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.bond.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || d.status === statusFilter;
    
    let matchesCgpa = true;
    if (cgpaFilter === '7.0+') matchesCgpa = parseFloat(d.minCGPA) >= 7.0;
    if (cgpaFilter === '7.5+') matchesCgpa = parseFloat(d.minCGPA) >= 7.5;
    if (cgpaFilter === '6.5+') matchesCgpa = parseFloat(d.minCGPA) >= 6.5;

    let matchesBranch = true;
    if (branchFilter !== 'All') {
      matchesBranch = d.branches.toLowerCase().includes(branchFilter.toLowerCase()) || d.branches.toLowerCase().includes('all');
    }

    let matchesBond = true;
    if (bondFilter !== 'All') {
      if (bondFilter === 'No Bond') matchesBond = d.bond.toLowerCase().includes('no bond') || d.bond === '0';
      else if (bondFilter === '1 Year') matchesBond = d.bond.includes('1 Year');
      else if (bondFilter === '2 Years') matchesBond = d.bond.includes('2 Years');
    }

    return matchesSearch && matchesStatus && matchesCgpa && matchesBranch && matchesBond;
  });

  // Pagination calculation
  const totalItems = filteredDrives.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDrives = filteredDrives.slice(startIndex, startIndex + itemsPerPage);
  const startItem = totalItems === 0 ? 0 : startIndex + 1;
  const endItem = Math.min(startIndex + itemsPerPage, totalItems);

  // Badge Status Helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return (
          <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '5px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: 700, display: 'inline-block' }}>
            Completed
          </span>
        );
      case 'Ongoing':
        return (
          <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '5px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: 700, display: 'inline-block' }}>
            Ongoing
          </span>
        );
      case 'Upcoming':
      default:
        return (
          <span style={{ backgroundColor: '#f3e8ff', color: '#6b21a8', padding: '5px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: 700, display: 'inline-block' }}>
            Upcoming
          </span>
        );
    }
  };

  // Bond Badge Helper
  const getBondBadge = (bond) => {
    if (bond.toLowerCase().includes('no bond') || bond === '0') {
      return (
        <span style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700 }}>
          ✓ No Bond
        </span>
      );
    }
    return (
      <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700 }}>
        📜 {bond}
      </span>
    );
  };

  const glassCardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.85)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.04), 0 2px 10px 0 rgba(0, 0, 0, 0.02)',
    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#ffffff'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh', backgroundColor: '#f6f4ee', fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* Hidden File Input for Excel/CSV Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".csv, .xlsx, .xls"
        style={{ display: 'none' }}
      />

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          zIndex: 1000,
          backgroundColor: toast.type === 'error' ? '#ef4444' : toast.type === 'info' ? '#3b82f6' : '#10b981',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '12px',
          fontSize: '15px',
          fontWeight: 600,
          boxShadow: '0 10px 25px rgba(0,0,0,0.18)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Top Header Label & Action Buttons */}
      <div style={{
        padding: '24px 36px 12px 36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Drive Management
          </div>
          <div style={{ fontSize: '15px', color: '#64748b', marginTop: '2px', fontWeight: 500 }}>
            Manage campus placement drives, CGPA eligibility, service bonds, and hiring status
          </div>
        </div>

        {/* Action Buttons Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            title="Upload Excel or CSV File"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '12px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#334155',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
            }}
          >
            <Upload size={17} strokeWidth={2.3} color="#2563eb" /> Upload Excel/CSV
          </button>

          <button
            onClick={handleExportExcel}
            title="Export placement drives to Excel file"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '12px',
              border: '1px solid #10b981',
              backgroundColor: '#ecfdf5',
              color: '#047857',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(16, 185, 129, 0.15)'
            }}
          >
            <Download size={17} strokeWidth={2.3} /> Export Excel
          </button>

          <button
            onClick={handleOpenCreateModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: '#be185d',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(190, 24, 93, 0.35)'
            }}
          >
            <Plus size={18} strokeWidth={2.5} /> Add Placement Drive
          </button>
        </div>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '0 8px 42px 8px' }}>
            <Crown size={26} color="#ffffff" strokeWidth={2.5} />
            <span style={{ fontSize: '21px', fontWeight: 800, color: '#ffffff', letterSpacing: '0.01em' }}>
              Admin Panel
            </span>
          </div>

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
        <main style={{ flex: 1, padding: '12px 36px 24px 30px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          
          {/* Table Container Card */}
          <div style={{ ...glassCardStyle, padding: '28px 32px', width: '100%', marginBottom: '24px' }}>
            
            {/* Top Toolbar: Search + CGPA Filter + Branch Filter + Bond Filter + Status Tabs */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                All Placement Drives
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                
                {/* Search Bar */}
                <div style={{ position: 'relative', width: '200px' }}>
                  <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Search company..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    style={{
                      width: '100%',
                      padding: '8px 12px 8px 34px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      outline: 'none',
                      backgroundColor: '#ffffff'
                    }}
                  />
                </div>

                {/* CGPA Filter Dropdown */}
                <select
                  value={cgpaFilter}
                  onChange={(e) => { setCgpaFilter(e.target.value); setCurrentPage(1); }}
                  style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', backgroundColor: '#ffffff', color: '#334155', fontWeight: 600 }}
                >
                  <option value="All">All CGPA</option>
                  <option value="6.5+">≥ 6.5 CGPA</option>
                  <option value="7.0+">≥ 7.0 CGPA</option>
                  <option value="7.5+">≥ 7.5 CGPA</option>
                </select>

                {/* Branch Filter Dropdown */}
                <select
                  value={branchFilter}
                  onChange={(e) => { setBranchFilter(e.target.value); setCurrentPage(1); }}
                  style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', backgroundColor: '#ffffff', color: '#334155', fontWeight: 600 }}
                >
                  <option value="All">All Branches</option>
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                  <option value="ECE">ECE</option>
                  <option value="AI&DS">AI&DS</option>
                </select>

                {/* Bond Filter Dropdown */}
                <select
                  value={bondFilter}
                  onChange={(e) => { setBondFilter(e.target.value); setCurrentPage(1); }}
                  style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', backgroundColor: '#ffffff', color: '#334155', fontWeight: 600 }}
                >
                  <option value="All">All Bonds</option>
                  <option value="No Bond">No Bond</option>
                  <option value="1 Year">1 Year Bond</option>
                  <option value="2 Years">2 Years Bond</option>
                </select>

                {/* Status Filter Tabs */}
                <div style={{ display: 'flex', backgroundColor: '#f1f5f9', borderRadius: '10px', padding: '3px' }}>
                  {['All', 'Completed', 'Ongoing', 'Upcoming'].map((status) => (
                    <button
                      key={status}
                      onClick={() => { setStatusFilter(status); setCurrentPage(1); }}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: statusFilter === status ? '#ffffff' : 'transparent',
                        color: statusFilter === status ? '#0f172a' : '#64748b',
                        fontWeight: statusFilter === status ? 700 : 600,
                        fontSize: '13px',
                        cursor: 'pointer',
                        boxShadow: statusFilter === status ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Drives Table with Bond Column */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                <thead>
                  <tr style={{ color: '#64748b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', textAlign: 'left' }}>
                    <th style={{ padding: '8px 14px', borderBottom: '1px solid #e2e8f0' }}>COMPANY</th>
                    <th style={{ padding: '8px 14px', borderBottom: '1px solid #e2e8f0' }}>DATE</th>
                    <th style={{ padding: '8px 14px', borderBottom: '1px solid #e2e8f0' }}>ROLE</th>
                    <th style={{ padding: '8px 14px', borderBottom: '1px solid #e2e8f0' }}>MIN CGPA</th>
                    <th style={{ padding: '8px 14px', borderBottom: '1px solid #e2e8f0' }}>ELIGIBILITY</th>
                    <th style={{ padding: '8px 14px', borderBottom: '1px solid #e2e8f0' }}>SERVICE BOND</th>
                    <th style={{ padding: '8px 14px', borderBottom: '1px solid #e2e8f0' }}>PACKAGE</th>
                    <th style={{ padding: '8px 14px', borderBottom: '1px solid #e2e8f0' }}>LOCATION</th>
                    <th style={{ padding: '8px 14px', borderBottom: '1px solid #e2e8f0' }}>STATUS</th>
                    <th style={{ padding: '8px 14px', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedDrives.length === 0 ? (
                    <tr>
                      <td colSpan={10} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
                        No placement drives found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedDrives.map((drive) => (
                      <tr
                        key={drive.id}
                        style={{
                          backgroundColor: '#ffffff',
                          borderRadius: '12px',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {/* COMPANY */}
                        <td style={{ padding: '14px 16px', fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>
                          {drive.company}
                        </td>

                        {/* DATE */}
                        <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '13px' }}>
                          {drive.date}
                        </td>

                        {/* ROLE */}
                        <td style={{ padding: '14px 16px', color: '#475569', fontSize: '13px', fontWeight: 600 }}>
                          {drive.role}
                        </td>

                        {/* MIN CGPA */}
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '4px 10px', borderRadius: '8px', fontSize: '13px', fontWeight: 700 }}>
                            🎓 {drive.minCGPA} CGPA
                          </span>
                        </td>

                        {/* ELIGIBLE BRANCHES */}
                        <td style={{ padding: '14px 16px', color: '#334155', fontSize: '13px', fontWeight: 500 }}>
                          {drive.branches}
                        </td>

                        {/* SERVICE BOND */}
                        <td style={{ padding: '14px 16px' }}>
                          {getBondBadge(drive.bond)}
                        </td>

                        {/* PACKAGE */}
                        <td style={{ padding: '14px 16px', fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>
                          {drive.package}
                        </td>

                        {/* LOCATION */}
                        <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '13px' }}>
                          {drive.location}
                        </td>

                        {/* STATUS */}
                        <td style={{ padding: '14px 16px' }}>
                          {getStatusBadge(drive.status)}
                        </td>

                        {/* ACTIONS */}
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                            <button
                              onClick={() => handleOpenEditModal(drive)}
                              title="Edit Drive"
                              style={{ border: 'none', backgroundColor: '#f1f5f9', color: '#334155', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => handleDeleteDrive(drive.id, drive.company)}
                              title="Delete Drive"
                              style={{ border: 'none', backgroundColor: '#fff1f2', color: '#e11d48', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Control Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '20px',
              marginTop: '16px',
              borderTop: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>
                Showing <strong style={{ color: '#0f172a' }}>{startItem}</strong> to <strong style={{ color: '#0f172a' }}>{endItem}</strong> of <strong style={{ color: '#0f172a' }}>{totalItems}</strong> placement drives
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '7px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: currentPage === 1 ? '#cbd5e1' : '#334155', fontSize: '13px', fontWeight: 600, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                >
                  <ChevronLeft size={16} /> Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      border: pageNum === currentPage ? 'none' : '1px solid #cbd5e1',
                      backgroundColor: pageNum === currentPage ? '#be185d' : '#ffffff',
                      color: pageNum === currentPage ? '#ffffff' : '#334155',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: pageNum === currentPage ? '0 4px 14px rgba(190, 24, 93, 0.4)' : 'none'
                    }}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '7px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: currentPage === totalPages || totalPages === 0 ? '#cbd5e1' : '#334155', fontSize: '13px', fontWeight: 600, cursor: currentPage === totalPages || totalPages === 0 ? 'not-allowed' : 'pointer' }}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Footer Info Bar */}
          <div style={{
            ...glassCardStyle,
            padding: '18px 28px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            marginTop: 'auto'
          }}>
            <div>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>Total Drives</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>{drives.length} Drives</div>
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>Completed Drives</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#16a34a' }}>{drives.filter(d => d.status === 'Completed').length} Drives</div>
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>Ongoing Drives</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#d97706' }}>{drives.filter(d => d.status === 'Ongoing').length} Active</div>
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>Upcoming Drives</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#6b21a8' }}>{drives.filter(d => d.status === 'Upcoming').length} Scheduled</div>
            </div>
          </div>

        </main>
      </div>

      {/* CREATE / EDIT MODAL WITH BOND FIELD */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(6px)',
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            ...glassCardStyle,
            padding: '32px',
            width: '560px',
            maxWidth: '90%',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {editingDrive ? 'Edit Placement Drive' : 'Add New Placement Drive'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ border: 'none', background: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Company Name *</label>
                  <input type="text" required placeholder="e.g. Google, Microsoft, TCS" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} style={inputStyle} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Drive Date *</label>
                    <input type="text" placeholder="e.g. Aug 25, 2025" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Job Role *</label>
                    <input type="text" required placeholder="e.g. Software Engineer" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} style={inputStyle} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Min CGPA Cutoff *</label>
                    <input type="text" required placeholder="e.g. 6.5" value={formData.minCGPA} onChange={(e) => setFormData({ ...formData, minCGPA: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Service Bond Period *</label>
                    <select value={formData.bond} onChange={(e) => setFormData({ ...formData, bond: e.target.value })} style={inputStyle}>
                      <option value="No Bond">No Bond</option>
                      <option value="1 Year">1 Year Bond</option>
                      <option value="2 Years">2 Years Bond</option>
                      <option value="18 Months">18 Months Bond</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Eligible Branches *</label>
                  <input type="text" required placeholder="e.g. CSE, IT, ECE, AI&DS" value={formData.branches} onChange={(e) => setFormData({ ...formData, branches: e.target.value })} style={inputStyle} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Package (LPA) *</label>
                    <input type="text" required placeholder="e.g. 8 LPA" value={formData.package} onChange={(e) => setFormData({ ...formData, package: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Location</label>
                    <input type="text" placeholder="e.g. Chennai" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} style={inputStyle} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Status *</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} style={inputStyle}>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 18px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#334155', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: '10px 22px', borderRadius: '10px', border: 'none', backgroundColor: '#be185d', color: '#ffffff', fontSize: '14px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(190, 24, 93, 0.35)' }}>
                  {editingDrive ? 'Save Changes' : 'Create Drive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
