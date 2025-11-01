export const DropdownMenu = (Title, Options, id) => {
    const container = document.createElement('div');
    container.className = 'dropdown';
    container.id = id || Title.toLowerCase().replace(/\s+/g, '-') + '-dropdown';
    
    const label = document.createElement('label');
    label.textContent = Title;
    label.htmlFor = container.id + '-select';
    
    const select = document.createElement('select');
    select.name = Title.toLowerCase().replace(/\s+/g, '-');
    select.id = container.id + '-select';
    
    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select an option...';
    select.appendChild(defaultOption);
    
    Options.forEach(optionText => {
        const option = document.createElement('option');
        option.value = optionText;
        option.textContent = optionText;
        select.appendChild(option);
    });
    
    container.appendChild(label);
    container.appendChild(select);
    
    return container;
}

export class Dropdown{
    constructor(options = {}) {
        const {
            title = '',
            list = [],
            id = null,
            onChange = () => {}
        } = options;
    }

    addToList(item) {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        this.select.appendChild(option);
    }

    removeFromList(item) {
        const options = Array.from(this.select.options);
        const optionToRemove = options.find(opt => opt.value === item);
        if (optionToRemove) {
            this.select.removeChild(optionToRemove);
        }
    }


}


export class Button {
    constructor(options = {}) {
        const {
            Text = '',
            innerHTML = null,
            OnClick = () => {},
            className = '',
            id = ''
        } = options;
        
        this.button = document.createElement('button');
        this.button.id = id;
        this.button.textContent = Text;
        this.button.classList.add(className);
        this.onClickHandler = OnClick;
        this.button.addEventListener('click', this.onClickHandler);
    
        if(innerHTML){
            this.button.innerHTML = innerHTML;
        }
    }

    setText(newText) {
        this.button.textContent = newText;
    }
    
    updateOnClick(newOnClick) {
        this.button.removeEventListener('click', this.onClickHandler);
        this.onClickHandler = newOnClick;
        this.button.addEventListener('click', this.onClickHandler);
    }

}