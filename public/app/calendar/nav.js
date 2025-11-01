import {Button} from '/static/app/elements.js';

export const Nav = () => {
    this.element = document.createElement('div');
    this.prevBtn = null;
    this.nextBtn = null;
    this.displayDate = null;

    const prevButton = document.createElement('button');
    prevButton.className = 'nav-button';
    prevButton.innerHTML = '&#8249;';
    prevButton.addEventListener('click', () => {
        this.displayDate.setMonth(displayDate.getMonth() - 1);
        updateCalendar();
    });

    const nextButton = document.createElement('button');
    nextButton.className = 'nav-button';
    nextButton.innerHTML = '&#8250;';
    nextButton.addEventListener('click', () => {
        displayDate.setMonth(displayDate.getMonth() + 1);
        updateCalendar();
    });


    this.element.classList.add('calendar-nav');
    this.monthYear = document.createElement('h2');
    monthYear.classList.add('month-year');

    this.element.appendChild(this.prevBtn.button);
    this.element.appendChild(this.monthYear);
    this.element.appendChild(this.nextBtn.button);
}
