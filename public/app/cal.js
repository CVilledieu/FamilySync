import {Button} from '/static/app/elements.js';
import {Day} from '/static/app/day.js';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
];


//Calendar object
class CalendarClass {
    constructor(){
        this.element = null;
        this.displayedDate = new Date();
        this.currentDate = new Date();
        this.title = '';
        this.events = [];
        this.days = [];

        this.init();
    }

    init(){
        this.element = document.createElement('div');
        this.element.classList.add('calendar');

        //Builder methods 
        this.buildNavBar();
        this.buildDayHeader();
    }


    //-------------------------
    //      Nav Panel
    //
    static buildNavBar(){
        const nav = document.createElement('div');
        nav.classList.add('calendar-nav');

        const prevBtn = new Button({
            className: 'nav-button',
            id: 'nav-prev',
            innerHtml: '&#8249',
            OnClick: this.updateCalendar('prev'),
        });

        const nextBtn = new Button({
            className: 'nav-button',
            id:'nav-next',
            innerHTML: '&#8250',
            OnClick: this.updateCalendar('next'),

        });

        const monthYear = document.createElement('h2');
        monthYear.classList.add('month-year');

        nav.appendChild(prevBtn.button);
        nav.appendChild(monthYear);
        nav.appendChild(nextBtn.button);

        this.element.appendChild(nav);
    }

    //-------------------------
    //      Day Header
    //
    static buildDayHeader(){
        const header = document.createElement('div');
        header.classList.add('calendar-header');

        daysOfWeek.forEach(day => {
            const div = document.createElement('div');
            div.classList.add('day-header');
            div.textContent = day;
            header.appendChild(div); 
        });
        this.element.appendChild(header);
    }

    //-------------------------
    //      Body
    //
    static createGrid(){
        const grid = document.createElement('div');
        grid.classList.add('calendar-grid');

        for (let i = 0; i < 42; i++){
            const cell = this.createCell();
            grid.appendChild(cell);
        }
    }

    static createCell(){
        const cell = document.createElement('div');
        cell.classList.add('calendar-cell');
        
        const dateNumber = document.createElement('div');
        dateNumber.classList.add('date-number');

        const events = document.createElement('div');
        events.classList('events');

        cell.appendChild(dateNumber);
        cell.appendChild(events);
        
        cell.addEventListener('click', (e)=>{
            const date = e.currentTarget.dataset.date;
            if(!date){
                console.error('onClick event error. Date not found');
            }
        });
        return cell;
    }



}


class Day {
    constructor(){
        // Elements
        this.date = null;
        this.events = null;
        this.element = null;
        this.eventsArray = [];

        this.init();
    }
    
    init(){
        const element = document.createElement('div');
        element.classList.add('cell');

        const dateNumber = document.createElement('div');
        dateNumber.classList.add('cell-date');
        this.date = dateNumber;
        const events = document.createElement('div');
        events.classList.add('cell-events');
        this.events = events;
        element.appendChild(dateNumber);
        element.appendChild(events);
        
        this.element = element;
    }

    update(date, events=[]){
        this.date.textContent = date.getDate();
        this.element.dataset.date = date.toISOString().split('T')[0];
        this.events.innerHTML = '';
        events.forEach(event => {
            const eventDiv = document.createElement('div');
            eventDiv.classList.add('event');
            eventDiv.textContent = event.title;
            this.events.appendChild(eventDiv);
        });
    }

    
}

class Event {
    constructor(){
        this.title = '';
        this.startTime = null;
        this.endTime = null;
        this.description = '';
        this.element = this.createElement();
    }

}