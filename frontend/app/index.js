//Main/init entry point for website
class app{
    constructor(){
        this.FrameRoot = document.createElement('div');
        this.WidgetList = [];
        this.HomeWidget = null;
        this.logout = null;
        this._server = null;
        this.user = null;

        this.#init();
    }
    #init(){
        this.#constructSite();
        this._server = new Server();
        this.tokenCheck = false; //Temp forced failure
        this.logout = new LogoutWidget(this)
        if (this.tokenCheck) {

        } else {
            this.loadWidget(this.logout);
        }
    }

    async #constructSite(){
        const root = document.getElementById('root');

        const BannerRoot = document.createElement('div');
        BannerRoot.classList.add('banner-root');
        const Logo = document.createElement('h1');
        Logo.textContent = "FamilySync";
        BannerRoot.appendChild(Logo);
        root.appendChild(BannerRoot);

        this.FrameRoot = document.createElement('div');
        this.FrameRoot.classList.add('frame-root');
        root.appendChild(this.FrameRoot);
    }

    clearFrame(){
        this.FrameRoot.innerHTML = '';
    }

    getAuthToken(){
        return this._server ? this._server.token : null;
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

    //Later should be able to send a json response from the server containing app paths and number of apps
    async buildApp(responseData){
        this.WidgetList = [];
        this.user = responseData;
        const { HomeWidget } = await import(`/app/home.js`);
        this.HomeWidget = new HomeWidget(this);
        const { CalendarWidget} = await import(`/app/calendar.js`);
        this.WidgetList.push(new CalendarWidget(this));
        this.WidgetList.push(this.logout);
        this.returnHome();
    }


    returnHome(){
        this.loadWidget(this.HomeWidget);
    }
}

export class LogoutWidget {
    constructor(app){
        this.Name = "Logout";
        this.element = document.createElement('div');
        this.app = app;
        this.#init();
    }
    #init(){
        this.element.classList.add('widget-login');        
        const prompt = this.createPrompt();
        
        this.element.appendChild(prompt);
    }

    async Render(){
        return this.element;
    }

    createPrompt(){
        const prompt = document.createElement('div');
        prompt.classList.add('login-prompt');

        const usernameGroup = document.createElement('div');
        usernameGroup.style.width = '100%'; 
        
        const usernameInput = document.createElement('input');
        usernameInput.type = 'text';
        usernameInput.id = 'username';
        usernameInput.placeholder = 'Enter your username';

        usernameGroup.appendChild(usernameInput);
        prompt.appendChild(usernameGroup);

        const passwordGroup = document.createElement('div');
        passwordGroup.style.width = '100%'; 
                
        const passwordInput = document.createElement('input');
        passwordInput.type = 'password';
        passwordInput.id = 'password';
        passwordInput.placeholder = 'Enter your password';
        
        passwordGroup.appendChild(passwordInput);
        prompt.appendChild(passwordGroup);

        const loginButton = document.createElement('button');
        loginButton.classList.add('login-button');
        loginButton.textContent = 'Login';
        loginButton.addEventListener('click', async () => await this.login({
            username: usernameInput.value, 
            password: passwordInput.value
        }));
        prompt.appendChild(loginButton);

        return prompt;
    }

    async login(params){
        const param = new URLSearchParams(params);
        const address = '/login';
        try {
            const fetchUrl = `${address}?${param}`;
            const res = await fetch(fetchUrl);
            
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await res.json();
            
            if (data.status === 'success') {
                // Store the token for future requests
                this.app._server.token = data.token;
                console.log('Login successful, token stored');
                
                this.app.buildApp(data);
            } else {
                console.error('Login failed:', data.message);
                
            }

        } catch (error) {
            console.error('Request failed:', error);
        }
        
    }

}

class Server {
    constructor(){
        this.user = null;
        this.password = null;
        this.token = null;
    }

    async tokenLogin(token){
        this.token = token;
        try {
            const tokenParam = new URLSearchParams({ token: token });
            return await this.sendRequest(tokenParam, '/login');
        }catch(error){}

    }

    async manualLogin(username, password){
        try {
            const params = new URLSearchParams({
                username: username,
                password: password
            });
            return await this.sendRequest(params, '/login');
        } catch (error) {
            console.error("Login failed:", error);
        }
    }

    async sendRequest(params, address){
        try {
            const fetchUrl = `${address}?${params.toString()}`;
            const response = await fetch(fetchUrl);
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            return response;

        } catch (error) {
            console.error('Request failed:', error);
            throw error;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new app;
});
