import { BuildingModel } from "./building.model";

export class CompanyModel {

    private id: number;
    private name: string;
    private buildings: BuildingModel[];

    /**
     * Function that creates a CompanyModel object
     * @param id number unique identifier for the company object
     * @param name string name of the company
     * @param buildings BuildingModel[] list of buildings in the company
     * @return CompanyModel object
     */
    constructor(id: number, name: string, buildings: BuildingModel[]) {
        this.id = id;
        this.name = name
        this.buildings = buildings;
    }

    /**
     * Getter for the company's id
     * @return number id
     */
    getId(){
        return this.id;
    }

    /**
     * Getter for the company's name
     * @return string name
     */
    getName() {
        return this.name;
    }    

    /**
     * Getter for the company's buildings
     * @return BuildingModel[] buildings
     */
    getBuildings() {
        return this.buildings;
    }
}