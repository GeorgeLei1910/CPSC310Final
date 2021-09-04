import Query from "../../Query";
import { ApplyToken } from "../../QueryUtil";
import ApplyRule from "./ApplyRule";

export default class CountApplyRule extends ApplyRule {
    constructor(ruleQuery: any, queryObj: Query) {
        super(ruleQuery, queryObj);
        this.applyToken = ApplyToken.COUNT;
        this.key = ruleQuery[this.applyKey][this.applyToken];
        this.checkKey();
    }

    protected applyToAGroup(group: any[]): any[] {
        let values: any[] = group.map((item: any) => item[this.key]);
        let uniqueValues = new Set(values);
        return this.assignToAGroup(group, uniqueValues.size);
    }

    protected checkKey(): void {
        if (!this.query.isValidField(this.key)) {
            this.throwKeyTypeError();
        }
    }
}
