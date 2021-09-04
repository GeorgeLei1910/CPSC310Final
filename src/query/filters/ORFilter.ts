import LogicFilter from "./LogicFilter";

export default class ORFilter extends LogicFilter {
    protected compare(resultA: boolean, resultB: boolean): boolean {
        return resultA || resultB;
    }
}
