<template>
  <div class="map-container__module" ref="mapContainer" v-loading="loading" oncontextmenu="return false" @dragover="e => {handleDragover(e)}" @drop="e => {handleDrop(e)}"></div>
</template>
<script>
import STMap from './st-map'

export default {
  props: {
    mapImage: {
      type: Object,
      required: true,
      default: () => {
        return {}
      }
    },
    dragCamera: {
      type: Boolean,
      required: false,
      default: false
    },
    device: {
      type: Object,
      required: false,
      default: () => {
        return {}
      }
    },
    deviceList: {
      type: Array,
      required: false,
      default: () => {
        return []
      }
    },
    polygon: {
      type: Object,
      required: false,
      default: () => {
        return {}
      }
    },
    PolygonList: {
      type: Array,
      required: false,
      default: () => {
        return []
      }
    },
    trajectoryPointsList: {
      type: Array,
      required: false,
      default: () => {
        return []
      }
    },
    trajectoryLinesByPoints: {
      type: Object,
      required: false,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      loading: false,
      stmap: null // STMap对象
    }
  },
  computed: {},
  mounted() {
    this.createMap()
    if (this.mapImage.src) {
      this.loadImage(this.mapImage)
    }
  },
  watch: {
    mapImage: {
      handler(val) {
        this.$nextTick(() => this.loadImage(val))
      },
      deep: true
    },
    device: {
      handler(val) {
        this.addDevice(val)
      },
      deep: true
    },
    deviceList(val) {
      val.length && this.loadDevice(val)
    },
    polygon: {
      handler(val) {
        this.addPolygon(val)
      },
      deep: true
    },
    PolygonList(val) {
      val.length && this.loadPolygon(val)
    },
    trajectoryPointsList(val) {
      val.length && this.trajectory(val)
    }
  },
  methods: {
    handleDrop(event) {
      console.log('drop', event)
    },
    handleDragover(event) {
      event.preventDefault()
      event.dataTransfer.setData('dropEffect', 'move')
      console.log('event', event)
    },
    // 创建底图
    createMap(image) {
      const vm = this
      vm.stmap && vm.stmap.clear()
      if (!vm.stmap) {
        vm.stmap = new STMap({
          container: vm.$refs.mapContainer,
          scale: {
            cur: 1,
            max: 5,
            min: 0.2
          },
          draggable: {
            camera: vm.dragCamera
          },
          select: e => {
            vm.$emit('getTarget', e.target)
          },
          contextmenu: msg => {
            return msg.data.slice(1, 2)
          },
          message: msg => {
            const { action, target } = msg.message
            if (action === 'delete') {
              vm.stmap.remove(target)
            }
          }
        })
      }
    },
    loadImage(image) {
      console.log(image)
      this.loading = true
      this.stmap.addBg(image)
      this.loading = false
    },
    // 载入设备
    loadDevice(list) {
      this.stmap.addCamera(list)
    },
    // 添加设备
    addDevice(device) {
      this.stmap.cancelDrawCamera()
      this.stmap.drawCamera(device)
    },
    // 载入区域
    loadPolygon(list) {
      this.stmap.addPolygon(list)
    },
    // 添加区域
    addPolygon(polygon) {
      this.stmap.drawPolygon(polygon)
    },
    // 载入轨迹点位
    trajectory(list) {
      this.loading = true
      this.stmap.addPoint(list)
      if (list.length < 2) return
      this.drawTrajectory()
    },
    // 载入轨迹线段顺序
    drawTrajectory() {
      const PATH = this.stmap.createPolylineByPoint(
        this.trajectoryLinesByPoints
      )
      PATH.draw()
      this.loading = false
    },
    // 获取底图上的对象的数据
    getData(type) {
      return this.stmap.getData(type)
    },
    clear() {
      this.stmap.clear()
    }
  }
}
</script>
<style lang="scss" scoped>
.map-container__module {
  width: 100%;
  height: 100%;
}
</style>
