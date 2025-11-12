import { HomeWidget } from "./widgets/home.js";
import { CalendarWidget } from "./widgets/calendar.js";
import {AuthWidget} from "./widgets/auth.js"

let G_WidgetsList = {
    Home:     null,
    Calendar: null,
    Auth:     null,
};

window.G_WidgetsList = G_WidgetsList;
//Main/init entry point for website
class app{
    constructor(){
        this.FrameRoot = document.createElement('div');
        this.user = {};
        this.family = {};
        this.events = [];

        this.#init();
    }
    #init(){
        const root = document.getElementById('root');
        root.appendChild(buildBanner());
        this.FrameRoot = buildFrame();
        root.appendChild(this.FrameRoot);

        initGlobalList(this);
        this.loadWidget(G_WidgetsList.Auth);
        // if (this.user){
        //     this.loadWidget(G_WidgetsList.Home);
        // } else {
        //     this.loadWidget(G_WidgetsList.Auth);
        // }
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

    //Simple function that can be passed to any widget it and allow it to create a method for exiting itself
    ReturnHome(){
        this.loadWidget(G_WidgetsList.Home);
    }

    async Login(userData){
        // Store user data from login
        this.user = userData.user || {};
        
        // Fetch additional data (events and family)
        await this.FetchEventsAndFamily();
        
        this.ReturnHome();
    }

    async FetchEventsAndFamily(){
        try {
            if (!this.user || !this.user.id) {
                console.error('No user data available for fetching events and family');
                return;
            }

            // Fetch events for the user
            const eventsResponse = await fetch(`/events/user/${this.user.id}`);
            if (eventsResponse.ok) {
                const eventsData = await eventsResponse.json();
                this.events = eventsData.Events || [];
                console.log('Events fetched:', this.events);
            } else {
                console.error('Failed to fetch events');
                this.events = [];
            }

            // If the user has a family_id, fetch family data
            if (this.user.family_id) {
                const familyResponse = await fetch(`/base/${this.user.id}`);
                if (familyResponse.ok) {
                    const familyData = await familyResponse.json();
                    this.family = familyData.family || {};
                    // Update events from base data if available
                    if (familyData.events) {
                        this.events = familyData.events;
                    }
                    console.log('Family data fetched:', this.family);
                } else {
                    console.error('Failed to fetch family data');
                    this.family = {};
                }
            }
        } catch (error) {
            console.error('Error fetching events and family data:', error);
            this.events = [];
            this.family = {};
        }
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

const initGlobalList = (app)=>{
    G_WidgetsList.Auth = new AuthWidget(app);
    G_WidgetsList.Home = new HomeWidget(app);
    G_WidgetsList.Calendar = new CalendarWidget(app);
}


document.addEventListener('DOMContentLoaded', () => {
    new app;
});
