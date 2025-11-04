import { DropdownMenu } from '/util/elements.js';
import { CalendarClass } from '/calendar/cal_class.js';

export class CalendarApp {
    constructor(pageRoot, user, exit) {
        this.pageRoot = pageRoot;
        this.appRoot = document.createElement('div');
        this.appRoot.classList.add('calendar-app');
        
        console.log('CalendarApp initialized. Exit function is\n', exit);
        this.user = user;
        this.calendar = null;
        this.exitFunc = exit;
        this.init();
    }

    init() {
        //Clear existing content
        this.pageRoot.innerHTML = '';

        this.buildCalendar();
        this.buildSidebar(['Alice', 'Bob', 'Charlie']); // Sample names for testing

        this.pageRoot.appendChild(this.appRoot);
    }

    buildSidebar(names){
        const sidebar = document.createElement('aside');
        sidebar.className = 'sidebar';
                                
        const nameDropdown = DropdownMenu('View schedule for:', names);
        nameDropdown.className = 'sidebar-dropdown person-selector';
        const select = nameDropdown.querySelector('select');
        
        select.addEventListener('change', (e) => {
            this.user = e.target.value;
            // Fetch data for selected person
            // const data = await fetch(`/calendar?person=${this.user}`).then(res => res.json());
            // Pass data to loadPersonalCalendar
            this.calendar.loadCalendarData(this.user);
        });            
        sidebar.appendChild(nameDropdown);

        const divider = document.createElement('hr');
        divider.className = 'sidebar-divider';
        sidebar.appendChild(divider);

        const viewDropdown = DropdownMenu('View:', ['Month', 'Week', 'Day']);
        viewDropdown.className = 'sidebar-dropdown view-selector';
        sidebar.appendChild(viewDropdown);

        sidebar.appendChild(divider);

        const exitButton = document.createElement('button');
        exitButton.textContent = 'Exit Calendar';
        exitButton.className = 'sidebar-exit-button';
        exitButton.addEventListener('click', () => {
            this.exitFunc();
        });
        sidebar.appendChild(exitButton);

        this.appRoot.appendChild(sidebar);
    }

    buildCalendar() {
        // Create main content area
        const mainContent = document.createElement('main');
        mainContent.id = 'calendar-container';
        
        this.calendar = new CalendarClass();
        mainContent.appendChild(this.calendar.element);
        this.appRoot.appendChild(mainContent);

    }

    // Loading personal calendar data idea/plan
    // Pull data from server using name/id and current day/month/year
    // Server returns basic event data for 3 months
    //  -Prev, current, and next month
    //  
    loadCalendarData(personName) {}
    
}
