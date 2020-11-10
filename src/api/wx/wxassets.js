import httpRequest from '@/utils/httpRequest' 

export function getDataList(params){
    return httpRequest({
        url: httpRequest.adornUrl('/manage/wxAssets/materialFileBatchGet'),
        method: 'get',
        params: params
    })
}