export const base = {
  align:'center',
  menuAlign:'center',
  header:true,
  addBtn:true,
  fullscreenBtn:true,
  columnBtn:true,
  menu:true,
  editBtn:true,
  delBtn:true,
  index:false,
  columns:[
    {
      label:'姓名',
      prop:'name'
    },
    {
      label:'性别',
      prop:'sex'
    }
  ]
}

export const selection = {
  selection: true,
  align:'center',
  menuAlign:'center',
  columns:[
    {
      label:'姓名',
      prop:'name'
    }, {
      label:'性别',
      prop:'sex'
    }
  ]
}

export const search = {
  // searchMenuPosition:'right',
  columns: [{
    label: '姓名',
    prop: 'name',
    searchValue:'small',
    search:true,
    searchRules: [{
      required: true,
      message: "请输入姓名",
      trigger: "blur"
    }],
  },{
    label: '日期',
    prop: 'date',
    type:'datetime',
    searchSpan:12,
    searchRange:true,
    search:true,
  }, {
    label:'性别',
    prop:'sex',
    search:true,
  },{
    label: '内容4',
    prop: 'text4',
    search:true,
  },{
    label: '内容5',
    prop: 'text5',
    search:true,
  },{
    label: '内容6',
    prop: 'text6',
    search:true,
  }]
}