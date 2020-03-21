const menuList = [
  {
    title: 'Home', 
    key: '/home', 
    icon: 'home', 
    isPublic: true, 
  },
  {
    title: 'Products',
    key: '/products',
    icon: 'appstore',
    children: [ 
      {
        title: 'Category',
        key: '/category',
        icon: 'bars',
      },
      {
        title: 'Product',
        key: '/product',
        icon: 'tool'
      },
    ]
  },

  {
    title: 'User',
    key: '/user',
    icon: 'user'
  },
  {
    title: 'Role',
    key: '/role',
    icon: 'safety',
  },

  // {
  //   title: '图形图表',
  //   key: '/charts',
  //   icon: 'area-chart',
  //   children: [
  //     {
  //       title: '柱形图',
  //       key: '/charts/bar',
  //       icon: 'bar-chart'
  //     },
  //     {
  //       title: '折线图',
  //       key: '/charts/line',
  //       icon: 'line-chart'
  //     },
  //     {
  //       title: '饼图',
  //       key: '/charts/pie',
  //       icon: 'pie-chart'
  //     },
  //   ]
  // },

  // {
  //   title: '订单管理',
  //   key: '/order',
  //   icon: 'windows',
  // },
]

export default menuList