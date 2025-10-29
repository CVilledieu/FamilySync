import { createButton } from '/static/app/elements.js';

// Calendar components and logic
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
];
const cRows = 5;
const cColumns = 7;

export const Calendar =()=> {
    const container = document.createElement('div');
    container.className = 'calendar';
    const grid = createGrid();
    container.appendChild(grid); 
    return container;

}


const createGrid =()=> {
    const grid = document.createElement('div');
    grid.className = 'calendar-grid';

    var rows = cRows;
    var columns = cColumns;
    
    for(let r=0; r < rows; r++){

        const row = document.createElement('div');
        row.classList.add('row');
        row.id = 'row-' + r;

        for(let c=0; c < columns; c++){
            const cell = createCell();
            row.appendChild(cell);
        }

        grid.appendChild(row);
    }

    return grid;
}


const createCell = () =>{
    const cell = document.createElement('div');
    cell.classList.add('cell');
    return cell;
}


function testButtonClick(){
    createButton("Test", testButtonClick);
    console.log("Test button clicked");
}