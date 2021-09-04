import * as JSZip from "jszip";
import {JSZipObject} from "jszip";
import {InsightDatasetKind, InsightError} from "../controller/IInsightFacade";
import InsightDataController from "../controller/InsightDataController";
import {ZipUtil} from "./ZipUtils";

export abstract class ItemParser {
    private id: string;
    private kind: InsightDatasetKind;
    private name: string;

    protected constructor(id: string, kind: InsightDatasetKind) {
        this.id = id;
        this.kind = kind;
        switch (kind) {
            case InsightDatasetKind.Rooms: this.name = "rooms";
                                           break;
            case InsightDatasetKind.Courses: this.name = "courses";
                                             break;
        }
    }

    public filterFiles(data: JSZip): JSZipObject[] {
        let filesarr: JSZipObject[] = Object.values(data.folder(this.name).files);
        if (filesarr.length === 0) {
            throw new InsightError();
        }
        filesarr = filesarr.filter((obj) => obj.dir === false && obj.name.indexOf(this.name + "/") === 0);
        return filesarr;
    }

    public getStringFromObj(files: JSZipObject[]): Promise<any[]> {
        let func = files.map((key) => key.async("string").then(
            (str) => ({ name: key.name, val: str })));
        return Promise.all(func);
    }

    public abstract parseItem(item: any[]): Promise<any[]>;
    public saveList(save: any[]): Promise<string[]> {
        if (save.length) {
            return InsightDataController.addDataset({id: this.id, numRows: save.length, kind: this.kind, items: save})
                .then(() => InsightDataController.listDatasetIDs())
                .catch(() => {
                    throw new InsightError("Error While Adding");
                });
        }
        throw new InsightError("No Valid Dataset");
    }
}
