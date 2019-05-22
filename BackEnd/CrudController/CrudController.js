class CRUDController {


    constructor() {
        this.demoMode = true;
    }

    createCompany(name, website, passwordId) {
        var response;
        if (this.validateAlpha(name) && this.validateWebsite(website) && this.validateNumeric(passwordId)) {
            if (this.demoMode) {
                response = this.buildDefaultResponseObject(true, "Company Creation Successful", false, false);
                response.data.companyId = 0;
            } else {
                // fetch from database
            }
        } else {
            response = this.buildDefaultResponseObject(false, "Invalid Company Details Provided", true);
        }
        return response;
    }

    getCompany(idOrUsername) {
        var response;

        var isUsername = false;
        if(this.validateEmail(idOrUsername)){
            isUsername = true
        }

        if (this.demoMode) {
            if (isUsername || idOrUsername === 0) {
                response = this.buildDefaultResponseObject(true, "Company Retrieval Successful", false, false);
                response.data.companyId = 0;
                response.data.companyName = "Vast Expanse";
                response.data.website = "https://github.com/cos301-2019-se/Smart-NFC-Card-Applications"
                response.data.passwordId = 0
            } else {
                if(isUsername){
                    response = this.buildDefaultResponseObject(false, "Company Username Does Not Exist", true);
                }else{
                    response = this.buildDefaultResponseObject(false, "Company ID Does Not Exist", true);
                }

            }
            return response;
        } else {
            //check database
        }
    }


    updateCompany(id, name, website, passwordId) {
        return this.buildDefaultResponseObject(false, "Unimplemented", true);
    }
    deleteCompany(id) {
        return this.buildDefaultResponseObject(false, "Unimplemented", true);

    }
    createEmployee(firstName, surname, title, cellphone, email, companyId, passwordId) {
        var response;

        if (this.validateAlpha(firstName) && this.validateAlpha(surname) && this.validateNonEmpty(title) && this.validateCellphone(cellphone) && this.validateEmail(email) && this.validateNumeric(companyId) && this.validateNumeric(passwordId)) {
            if (this.demoMode) {
                response = this.buildDefaultResponseObject(true, "Successfully Created Employee", false, false);
                response.data.employeeId = 0;
                return response;
            } else {
                //check database
            }
        } else {
            return this.buildDefaultResponseObject(false, "Invalid Employee Information Provided", true);

        }
    }
    // note that this 
    getEmployee(idOrUsername) {
        var response;
        var isUsername = false;
        if(this.validateEmail(idOrUsername)){
            isUsername = true
        }

        if (this.demoMode) {
            if ( isUsername || idOrUsername === 0) {
                response = this.buildDefaultResponseObject(true, "Employee Retrieval Successful", false, false);
                response.data.employeeId = 0;
                response.data.employeeTitle = "Mr";
                response.data.employeeName = "Piet";
                response.data.employeeSurname = "Pompies";
                response.data.employeeEmail = "piet.pompies@gmail.com";
                response.data.employeeCellphone = "0791637273";
                response.data.companyId = 0;
                response.data.passwordId = 0;
            } else {
                if(isUsername){
                    response = this.buildDefaultResponseObject(false, "Employee Username Does Not Exist", true);
                }else{
                    response = this.buildDefaultResponseObject(false, "Employee ID Does Not Exist", true);
                }

            }
            return response;
        } else {
            //check database
        }
    }
    
    updateEmployee(id, firstName, surname, title, cellphone, email, companyId, passwordId) {
        return this.buildDefaultResponseObject(false, "Unimplemented", true);
    }
    deleteEmployee(id) {
        return this.buildDefaultResponseObject(false, "Unimplemented", true);
    }
    createPassword(username, password) {
        var response;
        if (this.demoMode) {
            if (this.validateEmail(username) && this.validateNonEmpty(password)) {
                response = this.buildDefaultResponseObject(true, "Password Creation Successful", false, false);
                response.data.passwordId = 0;
            } else {
                response = this.buildDefaultResponseObject(false, "Invalid Password Information Provided", true);
            }
            return response;
        } else {
            //check database
        }
    }
    getPassword(idOrApiKey) {
        var response;
        var isId = false;
        if(this.validateNumeric(idOrApiKey)){ // weak check needs improvement
            isId = true;
        }

        if (this.demoMode) {
            if ( (isId && idOrApiKey == 0) || (idOrApiKey === "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^")) { 
                response = this.buildDefaultResponseObject(true, "Password Retrieval Successful", false, false);
                response.data.passwordId = 0;
                response.data.username = "piet.pompies@gmail.com";
                response.data.passwordHash = "b1070db9b04cb6901a9964841c8560f5c09bcbb6649db2d008daf4df81a65da7";
                response.data.salt = "40qY4HyU";
                response.data.apiKey = "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^";
                response.data.expiryDate = "9999-99-99";
            } else {
                if(isId){
                    response = this.buildDefaultResponseObject(false, "Password ID Does Not Exist", true);
                }else{
                    response = this.buildDefaultResponseObject(false, "Password API Key Does Not Exist", true);

                }

            }
            return response;

        } else {
            //check database
        }
    }
    
    updatePassword(id, username, password) {
        return this.buildDefaultResponseObject(false, "Unimplemented", true);
    }
    deletePassword(id) {
        return this.buildDefaultResponseObject(false, "Unimplemented", true);
    }

    buildDefaultResponseObject(success, message, hasNullData, isArray) {
        var response = {};
        response.success = success;
        response.message = message;
        if (hasNullData) {
            response.data = null;
        } else {
            if (isArray)
                response.data = [];
            else
                response.data = {};
        }
        return response;
    }

    validateWebsite(website) {
        if (/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(website)) {
            return true;
        }
        return false;
    }

    /**
	 * Checks if the parameter is non-empty
	 * @param required The parameter that will be checked if non-empty
	 * @return boolean Will return true if non-empty, false otherwise
	 */
    validateNonEmpty(required) {
        if (required || required === 0) {
            if (required.length === 0) {
                return false;
            }
            return true;
        }
        return false;
    }

	/**
	 * Checks if the parameter only consists of numbers using regex
	 * @param numbers The parameter to be checked against the regex
	 * @return boolean Returns true if satisfies the regex, false otherwise
	 */
    validateNumeric(numbers) {
        if (/^[0-9]+$/.test(numbers)) {
            return true;
        }
        return false;
    }

	/**
	 * Checks if the parameter only contains alphabetical characters as well as " " (space) and -(dash)
	 * @param letters The parameter that is being compared against the regex
	 * @return boolean Returns true if satisfies the regex, false otherwise
	 */
    validateAlpha(letters) {
        //allows for A-Z or a-z as first char, then followed by A-Z/a-z/ (space)/-
        if (/^([A-Za-z])([\-A-Za-z ])+$/.test(letters)) {
            return true;
        }
        return false;
    }

    validateCellphone(cellphone) {
        var regex = [
            /^"?[0-9]{10}"?$/,
            /^"?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})"?$/,
            /^"?\(\+([0-9]{2})\)?[-. ]?([0-9]{2})[-. ]?([0-9]{3})[-. ]?([0-9]{4})"?$/
        ];
        //test if the given cellphone number matches any of the regex
        for (var countRegex = 0; countRegex < regex.length; ++countRegex) {
            if (regex[countRegex].test(cellphone)) {
                return true;
            }
        }
        return false;
    }

    validateEmail(email) {
        if (/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/.test(email)) {
            return true;
        }
        else {
            return false
        }
    }
}


module.exports = CRUDController;
