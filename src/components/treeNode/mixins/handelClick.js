export default {
    data() {
        return {
            showPopoverId: '',
            visible: false
        }
    },
    methods: {

    },
    created() {
        const that = this
        document.getElementById('app').addEventListener(
            'click',
            function (e) {
                that.showPopoverId = ''
                that.visible = false
            },
            false
        )
    },
    beforeDestroy() {
        const that = this
        document.getElementById('app').removeEventListener(
            'click',
            function (e) {
                that.showPopoverId = ''
                that.visible = false
            },
            false
        )
    }
}
