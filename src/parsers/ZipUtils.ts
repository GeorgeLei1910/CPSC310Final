import {InsightError, NotFoundError} from "../controller/IInsightFacade";
import InsightDataController from "../controller/InsightDataController";


export class ZipUtil {

    private static regex = new RegExp(/[\s\n]/gi);

    private static checkIDValidity(id: string): string {
        id = id.replace(this.regex, "");
        if (id.length && !id.includes("_")) {
            return id;
        }
        throw new InsightError("Invalid ID");
    }

    public static checkRemoveValidity(id: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            try {
                id = ZipUtil.checkIDValidity(id);
                InsightDataController.listDatasetIDs().then((arr) => {
                    if (arr.includes(id)) {
                        return InsightDataController.removeDataset(id)
                            .then(() => resolve(id))
                            .catch((err) => reject(err));
                    } else {
                        return reject(new NotFoundError("Dataset Not Found"));
                    }
                }).catch((err) => reject(err));
            } catch (e) {
               return reject(e);
            }
        });
    }

    public static checkAddValidity(id: string, content: string): Promise<string> {
        return new Promise<string>(((resolve, reject) => {
            try {
                id = ZipUtil.checkIDValidity(id);
                InsightDataController.listDatasetIDs().then((arr) => {
                    if (arr.includes(id)) {
                        return reject(new InsightError("ID already exists in dataset"));
                    }
                    if (!content) {
                        return reject(new InsightError("No Content"));
                    }
                    return resolve(id);
                }).catch((err) => reject(err));
            } catch (e) {
                return reject(e);
            }
        }));
    }
}
