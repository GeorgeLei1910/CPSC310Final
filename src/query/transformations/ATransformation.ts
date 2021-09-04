import Query from "../Query";

export default abstract class ATransformation {
    protected query: Query;

    constructor(queryObj: Query) {
        this.query = queryObj;
    }

    abstract transform(items: any[]): any[];
    abstract isApplyKey(column: string): boolean;
    abstract isUsableColumnKey(column: string): boolean;
}
