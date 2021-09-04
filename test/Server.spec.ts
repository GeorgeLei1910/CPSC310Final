// import Server from "../src/rest/Server";
//
// import InsightFacade from "../src/controller/InsightFacade";
// import chai = require("chai");
// import chaiHttp = require("chai-http");
// import Response = ChaiHttp.Response;
// import {expect} from "chai";
// import * as fs from "fs";
// import Log from "../src/Util";
//
// describe("Facade D3", function () {
//
//     let facade: InsightFacade = null;
//     let server: Server = null;
//     let SERVER_URL = "http://localhost:4321";
//
//     const datasetsToLoad: { [id: string]: string } = {
//         courses: "./test/data/courses.zip",
//         rooms: "./test/data/rooms.zip",
//         coursesShort : "./test/data/CoursesShort.zip"
//     };
//
//     let datasets: { [id: string]: Buffer } = {};
//
//     chai.use(chaiHttp);
//
//     before(function () {
//         facade = new InsightFacade();
//         server = new Server(4321);
//         // TODO: start server here once and handle errors properly
//         for (const id of Object.keys(datasetsToLoad)) {
//             datasets[id] = fs.readFileSync(datasetsToLoad[id]);
//         }
//         server.start();
//     });
//
//     after(function () {
//        server.stop();
//     });
//
//     beforeEach(function () {
//         // might want to add some process logging here to keep track of what"s going on
//     });
//
//     afterEach(function () {
//         // might want to add some process logging here to keep track of what"s going on
//     });
//
//     // Sample on how to format PUT requests
//     it("PUT test for courses dataset", function () {
//         try {
//             const ENDPOINT_URL = "/dataset/courses/courses";
//             return chai.request(SERVER_URL)
//                 .put(ENDPOINT_URL)
//                 .set("Content-Type", "application/x-zip-compressed")
//                 .send(datasets["courses"])
//                 .then(function (res: Response) {
//                     // some logging here please!
//                     expect(res.status).to.be.equal(200);
//                 }).catch(function (err) {
//                     // some logging here please!
//                     Log.error(err);
//                     expect.fail();
//                 });
//         } catch (err) {
//             expect.fail(err.message);
//         }
//     });
//
//     it("PUT existing courses dataset", function () {
//         try {
//             const ENDPOINT_URL = "/dataset/courses/courses";
//             return chai.request(SERVER_URL)
//                 .put(ENDPOINT_URL)
//                 .set("Content-Type", "application/x-zip-compressed")
//                 .send(datasets["courses"])
//                 .then(function (res: Response) {
//                     // some logging here please!
//                     expect(res.status).to.be.equal(200);
//                 }).catch(function (err) {
//                     // some logging here please!
//                     Log.error(err);
//                     expect(err.status).to.be.equal(400);
//                 });
//         } catch (err) {
//             expect.fail(err.message);
//         }
//     });
//     it("PUT invalid id for courses dataset", function () {
//         try {
//             const ENDPOINT_URL = "/dataset/cour_ses/courses";
//             return chai.request(SERVER_URL)
//                 .put(ENDPOINT_URL)
//                 .set("Content-Type", "application/x-zip-compressed")
//                 .send(datasets["courses"])
//                 .then(function (res: Response) {
//                     // some logging here please!
//                     expect(res.status).to.be.equal(400);
//                 }).catch(function (err) {
//                     // some logging here please!
//                     Log.error(err);
//                     expect.fail();
//                 });
//         } catch (err) {
//             expect.fail(err.message);
//         }
//     });
//
//     it("PUT invalid kind courses dataset", function () {
//         try {
//             const ENDPOINT_URL = "/dataset/cour_ses/kinder";
//             return chai.request(SERVER_URL)
//                 .put(ENDPOINT_URL)
//                 .set("Content-Type", "application/x-zip-compressed")
//                 .send(datasets["courses"])
//                 .then(function (res: Response) {
//                     // some logging here please!
//                     expect(res.status).to.be.equal(200);
//                 }).catch(function (err) {
//                     // some logging here please!
//                     Log.error(err);
//                     expect(err.status).to.be.equal(400);
//                 });
//         } catch (err) {
//             expect.fail(err.message);
//         }
//     });
//
//     it("PUT rooms dataset", function () {
//         try {
//             const ENDPOINT_URL = "/dataset/rooms/rooms";
//             return chai.request(SERVER_URL)
//                 .put(ENDPOINT_URL)
//                 .set("Content-Type", "application/x-zip-compressed")
//                 .send(datasets["rooms"])
//                 .then(function (res: Response) {
//                     // some logging here please!
//                     expect(res.status).to.be.equal(200);
//                 }).catch(function (err) {
//                     // some logging here please!
//                     Log.error(err);
//                     expect.fail();
//                 });
//         } catch (err) {
//             expect.fail(err.message);
//         }
//     });
//     // it("DEL test for courses dataset", function () {
//     //     try {
//     //         const ENDPOINT_URL = "/dataset/courses";
//     //         return chai.request(SERVER_URL)
//     //             .del(ENDPOINT_URL)
//     //             .then(function (res: Response) {
//     //                 // some logging here please!
//     //                 expect(res.status).to.be.equal(200);
//     //             })
//     //             .catch(function (err) {
//     //                 // some logging here please!
//     //                 Log.error(err);
//     //                 expect.fail();
//     //             });
//     //     } catch (err) {
//     //         expect.fail(err.message);
//     //     }
//     // });
//     //
//     // it("DEL non existant dataset", function () {
//     //     try {
//     //         const ENDPOINT_URL = "/dataset/courses";
//     //         return chai.request(SERVER_URL)
//     //             .del(ENDPOINT_URL)
//     //             .then(function (res: Response) {
//     //                 // some logging here please!
//     //                 expect(res.status).to.be.equal(200);
//     //             })
//     //             .catch(function (err) {
//     //                 // some logging here please!
//     //                 Log.error(err);
//     //                 expect.fail();
//     //             });
//     //     } catch (err) {
//     //         expect.fail(err.message);
//     //     }
//     // });
//     //
//     // it("GET datasets", function () {
//     //     try {
//     //         const ENDPOINT_URL = "/datasets";
//     //         return chai.request(SERVER_URL)
//     //             .get(ENDPOINT_URL)
//     //             .then(function (res: Response) {
//     //                 // some logging here please!
//     //                 expect(res.status).to.be.equal(200);
//     //             })
//     //             .catch(function (err) {
//     //                 // some logging here please!
//     //                 Log.error(err);
//     //                 expect.fail();
//     //             });
//     //     } catch (err) {
//     //         expect.fail(err.message);
//     //     }
//     // });
//
//     // The other endpoints work similarly. You should be able to find all instructions at the chai-http documentation
// });
