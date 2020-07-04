export class Database {

    constructor() {
        this.database = {valuesCount: {}, names: {}};
        this.transactions = [];
    }

    /**
     * Set the name of the database entry
     *
     * @param {string} name The name to set
     * @param {string} value The value to set the name to
     */
    set(name,value) {
        if(this.database.names[name] === undefined) {
            this.updateValueCount(value);
            this.database.names[name] = value;
        } else if(!!this.database.names[name]) {
            if(this.database.names[name] !== value) {
                this.updateValueCountForExistingName(name, value);
                this.database.names[name] = value;
            }
        }
    }

    /**
     * Update the value count for a new name
     *
     * @param {string} value The value count to update
     */
    updateValueCount(value){
        this.setCountForValue(value);
    }

    /**
     * Update the value count for an existing name
     *
     * @param {string} name The name of the value count to update
     * @param {string} value The value count to update
     */
    updateValueCountForExistingName(name, value){
        this.deleteValuePropertyForName(name);
        this.setCountForValue(value);
    }

    /**
     * Sets the count of a particular value
     *
     * @param {string} value The value to set the count for
     */
    setCountForValue(value) {
        if(!!this.database.valuesCount[value]) {
            this.database.valuesCount[value]++;
        } else {
            this.database.valuesCount[value] = 1;
        }
    }

    /**
     * Get the name of the database entry
     *
     * @param {string} name The name to get
     */
    get(name) {
        console.log(!!this.database.names[name] ? this.database.names[name] : null);
    }

    /**
     * Delete entry from database
     *
     * @param {string} name The name to delete
     */
    deleteFromDatabase(name) {
        if(!!this.database.names[name]) {
            this.deleteValuePropertyForName(name);
        }
    }

    /**
     * Counts the number of occurrences val is found in the database
     *
     * @param {string} value The value to count
     */
    count(value) {
        if(!!this.database.valuesCount[value]) {
            console.log(this.database.valuesCount[value]);
        } else {
            console.log(0);
        }
    }

    /**
     * Begins a transaction
     */
    beginTransaction() {
        if(this.transactions.length === 0) {
            this.transactions.push(this.database);
        }
        let shallowCopy = {valuesCount: {...this.database.valuesCount}, names: {...this.database.names}};
        this.transactions.push(shallowCopy);
        this.database = this.transactions[this.transactions.length-1];
    }

    /**
     * Rollback a transaction
     */
    rollback() {
        if(this.transactions.length > 1) {
            this.transactions.pop();
            this.database = this.transactions[this.transactions.length-1];
        } else {
            console.log('TRANSACTION NOT FOUND');
        }
    }

    /**
     * Commit a transaction
     */
    commit() {
        this.database = this.transactions[this.transactions.length-1];
        this.transactions = [];
    }

    /**
     * Delete value property for a particular name
     *
     * @param {string} name The value to delete
     */
    deleteValuePropertyForName(name) {
        this.database.valuesCount[this.database.names[name]]--;
        if(this.database.valuesCount[this.database.names[name]] === 0) {
            delete this.database.valuesCount[this.database.names[name]];
        }

        delete this.database.names[name];
    }

    /**
     * Handle User Input for Various Database Commands
     *
     * @param {string} input User command line input
     * @returns {boolean}
     */
    handleInput(input) {
        const inputRaw = input.split(' ');
        const [action, ...args] = [inputRaw]

        switch(action) {
            case 'SET':
            const [name, value] = args;
                if(name && value) {
                    this.set(name, value);
                } else {
                    console.log('Invalid Input: the SET command must include a name and a value.');
                }
                break;
            case 'GET':
            const [name, value] = args;
                if(name) {
                    this.get(name);
                } else {
                    console.log('Invalid Input: the GET command must include a name.');
                }
                break;
            case 'DELETE':
            const [name] = args;
                if(name) {
                    this.deleteFromDatabase(name);
                } else {
                    console.log('Invalid Input: the DELETE command requires a name.');
                }
                break;
            case 'COUNT':
                const [value] = args;
                if(value) {
                    this.count(value);
                } else {
                    console.log('Invalid Input: the COUNT command requires a value to count.');
                }
                break;
            case 'BEGIN':
                this.beginTransaction();
                break;
            case 'ROLLBACK':
                this.rollback();
                break;
            case 'COMMIT':
                this.commit();
                break;
            case 'END':
                return true;
            default:
                console.log('Function is not valid.');
        }
    }
}