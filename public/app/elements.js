export const DropdownMenu = (Title, Options, id)=> {
    const container = document.createElement('div');
    container.className = 'dropdown';
    container.id = id || Title.toLowerCase().replace(' ', '-') + '-dropdown';
    const form = document.createElement('form');
    const label = document.createElement('label');
    label.textContent = Title;
    form.appendChild(label);
    container.appendChild(form);

    const select = document.createElement('select');
    select.name = Title.toLowerCase().replace(' ', '-');
    form.appendChild(select);
    Options.forEach(optionText => {
        const option = document.createElement('option');
        option.value = optionText;
        option.textContent = optionText;
        select.appendChild(option);
    });

    return container;
}

export const createButton = () => {
    const button = document.createElement('button');
    button.id = id || Text.toLowerCase().replace(' ', '-') + '-button';
    button.textContent = Text;
    return button;
}

export class Button {
    constructor(options={}) {
        const {
            Text = '',
            OnClick = ()=>{},
            className = '',
            id = null
        } = options;
        this.button = document.createElement('button');
        this.button.id = id || Text.toLowerCase().replace(' ', '-') + '-button';
        this.button.textContent = Text;
        this.button.addEventListener('click', OnClick);
    }

    setText(newText) {
        this.button.textContent = newText;
    }
    updatetOnClick(newOnClick) {
        this.button.removeEventListener('click', this.button.onclick);
        this.button.addEventListener('click', newOnClick);
    }
    
}