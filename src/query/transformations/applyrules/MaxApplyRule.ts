import Query from "../../Query";
import { ApplyToken } from "../../QueryUtil";
import NumberApplyRule from "./NumberApplyRule";

export default class MaxApplyRule extends NumberApplyRule {
    constructor(ruleQuery: any, queryObj: Query) {
        super(ruleQuery, queryObj);
        this.applyToken = ApplyToken.MAX;
        this.key = ruleQuery[this.applyKey][this.applyToken];
        this.checkKey();
    }

    protected applyToAGroup(group: any[]): any[] {
        let values: number[] = group.map((item: any) => item[this.key]);
        let max: number = values.reduce(
            (maxSoFar: number, value: number) => value > maxSoFar ? value : maxSoFar);
        return this.assignToAGroup(group, max);
    }
}
