import { Home, LogoutWidget } from '/widgets/home.js';
import { CalendarWidget as Calendar } from '/widgets/calendar.js';

export class app {
    constructor(auth){
        this.mainRoot = document.getElementById('root');
        this.bannerRoot = document.createElement('div');
        this.frameRoot = document.createElement('div');
        this.authCtx = auth;
        this.userData = null;
        this.widgetList = [];
        this.homeWidget = null;
        this.#init();   
    }

    #init(){
        this.#buildWidgetList();
        this.#buildHomePage();
    }

    #buildWidgetList(){
        this.widgetList.push(new Calendar(this));
        this.widgetList.push(new LogoutWidget(this));
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

        this.homeWidget = new Home(this);
        this.loadWidget(this.homeWidget);
    }

    //Clears out any content within the dashboard-root
    clearFrame(){
        this.frameRoot.innerHTML = '';
    }

    async loadWidget(widget){
        this.clearFrame();
        try {
            const element = await widget.render();
            if (element != null){
                this.frameRoot.appendChild(element);
            }
            
        }catch (error) {
            console.error('Error loading frame content:', error);
        }
    }

    async returnHome(){
        this.clearFrame();
        this.loadWidget(this.homeWidget);
    }
}
