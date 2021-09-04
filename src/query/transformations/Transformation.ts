import { InsightError } from "../../controller/IInsightFacade";
import Query from "../Query";
import QueryUtil, { ApplyToken } from "../QueryUtil";
import ApplyRule from "./applyrules/ApplyRule";
import ApplyRuleFactory from "./applyrules/ApplyRuleFactory";
import ATransformation from "./ATransformation";

export default class Transformation extends ATransformation {
    private groupFields: string[];
    private applyRules: ApplyRule[];

    constructor(query: any, queryObj: Query) {
        super(queryObj);
        this.groupFields = query[QueryUtil.GROUP];
        this.checkGroupFields();
        this.applyRules = query[QueryUtil.APPLY].map(
            (ruleQuery: any) => ApplyRuleFactory.getApplyRule(ruleQuery, queryObj));
        this.checkDuplicateApplyKeys();
    }

    public transform(items: any[]): any[] {
        let groups: any[][] = this.group(items);
        let groupsAfterRules: any[][] = this.applyRules.reduce(
            (curGroups: any[][], applyRule: ApplyRule) => applyRule.apply(curGroups), groups);
        let resultItems = this.collapseGroups(groupsAfterRules);
        return resultItems;
    }

    public isApplyKey(column: string): boolean {
        return this.getApplyKeys().includes(column);
    }

    public isUsableColumnKey(column: string): boolean {
        return this.isApplyKey(column) || this.groupFields.includes(column);
    }

    private group(items: any[]): any[][] {
        let itemsLeft: any[] = [...items];
        let resultGroups: any[][] = [];

        while (itemsLeft.length !== 0) {
            let target: any = itemsLeft[0];
            let targetGroup: any[] = itemsLeft.filter((item: any) => this.isSameGroup(target, item));
            resultGroups.push(targetGroup);
            itemsLeft = itemsLeft.filter((item: any) => !this.isSameGroup(target, item));
        }

        return resultGroups;
    }

    private collapseGroups(groups: any[][]): any[] {
        return groups.map((group: any[]) => group[0]);
    }

    private isSameGroup(itemA: any, itemB: any): boolean {
        return this.groupFields.every((field: string) => itemA[field] === itemB[field]);
    }

    private getApplyKeys(): string[] {
        return this.applyRules.map((rule: ApplyRule) => rule.getApplyKey());
    }

    private checkGroupFields() {
        let invalidFields: string[] = this.groupFields.filter((field: string) => !this.query.isValidField(field));
        if (invalidFields.length !== 0) {
            throw new InsightError(`Invalid key(s) in ${QueryUtil.GROUP}: ${invalidFields}.`);
        }
    }

    private checkDuplicateApplyKeys() {
        let keys: string[] = this.getApplyKeys();
        let duplicateKeys = this.findDuplicates(keys);
        if (duplicateKeys.length !== 0) {
            throw new InsightError(`Duplicate apply key(s) found: ${duplicateKeys}.`);
        }
    }

    private findDuplicates(array: any[]): any[] {
        let sortedArr = array.slice().sort();
        let results = [];
        for (let i = 0; i < sortedArr.length - 1; i++) {
          if (sortedArr[i + 1] === sortedArr[i]) {
            results.push(sortedArr[i]);
          }
        }
        return results;
    }
}
