import { InsightError } from "../../controller/IInsightFacade";
import Query from "../Query";
import MSFilter from "./MSFilter";

export default abstract class MFilter extends MSFilter {
    protected value: number;

    constructor(query: any, queryObj: Query) {
        super(query, queryObj);
        if (!this.query.isValidMField(this.field)) {
            throw new InsightError(`Invalid field: ${this.field}.`);
        }

        let value = query[this.field];
        if (typeof value !== "number") {
            throw new InsightError(`Invalid value type for ${this.field}.`);
        }
        this.value = value;
    }
}
