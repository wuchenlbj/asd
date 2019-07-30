<!-- 文档上传 -->
<template>
  <div class="uploader-container">
    <slot>
      <!-- 只有在没有要分发的内容时才会显示。 -->
    </slot>
    <div v-loading="loadingpage.state" :element-loading-text="loadingpage.msg">
      <!-- 导航部分 -->
      <div class="toptext">
        <div v-show="!disabledBtn">
          <el-dropdown :show-timeout='0' placement='top-end' mode="horizontal">
            <el-button id="filePicker" type="text" icon="el-icon-upload2" style="padding:0;marginRight:10px;fontSize:14px">上传</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :disabled="disabledBtn">
                <a data-menu-id="b-menu1" class="g-button-menu  upload-wrapper" href="javascript:void(0);">上传文件夹
                  <form class="h5-uploader-form" action="javascript:void(0);">
                    <input title="点击选择文件夹" id="h5Input2" multiple="" webkitdirectory="" accept="*/*" type="file" name="html5uploader" style="position:absolute;opacity:0;top:0;left:0;height:100%;cursor:pointer;">
                  </form>
                </a>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <!-- <el-tag v-if="xmxxSelectRow&&xmxxSelectRow.length>0" closable type="warning">已选择项目{{xmxxSelectRow.length}} 个</el-tag>
          <el-tag v-else-if="xmxxRow" closable type="warning">已选择项目1个 </el-tag> -->
        </div>
        <span class="toptext-l" :class="{toptextshow:!toptextshow}">全部文件</span>
        <el-button @click="delrow" type="text" icon="el-icon-delete" :class="{toptextshow: toptextshow}" style="fontSize:14px;top:-8px;position: absolute;left:70px;">删除</el-button>
        <span class="toptext-l1" @click="goLastnfile(-1)" :class="{toptextshow: toptextshow}">
          首页
          <span role="presentation" class="el-breadcrumb__separator">/</span>
        </span>

        <el-breadcrumb separator="/" :class="{toptextshow:toptextshow,'FuIxtL':true}" style="left:195px;">
          <el-breadcrumb-item v-for="(item,index) in filelevelString" :key="index">
            <a v-if="filelevelString.length !==(index+1)" style="color: #4287ed" @click="goLastnfile((filelevelString.length-1-index))">{{item.name}}</a>
            <a style="cursor:auto" v-else>{{item.name}}</a>
          </el-breadcrumb-item>
        </el-breadcrumb>
        <span class="toptext-r">已全部加载，共{{displayData.length}}个</span>
      </div>
      <!-- 文件表格内容 -->
      <el-table :data="displayData" stripe v-loading="listLoading" @select='selectRow' @select-all='selectallRow' :empty-text="emptytext" element-loading-text="正在查询,请稍后！" @row-dblclick="rowdblclick" border :height="docListH" style="width: 99.9%;" header-row-class-name="headclass">
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column label="文件名" min-width="300px">
          <template slot-scope="scope">
            <div class="filecion" :class="scope.row.iconClass"></div>
            <span class="span-title" v-if="!scope.row.edit&&scope.row.TYPE=='0'" @click="gonext(scope.row)">{{scope.row.MC}}</span>
            <a class="span-title" v-if="scope.row.TYPE=='1'" :href="actionurl+'filename='+scope.row.MC+'&filepath='+scope.row.PATH">{{scope.row.MC}}</a>
            <el-input v-if="scope.row.edit" autofocus style="width:200px;" size="small" v-model="scope.row.MC"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="大小" width="180">
          <template slot-scope="scope">
            <span>{{scope.row.WJSIZE|bytesToSize}}</span>
          </template>
        </el-table-column>
        <el-table-column label="历史版本" v-if="!toptextshow" width="130" align="center">
          <template slot-scope="scope">
            <a v-if="!toptextshow && scope.row.TYPE=='1' && scope.row.VER" style="color: #4287ed" @click="viewVersion(scope.row.MC)">查看历史版本</a>
          </template>
        </el-table-column>
        <el-table-column label="上传时间" prop="XGSJ"></el-table-column>
      </el-table>
    </div>

    <!-- 历史版本内容 -->
    <el-dialog v-dialogDrag :close-on-click-modal="false" width="600px" :visible.sync="verDlgVisible" append-to-body>
      <span slot="title">文件：{{dovNameVer}}的历史版本列表</span>
      <el-table :data="versionData" stripe v-loading="listLoading" :empty-text="emptytext" element-loading-text="正在查询,请稍后！" border :height="docListH" style="width: 99%" header-row-class-name="headclass">
        <el-table-column label="文件名" min-width="200px">
          <template slot-scope="scope">
            <div class="filecion" :class="scope.row.iconClass"></div>
            <a class="span-title" :href="actionurl+'filename='+scope.row.MC+'&filepath='+scope.row.PATH">{{scope.row.MC}}</a>
          </template>
        </el-table-column>
        <el-table-column label="大小" width="80">
          <template slot-scope="scope">
            <span>{{scope.row.WJSIZE|bytesToSize}}</span>
          </template>
        </el-table-column>
        <el-table-column label="上传时间" prop="XGSJ"></el-table-column>
        <el-table-column label="删除" width="60">
          <template slot-scope="scope">
            <span style="color: #4287ed;cursor:pointer" @click="delVer(scope.row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 上传列表 isshow-->
    <div class="uploadlist" v-show="isshow" @dblclick="tooglewin">
      <div class="uphead">
        <span style="margin-left:20px;color:#424e67;">{{tipuptitle}}</span>
        <el-progress :style="{left: '100px',top: '10px',position: 'absolute',width: '80%'}" :text-inside="true" :stroke-width="20" :percentage="uploadPersent"></el-progress>
        <span :style="{color:uploadColor,marginLeft:'280px',fontSize:'10px',top:'1px',position:'absolute'}">上传完成{{showUploadMsg}}</span>
        <i class="el-alert__closebtn el-icon-close"></i>
      </div>
      <div class="upgroupbody">
        <div class="queueList" style="width:700px;">
          <div class="uploader-list-header">
            <div class="file-name">文件(夹)名</div>
            <div class="file-size">大小</div>
            <div class="file-status">状态</div>
            <div class="file-time">剩余时间</div>
            <div class="file-operate">操&nbsp;&nbsp;作</div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import _ from 'lodash'
import md5 from 'js-md5'
import { mapGetters } from 'vuex'
import { getFileLists, savexmToqd } from 'api/xmwdqd/index.js'
import msg from 'utils/loadmsg'
import { dropFile, saveFileXMData, SaveFolderRelation } from 'api/filelist'
import bus from '@/components/bus'
import { NewGuid } from '@/config/filter'

window.MD5 = null

export default {
  name: 'wdsc',
  data () {
    return {
      maxRelatetivePath: [], // 最深文件夹层级的路径
      loadingpage: {
        state: false,
        msg: '正在保存文档关联信息入库,请稍后..'
      },
      loadtb: '正在保存文档关联信息入库,请稍后..',
      actionurl: process.env.WDK_BASE_API + 'api/DocDownload/GetFileInfo?',
      fileQueryList: {
        // GNM 重新调整发送的数据结构，减少数据冗余
        FilesList: {},
        XmList: [],
        QDID: ''
      }, // 返回的文件信息 上传完毕统一保存
      folderfid: '', // 文件的父id
      // bSpecify : false, // 是否指定清单显示
      selectRows: [], // 勾选行
      selectxmRows: [], // 选择课题数据
      rootIds: [], // 清单id数组
      curQDid: '', // 当前的清单id
      curQDName: '', // GNM 当前的清单名称，用来和外部的项目表文档清单相关列关联
      disabledBtn: true,
      tipuptitle: '上传列表',
      showUploadMsg: '',// 上传信息
      uploadPersent: 0,
      uploadColor: 'navy',
      emptytext: '请先选择上传资料的项目',
      tableData: [], // GNM 表格数据
      versionData: [], // GNM 历史版本表格数据
      dovNameVer: '', // GNM 有历史版本的文件名称
      mcdatapath: '', // 秒传datapath
      query: {
        type: '1',
        qdid: '',
        qdmc: '', // GNM 清单名称
        pcbm: '',
        id: '', // moduleid
        rows: [], // 选择行
        docids: [] //
      },
      isshow: false,
      verDlgVisible: false, // GNM 历史版本开关
      filelevel: [], // 文件层级
      listLoading: false,
      toptextshow: true,
      fileToFloder: null,
      filedata: [], // 上传数据列表
      // percentages: {}, // 所有文件的进度信息，key为file id
      uploader: null, // WebUploader实例
      GUID: WebUploader.Base.guid(),
      BASE_API: process.env.WDK_BASE_API,
      MD5: MD5, // 文件数据加密
      state: 'pedding', // 可能有pedding, ready, uploading, confirm, done.
      fileCount: 0, // 添加的文件数量
      fileSize: 0 // 添加的文件总大小
    }
  },
  props: {
    // 处理合同
    Page: {
      type: String,
      default: ''
    },
    // GNM 配置文件列表版本的高度
    listHeight: {
      type: Number,
      default: 280
    },
    // GNM 配置此属性时，组件会根据配置数据打开指定的文件夹
    // name:'', // 文件夹名称
    // qdid:'' // 文件夹所属清单
    // GNM 配置默认要显示的文档
    spcFolder: {
      type: Object,
      default: () => {
        return {}
      }
    },
    openDefault: {
      type: Boolean,
      default: false,
    }, // GNM 是否自动查询
  },
  watch: {
    Page: function (val) {
      this.watchHTPage(val)
    },
    // 单击事件触发 GNM ,添加自动查询事件，改更监听属性
    xmxxRow: {
      handler: function (row, val) {
        if (!row) {
          return false
        }
        this.selectxmRows = [row]
        // 根据项目查询文档类型
        this.filelevel = []
        this.query = {
          rows: [row],
          type: 3,
          id: this.moduleid
        }
        this.getFileList(0, this.$route.name)
      },
      immediate: this.openDefault
    },
    // 选择行事件触发
    xmxxSelectRow: function (rows) {
      if (rows.length === 0) {
        return false
      }
      this.selectxmRows = rows
      this.filelevel = []
      this.query = {
        rows: rows,
        type: 1,
        id: this.moduleid
      }
      // 查询数据
      this.getFileList(0, this.$route.name)
    },
    spcFolder: function (folder) {
      // this.specifyFolder = folder
      if (folder.qdid !== '') {
        this.curQDid = folder.qdid // 传递
        this.curQDName = folder.name // GNM
      }
    },
  },
  computed: {
    ...mapGetters(['token', 'moduleid', 'xmxxRow', 'xmxxSelectRow']),
    filelevelString () {
      // 如果是合同模块
      if (this.Page.indexOf('HT') > -1) {
        if (this.filelevel.length >= 1) {
          this.toptextshow = false
        } else {
          this.toptextshow = true
        }
        if (this.filelevel.length >= 2) {
          this.disabledBtn = false
        } else {
          this.disabledBtn = true
        }
      } else {
        if (this.filelevel.length >= 1) {
          this.disabledBtn = false
          this.toptextshow = false
        } else {
          this.disabledBtn = true
          this.toptextshow = true
        }
      }
      // 不在此显示
      // GNM
      // if (this.query.name === '验收申报材料') {
      //   this.disabledBtn = true
      // }
      return this.filelevel
    },
    /**
     * 根据文件名称的重复情况，生成要显示的文件数据
     * 要注意的是，重复的文件保留最新的那个版本
     * 所以，同时修改了查询文件列表的SQL（GetQDXX）
     * 排序规则是按type,mc,xgsj desc
     * 在函数setVersionSign中添加了VER属性
     */
    displayData () {
      return _.uniqBy(this.tableData, 'MC')
    },
    docListH () {
      return this.listHeight
    }
  },
  mounted: function () {
    this.folderfid = this.moduleid // 获取根id
    // 初始化上传控件
    this.fileToFloder = document.getElementById('h5Input2')
    this.fileToFloder.onchange = this.changefile
    this.initUpload()
    WebUploader.Uploader.unRegister('widgetName')
    this.watchHTPage(this.Page)
  },
  methods: {
    // 修改页面状态
    loadState (state, msg) {
      this.loadingpage = {
        state: state,
        msg: msg
      }
    },
    /**历史版数据操作 */
    viewVersion (docName) {
      // this.versionData = _.difference(this.tableData, this.displayData)
      this.dovNameVer = docName
      let verAllData = _.difference(this.tableData, this.displayData)
      this.versionData = this.getVerData(docName)
      this.verDlgVisible = true
    },
    getVerData (docName) {
      let verAllData = _.difference(this.tableData, this.displayData)
      return verAllData.filter((item, index) => {
        return _.includes(item, docName)
      })
    },
    /**历史版数据操作 */

    // 选择文件夹获取数据
    changefile (e) {
      e.preventDefault()
      // 注意这是个对象 要先转数组
      var files = this.fileToFloder.files
      this.isshow = true
      var filesup = []
      this.maxRelatetivePath=[] 
    
      for (var i = 0; i < files.length; i++) {
        var f = files[i]
        var filerepath=f.webkitRelativePath.substring(0,f.webkitRelativePath.lastIndexOf('/'))
        // 获取最大文件夹层级
        var repath = filerepath.split('/')
        if (this.maxRelatetivePath.length > 0) {
          if (repath.length > this.maxRelatetivePath[0].split('/').length) {
            this.maxRelatetivePath = []
            this.maxRelatetivePath.push(filerepath)
          } else if (repath.length == this.maxRelatetivePath[0].split('/').length) {
            this.maxRelatetivePath.push(filerepath)
          }
        } else {
          this.maxRelatetivePath.push(filerepath)
        }
        filesup.push(f)
      }
      this.maxRelatetivePath=Array.from(new Set(this.maxRelatetivePath))
      
      this.uploader.addFiles(filesup) // 将文件添加到队列中去
    },
    // 2.before-send验证 做分片验证
    // file.source.source.webkitRelativePath是原生file属性
    beforesend () {
      var _this = this
      WebUploader.Uploader.register(
        {
          'before-send-file': 'beforeSendFile', // 在文件发送之前request，此时还没有分片（如果配置了分片的话），可以用来做文件整体md5验证。
          'before-send': 'beforeSend', // 在分片发送之前request，可以用来做分片验证，如果此分片已经上传成功了，可返回一个rejected promise来跳过此分片上传
          name: 'widgetName'
        },
        {
          beforeSendFile: function (file) {
            // console.info('beforeSendFile')
            var me = this,
              owner = this.owner,
              server = me.options.server,
              task = $.Deferred()
            // 秒传验证
            var fileMd5 = (_this.MD5 = me.options.formData.md5 = md5(
              '' + file.name + file.type + file.lastModifiedDate + file.size
            ))
            owner
              .md5File(file.source)
              .fail(function () {
                // 如果读取出错了，则通过reject告诉webuploader文件上传出错。
                task.reject()
              })
              .then(function (md5) {
                // md5值计算完成
                // 与服务安验证
                $.ajax({
                  type: 'POST',
                  url: _this.BASE_API + 'api/UpFile/WebGisUpFileIfMd5',
                  data: {
                    status: 'md5Check',
                    md5: fileMd5,
                    fileExt: file.ext,
                    fileName: file.name,
                    parentid: _this.folderfid
                  },
                  beforeSend: function (request) {
                    request.setRequestHeader('ticket', _this.token)
                    request.setRequestHeader('moduleid', _this.moduleid || '')
                  },
                  cache: false,
                  dataType: 'json'
                }).then(
                  function (data, textStatus, jqXHR) {
                    if (data.ifExist) {
                      // 若存在，这返回失败给WebUploader，表明该文件不需要上传 此处属于拦截器，走了这里就不走success--秒传
                      owner.skipFile(file)
                      _this.showState('mcsuccss', file)
                      file.serverpath = _this.mcdatapath = data.path
                      // _this.MD5 = me.options.formData.md5 = md5('' + file.name + file.type + file.lastModifiedDate + file.size)
                    }
                    task.resolve(data.path)
                  },
                  function (jqXHR, textStatus, errorThrown) {
                    // 任何形式的验证失败，都触发重新上传
                    task.resolve()
                    // _this.MD5 = me.options.formData.md5 = md5('' + file.name + file.type + file.lastModifiedDate + file.size)
                  }
                  )
              })

            return task.promise()
          },
          beforeSend: function (block) {
            // console.info('beforeSend')

            // 分片验证是否已传过，用于断点续传
            var task = new $.Deferred()
            $.ajax({
              type: 'POST',
              url: _this.BASE_API + 'api/UpFile/WebGisUpFileIfMd5',
              data: {
                status: 'chunkCheck',
                chunkMD5: _this.MD5,
                chunkIndex: block.chunk,
                size: block.end - block.start,
                fileExt: block.file.ext,
                parentid: _this.folderfid
              },
              beforeSend: function (request) {
                request.setRequestHeader('ticket', _this.token)
                request.setRequestHeader('moduleid', _this.moduleid || '')
              },
              cache: false,
              // timeout: 1000, // todo 超时的话，只能认为该分片未上传过
              dataType: 'json'
            }).then(
              function (data, textStatus, jqXHR) {
                // 若存在，返回失败给WebUploader，表明该分块不需要上传
                if (data.ifExist) {
                  // console.log('已经存在分片' + data.chunkIndex)
                  task.reject()
                } else {
                  // console.log('不存在分片' + data.chunkIndex)
                  task.resolve()
                }
              },
              function (jqXHR, textStatus, errorThrown) {
                // 任何形式的验证失败，都触发重新上传
                task.resolve()
              }
              )
            return $.when(task)
          }
        }
      )
    },
    // 初始化上传
    initUpload () {
      var _this = this
      var $wrap = $('.uploader-container')
      var $queue = $('<ul class="filelist"></ul>').appendTo(
        $wrap.find('.queueList')
      )

      if (!WebUploader.Uploader.support()) {
        alert('Web Uploader 不支持您的浏览器！请更换chrome 或者360急速等浏览器')
        throw new Error(
          'WebUploader does not support the browser you are using.'
        )
      }

      this.beforesend() // 2.before-send验证 做分片验证

      // 3.初始化
      this.uploader = WebUploader.Base.create({
        swf: '../../public/webupload/js/Uploader.swf', // swf文件路径
        server: _this.BASE_API + 'api/UpFile/UpFile', // 文件接收服务端。
        pick: '#filePicker', // 选择文件的按钮。可选。 内部根据当前运行是创建，可能是input元素，也可能是flash.
        auto: true, // 自动上传选择的文件
        chunked: true,
        chunkSize: 10 * 1024 * 1024, // 默认分片5M
        headers: {
          ticket: _this.token,
          moduleid: _this.moduleid || '',
          pcbm: NewGuid() || '' // GNM 添加批次编码
        },
        compress: false, // 解决上传jpg文件出错
        formData: {
          uid: 123,
          guid: _this.GUID,
          parentid: _this.folderfid,
          yspath: '', // 原始路径
          md5: _this.MD5 // 传递md5值
        },
        prepareNextFile: true, // 是否允许在文件传输时提前把下一个文件准备好
        duplicate: true, // 去重
        // fileNumLimit: 30000,
        // threads:5,
        fileSizeLimit: 200000 * 1024 * 1024, // 200000 M
        fileSingleSizeLimit: 100000 * 1024 * 1024, // 100000 M
        resize: false // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
      })

      // 准备事件
      // this.uploader.on('ready', function () {
      //   window.uploader = _this.uploader
      // })
      // 准备事件
      this.uploader.on('beforeFileQueued', function (file) {
        console.info(file)
        return false
        if (_this.disabledBtn) {
          msg.showwarning('请在文件夹中进行上传操作')
          return false
        }
        // 选择项目必须
        if (
          (_this.xmxxSelectRow && _this.xmxxSelectRow.length == 0) ||
          (_this.xmxxRow && _this.xmxxRow.length == 0)
        ) {
          msg.showwarning('请选择项目之后再进行文件上传')
          return false
        }
        if (!_this.folderfid) {
          msg.showwarning('没有获取到文件fid')
          return false
        }
        // 保存文件夹关系入库
        
         var task = new $.Deferred()

        _this.fileQueryList.XmList = []
        _this.fileQueryList.FilesList = []
        _this.fileQueryList.XmList.push(..._this.selectxmRows)
        _this.fileQueryList.QDID = _this.curQDid

        for (var i = 0; i < files.length; i++) {
          var file = files[i]
          var fileserverpath = file.source.source.webkitRelativePath
          var fileQuery = {
            // qdid: _this.curQDid,
            filepid: _this.folderfid,
            filename: file.name,
            filesize: file.size,
            fileext: file.ext,
            // filephpath: filephpath, // 客户端物理路径
            fileserverpath: fileserverpath // 客户端物理路径
          }
          _this.fileQueryList.FilesList.push(fileQuery);
        }
        _this.loadState(true, '正在验证文档数据....')
        // 保存文件夹信息入库
        SaveFolderRelation(_this.fileQueryList).then(response => {
          _this.loadState(false, '')
          task.reject()

        }).catch(err => {
          _this.loadState(false, '')
          task.resolve()
        })
        return $.when(task)

      })

      // 单文件队列
      this.uploader.on('fileQueued', function (file) {
        _this.fileCount++ // 文件总数
        var fileext = ''
        if (
          file.ext.toLowerCase() === 'png' ||
          file.ext.toLowerCase() === 'jpg'
        ) {
          fileext = 'fileicon-small-pic'
        } else if (file.ext === 'zip' || file.ext === 'rar') {
          fileext = 'fileicon-small-zip'
        } else if (file.ext === 'exe') {
          fileext = 'fileicon-small-exe'
        } else {
          fileext = 'default-small'
        }

        var $li = $(
          '<li class="file-list" id="' +
          file.id +
          '">' +
          ' <div class="process"></div>' +
          '<div class="info">' +
          '<div class="file-name" title="' +
          file.name +
          '">' +
          '<div class="file-icon ' +
          fileext +
          '"></div>' +
          '<span class="name-text">' +
          file.name +
          '</span>' +
          '</div>' +
          '<div class="file-size">' +
          WebUploader.formatSize(file.size) +
          '</div>' +
          '<div class="file-state">' +
          '</div>' +
          '<div class="file-time"><em></em>' +
          '</div>' +
          '<div class="file-operate">' +
          '</div>' +
          '</div>' +
          '</li>'
        )

        // 将操作按钮添加到li中
        var $filestate = $li.find('.file-state')
        var $prepare = $('<span class="prepare">准备上传…</span>').appendTo(
          $filestate
        )
        var $uploading = $(
          '<span class="uploading"><em class="precent">0%</em></span>'
        ).appendTo($filestate)
        var $pause = $(
          '<span class="pause"><em></em><i>已暂停</i></span>'
        ).appendTo($filestate)
        var $cancel = $(
          '<span class="cancel"><em></em><i>已取消</i></span>'
        ).appendTo($filestate)
        var $error = $(
          '<span class="error"><em></em><i>上传失败</i></span>'
        ).appendTo($filestate)
        var $success = $(
          '<span class="success"><em></em><i style="margin-left:20px;">上传成功</i></span>'
        ).appendTo($filestate)

        var $fileoperate = $li.find('.file-operate')
        var $operatepause = $(
          '<em class="operate-pause" title="暂停"></em>'
        ).appendTo($fileoperate)
        var $operatecontinue = $(
          '<em class="operate-continue"  title="上传"></em>'
        ).appendTo($fileoperate)
        var $operateretry = $(
          '<em class="operate-retry"  title="重新上传"></em>'
        ).appendTo($fileoperate)
        var $operateremove = $(
          '<em class="operate-remove"  title="移除"></em>'
        ).appendTo($fileoperate)

        $li.appendTo($queue) // 添加ul

        _this.showState('prepare', file) // ==========准备上传
        // 点击上传
        $operatecontinue.on('click', function () {
          _this.uploader.upload(file)
        })
        // 点击暂停
        $operatepause.on('click', function () {
          _this.uploader.stop(file)
          _this.showState('pause', file) // 已暂停
        })
        // 移除文件
        $operateremove.on('click', function () {
          _this.uploader.removeFile(file)
        })

        // 文件状态监听
        file.on('statuschange', function (cur, prev) {
          if (cur === 'error' || cur === 'invalid') {
          } else if (cur === 'interrupt') {
            var $li = $('#' + file.id)
            $li
              .find('.operate-retry')
              .show()
              .siblings()
              .hide()
          }
        })

        file.setStatus('queued') // 已经进入队列, 等待上传
      })
      // 事件0 当一批文件添加进队列以后触发 当有文件添加进来时执行，负责view的创建
      this.uploader.on('filesQueued', function (files) {
        console.info(files)
        if (!_this.isshow) {
          _this.isshow = true
        }       
      })

      // 文件开始上传前触发--文件开始上传记录时间
      this.uploader.on('uploadStart', function (file) {
        file.scsj = new Date() // 文件的上传时间
      })

      // 事件1 上传过程中触发，携带上传进度
      this.uploader.on('uploadProgress', function (file, percentage) {
        var t = (new Date() - file.scsj) / 1000 // 用时秒数
        var s = file.size * percentage / t
        var speend = WebUploader.formatSize(s) // 平均速度
        var lastt = parseInt(file.size * (1 - percentage) / s) // 剩余秒数
        _this.showState('uploading', file, percentage, speend, lastt) // 上传中
      })

      // 事件2 当文件被移除队列后触发
      this.uploader.on('fileDequeued', function (file) {
        _this.fileCount--
        if (!_this.fileCount) {
        }
        var $li = $('#' + file.id)
        $li.remove()
      })

      // 事件6 当文件上传成功时触发---文件上传成功,合并文件
      this.uploader.on('uploadSuccess', function (file, response) {
        var $li = $('#' + file.id)
        $li.find('.process').css('width', 0)
        $li
          .find('.file-time')
          .find('em')
          .text('')
        if (response && response.chunked) {
          // 如果存在分片
          // todo显示合并文件中
          $.ajax({
            type: 'POST',
            url: _this.BASE_API + 'api/UpFile/ProcessRequest',
            data: {
              md5: _this.MD5,
              fileName: file.name,
              fileExt: response.f_ext || ''
            },
            beforeSend: function (request) {
              request.setRequestHeader('ticket', _this.token)
              request.setRequestHeader('moduleid', _this.moduleid || '')
            },
            cache: false,
            dataType: 'json'
          }).then(
            function (data, textStatus, jqXHR) {
              data = $.parseJSON(data)
              if (data.hasError) {
                _this.showState('hbfail', file) // 文件合并失败
              } else {
                _this.showState('succss', file) // 上传成功
                _this.isshow = true
                _this.saveXMXX(file, response.path, '2')
              }
            },
            function (jqXHR, textStatus, errorThrown) {
              // 任何形式的验证失败，都触发重新上传
              console.log(jqXHR)
            }
            )
        } else {
          // 无分片上传成功
          _this.showState('succss', file)
          $li.find('.file-operate em').hide()
          _this.isshow = true
          _this.saveXMXX(
            file,
            response === undefined ? file.serverpath : response.path,
            '3'
          )
        }
        // 重新获取下数据 uploadFinished
      })

      // 事件 不管成功或者失败，文件上传完成时触发
      this.uploader.on('uploadComplete', function (file) {
        var $li = $('#' + file.id)
        $li.find('.progress').fadeOut() // 隐藏进度条
        $li.find('.file-operate em').hide()
        // _this.uploader.removeFile(file) // 4.4
        var successnum = _this.uploader.getFiles('complete').length
        _this.showUploadMsg =
          '上传完成' + successnum + '/' + _this.uploader.getFiles().length
        _this.uploadPersent = parseInt((successnum / _this.uploader.getFiles().length) * 100)
        if (_this.uploadPersent >= 50) this.uploadColor = "#006400"
        document.querySelector('.upgroupbody').scrollTop = (successnum - 3) * 50
      })

      // 当所有文件上传结束时触发。
      this.uploader.on('uploadFinished', function () {
        // 3. 重新获取当前文件夹下的文档
        _this.$store.dispatch('SetXmDocSign', _this.query) // GNM
        _this.fileQueryList = {
          // GNM 根据新的数据格式修改
          FilesList: {},
          XmList: [],
          QDID: ''
        }
        _this.loadState(false, '')
        _this.hidedwin()
        _this.getList(_this.folderfid, -1, '')
      })

      // 时间
      this.uploader.on('error', function (type) {
        // console.log('错误类型' + type)
        if (type == 'F_DUPLICATE') {
          msg.showwarning('不能选择相同文件')
        } else if (type == 'Q_EXCEED_NUM_LIMIT') {
          msg.showwarning('添加的文件数量超出限制')
        }
      })
    },
    saveXXDOC () {
      var _this = this
      _this.fileQueryList.XmList = []
      // 上传之前，添加选择的项目、清单、批次等信息
      _this.fileQueryList.XmList.push(..._this.selectxmRows)
      _this.fileQueryList.QDID = _this.curQDid


      this.loadState(true, this.loadtb)

      // 1.保存文件流信息入库,只操作了文档库本身
      saveFileXMData(_this.fileQueryList)
        .then(response => {

        })
        .catch(err => {
          // GNM 添加错误提示及后续操作
          this.loadState(false, '')

          msg.showerror(err.message)
        })
    },
    // 保存信息入库 qdid 项目信息  文件信息
    saveXMXX (file, filephpath, index) {
      var _this = this
      // debugger
      var fileserverpath = file.source.source.webkitRelativePath
      var fileQuery = {
        // qdid: _this.curQDid,
        filepid: _this.folderfid,
        filename: file.name,
        filesize: file.size,
        fileext: file.ext,
        filephpath: filephpath, // 客户端物理路径
        fileserverpath: fileserverpath // 服务器存储的路径
      }

      _this.fileQueryList.FilesList = fileQuery // GNM 根据新的数据格式修改
      _this.saveXXDOC()
    },
    // 处理合同查询
    watchHTPage (val) {
      var _this = this
      if (val.indexOf('HT') > -1) {
        this.filelevel = []
        this.query = {
          rows: [_this.xmxxRow],
          type: 3,
          id: this.moduleid
        }
        this.curQDid = '59544ab4-f1fe-402c-9a83-aa5d63debdf2' // 合同的清单id
        this.getFileList(0, this.$route.name)
      }
    },
    // 载入时，执行默认查询
    getDefault () { },
    // 1.根据选择的项目上传文件或文件夹  cttype 穿透类型 1 添加导航数组
    // 查询文档库数据
    getFileList (cttype, name) {
      var _this = this

      if (_this.query.rows.length === 0) {
        _this.tableData = []
        // console.log('没有获取到选择行信息--243')
        msg.showwarning('没有获取到选择行信息--243') // GNM
        return false
      }

      _this.listLoading = true
      _this.query.qdid = this.curQDid // 传递
      _this.query.qdmc = this.curQDName // GNM
      // 获取配置信息
      getFileLists(_this.query)
        .then(response => {
          _this.listLoading = false

          // 添加导航数据
          if (cttype === 1) {
            _this.filelevel.push({ id: _this.folderfid, name: name })
          }
          let crntFiles = response.data
          // GNM 如果已经指定清单则对当前清单进行过滤
          if (cttype === 0 && _this.spcFolder.qdid) {
            let spcID = _this.spcFolder.qdid
            crntFiles = crntFiles.filter(item => {
              return spcID.includes(item.ID)
            })
          }
          _this.tableData = _this._setVerAndIcon(crntFiles) // GNM 完善因没有扩展名出现的BUG、添加历史版本的控制
        })
        .catch(e => {
          msg.showwarning(e.message) // GNM
          _this.listLoading = false
        })
    },
    // 返回所属清单文件夹
    getXMQDFolder (pid, data) {
      return data.filter(v => {
        if (v.PID === pid) return v
      })
    },
    // 表格数据行双击事件
    rowdblclick (row, event) {
      this.gonext(row)
    },
    // 打开文件夹下级
    gonext (row) {
      if (row.TYPE == '0') {
        // 文件夹穿透
        // 赋值当前清单id
        if ($.inArray(row.ID, this.rootIds) > -1) {
          this.curQDid = row.ID
          this.curQDName = row.MC // GNM
        }
        this.getList(row.ID, 1, row.MC)
      } else {
        // 文件下载
      }
    },
    // 获取数据
    getList (id, cttype, name) {
      this.folderfid = id

      if (id) {
        this.query.id = id
        this.query.name = name
      }
      this.getFileList(cttype, name)
    },
    // 返回n层
    goLastnfile (level) {
      if (level === -1) {
        this.filelevel = []
        this.query.id = this.moduleid
        this.query.name = this.$route.name
        this.getFileList(0, this.$route.name)
      } else {
        this.filelevel = _.dropRight(this.filelevel, level) // 删除n层
        if (this.filelevel && this.filelevel.length > 0) {
          var lastfilelevel = _.last(this.filelevel) // 获取当前row
          this.getList(lastfilelevel.id, -1, lastfilelevel.name)
        } else {
          this.query.id = this.moduleid
          this.query.name = this.$route.name
          this.getFileList(0, this.$route.name)
        }
      }
    },

    // 上传完毕隐藏处理
    hidedwin () {
      this.isshow = false
      this.fileCount = 0

      var allfiles = this.uploader.getFiles()
      if (allfiles.length > 0) {
        for (var i = 0; i < allfiles.length; i++) {
          this.uploader.removeFile(allfiles[i])
        }
      }
      this.uploader.reset()
    },
    tooglewin () {
      this.isshow = !this.isshow
    },
    // 更改状态
    showState (state, file, percentage, speed, lasttime) {
      var _this = this
      var $li = $('#' + file.id)
      $li.find('.file-operate em').hide() // 隐藏操作按钮

      switch (state) {
        case 'prepare': // 准备上传
          $li.find('.operate-continue,.operate-remove').show() // 上传 移除按钮
          $li
            .find('.file-state .prepare')
            .show()
            .siblings()
            .hide()
          break
        case 'prepare': // 上传中
          $li.find('.operate-continue,.operate-remove').show() // 上传 移除按钮
          $li
            .find('.file-state .prepare')
            .show()
            .siblings()
            .hide()
          break
        case 'pause': // 暂停
          $li.find('.operate-continue,.operate-remove').show() // 上传 移除按钮
          $li
            .find('.file-state .pause')
            .show()
            .siblings()
            .hide()
          break
        case 'succss':
          $li
            .find('.file-state .success')
            .show()
            .siblings()
            .hide()
          $li
            .find('.file-state .success')
            .find('i')
            .text('上传成功')
          break
        case 'mcsuccss':
          $li
            .find('.file-state .success')
            .show()
            .siblings()
            .hide()
          $li
            .find('.file-state .success')
            .find('i')
            .text('秒传')
          break
        case 'hbfail':
          $li
            .find('.file-state .error')
            .show()
            .siblings()
            .hide()
          $li
            .find('.file-state .error')
            .find('i')
            .text('文件合并失败')
          break
        case 'uploading':
          var n = parseInt(percentage * 100) + '%'
          var $percent = $li.find('.process')

          $percent.css('width', n) // 进度条
          var time = _this.formatSeconds(lasttime)
          $li.find('.operate-pause,.operate-remove').show() // 暂停按钮
          $li
            .find('.file-state .uploading')
            .show()
            .siblings()
            .hide()
          $li
            .find('.file-state .uploading')
            .find('em')
            .text(n + '(' + speed + '/S)')
          $li
            .find('.file-time')
            .find('em')
            .text(time)
          break
      }
    },
    formatSeconds (value) {
      var theTime = parseInt(value) // 秒
      var theTime1 = 0 // 分
      var theTime2 = 0 // 小时
      if (theTime > 60) {
        theTime1 = parseInt(theTime / 60)
        theTime = parseInt(theTime % 60)
        if (theTime1 > 60) {
          theTime2 = parseInt(theTime1 / 60)
          theTime1 = parseInt(theTime1 % 60)
        }
      }
      var result = '' + parseInt(theTime) + '秒'
      if (theTime1 > 0) {
        result = '' + parseInt(theTime1) + '分' + result
      }
      if (theTime2 > 0) {
        result = '' + parseInt(theTime2) + '小时' + result
      }
      return result
    },
    // 删除历史版本数据
    delVer (selectrow) {
      this.selectRows.push(selectrow)
      this.delrow('ver')
    },
    // 删除一般文件数据
    delrow (deltype) {
      var _this = this
      if (this.selectRows.length === 0) {
        msg.showwarning('您还未选择任何数据')
        return false
      }
      if (deltype !== 'ver') {
        // 在删除一般文件时，要考虑是否同时删除相应历史版本
        this.$confirm('是否同时删除相应历史版本？', '删除提示', {
          confirmButtonText: '一起删除',
          cancelButtonText: '只删除当前版本',
          type: 'warning'
        })
          .then(() => {
            // 现在还有个问题，如果是文件夹下的数据怎么办？
            let tmpVer = []
            _this.selectRows.forEach(item => {
              if (item.VER) {
                // 说明当前文件有历史版本，则将历史版本数据添加到当前的删除数据中
                tmpVer.push(...this.getVerData(item.MC))
              }
            })
            _this.selectRows.push(...tmpVer)
            this.delAction()
          })
          .catch(() => {
            if (err !== 'cancel') msg.showwarning(err.message)
            else this.delAction()
          })
      } else {
        // 单纯删除历史版本
        this.$confirm('你确定要删除吗？', '删除提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.delAction()
          })
          .catch(err => {
            if (err !== 'cancel') msg.showwarning(err.message)
          })
      }
    },
    // 删除实际文件
    delAction () {
      // 删除数据
      let _this = this
      msg.showloading('正在删除,请稍后...')

      dropFile({ qdid: _this.curQDid, xmRows: _this.xmxxRow, fileRows: _this.selectRows }).then(response => {
        _.forEach(_this.selectRows, function (value) {
          // 若一个参数，返回的便是其value值
          _this.tableData = _.remove(_this.tableData, function (data) {
            return data.ID != value.ID
          })
        })
        // 删除成功
        msg.showsuccess('删除成功')
      })
    },
    // check行事件
    selectRow (selection, row) {
      this.selectRows = selection
    },
    // check所有行事件
    selectallRow (selection) {
      this.selectRows = selection
    },
    // 根据传过来的数据，添加历史版本标识
    // 注意，显示的是最新的文件，所以SQL中要进行文件名、时间排序
    _setVersionSign (docObjects) {
      if (docObjects === undefined) return
      let verData = _.difference(docObjects, _.uniqBy(docObjects, 'MC'))
      let crntNames = []
      // 针对有历史版本的文件，对要显示的记录进行标识
      for (let item of verData) {
        if (!crntNames.includes(item.MC)) {
          let rIndex = _.findIndex(docObjects, item)
          docObjects[rIndex - 1].VER = true //要显示的文件是前一个
          crntNames.push(item.MC)
        }
      }
    },
    // 设置图标
    _setVerAndIcon (data) {
      var _this = this
      if (data.length == 0) return []
      this._setVersionSign(data)
      return data.map(v => {
        // 获取根级清单id存储
        if (v.PID == _this.moduleid) {
          _this.rootIds.push(v.ID)
          _this.rootIds = _.uniq(_this.rootIds) // 去重
        }

        v.iconClass = this._getIconClass(v.TYPE, v.WJLX)
        return v
      })
    },
    // 返回相应的icon类
    _getIconClass (type, wjlx) {
      var iconClass = ''
      if (type === '0') {
        iconClass = 'dir-small'
      } else if (type === '1' && wjlx) {
        switch (wjlx.toLowerCase()) {
          case 'exe':
            iconClass = 'dir-exe'
            break
          case 'zip':
          case 'rar':
            iconClass = 'dir-zip'
            break
          case 'xls':
          case 'xlsx':
            iconClass = 'dir-excel'
            break
          case 'ppt':
          case 'pptx':
            iconClass = 'dir-ppt'
            break
          case 'doc':
          case 'docx':
            iconClass = 'dir-doc'
            break
          case 'png':
          case 'gif':
          case 'jpg':
            iconClass = 'dir-pic'
            break
          default:
            iconClass = 'dir-other'
            break
        }
      } else {
        iconClass = 'dir-other'
      }

      return iconClass
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import url("../../public/webupload/js/style.scss");

.filecion {
  width: 26px;
  height: 26px;
  position: absolute;
  left: 10px;
  top: 5px;
}
.span-title {
  margin-left: 30px;
  cursor: pointer;
}

.span-title:hover {
  color: #4287ed;
}
.dir-small {
  background: url(../../public/images/Folder.png) center no-repeat;
}

.dir-zip {
  background: url(../../public/images/zip.png) center no-repeat;
}

.dir-pic {
  background: url(../../public/images/pic.png) center no-repeat;
}

.dir-exe {
  background: url(../../public/images/exe.png) center no-repeat;
}

.dir-other {
  background: url(../../public/images/misc.png) center no-repeat;
}
.dir-excel {
  background: url(../../public/images/excel.png) center no-repeat;
}
.dir-doc {
  background: url(../../public/images/word.png) center no-repeat;
}
.dir-ppt {
  background: url(../../public/images/ppt.png) center no-repeat;
}

.toptext {
  padding-left: 10px;
  width: 100%;
  background-color: #fff;
  height: 25px;
  line-height: 25px;
  font-size: 14px;
  color: #666;
  position: relative;
  .toptext-l {
    display: block;
    float: left;
  }
  .toptext-l1 {
    color: #4287ed;
    cursor: pointer;
    position: absolute;
    top: -4px;
    left: 140px;
  }

  .toptextshow {
    display: none;
    cursor: pointer;
  }
  .toptext-r {
    position: absolute;
    right: 20px;
    position: absolute;
    top: -4px;
    float: right;
  }
}
ul,
li,
ol {
  list-style: none;
}

.FuIxtL {
  height: 25px;
  line-height: 25px;
  margin: 0;
  padding: 0;
  position: absolute;
  top: -4px;
}

.FuIxtL li {
  float: left;
}

.FuIxtL li a {
  padding: 0 5px;
}
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  background-color: #fff;
}

.uploadlist {
  display: flex;
  width: 750px;
  box-sizing: border-box;
  border-radius: 4px;
  position: fixed;
  right: 5px;
  bottom: 5px;
  background-color: #fff;
  // overflow: hidden;
  opacity: 1;
  // align-items: center;
  transition: opacity 0.2s;
  z-index: 30000;
  border-top-left-radius: 7px;
  border-top-right-radius: 7px;
  border: 1px solid #e2e2e2;
  box-shadow: 0 0 10px #ccc;
  flex-direction: column;
  .uphead {
    height: 40px;
    line-height: 40px;
    display: block;
    // background-color: red;
    width: 700px;
    cursor: pointer;
  }
  .upgroupbody {
    position: relative;
    overflow: hidden;
    overflow-y: auto;
    height: 349px;
    font-size: 12px;
    .uploader-list-header {
      font-size: 13px;
    }
  }
}
</style>
