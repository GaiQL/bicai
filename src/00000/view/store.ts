import Store from 'Common/Pgtest/store';

class hahaStore extends Store{
    hahaStoreFn = () => {   
        return 'hahaStoreFn'
    }
}
    
export default hahaStore

// export default (async()=>{
//     const Store = ( await import(/* webpackChunkName: "Common_test_index" */'Common/Pgtest/store') ).default;
//     console.log( Store )
//     class hahaStore extends Store{
//         hahaStoreFn = () => {
//             return 'hahaStoreFn'
//         }
//     }
//     return hahaStore
// })()

