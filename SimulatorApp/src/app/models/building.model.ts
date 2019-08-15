import { RoomModel } from './room.model';
import { PayPointModel } from './pay-point.model';

export class BuildingModel {
    
    private id: number;
    private name: string;
    private rooms: RoomModel[];
    private payPoints: PayPointModel[];

    /**
     * Function that creates a BuildingModel object
     * @param id number unique identifier of the building
     * @param name string name of the building
     */
    constructor(id: number, name: string){
        this.id = id;
        this.name = name;
        this.rooms = [];
        this.payPoints = [];
    }

    /**
     * Function that adds a room to the building
     * @param room RoomModel to link to the building
     */
    addRoom(room: RoomModel) {
        this.rooms.push(room);
    }

    /**
     * Funciton that adds a payment point to the building
     * @param payPoint PayPointModel to link to the building
     */
    addPayPoint(payPoint: PayPointModel) {
        this.payPoints.push(payPoint);
    }

    /**
     * Getter for the building's id
     * @return number id
     */
    getId() {
        return this.id;
    }

    /**
     * Getter for the building's name
     * @return string name
     */
    getName() {
        return this.name;
    }

    /**
     * Getter for the building's rooms
     * @return RoomModel[] rooms
     */
    getRooms() {
        return this.rooms;
    }

    /**
     * Getter for the building's payment points
     * @return PayPointModel[] payPoints
     */
    getPayPoints() {
        return this.payPoints;
    }
}