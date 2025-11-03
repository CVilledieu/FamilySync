import {index} from '/app/index.js';
import {Button} from '/app/util/elements.js';
import {User} from '/app/util/user.js';


export class loginPage{
    constructor() {
        this.appRoot = document.getElementById('root');
        this.user = null;
        this.init();
    }
    init(){
        //Confirm preexisting content has been cleared
        this.appRoot.innerHTML = '';
        if(this.checkTokens()){
            this.Login();
        }
        this.createPage();
    }

    checkTokens(){
        // Placeholder for token checking logic
        // If valid tokens found, set this.user and proceed to index
        // For now, we assume no valid tokens
        return false;
    }

    createPage(){
        const loginDiv = document.createElement('div');
        loginDiv.className = 'login-page';

        const panel = this.createPanel();

        loginDiv.appendChild(panel);
        this.appRoot.appendChild(loginDiv);
    }

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
        
        passwordGroup.appendChild(passwordLabel);
        passwordGroup.appendChild(passwordInput);
        panel.appendChild(passwordGroup);

        const loginButton = new Button({
            className: 'login-button',
            Text: 'Login',
            OnClick: ()=> this.Login()
        });
        panel.appendChild(loginButton.button);
        return panel;
    }


    // Content Note: Current login screen doesnt have actual authentication yet
    Login(){
        this.user = new User('Test User');
        this.appRoot.innerHTML = '';//Clear login page
        new index('Test User');
    }
    
}
