import React, { useState, useEffect } from 'react'
import { fetchDrivesFromFirestore } from '../firebase'

const initialEvents = {
  '2026-09-09': [
    { id: 'fs_demo_1', company: 'TEAM', title: 'TEAM Placement Drive', category: 'Drive', time: '10:00 AM', description: 'Testing role placement drive. Min CGPA: 8.0', isNominated: true },
    { id: 'fs_demo_2', company: 'Zyphorzone', title: 'Zyphorzone Full Stack Drive', category: 'Drive', time: '02:00 PM', description: 'Full stack role. Min CGPA: 6.5', isNominated: true }
  ],
  '2026-09-15': [
    { id: 'fs_demo_3', company: 'TEAM TEXA', title: 'TEAM TEXA Data Analyst Drive', category: 'Interview', time: '11:00 AM', description: 'Data Analyst role. CTC: 10 LPA. Min CGPA: 8.5', isNominated: true }
  ],
  '2026-07-02': [
    { id: 1, company: 'Zoho Corporation', title: 'Zoho Test', category: 'Test', time: '10:00 AM - 12:30 PM', description: 'Online coding round on Zoho Creator platform.', isNominated: true }
  ],
  '2026-07-11': [
    { id: 2, company: 'Tata Consultancy Services', title: 'TCS Coding', category: 'Test', time: '02:00 PM - 04:00 PM', description: 'Advanced coding assessment for Digital systems engineer role.', isNominated: false }
  ],
  '2026-07-15': [
    { id: 3, company: 'Infosys', title: 'Infosys Interview', category: 'Interview', time: '11:00 AM - 12:00 PM', description: 'Technical & HR interview for Specialist Programmer.', isNominated: false }
  ]
}

const monthsList = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

const formatEventDate = (dateKey) => {
  try {
    const [year, month, day] = dateKey.split('-').map(Number)
    if (year && month && day) {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(new Date(year, month - 1, day))
    }
  } catch { }
  return dateKey
}

export default function DriveCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showCalendar, setShowCalendar] = useState(false)
  const [eventsMap, setEventsMap] = useState(initialEvents)
  const [upcomingEvents, setUpcomingEvents] = useState([])

  useEffect(() => {
    async function loadFirestoreDriveEvents() {
      let profile = {}
      try {
        profile = JSON.parse(localStorage.getItem('ait-profile') || '{}')
      } catch { }

      const studentIds = [
        (profile.uid || '').toLowerCase(),
        (profile.id || '').toLowerCase(),
        (profile.regNo || '').toLowerCase(),
        (profile.email || '').toLowerCase()
      ].filter(Boolean)

      const fsDrives = await fetchDrivesFromFirestore()
      const newEventsMap = { ...initialEvents }

      if (fsDrives && fsDrives.length > 0) {
        fsDrives.forEach((drive) => {
          const nominatedList = (drive.nominatedStudents || []).map(s => String(s).toLowerCase())
          const isNominated = studentIds.some(id => nominatedList.includes(id)) || nominatedList.length > 0

          // Try to parse drive.date or default to 2026-09-09 / 2026-09-15
          let dateKey = '2026-09-15'
          if (drive.date) {
            const parsed = new Date(drive.date)
            if (!isNaN(parsed.getTime())) {
              const y = parsed.getFullYear()
              const m = String(parsed.getMonth() + 1).padStart(2, '0')
              const d = String(parsed.getDate()).padStart(2, '0')
              dateKey = `${y}-${m}-${d}`
            }
          }

          const eventItem = {
            id: drive.id,
            company: drive.company || 'Placement Drive',
            title: `${drive.company} - ${drive.role || 'Campus Drive'}`,
            category: isNominated ? 'Nominated' : (drive.status || 'Drive'),
            isNominated: isNominated,
            time: drive.date || 'TBA',
            description: `${drive.company} campus placement drive for ${drive.role || 'Software Engineer'}. CTC: ${drive.package || 'Market Standard'}. Min CGPA Cutoff: ${drive.minCGPA || '6.5'}. Eligible Branches: ${drive.branches || 'CSE, IT, ECE'}. Bond: ${drive.bond || 'No Bond'}. Location: ${drive.location || 'Campus'}.`,
            package: drive.package,
            role: drive.role,
            minCGPA: drive.minCGPA,
            branches: drive.branches,
            bond: drive.bond,
            location: drive.location,
            driveUrl: drive.url || drive.driveUrl || drive.link || ''
          }

          if (!newEventsMap[dateKey]) {
            newEventsMap[dateKey] = []
          }

          // Avoid duplicates
          if (!newEventsMap[dateKey].some(e => e.id === drive.id)) {
            newEventsMap[dateKey].push(eventItem)
          }
        })
      }

      setEventsMap(newEventsMap)

      const upcoming = Object.entries(newEventsMap)
        .flatMap(([dateKey, events]) => events.map((event) => ({ ...event, dateKey })))
        .sort((firstEvent, secondEvent) => firstEvent.dateKey.localeCompare(secondEvent.dateKey))

      setUpcomingEvents(upcoming)
    }

    loadFirestoreDriveEvents()
  }, [])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate()
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay()

  const daysInCurrentMonth = getDaysInMonth(year, month)
  const firstDayIndex = getFirstDayOfMonth(year, month)

  const prevMonthIndex = month === 0 ? 11 : month - 1
  const prevYearValue = month === 0 ? year - 1 : year
  const daysInPrevMonth = getDaysInMonth(prevYearValue, prevMonthIndex)

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  // Generate calendar grid items
  const calendarCells = []

  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i
    const mStr = String(prevMonthIndex + 1).padStart(2, '0')
    const dateKey = `${prevYearValue}-${mStr}-${String(d).padStart(2, '0')}`
    calendarCells.push({
      day: d,
      isCurrentMonth: false,
      dateKey,
      events: eventsMap[dateKey] || []
    })
  }

  for (let d = 1; d <= daysInCurrentMonth; d++) {
    const mStr = String(month + 1).padStart(2, '0')
    const dateKey = `${year}-${mStr}-${String(d).padStart(2, '0')}`
    calendarCells.push({
      day: d,
      isCurrentMonth: true,
      dateKey,
      events: eventsMap[dateKey] || []
    })
  }

  const totalCells = calendarCells.length
  const remainingSlots = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7)
  const nextMonthIndex = month === 11 ? 0 : month + 1
  const nextYearValue = month === 11 ? year + 1 : year

  for (let d = 1; d <= remainingSlots; d++) {
    const mStr = String(nextMonthIndex + 1).padStart(2, '0')
    const dateKey = `${nextYearValue}-${mStr}-${String(d).padStart(2, '0')}`
    calendarCells.push({
      day: d,
      isCurrentMonth: false,
      dateKey,
      events: eventsMap[dateKey] || []
    })
  }

  const handleEventClick = (event, e) => {
    e.stopPropagation()
    setSelectedEvent(event)
  }

  const getCategoryColor = (category, isNominated) => {
    if (isNominated || category === 'Nominated') return '#BE185D'
    switch (category) {
      case 'Test':
        return '#C18B63'
      case 'Interview':
        return '#2A7E43'
      case 'Aptitude':
        return '#621B4B'
      default:
        return '#2563EB'
    }
  }

  return (
    <div className="calendar-page-wrapper">
      <h1 className="page-title">Drive Calendar</h1>

      {showCalendar && <div className="profile-page-content">
        <div className="profile-card calendar-card-container">

          {/* Calendar Navigation Header */}
          <div className="calendar-nav-header">
            <div className="calendar-nav-left">
              <button className="btn-nav-arrow" type="button" onClick={handlePrevMonth}>
                &lt;
              </button>
              <h2 className="calendar-month-title">
                {monthsList[month]} {year}
              </h2>
              <button className="btn-nav-arrow" type="button" onClick={handleNextMonth}>
                &gt;
              </button>
            </div>
            <div className="calendar-header-actions">
              <button className="btn-today-shortcut" type="button" onClick={handleToday}>
                Today
              </button>
              <button className="btn-calendar-back" type="button" onClick={() => setShowCalendar(false)}>
                Back to Upcoming
              </button>
            </div>
          </div>

          {/* Weekday Columns Header */}
          <div className="calendar-weekday-grid">
            {weekdays.map((day) => (
              <div key={day} className="weekday-header">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days Grid */}
          <div className="calendar-days-grid">
            {calendarCells.map((cell, index) => (
              <div
                key={index}
                className={`calendar-day-cell ${cell.isCurrentMonth ? 'current' : 'outside'} ${cell.events.length > 0 ? 'has-events' : ''
                  }`}
              >
                <span className="day-number">{cell.day}</span>
                {cell.events.map((evt) => (
                  <div
                    key={evt.id}
                    className={`calendar-event-card category-${evt.category.toLowerCase()}`}
                    onClick={(e) => handleEventClick(evt, e)}
                  >
                    <div className="event-title-text">{evt.title}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Legend Section */}
          <div className="calendar-legend-bar">
            <div className="legend-item">
              <span className="legend-dot legend-test"></span>
              <span>Test</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot legend-interview"></span>
              <span>Interview</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot legend-aptitude"></span>
              <span>Aptitude</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot legend-other"></span>
              <span>Other</span>
            </div>
          </div>

        </div>
      </div>}

      {!showCalendar && <section className="upcoming-companies-section" aria-labelledby="upcoming-companies-title">
        <div className="upcoming-companies-header">
          <div>
            <h2 id="upcoming-companies-title" className="card-title">Upcoming Companies</h2>

          </div>
          <div className="upcoming-companies-actions">
            <button
              type="button"
              className="calendar-icon-button"
              aria-label={showCalendar ? 'Hide calendar' : 'Open calendar'}
              title={showCalendar ? 'Hide calendar' : 'Open calendar'}
              onClick={() => setShowCalendar((isVisible) => !isVisible)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M16 3v4M8 3v4M3 10h18" />
                <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
              </svg>
            </button>
            <span className="upcoming-count">{upcomingEvents.length} upcoming</span>
          </div>
        </div>

        <div className="upcoming-companies-list">
          {upcomingEvents.map((event) => (
            <button
              key={event.id}
              type="button"
              className="upcoming-company-item"
              onClick={() => setSelectedEvent(event)}
              style={{
                borderLeft: event.isNominated ? '4px solid #be185d' : 'none',
                backgroundColor: event.isNominated ? '#fdf2f8' : 'inherit'
              }}
            >
              <span className="upcoming-company-date">{formatEventDate(event.dateKey)}</span>
              <span className="upcoming-company-details">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ fontSize: '15px' }}>{event.company}</strong>
                  {event.isNominated && (
                    <span style={{
                      backgroundColor: '#dc2626', color: '#ffffff', fontSize: '11px',
                      fontWeight: '800', padding: '2px 8px', borderRadius: '6px'
                    }}>
                      🎉 Nominated
                    </span>
                  )}
                </div>
                <span>{event.title} · {event.time}</span>
              </span>
              <span
                className={`upcoming-company-category category-${(event.category || 'drive').toLowerCase()}`}
                style={{
                  backgroundColor: event.isNominated ? '#be185d' : undefined,
                  color: event.isNominated ? '#ffffff' : undefined
                }}
              >
                {event.isNominated ? 'Nominated' : event.category}
              </span>
            </button>
          ))}
        </div>
      </section>}

      {/* Selected Event Details Modal */}
      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 className="modal-company-name">{selectedEvent.company}</h2>
                <p className="modal-role">{selectedEvent.title}</p>
              </div>
              <button className="modal-close-btn" type="button" onClick={() => setSelectedEvent(null)}>
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h4 className="modal-section-title">Drive Details</h4>
                <div className="modal-status-summary">
                  <span
                    className="status-badge"
                    style={{
                      backgroundColor: `${getCategoryColor(selectedEvent.category)}18`,
                      color: getCategoryColor(selectedEvent.category),
                      border: `1px solid ${getCategoryColor(selectedEvent.category)}`
                    }}
                  >
                    {selectedEvent.category}
                  </span>
                  <span className="modal-meta-text">Time: <strong>{selectedEvent.time}</strong></span>
                </div>
              </div>

              <div className="modal-section">
                <h4 className="modal-section-title">Description</h4>
                <p className="modal-description">{selectedEvent.description}</p>
              </div>

              {selectedEvent.driveUrl && (
                <div className="modal-section">
                  <h4 className="modal-section-title">Placement Drive Link / Application Portal</h4>
                  <div style={{
                    backgroundColor: '#fdf2f8',
                    border: '1.5px solid #fbcfe8',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    marginTop: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}>
                    <a
                      href={selectedEvent.driveUrl.startsWith('http') ? selectedEvent.driveUrl : `https://${selectedEvent.driveUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#be185d', fontWeight: '700', fontSize: '13px', wordBreak: 'break-all' }}
                    >
                      🔗 {selectedEvent.driveUrl}
                    </a>
                    <a
                      href={selectedEvent.driveUrl.startsWith('http') ? selectedEvent.driveUrl : `https://${selectedEvent.driveUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        backgroundColor: '#be185d',
                        color: '#ffffff',
                        fontWeight: '700',
                        fontSize: '12.5px',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        textDecoration: 'none'
                      }}
                    >
                      Open Link ↗
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-modal-close" type="button" onClick={() => setSelectedEvent(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
