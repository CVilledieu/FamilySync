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
    const gridClassName = 'calendar-grid';
    const grid = document.createElement('div');
    grid.className = gridClassName;
    var rows = cRows;
    var columns = cColumns;
    for(let r=0; r < rows; r++){
        for(let c=0; c < columns; c++){
            const cell = createCell({row: 'row-' + r, column: 'column-' + c});
            grid.appendChild(cell);
        }
    }

    return grid;
}


const createCell = (options = {}) =>{
    const {
        row, 
        column
    } = options;
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.classList.add(row);
    cell.classList.add(column);
    return cell;
}


function testButtonClick(){
    createButton("Test", testButtonClick);
    console.log("Test button clicked");
}