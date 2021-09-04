import MFilter from "./MFilter";

export default class GTFilter extends MFilter {
    public applyTo(item: any): boolean {
        return item[this.field] > this.value;
    }
}
