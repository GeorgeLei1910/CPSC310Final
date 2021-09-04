import {InsightDatasetKind} from "../controller/IInsightFacade";
import {ItemParser} from "./ItemParser";
import {Course, DatasetUtil} from "../controller/DatasetUtil";
import Log from "../Util";


export class CoursesParser extends ItemParser {

    constructor(id: string) {
        super(id, InsightDatasetKind.Courses);
    }

    public parseItem(item: any[]): Promise<any[]> {
        return new Promise<any[]>(((resolve, reject) => {
            let dataset: Course[] = [];
            item.map((str) => {
                try {
                    let obj: object[] = JSON.parse(str.val).result;
                    if (obj) {
                        obj.map((course: any) => {
                            try {
                                let entry = DatasetUtil.makeCourse(course);
                                dataset.push(entry);
                            } catch (e) {
                                Log.error("Empty / Invalid Course");
                            }
                        });
                    }
                } catch (e) {
                    Log.error("Invalid JSON file");
                }
            });
            return resolve(dataset);
        }));
    }
}
