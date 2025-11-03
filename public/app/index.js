import {CalendarApp} from '/app/calendar/cal_app.js';
import {loginPage} from '/app/util/login.js';


export class index{
    #adminMode = false; 
    constructor(user) {
        this.appRoot = document.getElementById('root');
        this.bannerRoot = null;
        this.pageRoot = null;
        this.user = user;
        this.currentApp = null;
        this.init();
    }

    init(){
        //Possibly check user for admin mode
        //fetch user data here and set this.user accordingly
        this.bannerRoot = document.createElement('div');
        this.bannerRoot.classList.add('page-banner');
        this.appRoot.appendChild(this.bannerRoot);
        this.banner();

        this.pageRoot = document.createElement('div');
        this.pageRoot.classList.add('app-root');
        this.appRoot.appendChild(this.pageRoot);
        this.pageSelect();
        
    }

    //Content Note: at the moment banner only has title, but an exit button may be added later. Exit button would close out of current app and rebuild to pageSelect screen
    banner(){      
        const title = document.createElement('h1');
        title.textContent = 'FamilySync';
        title.className = 'banner-title';
        this.bannerRoot.appendChild(title);        
    }

    // Content Note: If other universal components are needed, add here. appSelection is being treated as separate app component
    // Function Note: called to rebuild pageSelect screen when exiting an app
    // At the moment each app is responsible for how to implement the exit function, but may change later
    pageSelect(){
        this.pageRoot.innerHTML = '';
        const apps = [
            new appTile('Calendar', () => {
                this.currentApp = new CalendarApp(this.pageRoot, this.user, () => this.pageSelect());
            }),
            new appTile('Events', () => {
                console.log('Events app launched');
            }),
            new appTile('Settings', () => {
                console.log('Settings app launched');
            }),
            new appTile('Logout', () => {
                console.log('Logging out');
                //Temp logout process
                //Future: clear session, tokens, etc.
                //Future will be processed by loginPage class
                this.appRoot.innerHTML = '';
                new loginPage(); 
            })  
        ];
        const appSelect = this.#appSelection(apps);
        this.pageRoot.appendChild(appSelect);
    }

    #appSelection(apps = [appInfo]){
        const tilesContainer = document.createElement('div');
        tilesContainer.classList.add('app-tiles-container');

        //Using fragment to minimize reflows/repaints
        const fragment = document.createDocumentFragment();
        apps.forEach(info => {
            const appTile = document.createElement('div');
            appTile.classList.add('app-tile');
            appTile.textContent = info.name;
            appTile.onclick = () => info.launcher();
            fragment.appendChild(appTile);
        });

        tilesContainer.appendChild(fragment);
        return tilesContainer;
    }


}


class appTile{
    constructor(name, launcher, exit){
        this.name = name;
        this.launcher = launcher;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new loginPage;
});