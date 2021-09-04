import Query from "../../Query";
import { ApplyToken } from "../../QueryUtil";
import NumberApplyRule from "./NumberApplyRule";

export default class MinApplyRule extends NumberApplyRule {
    constructor(ruleQuery: any, queryObj: Query) {
        super(ruleQuery, queryObj);
        this.applyToken = ApplyToken.MIN;
        this.key = ruleQuery[this.applyKey][this.applyToken];
        this.checkKey();
    }

    protected applyToAGroup(group: any[]): any[] {
        let values: number[] = group.map((item: any) => item[this.key]);
        let min: number = values.reduce(
            (minSoFar: number, value: number) => value < minSoFar ? value : minSoFar);
        return this.assignToAGroup(group, min);
    }
}
