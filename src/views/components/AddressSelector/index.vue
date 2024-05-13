<template>
  <div>
    <el-cascader ref="AddressSelector" v-model="tempValue" :options="areaSelect" v-bind="$props" clearable
      placeholder="请选择..." size="small" @change="handleChange" />
  </div>
</template>

<script>
import areaList from '@/utils/area'

export default {
  name: 'AddressSelector',
  props: ['value', 'props'],
  data() {
    return {
      areaSelect: []
    }
  },
  computed: {
    // ...mapGetters(['areaSelect']),
    tempValue: {
      get() {
        return this.value;
      },
      set(v) {
        this.$emit('input', v);
      }
    },
  },
  mounted() {
    this.areaSelect = this.recurs(areaList)
  },
  methods: {
    handleChange() {
      const data = this.$refs["AddressSelector"].getCheckedNodes()[0].pathLabels
      this.$emit('change', data)
    },
    recurs(list) {
      list.forEach(it => {
        it.label = it.name
        it.value = it.value
        if (it.children) {
          this.recurs(it.children)
        }
      })
      return list;
    }
  }
}
</script>
<style></style>
