import QueryUtil, { Direction } from "../../QueryUtil";
import { InsightError } from "../../../controller/IInsightFacade";
import IOrder from "./IOrder";

export default class ComplexOrder implements IOrder {
    private direction: Direction;
    private fields: string[];

    constructor(query: any, columns: string[]) {
        this.direction = query[QueryUtil.DIRECTION];
        this.fields = query[QueryUtil.ORDERKEYS];
        this.checkFields(columns);
    }

    public sort(items: any[]): any[] {
        return items.sort(
            (a: any, b: any) => this.compareWithDirection(this.compare(a, b, this.fields)));
    }

    private compareWithDirection(result: number): number {
        return this.direction === Direction.UP ? result : -result;
    }

    private compare(itemA: any, itemB: any, fields: string[]): number {
        if (fields.length === 0) {
            return 0;
        }

        let field = fields[0];
        let fieldA = itemA[field];
        let fieldB = itemB[field];

        if (fieldA < fieldB) {
            return -1;
        } else if (fieldA > fieldB) {
            return 1;
        } else {
            return this.compare(itemA, itemB, fields.slice(1));
        }
    }

    private checkFields(columns: string[]): void {
        let invalidFields = this.fields.filter((field: string) => !columns.includes(field));
        if (invalidFields.length !== 0) {
            throw new InsightError(`Invalid ${QueryUtil.ORDER} keys: ${invalidFields}.`);
        }
    }
}
