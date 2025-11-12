export class AuthWidget {
    constructor(appCtx){
        this.Name = "Logout";
        this.element = document.createElement('div');
        this.AppCtx = appCtx;
        this.#init();
    }
    #init(){
        this.element.classList.add('widget-login');        
        const prompt = this.loginPrompt();
        
        this.element.appendChild(prompt);
    }

    async Render(){
        return this.element;
    }
    SkipLogin(){
        //return bool;
    }

    loginPrompt () {
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
        loginButton.addEventListener('click', async () => await this.authenticate({
            username: usernameInput.value, 
            password: passwordInput.value
        }));
        prompt.appendChild(loginButton);

        return prompt;
    }

    // Fetches basic user data. FreshVisit() will fetch additional data that is needed for the app
    async authenticate(credentials) {
        const loginAddress = '/login';
        try {
            const res = await fetch(loginAddress, {
                method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(credentials)
            });

            if (!res.ok){
                return;
            }
            const data = await res.json();
            await this.AppCtx.Login(data);
        } catch (error){
            console.log(`Request failed: ${error}`);
        }
    }

}
