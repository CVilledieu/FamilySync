import {CalendarApp} from '/calendar/cal_app.js';

export class app {
    constructor(authCtx) {
        this.authCtx = authCtx;
        this.pageCtx = null;
        this.userData = {};
        this.init();
    }
    async init(){
        try {
            await this.getUserData();
        } catch(error){
            console.error('Failed to get userData from server: ', error);
        }

        this.pageCtx = new pageContext;
    }

    async getUserData(){
         try {
            const res = await this.authCtx.sendRequest('/api', 'GET');
            if (res == null || !res.ok) {
                throw new Error(`HTTP error! status: ${res ? res.status : 'No Response'}`);
            }
            const resData = await res.json();
            this.userData = resData;
        } catch (error) {
            console.error('Failed to initialize app context:', error);
        }
        
    }
    
    loadFrame_Home(){
        this.pageCtx.clearFrame();

        const dashboard = document.createElement('div');
        dashboard.classList.add('dashboard');

        const list = getDashboardList(appCtx);
        const fragment = document.createDocumentFragment();
        list.forEach( item =>{
            const div = document.createElement('div');
            div.classList.add('dashboard-item');
            div.textContent = item.name;
            div.onclick = () => item.onClick();

            fragment.appendChild(div);
        });

        dashboard.appendChild(fragment);
        this.frameRoot.appendChild(dashboard);
    }

    getDashboardList(){
        const list = [
            {name: 'Calendar', onClick: this.loadFrame_Calendar()},
            {name: 'Events', onClick: this.loadFrame_Events()},
            {name: 'Settings', onClick: this.loadFrame_Settings()},
            {name: 'Log out', onClick: this.authCtx.logout()}
        ];
        return list;
    }

    loadFrame_Calendar(){
        const newApp = new CalendarApp(this);
    }

    loadFrame_Events(){
        console.log("Events clicked");
    }

    loadFrame_Settings(){
        console.log("Settings clicked");
    }
}

class pageContext {
    constructor(){
        this.mainRoot = document.getElementById('root');
        this.bannerRoot = document.createElement('div');
        this.frameRoot = document.createElement('div');
        this.init();   
    }

    init(){
        this.bannerRoot.classList.add('banner-root');
        this.frameRoot.classList.add('dashboard-root');
        this.mainRoot.appendChild(this.bannerRoot);
        this.mainRoot.appendChild(this.frameRoot);
       
        createBanner();
        loadFrame_Home();
    }

    createBanner(){
        const title = document.createElement('h1');
        title.textContent = 'FamilySync';
        title.className = 'banner-title';

        this.bannerRoot.appendChild(title); 
    }

    //Clears out any content within the dashboard-root
    clearFrame(){
        this.frameRoot.innerHTML = '';
    }
    


}



export class mainApp{
    #adminMode = false; 
    constructor(context) {
        this.appRoot = document.getElementById('root');
        this.bannerRoot = null;
        this.pageRoot = null;
        this.currentApp = null;
        this._authCtx = context;
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
                this.currentApp = new CalendarApp(this.pageRoot, this._authCtx, () => this.pageSelect());
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

                this._authCtx.logout();
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

