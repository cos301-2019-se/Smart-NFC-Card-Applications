import { RoomModel } from './room.model';
import { PayPointModel } from './pay-point.model';

export class BuildingModel {
    
    private id: number;
    private name: string;
    private rooms: RoomModel[];
    private payPoints: PayPointModel[];

    constructor(id: number, name: string){
        this.id = id;
        this.name = name;
        this.rooms = [];
        this.payPoints = [];
    }

    addRoom(room: RoomModel) {
        this.rooms.push(room);
    }

    addPayPoint(payPoint: PayPointModel) {
        this.payPoints.push(payPoint);
    }

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getRooms() {
        return this.rooms;
    }

    getPayPoints() {
        return this.payPoints;
    }
}