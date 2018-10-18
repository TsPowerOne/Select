export declare class Select {
    private Root;
    private Name;
    private Index;
    private Display;
    private PreselectIndex?;
    private Placeholder;
    private Group?;
    private Data?;
    private Id?;
    private Class?;
    private Style?;
    private node;
    private updated;
    private changed;
    private selected;
    private sel;
    private enab;
    private disab;
    updated$: import("rxjs/internal/Observable").Observable<any>;
    changed$: import("rxjs/internal/Observable").Observable<any>;
    selected$: import("rxjs/internal/Observable").Observable<any>;
    enabled$: import("rxjs/internal/Observable").Observable<any>;
    disabled$: import("rxjs/internal/Observable").Observable<any>;
    selectedIndex: any;
    selectedDisplay: any;
    constructor(Root: HTMLElement, Name: string, Index: string, Display: string, PreselectIndex?: string, Placeholder?: string, Group?: string, Data?: Array<any>, Id?: string, Class?: string, Style?: string);
    private init;
    private create;
    private option;
    private placeholder;
    private populate;
    private unselAll;
    private selItem;
    isSelected: () => boolean;
    unselect: () => void;
    select: (Index: any) => void;
    setGroup: (group: string) => void;
    removeGroup: () => void;
    setData: (data: any[]) => void;
    removeData: () => void;
    setClass: (Class: string) => void;
    removeClass: (Class: string) => void;
    setStyle: (Style: string) => void;
    removeStyle: () => void;
    enable: () => void;
    disable: () => void;
}
