import MFilter from "./MFilter";

export default class LTFilter extends MFilter {
    public applyTo(item: any): boolean {
        return item[this.field] < this.value;
    }
}
