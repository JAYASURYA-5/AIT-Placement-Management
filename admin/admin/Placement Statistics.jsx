import React, { useState } from 'react';
import {
  Crown,
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  FileText,
  Sliders,
  Settings,
  ChevronDown
} from 'lucide-react';

export default function PlacementStatistics({ onNavigate }) {
  const [activeNav, setActiveNav] = useState('Reports');
  const [selectedYear, setSelectedYear] = useState('2024 – 2025');
  const [hoveredBar, setHoveredBar] = useState(null);
  const [hoveredSlice, setHoveredSlice] = useState(null);

  // Sidebar navigation items
  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Student', icon: Users },
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

  // Year datasets with IT first and AI&DS added
  const yearData = {
    '2024 – 2025': {
      stats: [
        { value: '95%', label: 'Placement Rate' },
        { value: '850+', label: 'Students Placed' },
        { value: '120+', label: 'Companies Visited' },
        { value: '18 LPA', label: 'Highest Package' }
      ],
      departments: [
        { name: 'IT', percentage: 94 },
        { name: 'CSE', percentage: 91 },
        { name: 'AI&DS', percentage: 88 },
        { name: 'ECE', percentage: 72 },
        { name: 'MECH', percentage: 57 },
        { name: 'EEE', percentage: 45 },
        { name: 'CIVIL', percentage: 35 }
      ],
      packages: [
        { label: '<10 LPA', percentage: 27, color: '#3b82f6' },
        { label: '5-10 LPA', percentage: 26, color: '#8b5cf6' },
        { label: '2-5 LPA', percentage: 20, color: '#10b981' },
        { label: '<2 LPA', percentage: 20, color: '#f97316' },
        { label: '>10 LPA', percentage: 7, color: '#ef4444' }
      ]
    },
    '2023 – 2024': {
      stats: [
        { value: '91%', label: 'Placement Rate' },
        { value: '780+', label: 'Students Placed' },
        { value: '105+', label: 'Companies Visited' },
        { value: '16 LPA', label: 'Highest Package' }
      ],
      departments: [
        { name: 'IT', percentage: 90 },
        { name: 'CSE', percentage: 88 },
        { name: 'AI&DS', percentage: 84 },
        { name: 'ECE', percentage: 68 },
        { name: 'MECH', percentage: 52 },
        { name: 'EEE', percentage: 40 },
        { name: 'CIVIL', percentage: 30 }
      ],
      packages: [
        { label: '<10 LPA', percentage: 25, color: '#3b82f6' },
        { label: '5-10 LPA', percentage: 28, color: '#8b5cf6' },
        { label: '2-5 LPA', percentage: 22, color: '#10b981' },
        { label: '<2 LPA', percentage: 18, color: '#f97316' },
        { label: '>10 LPA', percentage: 7, color: '#ef4444' }
      ]
    }
  };

  const currentDataset = yearData[selectedYear] || yearData['2024 – 2025'];

  // SVG Donut Chart Helpers (Enlarged size)
  let cumulativeAngle = 0;
  const radius = 94;
  const innerRadius = 60;
  const cx = 115;
  const cy = 115;

  const getSlicePath = (startAngle, endAngle) => {
    const rad = (angle) => ((angle - 90) * Math.PI) / 180;
    const x1 = cx + radius * Math.cos(rad(startAngle));
    const y1 = cy + radius * Math.sin(rad(startAngle));
    const x2 = cx + radius * Math.cos(rad(endAngle));
    const y2 = cy + radius * Math.sin(rad(endAngle));

    const ix1 = cx + innerRadius * Math.cos(rad(endAngle));
    const iy1 = cy + innerRadius * Math.sin(rad(endAngle));
    const ix2 = cx + innerRadius * Math.cos(rad(startAngle));
    const iy2 = cy + innerRadius * Math.sin(rad(startAngle));

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix2} ${iy2} Z`;
  };

  const activePackage = currentDataset.packages.find(p => p.label === hoveredSlice);

  // Common Glassmorphism Card Style
  const glassCardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.8)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.04), 0 2px 10px 0 rgba(0, 0, 0, 0.02)',
    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh', backgroundColor: '#f6f4ee', fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* Keyframes for Staggered Bar Grow & Donut Animations */}
      <style>{`
        @keyframes dashboardFadeIn {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes barGrowStagger {
          from { transform: scaleY(0); opacity: 0; }
          to { transform: scaleY(1); opacity: 1; }
        }
        @keyframes spinDonutIn {
          0% { transform: rotate(-90deg) scale(0.75); opacity: 0; }
          100% { transform: rotate(0deg) scale(1); opacity: 1; }
        }
        
        .stat-card-glass {
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .stat-card-glass:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 28px -6px rgba(0,0,0,0.08) !important;
        }

        .bar-animated {
          transform-origin: bottom;
          opacity: 0;
          animation: barGrowStagger 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .donut-chart-container {
          animation: spinDonutIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-origin: 115px 115px;
        }
      `}</style>

      {/* Top Header Label & Year Select Dropdown */}
      <div style={{
        padding: '24px 36px 12px 36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
          Placement Statistics
        </div>

        {/* Year Dropdown Select */}
        <div style={{ position: 'relative' }}>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            style={{
              appearance: 'none',
              padding: '11px 40px 11px 22px',
              borderRadius: '999px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              fontSize: '16px',
              fontWeight: 700,
              color: '#1e293b',
              cursor: 'pointer',
              outline: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            <option value="2024 – 2025">2024 – 2025</option>
            <option value="2023 – 2024">2023 – 2024</option>
          </select>
          <ChevronDown size={20} color="#64748b" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, minHeight: 0, paddingBottom: '24px' }}>
        
        {/* Left Sidebar - All 4 Corners Rounded */}
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
          
          {/* Top Row: 4 Metric Cards with 54px Vertical Spacing */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', marginBottom: '54px' }}>
            {currentDataset.stats.map((card, idx) => (
              <div
                key={idx}
                className="stat-card-glass"
                style={{
                  ...glassCardStyle,
                  padding: '30px 24px',
                  textAlign: 'left',
                  cursor: 'default'
                }}
              >
                <div style={{ fontSize: '42px', fontWeight: 800, color: '#000000', letterSpacing: '-0.03em', marginBottom: '6px' }}>
                  {card.value}
                </div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#6b7280' }}>
                  {card.label}
                </div>
              </div>
            ))}
          </div>

          {/* Middle Row: Offers by Department (Bar Chart with IT First & AI&DS) & Package Distribution */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: '32px' }}>
            
            {/* Left Card: Offers by Department Bar Chart */}
            <div style={{
              ...glassCardStyle,
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '26px' }}>
                Offers by Department
              </div>

              {/* Bar Chart Container */}
              <div style={{ display: 'flex', height: '300px', alignItems: 'flex-end', position: 'relative' }}>
                
                {/* Y-Axis Labels */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '240px',
                  paddingRight: '18px',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#64748b',
                  marginBottom: '32px'
                }}>
                  <span>100</span>
                  <span>75</span>
                  <span>50</span>
                  <span>25</span>
                  <span>0</span>
                </div>

                {/* Y Axis Unit Label */}
                <div style={{
                  position: 'absolute',
                  left: '-2px',
                  top: '125px',
                  fontSize: '13px',
                  fontWeight: 800,
                  color: '#94a3b8',
                  transform: 'rotate(-90deg)',
                  transformOrigin: 'left bottom'
                }}>
                  %
                </div>

                {/* Grid Lines & Bars Area */}
                <div style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', position: 'relative' }}>
                  
                  {/* Grid Horizontal Lines */}
                  {[0, 25, 50, 75, 100].map((val) => (
                    <div
                      key={val}
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: `${(val / 100) * 240 + 32}px`,
                        borderBottom: '1px stroke #f1f5f9',
                        borderStyle: 'dashed',
                        borderColor: '#e2e8f0'
                      }}
                    />
                  ))}

                  {/* Bars & X Labels Container */}
                  <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '240px', zIndex: 2 }}>
                    {currentDataset.departments.map((dept, idx) => {
                      const isHovered = hoveredBar === dept.name;
                      const barHeight = (dept.percentage / 100) * 240;

                      return (
                        <div
                          key={dept.name}
                          onMouseEnter={() => setHoveredBar(dept.name)}
                          onMouseLeave={() => setHoveredBar(null)}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '48px',
                            height: '100%',
                            justifyContent: 'flex-end',
                            cursor: 'pointer',
                            position: 'relative'
                          }}
                        >
                          {/* Animated Tooltip on Hover */}
                          {isHovered && (
                            <div style={{
                              position: 'absolute',
                              top: `${240 - barHeight - 38}px`,
                              backgroundColor: '#0f172a',
                              color: '#ffffff',
                              padding: '5px 12px',
                              borderRadius: '8px',
                              fontSize: '13px',
                              fontWeight: 700,
                              whiteSpace: 'nowrap',
                              boxShadow: '0 6px 16px rgba(0,0,0,0.18)',
                              zIndex: 10,
                              animation: 'dashboardFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                            }}>
                              {dept.name}: {dept.percentage}%
                            </div>
                          )}

                          {/* Bar Element with Staggered Growth Animation */}
                          <div
                            className="bar-animated"
                            style={{
                              width: '100%',
                              height: `${barHeight}px`,
                              backgroundColor: dept.name === 'IT' ? '#7c3aed' : '#8b5cf6', // Slightly deeper purple for IT
                              borderRadius: '10px 10px 0 0',
                              transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, background-color 0.25s ease',
                              animationDelay: `${idx * 0.08}s`,
                              transform: isHovered ? 'scaleY(1.04) translateY(-2px)' : 'scaleY(1)',
                              boxShadow: isHovered ? '0 12px 26px rgba(139, 92, 246, 0.45)' : 'none'
                            }}
                          />

                          {/* X-Axis Label */}
                          <div style={{
                            marginTop: '12px',
                            fontSize: '14px',
                            fontWeight: isHovered ? 800 : 700,
                            color: isHovered ? '#0f172a' : '#475569',
                            transition: 'all 0.15s ease'
                          }}>
                            {dept.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>

              </div>
            </div>

            {/* Right Card: Package Distribution Donut Chart with Animations */}
            <div style={{
              ...glassCardStyle,
              padding: '32px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '24px' }}>
                Package Distribution
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
                
                {/* SVG Donut Chart */}
                <div style={{ width: '250px', height: '250px', position: 'relative', flexShrink: 0 }}>
                  <svg viewBox="0 0 230 230" style={{ width: '100%', height: '100%' }}>
                    <g className="donut-chart-container">
                      {currentDataset.packages.map((pkg) => {
                        const startAngle = cumulativeAngle;
                        const sliceAngle = (pkg.percentage / 100) * 360;
                        const endAngle = startAngle + sliceAngle;
                        cumulativeAngle = endAngle;

                        const pathD = getSlicePath(startAngle, endAngle - 0.6);
                        const isHovered = hoveredSlice === pkg.label;

                        const midAngle = startAngle + sliceAngle / 2;
                        const rad = ((midAngle - 90) * Math.PI) / 180;
                        const offsetX = isHovered ? Math.cos(rad) * 7 : 0;
                        const offsetY = isHovered ? Math.sin(rad) * 7 : 0;

                        return (
                          <path
                            key={pkg.label}
                            d={pathD}
                            fill={pkg.color}
                            style={{
                              cursor: 'pointer',
                              transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease, filter 0.25s ease',
                              opacity: hoveredSlice && !isHovered ? 0.45 : 1,
                              transform: `translate(${offsetX}px, ${offsetY}px)`,
                              filter: isHovered ? 'drop-shadow(0 10px 20px rgba(0,0,0,0.25))' : 'none'
                            }}
                            onMouseEnter={() => setHoveredSlice(pkg.label)}
                            onMouseLeave={() => setHoveredSlice(null)}
                          >
                            <title>{pkg.label}: {pkg.percentage}%</title>
                          </path>
                        );
                      })}
                    </g>

                    {/* Donut Center Hole Dynamic Text */}
                    <text x={cx} y={cy - 6} textAnchor="middle" fontSize="16" fontWeight="800" fill="#0f172a">
                      {activePackage ? activePackage.label : 'Package'}
                    </text>
                    <text x={cx} y={cy + 18} textAnchor="middle" fontSize="17" fontWeight="800" fill={activePackage ? activePackage.color : '#8b5cf6'}>
                      {activePackage ? `${activePackage.percentage}%` : '100%'}
                    </text>
                  </svg>
                </div>

                {/* Legend on Right Side */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, paddingLeft: '24px' }}>
                  {currentDataset.packages.map((pkg) => (
                    <div
                      key={pkg.label}
                      onMouseEnter={() => setHoveredSlice(pkg.label)}
                      onMouseLeave={() => setHoveredSlice(null)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '16px',
                        cursor: 'pointer',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        backgroundColor: hoveredSlice === pkg.label ? 'rgba(255,255,255,0.95)' : 'transparent',
                        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                        transform: hoveredSlice === pkg.label ? 'translateX(6px)' : 'translateX(0)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                          width: '13px',
                          height: '13px',
                          borderRadius: '50%',
                          backgroundColor: pkg.color,
                          display: 'inline-block',
                          boxShadow: hoveredSlice === pkg.label ? `0 0 10px ${pkg.color}` : 'none'
                        }} />
                        <span style={{ fontWeight: 700, color: '#111827' }}>{pkg.label}</span>
                      </div>
                      <span style={{ fontWeight: 800, color: '#334155' }}>- {pkg.percentage}%</span>
                    </div>
                  ))}
                </div>

              </div>
            </div>

          </div>

        </main>
      </div>

    </div>
  );
}
