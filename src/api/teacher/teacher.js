import request from '@/utils/request'

export default {
    //讲师列表
    //current当前页 limit每页记录数 teacherQuery条件对象
    getTeacherListPage(current, limit, teacherQuery) {
        return request({
            url: `/eduservice/teacher/pageTeacherCondition/${current}/${limit}`,
            method: 'post',
            data: teacherQuery
        })
    },

    //按照id删除教师
    removeById(teacherId) {
        return request({
            url: `/eduservice/teacher/deleteById/${teacherId}`,
            method: 'delete',
        
        })
    },

    //新增教师
    save(teacher) {
        return request({
            url: `/eduservice/teacher/add`,
            method: 'post',
            data: teacher
        })
    }

}