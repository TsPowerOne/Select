import { htmlParse, empty} from '@tspower/core';
import { Subject, timer } from 'rxjs';
import { timingSafeEqual } from 'crypto';



export class Select{
    private node:HTMLSelectElement;
    private updated = new Subject<any>();
    private changed = new Subject<any>();
    private selected = new Subject<any>();
    private sel:boolean = false;
    private enab = new Subject<any>();
    private disab = new Subject<any>();


    public updated$ = this.updated.asObservable();
    public changed$ = this.changed.asObservable();
    public selected$ = this.selected.asObservable();
    public enabled$ = this.enab.asObservable();
    public disabled$ = this.disab.asObservable();

    public selectedIndex:any;
    public selectedDisplay:any;
    
    

    constructor(
        private Root:HTMLElement,
        private Name:string,
        private Index:string,
        private Display:string,
        private PreselectIndex?:string,
        private Placeholder:string = "Select an Item",
        private Group?:string,
        private Data?:Array<any>,
        private Id?:string,
        private Class?:string,
        private Style?:string
    ){
        this.create();
        this.init();
    }
    private init = ()=>{

        this.node.addEventListener("change", (event)=>{
            this.selectedIndex = this.node.options[this.node.selectedIndex].value;
            this.selectedDisplay = this.node.options[this.node.selectedIndex].text;
            let option = this.node.options.item(this.node.selectedIndex);
            option.setAttribute("selected", '');

            if(this.selectedIndex =="unselect") {
                this.selected.next(false);
                this.sel = false;
            }else{ 
                this.sel = true;
                this.selected.next(true);
            }
            this.changed.next({index:this.selectedIndex, display:this.selectedDisplay});
        });

    }

    private create = () =>{
        let id = (this.Id)?`id="${this.Id}"`:null;
        let classe = (this.Class)?`class="${this.Class}"`:null;
        let stile = (this.Style)?`style="${this.Style}"`:null;
        let gruppo = (this.Group)?`data-group="${this.Group}"`:null;

        let template = `<select name="${this.Name}" ${(id)?id:""} ${(classe)?classe:""} ${(stile)?stile:""}  ${(gruppo)?gruppo:""}>
                        </select>`;

        this.node = htmlParse(template) as HTMLSelectElement;

        if(this.Data){
            this.populate();
        }
        this.Root.appendChild(this.node);

    }
    private option = (Index:string, Display:string, preset?:boolean):HTMLOptionElement=>{
        let sel = (preset)?"selected":"";
        let template = `<option value="${Index}" ${sel} > ${Display} </option>`;
        return htmlParse(template) as HTMLOptionElement;
    }
    private placeholder = ():HTMLOptionElement=> {
        let pre = (this.PreselectIndex=="unselect" || this.PreselectIndex==null)?"selected":null;
        return htmlParse(`<option value="unselect" ${(pre!=null)?pre:""}>${this.Placeholder}</option>`) as HTMLOptionElement;
    }

    private populate = (atStart:boolean = true)=>{
       empty(this.node);
       this.node.appendChild(this.placeholder());
        this.Data.forEach((e, i)=>{
                let pres_index = (atStart)? (e[this.Index]==this.PreselectIndex)?true:false :null;
                 this.node.appendChild(this.option(e[this.Index], e[this.Display], pres_index));
        });
    }

    private unselAll = ():void=>{
        let s = this.node.querySelector("option[selected]");
        s.removeAttribute("selected");
    }
    private selItem =(value:string):void=>{
        this.unselAll();
        let option = this.node.querySelector(`option[value="${value}"]`) as HTMLOptionElement;
        option.setAttribute("selected", '');

        if(value!="unselect"){
            let selezionato = this.Data.filter(e=>e[this.Index] == option.value);
            if(selezionato){
                this.selectedIndex = selezionato[0][this.Index];
                this.selectedDisplay = selezionato[0][this.Display];
                this.selected.next({index:this.selectedIndex, display:this.selectedDisplay});
                this.changed.next({index:this.selectedIndex, display:this.selectedDisplay});
            }
        }
        
    }

    //shared method
    isSelected = ():boolean=> this.sel;

    getSelected = ():any=>{
        return {index:this.selectedIndex, display:this.selectedDisplay};
    }
    unselect =():void=>{
        this.selItem("unselect");
    }

    select = (Index:any):void=>{
        this.selItem(Index);
    }
    setGroup = (group:string):void=> {
        this.Group = group;
        this.node.setAttribute("data-group", this.Group);
    }
    removeGroup = ():void =>{
        this.Group = null;
        this.node.removeAttribute("data-group");
    }
    setData = (data:Array<any>):void=>{
        this.Data = data;
        this.populate(false);
        this.updated.next(true);
    }
    removeData = ():void=>{
        this.Data = [];
        this.populate(false);
        this.updated.next(true);
    }
    setClass = (Class:string)=>{
        this.node.classList.add(Class);
    }
    removeClass = (Class:string)=>{
        this.node.classList.remove(Class);
    }
    setStyle = (Style:string)=>{
        this.node.setAttribute("style", Style);
    }
    removeStyle = ()=>{
        this.node.removeAttribute("style");
    }
    enable = ():void =>{
        this.node.disabled = false;
        this.node.removeAttribute("disabled");
        this.enab.next( { name:this.Name, enabled: true } );
    }
    disable = ():void =>{
        this.node.disabled = true;
        this.node.setAttribute("disabled", "disabled");
        this.disab.next( { name:this.Name, enabled: false } );
    }
}