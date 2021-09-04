// import { expect } from "chai";
// import * as chai from "chai";
// import * as fs from "fs-extra";
// import * as chaiAsPromised from "chai-as-promised";
// import QueryUtil from "../src/controller/QueryUtil";
// import InsightDataController from "../src/controller/InsightDataController";
// import Log from "../src/Util";
// import { InsightDatasetKind } from "../src/controller/IInsightFacade";

// describe("QueryUtil filterCourses tests", function () {
//     const dataset = {
//         id: "math_courses",
//         kind: InsightDatasetKind.Courses,
//         numRows: 6,
//         courses: [
//             {
//                 dept: "Math",
//                 id: "MATH99",
//                 avg: 95,
//                 instructor: "John Doe",
//                 title: "Pre-Calculus",
//                 pass: 200,
//                 fail: 0,
//                 audit: 0,
//                 uuid: "awgwaeg",
//                 year: 2009
//             },
//             {
//                 dept: "Math",
//                 id: "MATH100",
//                 avg: 80,
//                 instructor: "Bob Smith",
//                 title: "Calculus I",
//                 pass: 200,
//                 fail: 30,
//                 audit: 10,
//                 uuid: "abc123",
//                 year: 2010
//             },
//             {
//                 dept: "Math",
//                 id: "MATH101",
//                 avg: 75,
//                 instructor: "John Doe",
//                 title: "Calculus II",
//                 pass: 180,
//                 fail: 40,
//                 audit: 5,
//                 uuid: "def456",
//                 year: 2011
//             },
//             {
//                 dept: "Math",
//                 id: "MATH102",
//                 avg: 60,
//                 instructor: "John Doe",
//                 title: "Calculus III",
//                 pass: 300,
//                 fail: 40,
//                 audit: 20,
//                 uuid: "def456",
//                 year: 2017
//             },
//             {
//                 dept: "Math",
//                 id: "MATH103",
//                 avg: 60,
//                 instructor: "Bob Smith",
//                 title: "Calculus IV",
//                 pass: 400,
//                 fail: 0,
//                 audit: 50,
//                 uuid: "gsadg",
//                 year: 2013
//             },
//             {
//                 dept: "Math",
//                 id: "MATH104",
//                 avg: 50,
//                 instructor: "John Doe",
//                 title: "Calculus V",
//                 pass: 600,
//                 fail: 10,
//                 audit: 15,
//                 uuid: "gwargwag",
//                 year: 2020
//             }
//         ]
//     };
//     // Reference any datasets you've added to test/data here and they will
//     // automatically be loaded in the 'before' hook.
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

//     it("Should apply empty filter correctly", function () {
//         const filter = {};
//         const expected = dataset.courses;
//         return expect(QueryUtil.filterCourses(dataset, filter)).to.deep.equal(expected);
//     });
// });

// describe("QueryUtil extractId tests", function () {
//     // Reference any datasets you've added to test/data here and they will
//     // automatically be loaded in the 'before' hook.
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

//     it("Should retrieve correct ID from a valid query", function () {
//         const query = {
//             WHERE: {
//                 AND: [
//                     { NOT: { GT: { courses_fail: 250 } } },
//                     { EQ: { courses_pass: 1 } },
//                     { AND: [ { IS: { courses_title: "*Calculus*" } },
//                              { LT: { courses_pass: 1 } } ] },
//                     { OR: [ { GT: { courses_fail: 250 } },
//                             { LT: { courses_pass: 1 } } ] }
//                 ]
//             },
//             OPTIONS: {
//               COLUMNS: [ "courses_dept", "courses_id", "courses_avg" ],
//               ORDER: "courses_avg"
//             }
//           };
//         const expectedId = "courses";
//         return expect(QueryUtil.extractId(query)).to.deep.equal(expectedId);
//     });

//     it("Should modify a valid query correctly after retrieving its Id", function () {
//         const query = {
//             WHERE: {
//                 AND: [
//                     { NOT: { GT: { courses_fail: 250 } } },
//                     { EQ: { courses_pass: 1 } },
//                     { AND: [ { IS: { courses_title: "*Calculus*" } },
//                              { LT: { courses_pass: 1 } } ] },
//                     { OR: [ { GT: { courses_fail: 250 } },
//                             { LT: { courses_pass: 1 } } ] }
//                 ]
//             },
//             OPTIONS: {
//               COLUMNS: [ "courses_dept", "courses_id", "courses_avg" ],
//               ORDER: "courses_avg"
//             }
//           };
//         const expectedquery = {
//             WHERE: {
//                 AND: [
//                     { NOT: { GT: { fail: 250 } } },
//                     { EQ: { pass: 1 } },
//                     { AND: [ { IS: { title: "*Calculus*" } },
//                              { LT: { pass: 1 } } ] },
//                     { OR: [ { GT: { fail: 250 } },
//                             { LT: { pass: 1 } } ] }
//                 ]
//             },
//             OPTIONS: {
//               COLUMNS: [ "dept", "id", "avg" ],
//               ORDER: "avg"
//             }
//           };

//         QueryUtil.extractId(query);
//         return expect(query).to.deep.equal(expectedquery);
//     });

//     it("Should throw InsightError when missing WHERE clause", function () {
//         const query = {
//             OPTIONS: {
//               COLUMNS: [ "courses_dept", "courses_id", "courses_avg" ],
//               ORDER: "courses_avg"
//             }
//           };
//         return expect(() => QueryUtil.extractId(query)).to.throw(InsightError);
//     });

//     it("Should throw InsightError when missing OPTIONS clause", function () {
//         const query = {
//             WHERE: {
//                 AND: [
//                     { NOT: { GT: { courses_fail: 250 } } },
//                     { EQ: { courses_pass: 1 } },
//                     { AND: [ { IS: { courses_title: "*Calculus*" } },
//                              { LT: { courses_pass: 1 } } ] },
//                     { OR: [ { GT: { courses_fail: 250 } },
//                             { LT: { courses_pass: 1 } } ] }
//                 ]
//             }
//         };
//         return expect(() => QueryUtil.extractId(query)).to.throw(InsightError);
//     });

//     it("Should not throw Error with empty WHERE clause", function () {
//         const query = {
//             WHERE: {},
//             OPTIONS: {
//               COLUMNS: [ "courses_dept", "courses_id", "courses_avg" ],
//               ORDER: "courses_avg"
//             }
//           };
//         return expect(() => QueryUtil.extractId(query)).to.not.throw();
//     });

//     it("Should not throw Error without ORDER clause", function () {
//         const query = {
//             WHERE: {},
//             OPTIONS: {
//               COLUMNS: [ "courses_dept", "courses_id", "courses_avg" ]
//             }
//           };
//         return expect(() => QueryUtil.extractId(query)).to.not.throw();
//     });

//     it("Should throw InsightError without COLUMNS clause", function () {
//         const query = {
//             WHERE: {},
//             OPTIONS: {
//               ORDER: "courses_avg"
//             }
//           };
//         return expect(() => QueryUtil.extractId(query)).to.throw(InsightError);
//     });

//     it("Should throw InsightError if key doesn't contain _", function () {
//         const query = {
//             WHERE: {},
//             OPTIONS: {
//               COLUMNS: ["avg"]
//             }
//           };
//         return expect(() => QueryUtil.extractId(query)).to.throw(InsightError);
//     });

//     it("Should throw InsightError if key contains more than one _", function () {
//         const query = {
//             WHERE: {},
//             OPTIONS: {
//               COLUMNS: ["courses_avg_"]
//             }
//           };
//         return expect(() => QueryUtil.extractId(query)).to.throw(InsightError);
//     });

//     it("Should throw InsightError if multiple ids are found", function () {
//         const query = {
//             WHERE: { GT: { courses_fail: 250 } },
//             OPTIONS: {
//               COLUMNS: ["rooms_avg"]
//             }
//           };
//         return expect(() => QueryUtil.extractId(query)).to.throw(InsightError);
//     });

//     it("Should throw InsightError if multiple ids are found with NOT", function () {
//         const query = {
//             WHERE: { NOT: { GT: { courses_fail: 250 } } },
//             OPTIONS: {
//               COLUMNS: ["rooms_avg"]
//             }
//           };
//         return expect(() => QueryUtil.extractId(query)).to.throw(InsightError);
//     });

//     it("Should throw InsightError if multiple ids are found with AND", function () {
//         const query = {
//             WHERE: { AND: [{ GT: { courses_fail: 250 } }] },
//             OPTIONS: {
//               COLUMNS: ["rooms_avg"]
//             }
//           };
//         return expect(() => QueryUtil.extractId(query)).to.throw(InsightError);
//     });

//     it("Should throw InsightError if multiple ids are found with OR", function () {
//         const query = {
//             WHERE: { OR: [{ GT: { courses_fail: 250 } }] },
//             OPTIONS: {
//               COLUMNS: ["rooms_avg"]
//             }
//           };
//         return expect(() => QueryUtil.extractId(query)).to.throw(InsightError);
//     });

//     it("Should throw InsightError if empty object is found in GT", function () {
//         const query = {
//             WHERE: { GT: {} },
//             OPTIONS: {
//               COLUMNS: ["courses_avg"]
//             }
//           };
//         return expect(() => QueryUtil.extractId(query)).to.throw(InsightError);
//     });

//     it("Should throw InsightError if empty object is found in EQ", function () {
//         const query = {
//             WHERE: { EQ: {} },
//             OPTIONS: {
//               COLUMNS: ["courses_avg"]
//             }
//           };
//         return expect(() => QueryUtil.extractId(query)).to.throw(InsightError);
//     });

//     it("Should throw InsightError if empty object is found in LT", function () {
//         const query = {
//             WHERE: { LT: {} },
//             OPTIONS: {
//               COLUMNS: ["courses_avg"]
//             }
//           };
//         return expect(() => QueryUtil.extractId(query)).to.throw(InsightError);
//     });

//     it("Should throw InsightError if empty object is found in IS", function () {
//         const query = {
//             WHERE: { IS: {} },
//             OPTIONS: {
//               COLUMNS: ["courses_avg"]
//             }
//           };
//         return expect(() => QueryUtil.extractId(query)).to.throw(InsightError);
//     });

//     it("Should throw InsightError if empty object is found in AND", function () {
//         const query = {
//             WHERE: { AND: [ { GT: {} } ] },
//             OPTIONS: {
//               COLUMNS: ["courses_avg"]
//             }
//           };
//         return expect(() => QueryUtil.extractId(query)).to.throw(InsightError);
//     });

//     it("Should throw InsightError if empty object is found in OR", function () {
//         const query = {
//             WHERE: { OR: [ { GT: {} } ] },
//             OPTIONS: {
//               COLUMNS: ["courses_avg"]
//             }
//           };
//         return expect(() => QueryUtil.extractId(query)).to.throw(InsightError);
//     });

//     it("Should throw InsightError if empty object is found in NOT", function () {
//         const query = {
//             WHERE: { NOT: { GT: {} } },
//             OPTIONS: {
//               COLUMNS: ["courses_avg"]
//             }
//           };
//         return expect(() => QueryUtil.extractId(query)).to.throw(InsightError);
//     });
// });
