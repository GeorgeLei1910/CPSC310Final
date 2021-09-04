import { SchedRoom, SchedSection } from "../src/scheduler/IScheduler";
import Scheduler from "../src/scheduler/Scheduler";
import { expect } from "chai";

function makeSection(
    dept: string, id: string, uuid: string, pass: number, fail: number, audit: number
    ): SchedSection {
    let section = {
        courses_dept: dept,
        courses_id: id,
        courses_uuid: uuid,
        courses_pass: pass,
        courses_fail: fail,
        courses_audit: audit
    } as SchedSection;
    return section;
}

function makeRoom(
    shortname: string, num: string, seats: number, lat: number, lon: number
    ): SchedRoom {
    let room = {
        rooms_shortname: shortname,
        rooms_number: num,
        rooms_seats: seats,
        rooms_lat: lat,
        rooms_lon: lon
    } as SchedRoom;
    return room;
}


describe("Scheduler", function () {
    it("Sample Test", function () {
        let scheduler = new Scheduler();
        let sections = [
            makeSection("cpsc", "340", "1319", 101, 7, 2),
            makeSection("cpsc", "340", "3397", 171, 3, 1),
            makeSection("cpsc", "344", "62413", 93, 2, 0),
            makeSection("cpsc", "344", "72385", 43, 1, 0)
        ];
        let rooms = [
            makeRoom("AERL", "120", 144, 49.26372, -123.25099),
            makeRoom("ALRD", "105", 94, 49.2699, -123.25318),
            makeRoom("ANGU", "098", 260, 49.26486, -123.25364),
            makeRoom("BUCH", "A101", 275, 49.26826, -123.25468)
        ];
        let result = scheduler.schedule(sections, rooms);
        // let expectedResults = [
        //     [rooms[0], sections[0], "MWF 0800-0900"],
        //     [rooms[2], sections[1], "MWF 0900-1000"],
        //     [rooms[3], sections[2], "MWF 0800-0900"],
        //     [rooms[1], sections[3], "MWF 0900-1000"],
        // ];
        let expectedResults: any[] = [];
        expect(result).to.deep.equal(expectedResults);
    });
});
