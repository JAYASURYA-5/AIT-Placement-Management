import React, { useState, useRef, useEffect } from 'react';
import { fetchDrivesFromFirestore } from '../../src/firebase';
import UsersPage from './users.jsx';
import PlacementStatistics from './Placement Statistics.jsx';
import SettingsPage from './settings.jsx';
import DriveManagement from './drive.jsx';
import CompanyManagement from './company.jsx';
import {
  Crown,
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  FileText,
  Sliders,
  Settings,
  Bookmark,
  Calendar,
  Database
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [hoveredSlice, setHoveredSlice] = useState(null);

  const chartSvgRef = useRef(null);


  // Sidebar navigation items matching reference image
  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Student', icon: Users },
    { label: 'Companies', icon: Building2 },
    { label: 'Drives', icon: Briefcase },
    { label: 'Reports', icon: FileText },
    { label: 'Settings', icon: Settings },
  ];

  const [drivesCount, setDrivesCount] = useState(75);

  // Recent Activities list state
  const [activities, setActivities] = useState([
    {
      id: 'default-1',
      text: 'New company Zoho added',
      date: '20 Jul 2025',
      icon: Bookmark,
      iconBg: '#fce7f3',
      iconColor: '#be185d'
    },
    {
      id: 'default-2',
      text: 'TCS drive scheduled',
      date: '19 Jul 2025',
      icon: Calendar,
      iconBg: '#dbeafe',
      iconColor: '#2563eb'
    },
    {
      id: 'default-3',
      text: 'System backup completed',
      date: '10 Jul 2025',
      icon: Database,
      iconBg: '#dcfce7',
      iconColor: '#16a34a'
    }
  ]);

  // Load live placement drives from Cloud Firestore for Recent Activities
  useEffect(() => {
    async function loadLiveDrives() {
      const fsDrives = await fetchDrivesFromFirestore();
      if (fsDrives && fsDrives.length > 0) {
        setDrivesCount(fsDrives.length);
        const driveActivities = fsDrives.map(drive => ({
          id: drive.id,
          text: `${drive.company} drive scheduled (${drive.role || 'Campus Drive'})`,
          date: drive.date || (drive.createdAt ? new Date(drive.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recently'),
          icon: Calendar,
          iconBg: '#dbeafe',
          iconColor: '#2563eb'
        }));

        setActivities([
          ...driveActivities,
          {
            id: 'default-1',
            text: 'New company Zoho added',
            date: '20 Jul 2025',
            icon: Bookmark,
            iconBg: '#fce7f3',
            iconColor: '#be185d'
          },
          {
            id: 'default-3',
            text: 'System backup completed',
            date: '10 Jul 2025',
            icon: Database,
            iconBg: '#dcfce7',
            iconColor: '#16a34a'
          }
        ]);
      }
    }
    loadLiveDrives();
  }, []);

  // Chart & Metric Data Definitions
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

  const chartSeries = [
    {
      name: 'Students',
      color: '#8b5cf6',
      gradId: 'gradStudents',
      data: [350, 420, 500, 610, 720, 850, 920, 1000, 1050]
    },
    {
      name: 'Companies',
      color: '#10b981',
      gradId: 'gradCompanies',
      data: [15, 28, 42, 55, 70, 88, 98, 110, 120]
    }
  ];

  const departments = [
    { name: 'CSE', percentage: 42, color: '#be185d' },
    { name: 'ECE', percentage: 28, color: '#3b82f6' },
    { name: 'EEE', percentage: 18, color: '#10b981' },
    { name: 'Mech', percentage: 12, color: '#f59e0b' }
  ];

  // Stats data
  const statCards = [
    { title: 'Students Registered', value: '1,248' },
    { title: 'Companies Visited', value: '120' },
    { title: 'Placement Drives', value: String(drivesCount) },
    { title: 'Students Placed', value: '1,050' },
  ];

  // SVG Line Chart Helpers
  const width = 600;
  const height = 230;
  const paddingX = 42;
  const paddingY = 28;
  const maxY = 1000;

  const getX = (index) => paddingX + (index * (width - 2 * paddingX)) / (months.length - 1);
  const getY = (val) => height - paddingY - (val / maxY) * (height - 2 * paddingY);

  // Smooth curve path for line chart
  const getCurvePath = (data) => {
    const points = data.map((val, idx) => ({ x: getX(idx), y: getY(val) }));
    if (points.length === 0) return '';
    let d = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cp1x = p0.x + (p1.x - p0.x) * 0.4;
      const cp1y = p0.y;
      const cp2x = p0.x + (p1.x - p0.x) * 0.6;
      const cp2y = p1.y;
      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p1.x},${p1.y}`;
    }
    return d;
  };

  // Closed filled area under curve
  const getAreaPath = (data) => {
    const points = data.map((val, idx) => ({ x: getX(idx), y: getY(val) }));
    if (points.length === 0) return '';
    const linePath = getCurvePath(data);
    const lastX = points[points.length - 1].x;
    const firstX = points[0].x;
    const bottomY = height - paddingY;
    return `${linePath} L ${lastX},${bottomY} L ${firstX},${bottomY} Z`;
  };

  // Continuous Cursor Tracking for Chart Line Movement
  const handleChartMouseMove = (e) => {
    if (!chartSvgRef.current) return;
    const rect = chartSvgRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * width;
    const mouseY = ((e.clientY - rect.top) / rect.height) * height;

    // Find nearest month index (0 to 8)
    let closestIndex = 0;
    let minDistance = Infinity;
    months.forEach((_, idx) => {
      const monthX = getX(idx);
      const dist = Math.abs(mouseX - monthX);
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = idx;
      }
    });

    // Find nearest series to cursor Y position
    let closestSeries = chartSeries[0];
    let minSeriesDist = Infinity;
    chartSeries.forEach((series) => {
      const seriesY = getY(series.data[closestIndex]);
      const dist = Math.abs(mouseY - seriesY);
      if (dist < minSeriesDist) {
        minSeriesDist = dist;
        closestSeries = series;
      }
    });

    setHoveredPoint({
      series: closestSeries.name,
      index: closestIndex,
      val: closestSeries.data[closestIndex],
      month: months[closestIndex]
    });
  };

  // Helper to render Donut slices
  let cumulativeAngle = 0;
  const radius = 82;
  const innerRadius = 52;
  const cx = 105;
  const cy = 105;

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

  const activeDepartment = departments.find(d => d.name === hoveredSlice);

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

  // Render active subpages unconditionally after all hook declarations
  if (activeNav === 'Student' || activeNav === 'Students' || activeNav === 'Users') {
    return <UsersPage onNavigate={setActiveNav} />;
  }
  if (activeNav === 'Reports') {
    return <PlacementStatistics onNavigate={setActiveNav} />;
  }
  if (activeNav === 'Settings') {
    return <SettingsPage onNavigate={setActiveNav} />;
  }
  if (activeNav === 'Drives') {
    return <DriveManagement onNavigate={setActiveNav} />;
  }
  if (activeNav === 'Companies') {
    return <CompanyManagement onNavigate={setActiveNav} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh', backgroundColor: '#f6f4ee', fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* Dynamic Keyframes & Glassmorphism Styling */}
      <style>{`
        @keyframes dashboardFadeIn {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes drawLineSeries {
          0% { stroke-dashoffset: 1400; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes areaFadeIn {
          0% { opacity: 0; }
          100% { opacity: 0.14; }
        }
        @keyframes spinDonutIn {
          0% { transform: rotate(-70deg) scale(0.82); opacity: 0; }
          100% { transform: rotate(0deg) scale(1); opacity: 1; }
        }
        
        .stat-card-glass {
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease;
        }
        .stat-card-glass:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 36px -6px rgba(0,0,0,0.08), 0 0 20px rgba(255, 255, 255, 0.9) !important;
          border-color: rgba(255, 255, 255, 0.95) !important;
        }
        
        .activity-item-hover {
          transition: transform 0.2s ease, background-color 0.2s ease, padding 0.2s ease;
          border-radius: 12px;
          padding: 10px 14px;
        }
        .activity-item-hover:hover {
          background-color: rgba(255, 255, 255, 0.85);
          transform: translateX(4px);
        }

        .line-1-anim {
          stroke-dasharray: 1400;
          stroke-dashoffset: 1400;
          animation: drawLineSeries 1.3s cubic-bezier(0.2, 0.9, 0.3, 1) 0.1s forwards;
        }
        .line-2-anim {
          stroke-dasharray: 1400;
          stroke-dashoffset: 1400;
          animation: drawLineSeries 1.3s cubic-bezier(0.2, 0.9, 0.3, 1) 0.3s forwards;
        }
        .line-3-anim {
          stroke-dasharray: 1400;
          stroke-dashoffset: 1400;
          animation: drawLineSeries 1.3s cubic-bezier(0.2, 0.9, 0.3, 1) 0.5s forwards;
        }

        .area-fill-anim {
          opacity: 0;
          animation: areaFadeIn 1s ease-out 0.6s forwards;
        }

        .donut-chart-container {
          animation: spinDonutIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-origin: 105px 105px;
        }

        .active-guide-line {
          transition: x1 0.1s ease-out, x2 0.1s ease-out;
        }
      `}</style>

      {/* Top Header Label */}
      <div style={{
        padding: '22px 36px 10px 36px',
        fontSize: '24px',
        fontWeight: 800,
        color: '#0f172a',
        letterSpacing: '-0.02em'
      }}>
        Admin Dashboard
      </div>

      <div style={{ display: 'flex', flex: 1, minHeight: 0, paddingBottom: '24px' }}>
        
        {/* Left Sidebar - 4 Corners Rounded matching Image 2 */}
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
                  onClick={() => setActiveNav(item.label)}
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

        {/* Main Content Dashboard Area */}
        <main style={{ flex: 1, padding: '12px 36px 24px 30px', overflowY: 'auto' }}>
          
          {/* Top Row: 4 Glassmorphism Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', marginBottom: '54px' }}>
            {statCards.map((card, idx) => (
              <div
                key={idx}
                className="stat-card-glass"
                style={{
                  ...glassCardStyle,
                  padding: '28px 22px',
                  textAlign: 'center',
                  cursor: 'default'
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

          {/* Middle Row: Glassmorphism System Overview & Top Departments */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.55fr 1fr', gap: '32px', marginBottom: '54px' }}>
            
            {/* System Overview Glass Card */}
            <div style={{
              ...glassCardStyle,
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '18px' }}>
                System Overview
              </div>

              {/* Line Chart Wrapper with Continuous Cursor Tracking */}
              <div style={{ width: '100%', position: 'relative' }}>
                <svg
                  ref={chartSvgRef}
                  onMouseMove={handleChartMouseMove}
                  onMouseLeave={() => setHoveredPoint(null)}
                  viewBox={`0 0 ${width} ${height}`}
                  style={{ width: '100%', height: 'auto', overflow: 'visible', cursor: 'default' }}
                >
                  
                  {/* SVG Gradients for Soft Fills */}
                  <defs>
                    <linearGradient id="gradUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="gradStudents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="gradCompanies" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Grid Y Lines & Axis Labels */}
                  {[1000, 500, 0].map((val) => {
                    const y = getY(val);
                    return (
                      <g key={val}>
                        <line
                          x1={paddingX}
                          y1={y}
                          x2={width - paddingX}
                          y2={y}
                          stroke="#e2e8f0"
                          strokeWidth="1"
                          strokeDasharray={val === 0 ? 'none' : '3,3'}
                        />
                        <text
                          x={paddingX - 12}
                          y={y + 4}
                          textAnchor="end"
                          fontSize="13"
                          fill="#4b5563"
                          fontWeight="600"
                        >
                          {val}
                        </text>
                      </g>
                    );
                  })}

                  {/* Soft Gradient Area Fills */}
                  {chartSeries.map((series) => (
                    <path key={`fill-${series.name}`} className="area-fill-anim" d={getAreaPath(series.data)} fill={`url(#${series.gradId})`} />
                  ))}

                  {/* Moving Dashed Guide Line Following Cursor */}
                  {hoveredPoint && (
                    <line
                      className="active-guide-line"
                      x1={getX(hoveredPoint.index)}
                      y1={paddingY}
                      x2={getX(hoveredPoint.index)}
                      y2={height - paddingY}
                      stroke="#94a3b8"
                      strokeWidth="2"
                      strokeDasharray="4,4"
                    />
                  )}

                  {/* Animated Line Curves */}
                  {chartSeries.map((series, sIdx) => {
                    const animClass = sIdx === 0 ? 'line-1-anim' : sIdx === 1 ? 'line-2-anim' : 'line-3-anim';
                    return (
                      <path
                        key={series.name}
                        className={animClass}
                        d={getCurvePath(series.data)}
                        fill="none"
                        stroke={series.color}
                        strokeWidth="3.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    );
                  })}

                  {/* Interactive Glowing Dot Markers Following Cursor Position */}
                  {chartSeries.map((series) =>
                    series.data.map((val, idx) => {
                      const cxPt = getX(idx);
                      const cyPt = getY(val);
                      const isHovered = hoveredPoint?.index === idx;
                      const isTargetSeries = hoveredPoint?.series === series.name && isHovered;

                      return (
                        <g key={`${series.name}-${idx}`}>
                          {isTargetSeries && (
                            <circle
                              cx={cxPt}
                              cy={cyPt}
                              r="13"
                              fill={series.color}
                              opacity="0.3"
                              style={{ transition: 'all 0.15s ease-out' }}
                            />
                          )}
                          <circle
                            cx={cxPt}
                            cy={cyPt}
                            r={isTargetSeries ? 8 : isHovered ? 5.5 : 4}
                            fill={series.color}
                            stroke="#ffffff"
                            strokeWidth={isTargetSeries ? 2.5 : 1.8}
                            style={{
                              cursor: 'pointer',
                              transition: 'transform 0.15s ease-out, r 0.15s ease-out',
                              transformOrigin: `${cxPt}px ${cyPt}px`
                            }}
                          />
                        </g>
                      );
                    })
                  )}

                  {/* X Axis Month Labels */}
                  {months.map((m, idx) => {
                    const isHoveredMonth = hoveredPoint?.index === idx;
                    return (
                      <text
                        key={m}
                        x={getX(idx)}
                        y={height - 2}
                        textAnchor="middle"
                        fontSize={isHoveredMonth ? "14" : "13"}
                        fill={isHoveredMonth ? "#0f172a" : "#4b5563"}
                        fontWeight={isHoveredMonth ? "800" : "600"}
                        style={{ transition: 'all 0.15s ease' }}
                      >
                        {m}
                      </text>
                    );
                  })}
                </svg>

                {/* Animated Floating Glass Tooltip Following Cursor */}
                {hoveredPoint && (
                  <div style={{
                    position: 'absolute',
                    top: '6px',
                    right: '20px',
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    backdropFilter: 'blur(8px)',
                    color: '#ffffff',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 700,
                    boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
                    pointerEvents: 'none',
                    animation: 'dashboardFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: chartSeries.find(s => s.name === hoveredPoint.series)?.color }} />
                    <span>{hoveredPoint.series} ({hoveredPoint.month}): <strong style={{ fontSize: '16px', color: '#60a5fa' }}>{hoveredPoint.val}</strong></span>
                  </div>
                )}
              </div>

              {/* Chart Legend */}
              <div style={{ display: 'flex', gap: '26px', marginTop: '20px', paddingLeft: `${paddingX}px` }}>
                {chartSeries.map((series) => (
                  <div key={series.name} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ width: '20px', height: '4px', backgroundColor: series.color, borderRadius: '3px', display: 'inline-block' }} />
                    <span style={{ fontSize: '15px', fontWeight: 600, color: series.color }}>
                      {series.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Departments Glass Card */}
            <div style={{
              ...glassCardStyle,
              padding: '28px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '22px' }}>
                Top Departments
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
                
                {/* SVG Donut Chart */}
                <div style={{ width: '220px', height: '220px', position: 'relative', flexShrink: 0 }}>
                  <svg viewBox="0 0 210 210" style={{ width: '100%', height: '100%' }}>
                    <g className="donut-chart-container">
                      {departments.map((dept) => {
                        const startAngle = cumulativeAngle;
                        const sliceAngle = (dept.percentage / 100) * 360;
                        const endAngle = startAngle + sliceAngle;
                        cumulativeAngle = endAngle;

                        const pathD = getSlicePath(startAngle, endAngle - 0.6);
                        const isHovered = hoveredSlice === dept.name;

                        const midAngle = startAngle + sliceAngle / 2;
                        const rad = ((midAngle - 90) * Math.PI) / 180;
                        const offsetX = isHovered ? Math.cos(rad) * 6 : 0;
                        const offsetY = isHovered ? Math.sin(rad) * 6 : 0;

                        return (
                          <path
                            key={dept.name}
                            d={pathD}
                            fill={dept.color}
                            style={{
                              cursor: 'pointer',
                              transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease, filter 0.25s ease',
                              opacity: hoveredSlice && !isHovered ? 0.45 : 1,
                              transform: `translate(${offsetX}px, ${offsetY}px)`,
                              filter: isHovered ? 'drop-shadow(0 8px 16px rgba(0,0,0,0.22))' : 'none'
                            }}
                            onMouseEnter={() => setHoveredSlice(dept.name)}
                            onMouseLeave={() => setHoveredSlice(null)}
                          >
                            <title>{dept.name}: {dept.percentage}%</title>
                          </path>
                        );
                      })}
                    </g>

                    {/* Donut Center Hole Text */}
                    <text x={cx} y={cy - 6} textAnchor="middle" fontSize="17" fontWeight="800" fill="#0f172a">
                      {activeDepartment ? activeDepartment.name : 'Total'}
                    </text>
                    <text x={cx} y={cy + 16} textAnchor="middle" fontSize="15" fontWeight="700" fill={activeDepartment ? activeDepartment.color : '#4b5563'}>
                      {activeDepartment ? `${activeDepartment.percentage}%` : '100%'}
                    </text>
                  </svg>
                </div>

                {/* Donut Chart Legend */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '11px', flex: 1, paddingLeft: '22px' }}>
                  {departments.map((dept) => (
                    <div
                      key={dept.name}
                      onMouseEnter={() => setHoveredSlice(dept.name)}
                      onMouseLeave={() => setHoveredSlice(null)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '15px',
                        cursor: 'pointer',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        backgroundColor: hoveredSlice === dept.name ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
                        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                        transform: hoveredSlice === dept.name ? 'translateX(6px)' : 'translateX(0)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                        <span style={{
                          width: '11px',
                          height: '11px',
                          borderRadius: '50%',
                          backgroundColor: dept.color,
                          display: 'inline-block',
                          boxShadow: hoveredSlice === dept.name ? `0 0 8px ${dept.color}` : 'none'
                        }} />
                        <span style={{ fontWeight: 600, color: '#111827' }}>{dept.name}</span>
                      </div>
                      <span style={{ fontWeight: 700, color: '#374151' }}>{dept.percentage}%</span>
                    </div>
                  ))}
                </div>

              </div>
            </div>

          </div>

          {/* Bottom Row: Recent Activities Glass Card */}
          <div style={{
            ...glassCardStyle,
            padding: '28px'
          }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '22px' }}>
              Recent Activities
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {activities.map((act, index) => {
                const Icon = act.icon;
                return (
                  <React.Fragment key={act.id}>
                    <div className="activity-item-hover" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                        {/* Circular Colored Icon Badge */}
                        <div style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '12px',
                          backgroundColor: act.iconBg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          transition: 'transform 0.2s ease'
                        }}>
                          <Icon size={22} color={act.iconColor} strokeWidth={2.2} />
                        </div>
                        <span style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937' }}>
                          {act.text}
                        </span>
                      </div>
                      <span style={{ fontSize: '15px', fontWeight: 500, color: '#9ca3af' }}>
                        {act.date}
                      </span>
                    </div>
                    {index < activities.length - 1 && (
                      <div style={{ height: '1px', backgroundColor: 'rgba(226, 232, 240, 0.7)', margin: '2px 0' }} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

        </main>
      </div>

    </div>
  );
}
