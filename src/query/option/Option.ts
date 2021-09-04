import QueryUtil from "../QueryUtil";
import { InsightError } from "../../controller/IInsightFacade";
import OrderFactory from "./orders/OrderFactory";
import IOrder from "./orders/IOrder";
import ITransformation from "../transformations/ATransformation";
import Query from "../Query";

export default class Option {
    private id: string;
    private columns: string[];
    private order: IOrder;
    private transformation: ITransformation;
    private query: Query;

    constructor(query: any, id: string, transformation: ITransformation, queryObj: Query) {
        this.id = id;
        this.transformation = transformation;
        this.query = queryObj;

        let optionQuery = query[QueryUtil.OPTIONS];
        this.columns = optionQuery[QueryUtil.COLUMNS];
        this.checkColumns();
        this.order = OrderFactory.getIOrder(optionQuery, this.columns);
    }

    public select(items: any[]): any[] {
        return this.order.sort(items)
            .map(
                (item) => this.selectOptions(item)
            );
    }

    private getFieldWithId(field: string): string {
        return this.transformation.isApplyKey(field) ? field : this.id + QueryUtil.DELIMINTER + field;
    }

    private selectOptions(item: any): any {
        return Object.assign({},
            ...this.columns.map(
                (field: string) => this.getFieldValue(item, field)));
    }

    private getFieldValue(item: any, field: string): any {
        let idKey: string = this.getFieldWithId(field);

        if (this.query.isValidSField(field)) {
            return {
                [idKey] : item[field].toString()
            };
        }
        return {
            [idKey] : item[field]
        };
    }

    private checkColumns(): void {
        let invalidColumns: string[] = this.columns.filter(
            (column: string) => !this.transformation.isUsableColumnKey(column)
        );
        if (invalidColumns.length !== 0) {
            throw new InsightError(`Invalid ${QueryUtil.COLUMNS} key(s): ${invalidColumns}`);
        }
    }
}
