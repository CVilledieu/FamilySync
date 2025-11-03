
export class User {
    #admin = false;
    construstor(name){
        this._name = name;
        this._numberOfEvents = 0;
        this._Events = [];
        this.#admin = false;
        this._shared = [];
        this._sharing = [];
        this._settings = {};
    }

    get name(){
        return this._name;
    }
    get numberOfEvents(){
        return this._numberOfEvents;
    }
    get Events(){
        return this._Events;
    }
    addEvent(event){
        this._Events.push(event);
        this._numberOfEvents++;
    }

}


