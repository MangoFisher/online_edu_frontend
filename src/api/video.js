import request from '@/utils/request'

export default {
    //添加小节
    addVideo(video) {
        return request({
            url: '/eduservice/video/addVideo',
            method: 'post',
            data: video
        })
    },

    //修改小节
    updateVideo(video) {
        return request({
            url: '/eduservice/video/updateVideo',
            method: 'post',
            data: video
        })
    },

    //根据id删除小节
    deleteVideoById(videoId) {
        return request({
            url: `/eduservice/video/deleteVideoById/${videoId}`,
            method: 'delete'
        })
    },

    //根据id查询小节
    getVideo(videoId) {
        return request({
            url: `/eduservice/video/getVideo/${videoId}`,
            method: 'get'
        })
    }
}