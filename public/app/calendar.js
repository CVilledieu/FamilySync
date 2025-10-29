// Calendar components and logic
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
];

let currentDate = new Date();
let displayDate = new Date();

export const Calendar = () => {
    const container = document.createElement('div');
    container.className = 'calendar';
    
    const nav = createCalendarNav();
    const header = createCalendarHeader();
    const grid = createCalendarGrid();
    
    container.appendChild(nav);
    container.appendChild(header);
    container.appendChild(grid);
    
    // Pass the container to updateCalendar instead of calling it globally
    updateCalendar(container);
    return container;
}

const createCalendarNav = () => {
    const nav = document.createElement('div');
    nav.className = 'calendar-nav';
    
    const prevButton = document.createElement('button');
    prevButton.className = 'nav-button';
    prevButton.innerHTML = '&#8249;';
    prevButton.addEventListener('click', () => {
        displayDate.setMonth(displayDate.getMonth() - 1);
        updateCalendar();
    });
    
    const monthYear = document.createElement('h2');
    monthYear.className = 'month-year';
    
    const nextButton = document.createElement('button');
    nextButton.className = 'nav-button';
    nextButton.innerHTML = '&#8250;';
    nextButton.addEventListener('click', () => {
        displayDate.setMonth(displayDate.getMonth() + 1);
        updateCalendar();
    });
    
    nav.appendChild(prevButton);
    nav.appendChild(monthYear);
    nav.appendChild(nextButton);
    
    return nav;
}

const createCalendarHeader = () => {
    const header = document.createElement('div');
    header.className = 'calendar-header';
    
    daysOfWeek.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'day-header';
        dayElement.textContent = day;
        header.appendChild(dayElement);
    });
    
    return header;
}

const createCalendarGrid = () => {
    const grid = document.createElement('div');
    grid.className = 'calendar-grid';
    
    // Create 42 cells (6 weeks × 7 days)
    for (let i = 0; i < 42; i++) {
        const cell = createCalendarCell();
        cell.dataset.cellIndex = i;
        grid.appendChild(cell);
    }
    
    return grid;
}

const createCalendarCell = () => {
    const cell = document.createElement('div');
    cell.className = 'calendar-cell';
    
    const dateNumber = document.createElement('div');
    dateNumber.className = 'date-number';
    
    const events = document.createElement('div');
    events.className = 'events';
    
    cell.appendChild(dateNumber);
    cell.appendChild(events);
    
    // Add click event for potential future functionality
    cell.addEventListener('click', (e) => {
        const date = e.currentTarget.dataset.date;
        if (date) {
            console.log('Clicked on date:', date);
            // Future: Open event creation modal or detail view
        }
    });
    
    return cell;
}

const updateCalendar = (container = document) => {
    const monthYearElement = container.querySelector('.month-year');
    const cells = container.querySelectorAll('.calendar-cell');
    
    // Check if elements exist before proceeding
    if (!monthYearElement || !cells.length) {
        console.error('Calendar elements not found');
        return;
    }
    
    // Update month/year display
    monthYearElement.textContent = `${months[displayDate.getMonth()]} ${displayDate.getFullYear()}`;
    
    // Get first day of the month and calculate grid
    const firstDay = new Date(displayDate.getFullYear(), displayDate.getMonth(), 1);
    const lastDay = new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Fill calendar cells
    cells.forEach((cell, index) => {
        const cellDate = new Date(startDate);
        cellDate.setDate(startDate.getDate() + index);
        
        const dateNumber = cell.querySelector('.date-number');
        const events = cell.querySelector('.events');
        
        dateNumber.textContent = cellDate.getDate();
        cell.dataset.date = cellDate.toISOString().split('T')[0];
        
        // Reset classes
        cell.className = 'calendar-cell';
        
        // Add appropriate classes
        if (cellDate.getMonth() !== displayDate.getMonth()) {
            cell.classList.add('other-month');
        }
        
        if (isSameDay(cellDate, currentDate)) {
            cell.classList.add('today');
        }
        
    });
}

const isSameDay = (date1, date2) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
}

