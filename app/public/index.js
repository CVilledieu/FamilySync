import { User } from '/util/user.js';
import { loginPage } from '/util/login.js';

class index {
    constructor(){
        this._user = null;
        this.init();
    }

    //Check authentication status then load appropriate page
    init(){
        //Check tokens/cookies
        //If valid, load main app
        //Else load login page
        this._user = new User;
        if(this._user.checkTokens()){
            //Valid tokens found, proceed to main app
            try {
                this.callMainApp(this._user);
            } catch (error) {
                console.error("Error loading main app:", error);  
                new loginPage(this._user);  
            }
        } else {
            //No valid tokens, show login page
            new loginPage(this._user);
        }
    }

    async callMainApp(User){
        const { mainApp } = await import('/main.js');
        new mainApp(User);
    }

}

document.addEventListener('DOMContentLoaded', () => {
    new index;
});