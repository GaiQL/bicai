import './style.scss';

export default (async()=>{
    const PGheihei = await import(/* webpackChunkName: "Common_test_index" */'Common/Pgtest');
    class heihei extends PGheihei.default{
    }
    return heihei
})()