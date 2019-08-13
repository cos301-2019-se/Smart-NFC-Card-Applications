export class PayPointModel {
    
    private id: number;
    private name: string;

    /**
     * Function that creates a PayPointModel object
     * @param id number unique identifier for the payment point
     * @param name string name of the payment point
     */
    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    /**
     * Getter for the payment point's id
     * @return number id
     */
    getId() {
        return this.id;
    }

    /**
     * Getter for the payment point's name
     * @return string name
     */
    getName() {
        return this.name;
    }
}