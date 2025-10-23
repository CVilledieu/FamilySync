class SyncApp {
    constructor() {
        this.appRoot = document.getElementById('root');
        this.init();
    }

    async init(){
        try {
            const members = await fetch('/members');
            this.renderMembers(members);
        } catch (error) {
            console.error('Initialization error:', error);
        }
    }

    render
}