import './style.scss';
import Store from './store';
class PGheihei {
    num : any;
    data : any;
    constructor() {
        this.num = new Store();
        this.data = "balalalaz"
   
        this.num.additionNum();
        console.log( this.num.num )
    }
    changNum = ( num ) => {
        this.num = num
    }
    getStore = () => {
        console.log( Store )
    }
}

export default PGheihei
