import React, { useState, useEffect, useRef } from 'react';
import {
  ProfileIcon,
  ApplicationsIcon,
  CalendarIcon,
  AssessmentsIcon,
  ResumeIcon,
  TrainingIcon,
  MockInterviewIcon,
  CertificatesIcon,
  LeaderboardIcon,
  StatsIcon,
  DocumentsIcon,
  SettingsIcon,
  CheckIcon,
  SparklesIcon,
  UploadIcon,
  FilePdfIcon,
  KeyIcon,
  InfoIcon,
  RefreshIcon,
  DownloadIcon
} from './Icons';

export default function FeatureView({ activeTab, drives, setActiveTab, onApplyDrive }) {
  if (activeTab === 'profile') {
    return (
      <div className="feature-page-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
            alt="Jayasurya K"
            style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary-maroon)' }}
            onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=Jayasurya+K&background=4C1536&color=fff'; }}
          />
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '800' }}>Jayasurya K</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '600' }}>B.Tech - Information Technology (IV Year)</p>
            <p style={{ color: 'var(--primary-maroon)', fontSize: '13px', fontWeight: '700', marginTop: '4px' }}>Reg No: 717822IT045 | CGPA: 8.74</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          <div style={{ padding: '20px', border: '1px solid var(--border-light)', borderRadius: '16px', backgroundColor: 'var(--bg-card)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '14px', color: 'var(--primary-maroon)' }}>Academic Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px' }}>
              <div><strong>Department:</strong> Information Technology</div>
              <div><strong>College:</strong> AIT Engineering College</div>
              <div><strong>Batch:</strong> 2022 - 2026</div>
              <div><strong>Arrears:</strong> 0 History of Arrears</div>
            </div>
          </div>

          <div style={{ padding: '20px', border: '1px solid var(--border-light)', borderRadius: '16px', backgroundColor: 'var(--bg-card)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '14px', color: 'var(--primary-maroon)' }}>Contact Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px' }}>
              <div><strong>Email:</strong> jayasurya.k@ait.edu.in</div>
              <div><strong>Phone:</strong> +91 98765 43210</div>
              <div><strong>LinkedIn:</strong> linkedin.com/in/jayasuryak</div>
              <div><strong>GitHub:</strong> github.com/jayasuryak</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'applications') {
    return (
      <div className="feature-page-container">
        <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ApplicationsIcon /> My Applications
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {drives.map(drive => (
            <div key={drive.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 24px', border: '1px solid var(--border-light)', borderRadius: '16px',
              backgroundColor: 'var(--bg-card)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div className="company-logo" style={{ backgroundColor: drive.logoBg, color: drive.logoColor }}>
                  {drive.logoText}
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '800' }}>{drive.company}</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>{drive.role} • {drive.ctc}</p>
                </div>
              </div>

              <div>
                {drive.applied ? (
                  <span style={{
                    padding: '6px 14px', borderRadius: '12px', fontSize: '12px', fontWeight: '800',
                    backgroundColor: '#DCFCE7', color: '#15803D', display: 'inline-flex', alignItems: 'center', gap: '4px'
                  }}>
                    <CheckIcon style={{ width: '14px', height: '14px' }} /> Applied & Under Review
                  </span>
                ) : (
                  <button className="btn-apply" onClick={() => onApplyDrive(drive)}>Apply Now</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'calendar') {
    return (
      <div className="feature-page-container">
        <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CalendarIcon /> Drive Calendar 2025
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { date: '25 Jul 2025', company: 'Zoho Corporation', role: 'Software Developer', status: 'Upcoming' },
            { date: '30 Jul 2025', company: 'Infosys', role: 'System Engineer', status: 'Upcoming' },
            { date: '05 Aug 2025', company: 'TCS', role: 'Digital Engineer', status: 'Scheduled' },
            { date: '12 Aug 2025', company: 'Accenture', role: 'Advanced App Engineering', status: 'Scheduled' },
            { date: '18 Aug 2025', company: 'Cognizant', role: 'GenC Next Engineer', status: 'Scheduled' },
            { date: '25 Aug 2025', company: 'Wipro', role: 'Elite Developer', status: 'Upcoming' },
          ].map((item, idx) => (
            <div key={idx} style={{
              padding: '18px', border: '1px solid var(--border-light)', borderRadius: '16px',
              backgroundColor: 'var(--bg-card)', display: 'flex', flexDirection: 'column', gap: '8px'
            }}>
              <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primary-maroon)' }}>📅 {item.date}</span>
              <span style={{ fontSize: '15px', fontWeight: '800' }}>{item.company}</span>
              <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: '600' }}>{item.role}</span>
              <span style={{
                fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '10px',
                backgroundColor: '#EFF6FF', color: '#1D4ED8', alignSelf: 'flex-start', marginTop: '4px'
              }}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'resume') {
    const [subTab, setSubTab] = useState('checker');
    
    // Inbuilt Gemini API Key. Paste your key here or set VITE_GEMINI_API_KEY in your .env file
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
    
    // Checker states
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [results, setResults] = useState(null);
    const [detailsTab, setDetailsTab] = useState('improvements');
    const [pastedText, setPastedText] = useState('');
    const [showPasteArea, setShowPasteArea] = useState(false);
    const [animatedScore, setAnimatedScore] = useState(0);

    // Builder states
    const [formData, setFormData] = useState({
      name: 'Jayasurya K',
      role: 'Associate Software Engineer',
      email: 'jayasurya.k@ait.edu.in',
      phone: '+91 98765 43210',
      linkedin: 'linkedin.com/in/jayasuryak',
      github: 'github.com/jayasuryak',
      education: 'B.Tech in Information Technology (IV Year) | AIT Engineering College | CGPA: 8.74',
      experience: 'Frontend Development Intern, ABC Corp (May 2025 - July 2025)\n- Resolved 25+ frontend issues in React codebase, improving system stability by 15%\n- Collaborated with design and engineering teams to build modular components\n- Assisted in implementing dashboard telemetry views.',
      projects: 'Placement Management Portal (React, CSS)\n- Built interactive web application for placement drive management\n- Designed responsive UI with dark mode support and custom dashboards\n\nPersonal Weather App (React, Web APIs)\n- Developed simple forecasting application integrating REST services',
      skills: ['React', 'JavaScript', 'HTML', 'CSS', 'SQL', 'Git', 'Java', 'C++'],
      newSkill: ''
    });

    useEffect(() => {
      if (results?.score !== undefined) {
        setAnimatedScore(0);
        const timeout = setTimeout(() => {
          setAnimatedScore(results.score);
        }, 100);
        return () => clearTimeout(timeout);
      }
    }, [results]);

    const handleDrag = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const droppedFile = e.dataTransfer.files[0];
        processFile(droppedFile);
      }
    };

    const handleFileSelect = (e) => {
      if (e.target.files && e.target.files[0]) {
        processFile(e.target.files[0]);
      }
    };

    const processFile = (selectedFile) => {
      const type = selectedFile.type;
      const sizeMB = selectedFile.size / (1024 * 1024);
      if (sizeMB > 5) {
        alert("File size exceeds 5MB limit.");
        return;
      }
      setFile(selectedFile);

      const reader = new FileReader();
      if (type === 'application/pdf') {
        reader.onloadend = () => {
          const base64Data = reader.result.split(',')[1];
          analyzeResume(base64Data, 'application/pdf', selectedFile.name);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        // Assume text file
        reader.onload = () => {
          analyzeResume(reader.result, 'text/plain', selectedFile.name);
        };
        reader.readAsText(selectedFile);
      }
    };

    const handlePastedTextSubmit = () => {
      if (!pastedText.trim()) return;
      setFile({ name: 'pasted_text.txt', type: 'text/plain', size: pastedText.length });
      setShowPasteArea(false);
      analyzeResume(pastedText, 'text/plain', 'pasted_text.txt');
    };

    const handleUseSample = () => {
      setFile({ name: 'Jayasurya_K_IT_Resume.pdf', type: 'application/pdf', size: 124000 });
      
      const dummyText = `JAYASURYA K
jayasurya.k@ait.edu.in | +91 98765 43210 | linkedin.com/in/jayasuryak | github.com/jayasuryak

B.Tech - Information Technology (IV Year) - AIT Engineering College
CGPA: 8.74

SKILLS: React, JavaScript, HTML, CSS, SQL, Git, Java, C++

EXPERIENCE:
Frontend Development Intern, ABC Corp (May 2025 - July 2025)
- Worked on frontend bug fixes.

PROJECTS:
1. Placement Management Portal
- Built a placement management website using React and CSS.
2. Weather App
- A simple weather forecasting app using API.`;

      if (GEMINI_API_KEY) {
        analyzeResume(dummyText, 'text/plain', 'Jayasurya_K_IT_Resume.pdf');
      } else {
        analyzeResume(null, 'application/pdf', 'Jayasurya_K_IT_Resume.pdf');
      }
    };

    const getMockResult = (name) => {
      return {
        score: 78,
        rating: "Good",
        strengths: [
          "Excellent academic background (8.74 CGPA)",
          "Solid foundation in JavaScript & React core components",
          "Structured layout with clear contact & GitHub links",
          "Good use of bullet points for readability"
        ],
        improvements: [
          "Quantify project achievements with metrics (e.g. page speed improvements, user count)",
          "Add a short, professional profile summary at the very top of your resume",
          "Expand technical skills to cover standard modern tools (e.g. TypeScript, Next.js, Redux)",
          "Rewrite experiences using the STAR method (Situation, Task, Action, Result)"
        ],
        keywordAnalysis: {
          found: ["React", "JavaScript", "HTML", "CSS", "SQL", "Git", "Java", "C++"],
          missing: ["TypeScript", "Next.js", "Redux", "Unit Testing", "CI/CD", "Tailwind CSS", "REST API"]
        },
        alignment: "Strong alignment with Junior Frontend Engineer and Software Developer Intern roles.",
        rewrites: [
          {
            original: "Worked on frontend bug fixes during internship.",
            rewritten: "Resolved 25+ frontend issues in React codebase, improving system stability by 15% and collaborating with a team of 4 engineers."
          },
          {
            original: "Built a weather forecasting app using an API.",
            rewritten: "Developed and deployed a responsive Weather App using React, integrating OpenWeather REST API to serve real-time forecasts to over 500+ active users."
          },
          {
            original: "Built interactive web application for placement drive management.",
            rewritten: "Designed and implemented a placement management dashboard in React, reducing processing delays for drive registrations by 40%."
          }
        ]
      };
    };

    const analyzeResume = async (content, mimeType, name) => {
      setLoading(true);
      setScanProgress(0);
      
      const steps = [
        { text: "Extracting resume structure and typography...", delay: 600 },
        { text: "Analyzing ATS keywords and technical density...", delay: 1300 },
        { text: "Evaluating experience impact with STAR format...", delay: 2000 },
        { text: "Formulating critical scoring vectors...", delay: 2700 }
      ];
      
      steps.forEach((step, idx) => {
        setTimeout(() => {
          setScanProgress(idx);
        }, step.delay);
      });

      try {
        if (!GEMINI_API_KEY) {
          // Mock mode fallback
          setTimeout(() => {
            setResults(getMockResult(name));
            setLoading(false);
          }, 3500);
          return;
        }

        const promptText = `You are an elite corporate recruiter and Applicant Tracking System (ATS) optimization expert.
Conduct a rigorous, highly accurate, and comprehensive audit of the attached resume. Your scoring must be realistic and reflect industry standard recruiting filters.
Provide analysis and recommendations, and return ONLY a JSON response conforming to the schema below.

Scoring Criteria Guidelines:
- High Score (85-100): Excellent keyword alignment, quantified achievements (STAR method), clear work history, clean structural hierarchy.
- Medium Score (70-84): Good layout and core skills, but lacks numerical metrics, has weak action verbs, or misses standard keywords.
- Low Score (<70): Poor layout structure, zero metrics, weak action statements, grammatical issues, or massive keyword gaps.

Return a JSON object matching this schema EXACTLY:
{
  "score": number (an integer from 0 to 100 representing a strict, realistic ATS score),
  "rating": "Excellent!" (score >= 85) | "Good" (70-84) | "Average" (50-69) | "Needs Improvement" (<50),
  "strengths": [string], (exactly 4 key professional strengths discovered in their resume)
  "improvements": [string], (up to 5 actionable, critical improvements to boost their score)
  "keywordAnalysis": {
    "found": [string], (up to 10 core technical and domain-specific keywords identified)
    "missing": [string] (up to 8 highly relevant industry-standard technical keywords they should add for their target roles)
  },
  "alignment": string (detailed analysis of target roles and industry alignment),
  "rewrites": [
    {
      "original": string, (a weak, passive, or metric-less bullet point from their resume)
      "rewritten": string (a high-impact rewritten version using the STAR method, starting with a strong action verb and containing realistic quantitative metrics)
    }
  ] (exactly 3 bullet point rewrites)
}

Do not return any markdown tags, trailing commas, or prefix commentary. Return ONLY the raw JSON block.`;

        const requestBody = {
          contents: [
            {
              parts: [
                { text: promptText },
                mimeType === 'application/pdf'
                  ? { inlineData: { mimeType, data: content } }
                  : { text: `Resume Text:\n\n${content}` }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json"
          }
        };

        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-3.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          const errBody = await response.json().catch(() => ({}));
          throw new Error(errBody?.error?.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!resultText) {
          throw new Error("Empty response from Gemini API");
        }

        let parsed;
        try {
          parsed = JSON.parse(resultText.trim());
        } catch (err) {
          const jsonMatch = resultText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            parsed = JSON.parse(jsonMatch[0].trim());
          } else {
            throw new Error("Failed to parse JSON response from Gemini API");
          }
        }
        
        setTimeout(() => {
          setResults(parsed);
          setLoading(false);
        }, 3200);

      } catch (err) {
        console.error("Gemini API Error:", err);
        setTimeout(() => {
          alert(`API Analysis failed: ${err.message || 'Unknown Error'}. Falling back to high-fidelity Mock Mode so you can see the interface.`);
          setResults(getMockResult(name || "Uploaded Resume"));
          setLoading(false);
        }, 1500);
      }
    };

    const handleReset = () => {
      setFile(null);
      setResults(null);
      setPastedText('');
    };

    const handleDownloadReport = () => {
      if (!results) return;
      const reportText = `=========================================
ATS RESUME EVALUATION REPORT (AI GENERATED)
=========================================
Score: ${results.score} / 100
Rating: ${results.rating}
Industry Alignment: ${results.alignment}

KEY STRENGTHS:
${results.strengths.map(s => `- [✓] ${s}`).join('\n')}

RECOMMENDED IMPROVEMENTS:
${results.improvements.map(i => `- [ ] ${i}`).join('\n')}

KEYWORD ANALYSIS:
- Found: ${results.keywordAnalysis.found.join(', ')}
- Missing: ${results.keywordAnalysis.missing.join(', ')}

AI BULLET REWRITES (STAR METHOD):
${results.rewrites.map((r, i) => `\nRewrite #${i+1}:\nOriginal: "${r.original}"\nRewritten: "${r.rewritten}"`).join('\n')}

=========================================
Report generated via AIT AI Resume Workspace.
`;
      const blob = new Blob([reportText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ATS_Resume_Report_${results.score}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    };

    const handlePrintResume = () => {
      window.print();
    };

    const handleAddSkill = (e) => {
      if (e.key === 'Enter' || e.type === 'click') {
        e.preventDefault();
        if (formData.skills.length >= 15) {
          alert("Maximum of 15 skills allowed to fit the resume on one page.");
          return;
        }
        if (formData.newSkill.trim() && !formData.skills.includes(formData.newSkill.trim())) {
          setFormData(prev => ({
            ...prev,
            skills: [...prev.skills, prev.newSkill.trim()],
            newSkill: ''
          }));
        }
      }
    };

    const handleRemoveSkill = (skillToRemove) => {
      setFormData(prev => ({
        ...prev,
        skills: prev.skills.filter(s => s !== skillToRemove)
      }));
    };

    const getScoreColor = (score) => {
      if (score >= 85) return '#16A34A'; // Green
      if (score >= 70) return '#EA580C'; // Orange
      if (score >= 50) return '#D97706'; // Amber/Yellow
      return '#DC2626'; // Red
    };

    const getRatingBgColor = (rating) => {
      const r = rating.toLowerCase();
      if (r.includes('excellent')) return '#DCFCE7';
      if (r.includes('good')) return '#FFEDD5';
      if (r.includes('average')) return '#FEF9C3';
      return '#FEE2E2';
    };

    const getRatingTextColor = (rating) => {
      const r = rating.toLowerCase();
      if (r.includes('excellent')) return '#15803D';
      if (r.includes('good')) return '#C2410C';
      if (r.includes('average')) return '#A16207';
      return '#B91C1C';
    };

    const arcLength = 251.33;
    const strokeDashoffset = arcLength - (animatedScore / 100) * arcLength;

    return (
      <div className="feature-page-container">
        <div className="resume-workspace">
          {/* Header & Mode Switcher */}
          <div className="resume-workspace-header">
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ResumeIcon style={{ color: 'var(--primary-maroon)' }} /> Resume Workspace
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px' }}>
                Build an industry-standard resume and check its ATS score using advanced Gemini AI analysis.
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div className="resume-tabs">
                <button 
                  className={`resume-tab-btn ${subTab === 'checker' ? 'active' : ''}`}
                  onClick={() => setSubTab('checker')}
                >
                  <SparklesIcon style={{ width: '15px', height: '15px' }} /> AI ATS Score Checker
                </button>
                <button 
                  className={`resume-tab-btn ${subTab === 'builder' ? 'active' : ''}`}
                  onClick={() => setSubTab('builder')}
                >
                  <ResumeIcon style={{ width: '15px', height: '15px' }} /> Resume Builder
                </button>
              </div>
            </div>
          </div>

          {/* Main workspace panels */}
          {subTab === 'checker' ? (
            // Checker view
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {!file && !loading && !results && (
                // Dropzone area
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div 
                    className={`resume-upload-zone ${dragActive ? 'dragging' : ''}`}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('resume-file-picker').click()}
                  >
                    <input 
                      type="file" 
                      id="resume-file-picker" 
                      style={{ display: 'none' }} 
                      accept=".pdf,.txt"
                      onChange={handleFileSelect}
                    />
                    <div className="upload-icon-box">
                      <UploadIcon style={{ width: '28px', height: '28px' }} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>
                        Upload your resume for ATS Scoring
                      </h4>
                      <p style={{ fontSize: '13px', color: 'var(--text-light)', marginTop: '4px' }}>
                        Drag and drop your PDF or Text resume here, or click to browse files.
                      </p>
                      <p style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '8px', fontWeight: '600' }}>
                        Maximum File Size: 5MB • Supported Formats: .pdf, .txt
                      </p>
                    </div>
                  </div>

                  {/* Actions Bar for Sample / Paste */}
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center' }}>
                    <button 
                      className="api-settings-btn"
                      onClick={() => setShowPasteArea(!showPasteArea)}
                    >
                      <SparklesIcon style={{ width: '14px', height: '14px' }} /> Paste Resume Text Instead
                    </button>
                    <span style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: '700' }}>OR</span>
                    <button 
                      className="btn-apply"
                      onClick={handleUseSample}
                    >
                      🧪 Run with Sample Profile Resume
                    </button>
                  </div>

                  {showPasteArea && (
                    <div style={{
                      padding: '20px', borderRadius: '16px', border: '1px solid var(--border-light)',
                      backgroundColor: 'var(--bg-card)', display: 'flex', flexDirection: 'column', gap: '12px'
                    }}>
                      <label className="builder-label">Paste Resume Raw Text</label>
                      <textarea
                        className="builder-textarea"
                        style={{ minHeight: '180px' }}
                        placeholder="Paste the text contents of your resume here..."
                        value={pastedText}
                        onChange={(e) => setPastedText(e.target.value)}
                      />
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button 
                          style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--border-medium)', background: 'white', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
                          onClick={() => setShowPasteArea(false)}
                        >
                          Cancel
                        </button>
                        <button 
                          className="btn-apply"
                          onClick={handlePastedTextSubmit}
                          disabled={!pastedText.trim()}
                        >
                          Analyze Pasted Text
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {loading && (
                // Scanning view
                <div className="scanner-container" style={{ border: '1px solid var(--border-light)', borderRadius: '24px', backgroundColor: 'var(--bg-white)' }}>
                  <div className="scanner-doc-box">
                    <div className="scanner-doc-line"></div>
                    <div className="scanner-doc-text">
                      <div className="scanner-doc-text-line" style={{ width: '85%' }}></div>
                      <div className="scanner-doc-text-line" style={{ width: '65%' }}></div>
                      <div className="scanner-doc-text-line" style={{ width: '90%' }}></div>
                      <div className="scanner-doc-text-line" style={{ width: '75%' }}></div>
                      <div className="scanner-doc-text-line" style={{ width: '50%' }}></div>
                    </div>
                  </div>
                  <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--primary-maroon)', marginTop: '8px' }}>
                    Gemini AI Resumebot Scanning...
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', maxWidth: '380px', minHeight: '40px' }}>
                    {scanProgress === 0 && "Extracting document schema & layout nodes..."}
                    {scanProgress === 1 && "Measuring industry-specific keywords density..."}
                    {scanProgress === 2 && "Validating action-oriented impact phrases..."}
                    {scanProgress === 3 && "Correlating scores with recruiting standard metrics..."}
                  </p>
                  
                  <div style={{
                    width: '200px', height: '6px', backgroundColor: 'var(--border-light)', borderRadius: '3px', overflow: 'hidden', marginTop: '4px'
                  }}>
                    <div style={{
                      width: `${(scanProgress + 1) * 25}%`, height: '100%', backgroundColor: 'var(--primary-maroon)', transition: 'width 0.6s ease'
                    }}></div>
                  </div>
                </div>
              )}

              {results && !loading && (
                // Dashboard layout
                <div className="analysis-dashboard">
                  {/* Left Column Gauge Card */}
                  <div className="score-gauge-card">
                    <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-light)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                      File: {file?.name || 'Resume'}
                    </span>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary-maroon)', marginTop: '8px', marginBottom: '24px' }}>
                      8. Resume Analyzer (AI)
                    </h3>
                    
                    <div className="gauge-wrapper">
                      <svg viewBox="0 0 200 110" style={{ width: '100%', height: '100%' }}>
                        <path
                          d="M 20,100 A 80,80 0 0,1 180,100"
                          fill="none"
                          stroke="var(--border-light)"
                          strokeWidth="14"
                          strokeLinecap="round"
                        />
                        <path
                          d="M 20,100 A 80,80 0 0,1 180,100"
                          fill="none"
                          stroke={getScoreColor(results.score)}
                          strokeWidth="14"
                          strokeLinecap="round"
                          strokeDasharray={arcLength}
                          strokeDashoffset={strokeDashoffset}
                          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
                        />
                      </svg>
                      
                      <div className="gauge-score-text">
                        <span className="gauge-score-value">{animatedScore}</span>
                        <span className="gauge-score-max">/100</span>
                      </div>
                    </div>

                    <span className="rating-badge" style={{
                      padding: '6px 14px', borderRadius: '12px',
                      backgroundColor: getRatingBgColor(results.rating),
                      color: getRatingTextColor(results.rating)
                    }}>
                      {results.rating}!
                    </span>

                    <div className="strengths-checklist">
                      {results.strengths.map((str, idx) => (
                        <div key={idx} className="checklist-item">
                          <span className="checklist-check">✓</span>
                          <span>{str}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '10px', marginTop: '24px' }}>
                      <button 
                        className="btn-apply"
                        style={{ width: '100%', padding: '12px 18px', fontSize: '13px' }}
                        onClick={() => {
                          const element = document.getElementById('suggestions-panel-details');
                          if (element) element.scrollIntoView({ behavior: 'smooth' });
                          setDetailsTab('rewriter');
                        }}
                      >
                        Improve My Resume
                      </button>
                      <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                        <button 
                          className="api-settings-btn"
                          style={{ flex: 1, justifyContent: 'center', padding: '10px' }}
                          onClick={handleDownloadReport}
                        >
                          <DownloadIcon style={{ width: '14px', height: '14px' }} /> Download PDF Report
                        </button>
                        <button 
                          className="api-settings-btn"
                          style={{ flex: 1, justifyContent: 'center', padding: '10px', color: '#EF4444' }}
                          onClick={handleReset}
                        >
                          <RefreshIcon style={{ width: '14px', height: '14px' }} /> Clear
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column details tab card */}
                  <div className="analysis-details-card" id="suggestions-panel-details">
                    <div className="details-tab-nav">
                      <button 
                        className={`details-tab-btn ${detailsTab === 'improvements' ? 'active' : ''}`}
                        onClick={() => setDetailsTab('improvements')}
                      >
                        Actionable Improvements
                      </button>
                      <button 
                        className={`details-tab-btn ${detailsTab === 'keywords' ? 'active' : ''}`}
                        onClick={() => setDetailsTab('keywords')}
                      >
                        ATS Keyword Analysis
                      </button>
                      <button 
                        className={`details-tab-btn ${detailsTab === 'rewriter' ? 'active' : ''}`}
                        onClick={() => setDetailsTab('rewriter')}
                      >
                        AI Bullet Rewriter (STAR)
                      </button>
                    </div>

                    {detailsTab === 'improvements' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                          <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--primary-maroon)' }}>Target Role Alignment</h4>
                          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginTop: '4px', fontWeight: '600' }}>
                            🎯 {results.alignment}
                          </p>
                        </div>
                        
                        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                          <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--primary-maroon)', marginBottom: '12px' }}>
                            Critical Improvements Checklist
                          </h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {results.improvements.map((imp, idx) => (
                              <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '13px', lineHeight: '1.4' }}>
                                <span style={{
                                  width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'var(--pink-bg)',
                                  color: 'var(--pink-text)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                  fontSize: '11px', fontWeight: '800', flexShrink: 0, marginTop: '2px'
                                }}>!</span>
                                <span style={{ color: 'var(--text-main)' }}>{imp}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {detailsTab === 'keywords' && (
                      <div className="keyword-grid">
                        <div className="keyword-col">
                          <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '16px' }}>✓</span> Found Keywords ({results.keywordAnalysis.found.length})
                          </h4>
                          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                            These technical match points were successfully detected in your resume structure.
                          </p>
                          <div className="keyword-badges-list">
                            {results.keywordAnalysis.found.map((kw, i) => (
                              <span key={i} className="keyword-badge found">{kw}</span>
                            ))}
                          </div>
                        </div>

                        <div className="keyword-col" style={{ borderLeft: '1px solid var(--border-light)', paddingLeft: '20px' }}>
                          <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#DC2626', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '16px' }}>⚠</span> Recommended Missing Keywords ({results.keywordAnalysis.missing.length})
                          </h4>
                          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                            Adding these technical terms will help you bypass automatic filters for engineering roles.
                          </p>
                          <div className="keyword-badges-list">
                            {results.keywordAnalysis.missing.map((kw, i) => (
                              <span key={i} className="keyword-badge missing">{kw}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {detailsTab === 'rewriter' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ padding: '12px 16px', borderRadius: '12px', backgroundColor: 'var(--primary-maroon-light)', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                          <InfoIcon style={{ color: 'var(--primary-maroon)', flexShrink: 0, marginTop: '2px' }} />
                          <p style={{ fontSize: '12.5px', color: 'var(--text-main)', lineHeight: '1.4' }}>
                            <strong>AI Rewriter Concept:</strong> Transforming passive statements into active results. The rewritten bullet points use action verbs and quantitative metrics (STAR method) to maximize recruiter engagement.
                          </p>
                        </div>
                        
                        <div className="rewriter-list">
                          {results.rewrites.map((item, idx) => (
                            <div key={idx} className="rewriter-item">
                              <div className="rewrite-original">
                                <strong>Original:</strong> "{item.original}"
                              </div>
                              <div className="rewrite-new">
                                <strong>Optimized STAR:</strong> "{item.rewritten}"
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Builder view
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>
                {/* Form fields */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'white', padding: '24px', borderRadius: '20px', border: '1px solid var(--border-light)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary-maroon)', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px', marginBottom: '8px' }}>
                    Resume Fields
                  </h3>
                  
                  <div className="builder-form-grid">
                    <div className="builder-form-group">
                      <label className="builder-label">Full Name ({formData.name.length}/50)</label>
                      <input 
                        type="text" 
                        className="builder-input" 
                        maxLength={50}
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="builder-form-group">
                      <label className="builder-label">Target Role ({formData.role.length}/50)</label>
                      <input 
                        type="text" 
                        className="builder-input" 
                        maxLength={50}
                        value={formData.role}
                        onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                      />
                    </div>
                    <div className="builder-form-group">
                      <label className="builder-label">Email Address ({formData.email.length}/60)</label>
                      <input 
                        type="email" 
                        className="builder-input" 
                        maxLength={60}
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div className="builder-form-group">
                      <label className="builder-label">Phone Number ({formData.phone.length}/20)</label>
                      <input 
                        type="text" 
                        className="builder-input" 
                        maxLength={20}
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div className="builder-form-group">
                      <label className="builder-label">LinkedIn URL ({formData.linkedin.length}/100)</label>
                      <input 
                        type="text" 
                        className="builder-input" 
                        maxLength={100}
                        value={formData.linkedin}
                        onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                      />
                    </div>
                    <div className="builder-form-group">
                      <label className="builder-label">GitHub URL ({formData.github.length}/100)</label>
                      <input 
                        type="text" 
                        className="builder-input" 
                        maxLength={100}
                        value={formData.github}
                        onChange={(e) => setFormData(prev => ({ ...prev, github: e.target.value }))}
                      />
                    </div>
                    
                    <div className="builder-form-group full-width">
                      <label className="builder-label">Education Details ({formData.education.length}/150)</label>
                      <input 
                        type="text" 
                        className="builder-input" 
                        maxLength={150}
                        value={formData.education}
                        onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
                      />
                    </div>

                    <div className="builder-form-group full-width">
                      <label className="builder-label">Work Experience ({formData.experience.length}/500)</label>
                      <textarea 
                        className="builder-textarea" 
                        maxLength={500}
                        value={formData.experience}
                        onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                      />
                    </div>

                    <div className="builder-form-group full-width">
                      <label className="builder-label">Projects ({formData.projects.length}/500)</label>
                      <textarea 
                        className="builder-textarea" 
                        maxLength={500}
                        value={formData.projects}
                        onChange={(e) => setFormData(prev => ({ ...prev, projects: e.target.value }))}
                      />
                    </div>

                    <div className="builder-form-group full-width">
                      <label className="builder-label">Skills Checklist ({formData.skills.length}/15 skills)</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input 
                          type="text" 
                          className="builder-input" 
                          placeholder="e.g. TypeScript"
                          maxLength={30}
                          value={formData.newSkill}
                          onChange={(e) => setFormData(prev => ({ ...prev, newSkill: e.target.value }))}
                          onKeyDown={handleAddSkill}
                        />
                        <button 
                          className="btn-apply" 
                          style={{ height: '38px', padding: '0 16px' }}
                          onClick={handleAddSkill}
                        >
                          Add
                        </button>
                      </div>
                      <div className="builder-skills-list">
                        {formData.skills.map((skill, index) => (
                          <span key={index} className="builder-skill-tag">
                            {skill}
                            <button 
                              className="builder-skill-remove"
                              onClick={() => handleRemoveSkill(skill)}
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Print layout preview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: '800' }}>Live Resume Preview</h4>
                    <button 
                      className="btn-apply"
                      onClick={handlePrintResume}
                    >
                      🖨 Save PDF / Print
                    </button>
                  </div>
                  
                  {/* Resume sheet */}
                  <div className="resume-preview-card">
                    <div className="preview-header">
                      <div className="preview-name">{formData.name || 'Your Name'}</div>
                      <div className="preview-title">{formData.role || 'Target Professional Role'}</div>
                      <div className="preview-contact">
                        {formData.email && <span>📧 {formData.email}</span>}
                        {formData.phone && <span>📞 {formData.phone}</span>}
                        {formData.linkedin && <span>🔗 LinkedIn</span>}
                        {formData.github && <span>💻 GitHub</span>}
                      </div>
                    </div>

                    <div>
                      <div className="preview-section-title">Education</div>
                      <p style={{ fontSize: '12.5px', lineHeight: '1.4' }}>{formData.education}</p>
                    </div>

                    {formData.experience && (
                      <div>
                        <div className="preview-section-title">Work Experience</div>
                        <div style={{ fontSize: '12.5px', whiteSpace: 'pre-line', lineHeight: '1.5' }}>
                          {formData.experience}
                        </div>
                      </div>
                    )}

                    {formData.projects && (
                      <div>
                        <div className="preview-section-title">Key Projects</div>
                        <div style={{ fontSize: '12.5px', whiteSpace: 'pre-line', lineHeight: '1.5' }}>
                          {formData.projects}
                        </div>
                      </div>
                    )}

                    {formData.skills.length > 0 && (
                      <div>
                        <div className="preview-section-title">Technical Skills</div>
                        <p style={{ fontSize: '12.5px', fontWeight: '600', lineHeight: '1.4' }}>
                          {formData.skills.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Fallback view for other left menu tabs
  return (
    <div className="feature-page-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div style={{
        width: '64px', height: '64px', borderRadius: '20px', backgroundColor: 'var(--primary-maroon-light)',
        color: 'var(--primary-maroon)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px'
      }}>
        <AssessmentsIcon style={{ width: '32px', height: '32px' }} />
      </div>
      <h2 style={{ fontSize: '22px', fontWeight: '800', textTransform: 'capitalize' }}>
        {activeTab.replace('-', ' ')}
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '400px', marginTop: '8px' }}>
        Welcome to the {activeTab.replace('-', ' ')} module. Explore placement resources, tests, and active updates tailored for Jayasurya K.
      </p>
      <button
        className="btn-apply"
        style={{ marginTop: '24px' }}
        onClick={() => setActiveTab('dashboard')}
      >
        Back to Dashboard
      </button>
    </div>
  );
}
