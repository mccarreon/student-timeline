import React, { useState, useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const Table = ({ headers, rows }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white border border-gray-200">
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th 
              key={index}
              className="border-b px-4 py-2 text-left bg-gray-50"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td 
                key={cellIndex}
                className="border-b px-4 py-2"
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const AcademicTimeline = () => {
  const [yearType, setYearType] = useState('semester');
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredPeriod, setHoveredPeriod] = useState(null);
  const [scenario, setScenario] = useState('default');

  const academicPrograms = {
    majors: [
      {
        name: 'Computer Science',
        startDate: '2018-09-01',
        expectedCompletion: '2019-12-15',
        color: '#0875e1', // Workday Primary Blue
        minors: [
          {
            name: 'Mathematics',
            startDate: '2019-01-15',
            expectedCompletion: '2019-12-15',
            color: '#13a5ad' // Workday Teal
          }
        ]
      },
      {
        name: 'Data Science',
        startDate: '2019-01-01',
        expectedCompletion: '2020-05-15',
        color: '#005cb9', // Workday Gradient Blue 3
        minors: []
      }
    ]
  };
  // Sample class data for each period
  const classData = {
    'Fall 18': [
      { code: 'CS101', name: 'Introduction to Programming', credits: 3, grade: 'A' },
      { code: 'MATH201', name: 'Calculus I', credits: 4, grade: 'B+' },
      { code: 'ENG101', name: 'English Composition', credits: 3, grade: 'A-' },
    ],
    'Winter 18': [
      { code: 'CS102', name: 'Data Structures', credits: 3, grade: 'B+' },
      { code: 'MATH202', name: 'Calculus II', credits: 4, grade: 'B' },
      { code: 'PHYS101', name: 'Physics I', credits: 4, grade: 'A-' },
    ],
    'Spring 19': [
      { code: 'CS103', name: 'Algorithms', credits: 3, grade: 'A' },
      { code: 'MATH203', name: 'Linear Algebra', credits: 3, grade: 'B+' },
      { code: 'PHYS102', name: 'Physics II', credits: 4, grade: 'B' },
    ],
    'Summer 19': [
      { code: 'CS201', name: 'Database Systems', credits: 3, grade: 'A-' },
      { code: 'STAT101', name: 'Statistics', credits: 3, grade: 'B+' },
    ],
    'Fall 19': [
      { code: 'CS202', name: 'Operating Systems', credits: 3, grade: 'B+' },
      { code: 'CS203', name: 'Computer Networks', credits: 3, grade: 'A' },
      { code: 'MATH301', name: 'Discrete Mathematics', credits: 3, grade: 'A-' },
    ],
  };

  const academicPeriods = {
    semester: [
      { name: 'Fall 18', start: '2018-09-01', end: '2018-12-31' },
      { name: 'Winter 18', start: '2019-01-01', end: '2019-02-28' },
      { name: 'Spring 19', start: '2019-03-01', end: '2019-05-31' },
      { name: 'Summer 19', start: '2019-06-01', end: '2019-08-31' },
      { name: 'Fall 19', start: '2019-09-01', end: '2019-12-31' }
    ],
    quarter: [
      { name: 'Fall Quarter 18', start: '2018-09-01', end: '2018-12-31' },
      { name: 'Winter Quarter 18', start: '2019-01-01', end: '2019-03-31' },
      { name: 'Spring Quarter 19', start: '2019-04-01', end: '2019-06-30' },
      { name: 'Summer Quarter 19', start: '2019-07-01', end: '2019-08-31' },
      { name: 'Fall Quarter 19', start: '2019-09-01', end: '2019-12-31' }
    ],
    trimester: [
      { name: 'Fall 18', start: '2018-09-01', end: '2018-12-31' },
      { name: 'Winter 18', start: '2019-01-01', end: '2019-04-30' },
      { name: 'Spring 19', start: '2019-05-01', end: '2019-08-31' },
      { name: 'Summer 19', start: '2019-09-01', end: '2019-12-31' },
      { name: 'Fall 19', start: '2020-01-01', end: '2020-04-30' }
    ]
  };

  const events = [
    { name: 'Registration Opens', date: '2018-10-15', color: '#d45700' }, // Workday Orange
    { name: 'Spring Break', date: '2019-03-15', color: '#008000' }, // Workday Green
    { name: 'Finals Week', date: '2019-05-15', color: '#de2e2e' } // Workday Red
  ];

  const svgWidth = 800;
  const svgHeight = 400;
  const padding = 50;
  const baselineY = svgHeight - 50;
  const nodeRadius = 8;
  const programSpacing = 50;
  const eventSpacing = 25;
  const programAreaHeight = 150;
  const scenarios = {
    default: {
      majors: [
        {
          name: 'Computer Science',
          startDate: '2018-09-01',
          expectedCompletion: '2019-12-15',
          color: '#0875e1',
          minors: [
            {
              name: 'Mathematics',
              startDate: '2019-01-15',
              expectedCompletion: '2019-12-15',
              color: '#13a5ad'
            }
          ]
        },
        {
          name: 'Data Science',
          startDate: '2019-01-01',
          expectedCompletion: '2020-05-15',
          color: '#005cb9',
          minors: []
        }
      ],
      events: []
    },
    removedProgram: {
      majors: [
        {
          name: 'Computer Science',
          startDate: '2018-09-01',
          expectedCompletion: '2019-12-15',
          color: '#0875e1',
          minors: [
            {
              name: 'Mathematics',
              startDate: '2019-01-15',
              expectedCompletion: '2019-12-15',
              color: '#13a5ad'
            }
          ]
        },
        {
          name: 'Data Science (Discontinued)',
          startDate: '2019-01-01',
          endDate: '2019-05-31',
          color: '#de2e2e',
          minors: []
        }
      ],
      events: [
        { name: 'Program Discontinued', date: '2019-05-31', color: '#de2e2e' }
      ]
    },
    leaveOfAbsence: {
      majors: [
        {
          name: 'Computer Science',
          startDate: '2018-09-01',
          expectedCompletion: '2020-05-15',
          color: '#0875e1',
          minors: [
            {
              name: 'Mathematics',
              startDate: '2019-01-15',
              expectedCompletion: '2020-05-15',
              color: '#13a5ad'
            }
          ]
        }
      ],
      events: [
        { name: 'Leave of Absence Start', date: '2019-06-01', color: '#d45700' },
        { name: 'Expected Return', date: '2020-01-01', color: '#008000' }
      ]
    },
    withdrawn: {
      majors: [
        {
          name: 'Computer Science',
          startDate: '2018-09-01',
          endDate: '2019-05-31',
          color: '#0875e1',
          minors: [
            {
              name: 'Mathematics',
              startDate: '2019-01-15',
              endDate: '2019-05-31',
              color: '#13a5ad'
            }
          ]
        }
      ],
      events: [
        { name: 'Withdrawn', date: '2019-05-31', color: '#de2e2e' }
      ]
    },
    dismissed: {
      majors: [
        {
          name: 'Computer Science',
          startDate: '2018-09-01',
          endDate: '2019-05-31',
          color: '#0875e1',
          minors: [
            {
              name: 'Mathematics',
              startDate: '2019-01-15',
              endDate: '2019-05-31',
              color: '#13a5ad'
            }
          ]
        }
      ],
      events: [
        { name: 'Dismissed', date: '2019-05-31', color: '#de2e2e' }
      ]
    },
    suspended: {
      majors: [
        {
          name: 'Computer Science',
          startDate: '2018-09-01',
          expectedCompletion: '2020-12-15',
          color: '#0875e1',
          minors: [
            {
              name: 'Mathematics',
              startDate: '2019-01-15',
              expectedCompletion: '2020-12-15',
              color: '#13a5ad'
            }
          ]
        }
      ],
      events: [
        { name: 'Suspended', date: '2019-06-01', color: '#de2e2e' },
        { name: 'Expected Return', date: '2020-01-01', color: '#008000' }
      ]
    }
  };
  const getTimelineWidth = () => svgWidth - (2 * padding);

  const getNodeSpacing = (periods) => getTimelineWidth() / (periods.length - 1);
  
  const calculateEventPosition = (date) => {
    const periods = academicPeriods[yearType];
    const startDate = new Date(periods[0].start);
    const endDate = new Date(periods[periods.length - 1].end);
    const eventDate = new Date(date);
    
    const totalDuration = endDate - startDate;
    const eventPosition = eventDate - startDate;
    
    return padding + (eventPosition / totalDuration) * getTimelineWidth();
  };

  const handlePeriodClick = (period) => {
    setSelectedPeriod(period);
    setIsModalOpen(true);
  };

  const calculateGPA = (classes) => {
    const gradePoints = {
      'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'F': 0.0
    };

    const totalPoints = classes.reduce((sum, course) => 
      sum + (gradePoints[course.grade] * course.credits), 0);
    const totalCredits = classes.reduce((sum, course) => sum + course.credits, 0);

    return (totalPoints / totalCredits).toFixed(2);
  };

  const calculatePosition = (date) => {
    const periods = academicPeriods[yearType];
    const startDate = new Date(periods[0].start);
    const endDate = new Date(periods[periods.length - 1].end);
    const targetDate = new Date(date);
    
    const totalDuration = endDate - startDate;
    const position = targetDate - startDate;
    
    return Math.min(
      padding + (position / totalDuration) * getTimelineWidth(),
      svgWidth - padding
    );
  };

  const renderProgramLines = () => {
    const { majors } = scenarios[scenario];
    const topY = baselineY - programAreaHeight;

    return majors.map((major, index) => {
      const yOffset = topY + (index * programSpacing);
      const startX = calculatePosition(major.startDate);
      const endX = calculatePosition(major.endDate || major.expectedCompletion);

      return (
        <g key={major.name}>
          <line
            x1={startX}
            y1={yOffset}
            x2={endX}
            y2={yOffset}
            stroke={major.color}
            strokeWidth="3"
          />
          
          <text
            x={startX}
            y={yOffset - 10}
            textAnchor="start"
            fill={major.color}
            className="text-xs font-bold"
          >
            {major.name}
          </text>

          {major.endDate && (
            <circle
              cx={endX}
              cy={yOffset}
              r={6}
              fill={major.color}
            />
          )}
          
          {major.minors.map((minor, minorIndex) => {
            const minorStartX = calculatePosition(minor.startDate);
            const minorEndX = calculatePosition(minor.endDate || minor.expectedCompletion);
            const minorY = yOffset + 25;

            return (
              <g key={minor.name}>
                <line
                  x1={minorStartX}
                  y1={yOffset}
                  x2={minorStartX}
                  y2={minorY}
                  stroke={minor.color}
                  strokeWidth="2"
                  strokeDasharray="4"
                />
                
                <line
                  x1={minorStartX}
                  y1={minorY}
                  x2={minorEndX}
                  y2={minorY}
                  stroke={minor.color}
                  strokeWidth="2"
                  strokeDasharray="4"
                />

                <text
                  x={minorStartX}
                  y={minorY - 5}
                  textAnchor="start"
                  fill={minor.color}
                  className="text-xs"
                >
                  Minor: {minor.name}
                </text>

                {minor.endDate && (
                  <circle
                    cx={minorEndX}
                    cy={minorY}
                    r={4}
                    fill={minor.color}
                  />
                )}
              </g>
            );
          })}
        </g>
      );
    });
  };
  const renderTimeline = () => {
    const periods = academicPeriods[yearType];
    const spacing = getNodeSpacing(periods);
    const { events } = scenarios[scenario];

    return (
      <svg 
        width={svgWidth} 
        height={svgHeight} 
        className="max-w-full bg-white rounded-lg shadow-lg"
      >
        {renderProgramLines()}

        {events.map((event, index) => {
          const x = calculatePosition(event.date);
          const y = baselineY - eventSpacing - (index % 2 === 0 ? 0 : 20);
          return (
            <g key={event.name}>
              <line
                x1={x}
                y1={y}
                x2={x}
                y2={baselineY}
                stroke={event.color}
                strokeWidth="2"
                strokeDasharray="4"
              />
              <circle 
                cx={x} 
                cy={y}
                r={6} 
                fill={event.color}
              />
              <text 
                x={x} 
                y={y - 10} 
                textAnchor="middle" 
                fill={event.color}
                className="text-xs"
              >
                {event.name}
              </text>
            </g>
          );
        })}

        <line 
          x1={padding} 
          y1={baselineY} 
          x2={svgWidth - padding} 
          y2={baselineY} 
          stroke="#4d4d4d"
          strokeWidth="2"
        />

        {periods.map((period, index) => {
          const x = padding + (spacing * index);
          const isHovered = hoveredPeriod === period.name;
          
          return (
            <g 
              key={period.name}
              onClick={() => handlePeriodClick(period.name)}
              onMouseEnter={() => setHoveredPeriod(period.name)}
              onMouseLeave={() => setHoveredPeriod(null)}
              className="cursor-pointer"
            >
              <circle 
                cx={x} 
                cy={baselineY} 
                r={nodeRadius} 
                fill={isHovered ? "#e8e8e8" : "#fff"}
                stroke="#4d4d4d"
                strokeWidth="2"
                className="transition-all duration-200"
              />

              <text 
                x={x} 
                y={baselineY + 25} 
                textAnchor="middle" 
                fill="#4d4d4d"
                className={`text-sm ${isHovered ? 'font-bold' : 'font-medium'} transition-all duration-200`}
              >
                {period.name}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <select 
          value={yearType}
          onChange={(e) => setYearType(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="semester">Semester</option>
          <option value="quarter">Quarter</option>
          <option value="trimester">Trimester</option>
        </select>
        <select 
          value={scenario}
          onChange={(e) => setScenario(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="default">Default</option>
          <option value="removedProgram">Removed Program</option>
          <option value="leaveOfAbsence">Leave of Absence</option>
          <option value="withdrawn">Withdrawn</option>
          <option value="dismissed">Dismissed</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>
      
      {renderTimeline()}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={`Classes for ${selectedPeriod || ''}`}
      >
        {selectedPeriod && classData[selectedPeriod] && (
          <div>
            <div className="mb-4">
              <span className="font-semibold">Term GPA: </span>
              {calculateGPA(classData[selectedPeriod])}
            </div>
            <Table 
              headers={['Course Code', 'Course Name', 'Credits', 'Grade']}
              rows={classData[selectedPeriod].map(course => [
                course.code,
                course.name,
                course.credits,
                course.grade
              ])}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AcademicTimeline;