import Log from "../Util";
import {
    IInsightFacade, InsightDataset, InsightDatasetKind, InsightError
} from "./IInsightFacade";
import InsightDataController from "./InsightDataController";
import * as JSZip from "jszip";
import {ItemDataset} from "./DatasetUtil";
import QueryUtil from "../query/QueryUtil";
import Query from "../query/Query";
import {CoursesParser} from "../parsers/CoursesParser";
import {ZipUtil} from "../parsers/ZipUtils";
import {ItemParser} from "../parsers/ItemParser";
import {RoomsParser} from "../parsers/RoomsParser";
/**
 * This is the main programmatic entry point for the project.
 * Method documentation is in IInsightFacade
 *
 */
export default class InsightFacade implements IInsightFacade {
    constructor() {
        Log.trace("InsightFacadeImpl::init()");
    }

    public addDataset(id: string, content: string, kind: InsightDatasetKind): Promise<string[]> {
        return ZipUtil.checkAddValidity(id, content).then((newid) => {
            let toSave: ItemParser = null;
            switch (kind) {
                case InsightDatasetKind.Courses: toSave = new CoursesParser(newid);
                                                 break;
                case InsightDatasetKind.Rooms: toSave = new RoomsParser(newid);
                                               break;
                default: return Promise.reject(new InsightError("Dataset Kind does not exist"));
            }
            return JSZip.loadAsync(content, {base64: true}).then(
                (data) => toSave.filterFiles(data)
            ).then((files) => toSave.getStringFromObj(files)
            ).then((vip) => toSave.parseItem(vip)
            ).then((save) => toSave.saveList(save))
                .catch((e) => Promise.reject(new InsightError(e.message)));
        }).catch((e) => {
            return Promise.reject(new InsightError(e.message));
        });
    }

    public removeDataset(id: string): Promise<string> {
        return ZipUtil.checkRemoveValidity(id)
            .catch((err) => Promise.reject(new InsightError(err.message)));
    }

    public performQuery(query: any): Promise<any[]> {
        let id: string;
        let queryObj: Query;
        try {
            id = QueryUtil.extractId(query);
            queryObj = new Query(query, id);
        } catch (err) {
            return Promise.reject(err);
        }
        return InsightDataController.listDatasets()
            .then((datasets) => datasets.filter((dataset) => dataset.id === id))
            .then((datasets) => this.checkDatasetsLength(datasets))
            .then((dataset) => queryObj.applyQuery(dataset))
            .catch((err) => Promise.reject(new InsightError(err.message)));
    }

    public listDatasets(): Promise<InsightDataset[]> {
        return InsightDataController.listDatasets()
            .then((datasets: ItemDataset[]) => datasets.map(
                (dataset: ItemDataset) => {
                    delete dataset["items"];
                    return dataset;
                }))
            .catch((err) => Promise.reject(new InsightError(err.message)));
    }

    private checkDatasetsLength(datasets: ItemDataset[]): any {
        if (datasets.length) {
            return datasets[0];
        }
        throw new InsightError("Referenced dataset not found.");
    }
}
