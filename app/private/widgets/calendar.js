import { createElement } from "react";

export default class CalendarWidget{
    constructor(app){
        this.appCtx = app;
        this.name = 'Calendar';
        this.element = document.createElement('div');
        this.element.classList.add('widget-calendar');
        this.menuObj = null;
        this.calendarObj = null;
        
    }
    async render(){
        this.buildMenu();
        this.buildCalendar();
        return this.element;
    }

    buildMenu(){
        this.menuObj= new MenuObj(this.appCtx);
        this.element.appendChild(this.menuObj.render());
    }

    buildCalendar(){
        this.calendarObj = new CalendarObj();
        this.element.appendChild(this.calendarObj.render());
    }
}


//At initialization, adds correct components to an array.
//Render() appends them to the menu element.
//This is to be able to dynamically build the menu based on user settings or permissions.
class MenuObj{
    constructor(app){
        this.appCtx = app;
        this.element = document.createElement('div');
        this.element.classList.add('calendar-menu');
        this.components = [];
        this.viewableComponents = ['calendarSelector', 'viewSelector', 'addEvent', 'divider', 'exitWidgetBtn'];
        this.init();
    }
    //Temporarily hardcoded components for the menu.
    init(){
        const exit = this.exitWidgetBtn();
        this.element.appendChild(exit);
    }

    render(){
        return this.element;
    }

    //Updates menu components based on user settings or permissions.
    updateComponents(){}
    
    //Menu Components

    //Changes which calendar is being viewed.
    //Left as a stub for now until multiple calendars are implemented.
    calendarSelector(){}

    //Changes the calendar view (Month, Week, Day)
    viewSelector(){}

    //Adds event to the calendar.
    addEvent(){}


    divider(){
        const div = document.createElement('hr');
        div.classList.add('menu-divider');
        return div;
    }

    exitWidgetBtn(){
        const btn = document.createElement('button');
        btn.textContent = 'Exit Calendar';
        btn.classList.add('exit-calendar-btn');
        btn.addEventListener('click', () => this.appCtx.returnHome());
        return btn;
    }
}



class CalendarObj{
    constructor(){
        this.element = document.createElement('div');
        this.element.classList.add('calendar-obj');
        this.days = [];
        this.focus = null;
        this.currentDate = new Date();
        this.displayedDate = new Date();
        this.navTitle = null;

        this.init();
    }
    init(){
        this.buildNavigationBar();
        this.buildWeekDayHeader();
        this.buildCalendarGrid();
    }
    render(){
        const fragment = document.createDocumentFragment();
        this.days.forEach(day =>{
            //Possibly update with new info
            fragment.appendChild(day);
        });
        this.element.appendChild(fragment);
        return this.element;
    }

    //Contains navigation buttons and displays current month/year   
    //navigation buttons move forward/backward through months
    buildNavigationBar(){
        const nav = document.createElement('div');
        nav.classList.add('calendar-navigation');

        const prevBtn = document.createElement('button');
        prevBtn.classList.add('nav-button');
        prevBtn.innerHTML = '&#8249';
        prevBtn.addEventListener('click',);

        const monthYear = document.createElement('h2');
        monthYear.classList.add('calendar-month-year');
        this.navTitle = monthYear;

        const nextBtn = document.createElement('button');
        nextBtn.classList.add('nav-button');
        nextBtn.innerHTML = '&#8250';
        nextBtn.addEventListener('click',);

        nav.appendChild(prevBtn);
        nav.appendChild(monthYear);
        nav.appendChild(nextBtn);

        this.element.appendChild(nav);
    }

    buildWeekDayHeader(){
        const WeekdayHeader = document.createElement('div');
        WeekdayHeader.classList.add('calendar-weekday-container');
        DAYS.forEach(day => {
            const dayElem = document.createElement('div');
            dayElem.classList.add('calendar-weekday-header');
            dayElem.textContent = day;
            WeekdayHeader.appendChild(dayElem);
        });
        this.element.appendChild(WeekdayHeader);
    }

    buildEmptyDays(){
        for (let i = 0; i < MAX_CELLS; i++){
            const day = dayFactory();
            day.element.addEventListener('click', () => this.focus(i));
            this.days.push(day);
        }
    }

    focus(index){
        this.days[this.focus].classList.remove('focus');
        this.focus = index;
        this.days[this.focus].classList.add('focus');
    }


}

function dayFactory(){
    const container = createElement('div');
    container.classList.add('day-container');

    const dateField = document.createElement('div');
    dateField.classList.add('day-date');

    const events = document.createElement('div');
    events.classList.add('day-event');

    container.appendChild(dateField);
    container.appendChild(events);

    const dayObj = {
        element: container,
        date: dateField,
        events: events,
    };
    return dayObj;
}


const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
];
const MAX_CELLS = 42; // 6 weeks
