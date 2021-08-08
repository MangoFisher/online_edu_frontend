<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />

    <el-tree
      ref="tree2"
      :data="data2"
      :props="treeProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      :default-expand-all="true"
    />

  </div>
</template>

<script>
import subject from '@/api/subject/subject'
export default {

  data() {
    return {
      filterText: '',
      data2: [],
      treeProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    //获取一级、二级分类数据
    getAllSubject(){
        subject.getAllSubject().then(response => {
            this.data2 = response.data.list
        }).catch(error => {
            console.log(error)
        })
    }
  },
  created() {
      this.getAllSubject()
  }
}
</script>

