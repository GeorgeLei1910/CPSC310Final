import { InsightError } from "../../../controller/IInsightFacade";
import Query from "../../Query";
import { ApplyToken } from "../../QueryUtil";
import ApplyRule from "./ApplyRule";
import AvgApplyRule from "./AvgApplyRule";
import CountApplyRule from "./CountApplyRule";
import MaxApplyRule from "./MaxApplyRule";
import MinApplyRule from "./MinApplyRule";
import SumApplyRule from "./SumApplyRule";

export default class ApplyRuleFactory {
    public static getApplyRule(ruleQuery: any, queryObj: Query): ApplyRule {
        let applyKey = Object.keys(ruleQuery)[0];
        let ruleContent: any = ruleQuery[applyKey];
        let applyToken: string = this.stringToApplyToken(Object.keys(ruleContent)[0]);

        switch (applyToken) {
            case ApplyToken.AVG:
                return new AvgApplyRule(ruleQuery, queryObj);

            case ApplyToken.COUNT:
                return new CountApplyRule(ruleQuery, queryObj);

            case ApplyToken.MAX:
                return new MaxApplyRule(ruleQuery, queryObj);

            case ApplyToken.MIN:
                return new MinApplyRule(ruleQuery, queryObj);

            case ApplyToken.SUM:
                return new SumApplyRule(ruleQuery, queryObj);

            default:
                throw new InsightError(`Invalid apply token: ${applyToken}`);
        }
    }

    private static stringToApplyToken(applyToken: string): ApplyToken {
        switch (applyToken) {
            case ApplyToken.AVG:
                return ApplyToken.AVG;

            case ApplyToken.COUNT:
                return ApplyToken.COUNT;

            case ApplyToken.MAX:
                return ApplyToken.MAX;

            case ApplyToken.MIN:
                return ApplyToken.MIN;

            case ApplyToken.SUM:
                return ApplyToken.SUM;

            default:
                throw new InsightError(`Invalid apply token: ${applyToken}`);
        }
    }
}
