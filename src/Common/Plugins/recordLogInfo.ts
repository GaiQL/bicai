import { watchApi } from '../api/watch'
import { ORG_ID } from "Common/config/index";
import { Native } from "Common/utils/appBridge"
import { session } from "Common/utils/store";
import {func} from "prop-types";

const orgId = ORG_ID
const { isApp } = Native

export function logLandingPage() {
    if (isApp()) {

    } else {
        watchApi({
            REMARK_DATA: '异业合作-落地页',
            FUNCTION_ID: 'ptp0A000'
        })
    }
}

export function logBanner() {
    if (isApp()) {

    } else {
        watchApi({
            REMARK_DATA: '异业合作-落地页顶部Banner',
            FUNCTION_ID: 'ptb0A000'
        })
    }
}

export function logProductList() {
    if (isApp()) {

    } else {
        watchApi({
            REMARK_DATA: '异业合作-落地页产品列表',
            FUNCTION_ID: 'ptb0A001'
        })
    }
}

export function logBuy() {
    if (isApp()) {

    } else {
        watchApi({
            REMARK_DATA: '异业合作-产品详情页-购买',
            FUNCTION_ID: 'ptb0A002'
        })
    }
}

export function logOpenInfoYzm() {
    if (isApp()) {

    } else {
        watchApi({
            REMARK_DATA: '异业合作-开户-开户信息验证',
            FUNCTION_ID: 'ptb0A003'
        })
    }
}

export function logBindBankCard() {
    if (isApp()) {

    } else {
        watchApi({
            REMARK_DATA: '异业合作-开户-绑定银行卡',
            FUNCTION_ID: 'ptb0A004'
        })
    }
}

export function logOpenSetPwd() {
    if (isApp()) {

    } else {
        watchApi({
            REMARK_DATA: '异业合作-开户-设置密码',
            FUNCTION_ID: 'ptb0A005'
        })
    }
}

export function logRiskEvaluation() {
    if (isApp()) {

    } else {
        watchApi({
            REMARK_DATA: '异业合作-风险评测',
            FUNCTION_ID: 'ptb0A006'
        })
    }
}

export function logSecureLogonBtn() {
    if (isApp()) {

    } else {
        watchApi({
            REMARK_DATA: '异业合作-安全登录-登录按钮',
            FUNCTION_ID: 'ptb0A007'
        })
    }
}

export function logBuyOtherProducts() {
    if (isApp()) {

    } else {
        watchApi({
            REMARK_DATA: '异业合作-购买成功-购买其他产品',
            FUNCTION_ID: 'ptb0A009'
        })
    }
}

export function logDealFailureAgainBuy() {
    if (isApp()) {

    } else {
        watchApi({
            REMARK_DATA: '异业合作-交易失败-重新购买',
            FUNCTION_ID: 'ptb0A010'
        })
    }
}

export function logAssetNoSecureLogin() {
    if (isApp()) {

    } else {
        watchApi({
            REMARK_DATA: '异业合作-我的资产未登录状态-安全登录',
            FUNCTION_ID: 'ptb0A011'
        })
    }
}

export function logCardNextBtn() {
    if (isApp()) {

    } else {
        watchApi({
            REMARK_DATA: '异业合作-实名认证-身份证认证的下一步按钮',
            FUNCTION_ID: 'ptb0A012'
        })
    }
}

export function logBankNextBtn() {
    if (isApp()) {

    } else {
        watchApi({
            REMARK_DATA: '异业合作-实名认证-银行卡认证的下一步按钮',
            FUNCTION_ID: 'ptb0A013'
        })
    }
}

export function logSetPwdSuccess() {
    if (isApp()) {

    } else {
        watchApi({
            REMARK_DATA: '异业合作-实名认证-设置密码完成',
            FUNCTION_ID: 'ptb0A014'
        })
    }
}

export function logBuyRechargeBtn() {
    const appFlag = session.get('appFlag') == 'PC' ? 'PC' : ''
    if (isApp()) {
        watchApi({
            REMARK_DATA: '购买页面-充值按钮',
            FUNCTION_ID: appFlag + 'B000A241'
        })
    } else {
        watchApi({
            REMARK_DATA: '异业合作-购买页面-充值按钮',
            FUNCTION_ID: 'ptb0A015',
            FROM_ID: orgId
        })
    }
}

export function logRechargeOkBtn() {
    if (isApp()) {

    } else {
        watchApi({
            REMARK_DATA: '异业合作-购买页面-充值-确认充值按钮',
            FUNCTION_ID: 'ptb0A016',
            FROM_ID: orgId
        })
    }
}

/**
 * 购买页面-存入
 * @param proId
 */
export function logBuyDeposit(proId?) {
    const appFlag = session.get('appFlag') == 'PC' ? 'PC' : ''
    if (isApp()) {
        watchApi({
            FUNCTION_ID: appFlag + 'B000A243', // 点位
            REMARK_DATA: '购买页面-存入',
            FROM_ID: proId || session.get('proId')
        })
    } else {
        watchApi({
            REMARK_DATA: '异业合作-购买页面-存入',
            FUNCTION_ID: 'ptb0A017',
            FROM_ID: proId || session.get('proId'), //
        })
    }

}

export function logGoCertificationBtn() {
    if (isApp()) {

    } else {
        watchApi({
            REMARK_DATA: '异业合作-实名认证（新）-去实名认证按钮',
            FUNCTION_ID: 'ptb0A018'
        })
    }
}

export function logUploadingBtn() {
    if (isApp()) {

    } else {
        watchApi({
            REMARK_DATA: '异业合作-实名认证（新）-请上传按钮',
            FUNCTION_ID: 'ptb0A019'
        })
    }
}

export function logUploadingCardNextBtn() {
    if (isApp()) {

    } else {
        watchApi({
            REMARK_DATA: '异业合作-实名认证（新）-上传身份证的下一步按钮',
            FUNCTION_ID: 'ptb0A020'
        })
    }
}

export function logCertificationNextBtn() {
    if (isApp()) {

    } else {
        watchApi({
            REMARK_DATA: '异业合作-实名认证（新）-实名认证页面下一步按钮',
            FUNCTION_ID: 'ptb0A021'
        })
    }
}

export function logNoteYzmOkBtn() {
    if (isApp()) {

    } else {
        watchApi({
            REMARK_DATA: '异业合作-实名认证（新）-短信验证确定按钮',
            FUNCTION_ID: 'ptb0A022'
        })
    }
}

export function logAttestationResultOkBtn() {
    if (isApp()) {

    } else {
        watchApi({
            REMARK_DATA: '异业合作-实名认证（新）-认证结果完成按钮',
            FUNCTION_ID: 'ptb0A023'
        })
    }
}

export function logLookSupportBankBtn() {
    if (isApp()) {

    } else {
        watchApi({
            REMARK_DATA: '异业合作-实名认证（新）-查看支持的银行按钮',
            FUNCTION_ID: 'ptb0A024'
        })
    }
}

export function logProductListBottom() {
    if (isApp()) {

    } else {
        watchApi({
            REMARK_DATA: '异业合作-产品列表底部',
            FUNCTION_ID: 'ptb0A025'
        })
    }
}

export function logMyAssetBottom() {
    if (isApp()) {

    } else {
        watchApi({
            REMARK_DATA: '异业合作-我的资产底部',
            FUNCTION_ID: 'ptb0A026'
        })
    }
}

export function logMyAssetLookMyAsset() {
    if (isApp()) {

    } else {
        watchApi({
            REMARK_DATA: '异业合作-我的资产-查看资产',
            FUNCTION_ID: 'ptb0A027'
        })
    }
}


/**
 * 购买成功分享
 * @param porId
 */

export function buySuccessShare(proId?) {
    watchApi({
        FUNCTION_ID: 'ACB0G019', // 点位
        REMARK_DATA: '产品包装页-参与拼团-安全购买-购买成功-活动不错，分享给好友吧', // 中文备
        FROM_ID: proId || session.get("porId"),
        FROM_PR1: '3'
    })
}

/**
 * 购买成功banner
 */
export function buySuccessBanner({couponId,advTitle,advSubHead}) {
    watchApi({
        FUNCTION_ID: 'ACB0L012', // 点位
        REMARK_DATA: '购买完成页-横版banner-领按钮区域',// 中文备
        FROM_ID:couponId,
        ITEM_VALUE :advTitle,
        ITEM_VALUE1 : advSubHead
    })
}

/**
 *  购买成功 点击查看我的资产
 */
export function logBuySuccessLookMyAsset(type:'查看我的资产'|'购买完成' = '查看我的资产') {
    let buyParams = session.get('buyParams') || {}
    let id = buyParams.teamId || buyParams.investId || ''
    if (id || isApp()) {
        watchApi({
            FUNCTION_ID: 'ACB0G018', // 点位
            REMARK_DATA: '购买完成页-安全购买-' + type,
            FROM_ID: id
        })

    } else {
        /**
         * 异业
         */
        watchApi({
            REMARK_DATA: '异业合作-购买成功-' + type,
            FUNCTION_ID: 'ptb0A008',
            FROM_ID: id
        })
    }
}

/**
 * 开户-信息填写页面
 */
export function openInfoReverse() {
    watchApi({
        REMARK_DATA: '开户信息填写页面',
        FUNCTION_ID: 'P000A008'
    })
}

/**
 * 开户-完成结果页面
 */
export function openSuccessPage() {
    watchApi({
        REMARK_DATA: '开户完成结果页面',
        FUNCTION_ID: 'P000A009'
    })
}

/**
 * 购买-存入页面
 * @param proId
 */
export function buyPage(proId) {
    watchApi({
        REMARK_DATA: '产品购买页面',
        FUNCTION_ID: 'P000A010',
        FROM_PR1: proId
    })
}

/**
 * 购买-完成结果页面
 * @param proId
 */
export function buySuccessPage(proId) {
    watchApi({
        REMARK_DATA: '购买完成结果页',
        FUNCTION_ID: 'P000A011',
        FROM_PR1: proId
    })
}


/**
 * 新增
 */

/**
 * 1.同意并开通账户
 */
export function agreeOpenBtn() {
    const appFlag = session.get('appFlag') == 'PC' ? 'PC' : ''
    watchApi({
        REMARK_DATA: '同意并开通账户',
        FUNCTION_ID: appFlag + 'B000A356',
        FROM_PR1: ''
    })
}

export function chooseProfessionBtn() {
    const appFlag = session.get('appFlag') == 'PC' ? 'PC' : ''
    watchApi({
        REMARK_DATA: '职业 请选择按钮',
        FUNCTION_ID: appFlag + 'B000A357',
        FROM_PR1: ''
    })
}
export function choseBankCardBtn() {
    const appFlag = session.get('appFlag') == 'PC' ? 'PC' : ''
    watchApi({
        REMARK_DATA: '银行卡 请添加按钮',
        FUNCTION_ID: appFlag + 'B000A358',
        FROM_PR1: ''
    })
}

export function bindingCardBtn() {
    const appFlag = session.get('appFlag') == 'PC' ? 'PC' : ''
    watchApi({
        REMARK_DATA: '绑定银行卡-下一步',
        FUNCTION_ID: appFlag + 'B000A359',
        FROM_PR1: ''
    })
}

export function perfectOpenInfoBtn() {
    const appFlag = session.get('appFlag') == 'PC' ? 'PC' : ''
    watchApi({
        REMARK_DATA: '完善开户信息-下一步',
        FUNCTION_ID: appFlag + 'B000A360',
        FROM_PR1: ''
    })
}

export function openSmsSubmitBtn() {
    const appFlag = session.get('appFlag') == 'PC' ? 'PC' : ''
    watchApi({
        REMARK_DATA: '输入验证码-确定',
        FUNCTION_ID: appFlag + 'B000A361',
        FROM_PR1: ''
    })
}

export function openSuccessSubmitBtn() {
    const appFlag = session.get('appFlag') == 'PC' ? 'PC' : ''
    watchApi({
        REMARK_DATA: '开户结果-完成',
        FUNCTION_ID: appFlag + 'B000A362',
        FROM_PR1: ''
    })
}

export function faceRecognitionPage() {
    const appFlag = session.get('appFlag') == 'PC' ? 'PC' : ''
    watchApi({
        REMARK_DATA: '人脸识别页面',
        FUNCTION_ID: appFlag + 'B000A363',
        FROM_PR1: ''
    })
}

export function faceRecognitionStartBtn() {
    const appFlag = session.get('appFlag') == 'PC' ? 'PC' : ''
    watchApi({
        REMARK_DATA: '人脸识别开始录制按钮',
        FUNCTION_ID: appFlag + 'B000A364',
        FROM_PR1: ''
    })
}

export function redeemBtn() {
    const appFlag = session.get('appFlag') == 'PC' ? 'PC' : ''
    watchApi({
        REMARK_DATA: 'OpenAPI页面-支取按钮',
        FUNCTION_ID: appFlag + 'B000A365',
        FROM_PR1: ''
    })
}

export function withdrawalBtn() {
    const appFlag = session.get('appFlag') == 'PC' ? 'PC' : ''
    watchApi({
        REMARK_DATA: 'OpenAPI页面-提现按钮',
        FUNCTION_ID: appFlag + 'B000A366',
        FROM_PR1: ''
    })
}

export function pleaseCertificationBtn () {
    const appFlag = session.get('appFlag') == 'PC' ? 'PC' : ''
    watchApi({
        REMARK_DATA: '实名认证-人脸认证-请认证按钮',
        FUNCTION_ID: appFlag + 'B000A378',
        FROM_PR1: ''
    })
}

export function realNameUpdateBtn () {
    const appFlag = session.get('appFlag') == 'PC' ? 'PC' : ''
    watchApi({
        REMARK_DATA: '实名认证-更新身份证-更新按钮',
        FUNCTION_ID: appFlag + 'B000A379',
        FROM_PR1: ''
    })
}

/**
 * 持有页-提前支取
 * @param proId
 */
export function withdrawingInAdvanceBtn (proId) {
    const appFlag = session.get('appFlag') == 'PC' ? 'PC' : ''
    watchApi({
        REMARK_DATA: '产品明细页-持有中-提前支取',
        FUNCTION_ID: appFlag + 'B000A244',
        FROM_PR1: proId
    })
}

/**
 * 持有页-再次存入
 * @param proId
 */
export function againDepositBtnBtn (proId) {
    const appFlag = session.get('appFlag') == 'PC' ? 'PC' : ''
    watchApi({
        REMARK_DATA: '产品明细页-持有中-再次存入',
        FUNCTION_ID: appFlag + 'B000A245',
        FROM_PR1: proId
    })
}

/**
 * 支取完成页-完成
 * @param proId
 */
export function WithdrawSuccessBtn (proId) {
    const appFlag = session.get('appFlag') == 'PC' ? 'PC' : ''
    watchApi({
        REMARK_DATA: '产品明细页-持有中-提前支取-立即支取-完成',
        FUNCTION_ID: appFlag + 'B000A247',
        FROM_PR1: proId
    })
}

/**
 * 组合购买-资产落地页-持仓明细-查看组合详情
 */
export function buyLookCombinationDetailsBtn(proId) {
    watchApi({
        REMARK_DATA: '组合购买-资产落地页-持仓明细-查看组合详情',
        FUNCTION_ID: 'B000A398',
        FROM_ID: proId
    })
}

/**
 * 电子账户首页-充值
 */
export function bankHomeRechargePageBtn() {
    const appFlag = session.get('appFlag') == 'PC' ? 'PC' : ''
    watchApi({
        REMARK_DATA: '电子账户首页-充值',
        FUNCTION_ID: appFlag + 'B000A427'
    })
}


/**
 * 电子账户首页-提现
 */
export function bankHomeWithdrawBtn() {
    const appFlag = session.get('appFlag') == 'PC' ? 'PC' : ''
    watchApi({
        REMARK_DATA: '电子账户首页-提现',
        FUNCTION_ID: appFlag + 'B000A428'
    })
}

/**
 * 电子账户首页-查看本行全部产品
 */
export function lookAllProductsBtn() {
    const appFlag = session.get('appFlag') == 'PC' ? 'PC' : ''
    watchApi({
        REMARK_DATA: '电子账户首页-查看本行全部产品',
        FUNCTION_ID: appFlag + 'B000A429'
    })
}


/**
 * 电子账户首页-持有产品点击
 */
export function holdProductsBtn(PR1, PR2) {
    const appFlag = session.get('appFlag') == 'PC' ? 'PC' : ''
    watchApi({
        REMARK_DATA: '电子账户首页-持有产品点击',
        FUNCTION_ID: appFlag + 'B000A430',
        FROM_PR1: PR1, //
        FROM_PR2: PR2,
    })
}


/**
 * 电子账户首页-充值页面-金额文本框点击
 */
export function rechargeMoneyInputBtn() {
    const appFlag = session.get('appFlag') == 'PC' ? 'PC' : ''
    watchApi({
        REMARK_DATA: '电子账户首页-充值页面-金额文本框点击',
        FUNCTION_ID: appFlag + 'B000A431'
    })
}


/**
 * 电子账户首页-充值页面-付款账户点击
 */
export function paymentAccountBtn() {
    const appFlag = session.get('appFlag') == 'PC' ? 'PC' : ''
    watchApi({
        REMARK_DATA: '电子账户首页-充值页面-付款账户点击',
        FUNCTION_ID: appFlag + 'B000A432'
    })
}


/**
 * 电子账户首页-充值页面-充值按钮
 */
export function rechargePageBtn() {
    const appFlag = session.get('appFlag') == 'PC' ? 'PC' : ''
    watchApi({
        REMARK_DATA: '电子账户首页-充值页面-充值按钮',
        FUNCTION_ID: appFlag + 'B000A433'
    })
}


/**
 * 电子账户首页-充值页面-大额转入按钮
 */
export function largeintoBtn() {
    const appFlag = session.get('appFlag') == 'PC' ? 'PC' : ''
    watchApi({
        REMARK_DATA: '电子账户首页-充值页面-大额转入按钮',
        FUNCTION_ID: appFlag + 'B000A434'
    })
}

/**
 * 电子账户首页-充值页面-输入验证码-确定
 */
export function rechargeVerificationCodeBtn() {
    const appFlag = session.get('appFlag') == 'PC' ? 'PC' : ''
    watchApi({
        REMARK_DATA: '电子账户首页-充值页面-输入验证码-确定',
        FUNCTION_ID: appFlag + 'B000A435'
    })
}

/**
 * 存入界面输入验证码-确定
 */
export function buyVerificationCodeBtn() {
    const appFlag = session.get('appFlag') == 'PC' ? 'PC' : ''
    watchApi({
        REMARK_DATA: '存入界面输入验证码-确定',
        FUNCTION_ID: appFlag + 'B000A436'
    })
}

