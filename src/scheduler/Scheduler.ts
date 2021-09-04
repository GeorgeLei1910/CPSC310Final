import {IScheduler, SchedRoom, SchedSection, TimeSlot} from "./IScheduler";

export default class Scheduler implements IScheduler {
    public schedule(sections: SchedSection[], rooms: SchedRoom[]): Array<[SchedRoom, SchedSection, TimeSlot]> {
        let timeSlots: TimeSlot[] = [
            "MWF 0800-0900", "MWF 0900-1000", "MWF 1000-1100", "MWF 1100-1200", "MWF 1200-1300",
            "MWF 1300-1400", "MWF 1400-1500", "MWF 1500-1600", "MWF 1600-1700", "TR  0800-0930",
            "TR  0930-1100", "TR  1100-1230", "TR  1230-1400", "TR  1400-1530", "TR  1530-1700"
        ];

        let sortedSections: SchedSection[] = Scheduler.sortSections(sections);
        let sortedRooms: SchedRoom[] = Scheduler.sortRooms(rooms);

        let emptyScheduleMap: number[][] =
            new Array(sortedRooms.length).fill(undefined)
                .map(() => new Array(timeSlots.length).fill(undefined));
        let scheduleMap: number[][] =
            Scheduler.traverse(sortedSections, 0, sortedRooms, 0, undefined, [], timeSlots, 0, emptyScheduleMap);

        return Scheduler.scheduleMapToSchedule(scheduleMap, sortedSections, sortedRooms, timeSlots);
    }

    private static traverse(
        sections: SchedSection[], s: number,
        rooms: SchedRoom[], r: number, bestRoomTimeD: [number, number, number], scheduledRooms: SchedRoom[],
        timeSlots: TimeSlot[], t: number,
        current: number[][]
    ): number[][] {
        if (s >= sections.length) {
            return current;
        } else if (r >= rooms.length) {
            if (bestRoomTimeD !== undefined && bestRoomTimeD[1] !== undefined) {
                current[bestRoomTimeD[0]][bestRoomTimeD[1]] = s;
                scheduledRooms.push(rooms[bestRoomTimeD[0]]);
            }
            return Scheduler.traverse(sections, s + 1, rooms, 0, undefined, scheduledRooms, timeSlots, 0, current);
        } else if (t >= timeSlots.length) {
            return Scheduler.traverse(sections, s, rooms, r + 1, undefined, scheduledRooms, timeSlots, 0, current);
        } else {
            if (bestRoomTimeD !== undefined && bestRoomTimeD[0] !== r) {
                let newD: number = Scheduler.calculateD([rooms[r], ...scheduledRooms]);
                if (newD < bestRoomTimeD[2]) {
                    bestRoomTimeD = [r, undefined, newD];
                } else {
                    return Scheduler.traverse(
                        sections, s, rooms, r + 1, bestRoomTimeD, scheduledRooms, timeSlots, 0, current);
                }
            } else if (bestRoomTimeD === undefined) {
                let newD: number = Scheduler.calculateD([rooms[r], ...scheduledRooms]);
                bestRoomTimeD = [r, undefined, newD];
            }

            if (Scheduler.isAllowed(sections, s, rooms, r, t, current)) {
                bestRoomTimeD[1] = t;
                return Scheduler.traverse(
                    sections, s, rooms, r + 1, bestRoomTimeD, scheduledRooms, timeSlots, 0, current);
            } else {
                return Scheduler.traverse(
                    sections, s, rooms, r, bestRoomTimeD, scheduledRooms, timeSlots, t + 1, current);
            }
        }
    }

    private static getEnrolments(section: SchedSection): number {
        return section.courses_pass + section.courses_fail + section.courses_audit;
    }

    private static bigEnough(sections: SchedSection[], s: number, rooms: SchedRoom[], r: number): boolean {
        return Scheduler.getEnrolments(sections[s]) <= rooms[r].rooms_seats;
    }

    private static timeAllowed(sections: SchedSection[], s: number, t: number, scheduleMap: number[][]): boolean {
        let others: SchedSection[] = scheduleMap
            .map((room: number[]) => room[t])
            .filter((i: number) => i !== undefined)
            .map((i: number) => sections[i]);
        let thisSection: SchedSection = sections[s];
        let collisions: SchedSection[] = others.filter(
            (section: SchedSection) =>
                section.courses_dept === thisSection.courses_dept &&
                section.courses_id === thisSection.courses_id
        );
        return collisions.length === 0;
    }

    private static isAllowed(
        sections: SchedSection[], s: number,
        rooms: SchedRoom[], r: number,
        t: number, scheduleMap: number[][]
    ): boolean {
        return scheduleMap[r][t] === undefined &&
            this.timeAllowed(sections, s, t, scheduleMap) &&
            Scheduler.bigEnough(sections, s, rooms, r);
    }

    private static sortRooms(rooms: SchedRoom[]): SchedRoom[] {
        if (rooms.length === 0) {
            return [];
        }
        let orders: SchedRoom[][] = rooms.map(
            (room: SchedRoom) => [...rooms].sort(
                (room1: SchedRoom, room2: SchedRoom) =>
                    Scheduler.distance(room, room1) - Scheduler.distance(room, room2)
            )).sort(
                (orderA: SchedRoom[], orderB: SchedRoom[]) => this.score(orderA) - this.score(orderB)
            );
        return orders[0];
    }

    private static sortSections(sections: SchedSection[]): SchedSection[] {
        return [...sections].sort(
            (a: SchedSection, b: SchedSection) =>
                Scheduler.getEnrolments(b) - Scheduler.getEnrolments(a)
        );
    }

    private static calculateD(
        rooms: SchedRoom[]
    ): number {
        if (rooms.length === 0) {
            return 1;
        }
        if (rooms.length === 1) {
            return 0;
        }
        let maxDistance = Math.max(
            ...rooms.map((room: SchedRoom) =>
                Math.max(...rooms.map((other: SchedRoom) => Scheduler.distance(room, other)))));
        return maxDistance / 1372;
    }

    private static distance(room1: SchedRoom, room2: SchedRoom): number {
        let lat1: number = room1.rooms_lat;
        let lon1: number = room1.rooms_lon;
        let lat2: number = room2.rooms_lat;
        let lon2: number = room2.rooms_lon;

        const R = 6371e3; // metres
        const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // in metres
        return d;
    }

    private static score(rooms: SchedRoom[]): number {
        return rooms.reduce((d: number, room: SchedRoom) => d + Scheduler.distance(rooms[0], room), 0);
    }

    private static scheduleMapToSchedule(
        scheduleMap: number[][],
        sections: SchedSection[],
        rooms: SchedRoom[],
        timeSlots: TimeSlot[]
    ): Array<[SchedRoom, SchedSection, TimeSlot]> {
        let result: Array<[SchedRoom, SchedSection, TimeSlot]> = [];
        let r, t;
        for (r = 0; r < rooms.length; r++) {
            for (t = 0; t < timeSlots.length; t++) {
                let s = scheduleMap[r][t];
                if (s !== undefined) {
                    result.push([rooms[r], sections[s], timeSlots[t]]);
                }
            }
        }
        return result;
    }
}
