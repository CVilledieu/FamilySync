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
            // For now, we'll skip the API call and just build the calendar
            // You can uncomment this when your API is ready:
            // const names = await fetch('/names').then(res => res.json());
            // this.buildHeader(names);
            
            this.buildHeader(['Alice', 'Bob', 'Charlie']); // Sample names for testing
            this.buildCalendar();
        } catch (error) {
            console.error('Initialization error:', error);
            //Error handling plan/options:
            // Display a user-friendly message
            // Possibly retry fetching
            // Display empty calendar or cached data
        }

    }

    buildHeader(names){
        try{
            const header = document.createElement('header');
            const title = document.createElement('h1');
            title.textContent = 'FamilySync';
            header.appendChild(title);
            
            const dropdown = DropdownMenu('View schedule for:', names);
            const select = dropdown.querySelector('select');
            
            select.addEventListener('change', (e) => {
                this.selectedPerson = e.target.value;
                this.updateCalendarForPerson(this.selectedPerson);
            });
            
            header.appendChild(dropdown);
            this.appRoot.appendChild(header);
        } catch (error){
            console.error('Error building header:', error);
            throw error;
        }

    }

    buildCalendar() {
        try {
            
            this.calendar = new CalendarClass();
            this.appRoot.appendChild(this.calendar.element);
            
            this.addKeyboardNavigation();
            this.addDateSelectionListener();
            
        } catch (error) {
            console.error('Error in buildCalendar:', error);
            throw error;
        }
    }
    
    addDateSelectionListener() {
        document.addEventListener('dateSelected', (e) => {
            const { date, events } = e.detail;
            console.log(`Selected date: ${date}`, events);
            // Here you can add logic to handle date selection
            // For example, open a modal, update a sidebar, etc.
        });
    }
    
    updateCalendarForPerson(personName) {
        this.updateCalendarHeader(personName);
        // Here you would make an API call to get person-specific events
        // For now, we'll just update the header
    }
    
    updateCalendarHeader(personName) {
        const title = document.querySelector('header h1');
        if (personName) {
            title.textContent = `${personName}'s Schedule`;
        } else {
            title.textContent = 'FamilySync';
        }
        // Api call for person-specific events would go here
    }
    
    addKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            const navButtons = document.querySelectorAll('.nav-button');
            
            switch(e.key) {
                case 'ArrowLeft':
                    if (e.ctrlKey && navButtons[0]) {
                        navButtons[0].click(); // Previous month
                        e.preventDefault();
                    }
                    break;
                case 'ArrowRight':
                    if (e.ctrlKey && navButtons[1]) {
                        navButtons[1].click(); // Next month
                        e.preventDefault();
                    }
                    break;
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});

