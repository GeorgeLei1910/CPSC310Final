import {ItemDataset} from "../controller/DatasetUtil";
import IFilter from "./filters/IFilter";
import FilterFactory from "./filters/FilterFactory";
import Option from "./option/Option";
import QueryUtil from "./QueryUtil";
import { ResultTooLargeError } from "../controller/IInsightFacade";
import ATransformation from "./transformations/ATransformation";
import TransformationFactory from "./transformations/TransformationFactory";

export default class Query {
    private filter: IFilter;
    private option: Option;
    private transformation: ATransformation;
    private mfields: string[] = null;
    private sfields: string[] = null;

    constructor(query: any, id: string) {
        this.filter = FilterFactory.getIFilter(query, this);
        this.transformation = TransformationFactory.getITransformation(query, this);
        this.option = new Option(query, id, this.transformation, this);
    }

    public applyQuery(dataset: ItemDataset): any[] {
        let items: any[] = dataset.items;
        let filteredItems: any[] = this.filter.filter(items);
        if (filteredItems.length > QueryUtil.MAXLENGTH) {
            throw new ResultTooLargeError();
        }
        let transformedItems: any[] = this.transformation.transform(filteredItems);
        let selectedItems: any[] = this.option.select(transformedItems);
        return selectedItems;
    }

    public isValidMField(field: string): boolean {
        if (this.mfields === null) {
            if (QueryUtil.COURSESMFIELDS.includes(field)) {
                this.mfields = QueryUtil.COURSESMFIELDS;
                this.sfields = QueryUtil.COURSESSFIELDS;
                return true;
            } else if (QueryUtil.ROOMSMFIELDS.includes(field)) {
                this.mfields = QueryUtil.ROOMSMFIELDS;
                this.sfields = QueryUtil.ROOMSSFIELDS;
                return true;
            } else {
                return false;
            }
        }
        return this.mfields.includes(field);
    }

    public isValidSField(field: string): boolean {
        if (this.sfields === null) {
            if (QueryUtil.COURSESSFIELDS.includes(field)) {
                this.mfields = QueryUtil.COURSESMFIELDS;
                this.sfields = QueryUtil.COURSESSFIELDS;
                return true;
            } else if (QueryUtil.ROOMSSFIELDS.includes(field)) {
                this.mfields = QueryUtil.ROOMSMFIELDS;
                this.sfields = QueryUtil.ROOMSSFIELDS;
                return true;
            } else {
                return false;
            }
        }
        return this.sfields.includes(field);
    }

    public isValidField(field: string): boolean {
        return this.isValidMField(field) || this.isValidSField(field);
    }
}
