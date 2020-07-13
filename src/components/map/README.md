# 组件介绍

## 注意

* 此组件依赖于vue + elementUI

## 功能

* 绘制底图
* 部署设备
* 绘制区域
* 轨迹追踪
* 追加轨迹

## 使用

* props传值与数据格式

** mapImage：Object                              底图对象
** dragCamera：Boolean                           设备是否可以拖拽，默认不可以
** device：Object                                单个设备
** deviceList：Array                             载入设备的列表
** polygon：Object                               绘制区域
** PolygonList：Array                            载入区域的列表
** trajectoryPointsList：Array                   轨迹点位的列表
** trajectoryLinesByPoints：Object               轨迹连线所需要的对象

1. mapImage: { src: '', width: '', height: '' }
2. deviceList: [{
      id: '', // 设备ID
      name: '', // 设备名称
      pic: '', // 设备图片
      biz: { // 业务相关的信息，可任意组装
        code: '001',
        name: '摄像头-001'
      },
      dialogBgColor: '', // 背景色
      dialogLineColor: '', // 分割线颜色，设置为transparent可以不显示
      dialogTextColor: '', // 头部标题的颜色
      basic: [ // 明细信息，显示在悬浮窗上，键值对形式
        { key: '设备编号', value: 'SKP_ST339918K00005' },
        { key: '设备名称', value: 'Keeper' },
        { key: '设备位置', value: '厕所' }
      ],
      x: 0, // 设备的x坐标
      y: 0, // 设备的y坐标
      z: 0, // 设备的层级
    }]
![部署设备所需要的数据]()
3. PolygonList: [{
      id: '', // 区域ID
      name: '', // 区域名称
      text_color: '', // 区域名称颜色
      border_color: '', // 区域边框颜色
      background_color: '', // 区域背景颜色
      opacity: 1, // 区域透明度（0-1）
      z: 0, // 区域层级
      biz: { // 业务相关的信息，可任意组装
        code: '001',
        name: '自定义区域一'
      },
      points: [ [ 748, 177 ], [ 629, 434 ], [ 593, 336 ], [ 593, 336 ] ] // 区域点位信息
    }]
![绘制区域所需要的数据]()
4. trajectoryPointsList: [{
      code: '', // 点位编码
      name: '', // 点位名称
      x: 0, // 点位的x坐标
      y: 0, // 点位的y坐标
      icon: { url: '', width: 0, height: 0 }, // 点位的图标
      biz: { id: 1, name: 'point_1' }, // 业务相关的信息，可任意组装
      basic: [ // 明细信息，显示在悬浮窗上，键值对形式
        { key: '点位编号', value: 1 },
        { key: '点位名称', value: '点位_1' }
      ]
    }]
![轨迹追踪所需要的点位数据]()
5. trajectoryLinesByPoints: {
    points: [ // 点位信息
      { code: '00001', captureTime: '2019-6-26 5:42:10' }, // 点位编码, 抓拍时间
      { code: '00002', captureTime: '2019-6-26 6:00:35' },
      { code: '00003', captureTime: '2019-6-26 5:44:55' },
    ],
    lineColor: '#f00', // 轨迹颜色
    lineWidth: 2, // 轨迹粗细
    icon: [ // 运动轨迹图标
      [ './src/res/icon-run-man-left-a.svg', './src/res/icon-run-man-left-b.svg' ],
      [ './src/res/icon-run-man-right-a.svg', './src/res/icon-run-man-right-b.svg' ]
    ],
    stopIcon: './src/res/icon-man.svg' // 停止轨迹图标
  }
![轨迹追踪决定划线顺序所需要的数据]()
7. device: { // 同设备列表
      id: '1003',
      name: '摄像头-003',
      icon: {
        pic: deviceIcon,
        width: 32,
        height: 32
        },
      biz: {
        code: '003',
        name: '摄像头-003'
      },
      basic: [
        { key: '设备编号', value: 'SKP_ST339918K00005' },
        { key: '设备名称', value: 'Keeper' },
        { key: '设备位置', value: '厕所' }
      ]
    }
8. polygon: { // 同区域列表
      id: '3002',
      name: '自定义区域二',
      text_color: '#000',
      border_color: '#fff000',
      background_color: '#5662FF',
      opacity: 1,
      biz: {
        code: '002',
        name: '自定义区域二'
      }
    }
