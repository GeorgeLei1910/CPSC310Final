import { InsightDataset } from "./IInsightFacade";
import * as Http from "http";
/**
 * A data structure to represent a dataset.
 */
export interface ItemDataset extends InsightDataset {
    items: any[];
}

/**
 * A data structure to represent a course.
 */
export interface Course {
    dept: string;
    id: string;
    avg: number;
    instructor: string;
    title: string;
    pass: number;
    fail: number;
    audit: number;
    uuid: string;
    year: number;
}
// TODO: input room in here.
export interface Room {
    fullname: string;
    shortname: string;
    number: string;
    name: string;
    address: string;
    lat: number;
    lon: number;
    seats: number;
    type: string;
    furniture: string;
    href: string;
}

export class DatasetUtil {
    public static makeCourse(cour: any): Course {
        let retcour: Course = {
            dept: cour.Subject,
            id: cour.Course,
            avg: cour.Avg,
            instructor: cour.Professor,
            title: cour.Title,
            pass: cour.Pass,
            fail: cour.Fail,
            audit: cour.Audit,
            uuid: cour.id,
            year: cour.Year === "overall" ? 1900 : Number.parseInt(cour.Year, 10)
        };
        // uuid needs to be unique, dept
        if (Object.values(retcour).includes(undefined)) {
            throw new Error("Invalid Course");
        } else {
            return retcour;
        }
    }

    public static makeRoom(bldgInfo: any, roomInfo: any): Room {
        // make sure 1900 mapped to any.
        let retroom: Room = {
            fullname: bldgInfo.title,
            shortname: bldgInfo.code,
            number: roomInfo.roomNo,
            name: bldgInfo.code + "_" + roomInfo.roomNo,
            address: bldgInfo.addr,
            lat: Number.parseFloat(bldgInfo.lat),
            lon: Number.parseFloat(bldgInfo.lon),
            seats: Number.parseInt(roomInfo.roomCpx, 10),
            type: roomInfo.roomType,
            furniture: roomInfo.roomFurn,
            href: roomInfo.roomURL
        };
        // uuid needs to be unique, dept
        if (Object.values(retroom).includes(undefined)) {
            throw new Error("Invalid Room");
        } else {
            return retroom;
        }
    }
}
