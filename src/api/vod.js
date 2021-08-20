import request from '@/utils/request'

// request.defaults.baseURL = 'process.env.VUE_APP_VOD_BASE_API'

export default {

    //删除上传到阿里云的视频
    deleteAliyunVideo(videoId) {
        return request({
            //因为后端服务vod接口同服务edu是不同的端口，这里必须要修改baseURL
            baseURL: process.env.VUE_APP_VOD_BASE_API,
            url: `/eduservice/vod/deleteAliyunVideo/${videoId}`,
            method: 'delete'
        })
    }
}