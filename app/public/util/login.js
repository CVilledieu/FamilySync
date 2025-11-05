import {Button} from '/util/elements.js';

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

        const loginButton = new Button({
            className: 'login-button',
            Text: 'Login',
            OnClick: ()=> this.LoginAttempt()
        });
        panel.appendChild(loginButton.button);
        return panel;
    }

    async LoginAttempt(){
        // Send login data to server for authentication
        try{
            const username = this.username.value;
            const password = this.password.value;
            const headers = new Headers();
            headers.append('entries', btoa(username));
            headers.append('entries', btoa(password));

            const attempt = await fetch('/auth', {
                method: 'GET',
                headers: headers,                
            });
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

