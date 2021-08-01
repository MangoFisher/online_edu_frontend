<template>
    <div>
        <el-form label-width="120px" :model="teacher">
            <el-form-item label="讲师名称"> 
                <el-input v-model="teacher.name" />
            </el-form-item>
            <el-form-item label="讲师排序"> 
                <el-input-number v-model="teacher.sort" controls-position="right" />
            </el-form-item>
            <el-form-item label="讲师头衔"> 
                <el-select v-model="teacher.level" clearable placeholder="请选择">
                    <!--
                    数据类型一定要和取出的json中的一致，否则没法回填
                    因此，这里value使用动态绑定的值，保证其数据类型是number
                    -->
                    <el-option :value="1" label="高级讲师"/>
                    <el-option :value="2" label="首席讲师"/>
                </el-select>
            </el-form-item>
            <el-form-item label="讲师资历"> 
                <el-input v-model="teacher.career"/>
            </el-form-item>
            <el-form-item label="讲师简介"> 
                <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
            </el-form-item>
            <!-- 讲师头像：TODO -->
            <el-form-item> 
                <el-button type="primary" @click="updateOrSave">保存</el-button>
            </el-form-item>

        </el-form>
    </div>
</template>

<script>
import teacher from '@/api/teacher/teacher'
export default {
    data() {
        return{
            teacher: {
                name: '',
                sort: 0,
                level: 1,
                career: '',
                intro: '',
                avatar: ''
            }
        }
    },
    methods: {
        //保存教师信息(更新or新增)
        updateOrSave() {
            if(this.$route.params && this.$route.params.id) {
                this.getInfoById(this.$route.params.id)
                teacher.updateById(this.teacher)
                this.$router.push('/teacher/list')
                return
            }
            teacher.save(this.teacher)
            this.$router.push('/teacher/list')
        },
        //根据id获取教师信息
        getInfoById(id) {
            teacher.getById(id).then(response => {
                this.teacher = response.data.item
            }).catch(error => {
                        console.log(error)
                    })
        }
    },
    created() {
        //新增和修改使用同一个组件add.vue,所以需要通过判断路由中是否有id字段来区分
        if(this.$route.params && this.$route.params.id) {
            const id = this.$route.params.id
            this.getInfoById(id)
        }
    }
}
</script>

<style lang="less" scoped>

</style>