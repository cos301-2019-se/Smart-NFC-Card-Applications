/**
*	File Name:	        room.model.ts
*	Project:		    Smart-NFC-Application
*	Orginization:	    VastExpanse
*	Copyright:	        © Copyright 2019 University of Pretoria
*	Classes:	        RoomModel
*	Related documents:	None
*
*	Update History:
*	Date		    Author		Version		Changes
*	-----------------------------------------------------------------------------------------
*	2019/07/13	Wian		  1.0		    Original
*
*	Functional Description:   This class provides the location model
*	Error Messages:   “Error”
*	Assumptions:  That all the injectables are working
*	Constraints: 	None
*/

/**
*   Purpose:	This class provides the Room model
*	Usage:		This class can be used to create room objects
*	@author:	Wian du Plooy
*	@version:	1.0
*/
export class RoomModel {    
    private id: number;
    private name: string;

    /**
     * Function used to create room objects
     * @param id number unique identifier
     * @param name string name of the room
     */
    constructor(id: number, name: string){
        this.id = id;
        this.name = name;
    }

    /**
     * Function that returns the room id
     * @return number id
     */
    getId(){
        return this.id;
    }

    /**
     * Function that returns the room name
     * @return string name
     */
    getName(){
        return this.name;
    }
}