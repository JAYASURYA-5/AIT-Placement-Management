import React, { useMemo, useState } from 'react';

const initialEvents = {
  '2025-07-02': [
    { id: 1, company: 'Zoho Corporation', title: 'Zoho Test', category: 'Test', time: '10:00 AM - 12:30 PM', description: 'Online coding round on Zoho Creator platform.' }
  ],
  '2025-07-11': [
    { id: 2, company: 'Tata Consultancy Services', title: 'TCS Coding', category: 'Test', time: '02:00 PM - 04:00 PM', description: 'Advanced coding assessment for Digital systems engineer role.' }
  ],
  '2025-07-15': [
    { id: 3, company: 'Infosys', title: 'Infosys Interview', category: 'Interview', time: '11:00 AM - 12:00 PM', description: 'Technical & HR interview for Specialist Programmer.' }
  ],
  '2025-07-17': [
    { id: 4, company: 'Capgemini', title: 'Capgemini Aptitude', category: 'Aptitude', time: '09:00 AM - 10:30 AM', description: 'Aptitude and cognitive game-based assessment.' }
  ],
  '2025-07-25': [
    { id: 5, company: 'Amazon', title: 'Amazon HR', category: 'Interview', time: '04:00 PM - 05:00 PM', description: 'Behavioral & Leadership Principles round.' }
  ]
};

const monthsList = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const getCategoryColor = (category) => {
  switch (category) {
    case 'Test': return '#C18B63';
    case 'Interview': return '#2A7E43';
    case 'Aptitude': return '#621B4B';
    default: return '#2C2523';
  }
};

export default function DriveCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 1));
  const [selectedEvent, setSelectedEvent] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarCells = useMemo(() => {
    const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
    const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

    const daysInCurrentMonth = getDaysInMonth(year, month);
    const firstDayIndex = getFirstDayOfMonth(year, month);

    const prevMonthIndex = month === 0 ? 11 : month - 1;
    const prevYearValue = month === 0 ? year - 1 : year;
    const daysInPrevMonth = getDaysInMonth(prevYearValue, prevMonthIndex);

    const cells = [];

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const mStr = String(prevMonthIndex + 1).padStart(2, '0');
      const dateKey = `${prevYearValue}-${mStr}-${String(d).padStart(2, '0')}`;
      cells.push({ day: d, isCurrentMonth: false, dateKey, events: initialEvents[dateKey] || [] });
    }

    for (let d = 1; d <= daysInCurrentMonth; d++) {
      const mStr = String(month + 1).padStart(2, '0');
      const dateKey = `${year}-${mStr}-${String(d).padStart(2, '0')}`;
      cells.push({ day: d, isCurrentMonth: true, dateKey, events: initialEvents[dateKey] || [] });
    }

    const remainingSlots = cells.length % 7 === 0 ? 0 : 7 - (cells.length % 7);
    const nextMonthIndex = month === 11 ? 0 : month + 1;
    const nextYearValue = month === 11 ? year + 1 : year;

    for (let d = 1; d <= remainingSlots; d++) {
      const mStr = String(nextMonthIndex + 1).padStart(2, '0');
      const dateKey = `${nextYearValue}-${mStr}-${String(d).padStart(2, '0')}`;
      cells.push({ day: d, isCurrentMonth: false, dateKey, events: initialEvents[dateKey] || [] });
    }

    return cells;
  }, [year, month]);

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const handleToday = () => setCurrentDate(new Date());

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 6px' }}>Drive Calendar</h2>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px' }}>Placement drives and interviews for the selected month.</p>
        </div>
        <button
          onClick={handleToday}
          style={{ padding: '8px 14px', borderRadius: '999px', border: '1px solid var(--border-light)', background: '#fff', fontWeight: '700', cursor: 'pointer' }}
        >
          Today
        </button>
      </div>

      <div style={{ border: '1px solid var(--border-light)', borderRadius: '20px', background: '#fff', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={handlePrevMonth} style={{ border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer' }}>&lt;</button>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>{monthsList[month]} {year}</h3>
            <button onClick={handleNextMonth} style={{ border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer' }}>&gt;</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '8px' }}>
          {weekdays.map((day) => (
            <div key={day} style={{ textAlign: 'center', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)' }}>{day}</div>
          ))}

          {calendarCells.map((cell, index) => (
            <div
              key={`${cell.dateKey}-${index}`}
              style={{
                minHeight: '100px',
                border: '1px solid var(--border-light)',
                borderRadius: '12px',
                padding: '8px',
                background: cell.isCurrentMonth ? '#fff' : '#fafafa',
                opacity: cell.isCurrentMonth ? 1 : 0.7
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>{cell.day}</div>
              {cell.events.map((evt) => (
                <button
                  key={evt.id}
                  type="button"
                  onClick={() => setSelectedEvent(evt)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    border: 'none',
                    borderRadius: '8px',
                    background: `${getCategoryColor(evt.category)}18`,
                    color: getCategoryColor(evt.category),
                    padding: '6px 8px',
                    marginBottom: '6px',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {evt.title}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {selectedEvent && (
        <div style={{ border: '1px solid var(--border-light)', borderRadius: '16px', background: '#fff', padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: '800' }}>{selectedEvent.company}</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '13px' }}>{selectedEvent.title}</p>
            </div>
            <button
              onClick={() => setSelectedEvent(null)}
              style={{ border: 'none', background: 'transparent', fontSize: '18px', cursor: 'pointer' }}
            >
              ×
            </button>
          </div>
          <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
            <div><strong>Category:</strong> {selectedEvent.category}</div>
            <div><strong>Time:</strong> {selectedEvent.time}</div>
            <div><strong>Description:</strong> {selectedEvent.description}</div>
          </div>
        </div>
      )}
    </div>
  );
}
