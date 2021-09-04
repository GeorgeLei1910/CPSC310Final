import MFilter from "./MFilter";

export default class EQFilter extends MFilter {
    public applyTo(item: any): boolean {
        return item[this.field] === this.value;
    }
}
