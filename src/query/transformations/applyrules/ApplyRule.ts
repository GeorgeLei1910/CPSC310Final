import { InsightError } from "../../../controller/IInsightFacade";
import Query from "../../Query";
import { ApplyToken } from "../../QueryUtil";

export default abstract class ApplyRule {
    protected static readonly DECIMALPLACE = 2;
    protected applyKey: string;
    protected key: string;
    protected applyToken: ApplyToken;
    protected query: Query;

    constructor(ruleQuery: any, queryObj: Query) {
        this.applyKey = Object.keys(ruleQuery)[0];
        this.query = queryObj;
    }

    public apply(groups: any[][]): any[][] {
        return groups.map((group: any[]) => this.applyToAGroup(group));
    }

    public getApplyKey(): string {
        return this.applyKey;
    }

    public getKey(): string {
        return this.key;
    }

    protected throwKeyTypeError(): void {
        throw new InsightError(`Invalid key type in ${this.applyToken}: ${this.key}`);
    }

    protected assignToAGroup(group: any[], value: any): any[] {
        group.forEach((item: any) => {
            item[this.applyKey] = value;
        });
        return group;
    }

    protected abstract applyToAGroup(group: any[]): any[];
    protected abstract checkKey(): void;
}
