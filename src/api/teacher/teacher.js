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
    },

    //修改教师
    updateById(teacher) {
        return request({
            url: `/eduservice/teacher/updateTeacherById/${teacher.id}`,
            method: 'put',
            data: teacher
        })
    },

    //根据id查询教师信息
    getById(id) {
        return request({
            url: `/eduservice/teacher/getTeacherById/${id}`,
            method: 'get',
        })
    },

    //查询所有讲师
    getAllTeacherList() {
        return request({
            url: '/eduservice/teacher/findAll',
            method: 'get'
        })
    }


}