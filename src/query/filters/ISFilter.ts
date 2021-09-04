import { InsightError } from "../../controller/IInsightFacade";
import Query from "../Query";
import QueryUtil from "../QueryUtil";
import MSFilter from "./MSFilter";

export default class ISFilter extends MSFilter {
    protected value: string;

    constructor(query: any, queryObj: Query) {
        super(query, queryObj);
        if (!this.query.isValidSField(this.field)) {
            throw new InsightError(`Invalid field: ${this.field}.`);
        }

        let value = query[this.field];
        if (typeof value !== "string") {
            throw new InsightError(`Invalid value type for ${this.field}.`);
        }
        if (value.length >= 3 && value.substring(1, value.length - 1).includes("*")) {
            throw new InsightError(`Invalid input string: ${value}.`);
        }
        this.value = query[this.field];
    }

    public applyTo(item: any): boolean {
        let itemValue: string = this.getitemValue(item);

        if (this.isWildCardOnly()) {
            return true;
        } else if (this.isWildCardFront()) {
            return itemValue.endsWith(this.value.substring(1));
        } else if (this.isWildCardBack()) {
            return itemValue.startsWith(this.value.substring(0, this.value.length - 1));
        } else if (this.isWildCardFrontAndBack()) {
            return itemValue.includes(this.value.substring(1, this.value.length - 1));
        } else {
            return itemValue === this.value;
        }
    }

    private isWildCardOnly(): boolean {
        return this.value.startsWith(QueryUtil.WILDCARD) &&
            this.value.endsWith(QueryUtil.WILDCARD) &&
            this.value.length < 3;
    }

    private isWildCardFront(): boolean {
        return this.value.startsWith(QueryUtil.WILDCARD) &&
            !this.value.endsWith(QueryUtil.WILDCARD);
    }

    private isWildCardBack(): boolean {
        return !this.value.startsWith(QueryUtil.WILDCARD) &&
            this.value.endsWith(QueryUtil.WILDCARD);
    }

    private isWildCardFrontAndBack(): boolean {
        return this.value.startsWith(QueryUtil.WILDCARD) &&
            this.value.endsWith(QueryUtil.WILDCARD);
    }

    private getitemValue(item: any): string {
        return item[this.field].toString();
    }
}
