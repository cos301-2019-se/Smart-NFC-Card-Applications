/**
 *	File Name:	    paymentLogic.js
 *	Project:		Smart-NFC-Application
 *	Orginization:	VastExpanse
 *	Copyright:	    © Copyright 2019 University of Pretoria
 *	Classes:        CrudController
 *	Related documents:
 *
 *	Update History:
 *	Date		Author		Version		Changes
 *	-----------------------------------------------------------------------------------------
 *	2019/07/27	Savvas		1.0		    Original
 *
 *	Functional Description:		 This class is the interface used by the Outside Components of the Link System to 
 *                               make payments. This class performs all the validation checks necessary for performing transactions.
 *	Error Messages:
 *	Assumptions: 	This file assumes that a there exists a crudController to access the database and sharedLogic for common functions
 *
 *	Constraints: 	None
 */

/**
* 	Purpose:	This class facilitates NFC Payments
*	Usage:		This class allows the caller to make payments within the Link system. These payments once validated, are then reflected
*               in the database and permanently recorded
*	@author:	Savvas Panagiotou
*	@version:	1.0
*/


let SharedLogic = require('./../SharedLogic/sharedLogic.js');
let ParentLogic = require('./parentLogic');
class PaymentLogic extends ParentLogic{
    /**
     *  Constructor for the class that sets up certain properties as well as instantiate
     *  a new sharedLogic object.
     *
     *  @param req JSON Request sent from the application to the backend system
     *  @param res JSON Response sent back to the application
     */
    constructor(req, res) {
        super(req,res);
    }

    /**
    *  Function that is called by server.js and extracts the post body, parse it
    *  into json object, sets up the endpoint and calls the serve function.
    */
    handle() {
        this.constructBody(); //instead of using shared logic, just borrow some of the body construction logic
    }

    constructBody() {
        this.body = [];
        this.req
            .on('data', (chunk) => {
                this.body.push(chunk);
            })
            .on('end', () => {
                this.body = Buffer.concat(this.body).toString();
                this.convertBodyToJSON();
            });
    }

    /**
     * MODIFIED from shared logic version: no need for API KEY in payment logic. MAC addresses are checked
     *  This function parses the String representation of the body into an object, assuming that the String]
	 * 	is formatted as a JSON object. The result is a Javascript object, stored in this.from.body, which the
	 *	(Other)Logic classes can then use to their discretion. 
     */
    convertBodyToJSON() {
        if (this.body === "") {
            this.sharedLogic.endServe(false, "No POST body received", null);
        }
        else {
            try {
                this.body = JSON.parse(this.body);
                this.demoMode = this.body.demoMode;
                this.demoMode = this.body.demoMode;
                this.endpoint = this.req.url.substring(this.req.url.substring(1).indexOf("/") + 2);
                this.serve();
            }
            catch (e) {
                if (e instanceof SyntaxError) {
                    this.sharedLogic.endServe(false, "Invalid JSON object sent: " + e.message, null);
                }
                else {
                    throw e;
                }
            }
        }
    }

    serve() {
        switch (this.endpoint) {
            case "makePayment":
                this.makePayment();
                break;
            case "getAllCompanyBuildingPaymentPoints":
                this.getAllCompanyBuildingPaymentPoints();
                break;
            default:
                this.sharedLogic.endServe(false, "Invalid Endpoint", null);
        }
    }



    /**
     * Function used to make a transaction of a certain positive amount from a specified 
     * wallet at a specified NFC paypoint
     * THE FOLLOWING ARE POST PARAMETERS FOR THIS ENDPOINT
     * @param nfcPaymentPointId int The ID of the NFC payment point to pay
     * @param visitorPackageId int The ID of the visitor package to pay from
     * @param amount float A (positive) amount to pay at the specified pay point
     * @param macAddress Macaddress with case-insensitive format aa-bb-cc-dd-ee-ff or aa.bb.cc.dd.ee.ff
     * @param description string Optionally blank description of the transaction
     * @return {success, message, data : {transactionId}}
     */
    async makePayment() {

        if (!this.body.visitorPackageId || !this.sharedLogic.validateNumeric(this.body.visitorPackageId))
            return this.sharedLogic.endServe(false, "No valid Visitor Package ID provided", null);
        if (!this.body.amount || !this.isRealNumber(this.body.amount))
            return this.sharedLogic.endServe(false, "No valid transction amount provided", null);
        if (!this.body.nfcPaymentPointId || !this.sharedLogic.validateNumeric(this.body.nfcPaymentPointId))
            return this.sharedLogic.endServe(false, "No valid NFC Payment Point ID provided", null);
        if (!this.body.macAddress || !this.sharedLogic.validateNonEmpty(this.body.macAddress))
            return this.sharedLogic.endServe(false, "No valid Mac Address provided", null);

        if (this.demoMode) {
            return this.sharedLogic.endServe(true, "Demo Transaction successful", { "transactionId": 0 });
        }

        var description = "";  //description can be blank
        if (this.body.description)
            description = this.body.description;
        var visitorPackageId = this.body.visitorPackageId;
        var amount = this.body.amount;
        var nfcPaymentPointId = this.body.nfcPaymentPointId;
        var macAddress = this.body.macAddress;

        //make sure that caller is not adding money to wallet
        if (amount <= 0)
            return this.sharedLogic.endServe(false, "Negative payments or payments of zero credits are not allowed (payment amount must be positive)", null);

        //fetch the visitor package
        let visitorPackage = await this.sharedLogic.crudController.getVisitorPackageByVisitorPackageId(visitorPackageId);
        if (!visitorPackage.success)
            return this.sharedLogic.endServe(false, visitorPackage.message, null);

        if (!visitorPackage.data.linkWalletId || !this.sharedLogic.validateNumeric(visitorPackage.data.linkWalletId))
            return this.sharedLogic.endServe(false, "No valid Wallet linked to this visitor package", null);

        var walletId = visitorPackage.data.linkWalletId; // wallet ID retrieved from visitor package

        if (this.isVisitorPackageExpired(visitorPackage.data.startTime, visitorPackage.data.endTime))
            return this.sharedLogic.endServe(false, "Visitor Package has expired", null);

        //now that it is certain the package is not expired, proceed to validate the package
        let clientDetails = await this.sharedLogic.crudController.getClientByClientId(visitorPackage.data.clientId);
        if (!clientDetails.success)
            return this.sharedLogic.endServe(false, clientDetails.message, null);

        //check mac address
        if (clientDetails.data.macAddress.toUpperCase() !== macAddress.toUpperCase())
            return this.sharedLogic.endServe(false, "Mac Address of device does not match the client of the wallet", null);

        let nfcPaymentPointDetails = await this.sharedLogic.crudController.getNfcPaymentPointByNfcPaymentPointId(nfcPaymentPointId);
        if (!nfcPaymentPointDetails.success)
            return this.sharedLogic.endServe(false, nfcPaymentPointDetails.message, null);

        var buildingIdOfPaymentPoint = nfcPaymentPointDetails.data.buildingId;

        let accessDetails = await this.sharedLogic.crudController.getTPAxRoomsByTpaId(visitorPackage.data.tpaId);
        if (!accessDetails.success)
            return this.sharedLogic.endServe(false, accessDetails.message, null);

        var tpaAndRoomsArray = accessDetails.data;
        if (tpaAndRoomsArray.length === 0)
            return this.sharedLogic.endServe(false, "No rooms found which this visitor package can access", null);

        //check if access to building is allowed
        var selectedRoomId = tpaAndRoomsArray[0].roomId; //grab first room that we have access to
        let roomDetails = await this.sharedLogic.crudController.getRoomByRoomId(selectedRoomId);
        if (!roomDetails.success)
            return this.sharedLogic.endServe(false, roomDetails.message, null);

        if (roomDetails.data.buildingId !== buildingIdOfPaymentPoint)
            return this.sharedLogic.endServe(false, "Visitor may not access this building", null);

        let walletDetails = await this.sharedLogic.crudController.getWalletByLinkWalletId(walletId);
        if (!walletDetails.success)
            return this.sharedLogic.endServe(false, walletDetails.message, null);

        //check if wallet has enough money left
        walletDetails = walletDetails.data;
        if ((walletDetails.maxLimit - walletDetails.spent) < amount)
            return this.sharedLogic.endServe(false, "Not enough credit in wallet to make transaction", null);

        //create the transaction 
        let transactionDetails = await this.sharedLogic.crudController.createTransaction(walletId, parseFloat(amount), nfcPaymentPointId, new Date(), description);
        if (!transactionDetails.success)
            return this.sharedLogic.endServe(false, transactionDetails.message, null);

        //update wallet
        var newSpent = walletDetails.spent + amount;
        let walletUpdateResult = await this.sharedLogic.crudController.updateWallet(walletId, undefined, newSpent);
        if (walletUpdateResult.success) {
            return this.sharedLogic.endServe(true, "Transaction successful", { "transactionId": transactionDetails.data.transactionId });
        } else {
            //if we failed to update the wallet, then reverse the transaction that was created
            var deleteTransactionDetails = await this.sharedLogic.crudController.deleteTransaction(transactionDetails.data.transactionId);
            if (deleteTransactionDetails.success) {
                return this.sharedLogic.endServe(false, "Failed to update the wallet after transaction was added - Reverted to initial state", null);
            } else {
                return this.sharedLogic.endServe(false, "Failed to update the wallet after transaction was added - ERROR: Transaction persists but wallet is not updated", null);
            }
        }
    }

    /**
     * Function used by access simulator to get all companies, buildings and payment points
     * ONLY USED FOR DEMONSTATION PURPOSES OF PAYMENT POINTS
     */
    async getAllCompanyBuildingPaymentPoints() {
        let dataArray = [];
        let companies = await this.sharedLogic.crudController.getAllCompanies();
        if (!companies)
            return this.sharedLogic.endServe(companies.success, companies.message, null);
        companies = companies.data;
        //get all companies
        for (let countCompanies = 0; countCompanies < companies.length; countCompanies++) {
            dataArray.push({});
            dataArray[countCompanies].companyName = companies[countCompanies].companyName;
            dataArray[countCompanies].companyId = companies[countCompanies].companyId;
            dataArray[countCompanies].buildings = [];

            //get all buildings
            let buildings = await this.sharedLogic.crudController.getBuildingsByCompanyId(companies[countCompanies].companyId);
            if (buildings.success) {
                buildings = buildings.data;
                for (let countBuildings = 0; countBuildings < buildings.length; countBuildings++) {
                    dataArray[countCompanies].buildings.push({});
                    dataArray[countCompanies].buildings[countBuildings].buildingId = buildings[countBuildings].buildingId;
                    dataArray[countCompanies].buildings[countBuildings].buildingName = buildings[countBuildings].branchName;
                    dataArray[countCompanies].buildings[countBuildings].paymentPoints = [];

                    //get all paymentPoints
                    let paymentPoints = await this.sharedLogic.crudController.getNfcPaymentPointsByBuildingId(buildings[countBuildings].buildingId);
                    if (paymentPoints.success) {
                        paymentPoints = paymentPoints.data;
                        for (let countPaymentPoints = 0; countPaymentPoints < paymentPoints.length; countPaymentPoints++) {
                            dataArray[countCompanies].buildings[countBuildings].paymentPoints.push({});
                            dataArray[countCompanies].buildings[countBuildings].paymentPoints[countPaymentPoints].nfcPaymentPointId = paymentPoints[countPaymentPoints].nfcPaymentPointId;
                            dataArray[countCompanies].buildings[countBuildings].paymentPoints[countPaymentPoints].description = paymentPoints[countPaymentPoints].description;
                        }
                    }
                }
            }
        }
        this.sharedLogic.endServe(true, "All Data retrieved", dataArray);
    }

    isVisitorPackageExpired(sDate,eDate) {
        var startDate = new Date(sDate);
        var endDate = new Date(eDate);
        var currentDate = new Date();
        if (currentDate > endDate || currentDate < startDate) {
            return true;
        }
        return false;
    }

    isRealNumber(num) {
        return typeof num == 'number' && !isNaN(num) && isFinite(num);
    }

    validateMacAddress(mac) {
        if (/^[0-9a-f]{1,2}([\.:-])(?:[0-9a-f]{1,2}\1){4}[0-9a-f]{1,2}$/i.test(mac)) {
            return true;
        }
        return false;
    }
}

module.exports = PaymentLogic;
