import {Native} from './appBridge'

export const otherWebHandle = {
    /**
     * 去组合购买 -》资产持有中页面
     * @param options
     */
    goCombinationDetailsFn(options) {
        if (Native.isApp()) {
            Native.goCombinationDetails(options)
        } else {
            console.log(options);
        }
    },

}

