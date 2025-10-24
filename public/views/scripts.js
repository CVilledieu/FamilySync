class App {
    constructor() {
        this.appRoot = document.getElementById('root');
        this.init();
    }

    async init(){
        try {
            const members = await fetch('/member').then(res => res.json());
            this.renderMembers(members);
        } catch (error) {
            console.error('Initialization error:', error);
        }
    }

    renderMembers(members) {
        this.appRoot.innerHTML = '';
        const div = document.createElement('div');
        selectionDiv.id = 'member-selection';

        const selectionForm = document.createElement('form');
        const title = document.createElement('lebel');
        title.textContent = 'Family Members';
        selectionForm.appendChild(title);

        const dropDown = this.createMemberSelector(members);

        selectionForm.appendChild(dropDown);
        div.appendChild(selectionForm);

    }

    createMemberSelector(members) {
        const select = document.createElement('select');
        members.forEach(member => {
            const option = document.createElement('option');
            option.value = member.name;
            option.textContent = member.name;
            select.appendChild(option);
        });
        return select;
    }

}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});
