import { loginPage } from '/util/login.js';

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
            const { mainApp } = await import('/main.js');
            new mainApp(this);
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
            return false;
        }
        
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

document.addEventListener('DOMContentLoaded', () => {
    new auth;
});
