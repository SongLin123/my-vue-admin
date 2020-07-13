/*
 * @Date: 2020-05-13 14:30:24
 * @LastEditors: songlin
 * @LastEditTime: 2020-07-10 16:25:59
 * @FilePath: \senseIDC-fe\src\layout\header-aside\components\libs\util.menu.js
 */
// 创建 el-menu-item
export function elMenuItem (h, menu) {
  return h('el-menu-item', { key: menu.uuid, props: { index: menu.path } }, [
    ...menu.icon ? [
      h('i', {
        attrs: { class: `fa fa-${menu.icon}` },
        style: {
          'margin-right': '20px'
        }
 })
    ] : [],
    ...menu.icon === undefined & !menu.iconSvg ? [
      h('i', {
        attrs: { class: 'fa fa-file-o' },
        style: {
          'margin-right': '20px'
        }
})
    ] : [],
    ...menu.iconSvg ? [
      h('d2-icon-svg', {
        props: { name: menu.iconSvg },
        style: {
          'margin-right': '20px'
        }
 })
    ] : [],
    h('span', { slot: 'title' }, menu.title || '未命名菜单')
  ])
}

// 创建 el-submenu
export function elSubmenu(h, menu) {
  // fix: 可展开菜单可能没有path
  return h('el-submenu', { key: menu.uuid, props: { index: menu.uuid } }, [
    ...menu.icon ? [
      h('i', {
        slot: 'title',
attrs: { class: `fa fa-${menu.icon}` },
        style: {
          'margin-right': '20px'
        }
 })
    ] : [],
    ...menu.icon === undefined & !menu.iconSvg ? [
      h('i', {
        slot: 'title',
attrs: { class: 'fa fa-folder-o' },
        style: {
          'margin-right': '20px'
        }
})
    ] : [],
    ...menu.iconSvg ? [
      h('d2-icon-svg', {
 slot: 'title',
props: { name: menu.iconSvg },
style: {
        'margin-right': '20px'
      }
})
    ] : [],
    h('span', { slot: 'title' }, menu.title || '未命名菜单'),
    ...menu.children.map((child, childIndex) => (child.children === undefined ? elMenuItem : elSubmenu).call(this, h, child))
  ])
}
