

import { session } from "Common/utils/store";
export class Help {

    /**
     * 正则列表
     * https://www.cnblogs.com/zxin/archive/2013/01/26/2877765.html
     */
    public Regular = {
        /** 手机号 */
        mobilePhone: /0?(13|14|15|17|18|19)[0-9]{9}/,
        /** 电话 */
        telephone: /[0-9-()（）]{7,18}/,
        /** 邮箱 */
        email: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
        /** 身份证 */
        cardID: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
        /** 网址 url */
        url: /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/,
        /** 英文 */
        english: /^[A-Za-z]+$/,
        /** 英文和数字 */
        englishFigures: /^[A-Za-z0-9]+$/,
        /** 中文字符 */
        chinese: /[\u4e00-\u9fa5]/,
        /** 中文、英文、数字但不包括下划线等符号 */
        character: /^[\u4E00-\u9FA5A-Za-z0-9]+$/,
        /**分割银行卡号 */
        splitBank: (val: string) => {
            return val.replace(/[ \f\t\v]/g, '').replace(/(\d{4})(?=\d)/g, "$1 ")
        },
        trimSpace: (val: string) => {
            return val.replace(/\s*/g, "")
        },
        //分割手机号
        splitPhone: (mobile) => {
            if (mobile) {
                var value = mobile.replace(/\D/g, "").substring(0, 11);
                var valueLen = value.length;
                if (valueLen > 3 && valueLen < 8) {
                    value = value.replace(/^(...)/g, "$1 ");
                } else if (valueLen >= 8) {
                    value = value.replace(/^(...)(....)/g, "$1 $2 ");
                }
                return value;
            }
        },
        bcphone: /^1[23456789]\d{9}$/,
        /** 数字 */
        number: {
            /** 数字  */
            ordinary: /^[0-9]*$/,
            /** 正数 */
            just: /[1-9]\d*/,
            /** 负数 */
            negative: /-[1-9]\d*/
        }
    }
    //去除文字
    trimText(val) {
        return val.replace(/[\u4e00-\u9fa5]/, '')
    }
    //处理样式
    px2rem(px) {
        return px*10/375 + 'rem';
    }
    
    /**
     * 格式化金额 千分位 加小数点
     * @param str  eg:30000
     * @returns {*} eg:3,000.00
     */
    formatNum(str, flag?) {
        if (!str) {
            if (flag == 1) {
                return '--'
            } else {
                return ''
            }
        }
        // console.log(typeof str)
        if (str.indexOf(",") != -1) {
            return str
        }
        str = str + ''
        str = str.trim()
        var newStr = "";
        var count = 0;
        if (str.indexOf(".") == -1) {
            for (var i = str.length - 1; i >= 0; i--) {
                if (count % 3 == 0 && count != 0) {
                    newStr = str.charAt(i) + "," + newStr;
                } else {
                    newStr = str.charAt(i) + newStr;
                }
                count++;
            }
            str = newStr + ".00"; //自动补小数点后两位
            return str
        } else {
            for (var i = str.indexOf(".") - 1; i >= 0; i--) {
                if (count % 3 == 0 && count != 0) {
                    newStr = str.charAt(i) + "," + newStr; //碰到3的倍数则加上“,”号
                } else {
                    newStr = str.charAt(i) + newStr; //逐个字符相接起来
                }
                count++;
            }
            str = newStr + (str + "00").substr((str + "00").indexOf("."), 3);
            return str
        }
    }
    /**
     * 去除千分位
     * @param num eg: 1,000.00
     * @returns {*} eg: 1000
     */
    clearComma(num) {
        if (num == null) return ''
        return num.replace(/,/gi, '')
    }

    /**
    * 去除留下银行卡后四位
    * @param num eg: 677385435464654665
    * @returns {*} eg: 4665
    */
    fromatCardFour(value) {
        if (!value) return "****";
        value = value.substring(value.length - 4);
        return value;
    }

    /**
     * 格式化银行卡号 隔四位增减空格
     * @param val
     * @returns {*}
     * @constructor
     */
    BankNo_Filter(val) {
        if (!val) {
            return val
        } else {
            return val.replace(/(\d{4})(?=\d)/g, "$1" + " ")
        }
    }

    /**
     * 手机号中间四位为****
     * @param value
     * @returns {*}
     * @constructor
     */
    fromatMobileFilter(val) {
        val = val + "";
        if (!val) return val;
        return val.substr(0, 3) + "****" + val.substr(val.length - 4);
    }

    /**
     * 数字相减
     * @param arg1 eg: 1,000.00
     * @param arg2 eg: 2,000.00
     * @returns 相减结果
     */
    accSub(arg1, arg2) {
        var r1, r2, m, n;
        try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
        try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
        m = Math.pow(10, Math.max(r1, r2));
        //last modify by deeka
        //动态控制精度长度
        n = (r1 >= r2) ? r1 : r2;
        return ((arg2 * m - arg1 * m) / m).toFixed(n);
    }
    clearSpot(num) {
        return num.replace(/(,|\.00)/gi, '')
    }

     /**
     *  - 替换成 '年'
     * @param -
     * @param 年
     * @returns 相减结果
     */
    fromatDateYear(val) {
        if (val == "本月") return "本月"
        if (!val) return "";
        val = val.replace('-','年');
        return val+'月';
    }

    /**
     * 金钱单位转换
     * @param money 金钱
     */
    convertCurrency(money) {
        let tranvalue = money.toString()
        let Company = ''
        let prefix = ''
        let last = tranvalue.length >= 5 ? 4 : (tranvalue.length == 3 ? 0 : 3)
        let count = 0
        switch (tranvalue.length) {
            case 7:
                Company = '万'
                prefix = tranvalue[0] + tranvalue[1] + tranvalue[2]
                break;
            case 6:
                Company = '万'
                prefix = tranvalue[0] + tranvalue[1]
                break;
            case 5:
                Company = '万'
                prefix = tranvalue[0]
                break;
            case 4:
                Company = '千'
                prefix = tranvalue[0]
                break;
            case 3:
                Company = ''
                prefix = tranvalue
                break;
            default:
                Company = '0'
                prefix = tranvalue[0]

        }
        let Quota = ''
        for (let i = tranvalue.length - last; i <= tranvalue.length - 1; i++) {         // 4 - 3
            if (tranvalue[i] >= 1) {
                count++
                if (count <= 1) {
                    Quota += '.' + tranvalue[i]
                } else {
                    Quota += tranvalue[i]
                }
            } else {
                Quota += ''
            }
        }
        return prefix + Quota + Company
    }
    StorageAddressBar = () => {
        session.set('changeBankOriginPage', window.location.href.split('#/')[1])
    }
}
export default new Help();