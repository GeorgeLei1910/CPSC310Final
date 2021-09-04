import { InsightError } from "../controller/IInsightFacade";

export default class QueryUtil {
    public static readonly WHERE = "WHERE";
    public static readonly OPTIONS = "OPTIONS";
    public static readonly COLUMNS = "COLUMNS";
    public static readonly TRANSFORMATIONS = "TRANSFORMATIONS";
    public static readonly ORDER = "ORDER";
    public static readonly GROUP = "GROUP";
    public static readonly APPLY = "APPLY";
    public static readonly AND = "AND";
    public static readonly OR = "OR";
    public static readonly NOT = "NOT";
    public static readonly LT = "LT";
    public static readonly GT = "GT";
    public static readonly EQ = "EQ";
    public static readonly IS = "IS";
    public static readonly COURSESMFIELDS = ["avg", "pass", "fail", "audit", "year"];
    public static readonly COURSESSFIELDS = ["dept", "id", "instructor", "title", "uuid"];
    public static readonly ROOMSMFIELDS = ["lat", "lon", "seats"];
    public static readonly ROOMSSFIELDS = ["fullname", "shortname", "number", "name", "address", "type",
                                            "furniture", "href"];

    public static readonly WILDCARD = "*";
    public static readonly MAXLENGTH = 5000;
    public static readonly DIRECTION = "dir";
    public static readonly ORDERKEYS = "keys";
    public static readonly DELIMINTER = "_";
    private static MFIELDS: string[] = null;
    private static SFIELDS: string[] = null;

    public static extractId(query: any): string {
        this.checkMember(this.WHERE, query);
        this.checkMember(this.OPTIONS, query);
        let whereResult: string = this.extractIdWhere(query);
        let optionsResult: string = this.extractIdOptions(query);
        let transformationResult: string = this.extractIdTransformations(query);
        let result = this.checkNonNullIds([whereResult, optionsResult, transformationResult]);
        if (result === null) {
            throw new InsightError("No id found in query.");
        }
        return result;
    }

    private static extractIdOptions(query: any): null | string {
        let optionQuery = query[this.OPTIONS];
        this.checkMember(this.COLUMNS, optionQuery);

        let keys = optionQuery[this.COLUMNS];
        this.checkIsArray(keys, this.COLUMNS);
        let ids = keys.map((key: string) => this.getIdFromAnyKey(key))
            .filter((id: any) => id !== null);
        let resultId = this.checkNonNullIds(ids);
        let newKeys = keys.map((key: string) => this.getFieldFromAnyKey(key));
        optionQuery[this.COLUMNS] = newKeys;

        if (this.ORDER in optionQuery) {
            let orderId = this.extractIdOrder(query);
            if (resultId === null && orderId !== null) {
                resultId = orderId;
            } else if (resultId !== null && orderId !== null && resultId !== orderId) {
                throw new InsightError("Cannot query more than one dataset.");
            }
        }
        return resultId;
    }

    private static extractIdTransformations(query: any): null | string {
        if (!(this.TRANSFORMATIONS in query)) {
            return null;
        }

        let transformationQuery = query[this.TRANSFORMATIONS];
        this.checkMember(this.GROUP, transformationQuery);
        let groupQuery = transformationQuery[this.GROUP];
        this.checkIsArray(groupQuery, this.GROUP);
        this.checkNonEmptyArray(groupQuery, this.GROUP);
        let groupId = this.checkIds(
            groupQuery.map((key: string) => this.getIdFromKey(key)));
        transformationQuery[this.GROUP] = groupQuery.map((key: string) => this.getFieldFromKey(key));

        this.checkMember(this.APPLY, transformationQuery);
        let applyQuery = transformationQuery[this.APPLY];
        this.checkIsArray(applyQuery, this.APPLY);
        this.checkNonEmptyArray(applyQuery, this.APPLY);
        let applyId = this.checkIds(
            applyQuery.map((applyRule: any) => this.extractIdApplyRule(applyRule)));

        return this.checkIds([groupId, applyId]);
    }

    private static extractIdApplyRule(rule: any): string {
        let applykeys = Object.keys(rule);
        if (applykeys.length !== 1) {
            throw new InsightError(`An apply rule should only have 1 apply key, has ${applykeys.length}.`);
        }
        let applykey = applykeys[0];
        if (!this.isApplyKey(applykey)) {
            throw new InsightError(`Invalid apply key: ${applykey}`);
        }
        let tokens = Object.keys(rule[applykey]);
        if (tokens.length !== 1) {
            throw new InsightError(`An apply rule should only have 1 apply token and key pair, has ${tokens.length}`);
        }
        let token = tokens[0];
        if (!(token in ApplyToken)) {
            throw new InsightError(`Invalid apply token: ${token}`);
        }
        let key = rule[applykey][token];
        rule[applykey][token] = this.getFieldFromKey(key);
        return this.getIdFromKey(key);
    }

    private static extractIdOrder(query: any): null | string {
        let orderQuery = query[this.OPTIONS][this.ORDER];
        if (typeof orderQuery === "string") {
            query[this.OPTIONS][this.ORDER] = this.getFieldFromAnyKey(orderQuery);
            return this.getIdFromAnyKey(orderQuery);
        }
        this.checkMember(this.DIRECTION, orderQuery);
        let direction = orderQuery[this.DIRECTION];
        if (!(direction in Direction)) {
            throw new InsightError(`Invalid ${this.ORDER} direction.`);
        }
        this.checkMember(this.ORDERKEYS, orderQuery);
        let orderKeys = orderQuery[this.ORDERKEYS];
        this.checkIsArray(orderKeys, this.ORDERKEYS);
        let orderKeysId = orderKeys.map((key: string) => this.getIdFromAnyKey(key));
        let resultId = this.checkNonNullIds(orderKeysId);
        let newOrderKeys = orderKeys.map((key: string) => this.getFieldFromAnyKey(key));
        orderQuery[this.ORDERKEYS] = newOrderKeys;

        return resultId;
    }

    private static extractIdWhere(query: any): null | string {
        return this.extractIdFilter(query[this.WHERE], this.WHERE);
    }

    private static extractIdFilter(query: any, parent: string): null | string {
        let numOperators = Object.keys(query).length;
        switch (parent) {
            case this.WHERE:
                if (numOperators === 0) {
                    return null;
                }
            case this.AND:
            case this.OR:
            case this.NOT:
                if (numOperators !== 1) {
                    throw new InsightError(`${parent} should only have 1 key, has ${numOperators}.`);
                }
            default:
                break;
        }
        let operator = Object.keys(query)[0];
        if (operator === this.AND || operator === this.OR) {
            let subQueries = query[operator];
            this.checkIsArray(subQueries, operator);
            this.checkNonEmptyArray(subQueries, operator);
            let ids: string[] = subQueries.map(
                (subQuery: any) => this.extractIdFilter(subQuery, operator)
            );
            if (!ids.every((val, i, arr) => val === arr[0])) {
                throw new InsightError("Cannot query more than one dataset.");
            }
            return ids[0];
        } else if (operator === this.NOT) {
            return this.extractIdFilter(query[operator], operator);
        } else {
            let numKeys = Object.keys(query[operator]).length;
            if (numKeys !== 1) {
                throw new InsightError(`${operator} should only have 1 key, has ${numKeys}.`);
            }
            let key = Object.keys(query[operator])[0];
            let val = query[operator][key];
            let id = this.getIdFromKey(key);
            let newKey = this.getFieldFromKey(key);
            query[operator][newKey] = val;
            delete query[operator][key];
            return id;
        }
    }

    private static getIdFromAnyKey(key: string): null | string {
        if (this.isApplyKey(key)) {
            return null;
        }
        return this.getIdFromKey(key);
    }

    private static getFieldFromAnyKey(key: string): null | string {
        if (this.isApplyKey(key)) {
            return key;
        }
        return this.getFieldFromKey(key);
    }

    private static getIdFromKey(key: string): string {
        let parts = key.split(this.DELIMINTER);
        if (parts.length !== 2) {
            throw new InsightError(`Invalid Key: ${key}.`);
        }
        return parts[0];
    }

    private static getFieldFromKey(key: string): string {
        let parts = key.split(this.DELIMINTER);
        if (parts.length !== 2) {
            throw new InsightError(`Invalid Key: ${key}.`);
        }
        return parts[1];
    }

    private static isApplyKey(key: string): boolean {
        return !key.includes(this.DELIMINTER);
    }

    private static checkNonNullIds(ids: any[]): null | any {
        let nonNullIds: any[] = ids.filter((id: any) => id !== null);
        if (nonNullIds.length === 0) {
            return null;
        }
        return this.checkIds(nonNullIds);
    }

    private static checkIds(ids: any[]): any {
        if (!ids.reduce((acc: boolean, id: any) => acc && id === ids[0], true)) {
            throw new InsightError("Cannot query more than one dataset.");
        }
        return ids[0];
    }

    private static checkIsArray(array: any, parent: string): void {
        if (!Array.isArray(array)) {
            throw new InsightError(`${parent} expects an array.`);
        }
    }

    private static checkMember(member: string, query: any): void {
        if (!(member in query)) {
            throw new InsightError(`Missing ${member}.`);
        }
    }

    private static checkNonEmptyArray(array: any[], parent: string): void {
        if (array.length === 0) {
            throw new InsightError(`Empty array is not allowed for ${parent}.`);
        }
    }
}

export enum ApplyToken {
    MAX = "MAX", MIN = "MIN", AVG = "AVG", COUNT = "COUNT", SUM = "SUM"
}

export enum Direction {
    UP = "UP", DOWN = "DOWN"
}
