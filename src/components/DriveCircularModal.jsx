import React, { useState, useRef } from 'react';
import { X, Download, Printer, Edit3, Eye, Check, Sparkles, FileText, ArrowLeft, RefreshCw } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function DriveCircularModal({ drive, onClose, onSave }) {
  const printableRef = useRef(null);
  const [activeTab, setActiveTab] = useState('preview'); // 'preview' | 'edit'
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Helper to format default circular fields based on drive object
  const getInitialCircularData = (d) => {
    if (!d) return {};

    const company = d.company || 'COMPANY';
    const role = d.role || 'Software Engineer';
    const minCGPA = d.minCGPA || '6.5';
    const branches = d.branches || 'ECE/EEE/CSE/IT/AI&DS';
    const pkg = d.package || '4.00 LPA';
    const loc = d.location || 'Coimbatore';
    const driveDate = d.date || new Date().toLocaleDateString('en-GB');

    return {
      refNo: `09/2026-2027/TPC`,
      circularDate: driveDate,
      companyName: company.toUpperCase(),
      batchYear: '2027',
      eligibility: `B.E(${branches}) – 65% in 10th & 12th, CGPA: ${minCGPA} & ABOVE WITHOUT ANY STANDING ARREARS`,
      role: `➤ Internship + ${role}`,
      location: `➤ ${loc}`,
      positionOverview: `They are looking for enthusiastic and customer-focused individuals to join them as ${role} Interns. During this six-month internship, you'll gain practical experience supporting global customers, working with SaaS products, and collaborating with experienced Product and Engineering teams. Successful interns will be offered a full-time position as a ${role} based on their performance during the internship.`,
      salary: `➤ ₹5,000 per month\n➤ POST INTERN SALARY :${pkg}`,
      duration: `➤ 6 Months Internship cum Fulltime`,
      coreResponsibilities: [
        'Assist customers with product onboarding and account setup.',
        'Respond to customer queries via email, live chat, and support tickets.',
        'Troubleshoot product-related issues and provide timely resolutions.',
        'Support product demonstrations and customer training sessions.',
        'Work closely with the Product and Development teams to resolve customer concerns.',
        'Create and maintain support documentation and knowledge base articles.',
        'Learn industry-standard customer support tools and best practices.',
        'Deliver a positive customer experience through effective communication and problem-solving.'
      ].join('\n'),
      requirements: [
        'Excellent verbal and written communication skills in English.',
        'Basic computer knowledge and willingness to learn new technologies.',
        'Strong analytical and problem-solving skills.',
        'Positive attitude and customer-first mindset.',
        'Knowledge of SaaS, eCommerce, Shopify, or APIs is an added advantage but not mandatory.'
      ].join('\n'),
      learningObjectives: [
        'SaaS Product Support',
        'Customer Success & Customer Experience',
        'Ticketing & Helpdesk Management',
        'Troubleshooting & Issue Resolution',
        'Product Demonstrations',
        'Communication with Global Customers',
        'Knowledge Base Documentation',
        'SaaS Business Operations'
      ].join('\n'),
      benefits: [
        'Hands-on experience with live SaaS products and global customers',
        'Mentorship from experienced professionals',
        'Internship Completion Certificate',
        'Practical exposure to customer support tools and processes',
        'Opportunity to build technical, communication, and problem-solving skills',
        `Performance-based conversion to a full-time ${role} role upon successful completion of the internship`
      ].join('\n'),
      selectionProcess: `1. GD\n2. HR\n3. MANAGERIAL ROUND`,
      aboutCompany: `${company} is a bootstrapped software company founded in April 2017, with its main development center located nearby in Coimbatore, Tamil Nadu, India. It builds marketing, lead generation, and customer retention tools—such as plugins and SaaS products—to help online retail stores increase their revenue.`,
      companyWebsite: d.website || `https://${company.toLowerCase().replace(/[^a-z0-9]/g, '')}.io/`,
      registrationLink: d.url || d.driveUrl || 'https://forms.gle/KgHvrAgA3oAwUgCU9',
      registrationDeadline: `LINK WILL CLOSE BY ${driveDate} @ 10 AM`,
      headSignatureLabel: 'HEAD –T&P',
      principalSignatureLabel: 'PRINCIPAL'
    };
  };

  const [circularData, setCircularData] = useState(() => getInitialCircularData(drive));

  // Reset to default auto-fill
  const handleResetDefaults = () => {
    setCircularData(getInitialCircularData(drive));
  };

  // Download Circular as PDF
  const handleDownloadPDF = async () => {
    if (!printableRef.current) return;
    setIsGeneratingPDF(true);

    try {
      const element = printableRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // High DPI resolution for crisp PDF text
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const fileName = `${circularData.companyName.replace(/\s+/g, '_')}_Campus_Drive_Circular.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Error generating PDF document. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Browser Print handler
  const handlePrint = () => {
    const printContent = printableRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Campus Drive Circular - ${circularData.companyName}</title>
          <style>
            @page { size: A4; margin: 15mm; }
            body { font-family: 'Times New Roman', Times, serif; margin: 0; padding: 0; color: #000; }
            table { width: 100%; border-collapse: collapse; page-break-inside: auto; }
            tr { page-break-inside: avoid; page-break-after: auto; }
            td, th { border: 1px solid #000; padding: 8px 12px; font-size: 13px; line-height: 1.5; vertical-align: top; }
            .header-banner { background-color: #F59E0B !important; color: #000; font-weight: bold; text-align: center; font-size: 15px; padding: 10px; border: 1px solid #000; }
            .label-col { background-color: #B4C6E7 !important; font-weight: bold; width: 28%; }
            .bullet-item { display: flex; align-items: flex-start; gap: 6px; margin-bottom: 4px; }
            .arrow-icon { display: inline-block; width: 0; height: 0; border-top: 5px solid transparent; border-bottom: 5px solid transparent; border-left: 7px solid #000; margin-top: 4px; flex-shrink: 0; }
            .signatures { margin-top: 40px; display: flex; justify-content: space-between; font-weight: bold; font-size: 14px; padding: 0 40px; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 400);
  };

  // Helper renderer for multi-line bullet text (e.g. Responsibilities, Requirements)
  const renderBulletList = (text, prefix = '➤') => {
    if (!text) return null;
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {lines.map((line, idx) => {
          const cleanLine = line.replace(/^[➤•\-\*]\s*/, '');
          return (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#111827', lineHeight: '1.45' }}>
              <span style={{ fontSize: '12px', color: '#000', fontWeight: 'bold', flexShrink: 0, marginTop: '1px' }}>{prefix}</span>
              <span>{cleanLine}</span>
            </div>
          );
        })}
      </div>
    );
  };

  // Helper renderer for numbered list (Selection Process)
  const renderNumberedList = (text) => {
    if (!text) return null;
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {lines.map((line, idx) => {
          const cleanLine = line.replace(/^\d+[\.\)]\s*/, '');
          return (
            <div key={idx} style={{ fontSize: '13px', color: '#111827', fontWeight: 'bold' }}>
              {idx + 1}. {cleanLine}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 1300,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '1050px',
        height: '92vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)',
        overflow: 'hidden'
      }}>
        {/* Top Control Bar */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Campus Drive Circular Generator
              </h3>
              <div style={{ fontSize: '12.5px', color: '#64748b' }}>
                Company: <strong style={{ color: '#0f172a' }}>{circularData.companyName}</strong> ({drive?.role || 'Drive'})
              </div>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', backgroundColor: '#e2e8f0', borderRadius: '10px', padding: '3px' }}>
              <button
                onClick={() => setActiveTab('preview')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: activeTab === 'preview' ? '#ffffff' : 'transparent',
                  color: activeTab === 'preview' ? '#0f172a' : '#64748b',
                  fontWeight: activeTab === 'preview' ? 700 : 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'preview' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none'
                }}
              >
                <Eye size={15} /> Document Preview
              </button>
              <button
                onClick={() => setActiveTab('edit')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: activeTab === 'edit' ? '#ffffff' : 'transparent',
                  color: activeTab === 'edit' ? '#0f172a' : '#64748b',
                  fontWeight: activeTab === 'edit' ? 700 : 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'edit' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none'
                }}
              >
                <Edit3 size={15} /> Edit Fields
              </button>
            </div>

            {/* Print & Download Action Buttons */}
            <button
              onClick={handlePrint}
              title="Print document directly"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#334155',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Printer size={16} /> Print
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: isGeneratingPDF ? '#94a3b8' : '#be185d',
                color: '#ffffff',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: isGeneratingPDF ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(190, 24, 93, 0.3)'
              }}
            >
              <Download size={16} />
              <span>{isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}</span>
            </button>

            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}>
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Main Workspace Body */}
        <div style={{ flex: 1, overflowY: 'auto', backgroundColor: activeTab === 'preview' ? '#64748b' : '#ffffff', padding: activeTab === 'preview' ? '24px' : '24px 32px' }}>

          {/* EDIT FORM TAB */}
          {activeTab === 'edit' && (
            <div style={{ maxWidth: '850px', margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Customize Circular Details</h4>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: '2px 0 0 0' }}>Fields pre-filled from drive are highlighted. Update any section manually below.</p>
                </div>
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', fontSize: '12.5px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}
                >
                  <RefreshCw size={14} /> Auto-Fill Defaults
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Reference No (Ref No)</label>
                  <input
                    type="text"
                    value={circularData.refNo}
                    onChange={e => setCircularData({ ...circularData, refNo: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Circular Date</label>
                  <input
                    type="text"
                    value={circularData.circularDate}
                    onChange={e => setCircularData({ ...circularData, circularDate: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Company Name (Banner)</label>
                  <input
                    type="text"
                    value={circularData.companyName}
                    onChange={e => setCircularData({ ...circularData, companyName: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 700 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Batch Year</label>
                  <input
                    type="text"
                    value={circularData.batchYear}
                    onChange={e => setCircularData({ ...circularData, batchYear: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              </div>

              {/* Table Fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Eligibility Criteria</label>
                  <textarea
                    rows={2}
                    value={circularData.eligibility}
                    onChange={e => setCircularData({ ...circularData, eligibility: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontFamily: 'inherit' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Role</label>
                    <input
                      type="text"
                      value={circularData.role}
                      onChange={e => setCircularData({ ...circularData, role: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Location</label>
                    <input
                      type="text"
                      value={circularData.location}
                      onChange={e => setCircularData({ ...circularData, location: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Position Overview</label>
                  <textarea
                    rows={3}
                    value={circularData.positionOverview}
                    onChange={e => setCircularData({ ...circularData, positionOverview: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontFamily: 'inherit' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Salary / Stipend</label>
                    <textarea
                      rows={2}
                      value={circularData.salary}
                      onChange={e => setCircularData({ ...circularData, salary: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontFamily: 'inherit' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Duration</label>
                    <input
                      type="text"
                      value={circularData.duration}
                      onChange={e => setCircularData({ ...circularData, duration: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Core Responsibilities (One item per line)</label>
                  <textarea
                    rows={6}
                    value={circularData.coreResponsibilities}
                    onChange={e => setCircularData({ ...circularData, coreResponsibilities: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontFamily: 'inherit' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Requirements (One item per line)</label>
                  <textarea
                    rows={5}
                    value={circularData.requirements}
                    onChange={e => setCircularData({ ...circularData, requirements: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontFamily: 'inherit' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Learning Objectives (One item per line)</label>
                  <textarea
                    rows={5}
                    value={circularData.learningObjectives}
                    onChange={e => setCircularData({ ...circularData, learningObjectives: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontFamily: 'inherit' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Benefits (One item per line)</label>
                  <textarea
                    rows={5}
                    value={circularData.benefits}
                    onChange={e => setCircularData({ ...circularData, benefits: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontFamily: 'inherit' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Selection Process (Numbered lines)</label>
                  <textarea
                    rows={3}
                    value={circularData.selectionProcess}
                    onChange={e => setCircularData({ ...circularData, selectionProcess: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontFamily: 'inherit' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>About Company</label>
                  <textarea
                    rows={3}
                    value={circularData.aboutCompany}
                    onChange={e => setCircularData({ ...circularData, aboutCompany: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontFamily: 'inherit' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Company Website URL</label>
                    <input
                      type="text"
                      value={circularData.companyWebsite}
                      onChange={e => setCircularData({ ...circularData, companyWebsite: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Registration Form Link</label>
                    <input
                      type="text"
                      value={circularData.registrationLink}
                      onChange={e => setCircularData({ ...circularData, registrationLink: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Registration Deadline Notice</label>
                  <input
                    type="text"
                    value={circularData.registrationDeadline}
                    onChange={e => setCircularData({ ...circularData, registrationDeadline: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 700, color: '#be185d' }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', borderRadius: '10px', backgroundColor: '#0f172a', color: '#ffffff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                >
                  <Eye size={16} /> View Preview & Download
                </button>
              </div>
            </div>
          )}

          {/* DOCUMENT PREVIEW TAB */}
          {activeTab === 'preview' && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div
                ref={printableRef}
                id="printable-circular-document"
                style={{
                  width: '210mm',
                  minHeight: '297mm',
                  backgroundColor: '#ffffff',
                  padding: '16mm 18mm',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  color: '#000000',
                  fontFamily: '"Liberation Serif", "Times New Roman", Times, Georgia, serif',
                  boxSizing: 'border-box'
                }}
              >
                {/* College Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginBottom: '8px' }}>
                  <img
                    src="/ait-logo.svg"
                    alt="AIT Logo"
                    style={{ width: '64px', height: '64px', objectFit: 'contain' }}
                  />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '26px', fontWeight: 900, color: '#BA1E1E', letterSpacing: '0.02em', lineHeight: 1.1, fontFamily: 'Arial, Helvetica, sans-serif' }}>
                      ADITHYA
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#1B2A4A', letterSpacing: '0.04em', lineHeight: 1.1, fontFamily: 'Arial, Helvetica, sans-serif' }}>
                      INSTITUTE OF TECHNOLOGY
                    </div>
                    <div style={{ marginTop: '2px', display: 'inline-block', backgroundColor: '#E86C00', color: '#ffffff', fontSize: '10px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '2px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                      An Industry Integrated Institution
                    </div>
                    <div style={{ fontSize: '9.5px', color: '#333333', fontWeight: 'bold', marginTop: '2px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                      An Autonomous Institution | Accredited by NAAC with A+ Grade
                    </div>
                  </div>
                </div>

                {/* Decorative Double Bar */}
                <div style={{ borderTop: '3px solid #E86C00', borderBottom: '1px solid #E86C00', height: '2px', margin: '8px 0 14px 0' }} />

                {/* Circular Title */}
                <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 'bold', textDecoration: 'underline', textUnderlineOffset: '3px', letterSpacing: '0.04em', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    CAMPUS DRIVE – CIRCULAR
                  </span>
                </div>

                {/* Reference Number & Date Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '13px', fontWeight: 'bold', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  <div>Ref No: {circularData.refNo}</div>
                  <div>{circularData.circularDate}</div>
                </div>

                {/* Yellow Recruitment Banner */}
                <div style={{
                  backgroundColor: '#EAA000',
                  border: '1px solid #000000',
                  borderBottom: 'none',
                  textAlign: 'center',
                  padding: '9px 12px',
                  fontWeight: 900,
                  fontSize: '13.5px',
                  color: '#000000',
                  letterSpacing: '0.03em',
                  fontFamily: 'Arial, Helvetica, sans-serif'
                }}>
                  {circularData.companyName} CAMPUS RECRUITMENT FOR THE BATCH OF {circularData.batchYear}
                </div>

                {/* Main Circular Details Table */}
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000000' }}>
                  <tbody>
                    {/* Eligibility */}
                    <tr>
                      <td style={{ backgroundColor: '#A4B6D4', width: '27%', border: '1px solid #000000', padding: '8px 12px', fontWeight: 'bold', fontSize: '13px', fontFamily: 'Arial, Helvetica, sans-serif', verticalAlign: 'top' }}>
                        Eligibility
                      </td>
                      <td style={{ border: '1px solid #000000', padding: '8px 12px', fontWeight: 'bold', fontSize: '12.5px', fontFamily: 'Arial, Helvetica, sans-serif', lineHeight: 1.4 }}>
                        {circularData.eligibility}
                      </td>
                    </tr>

                    {/* Role */}
                    <tr>
                      <td style={{ backgroundColor: '#A4B6D4', border: '1px solid #000000', padding: '8px 12px', fontWeight: 'bold', fontSize: '13px', fontFamily: 'Arial, Helvetica, sans-serif', verticalAlign: 'top' }}>
                        Role
                      </td>
                      <td style={{ border: '1px solid #000000', padding: '8px 12px', fontWeight: 'bold', fontSize: '13px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                        {renderBulletList(circularData.role)}
                      </td>
                    </tr>

                    {/* Location */}
                    <tr>
                      <td style={{ backgroundColor: '#A4B6D4', border: '1px solid #000000', padding: '8px 12px', fontWeight: 'bold', fontSize: '13px', fontFamily: 'Arial, Helvetica, sans-serif', verticalAlign: 'top' }}>
                        Location
                      </td>
                      <td style={{ border: '1px solid #000000', padding: '8px 12px', fontSize: '13px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                        {renderBulletList(circularData.location)}
                      </td>
                    </tr>

                    {/* Position Overview */}
                    <tr>
                      <td style={{ backgroundColor: '#A4B6D4', border: '1px solid #000000', padding: '8px 12px', fontWeight: 'bold', fontSize: '13px', fontFamily: 'Arial, Helvetica, sans-serif', verticalAlign: 'top' }}>
                        Position Overview
                      </td>
                      <td style={{ border: '1px solid #000000', padding: '8px 12px', fontSize: '12.5px', lineHeight: 1.45 }}>
                        {circularData.positionOverview}
                      </td>
                    </tr>

                    {/* Salary */}
                    <tr>
                      <td style={{ backgroundColor: '#A4B6D4', border: '1px solid #000000', padding: '8px 12px', fontWeight: 'bold', fontSize: '13px', fontFamily: 'Arial, Helvetica, sans-serif', verticalAlign: 'top' }}>
                        Salary
                      </td>
                      <td style={{ border: '1px solid #000000', padding: '8px 12px', fontSize: '13px', fontWeight: 'bold' }}>
                        {renderBulletList(circularData.salary)}
                      </td>
                    </tr>

                    {/* Duration */}
                    <tr>
                      <td style={{ backgroundColor: '#A4B6D4', border: '1px solid #000000', padding: '8px 12px', fontWeight: 'bold', fontSize: '13px', fontFamily: 'Arial, Helvetica, sans-serif', verticalAlign: 'top' }}>
                        Duration
                      </td>
                      <td style={{ border: '1px solid #000000', padding: '8px 12px', fontSize: '13px', fontWeight: 'bold' }}>
                        {renderBulletList(circularData.duration)}
                      </td>
                    </tr>

                    {/* Core Responsibilities */}
                    <tr>
                      <td style={{ backgroundColor: '#A4B6D4', border: '1px solid #000000', padding: '8px 12px', fontWeight: 'bold', fontSize: '13px', fontFamily: 'Arial, Helvetica, sans-serif', verticalAlign: 'top' }}>
                        Core Responsibilities
                      </td>
                      <td style={{ border: '1px solid #000000', padding: '8px 12px' }}>
                        {renderBulletList(circularData.coreResponsibilities)}
                      </td>
                    </tr>

                    {/* Requirements */}
                    <tr>
                      <td style={{ backgroundColor: '#A4B6D4', border: '1px solid #000000', padding: '8px 12px', fontWeight: 'bold', fontSize: '13px', fontFamily: 'Arial, Helvetica, sans-serif', verticalAlign: 'top' }}>
                        Requirements
                      </td>
                      <td style={{ border: '1px solid #000000', padding: '8px 12px' }}>
                        {renderBulletList(circularData.requirements)}
                      </td>
                    </tr>

                    {/* Learning Objectives */}
                    <tr>
                      <td style={{ backgroundColor: '#A4B6D4', border: '1px solid #000000', padding: '8px 12px', fontWeight: 'bold', fontSize: '13px', fontFamily: 'Arial, Helvetica, sans-serif', verticalAlign: 'top' }}>
                        Learning objectives
                      </td>
                      <td style={{ border: '1px solid #000000', padding: '8px 12px' }}>
                        {renderBulletList(circularData.learningObjectives)}
                      </td>
                    </tr>

                    {/* Benefits */}
                    <tr>
                      <td style={{ backgroundColor: '#A4B6D4', border: '1px solid #000000', padding: '8px 12px', fontWeight: 'bold', fontSize: '13px', fontFamily: 'Arial, Helvetica, sans-serif', verticalAlign: 'top' }}>
                        Benefits
                      </td>
                      <td style={{ border: '1px solid #000000', padding: '8px 12px' }}>
                        {renderBulletList(circularData.benefits)}
                      </td>
                    </tr>

                    {/* Selection Process */}
                    <tr>
                      <td style={{ backgroundColor: '#A4B6D4', border: '1px solid #000000', padding: '8px 12px', fontWeight: 'bold', fontSize: '13px', fontFamily: 'Arial, Helvetica, sans-serif', verticalAlign: 'top' }}>
                        Selection Process
                      </td>
                      <td style={{ border: '1px solid #000000', padding: '8px 12px 8px 30px' }}>
                        {renderNumberedList(circularData.selectionProcess)}
                      </td>
                    </tr>

                    {/* About Company */}
                    <tr>
                      <td style={{ backgroundColor: '#A4B6D4', border: '1px solid #000000', padding: '8px 12px', fontWeight: 'bold', fontSize: '13px', fontFamily: 'Arial, Helvetica, sans-serif', verticalAlign: 'top' }}>
                        About Company
                      </td>
                      <td style={{ border: '1px solid #000000', padding: '8px 12px', fontSize: '12.5px', lineHeight: 1.45 }}>
                        <div>{circularData.aboutCompany}</div>
                        {circularData.companyWebsite && (
                          <div style={{ marginTop: '4px', fontWeight: 'bold', color: '#6B21A8' }}>
                            <a href={circularData.companyWebsite} target="_blank" rel="noreferrer" style={{ color: '#6B21A8', textDecoration: 'underline' }}>
                              {circularData.companyWebsite}
                            </a>
                          </div>
                        )}
                      </td>
                    </tr>

                    {/* LINK TO REGISTER */}
                    <tr>
                      <td style={{ backgroundColor: '#A4B6D4', border: '1px solid #000000', padding: '8px 12px', fontWeight: 'bold', fontSize: '13px', fontFamily: 'Arial, Helvetica, sans-serif', verticalAlign: 'top' }}>
                        LINK TO REGISTER
                      </td>
                      <td style={{ border: '1px solid #000000', padding: '8px 12px', fontSize: '13px' }}>
                        {circularData.registrationLink && (
                          <div>
                            <a href={circularData.registrationLink} target="_blank" rel="noreferrer" style={{ color: '#2563EB', textDecoration: 'underline', wordBreak: 'break-all', fontWeight: 'bold' }}>
                              {circularData.registrationLink}
                            </a>
                          </div>
                        )}
                        {circularData.registrationDeadline && (
                          <div style={{ marginTop: '8px', fontWeight: 900, fontSize: '13px', color: '#000000', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                            {circularData.registrationDeadline}
                          </div>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Footer Signatures */}
                <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', fontWeight: 900, fontSize: '13.5px', fontFamily: 'Arial, Helvetica, sans-serif', letterSpacing: '0.02em' }}>
                  <div>{circularData.headSignatureLabel}</div>
                  <div>{circularData.principalSignatureLabel}</div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
