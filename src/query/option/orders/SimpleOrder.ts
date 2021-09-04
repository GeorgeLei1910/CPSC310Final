import { InsightError } from "../../../controller/IInsightFacade";
import QueryUtil from "../../QueryUtil";
import IOrder from "./IOrder";

export default class SimpleOrder implements IOrder {
    private field: string;

    constructor(field: string, columns: string[]) {
        this.field = field;
        if (!columns.includes(this.field)) {
            throw new InsightError(`${QueryUtil.ORDER} key must be in ${QueryUtil.COLUMNS}.`);
        }
    }

    public sort(items: any[]): any[] {
        return items.sort(
            (a: any, b: any) => this.compare(a, b));
    }

    private compare(itemA: any, itemB: any): number {
        let fieldA = itemA[this.field];
        let fieldB = itemB[this.field];

        if (fieldA < fieldB) {
            return -1;
        } else if (fieldA > fieldB) {
            return 1;
        } else {
            return 0;
        }
    }
}
