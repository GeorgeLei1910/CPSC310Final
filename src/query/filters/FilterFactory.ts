import ANDFilter from "./ANDFilter";
import ORFilter from "./ORFilter";
import NOTFilter from "./NOTFilter";
import GTFilter from "./GTFilter";
import LTFilter from "./LTFilter";
import EQFilter from "./EQFilter";
import ISFilter from "./ISFilter";
import EmptyFilter from "./EmptyFilter";
import Filter from "./Filter";
import IFilter from "./IFilter";
import QueryUtil from "../QueryUtil";
import { InsightError } from "../../controller/IInsightFacade";
import Query from "../Query";

export default class FilterFactory {
    public static getIFilter(query: any, queryObj: Query): IFilter {
        let filterQuery = query[QueryUtil.WHERE];
        if (Object.keys(filterQuery).length === 0) {
            return new EmptyFilter();
        }
        return this.getFilter(filterQuery, queryObj);
    }

    public static getFilter(query: any, queryObj: Query): Filter {
        let operator: string = Object.keys(query)[0];
        let queryContent = query[operator];

        switch (operator) {
            case QueryUtil.AND:
                return new ANDFilter(queryContent, queryObj);

            case QueryUtil.OR:
                return new ORFilter(queryContent, queryObj);

            case QueryUtil.NOT:
                return new NOTFilter(queryContent, queryObj);

            case QueryUtil.GT:
                return new GTFilter(queryContent, queryObj);

            case QueryUtil.EQ:
                return new EQFilter(queryContent, queryObj);

            case QueryUtil.LT:
                return new LTFilter(queryContent, queryObj);

            case QueryUtil.IS:
                return new ISFilter(queryContent, queryObj);

            default:
                throw new InsightError(`Unknown Filter: ${operator}`);
        }
    }
}
