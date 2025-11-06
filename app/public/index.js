//Main/init entry point for website
class app{
    constructor(){
        this.FrameRoot = document.createElement('div');
        this.WidgetList = [];
        this.HomeWidget = null;
        this._server = null;

        this.#init();
    }
    #init(){
        this.#constructSite();
        this._server = new Server();
        this.tokenCheck = false; //Temp forced failure
        if (this.tokenCheck) {

        } else {
            const widget =  new loginWidget(this);
            this.loadWidget(widget);
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

    async loadWidget(Widget){
        this.clearFrame();
        try {
            const element = await Widget.Render();
            this.FrameRoot.appendChild(element);
        }catch(error){
            console.error("Error loading widget:", error);
        }
    }

}

class loginWidget {
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
        loginButton.addEventListener('click', async () => await this.loginBtn({
            username: usernameInput.value, 
            password: passwordInput.value
        }));
        prompt.appendChild(loginButton);

        return prompt;
    }

    async loginBtn(parameters){
        try {
            const res = await this.app._server.manualLogin(parameters.username, parameters.password);
            if (res && res.ok) {
                console.log("Login successful");
                const { HomeWidget } = await import('./HomeWidget.js');
                this.app.HomeWidget = new HomeWidget(this.app);
                this.app.loadWidget(this.app.HomeWidget);
            }
        } catch (error) {
            console.error("Login failed:", error);
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
            await fetch(fetchUrl).then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response;
            });

        } catch (error) {
            console.error('Request failed:', error);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new app;
});
