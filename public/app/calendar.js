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

        this.init();
    }

    init(){
        this.element = document.createElement('div');
        this.element.classList.add('calendar');

        //Builder methods 
        this.#buildNavBar();
        this.#buildDayHeader();
        this.#buildBody();
    }


    //-------------------------
    //      Nav Panel
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
            OnClick: () => this.updateCalendar('Next'),

        });

        const monthYear = document.createElement('h2');
        monthYear.classList.add('month-year');

        nav.appendChild(prevBtn.button);
        nav.appendChild(monthYear);
        nav.appendChild(nextBtn.button);

        this.element.appendChild(nav);
    }

    updateCalendar(setMonthTO){
        switch (setMonthTO){
            case 'prev':
                this.displayedDate.setMonth(this.displayedDate.getMonth() -1);
                break;
            case 'next':
                this.displayedDate.setMonth(this.displayedDate.getMonth() +1);
                break;
            default:
                //Do nothing
        }
    }

    //-------------------------
    //      Day Header
    //
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
    //      Body
    //
    #buildBody(){
        const body = document.createElement('div');
        body.classList.add('calendar-body');

        for (let i = 0; i < MAX_CELLS; i++){
            const newCell = new DayCell();
            this.days.push(newCell);
            body.appendChild(newCell.element);
        }

        this.element.appendChild(body);
    }



}


class DayCell {
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
    constructor(title, startTime, endTime, description=''){
        this.title = title;
        this.startTime = startTime;
        this.endTime = endTime;
        this.description = description;
        this.element = null;

        this.init();
    }

    init(){
        const element = document.createElement('div');
        element.classList.add('event-item');
        this.element = element;
    }

}