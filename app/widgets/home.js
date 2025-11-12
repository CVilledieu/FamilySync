export class HomeWidget {
    constructor(appCtx){
        this.AppCtx = appCtx;
        this.Name = 'Home';
    }
    

    Render(){
        const widgetDiv = document.createElement('div');
        widgetDiv.classList.add('widget-home');
        
        const fragment = document.createDocumentFragment();
        Object.values(G_WidgetsList).forEach( widget =>{
            if (widget.Name == "Home"){
                return;
            }
            const div = document.createElement('div');
            div.classList.add('dashboard-item');
            div.textContent = widget.Name;
            div.onclick = () => this.AppCtx.loadWidget(widget);
            fragment.appendChild(div);
        });
        

        widgetDiv.appendChild(fragment);
        return widgetDiv;
    }
}
