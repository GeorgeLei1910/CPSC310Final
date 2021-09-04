import Query from "../Query";
import IFilter from "./IFilter";

export default abstract class Filter implements IFilter {
    protected query: Query;

    constructor(queryObj: Query) {
        this.query = queryObj;
    }

    public abstract applyTo(item: any): boolean;

    public filter(items: any[]): any[] {
        return items.filter(
            (item: any) => this.applyTo(item)
        );
    }
}
