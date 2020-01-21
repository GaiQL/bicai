/**
 * 出入参规范:
 */

//
/**
 * 类型buzType
 * wby
 *  0：开户 1:绑定手机号短信验证码 2:绑卡短信验证 3:充值短信验证 4：提现短信验证码 6：存入 7:支取 8:更多服务 9:解卡
 * 10：修改e账户密码 11、重置e账户密码  13、销户 14、账户状态异常实名认证
 */

export const enum BIZ_TYPE {
    open = 0,
    changePhone = 1,
    changeBankCard = 2,
    recharge = 3,
    withdraw = 4,
    cancel = 5, // 撤单
    buy = 6,
    investment = 600, // 投资
    redeem = 7,
    moreService = 8,
    unbindBankCard = 9,
    addBankCard = 10,
    updateFaceYzm = 14, // 更新身份证人脸跳验证传的bizeType(14、账户状态异常实名认证)

    jch = 203  //金城银行特殊标记
}

/**
 * apiQueryOrgBindCard
 * wby
 * 查询类型 0-全部;1-卡列表;2-二类户;3-默认卡
 */
export const enum BANK_CARD_QUERY_TYPE {
    all = 0,
    cardList = 1,
    towCard = 2,
    defaultCard = 3
}

/**
 * api返回code值
 */
export const enum API_CODE {
    Success = '0', //  成功
    Failed = "1", // 失败
    LoginTimeOut = "-2", // 登录超时
    LoginRemote = "-3", // 异地登录
    // 其他均安异常，错误msg
}

/**
 * popType
 * 定义错误提示类型，其他没有类型异常均默认toast
 */
export const enum POP_TYPE {
    Toast = "100", // toast提示
    Tip = "200", // 200为标签或者底部弹框提示（根据具体业务判断
    Alert = "300",// 白色alert弹窗，具体样式交互通过innerCode判断
}

/**
 * innerCode：
 * popType == 300时，默认要弹白色alert框，具体业务样式根据innerCode判断。有些地方可能确实无法完全按照下面弹窗样式，根据具体业务单独处理。
 */
export const enum INNER_CODE {
    SubmitOnly = "100000", // 确定 点击关闭，无操作
    ModifyInfo = "100001", // 修改信息
    ModifyOpenInfo = "100002", // 修改开户信息 => 开户过程中失败去回显页面
    SubmitAndDoThing = "100003", // 确定  => 有功能确定按钮
    CancelAndUpdateIdCard = "100004", // 取消 + 更新身份证
    CancelAndCallPhone = "100005", // 取消 + 立即拨打
    CancelAndDoWithdraw = "100006", // 取消 + 去提现 => 去体现页面。更换银行卡校验需要
    CancelAndDoRedeem = "100007", // 取消 + 去支取 => 更换银行卡校验需要
    CancelAndReAssess = "100008", // 取消 + 重新测评 => 去测评需要测评时
    DoFaceDiscern = "100010", // 确定 => 活体失败去活体
    Signing = '100011', // 取消 + 去签约 => 去代收签约页面
    goSuidePage = '100014', // 取消 + 查看操作指引 => 去微信操作指引页面
    goBcFaceDiscern = '100015', // 活体
    LargeAmounts = '100016', // 取消 + 去大额转账
    CancelAndCallBcPhone = '100019', // 拨打比财客服
    PasswordNotSet = '100017', // 您还未设置交易密码，请设置交易密码后再继续操作
}
