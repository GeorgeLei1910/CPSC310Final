import { promises as fsPromises } from "fs";
import * as fs from "fs";
import { ItemDataset } from "./DatasetUtil";

const path = require("path");

/**
 * A controller for adding, removing, or viewing stored datasets
 */
export default class InsightDataController {
    private static dataDir = "data";

    /**
     * Add a dataset to the data directory
     * This function assumes the dataset does not have a duplicate id as any
     * other added datasets.
     *
     * @param dataset The dataset object to be added
     *
     * @return Promise <void>
     *
     * The promise should fulfill on a successful add, reject for any failures.
     *
     */
    public static addDataset(dataset: ItemDataset): Promise<void> {
        InsightDataController.checkDataDir();
        return fsPromises.writeFile(this.joinDataPath(dataset.id), JSON.stringify(dataset))
            .catch((err) => Promise.reject(err));
    }

    /**
     * Remove the indicated dataset from the data directory and loaded datasets.
     *
     * @param id The id of the dataset object to be removed
     *
     * @return Promise <void>
     *
     * The promise should fulfill on a successful removal, reject for any failures.
     *
     * This function assumes the id is valid and the dataset that it refers to
     * was successfully added before and exists.
     *
     */
    public static removeDataset(id: string): Promise<void> {
        InsightDataController.checkDataDir();
        return fsPromises.unlink(this.joinDataPath(id))
            .catch((err) => Promise.reject(err));
    }

    /**
     * List all the datasets in the data directory.
     *
     *
     * @return Promise <CourseDataset[]>
     *
     * The promise should fulfill on a successful list, reject for any failures.
     *
     */
    public static listDatasets(): Promise<ItemDataset[]> {
        InsightDataController.checkDataDir();
        return fsPromises.readdir(this.dataDir)
            .then((files) =>
                Promise.all(files.map(
                    (file) => fsPromises.readFile(this.joinDataPath(file), "utf8"))))
            .then((dataStrings) => dataStrings.map(
                    (dataString) => JSON.parse(dataString)))
            .catch((err) => Promise.reject(err));
    }

    /**
     * List all the ids of all the datasets in the data directory.
     *
     *
     * @return Promise <string[]>
     *
     * The promise should fulfill on a successful list, reject for any failures.
     *
     */
    public static listDatasetIDs(): Promise<string[]> {
        InsightDataController.checkDataDir();
        return fsPromises.readdir(this.dataDir)
            .catch((err) => Promise.reject(err));
    }

    private static checkDataDir(): void {
        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir);
        }
    }

    /**
     * For testing use only.
     */
    public static setDataDir(dataDir: string): void {
        this.dataDir = dataDir;
    }

    public static getDataDir(): string {
        return this.dataDir;
    }

    private static joinDataPath(file: string): string {
        return path.join(this.dataDir, file);
    }
}
