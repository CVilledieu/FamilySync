import { DropdownMenu } from '/static/app/elements.js';
import { Calendar } from '/static/app/calendar.js';

class App {
    constructor() {
        this.appRoot = document.getElementById('root');
        this.selectedPerson = null;
        this.init();
    }

    // 
    //
    async init() {
        try {
            const names = await fetch('/names').then(res => res.json());
            this.buildHeader(names);
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
            
            const calendar = Calendar();
            this.appRoot.appendChild(calendar);
            
            this.addKeyboardNavigation();
            
        } catch (error) {
            console.error('Error in buildCalendar:', error);
            throw error;
        }
    }
    
    updateCalendarHeader(personName) {
        const title = document.querySelector('header h1');
        if (personName) {
            title.textContent = `${personName}'s Schedule`;
        } else {
            title.textContent = 'FamilySync';
        }
        // Api call for person-specific events
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

