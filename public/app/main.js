import { DropdownMenu} from '/static/app/elements.js';
import { Calendar } from '/static/app/calendar.js';

class App {
    constructor() {
        this.appRoot = document.getElementById('root');
        this.init();
    }

    async init(){
        try {
            const names = await fetch('/names').then(res => res.json());
            this.buildIndex(names);
        } catch (error) {
            console.error('Initialization error:', error);
        }
    }

    buildIndex(names){
        const header = document.createElement('header');
        const title = document.createElement('h1');
        
        title.textContent = 'Family Sync';
        header.appendChild(title);
        
        const dropdown = DropdownMenu('View schedule for ', names);
        header.appendChild(dropdown);

        this.appRoot.appendChild(header);

        const calendar = Calendar();
        this.appRoot.appendChild(calendar);
    }

}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});

