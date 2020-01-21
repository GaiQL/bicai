import {BIZ_TYPE} from "Common/config/params.enum";

export function descFn(bizType, {
    dayDedct,  //  日充值限额
    dayDedctDesc, //  日充值限额 描述
    singleDedct, // * 单笔充值限额
    singleDedctDesc,//  * 单月充值限额 描述
    monthDedct,// * 单月充值限额
    monthDedctDesc,  // * 单月充值限额 描述
    dayQuota, //     * 日提现限额
    dayQuotaDesc,  // * 日提现限额 描述
    singleQuota,// 单笔提现限额
    singleQuotaDesc,// 单笔提现限额
    monthQuota, // 单月提现限额
    monthQuotaDesc, // 当月提现限额 描述
    availableType, //  银行卡不可用类型（1：添加卡，2：更换卡，3：致电，4：超额，5：可用余额）
    availableDesc, // 银行卡不可用描述（添加卡，更换卡，致电，超额，可用余额）
}) {
    switch (bizType) {
        case BIZ_TYPE.buy:
        case BIZ_TYPE.recharge:
            return {
                dayDesc: `${singleDedctDesc ? singleDedctDesc : ''}${singleDedctDesc && dayDedctDesc ? '，' : ''}${dayDedctDesc ? dayDedctDesc : ''}`,
                monthDesc: monthDedctDesc,
                availableDesc,
                availableType
            };
        case BIZ_TYPE.redeem:
        case BIZ_TYPE.withdraw:
            return {
                dayDesc: `${singleQuotaDesc ? singleQuotaDesc : ''}${singleQuotaDesc && dayQuotaDesc ? '，' : ''}${dayQuotaDesc ? dayQuotaDesc : ''}`,
                monthDesc: monthQuotaDesc,
                availableDesc,
                availableType
            };
        default:
            return {
                dayDesc: `${singleDedctDesc ? singleDedctDesc : ''}${singleDedctDesc && dayDedctDesc ? '，' : ''}${dayDedctDesc ? dayDedctDesc : ''}`,
                monthDesc: monthDedctDesc,
                availableDesc,
                availableType
            }


    }
}
