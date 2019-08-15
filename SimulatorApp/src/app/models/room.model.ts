export class RoomModel {
    
    private id: number;
    private name: string;

    /**
     * Function that creates a RoomModel object
     * @param id number unique identifier of the room
     * @param name string name of the room
     */
    constructor(id:number, name: string) {
        this.id = id;
        this.name = name;
    }

    /**
     * Getter for the room's id
     * @return number id
     */
    getId() {
        return this.id;
    }

    /**
     * Getter for the room's name
     * @return string name
     */
    getName() {
        return this.name;
    }

}