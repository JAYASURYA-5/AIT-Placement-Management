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
  CheckCircle,
  AlertCircle,
  Upload,
  Download,
  ChevronLeft,
  ChevronRight,
  Globe,
  Building,
  Mail,
  Award,
  DollarSign
} from 'lucide-react';

export default function CompanyManagement({ onNavigate }) {
  const [activeNav, setActiveNav] = useState('Companies');
  const [toast, setToast] = useState(null);

  // Hidden File Input Ref for Uploading Excel/CSV
  const fileInputRef = useRef(null);

  // Sample Corporate Partners Dataset
  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: 'TCS (Tata Consultancy Services)',
      industry: 'IT Services & Consulting',
      location: 'Chennai / PAN India',
      tier: 'Tier 1',
      roles: 'Ninja SDE; Digital Developer',
      package: '7.0 LPA',
      totalHires: 45,
      status: 'Active Partner',
      hrContact: 'campus.hr@tcs.com'
    },
    {
      id: 2,
      name: 'Infosys Limited',
      industry: 'IT & Software Services',
      location: 'Bengaluru, KA',
      tier: 'Tier 1',
      roles: 'System Engineer; Specialist Programmer',
      package: '6.5 LPA',
      totalHires: 38,
      status: 'Active Partner',
      hrContact: 'careers@infosys.com'
    },
    {
      id: 3,
      name: 'Amazon Development Centre',
      industry: 'E-Commerce & Cloud Computing',
      location: 'Hyderabad, TS',
      tier: 'Super Dream',
      roles: 'SDE-1; Cloud Support Associate',
      package: '18.0 LPA',
      totalHires: 14,
      status: 'Drive Scheduled',
      hrContact: 'university@amazon.com'
    },
    {
      id: 4,
      name: 'Zoho Corporation',
      industry: 'Software & SaaS Products',
      location: 'Chennai, TN',
      tier: 'Super Dream',
      roles: 'Software Developer; Product Engineer',
      package: '9.0 LPA',
      totalHires: 22,
      status: 'Active Partner',
      hrContact: 'placements@zohocorp.com'
    },
    {
      id: 5,
      name: 'Wipro Technologies',
      industry: 'IT Services & R&D',
      location: 'Coimbatore, TN',
      tier: 'Tier 2',
      roles: 'Project Engineer; Turbo Analyst',
      package: '5.5 LPA',
      totalHires: 30,
      status: 'Active Partner',
      hrContact: 'campus@wipro.com'
    },
    {
      id: 6,
      name: 'Cognizant (CTS)',
      industry: 'IT & Business Solutions',
      location: 'Chennai, TN',
      tier: 'Tier 1',
      roles: 'GenC Developer; GenC Next',
      package: '6.0 LPA',
      totalHires: 41,
      status: 'Drive Scheduled',
      hrContact: 'campus.recruitment@cognizant.com'
    },
    {
      id: 7,
      name: 'Accenture India',
      industry: 'Management & Tech Consulting',
      location: 'Bengaluru, KA',
      tier: 'Tier 1',
      roles: 'Associate Software Engineer',
      package: '5.8 LPA',
      totalHires: 28,
      status: 'Active Partner',
      hrContact: 'india.campus@accenture.com'
    },
    {
      id: 8,
      name: 'HCLTech',
      industry: 'IT Services & Engineering',
      location: 'Coimbatore, TN',
      tier: 'Tier 2',
      roles: 'Graduate Engineer Trainee',
      package: '4.5 LPA',
      totalHires: 20,
      status: 'Active Partner',
      hrContact: 'fresher.hiring@hcl.com'
    },
    {
      id: 9,
      name: 'Capgemini Technology',
      industry: 'IT Consulting & Services',
      location: 'Pune, MH',
      tier: 'Tier 1',
      roles: 'Senior Analyst; Analyst SDE',
      package: '7.5 LPA',
      totalHires: 19,
      status: 'Drive Scheduled',
      hrContact: 'campus.in@capgemini.com'
    },
    {
      id: 10,
      name: 'LTIMindtree',
      industry: 'IT Solutions & Digital Services',
      location: 'Mumbai, MH',
      tier: 'Tier 1',
      roles: 'Software Engineer; Specialist',
      package: '6.8 LPA',
      totalHires: 16,
      status: 'Active Partner',
      hrContact: 'recruitment@ltimindtree.com'
    },
    {
      id: 11,
      name: 'Deloitte India',
      industry: 'Audit & Tech Advisory',
      location: 'Bengaluru, KA',
      tier: 'Super Dream',
      roles: 'Technology Analyst; Business Advisor',
      package: '9.5 LPA',
      totalHires: 11,
      status: 'Drive Scheduled',
      hrContact: 'campus@deloitte.com'
    },
    {
      id: 12,
      name: 'Tech Mahindra',
      industry: 'Telecom & IT Solutions',
      location: 'Hyderabad, TS',
      tier: 'Tier 2',
      roles: 'Associate Software Engineer',
      package: '5.2 LPA',
      totalHires: 15,
      status: 'MoU Signed',
      hrContact: 'careers@techmahindra.com'
    }
  ]);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 10 companies per page

  // Modal State for Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    location: '',
    tier: 'Tier 1',
    roles: '',
    package: '',
    totalHires: 0,
    status: 'Active Partner',
    hrContact: ''
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

  // EXPORT TO EXCEL
  const handleExportExcel = () => {
    if (companies.length === 0) {
      showToast('No company records to export!', 'error');
      return;
    }

    try {
      const exportData = companies.map(c => ({
        'Company Name': c.name,
        Industry: c.industry,
        Location: c.location,
        'Tier Category': c.tier,
        'Hiring Roles': c.roles,
        'Package LPA': c.package,
        'Total Hires': c.totalHires,
        Status: c.status,
        'HR Contact Email': c.hrContact
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Corporate Partners');

      XLSX.writeFile(workbook, `Company_Partners_${new Date().toISOString().split('T')[0]}.xlsx`);

      showToast('Company records exported to Excel (.xlsx) successfully!');
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

        const importedCompanies = [];
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (row && row.length > 0 && row[0]) {
            importedCompanies.push({
              id: Date.now() + i,
              name: String(row[0] || '').trim(),
              industry: String(row[1] || 'IT Services').trim(),
              location: String(row[2] || 'Chennai').trim(),
              tier: String(row[3] || 'Tier 1').trim(),
              roles: String(row[4] || 'Software Engineer').trim(),
              package: String(row[5] || '6.0 LPA').trim(),
              totalHires: parseInt(row[6]) || 0,
              status: String(row[7] || 'Active Partner').trim(),
              hrContact: String(row[8] || 'hr@company.com').trim()
            });
          }
        }

        if (importedCompanies.length > 0) {
          setCompanies(prev => [...importedCompanies, ...prev]);
          setCurrentPage(1);
          showToast(`Successfully imported ${importedCompanies.length} company partner(s) from ${fileName}!`);
        } else {
          showToast('No valid company records found in file!', 'error');
        }
      } catch (err) {
        console.error('File import error:', err);
        showToast('Failed to parse Excel file! Check file formatting.', 'error');
      }
    };

    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  const handleOpenCreateModal = () => {
    setEditingCompany(null);
    setFormData({
      name: '',
      industry: 'IT Services & Software',
      location: '',
      tier: 'Tier 1',
      roles: '',
      package: '6.5 LPA',
      totalHires: 0,
      status: 'Active Partner',
      hrContact: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (company) => {
    setEditingCompany(company);
    setFormData({ ...company });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.roles || !formData.package) {
      showToast('Please fill in all required fields!', 'error');
      return;
    }

    if (editingCompany) {
      setCompanies(companies.map(c => c.id === editingCompany.id ? { ...formData, id: editingCompany.id } : c));
      showToast(`Company details for ${formData.name} updated successfully!`);
    } else {
      const newCompany = {
        ...formData,
        id: Date.now()
      };
      setCompanies([newCompany, ...companies]);
      showToast(`New company partner ${formData.name} added!`);
    }

    setIsModalOpen(false);
  };

  const handleDeleteCompany = (id, companyName) => {
    setCompanies(companies.filter(c => c.id !== id));
    showToast(`Company ${companyName} removed!`, 'info');
  };

  // Filtered dataset
  const filteredCompanies = companies.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.roles.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTier = tierFilter === 'All' || c.tier === tierFilter;
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;

    return matchesSearch && matchesTier && matchesStatus;
  });

  // Pagination calculations
  const totalItems = filteredCompanies.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCompanies = filteredCompanies.slice(startIndex, startIndex + itemsPerPage);
  const startItem = totalItems === 0 ? 0 : startIndex + 1;
  const endItem = Math.min(startIndex + itemsPerPage, totalItems);

  // Status Badge Helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active Partner':
        return (
          <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: 700, display: 'inline-block' }}>
            ● Active Partner
          </span>
        );
      case 'Drive Scheduled':
        return (
          <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '4px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: 700, display: 'inline-block' }}>
            📅 Drive Scheduled
          </span>
        );
      case 'MoU Signed':
      default:
        return (
          <span style={{ backgroundColor: '#e0e7ff', color: '#3730a3', padding: '4px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: 700, display: 'inline-block' }}>
            🤝 MoU Signed
          </span>
        );
    }
  };

  // Tier Badge Helper
  const getTierBadge = (tier) => {
    if (tier === 'Super Dream') {
      return <span style={{ backgroundColor: '#fce7f3', color: '#be185d', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 800 }}>⚡ Super Dream (10+ LPA)</span>;
    }
    if (tier === 'Tier 1') {
      return <span style={{ backgroundColor: '#dbeafe', color: '#1e40af', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 800 }}>🌟 Tier 1 (6-10 LPA)</span>;
    }
    return <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700 }}>💼 Tier 2 (Core)</span>;
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
            Company Management
          </div>
          <div style={{ fontSize: '15px', color: '#64748b', marginTop: '2px', fontWeight: 500 }}>
            Manage corporate partners, hiring tiers, package details, and HR contacts
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
            title="Export companies to Excel file"
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
            <Plus size={18} strokeWidth={2.5} /> Add New Company
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
            
            {/* Top Toolbar: Search + Tier Filter + Status Filter */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Corporate Partners & Recruiters
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                {/* Search Bar */}
                <div style={{ position: 'relative', width: '240px' }}>
                  <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Search company, role..."
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

                {/* Tier Filter */}
                <select
                  value={tierFilter}
                  onChange={(e) => { setTierFilter(e.target.value); setCurrentPage(1); }}
                  style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', backgroundColor: '#ffffff', color: '#334155', fontWeight: 600 }}
                >
                  <option value="All">All Tiers</option>
                  <option value="Super Dream">Super Dream (10+ LPA)</option>
                  <option value="Tier 1">Tier 1 (6-10 LPA)</option>
                  <option value="Tier 2">Tier 2 Core</option>
                </select>

                {/* Partnership Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                  style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', backgroundColor: '#ffffff', color: '#334155', fontWeight: 600 }}
                >
                  <option value="All">All Statuses</option>
                  <option value="Active Partner">Active Partner</option>
                  <option value="Drive Scheduled">Drive Scheduled</option>
                  <option value="MoU Signed">MoU Signed</option>
                </select>
              </div>
            </div>

            {/* Companies Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                <thead>
                  <tr style={{ color: '#64748b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', textAlign: 'left' }}>
                    <th style={{ padding: '8px 14px', borderBottom: '1px solid #e2e8f0' }}>COMPANY</th>
                    <th style={{ padding: '8px 14px', borderBottom: '1px solid #e2e8f0' }}>INDUSTRY</th>
                    <th style={{ padding: '8px 14px', borderBottom: '1px solid #e2e8f0' }}>HIRING ROLES</th>
                    <th style={{ padding: '8px 14px', borderBottom: '1px solid #e2e8f0' }}>TIER</th>
                    <th style={{ padding: '8px 14px', borderBottom: '1px solid #e2e8f0' }}>PACKAGE</th>
                    <th style={{ padding: '8px 14px', borderBottom: '1px solid #e2e8f0' }}>HIRED</th>
                    <th style={{ padding: '8px 14px', borderBottom: '1px solid #e2e8f0' }}>STATUS</th>
                    <th style={{ padding: '8px 14px', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCompanies.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
                        No corporate partners found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedCompanies.map((company) => (
                      <tr
                        key={company.id}
                        style={{
                          backgroundColor: '#ffffff',
                          borderRadius: '12px',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {/* COMPANY NAME */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>{company.name}</div>
                          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>📍 {company.location}</div>
                        </td>

                        {/* INDUSTRY */}
                        <td style={{ padding: '14px 16px', color: '#475569', fontSize: '13px', fontWeight: 500 }}>
                          {company.industry}
                        </td>

                        {/* HIRING ROLES */}
                        <td style={{ padding: '14px 16px', color: '#1e293b', fontSize: '13px', fontWeight: 600 }}>
                          {company.roles}
                        </td>

                        {/* TIER */}
                        <td style={{ padding: '14px 16px' }}>
                          {getTierBadge(company.tier)}
                        </td>

                        {/* PACKAGE */}
                        <td style={{ padding: '14px 16px', fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>
                          {company.package}
                        </td>

                        {/* HIRED COUNT */}
                        <td style={{ padding: '14px 16px', fontWeight: 700, color: '#16a34a', fontSize: '13px' }}>
                          {company.totalHires} Students
                        </td>

                        {/* STATUS */}
                        <td style={{ padding: '14px 16px' }}>
                          {getStatusBadge(company.status)}
                        </td>

                        {/* ACTIONS */}
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                            <button
                              onClick={() => handleOpenEditModal(company)}
                              title="Edit Company"
                              style={{ border: 'none', backgroundColor: '#f1f5f9', color: '#334155', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => handleDeleteCompany(company.id, company.name)}
                              title="Remove Company"
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

            {/* Pagination Control Bar Matching Reference Image */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '20px',
              marginTop: '16px',
              borderTop: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>
                Showing <strong style={{ color: '#0f172a' }}>{startItem}</strong> to <strong style={{ color: '#0f172a' }}>{endItem}</strong> of <strong style={{ color: '#0f172a' }}>{totalItems}</strong> companies
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
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>Total Corporate Partners</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>{companies.length} Companies</div>
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>Active Hiring Partners</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#16a34a' }}>{companies.filter(c => c.status === 'Active Partner').length} Active</div>
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>Super Dream Companies</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#be185d' }}>{companies.filter(c => c.tier === 'Super Dream').length} Partners</div>
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>Total Hires Placed</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#1d4ed8' }}>{companies.reduce((sum, c) => sum + c.totalHires, 0)} Students</div>
            </div>
          </div>

        </main>
      </div>

      {/* CREATE / EDIT COMPANY MODAL */}
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
                {editingCompany ? 'Edit Corporate Partner' : 'Add New Corporate Partner'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ border: 'none', background: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Company Name *</label>
                  <input type="text" required placeholder="e.g. TCS, Amazon, Microsoft" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={inputStyle} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Industry / Sector</label>
                    <input type="text" placeholder="e.g. IT Services & Software" value={formData.industry} onChange={(e) => setFormData({ ...formData, industry: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Location / HQ</label>
                    <input type="text" placeholder="e.g. Bengaluru, KA" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} style={inputStyle} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Tier Category *</label>
                    <select value={formData.tier} onChange={(e) => setFormData({ ...formData, tier: e.target.value })} style={inputStyle}>
                      <option value="Super Dream">Super Dream (10+ LPA)</option>
                      <option value="Tier 1">Tier 1 (6-10 LPA)</option>
                      <option value="Tier 2">Tier 2 (Core)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Package Offered (LPA) *</label>
                    <input type="text" required placeholder="e.g. 7.5 LPA" value={formData.package} onChange={(e) => setFormData({ ...formData, package: e.target.value })} style={inputStyle} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Hiring Roles Offered *</label>
                  <input type="text" required placeholder="e.g. Software Engineer; Cloud Developer" value={formData.roles} onChange={(e) => setFormData({ ...formData, roles: e.target.value })} style={inputStyle} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Partnership Status *</label>
                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} style={inputStyle}>
                      <option value="Active Partner">Active Partner</option>
                      <option value="Drive Scheduled">Drive Scheduled</option>
                      <option value="MoU Signed">MoU Signed</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>HR Contact Email</label>
                    <input type="email" placeholder="e.g. hr@company.com" value={formData.hrContact} onChange={(e) => setFormData({ ...formData, hrContact: e.target.value })} style={inputStyle} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 18px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#334155', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: '10px 22px', borderRadius: '10px', border: 'none', backgroundColor: '#be185d', color: '#ffffff', fontSize: '14px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(190, 24, 93, 0.35)' }}>
                  {editingCompany ? 'Save Changes' : 'Add Company'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
