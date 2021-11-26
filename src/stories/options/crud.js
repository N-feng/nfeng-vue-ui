import moment from "moment";

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
    searchOrder: 1
  },{
    label: '日期',
    prop: 'date',
    type:'datetime',
    searchSpan:12,
    searchRange:true,
    search:true,
    searchValue: [
      moment(new Date())
          .subtract(15, "days")
          .format("YYYY-MM-DD"),
      moment(new Date()).add(15, "days").format("YYYY-MM-DD")
    ],
    searchOrder: 3
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

export const cell = {
  addBtn:false,
  addRowBtn:true,
  cellBtn:true,
  menuWidth:250,
  columns: [{
    label:'姓名',
    prop: 'name',
    cell: true,
    rules: [
      {
        required: true,
        message: '请输入姓名',
        trigger: 'blur'
      }
    ]
  },{
    label:'性别',
    prop: 'sex',
    type:'select',
    dicData:[{
      label:'男',
      value:0
    },{
      label:'女',
      value:1
    }],
    cell: true
  },{
    label:'年龄',
    prop: 'age',
    slot:true,
    formslot:true,
    dicData:[{
      label:'男',
      value:0
    },{
      label:'女',
      value:1
    }],
    rules: [
      {
        required: true,
        message: '请输入年龄',
        trigger: 'blur'
      }
    ],
    cell: true
  },{
    label:'开关',
    prop: 'switch',
    type:'switch',
    cell: true
  }]
}
