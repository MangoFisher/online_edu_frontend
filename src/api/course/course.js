import request from '@/utils/request'

export default {
    addCourse(courseInfo){
        return request({
            url: '/eduservice/course/addCourse',
            method: 'post',
            data: courseInfo
        })
    }
}