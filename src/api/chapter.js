import request from '@/utils/request'

export default {
    //获取所有章节、小节
    getChapterVideo(courseId){
        return request({
            url: `/eduservice/chapter/getChapterVideo/${courseId}`,
            method: 'get'
        })
    },

    //添加章节
    addChapter(chapter) {
        return request({
            url: '/eduservice/chapter/addChapter',
            method: 'post',
            data: chapter
        })
    },

    //根据id查询章节
    getChapterInfo(chapterId) {
        return request({
            url: `/eduservice/chapter/getChapter/${chapterId}`,
            method: 'get'
        })
    },

    //修改章节
    updateChapter(chapter) {
        return request({
            url: '/eduservice/chapter/updateChapter',
            method: 'post',
            data: chapter
        })
    },

    //根据id删除章节
    deleteChapterById(chapterId) {
        return request({
            url: `/eduservice/chapter/deleteChapterById/${chapterId}`,
            method: 'delete'
        })
    }
}