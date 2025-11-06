// Data needed for apps that is not current user specific
class auth {
    constructor(){
        this._data = {};
        this._auth = {};
        this.init();

    }
    //Check authentication status then load appropriate page
    async init(){
        try {
            await this.authenticate();
        } catch (error) {
             console.log("Authentication failed:", error);
        }
        if(this._auth){
            await this.login();
        } else {
            new loginPage(this);
        }

    }

    async login(){
        try {            
            const { app } = await import('/main.js');
            new app(this);
        } catch (error) {
            console.error("Error during login process:", error);
            // Default to login page if main app fails to load
            new loginPage(this);
        }
    }


    //Temp authentication check
    //Will be replaced with more robust token validation later
    async authenticate(){
        try {
            this._auth = JSON.parse(localStorage.getItem('authTokens'));
            if (!this._auth) {
                throw new Error("No auth tokens found");
            }
            return true;
        }
        catch (error) {
            console.log("Authentication failed:", error);
            this._auth = null;
        }
        return false;
    }

    //Temp logout process
    //Future: clear session, tokens, etc.
    logout(){
        new loginPage(new auth);
    }


    async sendRequest(path, method){
        try{
            const response = await fetch(path, {
                method: method,
                headers: {
                    //'Authorization': `${this._auth.token}`,
                    'Content-Type': 'application/json'
                }
            });
            if(!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response;
        } catch (error){
            console.error('Request failed:', error);
        }
        return null;
    }
}


export class loginPage{
    constructor(context) {
        this._context = context;
        this.appRoot = document.getElementById('root');
        this.username = null;
        this.password = null;
        this.init();
    }
    init(){
        //Confirm preexisting content has been cleared
        this.appRoot.innerHTML = '';

        const loginDiv = document.createElement('div');
        loginDiv.className = 'login-page';

        const panel = this.createPanel();

        loginDiv.appendChild(panel);
        this.appRoot.appendChild(loginDiv);
    }

    //Code Quality Note: function is a bit long, but keeps related code together for easier modification later
    createPanel(){
        const panel = document.createElement('div');
        panel.classList.add('login-panel');

        // Create a form-like structure with proper grouping
        const usernameGroup = document.createElement('div');
        usernameGroup.style.width = '100%'; 
        
        const usernameLabel = document.createElement('label');
        usernameLabel.textContent = 'Username';
        usernameLabel.setAttribute('for', 'username');
        
        const usernameInput = document.createElement('input');
        usernameInput.type = 'text';
        usernameInput.id = 'username';
        usernameInput.placeholder = 'Enter your username';
        this.username = usernameInput;

        usernameGroup.appendChild(usernameLabel);
        usernameGroup.appendChild(usernameInput);
        panel.appendChild(usernameGroup);

        const passwordGroup = document.createElement('div');
        passwordGroup.style.width = '100%'; 
        
        const passwordLabel = document.createElement('label');
        passwordLabel.textContent = 'Password';
        passwordLabel.setAttribute('for', 'password');
        
        const passwordInput = document.createElement('input');
        passwordInput.type = 'password';
        passwordInput.id = 'password';
        passwordInput.placeholder = 'Enter your password';
        this.password = passwordInput;
        
        passwordGroup.appendChild(passwordLabel);
        passwordGroup.appendChild(passwordInput);
        panel.appendChild(passwordGroup);

        const loginButton = document.createElement('button');
        loginButton.classList.add('login-button');
        loginButton.textContent = 'Login';
        loginButton.addEventListener('click', ()=> this.LoginAttempt());
        panel.appendChild(loginButton);

        return panel;
    }

    async LoginAttempt(event){
        console.log("Attempting Login")
        // Send login data to server for authentication
        try{
            const params = new URLSearchParams({
                username: this.username.value,
                password: this.password.value
            });

            const fetchUrl = `/api/?${params.toString()}`;

            const attempt = await fetch(fetchUrl);
            if(attempt.ok){
                console.log("Successful auth received by server");
                //Login successful
                //const userData = await attempt.json();
                this.appRoot.innerHTML = '';
                await this._context.login();
            }
        } catch (error){
            console.error('Login attempt failed:', error);
            
        }

    }
}



document.addEventListener('DOMContentLoaded', () => {
    new auth;
});
