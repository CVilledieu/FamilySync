
export class Home {
    constructor(appCtx){
        this.AppCtx = appCtx;
        this.FrameRoot = appCtx.frameRoot;
        this.Name = 'Home';
    
    }
    render(){
        const widgetDiv = document.createElement('div');
        widgetDiv.classList.add('widget-home');

        
        const fragment = document.createDocumentFragment();
        const widgets = this.AppCtx.widgetList;
        widgets.forEach( widget =>{
            const div = document.createElement('div');
            div.classList.add('dashboard-item');
            div.textContent = widget.name;
            div.onclick = () => this.AppCtx.loadWidget(widget);
            fragment.appendChild(div);
        });

        widgetDiv.appendChild(fragment);
        return widgetDiv;
    }
}