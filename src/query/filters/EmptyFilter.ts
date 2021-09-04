import IFilter from "./IFilter";

export default class EmptyFilter implements IFilter {
    public filter(item: any[]): any[] {
        return item;
    }
}
