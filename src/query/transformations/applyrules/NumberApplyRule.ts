import ApplyRule from "./ApplyRule";

export default abstract class NumberApplyRule extends ApplyRule {
    protected checkKey(): void {
        if (!this.query.isValidMField(this.key)) {
            this.throwKeyTypeError();
        }
    }
}
