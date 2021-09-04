import Query from "../Query";
import ATransformation from "./ATransformation";

export default class EmptyTransformation extends ATransformation {
    constructor(queryObj: Query) {
        super(queryObj);
    }

    public transform(items: any[]): any[] {
        return items;
    }

    public isApplyKey(column: string): boolean {
        return false;
    }

    public isUsableColumnKey(column: string): boolean {
        return this.query.isValidField(column);
    }
}
