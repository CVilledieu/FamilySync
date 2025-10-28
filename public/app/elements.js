export const createDropdownMenu = (Title, Options)=> {
    const container = document.createElement('div');
    container.className = 'dropdown';

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


