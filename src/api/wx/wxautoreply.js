import httpRequest from '@/utils/httpRequest' 
const url = {
    list: '/manage/msgReplyRule/list',
    remove: '/manage/msgReplyRule/delete'
}

export function getDataList(params) {
    return httpRequest({
        url: httpRequest.adornUrl(url.list),
        method: 'get',
        params: params
    })
}


export function remove(data) {
    return httpRequest({
        url: httpRequest.adornUrl(url.remove),
        method: "post",
        data: data,
    })
}

export function getObj(ruleId,params){
    return  httpRequest({
        url: httpRequest.adornUrl( `/manage/msgReplyRule/info/${ruleId}` ),
        method: "get",
        params: params
    })
}

export function getObjByAppId(){
    return  httpRequest({
        url: httpRequest.adornUrl( `/manage/msgReplyRule/subscribe` ),
        method: "get"
    })
}

export function save(ruleId,params){
    return httpRequest({
        url: httpRequest.adornUrl(
          `/manage/msgReplyRule/${
            !ruleId ? "save" : "update"
          }`
        ),
        method: "post",
        data: params,
      })
}