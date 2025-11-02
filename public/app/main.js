import { DropdownMenu } from '/static/app/elements.js';
import { CalendarClass } from '/static/app/calendar.js';

class App {
    constructor() {
        this.appRoot = document.getElementById('root');
        this.selectedPerson = null;
        this.calendar = null;
        this.init();
    }

    // 
    //
    async init() {
        try {
            // const names = await fetch('/names').then(res => res.json());
            // this.buildHeader(names);
            this.buildSidebar(['Alice', 'Bob', 'Charlie']); // Sample names for testing
            this.buildCalendar();
            
        } catch (error) {
            console.error('Initialization error:', error);
            //Error handling plan/options:
            // Display a user-friendly message
            // Possibly retry fetching
            // Display empty calendar or cached data
        }

    }

    buildSidebar(names){
        try{
            const sidebar = document.createElement('aside');
            sidebar.className = 'sidebar';
            
            const title = document.createElement('h1');
            title.textContent = 'FamilySync';
            title.className = 'sidebar-title';
            sidebar.appendChild(title);

            const divider = document.createElement('hr');
            divider.className = 'sidebar-divider';
            sidebar.appendChild(divider);
            
            const nameDropdown = DropdownMenu('View schedule for:', names);
            nameDropdown.className = 'sidebar-dropdown person-selector';
            const select = nameDropdown.querySelector('select');
            
            select.addEventListener('change', (e) => {
                this.selectedPerson = e.target.value;
                // Fetch data for selected person
                // const data = await fetch(`/calendar?person=${this.selectedPerson}`).then(res => res.json());
                // Pass data to loadPersonalCalendar
                this.calendar.loadPersonalCalendar(this.selectedPerson);
            });            
            sidebar.appendChild(nameDropdown);

            const viewDropdown = DropdownMenu('View:', ['Calendar', 'Events']);
            viewDropdown.className = 'sidebar-dropdown view-selector';
            sidebar.appendChild(viewDropdown);

            this.appRoot.appendChild(sidebar);
        } catch (error){
            console.error('Error building sidebar:', error);
            throw error;
        }

    }

    buildCalendar() {
        try {
            // Create main content area
            const mainContent = document.createElement('main');
            mainContent.className = 'main-content';
            mainContent.id = 'calendar-container';
            
            this.calendar = new CalendarClass();
            mainContent.appendChild(this.calendar.element);
            this.appRoot.appendChild(mainContent);
            
        } catch (error) {
            console.error('Error in buildCalendar:', error);
            throw error;
        }
    }
    
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});

