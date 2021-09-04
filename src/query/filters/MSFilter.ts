import Query from "../Query";
import Filter from "./Filter";

export default abstract class MSFilter extends Filter {
    protected field: string;

    constructor(query: any, queryObj: Query) {
        super(queryObj);
        this.field = Object.keys(query)[0];
    }
}
