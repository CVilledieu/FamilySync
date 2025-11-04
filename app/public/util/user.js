export class User{
    constructor(jsonData){
        this._username = null;
        this._name = null;
        this._tokens = null;
        this._authenticated = false;
    }
    get username(){
        return this._username;
    }
    get name(){
        return this._name;
    }

    checkTokens(){
        return true;
    }

}