// import { expect } from "chai";
// import * as chai from "chai";
// import * as fs from "fs-extra";
// import * as chaiAsPromised from "chai-as-promised";
// import {InsightDataset, InsightDatasetKind} from "../src/controller/IInsightFacade";
// import { CourseDataset } from "../src/controller/Dataset";
// import InsightDataController from "../src/controller/InsightDataController";
// import Log from "../src/Util";
// import { promises as fsPromise } from "fs";


// describe("InsightDataController Add/Remove/List Dataset", function () {
//     // Reference any datasets you've added to test/data here and they will
//     // automatically be loaded in the 'before' hook.
//     const datasetsToLoad: CourseDataset[] = [
//         {
//             id: "math_courses",
//             kind: InsightDatasetKind.Courses,
//             numRows: 2,
//             courses: [
//                 {
//                     dept: "Math",
//                     id: "MATH100",
//                     avg: 80,
//                     instructor: "Bob Smith",
//                     title: "Differential Calculus",
//                     pass: 200,
//                     fail: 30,
//                     audit: 10,
//                     uuid: "abc123",
//                     year: 2010
//                 },
//                 {
//                     dept: "Math",
//                     id: "MATH101",
//                     avg: 75,
//                     instructor: "John Doe",
//                     title: "Integral Calculus",
//                     pass: 180,
//                     fail: 40,
//                     audit: 5,
//                     uuid: "def456",
//                     year: 2011
//                 }
//             ]
//         },
//         {
//             id: "physics_courses",
//             kind: InsightDatasetKind.Courses,
//             numRows: 2,
//             courses: [
//                 {
//                     dept: "Science",
//                     id: "PHYS101",
//                     avg: 90,
//                     instructor: "David William",
//                     title: "Energy and Waves",
//                     pass: 300,
//                     fail: 50,
//                     audit: 20,
//                     uuid: "ghi789",
//                     year: 2013
//                 },
//                 {
//                     dept: "Science",
//                     id: "PHYS101",
//                     avg: 60,
//                     instructor: "William David",
//                     title: "Electricity, Light and Radiation",
//                     pass: 40,
//                     fail: 140,
//                     audit: 15,
//                     uuid: "jkl000",
//                     year: 2013
//                 }
//             ]
//         }
//     ];
//     const cacheDir = __dirname + "/../data";

//     before(function () {
//         // This section runs once and loads all datasets specified in the datasetsToLoad object
//         // into the datasets object
//         Log.test(`Before all`);
//         chai.use(chaiAsPromised);
//         if (!fs.existsSync(cacheDir)) {
//             fs.mkdirSync(cacheDir);
//         }
//         InsightDataController.setDataDir(cacheDir);
//     });

//     beforeEach(function () {
//         Log.test(`BeforeTest: ${this.currentTest.title}`);
//     });

//     after(function () {
//         Log.test(`After: ${this.test.parent.title}`);
//     });

//     afterEach(function () {
//         // This section resets the data directory (removing any cached data) and resets the InsightFacade instance
//         // This runs after each test, which should make each test independent from the previous one
//         Log.test(`AfterTest: ${this.currentTest.title}`);
//         try {
//             fs.removeSync(cacheDir);
//             fs.mkdirSync(cacheDir);
//         } catch (err) {
//             Log.error(err);
//         }
//     });

//     /////////////////////////////////////////////////////////////////////////////////////////////////
//     /////////////////////////////////////// addDataset //////////////////////////////////////////////
//     /////////////////////////////////////////////////////////////////////////////////////////////////

//     it("Should add a valid course dataset to data directory", function () {
//         const expected: string[] = [datasetsToLoad[0].id];
//         const futureResult: Promise<string[]> = InsightDataController.addDataset(datasetsToLoad[0])
//             .then(() => {
//                 let i = InsightDataController.getLoadedDatasets();
//                 expect(i[datasetsToLoad[0].id]).to.deep.equal(datasetsToLoad[0]);
//                 return fsPromise.readdir(InsightDataController.getDataDir());
//             });
//         return expect(futureResult).to.eventually.deep.equal(expected);
//     });

//     it("Should add valid course datasets to data directory", function () {
//         const expected: string[] = datasetsToLoad.map((dataset) => dataset.id);
//         const futureResult: Promise<string[]> = Promise.all(
//             datasetsToLoad.map((dataset) => InsightDataController.addDataset(dataset))
//         ).then(() => fsPromise.readdir(InsightDataController.getDataDir()));
//         return expect(futureResult).to.eventually.deep.equal(expected);
//     });

//     /////////////////////////////////////////////////////////////////////////////////////////////////
//     ///////////////////////////////////// removeDataset /////////////////////////////////////////////
//     /////////////////////////////////////////////////////////////////////////////////////////////////

//     it("Should remove a valid course dataset to data directory", function () {
//         const id: string = datasetsToLoad[0].id;
//         const expected: string[] = [];
//         const futureResult: Promise<string[]> = InsightDataController.addDataset(datasetsToLoad[0])
//             .then(() => InsightDataController.removeDataset(id))
//             .then(() => fsPromise.readdir(InsightDataController.getDataDir()));
//         return expect(futureResult).to.eventually.deep.equal(expected);
//     });


//     /////////////////////////////////////////////////////////////////////////////////////////////////
//     ////////////////////////////////////// listDatesets /////////////////////////////////////////////
//     /////////////////////////////////////////////////////////////////////////////////////////////////

//     it("Should list datasets in the data directory correctly", function () {
//         const expected: CourseDataset[] = datasetsToLoad;
//         const futureResult: Promise<InsightDataset[]> = Promise.all(
//             datasetsToLoad.map((dataset) => InsightDataController.addDataset(dataset))
//         ).then(() => InsightDataController.listDatasets());
//         return expect(futureResult).to.eventually.deep.equal(expected);
//     });


//     /////////////////////////////////////////////////////////////////////////////////////////////////
//     ////////////////////////////////////// loadAllDatesets //////////////////////////////////////////
//     /////////////////////////////////////////////////////////////////////////////////////////////////

//     it("Should load datasets in the data directory correctly", function () {
//         const expected: {[id: string]: CourseDataset} = {};
//         datasetsToLoad.map(
//             (dataset) => expected[dataset.id] = dataset
//         );
//         const futureResult: Promise<{[id: string]: InsightDataset}> = Promise.all(
//             datasetsToLoad.map((dataset) => InsightDataController.addDataset(dataset))
//         ).then(() => InsightDataController.loadAllDatasets())
//             .then(() => InsightDataController.getLoadedDatasets());
//         return expect(futureResult).to.eventually.deep.equal(expected);
//     });
// });
