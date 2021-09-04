import Query from "../Query";
import Filter from "./Filter";
import FilterFactory from "./FilterFactory";

export default abstract class LogicFilter extends Filter {
    protected subFilters: Filter[];

    constructor(query: any, queryObj: Query) {
        super(queryObj);
        this.subFilters = query.map(
            (filterQuery: any) => FilterFactory.getFilter(filterQuery, queryObj)
        );
    }

    public applyTo(item: any): boolean {
        return this.subFilters.map(
            (subFilter: Filter) => subFilter.applyTo(item)
        ).reduce(this.compare);
    }

    protected abstract compare(resultA: boolean, resultB: boolean): boolean;
}
