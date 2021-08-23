<template>
    <div class="app-container"> 
        <h2 style="text-align: center;">发布新课程</h2> 
        <el-steps :active="2" process-status="wait" align-center style="marginbottom: 40px;"> 
            <el-step title="填写课程基本信息"/>
            <el-step title="创建课程大纲"/>
            <el-step title="提交审核"/>
        </el-steps> 

        <el-button type="text" @click="addClick">添加章节</el-button>
        <!-- 章节 -->
        <ul class="chanpterList">
            <li
                v-for="chapter in chapterVideoList"
                :key="chapter.id">
                <p>
                    {{ chapter.title }}
                    <span class="acts">
                        <el-button type="primary" size="mini" @click="openVideoDialog(chapter.id)">添加课时</el-button> 
                        <el-button type="primary" size="mini" @click="editChapter(chapter.id)">编辑</el-button>
                        <el-button type="danger" size="mini" @click="deleteChapter(chapter.id)">删除</el-button>
                    </span>
                </p>
                <!-- 视频 -->
                <ul class="chanpterList videoList"> 
                    <li
                        v-for="video in chapter.children"
                        :key="video.id"> 
                        <p>{{ video.title }}
                            <span class="acts"> 
                                <el-button type="text" @click="editVideo(video.id)">编辑</el-button> 
                                <el-button type="text" @click="deleteVideo(video.id)">删除</el-button>
                            </span>
                        </p>
                    </li>
                </ul>
            </li>
        </ul>

        <div>
            <el-button @click="previous">上一步</el-button> 
            <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
        </div>

        <!-- <el-form label-width="120px"> 
            <el-form-item> 
                <el-button @click="previous">上一步</el-button> 
                <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
            </el-form-item>
        </el-form> -->

        <!-- 添加和修改章节表单 -->
        <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节"> 
            <el-form :model="chapterInfo" label-width="120px"> 
                <el-form-item label="章节标题"> 
                    <el-input v-model="chapterInfo.title"/>
                </el-form-item> 
                <el-form-item label="章节排序"> 
                    <el-input-number v-model="chapterInfo.sort" :min="0" position="right"/>
                </el-form-item>
            </el-form> 
            <div slot="footer" class="dialog-footer"> 
                <el-button @click="dialogChapterFormVisible = false">取 消</el-button> 
                <el-button type="primary" @click="chapterSaveOrUpdate">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 添加和修改课时表单 -->
        <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时" @close="closeVideoDialog">
            <el-form  :model="video" ref="videoFormRef" label-width="120px">
                <el-form-item label="课时标题" prop="课时标题"> 
                    <el-input v-model="video.title"/>
                </el-form-item>
                <el-form-item label="课时排序" prop="课时排序"> 
                    <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
                </el-form-item>
                <el-form-item label="是否免费" prop="是否免费"> 
                    <el-radio-group v-model="video.isFree"> 
                        <el-radio :label="1">免费</el-radio> 
                        <el-radio :label="0">默认</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="上传视频" prop="上传视频">
                    <el-upload
                        :on-success="handleVodUploadSuccess"
                        :on-remove="handleVodRemove"
                        :before-remove="beforeVodRemove"
                        :on-exceed="handleUploadExceed"
                        :file-list="fileList"
                        :action="BASE_API + '/eduservice/vod/uploadAliyunVideo'"
                        :limit="1"
                        class="upload-video"
                        >
                    <el-button size="small" type="primary">上传视频</el-button>
                    <el-tooltip placement="right-end">
                        <div slot="content">最大支持*G，<br>
                            支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                            GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                            MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                            SWF、TS、VOB、WMV、WEBM 等视频格式上传
                        </div>
                        <i class="el-icon-question"/>
                    </el-tooltip>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer"> 
                <el-button @click="dialogVideoFormVisible = false">取 消</el-button> 
                <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import chapter from '@/api/chapter'
import video from '@/api/video'
import course from '@/api/course/course'
import vod from '@/api/vod'
export default {
    data() {
        return {
            saveBtnDisabled: false,
            chapterVideoList: [],
            chapterId: '',
            courseId: '',
            dialogChapterFormVisible: false,
            addVideoFlag: false,
            chapterInfo: {
                title: '',
                sort: '',
                courseId: this.$route.params.id

            },
            //video其实是小节的数据结构
            video: {
                title: '',
                sort: 0,
                isFree: 0,
                //上传到阿里云的视频的id
                videoSourceId: '',
                videoOriginalName: ''
            },
            dialogVideoFormVisible: false,
            saveVideoBtnDisabled: false,
            //添加小节或者编辑小节的标志
            addFlag: false,
            BASE_API: process.env.VUE_APP_VOD_BASE_API,
            fileList: [],//小节中上传视频文件列表
        }
    },
    created() {
        //获取路由中的id值
        if(this.$route.params && this.$route.params.id) {
            this.courseId = this.$route.params.id
        }
        this.getChapterVideo()
    },
    methods: {
        previous() {
            this.$router.push({ path: '/course/info/' + this.courseId })
        },
        next() {
            this.$router.push('/course/publish/' + this.courseId) 
        },
        //获取指定课程的章节和小节
        getChapterVideo() {
            chapter.getChapterVideo(this.courseId)
                .then(response => {
                    this.chapterVideoList = response.data.allChapterVideo
                })
        },

        //添加章节
        addChapter() {
            chapter.addChapter(this.chapterInfo)
                .then(response => {
                    //关闭弹窗
                    this.dialogChapterFormVisible = false
                    //提示
                    this.$message({
                        type: 'success',
                        message: '添加章节成功'
                    })
                    //刷新页面
                    this.getChapterVideo()
                })
        },

        //更新章节
        updateChapter() {
            this.chapterInfo.id = this.chapterId
            chapter.updateChapter(this.chapterInfo)
                .then(response => {
                    //关闭弹窗
                    this.dialogChapterFormVisible = false
                    //提示
                    this.$message({
                        type: 'success',
                        message: '修改章节成功'
                    })
                    //刷新页面
                    this.getChapterVideo()
                })
        },

        //添加或更新章节
        chapterSaveOrUpdate() {
            if(!this.addFlag) {
                this.updateChapter()
            } else {
                this.addChapter()
            }
            this.addFlag = false
        },
        addClick() {
            this.dialogChapterFormVisible = true
            this.chapterInfo.title = ''
            this.chapterInfo.sort = 0
            this.addFlag = true
            
        },
        //编辑章节
        editChapter(chapterId) {
            this.dialogChapterFormVisible = true
            this.chapterId = chapterId
            chapter.getChapterInfo(chapterId)
                .then(response => {
                    this.chapterInfo.title = response.data.chapter.title
                    this.chapterInfo.sort = response.data.chapter.sort
                })
            // this.updateChapter()
        },
        //删除章节
        deleteChapter(chapterId) {
            chapter.deleteChapterById(chapterId)
                .then(response => {
                    this.$message({
                        type: 'warn',
                        message: '删除章节成功'
                    })
                })
            this.getChapterVideo()
            
        },
        /******************************小节操作**************************************/
        //打开增加课时的对话框
        openVideoDialog(chapterId) {
            this.dialogVideoFormVisible = true
            this.video.chapterId = chapterId
            this.addVideoFlag = true
        },

        //增加课时的执行函数
        addVideo(){
            this.video.courseId = this.courseId
            video.addVideo(this.video)
                .then(response => {
                    this.dialogVideoFormVisible = false
                    this.$message({
                        type: 'success',
                        message: '添加小节成功'
                    })
                    this.getChapterVideo()
                })
            this.addFlag = false
            this.video = {}
        },

        saveOrUpdateVideo() {
            if(this.addVideoFlag) {
                this.addVideo()
            } else {
                // this.editVideo()
                // this.videoCopy.title = this.video.title
                // this.videoCopy.sort = this.video.sort
                // this.videoCopy.isFree = this.video.isFree

                video.updateVideo(this.video)
                    .then(response => {
                        this.$message({
                            type: 'success',
                            message: '编辑课时成功'
                        })
                    })
                this.video = {}
            }
            this.dialogVideoFormVisible = false
            course.getCourseInfo(this.courseId)
            // this.$refs['videoFormRef'].resetFields()
        },

        closeVideoDialog() {
            //重置表单
            this.$refs.videoFormRef.resetFields()
            this.video.title = ''
            this.video.sort = 0
            this.video.isFree = 0
        },

        //根据id查询课时
        getVideo(videoId) {
            video.getVideo(videoId)
                .then(response => {
                    this.video = response.data.video
                    //！！！注意再次给el-upload组件的fileList重新赋值的方法
                    const tmpList = []
                    tmpList.push(this.video.videoOriginalName)
                    this.fileList = tmpList.map(item => {
                        return {
                            name: item,
                            url: item
                        }
                    })
                })
        },

        //编辑课时
        editVideo(videoId) {
            this.dialogVideoFormVisible = true
            this.getVideo(videoId)
        },

        //删除课时
        deleteVideo(videoId) {
            video.deleteVideoById(videoId)
                .then(response => {
                    this.$message({
                        type: 'warn',
                        message: '删除课时成功'
                    })
                })
            this.getChapterVideo()
        },

        //成功回调
        handleVodUploadSuccess(response, file, fileList) {
            this.video.videoOriginalName = file.name
            this.video.videoSourceId = response.data.videoId
        },

        handleUploadExceed(files, fileList) {
            this.$message.warning('想要重新上传视频，请先删除已上传的视频')
        },

        beforeVodRemove(file, fileList) {
            return this.$confirm(`确定移除 ${file.name}？`)
        },

        handleVodRemove(file, fileList) {
            vod.deleteAliyunVideo(this.video.videoSourceId).then(response=>{
                this.$message({
                type: 'success',
                message: response.message
                })
            })
        }



        
    }
}
</script>

<style lang="less" scoped>
.chanpterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0; 
}

.chanpterList li{
    position: relative;
}

.chanpterList p{
    font-size: 20px;
    margin: 10px 0;
    padding: 10px;
    height: 70px;
    line-height: 50px;
    width: 100%;
    border: 1px solid #DDD;
}

.chanpterList .acts {
    float: right;
    font-size: 14px; 
}

.videoList{
    padding-left: 50px; 
}

.videoList p{
    // float: left;
    font-size: 14px;
    margin: 10px 0;
    padding: 10px;
    height: 50px;
    line-height: 30px;
    width: 100%;
    border: 1px dotted #DDD;
}
</style>