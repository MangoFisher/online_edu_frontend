<template>
    <div class="app-container"> 
        <h2 style="text-align: center;">发布新课程</h2> 
        <el-steps :active="activeIndex" process-status="wait" align-center style="marginbottom: 40px;"> 
            <el-step title="填写课程基本信息"/>
            <el-step title="创建课程大纲"/>
            <el-step title="提交审核"/>
        </el-steps> 
        <el-form label-width="120px"> 
            <el-form-item label="课程标题">
                <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视"/>
            </el-form-item>
            <!-- 所属分类 TODO -->
            <el-form-item label="课程分类"> 
                <el-select
                    v-model="courseInfo.subjectParentId"
                    placeholder="一级分类"
                    @change="handleChange"> 
                    <el-option
                        v-for="subject in oneSubjectList"
                        :key="subject.id"
                        :label="subject.title"
                        :value="subject.id"/>
                </el-select>
            
                <el-select
                    v-model="courseInfo.subjectId"
                    placeholder="二级分类"> 
                    <el-option
                        v-for="subject in twoSubjectList"
                        :key="subject.id"
                        :label="subject.title"
                        :value="subject.id"/>
                </el-select>
            </el-form-item>
            <!-- 课程讲师 -->
            <el-form-item label="课程讲师"> 
                <el-select
                    v-model="courseInfo.teacherId"
                    placeholder="请选择"> 
                    <el-option
                        v-for="teacher in teacherList"
                        :key="teacher.id"
                        :label="teacher.name"
                        :value="teacher.id"/>
                </el-select>
            </el-form-item>

            <el-form-item label="总课时"> 
                <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder=""/>
            </el-form-item>
            <!-- 课程简介-->
            <el-form-item label="课程简介">
                <editor :init="tinyInit" v-model="courseInfo.description">

                </editor>
            </el-form-item>
            <!-- 课程封面-->
            <el-form-item label="课程封面">
                <el-upload
                    :action="BASE_API + '/serviceoss/file/upload'"
                    :on-change="handleUploadChange"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                    :limit="1"
                    >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过**kb</div>
                </el-upload>
            </el-form-item>


            <el-form-item label="课程价格"> 
                <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder=""/>
            </el-form-item> 
            <el-form-item> 
                <el-button :disabled="saveBtnDisabled" type="primary" @click="next">保存并下一步</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import course from '@/api/course/course'
import teacher from '@/api/teacher/teacher'
import subject from '@/api/subject/subject'

import axios from 'axios'
import Editor from '@tinymce/tinymce-vue'
export default {
    components: {
      'editor': Editor
    },
    data() {
        return {
            saveBtnDisabled: false,
            //被激活的步骤条索引
            activeIndex: 1,
            courseInfo: {
                title: '',
                subjectId: '',
                subjectParentId: '',
                teacherId: '',
                lessonNum: 0,
                description: '',
                cover: '',
                price: 0
            },
            teacherList: [],
            oneSubjectList: [], //一级分类列表
            twoSubjectList: [],
            BASE_API: process.env.VUE_APP_OSS_BASE_API,
            uploadFileList: [],
            tinyInit: {

                        language_url: '/tinymce/zh_CN.js', //中文包
                        language: 'zh_CN', //中文
                        height: 500,
                        menubar: false,
                        plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                        ],
                        toolbar:
                        'image | undo redo | formatselect | bold italic backcolor | \
                        alignleft aligncenter alignright alignjustify | \
                        bullist numlist outdent indent | removeformat | help',
                        browser_spellcheck: true, // 拼写检查
                        branding: false, // 去水印
                        elementpath: true, //禁用编辑器底部的状态栏
                        statusbar: true, // 隐藏编辑器底部的状态栏
                        paste_data_images: true, // 是否允许粘贴图像
                        menubar: true, // 隐藏最上方menu
                        fontsize_formats: '14px 16px 18px 20px 24px 26px 28px 30px 32px 36px', //字体大小
                        font_formats:'微软雅黑=Microsoft YaHei,Helvetica Neue;PingFang SC;sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun;serifsans-serif;Terminal=terminal;monaco;Times New Roman=times new roman;times', //字体
                        file_picker_types: 'image',
                        images_upload_credentials: false,

                        // 图片上传三个参数，图片数据，成功时的回调函数，失败时的回调函数
                        images_upload_handler: function(blobInfo, success, failure) {
                            let formdata = new FormData();
                            console.log(blobInfo)
                            formdata.append("file", blobInfo.blob(), blobInfo.filename());



                            // 上传图片接口，跟后端同事协调上传图片
                            // http://hh.xxxx.cn/admin/upload为上传图片接口
                            axios.post('http://localhost:8002/serviceoss/file/upload',formdata)
                            .then(function(res) {
                                console.log(res.data.url)
                                success(res.data.url);
                            }).catch(res => {
                            failure("error");
                            });
                        }
                    
            },
            courseId: ''
            
        }
    },
    methods: {
        //保存并下一步
        next() {
            if(this.$route.params && this.$route.params.id) {
                this.updateCourseInfo()
                this.$router.push('/course/chapter/' + this.courseId) 
            } else {
                course.addCourse(this.courseInfo)
                .then(response => {
                    this.$message({
                        type: 'success',
                        message: '添加课程信息成功'
                    })
                    this.$router.push('/course/chapter/' + response.data.courseId) 
                }) 
            }

            
            
        },
        //获取所有讲师列表
        getAllTeacherList() {
            teacher.getAllTeacherList()
                .then(response => {
                    this.teacherList = response.data.teachers
                })
        },
        //获取所有一级分类列表(二级分类的数据也存在于一级分类的children字段中)
        getAllSubject() {
            subject.getAllSubject()
                .then(response => {
                    this.oneSubjectList = response.data.list
                })
        },
        //一级分类选择器发生变化
        handleChange() {
            this.courseInfo.subjectId = ''
            for (var i=0; i<this.oneSubjectList.length; i++) {
                var oneSubject = this.oneSubjectList[i]
                if(this.courseInfo.subjectParentId === oneSubject.id) {
                    this.twoSubjectList = oneSubject.children
                }
            }
        },
        //文件上传成功
        handleAvatarSuccess(res, file) {
            this.courseInfo.cover = res.data.url
        },
        //文件上传前
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'img/jpeg'
            const isLt2M = (file.size / 1024 / 1024) < 100
            console.log(file.size)
            if(false) {
                this.$message.error("图片不是jpeg格式")
            } 
            if(!isLt2M) {
                this.$message.error("图片大小不能超过100M")
            }
            return true
        },
        handleUploadChange(file, fileList) {
            this.uploadFileList = fileList.slice(-3);
        },
        //根据id查询课程信息
        getCourseInfo() {
            course.getCourseInfo(this.courseId)
                .then(response => {
                    this.courseInfo = response.data.courseInfoVo
                    subject.getAllSubject()
                        .then(response => {
                            this.oneSubjectList = response.data.list
                            for(var i=0; i<this.oneSubjectList.length; i++) {
                                var oneSubject = this.oneSubjectList[i]
                                if(this.courseInfo.subjectParentId == oneSubject.id) {
                                    this.twoSubjectList = oneSubject.children
                                }
                            }
                        })
                })
        },
        //更新课程信息
        updateCourseInfo() {
            course.updateCourseInfo(this.courseInfo)
                .then(response => {
                    this.$message({
                        type: 'success',
                        message: '修改课程信息成功'
                    })
                })
        }
    },
    created() {
        //获取路由中的id值
        if(this.$route.params && this.$route.params.id) {
            this.courseId = this.$route.params.id
            this.getCourseInfo()
        } else {
            this.getAllTeacherList()
            this.getAllSubject()
        }
        
    }
    
}
</script>