export type NumberValidator = (x: number, y?: number[]) => boolean;

export interface SimpleNumberFilter {
    name: string;
    active: boolean;
    checked: boolean;
    inputValue: string;
}
export class NumberFilter {
    f: NumberValidator;
    name: string = "";
    active: boolean = true;
    checked: boolean = true;
    inputRequired: boolean = false;
    inputValue: string = "";
    inputArray: number[] = [];
    inputChanged: boolean = false;
    
    constructor(
        name: string, 
        f: NumberValidator, 
        inputRequired?: boolean,
        active?: boolean, 
        checked?: boolean
    ) {
        this.f = f;
        this.name = name;
        this.inputRequired = inputRequired === undefined ? false : inputRequired;
        this.active = active === undefined ? true : active;
        this.checked = checked === undefined ? true : checked;
    }

    toSimpleObject(): SimpleNumberFilter {
        return {
            name: this.name,
            active: this.active,
            checked: this.checked,
            inputValue: this.inputValue
        };
    }

    getClone(): NumberFilter {
        let f = new NumberFilter(this.name, this.f, this.inputRequired, this.active, this.checked);
        f.inputValue = this.inputValue;
        return f;
    }

    toggle() {
        this.checked = !this.checked;
    }

    toggleActive() {
        this.active = !this.active;
    }

    private parseArray(value: string): number[] {
        try {
            let a: number[] = [];
            let b: string[] = value.split(new RegExp("[^\\d+-]"));
            
            for(let s of b) {
                let x = parseInt(s);
                if(!isNaN(x)) a.push(x);
            }
            
            return a;
        }
        catch(e) {
            return [];
        }
    }

    validate(x: number): boolean {
        if(this.inputChanged) {
            this.inputArray = this.inputRequired ? this.parseArray(this.inputValue) : [];
            this.inputChanged = false;
        }
        return this.inputRequired ? this.f(x, this.inputArray) : (this.f(x) === this.checked);
    }
}