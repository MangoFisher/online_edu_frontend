<template>
    <div>
        <el-form label-width="120px">
            <el-form-item label="信息描述">
                <el-tag type="info">excel模版说明</el-tag>
                <el-tag>
                    <i class="el-icon-download"></i>
                    <a href="assets/static1/test.xlsx"></a>
                </el-tag>
            </el-form-item>

            <el-form-item label="选择excel">
                <el-upload
                    class="upload-demo"
                    ref="upload"
                    :action="BASE_API + '/eduservice/subject/addSubject'" 
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-success="onSuccess"
                    :on-error="onError"
                    :file-list="fileList"
                    :auto-upload="false"
                    :limit="1"
                    accept="application/.xlsx">
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传excel文件，且不超过500kb</div>
                </el-upload>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            fileList: [], //上传的文件列表
            //el-upload action属性不能直接取到环境变量中的VUE_APP_EDU_BASE_API，所以要在组件的
            //数据字段转接一下再绑定到action属性中去
            BASE_API: process.env.VUE_APP_EDU_BASE_API 
        }
    },
    methods: {
        handlePreview() {},
        handleRemove() {},
        submitUpload() {
            this.$refs.upload.submit()
        },
        onSuccess(response) {
            this.$message({
                type: 'success',
                message: response.data.message
            })
            const fileItem = {
                name: response.data.filename,
                url: '' //目前留空，以便后续扩展
            }
            this.fileList.push(fileItem)
            //todo:跳转到课程列表页面
            
        },
        onError() {
            this.$message({
                type: 'error',
                message: response.data.message
            })
        },
        uploadUrl() {
            return process.env.VUE_APP_EDU_BASE_API + '/eduservice/subject/addSubject'
        }

    },
    created() {}
}
</script>

<style lang="less" scoped>

</style>