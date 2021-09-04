import LogicFilter from "./LogicFilter";

export default class ANDFilter extends LogicFilter {
    protected compare(resultA: boolean, resultB: boolean): boolean {
        return resultA && resultB;
    }
}
