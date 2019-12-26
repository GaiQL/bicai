(async()=>{

    // import { realNameStatus } from 'Common/utils/user';
    // import Buy from '';
    
    await import(/* webpackChunkName: "Common_utils_method" */'Common/utils/method');
    await import(/* webpackChunkName: "Common_test_index" */'Common/Pgtest');
    // let BuyCom = Buy;
    
    // console.log( method )
    // 没有引用不会被打包进去；
    // console.log( test )
    // console.log( realNameStatus )
    // console.log( BuyCom )

})()