import { ApplyToken } from "../../QueryUtil";
import NumberApplyRule from "./NumberApplyRule";
import Decimal from "decimal.js";
import ApplyRule from "./ApplyRule";
import Query from "../../Query";

export default class AvgApplyRule extends NumberApplyRule {
    constructor(ruleQuery: any, queryObj: Query) {
        super(ruleQuery, queryObj);
        this.applyToken = ApplyToken.AVG;
        this.key = ruleQuery[this.applyKey][this.applyToken];
        this.checkKey();
    }

    protected applyToAGroup(group: any[]): any[] {
        let values: Decimal[] = group.map((item: any) => new Decimal(item[this.key]));
        let total: Decimal = values.reduce(
            (acc: Decimal, value: Decimal) => Decimal.add(acc, value), new Decimal(0));
        let avgDecimal = total.toNumber() / group.length;
        let avg: number = Number(avgDecimal.toFixed(ApplyRule.DECIMALPLACE));
        return this.assignToAGroup(group, avg);
    }
}
