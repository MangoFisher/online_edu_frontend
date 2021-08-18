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
    }
}