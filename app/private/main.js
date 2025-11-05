import { Home } from '/widgets/home.js';
import { CalendarWidget as Calendar } from '/widgets/calendar.js';

export class app {
    constructor(auth){
        this.mainRoot = document.getElementById('root');
        this.bannerRoot = document.createElement('div');
        this.frameRoot = document.createElement('div');
        this.authCtx = auth;
        this.userData = null;
        this.widgetList = [];

        this.#init();   
    }

    #init(){
        this.#loadWidgetList();
        this.#buildHomePage();
        this.loadFrame();
    }

    #loadWidgetList(){
        this.widgetList.push(new Home(this));
        this.widgetList.push(new Calendar(this));
        //Future: Load additional widgets dynamically
    }

    #buildHomePage(){
        this.bannerRoot.classList.add('banner-root');
        const bannerTItle = document.createElement('h1');
        bannerTItle.textContent = 'FamilySync';
        bannerTItle.classList.add('banner-title');
        this.bannerRoot.appendChild(bannerTItle);
        this.mainRoot.appendChild(this.bannerRoot);
        
        this.frameRoot.classList.add('frame-root');
        this.mainRoot.appendChild(this.frameRoot);
    }

    //Clears out any content within the dashboard-root
    clearFrame(){
        this.frameRoot.innerHTML = '';
    }

    async loadWidget(widget){
        this.clearFrame();
        try {
            this.frameRoot.appendChild(await widget.render());
        }catch (error) {
            console.error('Error loading frame content:', error);
        }
    }

    async returnHome(){
        this.clearFrame();
        const homeWidget = this.widgetList.find(w => w.Name === 'Home');
        if (homeWidget) {
            this.frameRoot.appendChild(await homeWidget.render());
        }
    }
}
