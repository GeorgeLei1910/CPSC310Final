
import {InsightDatasetKind, InsightError} from "../controller/IInsightFacade";
import {ItemParser} from "./ItemParser";
import {DatasetUtil, Room} from "../controller/DatasetUtil";
import Log from "../Util";
import * as Parse5 from "parse5";
import * as Http from "http";
import {HtmlUtils} from "./HtmlUtils";


export class RoomsParser extends ItemParser {

    private url = "http://cs310.students.cs.ubc.ca:11316/api/v1/project_team146/";

    constructor(id: string) {
        super(id, InsightDatasetKind.Rooms);
    }

    public parseItem(item: any[]): Promise<any[]> {
        return this.parseBldg(item).then((bld) => this.getRoomsInBldg(bld, item));
    }

    private parseBldg(arrstr: any[]): Promise<any[]> {
        let bldgIdx = arrstr.find((index) => index.name === "rooms/index.htm");
        let bldgObj: Parse5.Document = Parse5.parse(bldgIdx.val);
        let tables: any[] = HtmlUtils.getObjbyType(bldgObj, "nodeName", "tbody");
        let entries: any[] = [];
        tables.forEach((elem) => {
            HtmlUtils.getObjbyType(elem, "nodeName", "tr").forEach((tr) => entries.push(tr));
        });
        let blds: any[] = [];
        entries.forEach((elem) => {
            try {
                let buildingCode: any[] = HtmlUtils.getValueInText(elem, "class", "views-field-field-building-code");
                let buildingTitle: any[] = HtmlUtils.getValueInATag(elem, "class", "views-field-title");
                let buildingAddr: any[] = HtmlUtils.getValueInText(elem, "class", "views-field-field-building-address");
                if (buildingCode[0].length > 0) {
                    blds.push({code: buildingCode[0], title: buildingTitle[0], addr: buildingAddr[0], lat: 0, lon: 0});
                }
            } catch (e) {
                Log.error("Not a valid building");
            }
        });
        let retBldgInfo = blds.map((elem) => {
            return this.getLatLon(elem.addr)
                .then((latlon) => {
                    elem.lat = latlon.lat;
                    elem.lon = latlon.lon;
                    return elem;
                }).catch((e) => {
                    Log.error(elem.code + " : " + e);
                    elem.lat = 91;
                    elem.lon = 181;
                    return elem;
                });
        });
        return Promise.all(retBldgInfo);
    }

    private getRoomsInBldg(bldInfo: any[], arrstr: any[]): Room[] {
        let dataset: Room[] = [];
        bldInfo = bldInfo.filter((elem) => elem.lat < 91);
        arrstr.map((elem, i) => {
            let bInfo = bldInfo.find((index) => elem.name.indexOf("/" + index.code) > -1);
            if (bInfo) {
                try {
                    let roomObj: Parse5.Document = Parse5.parse(elem.val);
                    let roomsOfBldg: any[] = HtmlUtils.getObjbyType(roomObj, "nodeName", "tbody");
                    if (roomsOfBldg.length > 0) {
                        let rooms = this.getRooms(roomsOfBldg, bInfo);
                        rooms.forEach((rm) => dataset.push(rm));
                    }
                } catch (e) {
                    Log.error("Cannot parse Room" + elem.code);
                }
            }
        });
        return dataset;
    }

    private getRooms(roomsOfBldg: any, bldgInfo: any): Room[] {
        let entries: any[] = [];
        let rooms: any[] = [];
        let retRooms: Room[] = [];
        roomsOfBldg.forEach((rob: any) => {
            HtmlUtils.getObjbyType(rob, "nodeName", "tr").forEach((tr) => entries.push(tr));
        });
        entries.forEach((room) => {
            try {
                let roomNo: any[] = HtmlUtils.getValueInATag(room, "class", "views-field-field-room-number");
                let roomCpx: any[] = HtmlUtils
                    .getValueInText(room, "class", "views-field-field-room-capacity");
                let roomFurn: any[] = HtmlUtils
                    .getValueInText(room, "class", "views-field-field-room-furniture");
                let roomType: any[] = HtmlUtils.getValueInText(room, "class", "views-field-field-room-type");
                let roomURL: any[] = HtmlUtils.getURLInATag(room, "class", "views-field-nothing");
                rooms.push({
                    roomNo: roomNo[0], roomCpx: roomCpx[0],
                    roomFurn: roomFurn[0], roomType: roomType[0], roomURL: roomURL[0]
                });
            } catch (e) {
                Log.error("Invalid Room");
            }
        });
        rooms.forEach((roomInfo) => {
            let pushroom: Room = DatasetUtil.makeRoom(bldgInfo, roomInfo);
            retRooms.push(pushroom);
        });
        return retRooms;
    }


    public getLatLon(bldg: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let apiAddr = this.url + bldg.split(" ").join("%20");
            Http.get(apiAddr, (res) => {

                const { statusCode } = res;
                const contentType = res.headers["content-type"];
                let err: Error;
                if (statusCode !== 200) {
                    err = new Error("Failed Request.\n" + `Status Code: ${statusCode}`);
                } else if (!/^application\/json/.test(contentType)) {
                    err = new Error("Invalid content-type.\n"
                        + `Expected application/json but received ${contentType}`);
                }
                if (err) {
                    res.resume();
                    return reject(err);
                }

                let strob: string = "";
                res.on("data", (str) => {
                    strob += str;
                });
                res.on("end", () => {
                    return resolve(JSON.parse(strob));
                });
            }).on("error",
                (e) => reject(e));
        });
    }
}
