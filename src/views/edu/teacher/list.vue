<template>
    <div>
        <!-- 查询表单 -->
        <el-form :inline="true" :model="teacherQuery" class="demo-form-inline">
            <el-form-item> 
                <el-input v-model="teacherQuery.name" placeholder="讲师名"/>
            </el-form-item>
            <el-form-item> 
                <el-select v-model="teacherQuery.level" clearable placeholder="讲师头衔"> 
                    <el-option :value="1" label="高级讲师"/>
                    <el-option :value="2" label="首席讲师"/>
                </el-select>
            </el-form-item>
            <el-form-item label="添加时间"> 
                <el-date-picker
                    v-model="teacherQuery.begin"
                    type="datetime"
                    placeholder="选择开始时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    default-time="00:00:00">
                </el-date-picker>
            </el-form-item>
            <el-form-item> 
                <el-date-picker 
                    v-model="teacherQuery.end"
                    type="datetime"
                    placeholder="选择截止时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    default-time="00:00:00">
                </el-date-picker>
            </el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="getTeacherListPage">查 询</el-button> 
            <el-button type="default" @click="resetQueryFild">清空</el-button>
        </el-form>

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
                    <router-link :to="'edit/' + scope.row.id">
                        <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
                    </router-link>
                    <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeById(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
         <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="page"
            :page-size="limit"
            layout="total, prev, pager, next"
            :total="total">
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
            teacherQuery: {
                name: "",
                level: "",
                begin: null,
                end: null
            }

        }
    },
    methods: {
        getTeacherListPage() {
            
            teacher.getTeacherListPage(this.page, this.limit, this.teacherQuery)
                    .then(response => {
                        // console.log(response)
                        this.total = response.data.total
                        this.teacherList = response.data.rows
                    })
                    .catch(error => {
                        console.log(error)
                    })
        },
        //清空条件搜索输入框
        resetQueryFild() {
            this.searchObj = {}
            this.getTeacherListPage()
        },
        //切换页码
        handleCurrentChange(currentPage) {
            console.log("currentPage=" + currentPage)
            this.page = currentPage
            this.getTeacherListPage()
        },
        //按id删除教师
        removeById(id) {
            teacher.removeById(id)
            //删除后重新刷新教师列表页面
            this.getTeacherListPage()
        }
    },
    created() {
        this.getTeacherListPage()
    }

}
</script>

// <style lang="scss" scoped>

// </style>