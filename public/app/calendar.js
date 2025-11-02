import {Button} from '/static/app/elements.js';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
];
const MAX_CELLS = 42; // 6 weeks


//Calendar object
export class CalendarClass {
    constructor(){
        this.element = null;
        this.displayedDate = new Date();
        this.currentDate = new Date();
        this.title = '';
        this.events = [];
        this.days = [];
        this.selectedCell = null;

        this.init();
    }

    init(){
        this.element = document.createElement('div');
        this.element.classList.add('calendar');

        //Builder methods 
        this.#buildNavBar();
        this.#buildDayHeader();
        this.#buildBody();
        this.#populateCalendar();
    }

    //-------------------------
    //     Private Methods


    // NavBar contents:
    //  - Month/Year display/title
    //  - Prev/Next buttons
    //
    #buildNavBar(){
        const nav = document.createElement('div');
        nav.classList.add('calendar-nav');

        const prevBtn = new Button({
            className: 'nav-button',
            id: 'nav-prev',
            innerHTML: '&#8249',
            OnClick: () => this.updateCalendar('prev'),
        });

        const nextBtn = new Button({
            className: 'nav-button',
            id:'nav-next',
            innerHTML: '&#8250',
            OnClick: () => this.updateCalendar('next'),

        });

        const monthYear = document.createElement('h2');
        monthYear.classList.add('month-year');
        this.monthYearElement = monthYear;

        nav.appendChild(prevBtn.button);
        nav.appendChild(monthYear);
        nav.appendChild(nextBtn.button);

        this.element.appendChild(nav);
    }

    updateCalendar(setMonthTO){
        switch (setMonthTO){
            case 'prev':
                this.displayedDate.setMonth(this.displayedDate.getMonth() - 1);
                break;
            case 'next':
                this.displayedDate.setMonth(this.displayedDate.getMonth() + 1);
                break;
            default:
                //Do nothing
        }
        this.#populateCalendar();
    }

    // DayHeader contents:
    // - Days of the week
    #buildDayHeader(){
        const header = document.createElement('div');
        header.classList.add('calendar-header');

        DAYS.forEach(day => {
            const div = document.createElement('div');
            div.classList.add('day-header');
            div.textContent = day;
            header.appendChild(div); 
        });
        this.element.appendChild(header);
    }

    //-------------------------
    //      Calendar Body
    //
    #buildBody(){
        const body = document.createElement('div');
        body.classList.add('calendar-body');

        for (let i = 0; i < MAX_CELLS; i++){
            const newCell = new DayCell(this); // Pass calendar reference
            this.days.push(newCell);
            body.appendChild(newCell.element);
        }

        this.element.appendChild(body);
    }
    
    #populateCalendar(){
        // Update month/year display
        this.monthYearElement.textContent = `${MONTHS[this.displayedDate.getMonth()]} ${this.displayedDate.getFullYear()}`;
        
        // Get first day of month and number of days
        const firstDay = new Date(this.displayedDate.getFullYear(), this.displayedDate.getMonth(), 1);
        const lastDay = new Date(this.displayedDate.getFullYear(), this.displayedDate.getMonth() + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday of first week
        
        // Populate each cell
        for (let i = 0; i < MAX_CELLS; i++) {
            const cellDate = new Date(startDate);
            cellDate.setDate(startDate.getDate() + i);
            
            // Get events for this date
            const dateStr = cellDate.toISOString().split('T')[0];
            const dayEvents = this.events.filter(event => {
                const eventDate = new Date(event.date || event.startTime);
                return eventDate.toISOString().split('T')[0] === dateStr;
            });
            
            const cell = this.days[i];
            cell.update(cellDate, dayEvents);
            
            // Add styling classes
            cell.element.classList.remove('other-month', 'today');
            
            if (cellDate.getMonth() !== this.displayedDate.getMonth()) {
                cell.element.classList.add('other-month');
            }
            
            if (this.#isSameDay(cellDate, this.currentDate)) {
                cell.element.classList.add('today');
            }
        }
    }

    #isSameDay(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    }


    //-------------------------
    //     Public Methods

    updateEvents(events) {
        this.events = events;
        this.#populateCalendar();
    }

    //Method to remove currently selected cell highlight and set new one
    onDayFocus(cell) {
        if (this.selectedCell) {
            this.selectedCell.element.classList.remove('focused');
        }
        this.selectedCell = cell;  
             
    }

}


class DayCell {
    constructor(calendar = null){

        this.date = null;
        this.events = null;
        this.element = null;
        this.eventsArray = [];
        this.calendar = calendar; // Store calendar reference

        this.init();
    }
    
    init(){
        const element = document.createElement('div');
        element.classList.add('calendar-cell');
        
        const dateNumber = document.createElement('div');
        dateNumber.classList.add('date-number');
        this.date = dateNumber;

        const events = document.createElement('div');
        events.classList.add('events');
        this.events = events;

        element.appendChild(dateNumber);
        element.appendChild(events);    

        // Add click event listener
        element.addEventListener('click', () => {
            this.focus();
        });

        this.element = element;
    }

    focus() {     
        this.calendar.onDaySelected(this);        
        this.element.classList.add('focused');
    }

    update(date, events=[]){
        this.date.textContent = date.getDate();
        this.element.dataset.date = date.toISOString().split('T')[0];
        this.events.innerHTML = '';
        this.eventsArray = events;
        
        events.forEach(event => {
            const eventDiv = document.createElement('div');
            eventDiv.classList.add('event');
            eventDiv.textContent = event.title;
            eventDiv.title = event.description || event.title; // Tooltip
            this.events.appendChild(eventDiv);
        });
    }

    
}

class Event {
    //By limiting event creation to date and title only, 
    //We can implement all day events easily and then add time and description later
    //Side note: This may make recurring events or multi-day events eaiser to implement later as well
    constructor(options = {}) {
        const {
            month = null,
            day = null,
            year = null,
            title = '',
        } = options;

        this.title = title;
        this.month = month;
        this.day = day;
        this.year = year;

        this.startTime = null;
        this.endTime = null;
        this.description = '';
        this.element = null;

        this.init();
    }

    init(){
        const element = document.createElement('div');
        element.classList.add('event-item');
        this.element = element;
    }

}