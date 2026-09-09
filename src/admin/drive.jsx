import React, { useState, useRef, useEffect } from 'react';
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
  FileCheck,
  UserCheck,
  CheckSquare,
  Square,
  Sparkles,
  Mail,
  Send,
  CheckCircle2,
  Eye,
  Phone,
  ExternalLink
} from 'lucide-react';
import {
  fetchDrivesFromFirestore,
  addDriveToFirestore,
  updateDriveInFirestore,
  deleteDriveFromFirestore,
  batchAddDrivesToFirestore,
  fetchUsersFromFirestore
} from '../firebase';
import { sendBatchDriveEmails, generateDriveInvitationEmail, openWebEmailClient } from '../utils/emailService';

export default function DriveManagement({ onNavigate }) {
  const [activeNav, setActiveNav] = useState('Drives');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Hidden File Input Ref for Uploading Excel/CSV
  const fileInputRef = useRef(null);

  // Placement Drives Dataset from Firestore
  const [drives, setDrives] = useState([]);
  
  // All Students Dataset loaded from Firestore for eligibility evaluation
  const [allStudents, setAllStudents] = useState([]);

  // Search, Filter, and Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [cgpaFilter, setCgpaFilter] = useState('All');
  const [branchFilter, setBranchFilter] = useState('All');
  const [bondFilter, setBondFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal State for Create / Edit Drive
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

  // Modal State for Auto-Suggested Eligible Candidates
  const [selectedDriveForCandidates, setSelectedDriveForCandidates] = useState(null);
  const [eligibleCandidates, setEligibleCandidates] = useState([]);
  const [selectedCandidateIds, setSelectedCandidateIds] = useState(new Set());
  const [candidateSearchTerm, setCandidateSearchTerm] = useState('');

  // Email Notification Dispatch State
  const [emailSendingStatus, setEmailSendingStatus] = useState(null);
  const [showEmailPreview, setShowEmailPreview] = useState(false);

  // Modal State for Viewing Nominated Candidate Student Names & Profiles
  const [selectedCandidatesModal, setSelectedCandidatesModal] = useState(null);
  const [viewingStudentProfile, setViewingStudentProfile] = useState(null);

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Student', icon: Users },
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
    setTimeout(() => setToast(null), 3500);
  };

  // Load drives and student records from Cloud Firestore Database
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [fsDrives, fsStudents] = await Promise.all([
        fetchDrivesFromFirestore(),
        fetchUsersFromFirestore()
      ]);

      if (fsDrives && fsDrives.length > 0) {
        setDrives(fsDrives);
      } else {
        setDrives([]);
      }

      if (fsStudents && fsStudents.length > 0) {
        setAllStudents(fsStudents);
      } else {
        setAllStudents([]);
      }

      setLoading(false);
    }

    loadData();
  }, []);

  // Algorithm: Filter Auto-Suggested Eligible Candidates based on Drive Criteria
  const computeEligibleCandidates = (driveCriteria, studentsList) => {
    if (!studentsList || studentsList.length === 0) return [];

    const minCgpa = parseFloat(driveCriteria.minCGPA) || 0;
    const maxBacklogs = parseInt(driveCriteria.maxBacklogs) || 0;
    const branchesStr = (driveCriteria.branches || '').toLowerCase();

    return studentsList.filter(student => {
      // 1. CGPA Cutoff Check
      const studentCgpa = parseFloat(student.cgpa) || 0;
      if (studentCgpa < minCgpa) return false;

      // 2. Current Arrears / Backlogs Check
      const studentArrears = parseInt(student.currentArrears) || 0;
      if (studentArrears > maxBacklogs) return false;

      // 3. Department / Branch Check
      if (!branchesStr.includes('all') && branchesStr.trim() !== '') {
        const dept = (student.department || student.branch || '').toLowerCase().trim();
        if (!dept) return false;
        
        // Match against list of allowed branches
        const allowedList = branchesStr.split(',').map(b => b.trim());
        const isMatch = allowedList.some(b => b === dept || dept.includes(b) || b.includes(dept));
        if (!isMatch) return false;
      }

      return true;
    });
  };

  // Open Auto-Suggested Candidates Modal for a Drive
  const handleOpenEligibleCandidatesModal = (drive) => {
    setSelectedDriveForCandidates(drive);
    setCandidateSearchTerm('');

    const suggested = computeEligibleCandidates(drive, allStudents);
    setEligibleCandidates(suggested);

    // Pre-select already nominated candidates or default select all suggested candidates
    const alreadyNominated = new Set(
      Array.isArray(drive.nominatedStudents) && drive.nominatedStudents.length > 0
        ? drive.nominatedStudents
        : suggested.map(s => s.id)
    );

    setSelectedCandidateIds(alreadyNominated);
  };

  // Helper to open modal showing all selected candidate names & details for a drive
  const handleOpenSelectedCandidatesViewModal = (drive) => {
    const nominatedList = Array.isArray(drive.nominatedStudents) ? drive.nominatedStudents : [];
    
    // Match against all loaded student records
    const matchedStudents = allStudents.filter(student =>
      nominatedList.includes(student.id) || nominatedList.includes(student.uid)
    );

    setSelectedCandidatesModal({
      drive,
      candidates: matchedStudents,
      nominatedIds: nominatedList
    });
  };

  // Toggle Single Candidate Selection
  const handleToggleCandidate = (id) => {
    const next = new Set(selectedCandidateIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedCandidateIds(next);
  };

  // Select All / Deselect All Candidates
  const handleToggleSelectAllCandidates = () => {
    if (selectedCandidateIds.size === eligibleCandidates.length && eligibleCandidates.length > 0) {
      setSelectedCandidateIds(new Set());
    } else {
      const allIds = new Set(eligibleCandidates.map(c => c.id));
      setSelectedCandidateIds(allIds);
    }
  };

  // Save Selected Candidates to Drive Document in Firestore
  const handleSaveNominatedCandidates = async () => {
    if (!selectedDriveForCandidates) return;

    setIsSaving(true);
    showToast('Saving nominated candidates to Firebase...', 'info');

    const nominatedList = Array.from(selectedCandidateIds);
    const res = await updateDriveInFirestore(selectedDriveForCandidates.id, {
      nominatedStudents: nominatedList
    });

    setIsSaving(false);

    if (res && res.success) {
      setDrives(prev => prev.map(d => d.id === selectedDriveForCandidates.id ? { ...d, nominatedStudents: nominatedList } : d));
      showToast(`🎉 ${nominatedList.length} candidate(s) successfully nominated for ${selectedDriveForCandidates.company}!`);
      setSelectedDriveForCandidates(null);
    } else {
      showToast(`Error saving candidates: ${res?.error || 'Unknown error'}`, 'error');
    }
  };

  // Save Nominated Candidates & Automatically Send Email Notifications
  const handleSaveAndSendEmailNotifications = async () => {
    if (!selectedDriveForCandidates) return;
    if (selectedCandidateIds.size === 0) {
      showToast('Please select at least one candidate to send email notifications!', 'error');
      return;
    }

    const selectedCandidates = eligibleCandidates.filter(c => selectedCandidateIds.has(c.id));
    const nominatedList = Array.from(selectedCandidateIds);
    const driveDetails = selectedDriveForCandidates;

    setIsSaving(true);
    showToast('Saving nominated candidates to Firebase...', 'info');

    const res = await updateDriveInFirestore(driveDetails.id, {
      nominatedStudents: nominatedList
    });

    setIsSaving(false);

    if (res && res.success) {
      setDrives(prev => prev.map(d => d.id === driveDetails.id ? { ...d, nominatedStudents: nominatedList } : d));
      setSelectedDriveForCandidates(null);

      // Open Email Dispatch Progress Modal
      setEmailSendingStatus({
        isSending: true,
        current: 0,
        total: selectedCandidates.length,
        candidateName: selectedCandidates[0]?.name || '',
        candidateEmail: selectedCandidates[0]?.email || '',
        logs: [],
        drive: driveDetails,
        selectedCandidates
      });

      // Execute Batch Email Notification Dispatch
      const batchRes = await sendBatchDriveEmails({
        candidates: selectedCandidates,
        drive: driveDetails,
        onProgress: (prog) => {
          setEmailSendingStatus(prev => ({
            ...prev,
            current: prog.current,
            total: prog.total,
            candidateName: prog.candidateName,
            candidateEmail: prog.candidateEmail,
            logs: [
              ...prev.logs,
              { name: prog.candidateName, email: prog.candidateEmail, status: prog.status, time: new Date().toLocaleTimeString() }
            ]
          }));
        }
      });

      setEmailSendingStatus(prev => ({
        ...prev,
        isSending: false
      }));

      showToast(`✉️ Successfully sent drive email notifications to ${batchRes.count} candidate(s)!`, 'success');
    } else {
      showToast(`Error saving candidates: ${res?.error || 'Unknown error'}`, 'error');
    }
  };

  // EXPORT TO EXCEL
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
        Status: d.status,
        'Nominated Candidates Count': Array.isArray(d.nominatedStudents) ? d.nominatedStudents.length : 0
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Placement Drives');

      XLSX.writeFile(workbook, `Placement_Drives_${new Date().toISOString().split('T')[0]}.xlsx`);
      showToast('Placement drives exported to Excel successfully!');
    } catch (err) {
      console.error('Export error:', err);
      showToast('Error exporting Excel file!', 'error');
    }
  };

  // UPLOAD EXCEL / CSV DIRECTLY TO FIREBASE
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileName = file.name;
    const reader = new FileReader();

    reader.onload = async (event) => {
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
              company: String(row[0] || '').trim(),
              date: String(row[1] || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })).trim(),
              role: String(row[2] || 'Software Engineer').trim(),
              minCGPA: String(row[3] || '6.5').trim(),
              branches: String(row[4] || 'CSE, IT, ECE').trim(),
              maxBacklogs: String(row[5] || '0').trim(),
              bond: String(row[6] || 'No Bond').trim(),
              package: String(row[7] || '6 LPA').trim(),
              location: String(row[8] || 'Chennai').trim(),
              status: ['Completed', 'Ongoing', 'Upcoming'].includes(String(row[9] || '').trim()) ? String(row[9]).trim() : 'Upcoming',
              nominatedStudents: []
            });
          }
        }

        if (importedDrives.length > 0) {
          showToast(`Uploading ${importedDrives.length} drive(s) to Firebase...`, 'info');
          const res = await batchAddDrivesToFirestore(importedDrives);

          if (res && res.success) {
            setDrives(prev => [...res.records, ...prev]);
            setCurrentPage(1);
            showToast(`🎉 Successfully imported and saved ${res.count} drive(s) from ${fileName} to Firebase!`);
          } else {
            showToast(`Error batch saving drives: ${res?.error}`, 'error');
          }
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

  // Submit Handler for Create / Edit Drive with Firestore Persistence & Auto Candidate Suggestion Prompt
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.company || !formData.role || !formData.package) {
      showToast('Please fill in all required fields!', 'error');
      return;
    }

    setIsSaving(true);

    if (editingDrive) {
      showToast('Updating placement drive in Firebase...', 'info');
      const res = await updateDriveInFirestore(editingDrive.id, formData);
      setIsSaving(false);

      if (res && res.success) {
        setDrives(drives.map(d => d.id === editingDrive.id ? { ...d, ...formData } : d));
        setIsModalOpen(false);
        showToast(`Drive for "${formData.company}" updated in Firebase!`);
      } else {
        showToast(`Failed to update drive: ${res?.error}`, 'error');
      }
    } else {
      showToast('Saving new placement drive to Firebase...', 'info');
      const res = await addDriveToFirestore(formData);
      setIsSaving(false);

      if (res && res.success) {
        const createdDrive = { id: res.id, ...res.data };
        setDrives([createdDrive, ...drives]);
        setIsModalOpen(false);
        showToast(`🎉 New drive for "${formData.company}" saved to Firebase!`);

        // Automatically open the Auto-Suggested Candidates Modal for the newly added drive
        handleOpenEligibleCandidatesModal(createdDrive);
      } else {
        showToast(`Failed to save drive: ${res?.error}`, 'error');
      }
    }
  };

  const handleDeleteDrive = async (id, companyName) => {
    if (!window.confirm(`Are you sure you want to delete the placement drive for ${companyName}?`)) return;

    showToast('Deleting drive from Firebase...', 'info');
    const res = await deleteDriveFromFirestore(id);

    if (res && res.success) {
      setDrives(drives.filter(d => d.id !== id));
      showToast(`Drive for "${companyName}" deleted from Firebase.`, 'info');
    } else {
      showToast(`Error deleting drive: ${res?.error}`, 'error');
    }
  };

  // Filtered dataset with Search, Status, CGPA, Branch, and Bond Filters
  const filteredDrives = drives.filter(d => {
    const matchesSearch = (d.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (d.role || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (d.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (d.branches || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (d.bond || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || d.status === statusFilter;
    
    let matchesCgpa = true;
    if (cgpaFilter === '7.0+') matchesCgpa = parseFloat(d.minCGPA) >= 7.0;
    if (cgpaFilter === '7.5+') matchesCgpa = parseFloat(d.minCGPA) >= 7.5;
    if (cgpaFilter === '6.5+') matchesCgpa = parseFloat(d.minCGPA) >= 6.5;

    let matchesBranch = true;
    if (branchFilter !== 'All') {
      matchesBranch = (d.branches || '').toLowerCase().includes(branchFilter.toLowerCase()) || (d.branches || '').toLowerCase().includes('all');
    }

    let matchesBond = true;
    if (bondFilter !== 'All') {
      if (bondFilter === 'No Bond') matchesBond = (d.bond || '').toLowerCase().includes('no bond') || d.bond === '0';
      else if (bondFilter === '1 Year') matchesBond = (d.bond || '').includes('1 Year');
      else if (bondFilter === '2 Years') matchesBond = (d.bond || '').includes('2 Years');
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
    if ((bond || '').toLowerCase().includes('no bond') || bond === '0') {
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

  // Filtered candidate list inside the selection modal
  const filteredCandidatesInModal = eligibleCandidates.filter(c =>
    (c.name || '').toLowerCase().includes(candidateSearchTerm.toLowerCase()) ||
    (c.regNo || '').toLowerCase().includes(candidateSearchTerm.toLowerCase()) ||
    (c.department || c.branch || '').toLowerCase().includes(candidateSearchTerm.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(candidateSearchTerm.toLowerCase())
  );

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
          zIndex: 1200,
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
            Manage campus placement drives in Firebase & auto-suggest eligible student candidates
          </div>
        </div>

        {/* Action Buttons Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            title="Upload Excel or CSV File to Firebase"
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

            {/* Drives Table with Bond Column & Eligible Candidates Action */}
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
                    <th style={{ padding: '8px 14px', borderBottom: '1px solid #e2e8f0' }}>NOMINATED</th>
                    <th style={{ padding: '8px 14px', borderBottom: '1px solid #e2e8f0' }}>STATUS</th>
                    <th style={{ padding: '8px 14px', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={10} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
                        Loading placement drives from Firebase...
                      </td>
                    </tr>
                  ) : paginatedDrives.length === 0 ? (
                    <tr>
                      <td colSpan={10} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
                        No placement drives found in Firebase database matching your criteria. Click "+ Add Placement Drive" to create one.
                      </td>
                    </tr>
                  ) : (
                    paginatedDrives.map((drive) => {
                      const nominatedCount = Array.isArray(drive.nominatedStudents) ? drive.nominatedStudents.length : 0;
                      return (
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

                          {/* NOMINATED STUDENTS COUNT - CLICKABLE */}
                          <td style={{ padding: '14px 16px' }}>
                            <button
                              onClick={() => handleOpenSelectedCandidatesViewModal(drive)}
                              title="Click to view selected student names & complete profile details"
                              style={{
                                backgroundColor: nominatedCount > 0 ? '#f0fdf4' : '#f1f5f9',
                                color: nominatedCount > 0 ? '#166534' : '#64748b',
                                border: nominatedCount > 0 ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                                padding: '5px 12px',
                                borderRadius: '10px',
                                fontSize: '13px',
                                fontWeight: 700,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                boxShadow: nominatedCount > 0 ? '0 2px 6px rgba(22, 101, 52, 0.08)' : 'none'
                              }}
                            >
                              <UserCheck size={15} color={nominatedCount > 0 ? '#166534' : '#64748b'} />
                              <span>{nominatedCount} Selected</span>
                              <Eye size={13} style={{ marginLeft: '2px', opacity: 0.8 }} />
                            </button>
                          </td>

                          {/* STATUS */}
                          <td style={{ padding: '14px 16px' }}>
                            {getStatusBadge(drive.status)}
                          </td>

                          {/* ACTIONS */}
                          <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                              {/* AUTO-SUGGEST CANDIDATES BUTTON */}
                              <button
                                onClick={() => handleOpenEligibleCandidatesModal(drive)}
                                title="Check Auto-Suggested Eligible Student Profiles"
                                style={{ border: '1px solid #c7d2fe', backgroundColor: '#e0e7ff', color: '#4338ca', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700 }}
                              >
                                <Sparkles size={14} /> Candidates
                              </button>

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
                      );
                    })
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

      {/* AUTO-SUGGESTED ELIGIBLE CANDIDATES SELECTION MODAL */}
      {selectedDriveForCandidates && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          zIndex: 1200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '900px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            padding: '30px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Sparkles size={22} color="#be185d" />
                  <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Auto-Suggested Eligible Candidates
                  </h3>
                </div>
                <div style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
                  Drive: <strong>{selectedDriveForCandidates.company}</strong> ({selectedDriveForCandidates.role}) &nbsp;•&nbsp; Package: <strong>{selectedDriveForCandidates.package}</strong>
                </div>
              </div>
              <button onClick={() => setSelectedDriveForCandidates(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={24} />
              </button>
            </div>

            {/* Drive Eligibility Criteria Badges Summary */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', backgroundColor: '#f8fafc', padding: '12px 18px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>Drive Eligibility Rules:</span>
              <span style={{ backgroundColor: '#dbeafe', color: '#1e40af', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700 }}>
                🎓 Min CGPA: {selectedDriveForCandidates.minCGPA}
              </span>
              <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700 }}>
                ⚠️ Max Backlogs: {selectedDriveForCandidates.maxBacklogs || '0'}
              </span>
              <span style={{ backgroundColor: '#f3e8ff', color: '#6b21a8', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700 }}>
                🏢 Branches: {selectedDriveForCandidates.branches}
              </span>
            </div>

            {/* Candidate Search & Select All Controls Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', gap: '14px' }}>
              
              {/* Select All Button / Checkbox */}
              <button
                onClick={handleToggleSelectAllCandidates}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: selectedCandidateIds.size === eligibleCandidates.length && eligibleCandidates.length > 0 ? '#fce7f3' : '#ffffff',
                  color: selectedCandidateIds.size === eligibleCandidates.length && eligibleCandidates.length > 0 ? '#be185d' : '#334155',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {selectedCandidateIds.size === eligibleCandidates.length && eligibleCandidates.length > 0 ? (
                  <CheckSquare size={18} color="#be185d" />
                ) : (
                  <Square size={18} color="#64748b" />
                )}
                <span>
                  {selectedCandidateIds.size === eligibleCandidates.length && eligibleCandidates.length > 0
                    ? 'Deselect All'
                    : `Select All Candidates (${eligibleCandidates.length})`}
                </span>
              </button>

              {/* Candidate Filter Search Bar */}
              <div style={{ position: 'relative', width: '280px' }}>
                <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Filter candidate by name, reg no, dept..."
                  value={candidateSearchTerm}
                  onChange={(e) => setCandidateSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 34px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
              </div>

            </div>

            {/* Candidates Table List */}
            <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '14px', marginBottom: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '12px', fontWeight: 700, textAlign: 'left' }}>
                    <th style={{ padding: '12px 16px', width: '40px' }}>
                      <input
                        type="checkbox"
                        checked={selectedCandidateIds.size === eligibleCandidates.length && eligibleCandidates.length > 0}
                        onChange={handleToggleSelectAllCandidates}
                        style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                      />
                    </th>
                    <th style={{ padding: '12px 16px' }}>REG NO</th>
                    <th style={{ padding: '12px 16px' }}>STUDENT NAME</th>
                    <th style={{ padding: '12px 16px' }}>DEPARTMENT</th>
                    <th style={{ padding: '12px 16px' }}>CGPA</th>
                    <th style={{ padding: '12px 16px' }}>ARREARS</th>
                    <th style={{ padding: '12px 16px' }}>MOBILE / EMAIL</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCandidatesInModal.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: '#94a3b8', fontSize: '14px' }}>
                        {eligibleCandidates.length === 0
                          ? 'No students in database currently satisfy this drive\'s CGPA, Arrear, and Department criteria.'
                          : 'No candidate matches your search filter inside eligible pool.'}
                      </td>
                    </tr>
                  ) : (
                    filteredCandidatesInModal.map((candidate) => {
                      const isChecked = selectedCandidateIds.has(candidate.id);
                      return (
                        <tr
                          key={candidate.id}
                          onClick={() => handleToggleCandidate(candidate.id)}
                          style={{
                            borderBottom: '1px solid #f1f5f9',
                            backgroundColor: isChecked ? '#fdf2f8' : '#ffffff',
                            cursor: 'pointer',
                            transition: 'background-color 0.15s ease'
                          }}
                        >
                          <td style={{ padding: '12px 16px' }} onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleCandidate(candidate.id)}
                              style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                            />
                          </td>
                          <td style={{ padding: '12px 16px', fontWeight: 700, color: '#2563eb', fontSize: '13px' }}>
                            {candidate.regNo || '-'}
                          </td>
                          <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>
                            {candidate.name}
                          </td>
                          <td style={{ padding: '12px 16px', color: '#334155', fontSize: '13px', fontWeight: 600 }}>
                            {candidate.department || candidate.branch || '-'}
                          </td>
                          <td style={{ padding: '12px 16px', fontWeight: 800, color: '#16a34a', fontSize: '13px' }}>
                            {candidate.cgpa ? `${candidate.cgpa} CGPA` : '-'}
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: Number(candidate.currentArrears) > 0 ? '#dc2626' : '#16a34a' }}>
                            {candidate.currentArrears || '0'}
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: '12px', color: '#64748b' }}>
                            <div>{candidate.email}</div>
                            <div style={{ marginTop: '2px' }}>{candidate.mobile || '-'}</div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Modal Footer Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
              <div style={{ fontSize: '14px', color: '#475569', fontWeight: 600 }}>
                Selected: <strong style={{ color: '#be185d', fontSize: '16px' }}>{selectedCandidateIds.size}</strong> of {eligibleCandidates.length} Auto-Suggested Candidates
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedDriveForCandidates(null)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: '#475569',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleSaveNominatedCandidates}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: '#334155',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <UserCheck size={18} />
                  <span>Save Nominations Only ({selectedCandidateIds.size})</span>
                </button>

                <button
                  type="button"
                  disabled={isSaving || selectedCandidateIds.size === 0}
                  onClick={handleSaveAndSendEmailNotifications}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: isSaving || selectedCandidateIds.size === 0 ? '#94a3b8' : '#be185d',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: isSaving || selectedCandidateIds.size === 0 ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 14px rgba(190, 24, 93, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Send size={17} />
                  <span>{isSaving ? 'Sending...' : `Save & Send Email Notifications (${selectedCandidateIds.size})`}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

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
                <button type="submit" disabled={isSaving} style={{ padding: '10px 22px', borderRadius: '10px', border: 'none', backgroundColor: isSaving ? '#94a3b8' : '#be185d', color: '#ffffff', fontSize: '14px', fontWeight: 700, cursor: isSaving ? 'not-allowed' : 'pointer', boxShadow: '0 4px 14px rgba(190, 24, 93, 0.35)' }}>
                  {isSaving ? 'Saving...' : editingDrive ? 'Save Changes' : 'Create Drive & Suggest Candidates'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AUTOMATED EMAIL DISPATCH STATUS & PROGRESS MODAL */}
      {emailSendingStatus && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          zIndex: 1300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '650px',
            padding: '30px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
            border: '1px solid #fbcfe8'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#fce7f3', color: '#be185d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Automated Email Notifications
                  </h3>
                  <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                    Company: <strong>{emailSendingStatus.drive?.company}</strong> ({emailSendingStatus.drive?.role})
                  </div>
                </div>
              </div>
              
              {!emailSendingStatus.isSending && (
                <button onClick={() => setEmailSendingStatus(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}>
                  <X size={22} />
                </button>
              )}
            </div>

            {/* Progress Bar Container */}
            <div style={{ marginBottom: '24px', backgroundColor: '#f8fafc', padding: '18px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '13.5px', fontWeight: 700 }}>
                <span style={{ color: emailSendingStatus.isSending ? '#be185d' : '#166534' }}>
                  {emailSendingStatus.isSending
                    ? `✉️ Sending email ${emailSendingStatus.current} of ${emailSendingStatus.total}...`
                    : `🎉 Finished! Sent ${emailSendingStatus.total} candidate email notifications.`}
                </span>
                <span style={{ color: '#0f172a', fontWeight: 800 }}>
                  {Math.round((emailSendingStatus.current / (emailSendingStatus.total || 1)) * 100)}%
                </span>
              </div>

              {/* Graphical Progress Bar */}
              <div style={{ width: '100%', height: '10px', backgroundColor: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${Math.round((emailSendingStatus.current / (emailSendingStatus.total || 1)) * 100)}%`,
                    backgroundColor: emailSendingStatus.isSending ? '#be185d' : '#10b981',
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>

              {emailSendingStatus.isSending && emailSendingStatus.candidateName && (
                <div style={{ marginTop: '12px', fontSize: '12.5px', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Send size={14} color="#be185d" />
                  <span>Delivering to <strong>{emailSendingStatus.candidateName}</strong> ({emailSendingStatus.candidateEmail})</span>
                </div>
              )}
            </div>

            {/* Live Email Dispatch Logs */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>Transmission Log</span>
                <button
                  type="button"
                  onClick={() => setShowEmailPreview(!showEmailPreview)}
                  style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Eye size={14} /> {showEmailPreview ? 'Hide Email Preview' : 'Preview Email Template'}
                </button>
              </div>

              {showEmailPreview ? (
                <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px', backgroundColor: '#ffffff', fontSize: '12px' }}>
                  <div dangerouslySetInnerHTML={{ __html: generateDriveInvitationEmail({ student: { name: emailSendingStatus.candidateName || 'Candidate Name' }, drive: emailSendingStatus.drive }) }} />
                </div>
              ) : (
                <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: '#ffffff' }}>
                  {emailSendingStatus.logs.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                      Initializing email dispatch queue...
                    </div>
                  ) : (
                    emailSendingStatus.logs.map((log, lIdx) => (
                      <div key={lIdx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid #f1f5f9', fontSize: '13px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <CheckCircle2 size={16} color="#16a34a" />
                          <span style={{ fontWeight: 700, color: '#0f172a' }}>{log.name}</span>
                          <span style={{ color: '#64748b', fontSize: '12px' }}>({log.email})</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 700 }}>
                            {log.status}
                          </span>
                          <span style={{ color: '#94a3b8', fontSize: '11.5px' }}>{log.time}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px' }}>
              <button
                type="button"
                onClick={() => openWebEmailClient({ candidates: emailSendingStatus.selectedCandidates || [], drive: emailSendingStatus.drive })}
                style={{
                  padding: '10px 18px',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#1e293b',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Mail size={16} color="#be185d" /> Open in Gmail / Mail App
              </button>

              <button
                type="button"
                disabled={emailSendingStatus.isSending}
                onClick={() => setEmailSendingStatus(null)}
                style={{
                  padding: '10px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: emailSendingStatus.isSending ? '#cbd5e1' : '#0f172a',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: emailSendingStatus.isSending ? 'not-allowed' : 'pointer'
                }}
              >
                {emailSendingStatus.isSending ? 'Sending Notifications...' : 'Done'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* VIEW SELECTED NOMINATED CANDIDATES LIST MODAL */}
      {selectedCandidatesModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          zIndex: 1200,
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
            maxHeight: '85vh',
            overflowY: 'auto',
            padding: '30px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Selected Candidates
                  </h3>
                  <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: 800 }}>
                    {selectedCandidatesModal.candidates.length} Student(s)
                  </span>
                </div>
                <div style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
                  Drive: <strong>{selectedCandidatesModal.drive.company}</strong> ({selectedCandidatesModal.drive.role}) • {selectedCandidatesModal.drive.package}
                </div>
              </div>

              <button onClick={() => setSelectedCandidatesModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '6px' }}>
                <X size={24} />
              </button>
            </div>

            {/* Candidates List Table */}
            <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '16px', marginBottom: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '12px', fontWeight: 700, textAlign: 'left' }}>
                    <th style={{ padding: '12px 16px' }}>REG NO</th>
                    <th style={{ padding: '12px 16px' }}>STUDENT NAME</th>
                    <th style={{ padding: '12px 16px' }}>DEPARTMENT</th>
                    <th style={{ padding: '12px 16px' }}>CGPA</th>
                    <th style={{ padding: '12px 16px' }}>CONTACT</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCandidatesModal.candidates.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: '#94a3b8', fontSize: '14px' }}>
                        No candidate details found for this drive. Click "Candidates" button to auto-suggest and select students.
                      </td>
                    </tr>
                  ) : (
                    selectedCandidatesModal.candidates.map((candidate) => (
                      <tr key={candidate.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 700, color: '#2563eb', fontSize: '13px' }}>
                          {candidate.regNo || '-'}
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>
                          {candidate.name}
                        </td>
                        <td style={{ padding: '12px 16px', color: '#334155', fontSize: '13px', fontWeight: 600 }}>
                          {candidate.department || candidate.branch || '-'}
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 800, color: '#16a34a', fontSize: '13px' }}>
                          {candidate.cgpa ? `${candidate.cgpa} CGPA` : '-'}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '12px', color: '#64748b' }}>
                          <div>{candidate.email}</div>
                          <div style={{ marginTop: '2px' }}>{candidate.mobile || '-'}</div>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          <button
                            onClick={() => setViewingStudentProfile(candidate)}
                            title="View Complete 26-Attribute Profile Details"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              border: '1px solid #cbd5e1',
                              backgroundColor: '#ffffff',
                              color: '#0f172a',
                              fontSize: '12.5px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                            }}
                          >
                            <Eye size={14} color="#be185d" />
                            <span>View Details</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => setSelectedCandidatesModal(null)}
                style={{ padding: '10px 22px', borderRadius: '12px', backgroundColor: '#0f172a', color: '#ffffff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
              >
                Close List
              </button>
            </div>

          </div>
        </div>
      )}

      {/* FULL 26-ATTRIBUTE STUDENT DETAILS MODAL */}
      {viewingStudentProfile && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 1400,
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
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  backgroundColor: '#fce7f3', color: '#be185d',
                  fontSize: '24px', fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {(viewingStudentProfile.name || 'S').substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {viewingStudentProfile.name}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px', fontSize: '14px', color: '#64748b', flexWrap: 'wrap' }}>
                    <span><strong>Reg No:</strong> {viewingStudentProfile.regNo || 'N/A'}</span>
                    <span>•</span>
                    <span><strong>Dept:</strong> {viewingStudentProfile.department || viewingStudentProfile.branch || 'N/A'}</span>
                    <span>•</span>
                    <span style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, backgroundColor: '#dcfce7', color: '#166534' }}>
                      Active
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={() => setViewingStudentProfile(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '6px' }}>
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
                  <div><span style={{ color: '#64748b', fontSize: '12px' }}>10th Score</span><div style={{ fontWeight: 700, color: '#0f172a' }}>{viewingStudentProfile.tenthPercentage ? `${viewingStudentProfile.tenthPercentage}%` : 'N/A'}</div></div>
                  <div><span style={{ color: '#64748b', fontSize: '12px' }}>12th / Diploma</span><div style={{ fontWeight: 700, color: '#0f172a' }}>{viewingStudentProfile.twelfthPercentage ? `${viewingStudentProfile.twelfthPercentage}%` : 'N/A'}</div></div>
                  <div><span style={{ color: '#64748b', fontSize: '12px' }}>CGPA (till VI Sem)</span><div style={{ fontWeight: 800, color: '#2563eb', fontSize: '16px' }}>{viewingStudentProfile.cgpa || 'N/A'}</div></div>
                  <div><span style={{ color: '#64748b', fontSize: '12px' }}>Year of Passing</span><div style={{ fontWeight: 700, color: '#0f172a' }}>{viewingStudentProfile.yearOfPassing || 'N/A'}</div></div>
                  <div><span style={{ color: '#64748b', fontSize: '12px' }}>Arrears Cleared</span><div style={{ fontWeight: 700, color: '#166534' }}>{viewingStudentProfile.historyOfArrears || '0'}</div></div>
                  <div><span style={{ color: '#64748b', fontSize: '12px' }}>Current Arrears</span><div style={{ fontWeight: 800, color: Number(viewingStudentProfile.currentArrears) > 0 ? '#dc2626' : '#166534' }}>{viewingStudentProfile.currentArrears || '0'}</div></div>
                </div>
              </div>

              {/* Card 2: Contact & Personal Details */}
              <div style={{ backgroundColor: '#f8fafc', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '14px' }}>
                  <Phone size={20} color="#059669" /> Contact & Personal Info
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px' }}>
                  <div><span style={{ color: '#64748b' }}>Email:</span> <strong style={{ color: '#0f172a' }}>{viewingStudentProfile.email}</strong></div>
                  <div><span style={{ color: '#64748b' }}>Student Mobile:</span> <strong style={{ color: '#0f172a' }}>{viewingStudentProfile.mobile || 'N/A'}</strong></div>
                  <div><span style={{ color: '#64748b' }}>Parent Mobile:</span> <strong style={{ color: '#0f172a' }}>{viewingStudentProfile.parentMobile || 'N/A'}</strong></div>
                  <div><span style={{ color: '#64748b' }}>Date of Birth:</span> <strong style={{ color: '#0f172a' }}>{viewingStudentProfile.dob || 'N/A'}</strong> &nbsp;|&nbsp; <span style={{ color: '#64748b' }}>Gender:</span> <strong style={{ color: '#0f172a' }}>{viewingStudentProfile.gender || 'N/A'}</strong></div>
                  <div><span style={{ color: '#64748b' }}>Native District:</span> <strong style={{ color: '#0f172a' }}>{viewingStudentProfile.nativeDistrict || 'N/A'}</strong></div>
                  <div><span style={{ color: '#64748b' }}>Permanent Address:</span> <span style={{ color: '#334155', fontWeight: 500 }}>{viewingStudentProfile.permanentAddress || 'N/A'}</span></div>
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
                      {viewingStudentProfile.technicalSkills ? viewingStudentProfile.technicalSkills.split(',').map((skill, sIdx) => (
                        <span key={sIdx} style={{ backgroundColor: '#ede9fe', color: '#6d28d9', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700 }}>
                          {skill.trim()}
                        </span>
                      )) : <span style={{ color: '#94a3b8' }}>None listed</span>}
                    </div>
                  </div>
                  <div><span style={{ color: '#64748b', fontSize: '12px' }}>Certification Courses:</span> <div style={{ color: '#0f172a', fontWeight: 600 }}>{viewingStudentProfile.certifications || 'None'}</div></div>
                  <div><span style={{ color: '#64748b', fontSize: '12px' }}>Languages Known:</span> <div style={{ color: '#0f172a', fontWeight: 600 }}>{viewingStudentProfile.languagesKnown || 'English'}</div></div>
                </div>
              </div>

              {/* Card 4: Placement Preferences & Resume */}
              <div style={{ backgroundColor: '#f8fafc', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '14px' }}>
                  <MapPin size={20} color="#d97706" /> Placement Preferences & Resume
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px' }}>
                  <div><span style={{ color: '#64748b' }}>Wish to Work:</span> <strong style={{ color: '#0f172a' }}>{viewingStudentProfile.wishToWork || 'IT / Software Industry'}</strong></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12.5px' }}>
                    <div><span>Interview Anywhere:</span> <strong style={{ color: '#166534' }}>{viewingStudentProfile.willingInterviewAnyLocation || 'Yes'}</strong></div>
                    <div><span>Work Anywhere:</span> <strong style={{ color: '#166534' }}>{viewingStudentProfile.willingWorkAnyLocation || 'Yes'}</strong></div>
                    <div><span>Work in TN:</span> <strong style={{ color: '#166534' }}>{viewingStudentProfile.willingWorkTN || 'Yes'}</strong></div>
                    <div><span>Work in India:</span> <strong style={{ color: '#166534' }}>{viewingStudentProfile.willingWorkIndia || 'Yes'}</strong></div>
                  </div>
                  {viewingStudentProfile.futurePlan && (
                    <div><span style={{ color: '#64748b' }}>Future Plan:</span> <span style={{ color: '#334155' }}>{viewingStudentProfile.futurePlan}</span></div>
                  )}
                  <div style={{ marginTop: '8px' }}>
                    {viewingStudentProfile.resumeUrl ? (
                      <a href={viewingStudentProfile.resumeUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#be185d', color: '#ffffff', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
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
              <button onClick={() => setViewingStudentProfile(null)} style={{ padding: '10px 24px', borderRadius: '12px', backgroundColor: '#0f172a', color: '#ffffff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
