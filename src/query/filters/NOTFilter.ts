import Query from "../Query";
import Filter from "./Filter";
import FilterFactory from "./FilterFactory";

export default class NOTFilter extends Filter {
    private subFilter: Filter;

    constructor(query: any, queryObj: Query) {
        super(queryObj);
        this.subFilter = FilterFactory.getFilter(query, queryObj);
    }

    public applyTo(item: any): boolean {
        return !this.subFilter.applyTo(item);
    }
}
