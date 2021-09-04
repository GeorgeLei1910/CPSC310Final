import Query from "../Query";
import QueryUtil from "../QueryUtil";
import EmptyTransformation from "./EmptyTransformation";
import Transformation from "./Transformation";

export default class TransformationFactory {
    public static getITransformation(query: any, queryObj: Query) {
        if (!(QueryUtil.TRANSFORMATIONS in query)) {
            return new EmptyTransformation(queryObj);
        }
        return new Transformation(query[QueryUtil.TRANSFORMATIONS], queryObj);
    }
}
