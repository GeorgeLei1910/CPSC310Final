import { ApplyToken } from "../../QueryUtil";
import ApplyRule from "./ApplyRule";
import NumberApplyRule from "./NumberApplyRule";
import Query from "../../Query";

export default class SumApplyRule extends NumberApplyRule {
    constructor(ruleQuery: any, queryObj: Query) {
        super(ruleQuery, queryObj);
        this.applyToken = ApplyToken.SUM;
        this.key = ruleQuery[this.applyKey][this.applyToken];
        this.checkKey();
    }

    protected applyToAGroup(group: any[]): any[] {
        let values: number[] = group.map((item: any) => item[this.key]);
        let sum: number = Number(
            values.reduce((acc: number, value: number) => acc + value)
            .toFixed(ApplyRule.DECIMALPLACE));
        group.forEach((item: any) => {
            item[this.applyKey] = sum;
        });
        return group;
    }
}
