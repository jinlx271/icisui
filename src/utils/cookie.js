/**
 * 注释:如果无法使用请在 cookieObj 加入对象,统一管理,谢谢配合
 */
const winning = 'winning-ICIS-'
const cookieObj = {
    'permissionsBtn': `${winning}permissionsBtn`,
    'menuPathList': `${winning}menuPathList`,
    'userInfo': `${winning}userInfo`,
    'systemInfo': `${winning}systemInfo`,
    'userWardList': `${winning}userWardList`,
    'currentUserWard': `${winning}currentUserWard`,
    'currWardShiftInfo': `${winning}currWardShiftInfo`,
    'token': `${winning}token`, // 验签内容
    'role': `${winning}role`, // 登录职级 医生 护士 管理员
    'tree': `${winning}tree`, // 菜单
    'currentUserSkin': `${winning}currentUserSkin` // 主题皮肤
}
export function getCookie(cookieName) {
    const toeckeStr = sessionStorage.getItem(cookieObj[cookieName])
    if (toeckeStr == null || toeckeStr === '') {
        return null
    }
    if (typeof toeckeStr === 'string') {
        try {
            return JSON.parse(toeckeStr)
        } catch (e) {
            return {}
        }
    }
}
/**
 *
 * @param {*} cookieName 存储名字
 * @param {*} tokenInfo 存储参数
 * @param {*} flag 是否合并之前参数
 * expires 存储多少天
 */
export function setCookie(cookieName, tokenInfo, flag = false, expires) {
    // 合并参数
    if (flag) tokenInfo = Object.assign({}, getCookie(cookieObj[cookieName]), tokenInfo)
    return sessionStorage.setItem(cookieObj[cookieName], JSON.stringify(tokenInfo))
}

export function removeCookie(cookieName) {
    return sessionStorage.removeItem(cookieObj[cookieName])
}

export function cleanCookie() {
    sessionStorage.removeItem(cookieObj['permissionsBtn'])
    sessionStorage.removeItem(cookieObj['menuPathList'])
    sessionStorage.removeItem(cookieObj['userInfo'])
    sessionStorage.removeItem(cookieObj['systemInfo'])
    sessionStorage.removeItem(cookieObj['userWardList'])
    sessionStorage.removeItem(cookieObj['currentUserWard'])
    sessionStorage.removeItem(cookieObj['currWardShiftInfo'])
    sessionStorage.removeItem(cookieObj['token'])
    sessionStorage.removeItem(cookieObj['role'])
    sessionStorage.removeItem(cookieObj['tree'])
}
