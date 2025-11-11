import { HomeWidget } from "./app/home.js";
import { CalendarWidget } from "./widgets/calendar.js";
import {AuthWidget} from "./widgets/auth.js"

let Widgets = {
    Home:     null,
    Calendar: null,
    Auth:     null,
};

//Main/init entry point for website
class app{
    constructor(){
        this.FrameRoot = document.createElement('div');
        this.WidgetList = [];
        this.HomeWidget = null;
        this.AuthWidget = null;
        this.user = null;

        this.#init();
    }
    #init(){
        const root = document.getElementById('root');
        root.appendChild(buildBanner());
        this.FrameRoot = buildFrame();
        root.appendChild(this.FrameRoot);

        Widgets.Auth = new AuthWidget(this);
        Widgets.Home = new HomeWidget(this);
        if (this.user){
            this.loadWidgetList();
            this.loadWidget(Widgets.Home);
        } else {
            this.loadWidget(Widgets.Auth);
        }
    }


    //Used to remove any currently displayed Widgets
    clearFrame(){
        this.FrameRoot.innerHTML = '';
    }

    async loadWidget(Widget){
        this.clearFrame();
        try {
            const element = await Widget.Render();
            this.FrameRoot.appendChild(element);
        }catch(error){
            console.error("Error loading widget:", error);
        }
    }

    async loadWidgetList(){
        this.WidgetList.push(new CalendarWidget(this));
        this.WidgetList.push(this.AuthWidget);
    }


    ReturnHome(){
        this.loadWidget(this.HomeWidget);
    }
}

const buildBanner = ()=>{
    const BannerRoot = document.createElement('div');
    BannerRoot.classList.add('banner-root');
    const Logo = document.createElement('h1');
    Logo.textContent = "FamilySync";
    BannerRoot.appendChild(Logo);
    return BannerRoot; 
}

const buildFrame = ()=>{
    const FrameRoot = document.createElement('div');
    FrameRoot.classList.add('frame-root');
    return FrameRoot;
}



document.addEventListener('DOMContentLoaded', () => {
    new app;
});
