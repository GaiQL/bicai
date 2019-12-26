import { addition,subtraction } from 'Common/utils/method'

class Store {
    num : number;
    constructor() {
        this.num = 0
    }
    additionNum = () => {
        this.num = addition( this.num );
    }
}

export default Store