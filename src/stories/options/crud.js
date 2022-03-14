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
      prop:'name',
      slot:true
    },
    {
      label:'性别',
      prop:'sex',
      render: ({ index }) => {
        return index
      }
    },
    // {
    //   label: '操作',
    //   prop: 'operation',
    //   width: 250
    // },
  ]
}

export const height = {
  height:285,
  columns:[
    {
      label:'姓名',
      prop:'name',
      minWidth:200,
      fixed:true
    }, {
      label:'性别',
      minWidth:300,
      prop:'sex'
    }, {
      label:'日期',
      minWidth:300,
      prop:'datetime'
    }, {
      label:'地址',
      minWidth:300,
      prop:'address'
    }
  ]
}

export const html = {
  columns:[{
    label:'姓名',
    prop:'name',
    html:true,
    render:(val)=>{
      return '<span style="color:red">'+val.text+'</span>'
    }
  }, {
    label:'性别',
    prop:'sex',
    formatter: (val) => {
      return val.text
    }
  }]
}

export const view = {
  viewBtn:true,
  editBtn:false,
  delBtn:false,
  // menuWidth:80,
  columns: [{
    label: '姓名',
    prop: 'name'
  },{
    label: '年龄',
    prop: 'age'
  },{
    label:'地址',
    span:24,
    prop:'address',
    type:'textarea'
  }]
}

export const selection = {
  selection: true,
  rowSelection: {},
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
  searchIndex: 5,
  columns: [{
    label: '姓名',
    prop: 'name',
    searchValue:'small',
    search:true,
    searchSpan:8,
    searchRules: [{
      required: true,
      message: "请输入姓名",
      trigger: "blur"
    }],
    searchOrder: 1
  },{
    label: '日期',
    prop: 'date',
    type:'date',
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
    // searchSpan:12,
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
  // header:true,
  // addBtn:true,
  addRowBtn:true,
  fullscreenBtn:true,
  columnBtn:true,
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
    propName: 'sexName',
    type:'select',
    options:[{
      name:'男',
      code:0
    },{
      name:'女',
      code:1
    }],
    cell: true
  },
    {
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
  },
    {
    label:'开关',
    prop: 'switch',
    type:'switch',
    cell: true
  }]
}
