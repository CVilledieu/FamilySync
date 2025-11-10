export class CalendarWidget{
    constructor(App){
        this.AppCtx = App;
        this.Name = 'Calendar';
        this.element = document.createElement('div');
        this.element.classList.add('widget-calendar');

        this.menuObj = null;
        this.calendarObj = null;

        this.State = null;

        this.init();
    }
    init(){
        this.State = new stateCtx(this.AppCtx);
        this.buildMenu();
        this.buildCalendarObj();
        // Initialize the calendar with current date
        this.State.updateCalendarDays();
    }

    async Render(){
        const menu = this.menuObj.render();
        this.element.appendChild(menu);
        const calendar = this.calendarObj.render();
        this.element.appendChild(calendar);
        return this.element;
    }

    buildMenu(){
        this.menuObj= new MenuObj(this.State);
        this.element.appendChild(this.menuObj.render());
    }

    
    buildCalendarObj(){
        this.calendarObj = new CalendarObj(this.State);
        this.element.appendChild(this.calendarObj.render());
    }

}

class stateCtx {
    constructor(AppCtx){
        this.Today = new Date();
        this.DisplayedDate = new Date();
        this.MonthYearTitle = null;
        this.focus = null;
        this.days = [];
        this.ActiveMenuComponents = [];
        this.ExitFunc = ()=> {AppCtx.returnHome()};
        
        // Initialize the month/year title
        this.updateMonthYearTitle();
    }
    
    updateMonthYearTitle(){
        const month = MONTHS[this.DisplayedDate.getMonth()];
        const year = this.DisplayedDate.getFullYear();
        const titleText = `${month} ${year}`;
        
        if (this.MonthYearTitle) {
            this.MonthYearTitle.textContent = titleText;
        }
        
        return titleText;
    }
    
    navigateMonth(direction) {
        // direction: 1 for next month, -1 for previous month
        const currentMonth = this.DisplayedDate.getMonth();
        const currentYear = this.DisplayedDate.getFullYear();
        
        this.DisplayedDate = new Date(currentYear, currentMonth + direction, 1);
        this.updateMonthYearTitle();
        this.updateCalendarDays();
    }
    
    updateCalendarDays(direction = null){
        // If direction is provided, navigate first
        if (direction !== null) {
            this.navigateMonth(direction);
            return;
        }
        
        const year = this.DisplayedDate.getFullYear();
        const month = this.DisplayedDate.getMonth();
        
        // First day of the month
        const firstDay = new Date(year, month, 1);
        // Last day of the month
        const lastDay = new Date(year, month + 1, 0);
        
        // Starting day of the week (0 = Sunday)
        const startDayOfWeek = firstDay.getDay();
        
        // Clear existing day contents
        this.days.forEach(day => {
            day.date.textContent = '';
            day.list.innerHTML = '';
            day.element.classList.remove('current-month', 'other-month', 'today');
        });
        
        // Calculate dates for previous month's trailing days
        const prevMonth = new Date(year, month, 0);
        const prevMonthLastDate = prevMonth.getDate();
        
        let dayIndex = 0;
        
        // Fill in previous month's trailing days
        for (let i = startDayOfWeek - 1; i >= 0; i--) {
            const date = prevMonthLastDate - i;
            this.days[dayIndex].date.textContent = date;
            this.days[dayIndex].element.classList.add('other-month');
            dayIndex++;
        }
        
        // Fill in current month's days
        for (let date = 1; date <= lastDay.getDate(); date++) {
            this.days[dayIndex].date.textContent = date;
            this.days[dayIndex].element.classList.add('current-month');
            
            // Check if this is today
            const currentDate = new Date(year, month, date);
            if (this.isSameDay(currentDate, this.Today)) {
                this.days[dayIndex].element.classList.add('today');
            }
            
            dayIndex++;
        }
        
        // Fill in next month's leading days
        let nextMonthDate = 1;
        while (dayIndex < MAX_CELLS) {
            this.days[dayIndex].date.textContent = nextMonthDate;
            this.days[dayIndex].element.classList.add('other-month');
            nextMonthDate++;
            dayIndex++;
        }
    }
    
    isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }
}

class MenuObj{
    constructor(State){
        this.State = State;
        this.element = document.createElement('div');
        this.element.classList.add('calendar-menu');
        this.Components = [];
        this.init();
    }

    //Components will contain an initialized version
    //Render will be updated to read from a different array that will be dynamically updated by the state
    init(){
        this.Components.push(this.dateTitle());
        this.Components.push(this.navBtns());
        this.Components.push(this.exitWidgetBtn());
    }

    render(){
        this.element.innerHTML = '';
        const fragment = document.createDocumentFragment();
        this.Components.forEach(item =>{
            fragment.appendChild(item);
        });
        this.element.appendChild(fragment);
        return this.element;
    }

    dateTitle(){
        const titleContainer = document.createElement('div');
        titleContainer.classList.add('menu-date-container');

        const dateHeader = document.createElement('h2');
        dateHeader.classList.add('menu-date-header');
        
        // Set the title from state and store reference
        this.State.MonthYearTitle = dateHeader;
        dateHeader.textContent = this.State.updateMonthYearTitle();

        titleContainer.appendChild(dateHeader);
        return titleContainer;
    }

    navBtns(){
        const navContainer = document.createElement('div');
        navContainer.classList.add('menu-nav-container');
        
        const prevBtn = document.createElement('button');
        prevBtn.classList.add('nav-button');
        prevBtn.innerHTML = '&#8249';
        prevBtn.addEventListener('click', () => {
            this.State.updateCalendarDays(-1);
        });

        const nextBtn = document.createElement('button');
        nextBtn.classList.add('nav-button');
        nextBtn.innerHTML = '&#8250';
        nextBtn.addEventListener('click', () => {
            this.State.updateCalendarDays(1);
        });

        navContainer.appendChild(prevBtn);
        navContainer.appendChild(nextBtn);
        return navContainer;
    }

    divider(){
        const div = document.createElement('hr');
        div.classList.add('menu-divider');
        return div;
    }

    exitWidgetBtn(){
        const btn = document.createElement('button');
        btn.textContent = 'Exit Calendar';
        btn.classList.add('exit-calendar-btn');
        btn.addEventListener('click', this.State.ExitFunc);
        return btn;
    }
}



class CalendarObj{
    constructor(State){
        this.element = document.createElement('div');
        this.element.classList.add('calendar-obj');
        this.calendarBody = null;
        this.State = State;
        this.init();
    }

    init(){
        this.buildWeekDayHeader();
        this.buildCalendarBody()
    }
    render(){
        this.calendarBody.innerHTML = '';
        const fragment = document.createDocumentFragment();
        this.State.days.forEach(day =>{
            //Possibly update with new info
            fragment.appendChild(day.element);
        });
        this.calendarBody.appendChild(fragment);
        return this.element;
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

    buildCalendarBody(){
        this.calendarBody = document.createElement('div');
        this.calendarBody.classList.add('calendar-body');
        this.element.appendChild(this.calendarBody);

        for (let i = 0; i < MAX_CELLS; i++){
            const day = new Day;
            this.State.days.push(day);
        }
    }
}

class Day {
    constructor(){
        this.element = document.createElement('div');
        this.element.classList.add('day-container');
        this.date = null;
        this.list = null;
        this.init();
    }
    init(){
        const dateField = document.createElement('div');
        dateField.classList.add('day-date');
        this.date = dateField;
        const list = document.createElement('div');
        list.classList.add('day-list');
        this.list = list;
        this.element.appendChild(dateField);
        this.element.appendChild(list);
    }
    setDate(date){
        this.date.textContent = date;
    }
    setEvents(list){
        list.forEach(item =>{
            const div = document.createElement('div');
            div.classList.add('day-list-event');
            div.textContent = item;
            this.list.appendChild(div);
        });
    }

}


const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
];
const MAX_CELLS = 42; // 6 weeks
