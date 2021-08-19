import request from '@/utils/request'

export default {
    addCourse(courseInfo){
        return request({
            url: '/eduservice/course/addCourse',
            method: 'post',
            data: courseInfo
        })
    },

    //根据课程id查询课程基本信息
    getCourseInfo(courseId){
        return request({
            url: `/eduservice/course/getCourseInfo/${courseId}`,
            method: 'get',
        })
    },

    //修改课程信息
    updateCourseInfo(courseInfoVo) {
        return request({
            url: '/eduservice/course/updateCourseInfo',
            method: 'post',
            data: courseInfoVo
        })
    },

    //根据课程id获取课程确认信息
    getPublishCourseInfo(courseId) {
        return request({
            url: `/eduservice/course/getPublishCourseInfo/${courseId}`,
            method: 'get',
        })
    },

    //课程最终发布
    publishCourse(courseId) {
        return request({
            url: `/eduservice/course/publishCourse/${courseId}`,
            method: 'post', //注意这里不需要写data字段哦！！！！
            
        })
    },

    //获取所有课程列表
    getCourseList() {
        return request({
            url: '/eduservice/course/getCourseList',
            method: 'get',
        })
    },

    //TODO条件查询课程
    getPageCourseList(current, limit, searchObj) {
        return request({
            url: `/eduservice/course/getPageCourseList/${current}/${limit}`,
            method: 'post',
            data: searchObj
        })
    },

    //根据课程id删除课程、简介、章节、小节
    deleteCourseById(courseId) {
        return request({
            url: '/eduservice/course/deleteCourseById/' + courseId,
            method: 'delete',
        })
    }
}