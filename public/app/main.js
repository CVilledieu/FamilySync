import { createDropdownMenu } from '/static/app/elements.js';


class App {
    constructor() {
        this.appRoot = document.getElementById('root');
        this.init();
    }

    async init(){
        try {
            const names = await fetch('/names').then(res => res.json());
            this.buildHeader(names);
        } catch (error) {
            console.error('Initialization error:', error);
        }
    }

    buildHeader(names){
        const header = document.createElement('header');
        const title = document.createElement('h1');
        title.textContent = 'Member Directory';
        header.appendChild(title);
        const dropdown = createDropdownMenu('Select Member', names);
        header.appendChild(dropdown);
        this.appRoot.appendChild(header);
        
        return header;
    }



}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});

