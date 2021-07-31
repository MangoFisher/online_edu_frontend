<template>
    <div>
        <el-table
            :data="teacherList"
            style="width: 100%"
            border>
            <el-table-column
                prop="gmtCreate"
                label="序号"
                width="70"
                align="center">
                <template slot-scope="scope">
                    {{ (page - 1) * limit + scope.$index + 1 }}
                </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="80"></el-table-column>
            <el-table-column prop="intro" label="资历" width="80"></el-table-column>
            <el-table-column prop="gmtCreate" label="添加时间" width="160"></el-table-column>
            <el-table-column prop="sort" label="排序" width="60"></el-table-column>
            <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <router-link :to="'/edu/teacher/edit' + scope.row.id">
                        <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
                    </router-link>
                    <el-button type="danger" size="mini" icon="el-icon-delete">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
            :current-page="page"
            :page-size="limit"
            :total="total"
            style="padding: 30px 0; text-align: center;"
            layout="total, prev, pager, next, jumper"
            @current-change="getTeacherListPage">
        </el-pagination>
    </div>
</template>

<script>
import teacher from '@/api/teacher/teacher'
export default {
    data() {
        return {
            teacherList: [],
            page: 1,
            limit: 5,
            total: 0,
            teacherQuery: {}

        }
    },
    methods: {
        getTeacherListPage(page=1) {
            this.page = page
            teacher.getTeacherListPage(this.page, this.limit, this.teacherQuery)
                    .then(response => {
                        console.log(response)
                        this.total = response.data.total
                        this.teacherList = response.data.rows
                    })
                    .catch(error => {
                        console.log(error)
                    })
        }
    },
    created() {
        this.getTeacherListPage()
    }

}
</script>

// <style lang="scss" scoped>

// </style>