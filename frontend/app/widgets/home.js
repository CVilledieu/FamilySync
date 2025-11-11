export class HomeWidget {
    constructor(appCtx){
        this.AppCtx = appCtx;
        this.FrameRoot = appCtx.frameRoot;
        this.Name = 'Home';
    }

    Render(){
        console.log(this.AppCtx.user);
        const widgetDiv = document.createElement('div');
        widgetDiv.classList.add('widget-home');
        
        const fragment = document.createDocumentFragment();
        const widgets = this.AppCtx.WidgetList;
        widgets.forEach( widget =>{
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
