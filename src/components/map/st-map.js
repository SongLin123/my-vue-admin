
// sensetime map version
import zrender from 'zrender'
import icon_camera from './res/icon-camera.svg'
import icon_arrow from './res/icon-arrow.svg'
import icon_warn from './res/icon-warn.svg'
import icon_warn_yellow from './res/icon-warn-yellow.svg'
import icon_camera_logo from './res/icon-camera-logo.svg'
import icon_location from './res/icon-location.svg'
import icon_women_01 from './res/icon-women-01.jpg'
import icon_women_02 from './res/icon-women-02.jpg'
import icon_close from './res/icon-close.svg'
import icon_man from './res/icon-man.svg'
import cover from './res/cover.png'
import icon_point from './res/icon-point.svg'
import icon_arrow_up from './res/icon-arrow-up.svg'
import icon_arrow_down from './res/icon-arrow-down.svg'

export default function STMap(opt) {
	/**
	 * 日志
	 * @param {*} message
	 */
    var _log = function (message) {
        var time = _utils.date_format(new Date(), 'hh:mm:ss')
        console.log('stmap message ' + time, message)
        opt.message &&
            opt.message({
                time: time,
                message: message
            })
    }
    var _setcontextmenu = function (target, data, cb) {
        if (opt.contextmenu) {
            var data = opt.contextmenu({
                target: target,
                data: data
            })
            if (!data || !data.length) return
            cb && cb(data)
        }
    }
    var _setselect = function (data) {
        if (opt.select && data) {
            opt.select({
                target: data.target || {},
                type: data.type || '',
                children: data.children || [],
                updated: data.updated
            })
        }
    }
	/**
	 * zr 全局对象
	 */
    var _zr = null
    var _stmap = null
	/**
	 * 元素层级
	 */
    var _zmap = {
        bg: 10000,
        path: 20000,
        polygon: 30000,
        camera: 40000,
        point: 45000,
        win: 50000,
        dialog: 60000,
        contextmenu: 100000
    }
	/**
	 * 元素层级
	 */
    var _z2map = {
        bg: 0,
        path: 0,
        polygon: 0,
        camera: 0,
        dialog: 0,
        win: 0,
        contextmenu: 0
    }
	/**
	 * 元素ID
	 */
    var _idmap = {
        bg: 10000,
        path: 20000,
        polygon: 30000,
        camera: 40000,
        contextmenu: 100000
    }
	/**
	 * 工具类
	 */
    var _utils = {
		/**
		 * zindex
		 * @param {*} key
		 */
        z2: function (key) {
            return _z2map[key]++
        },

		/**
		 * id生成器
		 */
        id: function (key) {
            _idmap[key]++
            return key + '_' + _idmap[key] + '_' + new Date().getTime()
        },

		/**
		 * 对象创建
		 * @param {*} type
		 */
        gen: function (type) {
            var id = _utils.id(type)
            var z2index = _utils.z2(type)
            return {
                type: type,
                id: id,
                z: _zmap[type],
                z2: z2index
            }
        },

		/**
		 * 日期格式化
		 * @param {*} date
		 * @param {*} fmt
		 */
        date_format: function (date, fmt) {
            var o = {
                'M+': date.getMonth() + 1, // 月份
                'd+': date.getDate(), // 日
                'h+': date.getHours(), // 小时
                'm+': date.getMinutes(), // 分
                's+': date.getSeconds(), // 秒
                'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
                S: date.getMilliseconds() // 毫秒
            }
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
            }
            for (var k in o) {
                if (new RegExp('(' + k + ')').test(fmt)) {
                    fmt = fmt.replace(
                        RegExp.$1,
                        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
                    )
                }
            }
            return fmt
        },

		/**
		 * 拖拽
		 */
        drag: function (me, check) {
            if (!me) return

            _utils.drop()
            _utils.deltPostion = null
            _utils.dragGroup = me.group
            _utils.target = me
            _utils.check = check || function () { }

            _zr.on('mousedown', _utils.mousedown)
            _zr.on('mouseup', _utils.mouseup)
            _zr.on('mousemove', _utils.mousemove)
        },
		/**
		 * 拖放
		 */
        drop: function () {
            _zr.off('mousedown', _utils.mousedown)
            _zr.off('mousemove', _utils.mousemove)
            _zr.off('mouseup', _utils.mouseup)
        },

		/**
		 * 鼠标释放
		 * @param {*} e
		 */
        mouseup: function (e) {
            if (_zr.edit) return
            if (!_utils.check(e, 'mouseup')) return
            _utils.target.position = _utils.dragGroup.position
            _utils.deltPostion = null
        },

		/**
		 * 鼠标移动
		 * @param {*} e
		 */
        mousemove: function (e) {
            if (_zr.edit) return
            if (!_utils.deltPostion || !_utils.check(e, 'mousemove')) return
            var new_pos = [e.event.zrX, e.event.zrY]
            _utils.dragGroup.attr('position', [
                new_pos[0] - _utils.deltPostion[0],
                new_pos[1] - _utils.deltPostion[1]
            ])
        },

		/**
		 * 鼠标按下
		 * @param {*} e
		 */
        mousedown: function (e) {
            if (_zr.edit) return
            if (!_utils.check(e, 'mousedown')) return
            _utils.deltPostion = [
                e.event.zrX - _utils.dragGroup.position[0],
                e.event.zrY - _utils.dragGroup.position[1]
            ]
        },

		/**
		 * 获取多边形中心点位置
		 * @param {*} path
		 */
        getCenterPoint: function (points) {
            var x = 0.0
            var y = 0.0
            for (var i = 0; i < points.length; i++) {
                x = x + parseFloat(points[i][0])
                y = y + parseFloat(points[i][1])
            }
            x = x / points.length
            y = y / points.length
            return {
                x: x,
                y: y
            }
        },

		/**
		 * 检测是否在区域内部
		 * @param {*} option
		 */
        isInside: function (option) {
            var point = option.point
            var inside = false
            switch (option.shape) {
                case 'rect':
                    var vs = option.vs
                    var x = point[0]
                    var y = point[1]
                    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
                        var xi = vs[i][0]
                        var yi = vs[i][1]
                        var xj = vs[j][0]
                        var yj = vs[j][1]

                        var intersect = yi > y != yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi
                        if (intersect) inside = !inside
                    }
                    break
                case 'circle':
                    var r = option.r
                    if (r > 0) {
                        var circle = option.circle
                        var dx = circle[0] - point[0]
                        var dy = circle[1] - point[1]
                        inside = dx * dx + dy * dy <= r * r
                    }
                    break
            }
            return inside
        },

		/**
		 * 检测是否在多边形内部
		 * @param {*} p
		 * @param {*} ps
		 */
        isInsidePolygon(p, ps) {
            var px = p.x
            var py = p.y
            var iCount = ps.length
            var i
            var j = iCount - 1
            var x1, x2, y1, y2, xc

            var isIn = false

            // 从起始点到终点的连线开始
            for (i = 0; i < iCount; i++) {
                x1 = ps[i][0]
                y1 = ps[i][1]
                x2 = ps[j][0]
                y2 = ps[j][1]
                j = i
                // 以下语句判断 p 点是否在边的两端点的水平平行线之间，在则可能有交点，开始判断交点是否在左射线上
                if ((py >= y1 && py < y2) || (py >= y2 && py < y1)) {
                    if (Math.abs(y1 - y2) > 0) {
                        // 得到 p 点向左射线与边的交点的 x 坐标 xc：
                        // 直线方程，两点式：(x-x1)/(x2-x1)=(y-y1)/(y2-y1)
                        xc = x1 + (x2 - x1) * (py - y1) / (y2 - y1)
                        // 如果交点在 p 点左侧（说明是做射线与 边的交点），则射线与边的全部交点数加一：
                        if (xc < px) {
                            isIn = !isIn
                        }
                    }
                }
            }

            return isIn
        },

		/**
		 * 获取缩放坐标
		 * @param {*} e
		 */
        getAsix: function (e, position) {
            var event = e.event || {}
            var tx = 0
            var ty = 0
            if (e.target && e.target.transform && e.target.transform.length >= 6) {
                tx = e.target.transform[4] / _zr.scale
                ty = e.target.transform[5] / _zr.scale
            }
            var x = event.zrX / _zr.scale - tx
            var y = event.zrY / _zr.scale - ty
            position = position || [0, 0]
            console.log('drag', x, y, tx, ty)
            return {
                x: x - position[0],
                y: y - position[1]
            }
        },

		/**
		 * 获取文本长度
		 */
        getTextLength: function (str, font) {
            if (!str) return 0

            var ctx = zrender.util.getContext('2d')
            ctx.font = font
            return ctx.measureText(str).width
        },

		/**
		 * 更新摄像头
		 */
        updated: function (attr) {
            var inside = attr.inside || []
            var inside_attr = attr.inside_attr
            if (inside_attr) {
                for (var i = 0; i < inside.length; i++) {
                    var item = inside[i]
                    item.updated(inside_attr)
                }
            }
            var outside = attr.outside || []
            var outside_attr = attr.outside_attr
            if (outside) {
                for (var i = 0; i < outside.length; i++) {
                    var item = outside[i]
                    item.updated(outside_attr)
                }
            }
        }
    }

	/**
	 * 重构
	 */
    var _rebuild = {
		/**
		 * 删除重构数据
		 */
        remove: function (e) {
            switch (e.type) {
                case 'polygon':
                    _stmap.polygons[e.id] = null
                    break
                case 'camera':
                    _stmap.cameras[e.id] = null
                    break
            }
        },

		/**
		 * 拖拽重构数据
		 */
        drag: function (camera) {
            //
        }
    }

	/**
	 * 浮层显示
	 */
    var _dialog = function (option) {
        if (!option) return

        this.group = option.group
        this.tx = option.x
        this.ty = option.y
        this.x = this.tx - this.width / 2
        this.y = this.ty - this.height - 5
        this.text = option.text
    }
    _dialog.prototype = {
        width: 296,
        height: 156,
		/**
		 * 显示
		 */
        show: function (option) {
            this.hide()
            this.tx = option.x
            this.ty = option.y
            this.x = this.tx - this.width / 2
            this.y = this.ty - this.height - 5
            this.target = option.target
            this.icon = option.icon || icon_warn
            this.color = option.color || '#EF5959'
            this.title = option.title || '警告'
            this.photo = option.photo || ''
            this.biz = option.biz || []
            this.dialogBgColor = option.dialogBgColor || '#fff'
            this.dialogTextColor = option.dialogTextColor || '#1E2228'
            this.time = option.time || 5
            this.cb = option.cb || function () { }
            this.components = []
            this.addBg()
            this.addHead()
            this.addPhoto()
            this.addArrow()
            this.addSummary()
            this.addBgCover()
            this.group.dirty()

            var me = this
            this.timeout = setTimeout(() => {
                me.hide()
            }, this.time * 1000)
        },

		/**
		 * 背景图
		 */
        addBg: function () {
            this.components.push(
                new zrender.Rect({
                    shape: {
                        x: this.x,
                        y: this.y,
                        width: this.width,
                        height: this.height,
                        r: 5
                    },
                    style: {
                        fill: this.dialogBgColor,
                        shadowBlur: 8,
                        shadowColor: 'rgba(0,0,0,0.2)',
                        shadowOffsetX: 0,
                        shadowOffsetY: 2
                    },
                    z: _zmap.dialog,
                    z2: _utils.z2('dialog')
                })
            )
            this.group.add(this.components[0])
        },

		/**
		 * 背景图
		 */
        addBgCover: function () {
            var me = this
            this.components.push(
                new zrender.Rect({
                    shape: {
                        x: this.x,
                        y: this.y,
                        width: this.width,
                        height: this.height
                    },
                    style: {
                        fill: 'transparent'
                    },
                    z: _zmap.dialog,
                    z2: _utils.z2('dialog'),
                    onclick: function () {
                        me.log('warn')
                    }
                })
            )
            this.group.add(this.components[this.components.length - 1])

            this.components.push(
                new zrender.Image({
                    style: {
                        image: icon_close,
                        x: this.x + this.width - 34,
                        y: this.y + 10,
                        width: 25,
                        height: 25,
                        fill: '#EF5959'
                    },
                    z: _zmap.dialog,
                    z2: _utils.z2('dialog'),
                    onclick: function () {
                        me.log('warn-close')
                        me.hide()
                    }
                })
            )
            this.group.add(this.components[this.components.length - 1])
        },

		/**
		 * 头部
		 */
        addHead: function () {
            var me = this
            this.components.push(
                new zrender.Image({
                    style: {
                        image: this.icon,
                        x: this.x + 27,
                        y: this.y + 15,
                        width: 20,
                        height: 20,
                        fill: '#fff',
                        textFill: this.color || '#EF5959',
                        text: this.title,
                        transformText: true,
                        fontSize: 16,
                        textPosition: 'right',
                        fontFamily: 'PingFangSC-Semibold'
                    },
                    z: _zmap.dialog,
                    z2: _utils.z2('dialog')
                })
            )
            this.group.add(this.components[1])
        },

		/**
		 * 头像
		 */
        addPhoto: function () {
            if (!this.photo) {
                this.components.push(
                    new zrender.Rect({
                        shape: {
                            x: this.x + 24,
                            y: this.y + 55,
                            width: 54,
                            height: 72,
                            r: 3
                        },
                        style: {
                            fill: '#f1f1f1'
                        },
                        z: _zmap.dialog,
                        z2: _utils.z2('dialog')
                    })
                )
            } else {
                this.components.push(
                    new zrender.Image({
                        style: {
                            image: this.photo,
                            x: this.x + 24,
                            y: this.y + 55,
                            width: 54,
                            height: 72,
                            shadowBlur: 10,
                            shadowColor: 'rgba(0,0,0,0.2)',
                            shadowOffsetX: 0,
                            shadowOffsetY: 0
                        },
                        z: _zmap.dialog,
                        z2: _utils.z2('dialog')
                    })
                )
            }
            this.group.add(this.components[2])
        },

		/**
		 * 底部三角形
		 */
        addArrow: function () {
            this.components.push(
                new zrender.Image({
                    style: {
                        image: icon_arrow,
                        x: this.tx - 8,
                        y: this.ty - 12,
                        width: 16,
                        height: 16
                    },
                    z: _zmap.dialog,
                    z2: _utils.z2('dialog')
                })
            )
            this.group.add(this.components[3])
        },

		/**
		 * 明细
		 */
        addSummary: function () {
            debugger
            for (var i = 0; i < this.biz.length; i++) {
                var item = this.biz[i]
                this.components.push(
                    new zrender.Text({
                        style: {
                            x: this.x + 86,
                            y: this.y + 55 + i * 29,
                            width: 210,
                            height: 14,
                            text: '{name|' + item.key + ': }{value|' + item.value + '}',
                            transformText: true,
                            rich: {
                                name: {
                                    textFill: item.keyColor || '#989CA2'
                                },
                                value: {
                                    textFill: item.valueColor || '#1E2228'
                                }
                            },
                            truncate: {
                                outerWidth: 196,
                                outerHeight: 14
                            }
                        },
                        z: _zmap.dialog,
                        z2: _utils.z2('dialog')
                    })
                )
                this.group.add(this.components[i + 4])
            }
        },

		/**
		 * 隐藏
		 */
        hide: function () {
            if (!this.components) return

            clearTimeout(this.timeout)
            for (var i = 0; i < this.components.length; i++) {
                this.group.remove(this.components[i])
            }
            this.group.dirty()
            this.components = null
            this.cb()
        },

		/**
		 * 日志
		 * @param {*} action
		 * @param {*} message
		 */
        log: function (action, message) {
            _log({
                action: action,
                target: this.target,
                biz: this.biz,
                message: message
            })
        }
    }
	/**
	 * 浮层显示
	 */
    var _win = function (option) {
        if (!option) return

        this.group = option.group
        if (option.target.type === 'polygon') {
            this.height = 50
        }
        this.tx = option.x
        this.ty = option.y
        this.x = this.tx - this.width / 2
        this.y = this.ty - this.height - 5
        this.mouseout = option.mouseout || function () { }
    }
    _win.prototype = {
        width: 224,
        height: 145,
        direction: 'down',
		/**
		 * 显示
		 */
        show: function (option) {
            this.autohide()
            this.tx = option.x
            this.ty = option.y
            this.target = option.target
            this.icon = option.icon
            this.button = option.button
            this.color = option.color || '#1E2228'
            this.title = option.title || ''
            this.biz = option.biz || []
            this.dialogBgColor = option.dialogBgColor || '#fff'
            this.dialogTextColor = option.dialogTextColor || '#1E2228'
            this.height = this.biz.length * 29 + 56
            this.time = option.time || 3
            if (option.target.type === 'polygon') {
                this.width = 60 + _utils.getTextLength(this.title, '16px PingFangSC-Semibold')
                this.x = this.tx - this.width / 2
            }
            this.y = this.ty - this.height - 5
            if (this.y < 0) {
                this.y = this.ty + (option.height || 0) + 10
                this.direction = 'up'
            }
            this.components = []
            this.addBg()
            this.addHead()
            this.addArrow(option)
            this.addBody()
            this.group.dirty()
        },

		/**
		 * 背景图
		 */
        addBg: function () {
            var me = this
            this.components.push(
                new zrender.Rect({
                    shape: {
                        x: this.x,
                        y: this.y,
                        width: this.width,
                        height: this.height,
                        r: 5
                    },
                    style: {
                        fill: this.dialogBgColor,
                        shadowBlur: 8,
                        shadowColor: 'rgba(0,0,0,0.2)',
                        shadowOffsetX: 0,
                        shadowOffsetY: 2
                    },
                    z: _zmap.win,
                    z2: _utils.z2('win'),
                    onclick: function () {
                        me.log('win')
                    }
                })
            )
            this.group.add(this.components[0])
            this.components[0].on('mouseout', function (e) {
                if (me.inside(e.offsetX, e.offsetY)) return
                me.mouseout(e)
            })
        },

		/**
		 * 头部
		 */
        addHead: function () {
            var me = this
            this.components.push(
                new zrender.Image({
                    style: {
                        image: this.icon,
                        x: this.x + 20,
                        y: this.y + 14,
                        width: 19,
                        height: 19,
                        fill: '#fff',
                        textFill: this.dialogTextColor,
                        text: this.title,
                        transformText: true,
                        fontSize: 16,
                        textPosition: 'right',
                        truncate: {
                            outerWidth: this.width - 57
                        },
                        fontFamily: 'PingFangSC-Semibold'
                    },
                    z: _zmap.win,
                    z2: _utils.z2('win')
                })
            )

            if (this.button) {
                this.components.push(
                    new zrender.Text({
                        style: {
                            x: this.x + this.width - _utils.getTextLength(this.button.name, '16px PingFangSC-Semibold') - 10,
                            y: this.y + 14,
                            height: 19,
                            text: this.button.name,
                            transformText: true,
                            textPosition: 'right',
                            fontSize: 16,
                            fill: '#fff',
                            textFill: this.button.color || '#1E2228'
                        },
                        onclick: function () {
                            me.log('win_button', me.button)
                        },
                        z: _zmap.win,
                        z2: _utils.z2('win')
                    })
                )
            } else {
                this.components.push(
                    new zrender.Text({
                        style: {
                            x: this.x + 20,
                            y: this.y + 14,
                            text: ''
                        }
                    })
                )
            }
            this.group.add(this.components[1])
            this.group.add(this.components[2])
        },

		/**
		 * 底部三角形
		 */
        addArrow: function (option) {
            var image = icon_arrow
            if (this.direction === 'up') {
                image = icon_arrow_up
            } else if (this.direction === 'down') {
                image = icon_arrow_down
            }
            this.components.push(
                new zrender.Image({
                    style: {
                        image: image,
                        x: this.tx - 8,
                        y: this.ty - this.height - 5 > 0 ? this.ty - 12 : this.y - 10,
                        width: 16,
                        height: 16
                    },
                    z: _zmap.win,
                    z2: _utils.z2('win')
                })
            )
            this.group.add(this.components[3])
        },

		/**
		 * 加载线
		 */
        addLine: function (item, index) {
            var y = this.y + 42
            this.components.push(
                new zrender.Line({
                    shape: {
                        x1: this.x,
                        x2: this.x + this.width,
                        y1: y,
                        y2: y
                    },
                    style: {
                        stroke: '#eeeeee'
                    },
                    z: _zmap.win,
                    z2: _utils.z2('win')
                })
            )
            this.group.add(this.components[4])
        },

		/**
		 * 明细
		 */
        addBody: function () {
            if (!this.biz || !this.biz.length) return
            this.addLine()
            var me = this
            for (var i = 0; i < this.biz.length; i++) {
                var item = this.biz[i]
                this.components.push(
                    new zrender.Text({
                        style: {
                            x: this.x + 20,
                            y: this.y + 56 + i * 29,
                            width: 204,
                            height: 14,
                            text: item.key ? '{name|' + item.key + ': }{value|' + item.value + '}' : '{value|' + item.value + '}',
                            transformText: true,
                            rich: {
                                name: {
                                    textFill: item.keyColor || '#989CA2'
                                },
                                value: {
                                    textFill: item.valueColor || '#1E2228'
                                }
                            },
                            truncate: {
                                outerWidth: 196,
                                outerHeight: 14
                            }
                        },
                        onclick: function () {
                            if (item.type === 'button') {
                                me.log('win_button', item)
                            }
                        },
                        z: _zmap.win,
                        z2: _utils.z2('win')
                    })
                )
                this.group.add(this.components[i + 5])
            }
        },

		/**
		 * 隐藏
		 */
        hide: function () {
            clearTimeout(this.timeout2)
            this.timeout2 = setTimeout(this.autohide.bind(this), 300)
        },

		/**
		 * 自动隐藏
		 */
        autohide: function () {
            if (!this.components) return
            clearTimeout(this.timeout)
            for (var i = 0; i < this.components.length; i++) {
                this.group.remove(this.components[i])
            }
            this.group.dirty()
            this.components = null
        },

		/**
		 * 日志
		 * @param {*} action
		 * @param {*} message
		 */
        log: function (action, message) {
            _log({
                action: action,
                target: this.target,
                message: message
            })
        },

		/**
		 * 包含
		 * @param {*} x
		 * @param {*} y
		 */
        inside: function (x, y) {
            return this.components && this.components[0] && this.components[0].contain(x, y)
        }
    }
	/**
	 * 右键菜单
	 */
    var _contextmenu = {
        target: null,
        list: [],
        data: [],
        x: 0,
        y: 0,
		/**
		 * 显示
		 */
        show: function (option) {
            if (!option) return
            this.hide()
            this.target = option.target
            this.x = option.x
            this.y = option.y
            this.data = option.data || []
            this.list = []
            this.cb =
                option.cb ||
                function (e) {
                    console.log(e)
                }
            for (var i = 0; i < this.data.length; i++) {
                _zr.add(this.load_item(this.data[i], i))
                if (i > 0) {
                    _zr.add(this.load_line(this.data[i], i))
                }
            }
        },

		/**
		 * 隐藏
		 */
        hide: function () {
            if (!this.list || !this.list.length) return
            for (var i = 0; i < this.list.length; i++) {
                _zr.remove(this.list[i])
            }
            this.list = []
        },

		/**
		 * 加载子项
		 */
        load_item: function (item, index) {
            var me = this
            var rect = new zrender.Rect({
                cursor: 'pointer',
                shape: {
                    x: this.x,
                    y: this.y + 30 * index,
                    width: 100,
                    height: 30
                },
                style: {
                    text: item.name,
                    fill: '#ffffff',
                    transformText: true
                },
                z: 100000 + index,
                onclick: function (e) {
                    _log({
                        action: item.action,
                        target: me.target
                    })
                    me.cb({
                        action: item.action,
                        target: me.target
                    })
                    me.hide()
                }
            })
            rect.on('mouseover', function (e) {
                rect.attr('style', {
                    fill: '#eeeeee'
                })
            })
            rect.on('mouseout', function (e) {
                rect.attr('style', {
                    fill: '#ffffff'
                })
            })
            this.list.push(rect)
            return rect
        },

		/**
		 * 加载线
		 */
        load_line: function (item, index) {
            var y = this.y + 30 * index
            var line = new zrender.Line({
                shape: {
                    x1: this.x,
                    x2: this.x + 100,
                    y1: y,
                    y2: y
                },
                style: {
                    stroke: '#eeeeee'
                },
                z: 110000 + index
            })
            this.list.push(line)
            return line
        }
    }
	/**
	 * 背景图片
	 */
    var _bg = {
        src: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,

		/**
		 * 加载
		 */
        add: function (option) {
            if (!option) return
            this.group = option.group
            this.remove()
            this.id = option.id
            this.name = option.name
            this.src = option.src
            this.x = option.x
            this.y = option.y
            this.width = option.width
            this.height = option.height
            this.drag = option.drag
            this.subid = new Date().getTime() + '_' + Math.floor(Math.random() * 10000)
            this.target1 = _utils.gen('bg')
            this.image1 = new zrender.Image({
                id: this.target1.id,
                style: {
                    image: cover,
                    x: -_zr.getWidth() * 5,
                    y: -_zr.getHeight() * 5,
                    width: _zr.getWidth() * 10,
                    height: _zr.getHeight() * 10
                },
                z: this.target1.z,
                z2: this.target1.z2
            })
            this.group.add(this.image1)
            this.target = _utils.gen('bg')
            this.target.id = this.id || this.target.id
            var img = new Image()
            var me = this
            img.onload = function () {
                me.image = new zrender.Image({
                    id: me.target.id,
                    subid: me.subid,
                    style: {
                        image: me.src,
                        x: me.x,
                        y: me.y,
                        width: me.width,
                        height: me.height
                    },
                    z: me.target.z,
                    z2: me.target.z2
                })
                me.group.add(me.image)
                me.log('load')
            }
            img.src = me.src
            this.group.dirty()
            return this
        },

		/**
		 * 移除
		 */
        remove: function () {
            this.group.remove(this.image)
            this.group.remove(this.image1)
            this.group.dirty()
            this.log('remove')
        },

		/**
		 * 日志
		 * @param {*} action
		 * @param {*} message
		 */
        log: function (action, message) {
            _log({
                action: action,
                target: this.target,
                message: message
            })
        }
    }
	/**
	 * 摄像头
	 * @param {*} option
	 */
    var _camera = function (option) {
        if (!option || !option.group) return
        this.group = option.group
        this.id = option.id
        this.x = option.x
        this.y = option.y
        this.name = option.name || '未命名摄像头'
        this.pic = option.pic || icon_camera
        this.pic_ori = this.pic
        this.biz = option.biz || {}
        this.dialogBgColor = option.dialogBgColor || '#fff'
        this.dialogTextColor = option.dialogTextColor || '#1E2228'
        this.button = option.button
        this.position = option.position || [0, 0]
        this.camera_basic = option.basic || []
        this.init()
    }
    _camera.prototype = {
		/**
		 * 初始化
		 */
        init: function () {
            this.load()
        },
		/**
		 * 加载
		 */
        load: function () {
            this.target = _utils.gen('camera')
            this.target.id = this.id || this.target.id
            this.target.biz = this.biz
            this.target.name = this.name
            this.target.pic = this.pic
            this.target._pic = this.pic
            this.status = 'normal'
            this.width = 32
            this.height = 32
            this.container = new zrender.Group({
                scale: [1, 1],
                position: this.position
            })
            this.dialog = new _dialog({
                group: this.container,
                text: this.name,
                target: this.target,
                x: this.x + this.width / 2,
                y: this.y - 5,
                z: this.target.z,
                z2: this.target.z2
            })
            this.win = new _win({
                group: this.container,
                text: this.name,
                target: this.target,
                x: this.x + this.width / 2,
                y: this.y - 5,
                z: this.target.z,
                z2: this.target.z2
            })
            this.load_image()
            this.group.add(this.container)
            this.group.dirty()
            this.log('load')
        },

		/**
		 * 加载背景图
		 */
        load_image: function () {
            var me = this
            this.container.remove(this.image)
            this.image = new zrender.Image({
                id: this.target.id,
                style: {
                    image: this.pic,
                    x: this.x,
                    y: this.y,
                    width: this.width,
                    height: this.height
                },
                z: this.target.z,
                z2: this.target.z2,
                draggable: _zr.drag_camera,
                ondragend: function (e) {
                    me.position = [me.position[0] + e.target.position[0], me.position[1] + e.target.position[1]]
                    me.container.attr('position', me.position)
                    me.image.attr('position', [0, 0])
                },
                onclick: function () {
                    var _target = JSON.parse(JSON.stringify(me.target))
                    _target.pic = me.pic
                    _setselect({
                        type: 'camera',
                        target: _target,
                        updated: me.updated.bind(me)
                    })
                    me.log('click')
                },
                updatetraget: function (biz, name) {
                    me.name = name
                    me.target.name = name
                    me.target.biz = biz
                    me.log('update')
                }
            })
            this.container.add(this.image)
            this.ready()
        },

		/**
		 * 更新
		 */
        updated: function (data) {
            if (!data) return
            this.pic = data.pic || this.pic
            this.pic_ori = this.pic
            this.win.hide()
            this.load_image()
        },

		/**
		 * ready
		 */
        ready: function () {
            var me = this
            this.contextmenu()
            this.image.on('mousedown', function () {
                _stmap._setStatus()
            })
            this.image.on('mouseover', function () {
                if (_zr.edit) return
                console.log('gggg')
                me.basic()
            })
            this.image.on('mouseout', function () {
                if (_zr.edit) return
                me.win.hide()
            })
        },

		/**
		 * 右键注册
		 */
        contextmenu: function () {
            var me = this
            this.image.on('contextmenu', function (e) {
                var event = e.event || {}
                var menu = [
                    {
                        action: 'edit',
                        name: '修改名称'
                    },
                    {
                        action: 'delete',
                        name: '删除'
                    },
                    {
                        action: 'top',
                        name: '置顶'
                    }
                    // {
                    // 	action: 'warn',
                    // 	name: '预警消息'
                    // }
                ]
                _setcontextmenu(me.target, menu, function (data) {
                    _contextmenu.show({
                        group: me.group,
                        x: e.offsetX,
                        y: e.offsetY,
                        data: data || [],
                        target: me.target,
                        cb: function (e) {
                            switch (e.action) {
                                case 'top':
                                    me.target.z2 = _utils.z2('camera')
                                    me.image.attr('z2', me.target.z2)
                                    break
                                case 'edit':
                                    me.log('edit')
                                    break
                                case 'delete':
                                    me.log('confirm_delete')
                                    break
                                case 'warn':
                                    me.warn({
                                        icon: icon_warn_yellow,
                                        title: '白名单提示',
                                        photo: icon_women_02,
                                        color: '#F5A623',
                                        target: me.target,
                                        biz: [
                                            {
                                                key: '时间',
                                                value: '2019-08-09 06:37:23'
                                            },
                                            {
                                                key: '任务',
                                                value: '防止陌生人'
                                            },
                                            {
                                                key: '地点',
                                                value: '1A馆3F-A点'
                                            }
                                        ]
                                    })
                                    me.log('camera_warn')
                                    break
                            }
                        }
                    })
                })
            })
        },

		/**
		 * 删除
		 */
        remove: function () {
            this.group.remove(this.container)
            this.group.dirty()
            _rebuild.remove({
                type: 'camera',
                id: this.target.id
            })
        },

		/**
		 * 预警消息
		 */
        warn: function (option) {
            if (option) {
                option.target = option.target || this.target
                var camera_pic = option.camera_pic
                if (camera_pic) {
                    var me = this
                    option.cb = function () {
                        if (!camera_pic) return
                        me.pic = me.pic_ori
                        me.load_image()
                    }
                    clearTimeout(this.timeout)
                    this.timeout = setTimeout(() => {
                        me.pic = camera_pic
                        me.load_image()
                    }, 200)
                }
                this.warn_option = option
            }
            this.warn_option.x = this.x + this.width / 2
            this.warn_option.y = this.y - 5
            this.dialog.show(this.warn_option)
        },

		/**
		 * 隐藏预警消息
		 */
        hide_warn: function () {
            this.dialog.hide()
        },

		/**
		 * 显示基本信息
		 */
        basic: function () {
            this.win.show({
                icon: icon_camera_logo,
                title: this.name,
                target: this.target,
                x: this.x + this.width / 2,
                y: this.y - 5,
                width: this.width,
                height: this.height,
                dialogBgColor: this.dialogBgColor,
                dialogTextColor: this.dialogTextColor,
                biz: this.camera_basic,
                button: this.button
            })
            this.log('camera_basic')
        },

		/**
		 * 拖放完毕回调
		 */
        dragend: function () {
            _rebuild.drag(this)
        },

		/**
		 * 日志
		 * @param {*} action
		 * @param {*} message
		 */
        log: function (action, message) {
            _log({
                action: action,
                target: this.target,
                message: message
            })
        }
    }
	/**
	 * 点位信息
	 * @param {*} option
	 */
    var _point = function (option) {
        if (!option || !option.group) return
        this.group = option.group
        this.id = option.id
        this.x = option.x
        this.y = option.y
        this.name = option.name || '未命名点位'
        this.pic = option.pic || icon_point
        this.pic_ori = this.pic
        this.width = option.width
        this.height = option.height
        this.biz = option.biz || {}
        this.button = option.button
        this.position = option.position || [0, 0]
        this.point_basic = option.basic || []
        this.init()
    }
    _point.prototype = {
		/**
		 * 初始化
		 */
        init: function () {
            this.load()
        },
		/**
		 * 加载
		 */
        load: function () {
            this.target = _utils.gen('point')
            this.target.id = this.id || this.target.id
            this.target.biz = this.biz
            this.target.name = this.name
            this.target.pic = this.pic
            this.target._pic = this.pic
            this.status = 'normal'
            this.width = this.width || 32
            this.height = this.height || 32
            this.container = new zrender.Group({
                scale: [1, 1],
                position: this.position
            })
            this.dialog = new _dialog({
                group: this.container,
                text: this.name,
                target: this.target,
                x: this.x + this.width / 2,
                y: this.y - 5,
                z: this.target.z,
                z2: this.target.z2
            })
            this.win = new _win({
                group: this.container,
                text: this.name,
                target: this.target,
                x: this.x + this.width / 2,
                y: this.y - 5,
                z: this.target.z,
                z2: this.target.z2
            })
            this.load_image()
            this.group.add(this.container)
            this.group.dirty()
            this.log('load')
        },

		/**
		 * 加载背景图
		 */
        load_image: function () {
            var me = this
            this.container.remove(this.image)
            this.image = new zrender.Image({
                id: this.target.id,
                style: {
                    image: this.pic,
                    x: this.x,
                    y: this.y,
                    width: this.width,
                    height: this.height
                },
                z: this.target.z,
                z2: this.target.z2,
                onclick: function () {
                    var _target = JSON.parse(JSON.stringify(me.target))
                    _target.pic = me.pic
                    _setselect({
                        type: 'point',
                        target: _target,
                        updated: me.updated.bind(me)
                    })
                    me.log('click')
                },
                updatetraget: function (biz, name) {
                    me.name = name
                    me.target.name = name
                    me.target.biz = biz
                    me.log('update')
                }
            })
            this.container.add(this.image)
            this.ready()
        },

		/**
		 * 更新
		 */
        updated: function (data) {
            if (!data) return
            this.pic = data.pic || this.pic
            this.pic_ori = this.pic
            this.win.hide()
            this.load_image()
        },

		/**
		 * ready
		 */
        ready: function () {
            var me = this
            this.image.on('mousedown', function () {
                _stmap._setStatus()
            })
            this.image.on('mouseover', function () {
                if (_zr.edit) return
                me.basic()
            })
            this.image.on('mouseout', function () {
                if (_zr.edit) return
                me.win.hide()
            })
        },

		/**
		 * 右键注册
		 */
        contextmenu: function () {
            var me = this
            this.image.on('contextmenu', function (e) {
                var event = e.event || {}
                var menu = [
                    {
                        action: 'edit',
                        name: '修改名称'
                    },
                    {
                        action: 'delete',
                        name: '删除'
                    },
                    {
                        action: 'top',
                        name: '置顶'
                    },
                    {
                        action: 'warn',
                        name: '预警消息'
                    }
                ]
                _setcontextmenu(me.target, menu, function (data) {
                    _contextmenu.show({
                        group: me.group,
                        x: e.offsetX,
                        y: e.offsetY,
                        data: data || [],
                        target: me.target,
                        cb: function (e) {
                            switch (e.action) {
                                case 'top':
                                    me.target.z2 = _utils.z2('camera')
                                    me.image.attr('z2', me.target.z2)
                                    break
                                case 'edit':
                                    me.log('edit')
                                    break
                                case 'delete':
                                    me.log('confirm_delete')
                                    break
                                case 'warn':
                                    me.warn({
                                        icon: icon_warn_yellow,
                                        title: '白名单提示',
                                        photo: icon_women_02,
                                        color: '#F5A623',
                                        target: me.target,
                                        biz: [
                                            {
                                                key: '时间',
                                                value: '2019-08-09 06:37:23'
                                            },
                                            {
                                                key: '任务',
                                                value: '防止陌生人'
                                            },
                                            {
                                                key: '地点',
                                                value: '1A馆3F-A点'
                                            }
                                        ]
                                    })
                                    me.log('point_warn')
                                    break
                            }
                        }
                    })
                })
            })
        },

		/**
		 * 删除
		 */
        remove: function () {
            this.group.remove(this.container)
            this.group.dirty()
            _rebuild.remove({
                type: 'point',
                id: this.target.id
            })
        },

		/**
		 * 预警消息
		 */
        warn: function (option) {
            if (option) {
                option.target = option.target || this.target
                var point_pic = option.point_pic
                if (point_pic) {
                    var me = this
                    option.cb = function () {
                        if (!point_pic) return
                        me.pic = me.pic_ori
                        me.load_image()
                    }
                    clearTimeout(this.timeout)
                    this.timeout = setTimeout(() => {
                        me.pic = point_pic
                        me.load_image()
                    }, 200)
                }
                this.warn_option = option
            }
            this.warn_option.x = this.x + this.width / 2
            this.warn_option.y = this.y - 5
            this.dialog.show(this.warn_option)
        },

		/**
		 * 隐藏预警消息
		 */
        hide_warn: function () {
            this.dialog.hide()
        },

		/**
		 * 显示基本信息
		 */
        basic: function () {
            this.win.show({
                icon: icon_camera_logo,
                title: this.name,
                target: this.target,
                x: this.x + this.width / 2,
                y: this.y - 5,
                width: this.width,
                height: this.height,
                biz: this.point_basic,
                button: this.button
            })
            this.log('point_basic')
        },

		/**
		 * 日志
		 * @param {*} action
		 * @param {*} message
		 */
        log: function (action, message) {
            _log({
                action: action,
                target: this.target,
                message: message
            })
        }
    }
	/**
	 * 多边形
	 */
    var _polygon = function (option) {
        if (!option || !option.group) return

        this.group = option.group
        this.points = option.points || []
        this.id = option.id || ''
        this.name = option.name || ''
        this.opacity = option.opacity || 1
        this.text_color = option.text_color || '#fff'
        this.border_color = option.border_color || '#fff'
        this.background_color = option.background_color || '#0e1b27'
        this.biz = option.biz || {}
        this.button = option.button
        this.position = [0, 0]
        var state = option.state || {}
        this.hover_background_color = state.hover_background_color
        this.hover_border_color = state.hover_border_color
        this.edit_background_color = state.edit_background_color
        this.edit_border_color = state.edit_border_color
        this.edit_circle_color = state.edit_circle_color
        this.mode = 'normal'
        this.init()
    }
    _polygon.prototype = {
        points: [],
        smooth: 1,

		/**
		 * 初始化
		 */
        init: function () {
            this.load()
        },

		/**
		 * 加载
		 */
        load: function () {
            var me = this
            this.target = _utils.gen('polygon')
            this.target.id = this.id || this.target.id
            this.target.biz = this.biz
            this.target.name = this.name
            this.target.points = this.points
            this.container = new zrender.Group({
                scale: [1, 1],
                position: this.position
            })
            this.polygon = new zrender.Polygon({
                id: this.target.id,
                shape: {
                    points: this.points,
                    smooth: 0
                },
                style: {
                    fill: this.background_color,
                    stroke: this.border_color
                },
                z: this.target.z,
                z2: this.target.z2,
                // silent: true,
                draggable: false,
                ondragstart: function (e) {
                    me.win && me.win.hide()
                    _contextmenu.hide()
                    if (me.list && me.list.length) {
                        for (var i = 0; i < me.list.length; i++) {
                            me.list[i].attr('style', {
                                opacity: 0
                            })
                        }
                    }
                },
                ondragend: function (e) {
                    me.position = [me.position[0] + e.target.position[0], me.position[1] + e.target.position[1]]
                    me.container.attr('position', me.position)
                    me.polygon.attr('position', [0, 0])
                    if (me.list && me.list.length) {
                        for (var i = 0; i < me.list.length; i++) {
                            me.list[i].attr('style', {
                                opacity: 1
                            })
                        }
                    }
                    if (!_zr.edit) {
                        me.basic()
                    }
                },
                onclick: function () {
                    var _target = JSON.parse(JSON.stringify(me.target))
                    _target.background_color = me.background_color
                    _target.border_color = me.border_color
                    var children = me.getChild()
                    _setselect({
                        type: 'polygon',
                        target: _target,
                        updated: me.updated.bind(me),
                        children: children
                    })
                    me.log('click')
                },
                updatetraget: function (biz, name) {
                    me.name = name
                    me.target.name = name
                    me.target.biz = biz
                    me.log('update')
                }
            })
            this.container.add(this.polygon)
            this.group.add(this.container)

            this.log('create')
        },

		/**
		 * 更新
		 */
        updated: function (attr) {
            if (!attr) return
            this.background_color = attr.background_color || this.background_color
            this.border_color = attr.border_color || this.border_color
            this.polygon.attr('style', {
                fill: this.background_color,
                stroke: this.border_color
            })
            if (attr.children) {
                _utils.updated(attr.children)
            }
        },

		/**
		 * ready
		 */
        ready: function () {
            this.contextmenu()
            var point = _utils.getCenterPoint(this.points)
            this.dialog = new _dialog({
                group: this.container,
                target: this.target,
                text: this.name,
                x: point.x,
                y: point.y
            })
            this.win = new _win({
                group: this.container,
                text: this.name,
                target: this.target,
                x: point.x,
                y: point.y,
                mouseout: function (e) {
                    var event = e.event || {}
                    var x = event.zrX
                    var y = event.zrY
                    if (
                        _utils.isInsidePolygon(me.points, {
                            x: x,
                            y: y
                        })
                    ) {
                        return
                    }
                    me.polygon.attr('style', {
                        fill: me.mode === 'build' ? me.edit_background_color : me.background_color,
                        stroke: me.mode === 'build' ? me.edit_border_color : me.border_color
                    })
                    me.win.hide()
                }
            })
            var me = this
            this.polygon.on('mousedown', function () {
                if (_zr.edit) return
                _stmap._setStatus()
            })
            this.polygon.on('mouseover', function (e) {
                if (_zr.edit) return
                me.basic()
                me.polygon.attr('style', {
                    fill: me.hover_background_color,
                    stroke: me.hover_border_color
                })
            })
            this.polygon.on('mouseout', function (e) {
                if (_zr.edit) return
                var event = e.event || {}
                var x = event.zrX
                var y = event.zrY
                if (me.win.inside(x, y)) {
                    return
                }
                me.win.hide()
                me.polygon.attr('style', {
                    fill: me.mode === 'build' ? me.edit_background_color : me.background_color,
                    stroke: me.mode === 'build' ? me.edit_border_color : me.border_color
                })
            })
        },

		/**
		 * 设置名称
		 */
        setName: function (name) {
            this.name = name
        },

		/**
		 * 添加子元素
		 * @param {*} child
		 */
        addChild: function (child) {
            this.container.add(child)
        },

		/**
		 * 获取子元素
		 */
        getChild: function () {
            var polygon = this.polygon
            var points = polygon.shape.points || []
            return _stmap.getCameras(function (camera) {
                return _utils.isInsidePolygon(camera, points)
            })
        },

		/**
		 * 右键注册
		 */
        contextmenu: function () {
            var me = this
            this.target.points = this.points
            this.polygon.on('contextmenu', function (e) {
                var event = e.event || {}
                var menu = [
                    {
                        action: 'edit',
                        name: '修改名称'
                    },
                    {
                        action: 'delete',
                        name: '删除'
                    },
                    {
                        action: 'top',
                        name: '置顶'
                    },
                ]
                if (!_zr.edit || me.mode === 'build') {
                    menu.push({
                        action: me.mode === 'build' ? 'build_complete' : 'build',
                        name: me.mode === 'build' ? '完成' : '编辑区域'
                    })
                }
                menu.push({
                    action: 'warn',
                    name: '预警消息'
                })
                _setcontextmenu(me.target, menu, function (data) {
                    _contextmenu.show({
                        group: me.group,
                        x: e.offsetX,
                        y: e.offsetY,
                        data: data || [],
                        target: me.target,
                        cb: function (e) {
                            switch (e.action) {
                                case 'top':
                                    me.target.z2 = _utils.z2('polygon')
                                    me.polygon.attr('z2', me.target.z2)
                                    break
                                case 'build':
                                    me.build()
                                    break
                                case 'build_complete':
                                    me.buildcomplete()
                                    break
                                case 'edit':
                                    me.log('edit')
                                    break
                                case 'delete':
                                    me.log('confirm_delete')
                                    break
                                case 'warn':
                                    var point = _utils.getCenterPoint(me.points)
                                    me.dialog.show({
                                        x: point.x,
                                        y: point.y,
                                        icon: icon_warn,
                                        title: '预警消息',
                                        photo: icon_women_01,
                                        color: '#EF5959',
                                        target: me.target,
                                        biz: [
                                            {
                                                key: '时间',
                                                value: '2019-08-09 06:37:23'
                                            },
                                            {
                                                key: '任务',
                                                value: '防止陌生人'
                                            },
                                            {
                                                key: '地点',
                                                value: '1A馆3F-A点'
                                            }
                                        ]
                                    })
                                    me.log('polygon_warn')
                                    break
                            }
                        }
                    })
                })
            })
        },

		/**
		 * 构建
		 */
        build: function () {
            if (this.list && this.list.length) {
                for (var i = 0; i < this.list.length; i++) {
                    this.container.remove(this.list[i])
                }
            }
            this.polygon.attr('style', {
                fill: this.edit_background_color,
                stroke: this.edit_border_color
            })
            this.list = []
            this.target.z2 = _utils.z2('polygon')
            this.polygon.attr('z2', this.target.z2)
            this.polygon.attr('draggable', true)
            for (var i = 0; i < this.points.length; i++) {
                var item = this.builditem(this.points[i], i, this.target.z2)
                this.container.add(item)
                this.list.push(item)
            }
            this.mode = 'build'
            _zr.edit = true
        },

        builditem: function (point, i, z2) {
            var me = this
            return new zrender.Circle({
                shape: {
                    cx: point[0],
                    cy: point[1],
                    r: 6
                },
                style: {
                    fill: this.edit_circle_color || '#f00'
                },
                z: this.target.z,
                z2: z2 + 1,
                draggable: true,
                ondrag: function (e) {
                    var position = e.target.position
                    var x = point[0] + position[0]
                    var y = point[1] + position[1]
                    me.points[i] = [x, y]
                    me.polygon.attr('shape', {
                        points: me.points
                    })
                }
            })
        },

		/***
		 * 构建完成
		 */
        buildcomplete: function () {
            if (this.list && this.list.length) {
                for (var i = 0; i < this.list.length; i++) {
                    this.container.remove(this.list[i])
                }
            }
            this.mode = 'build_complete'
            _stmap.setEditMode()
            this.polygon.attr('style', {
                fill: this.mode === 'build' ? this.edit_background_color : this.background_color,
                stroke: this.mode === 'build' ? this.edit_border_color : this.border_color
            })
            this.polygon.attr('draggable', false)
        },

		/**
		 * 拖拽
		 * @param {*} item
		 */
        drag: function (item, i) {
            var me = this
            var drag = false
            var tx = 0
            var ty = 0
            var mousedown = function (e) {
                drag = true
                _zr.on('mousemove', mousemove)
                _zr.on('mouseup', mouseup)
            }
            var mousemove = function (e) {
                if (!drag) return

                var event = e.event || {}
                if (e.target && e.target.transform && e.target.transform.length >= 6) {
                    tx = e.target.transform[4] / _zr.scale
                    ty = e.target.transform[5] / _zr.scale
                }
                var x = event.zrX / _zr.scale - tx
                var y = event.zrY / _zr.scale - ty
                item.attr('shape', {
                    cx: x,
                    cy: y
                })
                me.points[i] = [x, y]
                me.polygon.attr('shape', {
                    points: me.points
                })
            }
            var mouseup = function () {
                drag = false
                _zr.off('mousemove', mousemove)
                _zr.off('mouseup', mouseup)
            }
            item.on('mousedown', mousedown)
        },

		/**
		 * 删除
		 */
        remove: function () {
            this.group.remove(this.container)
            this.group.dirty()
            _rebuild.remove({
                type: 'polygon',
                id: this.target.id
            })
            _stmap.setEditMode()
        },

		/**
		 * 添加节点
		 */
        addPoint: function (point) {
            var exist = false
            for (var i = 0; i < this.points.length; i++) {
                if (Math.abs(this.points[i][0] - point[0]) < 5 && Math.abs(this.points[i][1] - point[1]) < 5) {
                    exist = true
                }
            }
            if (exist) return
            this.points.push(point)
            this.polygon.shape.points = this.points
            this.polygon.dirty()
            this.log('add-point')
        },

		/**
		 * 绘制节点
		 */
        drawPoint: function (point) {
            this.polygon.shape.points = this.points.concat([point])
            this.polygon.dirty()
            this.log('draw-point')
        },

		/**
		 * 基本信息
		 */
        basic: function (e) {
            if (!this.win) return
            var point = _utils.getCenterPoint(this.points)
            this.win.show({
                icon: icon_location,
                title: this.name,
                target: this.target,
                x: point.x,
                y: point.y,
                button: this.button
            })
            this.log('polygon_basic')
        },

		/**
		 * 日志
		 * @param {*} action
		 * @param {*} message
		 */
        log: function (action, message) {
            _log({
                action: action,
                target: this.target,
                message: message
            })
        }
    }
    var _runman = function (option) {
        if (!option || !option.group) return
        this.group = option.group
        this.icon = option.icon || [
            ['../assets/img/res/icon-run-man-left-a.svg', '.../assets/img/res/icon-run-man-left-b.svg'],
            ['../assets/img/res/icon-run-man-right-a.svg', '../assets/img/res/icon-run-man-right-b.svg']
        ]
        this.width = option.width || 20
        this.height = option.height || 20
        this.x = option.x || 0
        this.x = option.y || 0
        this.man = []
        this.init()
    }
    _runman.prototype = {
		/**
		 * 初始化
		 */
        init: function () {
            this.load()
        },

		/**
		 * 加载
		 */
        load: function () {
            if (typeof this.icon === 'string') {
                this.man.push(
                    new zrender.Image({
                        style: {
                            image: this.icon,
                            x: this.x,
                            y: this.y,
                            width: this.width,
                            height: this.height
                        },
                        z: 1000001
                    })
                )
                this.group.add(this.man[0])
            } else {
                for (var i = 0; i < this.icon.length; i++) {
                    var list = this.icon[i] || []
                    for (var j = 0; j < list.length; j++) {
                        var item = new zrender.Image({
                            style: {
                                image: list[j],
                                x: this.x,
                                y: this.y,
                                width: this.width,
                                height: this.height
                            },
                            z: 1000001
                        })
                        this.man.push(item)
                        this.group.add(item)
                    }
                }
            }
        },

		/**
		 * 运动
		 */
        run: function (option) {
            if (!option) return
            if (this.man === null) {
                this.man = []
                this.load()
            }
            if (this.stopIcon) {
                this.group.remove(this.stopIcon)
            }
            var cur = option.cur || []
            var next = option.next || []
            this.x = cur[0] + (next[0] - cur[0]) - this.width / 2
            this.y = cur[1] + (next[1] - cur[1]) - this.height / 2
            var time = option.time
            var easing = option.easing
            if (this.man.length === 1) {
                this.man[0].animateTo(
                    {
                        style: {
                            x: this.x,
                            y: this.y
                        }
                    },
                    time,
                    0,
                    easing
                )
            } else {
                var idx = this.man.idx
                if (next[0] >= cur[0]) {
                    idx = idx === 1 ? 0 : 1
                } else {
                    idx = idx === 3 ? 2 : 3
                }
                this.man.idx = idx
                for (var i = 0; i < this.man.length; i++) {
                    this.man[i].attr('z2', i === idx ? 9999 : i)
                    this.man[i].animateTo(
                        {
                            style: {
                                x: this.x,
                                y: this.y
                            }
                        },
                        time,
                        0,
                        easing
                    )
                }
            }
            setTimeout(() => {
                if (option.stopIcon) {
                    this.set_stop_icon(option.stopIcon)
                }
            }, time)
        },
		/**
		 * 设置停止运动
		 * @param {*} icon
		 */
        set_stop_icon(icon) {
            if (!icon) {
                this.clear()
                return
            }
            this.stopIcon = new zrender.Image({
                style: {
                    image: icon,
                    x: this.x,
                    y: this.y,
                    width: this.width,
                    height: this.height
                },
                z: 1000002
            })
            this.group.add(this.stopIcon)
            this.group.dirty()
        },

		/**
		 * 清除人物
		 */
        clear: function () {
            for (var i = 0; i < this.man.length; i++) {
                this.group.remove(this.man[i])
            }
            this.man = null
            if (this.stopIcon) {
                this.group.remove(this.stopIcon)
            }
            this.stopIcon = null
        }
    }
	/**
	 * 轨迹
	 */
    var _polyline = function (option) {
        if (!option || !option.group) return

        this.group = option.group
        this.points = option.points || []
        this.step = option.step || 10
        this.data = this.getPoints(this.points)
        this.icon = option.icon || icon_man
        this.width = option.width || 20
        this.height = option.height || 20
        this.lineWidth = option.lineWidth || 6
        this.lineColor = option.lineColor || '#ccc'
        this.stopIcon = option.stopIcon || ''
        this.time = option.time || 60
        this.easing = option.easing || 'liner'
        this.target = {
            type: 'polyline'
        }
        this.init()
    }
    _polyline.prototype = {
		/**
		 *  初始化
		 */
        init: function () {
            this.load()
        },

		/**
		 * 加载
		 */
        load: function () {
            this.el = new zrender.Polyline({
                shape: {
                    points: [],
                    smooth: 0.2
                },
                style: {
                    lineWidth: this.lineWidth,
                    stroke: this.lineColor
                },
                z: 20000
            })
            this.group.add(this.el)

            this.man = new _runman({
                group: this.group,
                x: this.data[1][0],
                y: this.data[1][1],
                icon: this.icon
            })
            this.log('wait')
        },

		/**
		 * 初始化
		 */
        draw: function () {
            this.drawpoints = []
            this.drawseq = 0
            this.drawPoint()
            this.log('execute')
        },

		/**
		 * 附加
		 * @param {*} option
		 */
        append: function (option) {
            this.points = this.points.concat(option.points || [])
            this.step = option.step || this.step || 10
            this.icon = option.icon || this.icon || icon_man
            this.width = option.width || this.width || 20
            this.height = option.height || this.height || 20
            this.lineWidth = option.lineWidth || this.lineWidth || 6
            this.lineColor = option.lineColor || this.heighlineColort || '#ccc'
            this.stopIcon = option.stopIcon || ''
            this.time = option.time || this.time || 60
            this.easing = option.easing || this.easing || 'liner'
            if (this.drawseq + 1 >= this.data.length) {
                this.data = this.data.concat(this.getPoints(option.points))
                this.drawPoint()
            } else {
                this.data = this.data.concat(this.getPoints(option.points))
            }
        },

		/**
		 * 清除轨迹
		 */
        clear: function () {
            this.group.remove(this.el)
            this.man.clear()
            this.log('clear')
        },

		/**
		 * 快速轨迹
		 */
        complete: function () {
            this.stop = 1
            this.el.attr('shape', {
                points: this.data
            })
            this.man.run({
                cur: this.data[this.data.length - 1],
                next: this.data[this.data.length - 1],
                time: this.time,
                easing: this.easing,
                stopIcon: this.stopIcon
            })
            this.el.stop && this.el.stop()
            this.log('complete')
        },

		/**
		 * 绘制点位
		 * @param {*} point
		 * @param {*} data
		 * @param {*} i
		 */
        drawPoint() {
            if (this.drawseq + 1 >= this.data.length) {
                this.man.set_stop_icon(this.stopIcon)
                this.log('complete')
                return
            }
            this.drawpoints.push(this.data[++this.drawseq])
            var next = this.data[this.drawseq + 1] || this.data[this.drawseq]
            var cur = this.data[this.drawseq] || {}
            this.man.run({
                cur: cur,
                next: next,
                time: this.time,
                easing: this.easing
            })
            this.el.animateTo(
                {
                    shape: {
                        points: this.drawpoints
                    }
                },
                this.time,
                0,
                this.easing,
                function () {
                    if (this.stop) {
                        return
                    }
                    this.drawPoint()
                }.bind(this)
            )
        },

		/**
		 * 获取点位信息
		 * @param {*} data
		 */
        getPoints: function (data) {
            if (!data || !data.length) return []
            var points = []
            var p1 = data[0]
            for (var m = 1; m < data.length; m++) {
                var p2 = data[m]
                var ax = p1[0]
                var ay = p1[1]
                var bx = p2[0]
                var by = p2[1]
                var dx = Math.abs(bx - ax)
                var dy = Math.abs(by - ay)
                var dis = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
                var n = Math.ceil(dis / this.step)
                var dx = this.step * (bx - ax) / dis
                var dy = this.step * (by - ay) / dis
                var xc = dx + ax
                var yc = dy + ay
                points.push([xc, yc])
                for (var i = 1; i <= n; i++) {
                    var xc = i * dx + ax
                    var yc = i * dy + ay
                    points.push([xc, yc])
                }
                p1 = p2
            }
            return points
        },

		/**
		 * 日志
		 * @param {*} action
		 * @param {*} message
		 */
        log: function (action, message) {
            _log({
                action: action,
                target: this.target,
                message: message
            })
        }
    }
    var _map = function (option) {
        this.container = option.container || {}
        this.limit = option.limit || false
        this.data = option.data
        this.scale = option.scale || {
            cur: 1,
            max: 3,
            min: 1
        }
        this.draggable = option.draggable || {
            camera: true,
            polygon: true
        }
        var state = option.state || {}
        state.hover = state.hover || {
            background_color: '#ccc',
            border_color: '#f00'
        }
        state.edit = state.edit || {
            circle_color: '#ff0',
            background_color: '#ccc',
            border_color: '#f00'
        }
        this.state = {
            hover_background_color: state.hover.background_color,
            hover_border_color: state.hover.border_color,
            edit_circle_color: state.edit.circle_color,
            edit_background_color: state.edit.background_color,
            edit_border_color: state.edit.border_color
        }
        this.init()
    }
    _map.prototype = {
        polygons: {},
        cameras: {},
        points: {},
        bg: null,
        scale: {
            cur: 1,
            max: 3,
            min: 1
        },
        position: [0, 0],
        status: 'bg',

		/**
		 * 初始化
		 */
        init: function () {
            this.load()
        },

		/**
		 * 加载
		 */
        load: function () {
            this.polygons = {}
            this.cameras = {}
            this.bg = null
            this.position = [0, 0]
            this.cx = 0
            this.cy = 0

            if (this.container.tagName) {
                _zr = zrender.init(this.container)
            } else {
                _zr = zrender.init(document.getElementById(this.container.id))
            }
            // 实例化zrender
            _zr.drag_camera = !!this.draggable.camera
            _zr.drag_polygon = !!this.draggable.polygon
            _zr.scale = this.scale.cur || 1
            _zr.scale_max = this.scale.max || 2
            _zr.scale_min = this.scale.min || 1

            // 创建分组
            this.group = new zrender.Group({
                scale: [_zr.scale, _zr.scale],
                position: [0, 0]
            })

            // 绘制到画布
            _zr.add(this.group)

            // 加载数据
            this.data && this.import(this.data)

            // 注册事件
            _zr.on('click', function () {
                _contextmenu.hide()
            })

            // 圆形选择器
            this.drawCircle()

            // 方形选择器
            this.drawRect()
        },

		/**
		 * 移动
		 */
        _draggable: function () {
            var b = this.bg
            var me = this
            this.bg_mousedown = null
            _utils.drag(b, function (e, type, mousedown) {
                if (type === 'mousedown' && me.status === 'bg') {
                    if (e.target && e.target.subid && e.target.subid === b.subid) {
                        _contextmenu.hide()
                        if (_zr.scale === 1) {
                            var event = e.event || {}
                            var px = me.group.position[0]
                            var py = me.group.position[1]
                            return _utils.isInside({
                                shape: 'rect',
                                point: [event.zrX, event.zrY],
                                vs: [
                                    [b.x + px, b.y + py],
                                    [b.x + b.width + px, b.y + py],
                                    [b.x + b.width + px, b.y + b.height + py],
                                    [b.x + px, b.y + b.height + py]
                                ]
                            })
                        }
                        return true
                    }
                } else if (type === 'mousemove') {
                    return me.status === 'bg'
                } else if (type === 'mouseup') {
                    me.bg_mousedown = mousedown
                    return me.status === 'bg'
                }
            })
        },

		/**
		 * 选择器
		 */
        select: function (type) {
            this._setStatus(type)
        },

		/**
		 * 设置绘制状态
		 */
        _setStatus: function (_status) {
            this.status = _status || 'bg'
        },

		/**
		 * 清除画布
		 */
        clear: function () {
            this.data = null
            _zr.clear()

            this.load()
        },

		/**
		 * 重新加载
		 */
        reload: function () {
            this.data = this.getData('all')
            _zr.dispose()
            this.load()
        },

		/**
		 * 画布缩放
		 */
        zoom: function (status) {
            var me = this
            var mousewheel = function (e) {
                if (e.wheelDelta > 0) {
                    _zr.scale += 0.1
                } else {
                    _zr.scale -= 0.1
                }
                me.setScale(_zr.scale)
            }
            _zr.off('mousewheel', mousewheel)
            if (status === 1) {
                _zr.on('mousewheel', mousewheel)
            }
        },

		/**
		 * 画布放大
		 */
        zoomIn: function () {
            _zr.scale += 0.1
            this.setScale(_zr.scale)
        },

		/**
		 * 画布缩小
		 */
        zoomOut: function () {
            _zr.scale -= 0.1
            this.setScale(_zr.scale)
        },

		/**
		 * 设置编辑模式
		 */
        setEditMode: function (mode) {
            for (var key in this.polygons) {
                var polygon = this.polygons[key]
                if (polygon && polygon.mode === 'build') {
                    mode = polygon.mode
                }
            }
            _zr.edit = !!mode
            if (!_zr.edit) {
                // 注册拖拽
                this._draggable(true)
            }
        },

		/**
		 * 初始化
		 */
        setScale: function (scale) {
            if (scale > _zr.scale_max) {
                scale = _zr.scale_max
            } else if (scale < _zr.scale_min) {
                scale = _zr.scale_min
            }
            _zr.scale = scale
            this.scale.cur = scale
            this.group.attr({
                scale: [_zr.scale, _zr.scale],
                origin: [_zr.getWidth() / 2, _zr.getHeight() / 2]
            })
        },

		/**
		 * 添加摄像头
		 * @param {*} option
		 */
        addBg: function (option) {
            if (!option || !option.src || !option.width || !option.height) return
            var width = parseInt(option.width)
            var height = parseInt(option.height)
            this.cx = (_zr.getWidth() - width) / 2
            this.cy = (_zr.getHeight() - height) / 2

            this.bg = _bg.add({
                id: option.id,
                name: option.name,
                group: this.group,
                x: this.cx,
                y: this.cy,
                width: width,
                height: height,
                src: option.src
            })

            _zr.scale = option.scale || _zr.scale
            this.group.attr({
                scale: [_zr.scale, _zr.scale],
                origin: [_zr.getWidth() / 2, _zr.getHeight() / 2]
            })

            // 注册拖拽
            this._draggable(true)

            // 注册缩放
            this.zoom(1)

            // 限制区域
            if (this.limit) {
                this.group.setClipPath(
                    new zrender.Rect({
                        shape: {
                            x: this.cx,
                            y: this.cy,
                            width: width,
                            height: height
                        }
                    })
                )
            }
        },

		/**
		 * 绘制摄像头
		 * @param {*} option
		 */
        drawCamera: function (option) {
            var me = this
            this.camera_icon = new zrender.Image({
                style: {
                    image: option.icon.pic,
                    x: -1000,
                    y: -1000,
                    width: option.icon.width,
                    height: option.icon.height
                },
                z: 100000
            })
            this.group.add(this.camera_icon)
            var width = option.icon.width || 32
            var height = option.icon.height || 32
            this.camera_mousedown = function (e) {
                if (e.which === 1) {
                    me.group.remove(me.camera_icon)
                    me.camera_icon = null
                    var asix = _utils.getAsix(e, me.position)
                    me.addCamera({
                        x: asix.x - me.cx - width / 2,
                        y: asix.y - me.cy - height / 2,
                        pic: option.pic,
                        id: option.id,
                        name: option.name,
                        biz: option.biz,
                        dialogBgColor: option.dialogBgColor,
                        dialogTextColor: option.dialogTextColor,
                        basic: option.basic,
                        button: option.button
                    })
                    _zr.off('mousemove', me.camera_mousemove)
                    _zr.off('mousedown', me.camera_mousedown)
                }
            }
            this.camera_mousemove = function (e) {
                var asix = _utils.getAsix(e, me.position)
                me.camera_icon.attr('style', {
                    x: asix.x - width / 2,
                    y: asix.y - height / 2
                })
            }
            _zr.on('mousemove', this.camera_mousemove)
            _zr.on('mousedown', this.camera_mousedown)
        },

		/**
		 * 取消绘制
		 */
        cancelDrawCamera() {
            if (this.camera_icon) {
                this.group.remove(this.camera_icon)
                this.camera_icon = null
            }
            if (this.camera_mousemove) {
                _zr.off('mousemove', this.camera_mousemove)
            }
            if (this.camera_mousedown) {
                _zr.off('mousedown', this.camera_mousedown)
            }
        },

		/**
		 * 添加摄像头
		 */
        addCamera: function (option, ext) {
            var list = option instanceof Array ? option : [option]
            var ext = ext || [0, 0]
            for (var i = 0; i < list.length; i++) {
                var item = list[i]
                console.log('fsafsdfassf', item);
                if (!item || !item.x || !item.y) continue
                var camera = new _camera({
                    group: this.group,
                    id: item.id,
                    name: item.name,
                    x: parseInt(item.x) + this.cx,
                    y: parseInt(item.y) + this.cy,
                    z: parseInt(item.z),
                    pic: item.pic,
                    biz: item.biz,
                    dialogBgColor: item.dialogBgColor,
                    dialogTextColor: item.dialogTextColor,
                    position: [0, 0],
                    basic: item.basic,
                    button: item.button
                })
                var id = camera.target.id
                this.cameras[id] = camera
            }
        },

		/**
		 * 添加点位
		 */
        addPoint: function (option, ext) {
            var list = option instanceof Array ? option : [option]
            var ext = ext || [0, 0]
            for (var i = 0; i < list.length; i++) {
                var item = list[i]
                if (!item || !item.x || !item.y) continue
                if (this.points[item.code]) {
                    this.points[item.code].remove()
                }
                const icon = item.icon || {}
                var point = new _point({
                    group: this.group,
                    id: item.id,
                    name: item.name,
                    x: parseInt(item.x) + this.cx,
                    y: parseInt(item.y) + this.cy,
                    z: parseInt(item.z),
                    pic: icon.url,
                    width: icon.width,
                    height: icon.height,
                    biz: item.biz,
                    position: [0, 0],
                    basic: item.basic,
                    button: item.button
                })
                this.points[item.code] = point
            }
        },

		/**
		 * 绘制多边形
		 */
        drawPolygon: function (option) {
            var group = this.group
            var polygons = this.polygons
            var polygon = null
            var drawing = false
            var me = this
            var tx = 0
            var ty = 0
            var getAsix = function (e, position) {
                var event = e.event || {}
                if (e.target && e.target.transform && e.target.transform.length >= 6) {
                    tx = e.target.transform[4] / _zr.scale
                    ty = e.target.transform[5] / _zr.scale
                }
                var x = event.zrX / _zr.scale - tx
                var y = event.zrY / _zr.scale - ty
                position = position || [0, 0]
                return {
                    x: x - position[0],
                    y: y - position[1]
                }
            }
			/**
			 * 鼠标按下
			 * @param {*} e
			 */
            var mousedown = function (e) {
                if (e.which === 1) {
                    if (!drawing) {
                        polygon = new _polygon({
                            group: group,
                            id: option.id,
                            name: option.name,
                            text_color: option.text_color,
                            border_color: option.border_color,
                            background_color: option.background_color,
                            opacity: option.opacity,
                            biz: option.biz,
                            state: me.state,
                            button: option.button
                        })
                    }
                    drawing = true
                    var asix = getAsix(e, me.position)
                    polygon.addPoint([asix.x, asix.y])
                    _zr.on('mousemove', mousemove)
                } else if (e.which === 3) {
                    if (!polygon) return
                    _zr.off('mousedown', mousedown)
                    _zr.off('mousemove', mousemove)
                    var asix = getAsix(e, me.position)
                    polygon.addPoint([asix.x, asix.y])
                    polygon.log('done')
                    var id = polygon.target.id
                    polygons[id] = polygon
                    drawing = false
                    setTimeout(function () {
                        polygon.ready()
                        polygon = null
                    }, 300)
                    me.setEditMode()
                }
            }

			/**
			 * 鼠标移动
			 * @param {*} e
			 */
            var mousemove = function (e) {
                if (!polygon) return
                var asix = _utils.getAsix(e, me.position)
                polygon.drawPoint([asix.x, asix.y])
            }

			/**
			 * 事件注册
			 */
            _zr.edit = true
            _zr.on('mousedown', mousedown)
        },

		/**
		 * 添加多边形
		 */
        addPolygon: function (option) {
            var list = option instanceof Array ? option : [option]
            var ext = [this.cx, this.cy]
            for (var i = 0; i < list.length; i++) {
                var item = list[i]
                if (!item || !item.points) continue
                for (var j = 0; j < item.points.length; j++) {
                    var point = item.points[j]
                    item.points[j] = [point[0] + ext[0], point[1] + ext[1]]
                }
                var polygon = new _polygon({
                    group: this.group,
                    points: item.points,
                    z: item.z,
                    id: item.id,
                    name: item.name,
                    text_color: item.text_color,
                    border_color: item.border_color,
                    background_color: item.background_color,
                    opacity: item.opacity,
                    position: item.position || [0, 0],
                    biz: item.biz,
                    state: this.state,
                    button: item.button
                })
                var id = polygon.target.id
                this.polygons[id] = polygon
                polygon.log('load')
                polygon.ready()
            }
        },

		/**
		 * 绘制轨迹
		 */
        createPolyline: function (option) {
            const points = option.points || []
            if (points.length < 2) return
            for (var i = 0; i < points.length; i++) {
                points[i][0] = points[i][0] + this.cx
                points[i][1] = points[i][1] + this.cy
            }
            return new _polyline({
                group: this.group,
                points: option.points,
                icon: option.icon,
                width: option.width,
                height: option.height,
                lineWidth: option.lineWidth,
                lineColor: option.lineColor,
                cx: this.cx,
                cy: this.cy
            })
        },

		/**
		 * 追加轨迹
		 * @param {*} polyline
		 * @param {*} option
		 */
        appendPolyline: function (polyline, opt) {
            const option = JSON.parse(JSON.stringify(opt))
            const points = option.points || []
            for (var i = 0; i < points.length; i++) {
                points[i][0] = points[i][0] + this.cx
                points[i][1] = points[i][1] + this.cy
            }
            polyline.append(option)
        },

		/**
		 * 绘制轨迹
		 */
        createPolylineByPoint: function (option) {
            var points = option.points || []
            var temp = []
            if (points.length < 2) return
            var code = ''
            for (var i = 0; i < points.length; i++) {
                if (code === points[i].code) continue
                code = points[i].code
                var point = this.points[code]
                if (!point) continue
                temp.push([point.x + 16, point.y + 16])
            }
            return new _polyline({
                group: this.group,
                points: temp,
                icon: option.icon,
                stopIcon: option.stopIcon,
                width: option.width,
                height: option.height,
                lineWidth: option.lineWidth,
                lineColor: option.lineColor
            })
        },

		/**
		 * 追加轨迹
		 * @param {*} polyline
		 * @param {*} option
		 */
        appendPolylineByPoint: function (polyline, opt) {
            const option = JSON.parse(JSON.stringify(opt))
            var points = option.points || []
            var temp = []
            if (points.length < 2) return
            points = points.sort((a, b) => {
                return a.captureTime > b.captureTime ? 1 : -1
            })
            var code = ''
            for (var i = 0; i < points.length; i++) {
                if (code === points[i].code) continue
                code = points[i].code
                var point = this.points[code]
                temp.push([point.x + 16, point.y + 16])
            }
            option.points = temp
            polyline.append(option)
        },

		/**
		 * 圆形选择器
		 */
        drawCircle: function () {
            var shape = null
            var start = null
            var me = this
            var r = 0
            var getChild = function (e) {
                if (!start || !e) return
                var event = e.event || {}
                var x = event.zrX
                var y = event.zrY
                return me.getCameras(function (camera) {
                    var point = [camera.x + 32, camera.y + 32]
                    var circle = [start.x, start.y]
                    return _utils.isInside({
                        point: point,
                        circle: circle,
                        r: r,
                        shape: 'circle'
                    })
                })
            }
            var mousedown = function (e) {
                if (me.status !== 'circle') return
                var event = e.event || {}
                start = {
                    x: event.zrX,
                    y: event.zrY
                }
                shape = new zrender.Circle({
                    shape: {
                        cx: start.x,
                        cy: start.y,
                        r: 0
                    },
                    style: {
                        lineWidth: 2,
                        fill: 'transparent',
                        stroke: '#e72427',
                        shadowColor: 'rgba(0,0,0,0.1)',
                        shadowOffsetX: 3,
                        shadowOffsetY: 3,
                        shadowBlur: 10
                    },
                    // silent: true,
                    z: 10000000
                })
                me.group.add(shape)
                _zr.on('mousemove', mousemove)
                _zr.on('mouseup', mouseup)
            }
            var mousemove = function (e) {
                if (!start) return
                var event = e.event || {}
                var end = {
                    x: event.zrX,
                    y: event.zrY
                }
                var width = end.x - start.x
                var height = end.y - start.y
                if (width < 0 || height < 0) {
                    width = Math.abs(width)
                }
                r = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2))
                shape.attr({
                    shape: {
                        cx: start.x,
                        cy: start.x,
                        r: r
                    }
                })
            }
            var mouseup = function (e) {
                if (!shape) return
                _setselect({
                    type: 'circle-selector',
                    updated: _utils.updated,
                    children: getChild(e)
                })
                me.group.remove(shape)
                shape = null
                start = null
                _zr.off('mousemove', mousemove)
                _zr.off('mouseup', mouseup)
            }

            _zr.on('mousedown', mousedown)
        },

		/**
		 * 方形选择器
		 */
        drawRect: function () {
            var shape = null
            var start = null
            var me = this
            var getChild = function (e) {
                if (!start || !e) return
                var event = e.event || {}
                var x = event.zrX
                var y = event.zrY
                return me.getCameras(function (camera) {
                    var point = [camera.x + 32, camera.y + 32]
                    var vs = [[start.x, start.y], [x, start.y], [x, y], [start.x, y]]
                    return _utils.isInside({
                        point: point,
                        vs: vs,
                        shape: 'rect'
                    })
                })
            }
            var mousedown = function (e) {
                if (me.status !== 'rect') return
                if (shape) {
                    me.group.remove(shape)
                }
                start = _utils.getAsix(e)
                console.log('start', start)
                shape = new zrender.Rect({
                    shape: {
                        x: start.x,
                        y: start.y,
                        width: 10,
                        height: 10
                    },
                    style: {
                        lineWidth: 2,
                        fill: 'transparent',
                        stroke: '#e72427',
                        shadowColor: 'rgba(0,0,0,0.5)',
                        shadowOffsetX: 3,
                        shadowOffsetY: 3,
                        shadowBlur: 10
                    },
                    z: 1000000
                })
                me.group.add(shape)
                _zr.on('mousemove', mousemove)
                _zr.on('mouseup', mouseup)
            }
            var mousemove = function (e) {
                if (!start) return
                var end = _utils.getAsix(e)
                shape.attr({
                    shape: {
                        x: start.x,
                        y: start.y,
                        width: end.x - start.x,
                        height: end.y - start.y
                    }
                })
            }
            var mouseup = function (e) {
                if (!shape) return
                _setselect({
                    type: 'circle-selector',
                    updated: _utils.updated,
                    children: getChild(e)
                })
                me.group.remove(shape)
                shape = null
                start = null
                _zr.off('mousemove', mousemove)
                _zr.off('mouseup', mouseup)
            }
            _zr.on('mousedown', mousedown)
        },

		/**
		 * 获取所有对象
		 */
        getData: function (type) {
            type = type || 'all'
            var bx = this.cx
            var by = this.cy
            var data = {}
            if (type === 'all' || type === 'bg') {
                if (this.bg && this.bg.target) {
                    data.bg = (this.bg && this.bg.target) || {}
                    data.bg.width = this.bg.width
                    data.bg.height = this.bg.height
                    data.bg.src = this.bg.src
                } else {
                    data.bg = null
                }
            }
            var cameralist = []
            for (var m in this.cameras) {
                var camera = this.cameras[m]
                if (!camera) continue
                var target = JSON.parse(JSON.stringify(camera.target))
                target.x = camera.x - bx + camera.position[0]
                target.y = camera.y - by + camera.position[1]
                target.w = camera.width
                target.h = camera.height
                target.basic = JSON.parse(JSON.stringify(camera.camera_basic))
                target.button = camera.button
                cameralist.push(target)
            }
            var polygonlist = []
            for (var n in this.polygons) {
                var polygon = this.polygons[n]
                if (!polygon) continue
                var child = polygon.polygon
                var target = JSON.parse(JSON.stringify(polygon.target))
                target.points = JSON.parse(JSON.stringify(child.shape.points || []))
                target.text_color = polygon.text_color
                target.border_color = polygon.border_color
                target.background_color = polygon.background_color
                target.opacity = polygon.opacity
                target.button = polygon.button
                for (var k = 0; k < cameralist.length; k++) {
                    var item = cameralist[k]
                    var x = item.x + bx
                    var y = item.y + by
                    var w = item.w
                    var h = item.h
                    if (
                        child.contain(x, y) ||
                        child.contain(x - w, y) ||
                        child.contain(x, y - h) ||
                        child.contain(x - w, y - h)
                    ) {
                        if (!target.children) {
                            target.children = []
                        }
                        target.children.push(item)
                    }
                }

                var px = polygon.position[0]
                var py = polygon.position[1]
                for (var i = 0; i < target.points.length; i++) {
                    var point = target.points[i]
                    target.points[i] = [point[0] + px - bx, point[1] + py - by]
                }
                polygonlist.push(target)
            }
            if (type === 'all' || type === 'polygon') {
                data.polygons = polygonlist
            }
            if (type === 'all' || type === 'camera') {
                data.cameras = cameralist
            }
            _log({
                action: 'getData',
                data: data
            })
            return data
        },

		/**
		 * 获取对象中的cameras
		 */
        getCameras: function (check) {
            if (!check) return []
            var bx = this.cx
            var by = this.cy
            var cameralist = []
            for (var m in this.cameras) {
                var camera = this.cameras[m]
                if (!camera) continue
                var target = JSON.parse(JSON.stringify(camera.target))
                target.x = camera.x - bx + camera.position[0]
                target.y = camera.y - by + camera.position[1]
                target.w = camera.width
                target.h = camera.height
                target.basic = JSON.parse(JSON.stringify(camera.camera_basic))
                target.updated = camera.updated.bind(camera)
                target.button = camera.button
                cameralist.push(target)
            }
            var children = {
                inside: [],
                outside: []
            }
            for (var k = 0; k < cameralist.length; k++) {
                var item = cameralist[k]
                if (
                    check({
                        x: item.x + bx,
                        y: item.y + by,
                        w: item.w,
                        h: item.h,
                        item: item
                    })
                ) {
                    children.inside.push(item)
                } else {
                    children.outside.push(item)
                }
            }
            return children
        },

		/**
		 * 自动选择
		 */
        autoSelect: function (ids) {
            var updated = function (data) {
                if (!data.attr) return
                var list = data.children || []
                for (var i = 0; i < list.length; i++) {
                    list[i].updated(data.attr)
                }
            }
            var children = _stmap.getCameras(function (camera) {
                if (!ids) return true
                var item = camera.item
                return ids.indexOf(item.id) >= 0
            })
            _setselect({
                type: 'auto-selector',
                updated: updated,
                children: children
            })
        },

		/**
		 * 数据导入
		 * @param {*} data
		 */
        import: function (data) {
            // 背景
            if (data.bg) {
                this.addBg(data.bg)
            }

            // 摄像头
            if (data.cameras) {
                this.addCamera(data.cameras)
            }

            // 多边形
            if (data.polygons) {
                this.addPolygon(data.polygons)
            }
        },

		/**
		 * 重命名
		 */
        rename: function (target, name) {
            if (!target) return
            var id = target.id
            var el = (this.polygons[id] && this.polygons[id].polygon) || (this.cameras[id] && this.cameras[id].image)
            if (el) {
                el.updatetraget(target.biz, name)
            }
        },

		/**
		 * 删除
		 */
        remove: function (target) {
            if (!target) return
            var id = target.id
            var el = this.polygons[id] || this.cameras[id]
            if (el) {
                el.remove()
            }
        },

		/**
		 * 预警消息
		 */
        warn: function (option) {
            if (!option) return
            var id = option.id
            var el = this.cameras[id] && this.cameras[id].image
            if (el) {
                this.cameras[id].warn(option)
            }
        },

		/**
		 * 隐藏预警消息
		 */
        hide_warn: function (id) {
            if (!id) return
            var id = id
            var el = this.cameras[id] && this.cameras[id].image
            if (el) {
                this.cameras[id].hide_warn()
            }
        }
    }

    // 实例化
    _stmap = new _map(opt);

    // 监听缩放事件
    (function () {
        var timeout = null
        window.onresize = function () {
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                _stmap.reload()
            }, 300)
        }
    })()

    return _stmap
}
