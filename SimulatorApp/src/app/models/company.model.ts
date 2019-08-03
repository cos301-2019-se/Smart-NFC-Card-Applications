import { BuildingModel } from "./building.model";

export class CompanyModel {

    private id: number;
    private name: string;
    private buildings: BuildingModel[];

    constructor(id: number, name: string, buildings: BuildingModel[]) {
        this.id = id;
        this.name = name
        this.buildings = buildings;
    }

    getId(){
        return this.id;
    }

    getName() {
        return this.name;
    }
    
    getBuildings() {
        return this.buildings;
    }
}