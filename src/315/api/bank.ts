import {apiClassFactory} from 'Common/api/bank'
class Api extends apiClassFactory('v2') {
}
export const apiBank = new Api()