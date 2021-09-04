// import * as chai from "chai";
// import {expect} from "chai";
// import * as fs from "fs-extra";
// import * as chaiAsPromised from "chai-as-promised";
// import {InsightDataset, InsightDatasetKind, InsightError, NotFoundError} from "../src/controller/IInsightFacade";
// import InsightDataController from "../src/controller/InsightDataController";
// import InsightFacade from "../src/controller/InsightFacade";
// import Log from "../src/Util";
// import TestUtil from "./TestUtil";
// import {RoomsParser} from "../src/parsers/RoomsParser";

// This should match the schema given to TestUtil.validate(..) in TestUtil.readTestQueries(..)
// except 'filename' which is injected when the file is read.
export interface ITestQuery {
    title: string;
    query: any; // make any to allow testing structurally invalid queries
    isQueryValid: boolean;
    result: any;
    filename: string; // This is injected when reading the file
}

// describe("InsightFacade Add/Remove/List Dataset", function () {
//     // Reference any datasets you've added to test/data here and they will
//     // automatically be loaded in the 'before' hook.
//     const datasetsToLoad: { [id: string]: string } = {
//         courses: "./test/data/courses.zip",
//         rooms: "./test/data/rooms.zip",
//         courses_: "./test/data/coursesUnderscore.zip",
//         coursesXSEC: "./test/data/coursesXSEC.zip",
//         coursesShort: "./test/data/CoursesShort.zip",
//         coursesMV: "./test/data/CoursesMissingValues.zip",
//         coursesNest: "./test/data/courseNested.zip",
//         coursesEmpty: "./test/data/coursesEmpty.zip",
//         courses1900: "./test/data/courses1900.zip",
//         invalidZipFile: "./test/data/index.htm",
//         invalidRooms: "./test/data/notHtml.zip",
//         invalidBuilding: "./test/data/notBldgHtml.zip",
//         missingValueRooms: "./test/data/missValues.zip",
//         missingLatlonRooms: "./test/data/noLatLon.zip",
//         noRooms: "./test/data/noRooms.zip",
//         noRoomIdx: "./test/data/noIndex.zip",
//         noFolder: "./test/data/noFolder.zip"
//     };
//     let datasets: { [id: string]: string } = {};
//     let insightFacade: InsightFacade;
//     const cacheDir = __dirname + "/../data";

//     before(function () {
//         // This section runs once and loads all datasets specified in the datasetsToLoad object
//         // into the datasets object
//         Log.test(`Before all`);
//         chai.use(chaiAsPromised);
//         if (fs.existsSync(cacheDir)) {
//             fs.removeSync(cacheDir);
//         }
//         fs.mkdirSync(cacheDir);
//         for (const id of Object.keys(datasetsToLoad)) {
//             datasets[id] = fs
//                 .readFileSync(datasetsToLoad[id])
//                 .toString("base64");
//         }
//         try {
//             insightFacade = new InsightFacade();
//         } catch (err) {
//             Log.error(err);
//         }
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
//             Log.info(cacheDir);
//             fs.removeSync(cacheDir);
//             fs.mkdirSync(cacheDir);
//             insightFacade = new InsightFacade();
//         } catch (err) {
//             Log.error(err);
//         }
//     });

//     /////////////////////////////////////////////////////////////////////////////////////////////////
//     /////////////////////////////////////// addDataset //////////////////////////////////////////////
//     /////////////////////////////////////////////////////////////////////////////////////////////////
//     it("Should add a valid courses dataset", function () {
//         const id: string = "courses";
//         const expected: string[] = [id];
//         const futureResult: Promise<string[]> = insightFacade.addDataset(
//             id,
//             datasets[id],
//             InsightDatasetKind.Courses,
//         );
//         return expect(futureResult).to.eventually.deep.equal(expected);
//     });

//     it("Should add a valid rooms dataset", function () {
//         const id: string = "rooms";
//         const expected: string[] = [id];
//         const futureResult: Promise<string[]> = insightFacade.addDataset(
//             id,
//             datasets[id],
//             InsightDatasetKind.Rooms,
//         );
//         return expect(futureResult).to.eventually.deep.equal(expected)
//             .then(() => InsightDataController.listDatasets())
//             .then((idat) => {
//                 let thiser = idat;
//             });
//     });

//     it("Should add valid datasets", function () {
//         const id1: string = "courses";
//         const id2: string = "rooms";
//         const expected: string[] = [id1, id2];
//         const futureResult: Promise<string[]> = insightFacade
//             .addDataset(id1, datasets[id1], InsightDatasetKind.Courses)
//             .then(() =>
//                 insightFacade.addDataset(
//                     id2,
//                     datasets[id2],
//                     InsightDatasetKind.Rooms,
//                 ),
//             );
//         return expect(futureResult).to.eventually.deep.equal(expected);
//     });

//     it("Should reject adding a dataset with invalid id containing an underscore", function () {
//         const id: string = "courses_";
//         const action: Promise<string[]> = insightFacade.addDataset(
//             id,
//             datasets[id],
//             InsightDatasetKind.Courses,
//         );
//         return expect(action).to.eventually.be.rejectedWith(InsightError).then(() =>
//             expect(InsightDataController.listDatasets()).to.eventually.have.length(0)
//         );
//     });

//     it("Should reject adding a dataset with invalid id containing only white space", function () {
//         const id: string = " ";
//         const action: Promise<string[]> = insightFacade.addDataset(
//             id,
//             "",
//             InsightDatasetKind.Courses,
//         );
//         return expect(action).to.eventually.be.rejectedWith(InsightError);
//     });
//     it("Should add ids with blank spaces in the end", function () {
//         const id: string = "courses ";
//         const expected: string[] = ["courses"];
//         const futureResult: Promise<string[]> = insightFacade.addDataset(
//             id,
//             datasets["courses"],
//             InsightDatasetKind.Courses,
//         );
//         return expect(futureResult).to.eventually.deep.equal(expected);
//     });
//     it("Should add ids with blank spaces in the middle id string", function () {
//         const id: string = "cou rses";
//         const expected: string[] = ["courses"];
//         const futureResult: Promise<string[]> = insightFacade.addDataset(
//             id,
//             datasets["courses"],
//             InsightDatasetKind.Courses,
//         );
//         return expect(futureResult).to.eventually.deep.equal(expected);
//     });
//     it("Should add ids with blank spaces in the start", function () {
//         const id: string = " courses";
//         const expected: string[] = ["courses"];
//         const futureResult: Promise<string[]> = insightFacade.addDataset(
//             id,
//             datasets["courses"],
//             InsightDatasetKind.Courses,
//         );
//         return expect(futureResult).to.eventually.deep.equal(expected);
//     });
//     it("Should reject with no valid course seleciton", () => {
//         const id: string = "coursesEmpty";
//         const action: Promise<string[]> = insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
//         return expect(action).to.eventually.be.rejectedWith(InsightError).then(() => {
//             let list = InsightDataController.listDatasets();
//             return expect(list).to.eventually.have.length(0);
//         });
//     });
//     it("Should not save a new dataset with a repeating id", function () {
//         const id: string = "courses";
//         const expected: string[] = [id];
//         const action: Promise<string[]> = insightFacade
//             .addDataset(id, datasets[id], InsightDatasetKind.Courses)
//             .then(() => insightFacade.addDataset( id, datasets[id], InsightDatasetKind.Courses));
//         return expect(action).to.eventually.be.rejectedWith(InsightError)
//             .then(() => {
//                 let list = InsightDataController.listDatasets();
//                 return expect(list).to.eventually.have.length(1);
//             }).then(() => {
//                 let list = InsightDataController.listDatasetIDs();
//                 return expect(list).to.eventually.deep.equal(expected);
//             });
//     });
//     //
//     // Zip File tests
//     //
//     it("Should reject non-existant entry", function () {
//         const id: string = "courser";
//         let futureResult: Promise<string[]> = insightFacade.addDataset(
//             id,
//             datasets[id],
//             InsightDatasetKind.Courses,
//         );
//         return expect(futureResult).to.eventually.be.rejectedWith(InsightError);
//     });
//     it("Should reject dataset with no valid courses sections", function () {
//         const id: string = "coursesXSEC";
//         let futureResult: Promise<string[]> = insightFacade.addDataset(
//             id,
//             datasets[id],
//             InsightDatasetKind.Courses,
//         );
//         return futureResult
//             .then(() => {
//                 expect.fail("Should have caught InsightError");
//             }).catch((err: InsightError) => {
//                 return insightFacade.listDatasets().then(
//                     (list) => expect(list).to.have.lengthOf(0)
//                 );
//             });
//     });
//     it("adds only files from courses/ folder", () => {
//         const id: string = "coursesNest";
//         let expected: string[] = [id];
//         let futureResult: Promise<string[]> = insightFacade.addDataset(
//             id,
//             datasets[id],
//             InsightDatasetKind.Courses,
//         );
//         return expect(futureResult).to.eventually.deep.equal(expected).then(() => {
//             return InsightDataController.listDatasets().then((cds) => {
//                 let those = cds[0];
//                 return expect(those.items).to.have.length(34);
//             });
//         });
//     });
//     it("Should remove all invalid courses and add only valid ones", () => {
//         const id: string = "coursesMV";
//         let expected: string[] = [id];
//         let futureResult: Promise<string[]> = insightFacade.addDataset(
//             id,
//             datasets[id],
//             InsightDatasetKind.Courses,
//         );
//         return expect(futureResult).to.eventually.deep.equal(expected).then(() => {
//             return InsightDataController.listDatasets().then((cds) => {
//                 return expect(cds[0].items).to.have.length(9);
//             });
//         });
//     });
//     it("Should add overall as 1900", () => {
//         const id: string = "courses1900";
//         let expected: string[] = [id];
//         let futureResult: Promise<string[]> = insightFacade.addDataset(
//             id,
//             datasets[id],
//             InsightDatasetKind.Courses,
//         );
//         return expect(futureResult).to.eventually.deep.equal(expected)
//             .then(() => InsightDataController.listDatasets()
//                 .then((idc) => expect(idc[0].items[0].year).to.equal(1900)));
//     });
//     it("Should not get anything", () => {
//         const id: string = "noFolder";
//         let futureResult: Promise<string[]> = insightFacade.addDataset(
//             id,
//             datasets[id],
//             InsightDatasetKind.Courses,
//         );
//         return expect(futureResult).to.eventually.rejectedWith(InsightError);
//     });
//     /***
//      * for API getting.
//      *
//      */
//     it("Should grab the LatLon of the Address", () => {
//         let samp = { addr: "1822 East Mall" };
//         let roomParse = new RoomsParser("rooms");
//         let tester = roomParse.getLatLon(samp.addr);
//         return expect(tester).to.eventually.deep.equal({lat: 49.2699, lon: -123.25318});
//     });

//     it("Should throw error for invalid address", () => {
//         let samp = { addr: "9999 East Mall" };
//         let roomParse = new RoomsParser("rooms");
//         let tester = roomParse.getLatLon(samp.addr);
//         return expect(tester).to.eventually.be.rejectedWith(Error);
//     });

//     // /*
//     // Tests for rooms
//     //  */

//     it("Reject invalid zip file", () => {
//         const id: string = "invalidZipFile";
//         let expected: string[] = [id];
//         let futureResult: Promise<string[]> = insightFacade.addDataset(
//             id,
//             datasets[id],
//             InsightDatasetKind.Courses,
//         );
//         return expect(futureResult).to.eventually.be.rejectedWith(InsightError)
//             .then(() => InsightDataController.listDatasets()
//                 .then((idc) => expect(idc).to.have.length(0)));
//     });

//     it("Include rooms with missing values", () => {
//         // ALRD is missing values.
//         const id: string = "missingValueRooms";
//         let expected: string[] = [id];
//         let futureResult: Promise<string[]> = insightFacade.addDataset(
//             id,
//             datasets[id],
//             InsightDatasetKind.Rooms,
//         );
//         return futureResult.then((sf) => InsightDataController.listDatasets()
//                 .then((ids) => {
//                     let check = ids[0].items;
//                     return expect(check).to.have.length(10);
//                 }));
//     });

//     it("Skip buildings with no rooms", () => {
//         // AUDI does not have any rooms
//         const id: string = "missingValueRooms";
//         let expected: string[] = [id];
//         let badBuilding = "";
//         let futureResult: Promise<string[]> = insightFacade.addDataset(
//             id,
//             datasets[id],
//             InsightDatasetKind.Rooms,
//         );
//         return futureResult.then(() => InsightDataController.listDatasets())
//             .then((idc) => idc[0].items.filter((rms) => rms.code === "AUDI"))
//             .then((res) => expect(res).to.have.length(0));
//     });
//     it("Skip buildings with no geolocation", () => {
//         // ALRD has a wrong address
//         const id: string = "missingLatlonRooms";
//         let expected: string[] = [id];
//         let badBuilding = "";
//         let futureResult: Promise<string[]> = insightFacade.addDataset(
//             id,
//             datasets[id],
//             InsightDatasetKind.Rooms,
//         );
//         return futureResult.then((sf) => InsightDataController.listDatasets()
//             .then((ids) => {
//                     expect(ids[0].items).to.have.length(5);
//                     let hasALRD = ids[0].items.filter((item) => item.code === "ALRD");
//                     return expect(hasALRD).to.have.length(0);
//                 }));
//     });
//     it("Reject empty room array", () => {
//         const id: string = "noRooms";
//         let expected: string[] = [id];
//         let futureResult: Promise<string[]> = insightFacade.addDataset(
//             id,
//             datasets[id],
//             InsightDatasetKind.Rooms,
//         );
//         return expect(futureResult).to.eventually.be.rejectedWith(InsightError)
//             .then(() => InsightDataController.listDatasets()
//                 .then((idc) => expect(idc).to.have.length(0)));
//     });
//     it("Reject non-existant index.htm file", () => {
//         const id: string = "noRoomIdx";
//         let expected: string[] = [id];
//         let futureResult: Promise<string[]> = insightFacade.addDataset(
//             id,
//             datasets[id],
//             InsightDatasetKind.Rooms,
//         );
//         return expect(futureResult).to.eventually.be.rejectedWith(InsightError)
//             .then(() => InsightDataController.listDatasets()
//                 .then((idc) => expect(idc).to.have.length(0)));
//     });

//     it("Reject badly directoried files", () => {
//         const id: string = "notInRooms";
//         let expected: string[] = [id];
//         let futureResult: Promise<string[]> = insightFacade.addDataset(
//             id, datasets[id], InsightDatasetKind.Courses,
//         );
//         return expect(futureResult).to.eventually.be.rejectedWith(InsightError)
//             .then(() => InsightDataController.listDatasets()
//                 .then((idc) =>
//                     expect(idc).to.have.length(0)));
//     });


//     /////////////////////////////////////////////////////////////////////////////////////////////////
//     ///////////////////////////////////// removeDataset /////////////////////////////////////////////
//     /////////////////////////////////////////////////////////////////////////////////////////////////

//     it("Should remove a valid courses dataset", function () {
//         const expected: string = "courses";
//         const futureResult: Promise<string> = insightFacade
//             .addDataset(
//                 expected,
//                 datasets[expected],
//                 InsightDatasetKind.Courses,
//             ).then(() => insightFacade.removeDataset(expected));
//         return expect(futureResult).to.eventually.deep.equal(expected).then(() => {
//             expect(InsightDataController.listDatasets()).to.eventually.have.length(0);
//         });
//     });

//     it("Should remove a valid rooms dataset", function () {
//         const expected: string = "rooms";
//         const futureResult: Promise<string> = insightFacade
//             .addDataset(expected, datasets[expected], InsightDatasetKind.Rooms)
//             .then(() => insightFacade.removeDataset(expected));
//         return expect(futureResult).to.eventually.be.deep.equal(expected);
//     });

//     it("Should reject removing a dataset with invalid id containing an underscore", function () {
//         const id: string = "courses";
//         const invalidId: string = "courses_";
//         const dataset: Promise<InsightDataset[]> = insightFacade
//             .addDataset(id, datasets[id], InsightDatasetKind.Courses)
//             .then(() => {
//                 expect(insightFacade.removeDataset(invalidId)).to.be.rejectedWith(InsightError);
//                 return insightFacade.listDatasets();
//             });
//         return expect(dataset).to.eventually.have.length(1);
//     });

//     it("Should reject removing a dataset with invalid id containing only white space", function () {
//         const id: string = "course";
//         const invalidId: string = "  ";
//         const action: Promise<string> = insightFacade
//             .addDataset(id, datasets[id], InsightDatasetKind.Courses)
//             .then(() => insightFacade.removeDataset(invalidId));
//         return expect(action).to.eventually.be.rejectedWith(InsightError);
//     });

//     it("Should remove a not only blank space id string", function () {
//         const id: string = "courses ";
//         const futureResult: Promise<string> = insightFacade
//             .addDataset(id, datasets["courses"], InsightDatasetKind.Courses)
//             .then(() => insightFacade.removeDataset(id));
//         return expect(futureResult).to.eventually.deep.equal("courses");
//     });
//     it("Should remove a non-empty string with blank space in front", function () {
//         const id: string = " courses";
//         const futureResult: Promise<string> = insightFacade
//             .addDataset(id, datasets["courses"], InsightDatasetKind.Courses)
//             .then(() => insightFacade.removeDataset(id));
//         return expect(futureResult).to.eventually.deep.equal("courses");
//     });
//     it("Should remove a non-empty string with blank space in the middle", function () {
//         const id: string = "cours es";
//         const futureResult: Promise<string> = insightFacade
//             .addDataset(id, datasets["courses"], InsightDatasetKind.Courses)
//             .then(() => insightFacade.removeDataset(id));
//         return expect(futureResult).to.eventually.deep.equal("courses").then(() => {
//             let imp = insightFacade.listDatasets();
//             return expect(imp).to.eventually.deep.equal([]);
//         })
//         ;
//     });

//     it("Should reject removing a dataset with valid but not yet added id", function () {
//         const id: string = "courses";
//         const action: Promise<string> = insightFacade.removeDataset(id);
//         return expect(action).to.eventually.be.rejectedWith(NotFoundError);
//     });

//     /////////////////////////////////////////////////////////////////////////////////////////////////
//     ////////////////////////////////////// listDatesets /////////////////////////////////////////////
//     /////////////////////////////////////////////////////////////////////////////////////////////////
//     it("Should list datasets correctly", function () {
//         const expected: InsightDataset[] = [
//             {
//                 id: "courses",
//                 kind: InsightDatasetKind.Courses,
//                 numRows: 64612,
//             }, {
//                 id: "rooms",
//                 kind: InsightDatasetKind.Rooms,
//                 numRows: 364,
//             },
//         ];
//         const futureResult: Promise<InsightDataset[]> = insightFacade
//             .addDataset(
//                 expected[0].id,
//                 datasets[expected[0].id],
//                 expected[0].kind,
//             )
//             .then(() =>
//                 insightFacade.addDataset(
//                     expected[1].id,
//                     datasets[expected[1].id],
//                     expected[1].kind,
//                 ),
//             )
//             .then(() => insightFacade.listDatasets());
//         return expect(futureResult).to.eventually.deep.equal(expected);
//     });

//     it("Should list empty datasets correctly", () => {
//         const empt = insightFacade.listDatasets();
//         return expect(empt).to.eventually.deep.equal([]);
//     });
// });

// /*
//  * This test suite dynamically generates tests from the JSON files in test/queries.
//  * You should not need to modify it; instead, add additional files to the queries directory.
//  * You can still make tests the normal way, this is just a convenient tool for a majority of queries.
//  */
// describe("InsightFacade PerformQuery", () => {
//     const cacheDir = __dirname + "/../data";
//     const datasetsToQuery: {
//         [id: string]: { path: string; kind: InsightDatasetKind };
//     } = {
//         courses: {
//             path: "./test/data/courses.zip",
//             kind: InsightDatasetKind.Courses,
//         },
//         rooms: {
//             path: "./test/data/rooms.zip",
//             kind: InsightDatasetKind.Rooms,
//         }
//     };
//     let insightFacade: InsightFacade;
//     let testQueries: ITestQuery[] = [];

//     // Load all the test queries, and call addDataset on the insightFacade instance for all the datasets
//     before(function () {
//         Log.test(`Before: ${this.test.parent.title}`);
//         // Load the query JSON files under test/queries.
//         // Fail if there is a problem reading ANY query.
//         try {
//             testQueries = TestUtil.readTestQueries();
//         } catch (err) {
//             expect.fail(
//                 "",
//                 "",
//                 `Failed to read one or more test queries. ${err}`,
//             );
//         }
//         if (fs.existsSync(cacheDir)) {
//             fs.removeSync(cacheDir);
//         }
//         fs.mkdirSync(cacheDir);
//         // Load the datasets specified in datasetsToQuery and add them to InsightFacade.
//         // Will fail* if there is a problem reading ANY dataset.
//         const loadDatasetPromises: Array<Promise<string[]>> = [];
//         insightFacade = new InsightFacade();
//         for (const id of Object.keys(datasetsToQuery)) {
//             const ds = datasetsToQuery[id];
//             const data = fs.readFileSync(ds.path).toString("base64");
//             loadDatasetPromises.push(
//                 insightFacade.addDataset(id, data, ds.kind),
//             );
//         }
//         return Promise.all(loadDatasetPromises);
//     });

//     beforeEach(function () {
//         Log.test(`BeforeTest: ${this.currentTest.title}`);
//     });

//     after(function () {
//         Log.test(`After: ${this.test.parent.title}`);
//         try {
//             Log.info(cacheDir);
//             fs.removeSync(cacheDir);
//         } catch (err) {
//             Log.error(err);
//         }
//     });

//     afterEach(function () {
//         Log.test(`AfterTest: ${this.currentTest.title}`);
//     });

//     // Dynamically create and run a test for each query in testQueries
//     // Creates an extra "test" called "Should run test queries" as a byproduct. Don't worry about it
//     it("Should run test queries", function () {
//         describe("Dynamic InsightFacade PerformQuery tests", function () {
//             for (const test of testQueries) {
//                 it(`[${test.filename}] ${test.title}`, function () {
//                     const futureResult: Promise<any[]> = insightFacade.performQuery(test.query);
//                     return TestUtil.verifyQueryResult(futureResult, test);
//                 });
//             }
//         });
//     });
// });
