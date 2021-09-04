
export class HtmlUtils {

    private static regexBldg = new RegExp(/\n/);

    public static getValueInATag (obj: any, param: string, value: string): any[] {
        try {
         let toMap = this.getObjbyType(obj, param, value);
         return toMap.map((elem) => this.valueInATag(elem));
        } catch {
            return null;
        }
    }

    public static getURLInATag(obj: any, param: string, value: string): any[] {
        let atags: any[] = this.getObjbyType(obj, param, value);
        atags = atags.map((elem) => elem.childNodes.find((el: any) => el.nodeName === "a"));
        return atags.map((elem) => {
            try {
                return elem.attrs[0].value;
            } catch (e) {
                return "";
            }
        });
    }

    public static getValueInText (obj: any, param: string, value: string): any[] {
        return this.getObjbyType(obj, param, value)
            .map((elem) => this.valueInText(elem));
    }

    private static valueInText (obj: any): string {
        try {
            return obj.childNodes[0].value.replace(HtmlUtils.regexBldg, "").trim();
        } catch (e) {
            return "";
        }
    }

    private static valueInATag (obj: any) {
        return this.valueInText(obj.childNodes.find((el: any) => el.nodeName === "a"));
    }

    public static getObjbyType(obj: any, param: string, value: string): any[] {
        let arr: any[] = [];
        switch (param) {
            case "nodeName": this.recursiveFindNodename(obj, value, arr);
                             break;
            case "class":
            case "id": this.recursiveFindClassID(obj, param, value, arr);
                       break;
        }
        return arr;
    }

    public static recursiveFindNodename(obj: any, value: string, arr: any[]): void {
        if (obj.nodeName === value) {
            arr.push(obj);
            return;
        } else if (obj.childNodes.length > 0) {
            let childarr: any[] = obj.childNodes.filter((cn: { nodeName: string | string[]; }) =>
                cn.nodeName.indexOf("#") === -1);
            childarr.map((chl) => this.recursiveFindNodename(chl, value, arr));
        } else {
            return;
        }
    }

    public static recursiveFindClassID(obj: any, param: string, value: string, arr: any[]): void {
        if (HtmlUtils.classIDCheck(obj, param, value)) {
            arr.push(obj);
            return;
        } else if (obj.childNodes.length > 0) {
            let childarr: any[] = obj.childNodes.filter((cn: { nodeName: any }) => cn.nodeName.indexOf("#") === -1);
            childarr.map((chl) => this.recursiveFindClassID(chl, param, value, arr));
        }
        return;
    }

    private static classIDCheck(obj: any, param: string, value: string): boolean {
        try {
            if (obj.attrs.length === 0) {
                return false;
            }
            let htmlcls: any[] = obj.attrs.filter((attr: any) => {
                return attr.name === param;
            });
            if (htmlcls.length === 0) {
                return false;
            }
            if (param === "class") {
                let classes: string[] = htmlcls[0].value.split(" ");
                return classes.includes(value);
            } else if (param === "id") {
                return htmlcls[0].value === value;
            }
        } catch (e) {
            return false;
        }
    }
}
