var MD5 = null; //声明MD5
/**
* webupload控件初始化
* 事件绑定
* ajax请求
* 事件处理
*/
(function ($) {
    // 当domReady的时候开始初始化
    $(function () {
        var host = "http://localhost:58949/api/";

        var $wrap = $('#uploader'),

            // 文件容器
            $queue = $('<ul class="filelist"></ul>')
                .appendTo($wrap.find('.queueList')),

            // 状态栏，包括进度和控制按钮
            $statusBar = $wrap.find('.statusBar'),

            // 文件总体选择信息。
            $info = $statusBar.find('.info'),

            // 上传按钮
            $upload = $wrap.find('.uploadBtn'),

            // 没选择文件之前的内容。
            $placeHolder = $wrap.find('.placeholder'),

            $progress = $statusBar.find('.progress').hide(),

            // 添加的文件数量
            fileCount = 0,

            // 添加的文件总大小
            fileSize = 0,

            // 优化retina, 在retina下这个值是2
            ratio = window.devicePixelRatio || 1,

            // 缩略图大小
            thumbnailWidth = 110 * ratio,
            thumbnailHeight = 110 * ratio,

            // 可能有pedding, ready, uploading, confirm, done.
            state = 'pedding',

            // 所有文件的进度信息，key为file id
            percentages = {},
            // 判断浏览器是否支持文件的base64
            isSupportBase64 = (function () {
                var data = new Image();
                var support = true;
                data.onload = data.onerror = function () {
                    if (this.width != 1 || this.height != 1) {
                        support = false;
                    }
                }
                data.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
                return support;
            })(),

            // 检测是否已经安装flash，检测flash的版本
            flashVersion = (function () {
                var version;

                try {
                    version = navigator.plugins['Shockwave Flash'];
                    version = version.description;
                } catch (ex) {
                    try {
                        version = new ActiveXObject('ShockwaveFlash.ShockwaveFlash')
                                .GetVariable('$version');
                    } catch (ex2) {
                        version = '0.0';
                    }
                }
                version = version.match(/\d+/g);
                return parseFloat(version[0] + '.' + version[1], 10);
            })(),

            supportTransition = (function () {
                var s = document.createElement('p').style,
                    r = 'transition' in s ||
                            'WebkitTransition' in s ||
                            'MozTransition' in s ||
                            'msTransition' in s ||
                            'OTransition' in s;
                s = null;
                return r;
            })(),
            // WebUploader实例
            uploader,
            GUID = WebUploader.Base.guid(); //当前页面是生成的GUID作为标示

        //浏览器判断
        if (!WebUploader.Uploader.support('flash') && WebUploader.browser.ie) {

            // flash 安装了但是版本过低。
            if (flashVersion) {
                (function (container) {
                    window['expressinstallcallback'] = function (state) {
                        switch (state) {
                            case 'Download.Cancelled':
                                alert('您取消了更新！')
                                break;

                            case 'Download.Failed':
                                alert('安装失败')
                                break;

                            default:
                                alert('安装已成功，请刷新！');
                                break;
                        }
                        delete window['expressinstallcallback'];
                    };

                    var swf = './expressInstall.swf';
                    // insert flash object
                    var html = '<object type="application/' +
                            'x-shockwave-flash" data="' + swf + '" ';

                    if (WebUploader.browser.ie) {
                        html += 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ';
                    }

                    html += 'width="100%" height="100%" style="outline:0">' +
                        '<param name="movie" value="' + swf + '" />' +
                        '<param name="wmode" value="transparent" />' +
                        '<param name="allowscriptaccess" value="always" />' +
                    '</object>';

                    container.html(html);

                })($wrap);

                // 压根就没有安转。
            } else {
                $wrap.html('<a href="http://www.adobe.com/go/getflashplayer" target="_blank" border="0"><img alt="get flash player" src="http://www.adobe.com/macromedia/style_guide/images/160x41_Get_Flash_Player.jpg" /></a>');
            }

            return;
        } else if (!WebUploader.Uploader.support()) {
            alert('Web Uploader 不支持您的浏览器！');
            return;
        } 

        /**
         * method:before-send
         * 在分片发送之前request，可以用来做分片验证，如果此分片已经上传成功了，可返回一个rejected promise来跳过此分片上传
         * para:block: 分片对象
         */
        WebUploader.Uploader.register({
            'before-send-file': 'beforeSendFile',
            'before-send': 'beforeSend'
        },
        {
            beforeSendFile: function (file) {
                //秒传验证
                var task = new $.Deferred();
                var start = new Date().getTime();
                MD5 = md5('' + file.name + file.type + file.lastModifiedDate + file.size);
                console.log(MD5);
                (new WebUploader.Uploader()).md5File(file, 0, 10 * 1024 * 1024).progress(function (percentage) {
                    console.log(percentage);
                }).then(function (val) {
                    console.log("总耗时: " + ((new Date().getTime()) - start) / 1000);
                    $.ajax({
                        type: "POST"
                        , url: host + 'UpFile/WebGisUpFileIfMd5'
                        , data: {
                            
                                status: "md5Check"
                                , md5: MD5
                                , fileExt: file.ext
                                , fileName: file.name
                            
                        }
                        , cache: false
                        , timeout: 1000 //todo 超时的话，只能认为该文件不曾上传过
                        , dataType: "json"
                    }).then(function (data, textStatus, jqXHR) {
                        if (data.ifExist) {   //若存在，这返回失败给WebUploader，表明该文件不需要上传
                            console.log("已经存在的文件不做上传操作 do Something.....")
                          
                            task.reject();
                            uploader.skipFile(file);
                            //file.path = data.path;
                            //UploadComlate(file);
                            updateStatus();
                        } else {
                            task.resolve();
                            //拿到上传文件的唯一名称，用于断点续传
                            MD5 = md5('' + file.name + file.type + file.lastModifiedDate + file.size);
                            //$.cookie('file_md5', MD5);
                        }
                    }, function (jqXHR, textStatus, errorThrown) {    //任何形式的验证失败，都触发重新上传
                        task.resolve();
                        //拿到上传文件的唯一名称，用于断点续传
                        MD5 = md5('' + file.name + file.type + file.lastModifiedDate + file.size);
                        //$.cookie('file_md5', MD5);
                    });
                });
                return $.when(task);
            },
            beforeSend: function (block) {
                //分片验证是否已传过，用于断点续传
                var task = new $.Deferred();
                $.ajax({
                    type: "POST"
                    , url: host + 'UpFile/WebGisUpFileIfMd5'
                    , data: {
                       
                            status: "chunkCheck",
                            chunkMD5: MD5,
                            chunkIndex: block.chunk,
                            size: block.end - block.start,
                            fileExt: block.file.ext
                        
                    }
                    , cache: false
                    , timeout: 1000 //todo 超时的话，只能认为该分片未上传过
                    , dataType: "json"
                }).then(function (data, textStatus, jqXHR) {
                    if (data.ifExist) {   //若存在，返回失败给WebUploader，表明该分块不需要上传
                        console.log("已经存在分片" + data.chunkIndex);
                        task.reject();
                    } else {
                        console.log("不存在分片" + data.chunkIndex);
                        task.resolve();
                    }
                }, function (jqXHR, textStatus, errorThrown) {    //任何形式的验证失败，都触发重新上传
                    task.resolve();
                });

                return $.when(task);
            }
        });


        // 实例化
        uploader = WebUploader.create({
            pick: {
                id: '#filePicker',
                label: '点击选择文件'
            },
            formData: {
                uid: 123
            },
            dnd: '#dndArea',
            paste: '#uploader',
            swf: '../ex_src/image/Uploader.swf',
            chunked: true,
            chunkSize: 10 * 1024 * 1024,
            //sendAsBinary:true,
            server: host + 'UpFile/UpFile',
            // runtimeOrder: 'flash',

            // accept: {
            //     title: 'Images',
            //     extensions: 'gif,jpg,jpeg,bmp,png',
            //     mimeTypes: 'image/*'
            // },

            // 禁掉全局的拖拽功能。这样不会出现文件拖进页面的时候，把文件打开。
            disableGlobalDnd: true,
            formData: { guid: GUID },
            fileNumLimit: 300,
            fileSizeLimit: 200000 * 1024 * 1024,    // 200000 M
            fileSingleSizeLimit: 100000 * 1024 * 1024    // 100000 M
        });

        // 拖拽时不接受 js, txt 文件。
        uploader.on('dndAccept', function (items) {
            var denied = false,
                len = items.length,
                i = 0,
                // 修改js类型
                unAllowed = 'text/plain;application/javascript ';

            for (; i < len; i++) {
                // 如果在列表里面
                if (~unAllowed.indexOf(items[i].type)) {
                    denied = true;
                    break;
                }
            }

            return !denied;
        });

        // uploader.on('filesQueued', function() {
        //     uploader.sort(function( a, b ) {
        //         if ( a.name < b.name )
        //           return -1;
        //         if ( a.name > b.name )
        //           return 1;
        //         return 0;
        //     });
        // });

        // 添加“添加文件”的按钮，
        uploader.addButton(
            {
                id: '#filePicker2',
                label: '继续添加'
            });


        uploader.on('ready', function () {
            window.uploader = uploader;
        });

        // 当有文件添加进来时执行，负责view的创建
        function addFile(file) {
            var $li = $('<li id="' + file.id + '">' +
                    '<p class="title">' + file.name + '</p>' +
                    '<p class="imgWrap"></p>' +
                    '<p class="progress"><span></span></p>' +
                    '</li>'),

                $btns = $('<div class="file-panel">' +
                    '<span class="cancel">删除</span>' +
                    '<span class="rotateRight">向右旋转</span>' +
                    '<span class="rotateLeft">向左旋转</span></div>').appendTo($li),
                $prgress = $li.find('p.progress span'),
                $wrap = $li.find('p.imgWrap'),
                $info = $('<p class="error"></p>'),

                showError = function (code) {
                    switch (code) {
                        case 'exceed_size':
                            text = '文件大小超出';
                            break;

                        case 'interrupt':
                            text = '上传暂停';
                            break;

                        default:
                            text = '上传失败，请重试';
                            break;
                    }

                    $info.text(text).appendTo($li);
                };

            if (file.getStatus() === 'invalid') {
                showError(file.statusText);
            } else {
                // @todo lazyload
                $wrap.text('预览中');
                uploader.makeThumb(file, function (error, src) {
                    var img;

                    if (error) {
                        $wrap.text('不能预览');
                        return;
                    }

                    if (isSupportBase64) {
                        img = $('<img src="' + src + '">');
                        $wrap.empty().append(img);
                    } else {
                        $.ajax('暂时没写', {
                            method: 'POST',
                            data: src,
                            dataType: 'json'
                        }).done(function (response) {
                            if (response.result) {
                                img = $('<img src="' + response.result + '">');
                                $wrap.empty().append(img);
                            } else {
                                $wrap.text("预览出错");
                            }
                        });
                    }
                }, thumbnailWidth, thumbnailHeight);

                percentages[file.id] = [file.size, 0];
                file.rotation = 0;
            }

            file.on('statuschange', function (cur, prev) {
                if (prev === 'progress') {
                    $prgress.hide().width(0);
                } else if (prev === 'queued') {
                    $li.off('mouseenter mouseleave');
                    $btns.remove();
                }

                // 成功
                if (cur === 'error' || cur === 'invalid') {
                    console.log(file.statusText);
                    if (!file.statusText == "") {
                        showError(file.statusText);
                        percentages[file.id][1] = 1;
                    }

                } else if (cur === 'interrupt') {
                    showError('interrupt');
                } else if (cur === 'queued') {
                    percentages[file.id][1] = 0;
                } else if (cur === 'progress') {
                    $info.remove();
                    $prgress.css('display', 'block');
                } else if (cur === 'complete') {
                    $li.append('<span class="success"></span>');
                }

                $li.removeClass('state-' + prev).addClass('state-' + cur);
            });

            $li.on('mouseenter', function () {
                $btns.stop().animate({ height: 30 });
            });

            $li.on('mouseleave', function () {
                $btns.stop().animate({ height: 0 });
            });

            $btns.on('click', 'span', function () {
                var index = $(this).index(),
                    deg;

                switch (index) {
                    case 0:
                        uploader.removeFile(file);
                        return;

                    case 1:
                        file.rotation += 90;
                        break;

                    case 2:
                        file.rotation -= 90;
                        break;
                }

                if (supportTransition) {
                    deg = 'rotate(' + file.rotation + 'deg)';
                    $wrap.css({
                        '-webkit-transform': deg,
                        '-mos-transform': deg,
                        '-o-transform': deg,
                        'transform': deg
                    });
                } else {
                    $wrap.css('filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation=' + (~~((file.rotation / 90) % 4 + 4) % 4) + ')');
                    // use jquery animate to rotation
                    // $({
                    //     rotation: rotation
                    // }).animate({
                    //     rotation: file.rotation
                    // }, {
                    //     easing: 'linear',
                    //     step: function( now ) {
                    //         now = now * Math.PI / 180;

                    //         var cos = Math.cos( now ),
                    //             sin = Math.sin( now );

                    //         $wrap.css( 'filter', "progid:DXImageTransform.Microsoft.Matrix(M11=" + cos + ",M12=" + (-sin) + ",M21=" + sin + ",M22=" + cos + ",SizingMethod='auto expand')");
                    //     }
                    // });
                }


            });

            $li.appendTo($queue);
        }

        // 负责view的销毁
        function removeFile(file) {
            var $li = $('#' + file.id);

            delete percentages[file.id];
            updateTotalProgress();
            $li.off().find('.file-panel').off().end().remove();
        }

        function updateTotalProgress() {
            var loaded = 0,
                total = 0,
                spans = $progress.children(),
                percent;

            $.each(percentages, function (k, v) {
                total += v[0];
                loaded += v[0] * v[1];
            });

            percent = total ? loaded / total : 0;


            spans.eq(0).text(Math.round(percent * 100) + '%');
            spans.eq(1).css('width', Math.round(percent * 100) + '%');
            updateStatus();
        }

        function updateStatus() {
            var text = '', stats;

            if (state === 'ready') {
                text = '选中' + fileCount + '个文件，共' +
                        WebUploader.formatSize(fileSize) + '。';
            } else if (state === 'confirm') {
                stats = uploader.getStats();
                if (stats.uploadFailNum) {
                    text = '已成功上传' + stats.successNum + '个文件至服务器，' +
                        stats.uploadFailNum + '个文件上传失败，<a class="retry" href="#">重新上传</a>失败文件或<a class="ignore" href="#">忽略</a>'
                }

            } else {
                stats = uploader.getStats();
                text = '共' + fileCount + '个（' +
                        WebUploader.formatSize(fileSize) +
                        '），已上传' + stats.successNum + '个';

                if (stats.uploadFailNum) {
                    text += '，失败' + stats.uploadFailNum + '个';
                }
            }

            $info.html(text);
        }

        function setState(val) {
            var file, stats;

            if (val === state) {
                return;
            }

            $upload.removeClass('state-' + state);
            $upload.addClass('state-' + val);
            state = val;

            switch (state) {
                case 'pedding':
                    $placeHolder.removeClass('element-invisible');
                    $queue.hide();
                    $statusBar.addClass('element-invisible');
                    uploader.refresh();
                    break;

                case 'ready':
                    $placeHolder.addClass('element-invisible');
                    $('#filePicker2').removeClass('element-invisible');
                    $('#filePicker3').removeClass('element-invisible');
                    $queue.show();
                    $statusBar.removeClass('element-invisible');
                    uploader.refresh();
                    break;

                case 'uploading':
                    $('#filePicker2').addClass('element-invisible');
                    $('#filePicker3').addClass('element-invisible');
                    $progress.show();
                    $upload.text('暂停上传');
                    break;

                case 'paused':
                    $progress.show();
                    $upload.text('继续上传');
                    break;

                case 'confirm':
                    $progress.hide();
                    $('#filePicker2').removeClass('element-invisible');
                    $upload.text('开始上传');

                    stats = uploader.getStats();
                    if (stats.successNum && !stats.uploadFailNum) {
                        setState('finish');
                        return;
                    }
                    break;
                case 'finish':
                    stats = uploader.getStats();
                    if (stats.successNum) {
                        console.log("上传成功");
                    } else {
                        // 没有成功的文件，重设
                        state = 'done';
                        location.reload();
                    }
                    break;
            }

            updateStatus();
        }

        uploader.onUploadProgress = function (file, percentage) {
            var $li = $('#' + file.id),
                $percent = $li.find('.progress span');

            $percent.css('width', percentage * 100 + '%');
            percentages[file.id][1] = percentage;
            updateTotalProgress();
        };

        uploader.onFileQueued = function (file) {
            fileCount++;
            fileSize += file.size;

            if (fileCount === 1) {
                $placeHolder.addClass('element-invisible');
                $statusBar.show();
            }

            addFile(file);
            setState('ready');
            updateTotalProgress();
        };

        uploader.onFileDequeued = function (file) {
            fileCount--;
            fileSize -= file.size;

            if (!fileCount) {
                setState('pedding');
            }

            removeFile(file);
            updateTotalProgress();

        };
        uploader.onload

        uploader.on('all', function (type) {
            var stats;
            switch (type) {
                case 'uploadFinished':
                    setState('confirm');
                    break;

                case 'startUpload':
                    setState('uploading');
                    break;

                case 'stopUpload':
                    setState('paused');
                    break;

            }
        });

        // 文件上传成功,合并文件。
        uploader.on('uploadSuccess', function (file, response) {
            if (!response) {
                return;
            }
            console.log(JSON.parse(response));
            if (JSON.parse(response).chunked) { //如果存在分片
                $.ajax({
                    type: "POST"
                      , url: host + 'UpFile/ProcessRequest'
                      , data: {
                        md5: MD5, fileName: file.name, fileExt: JSON.parse(response).f_ext 
                      }
                      , cache: false
                      , dataType: "json"
                }).then(function (data, textStatus, jqXHR) {
                    data = $.parseJSON(data);
                    if (data.hasError) {
                        alert('文件合并失败！');
                    } else {
                        console.log("合并完成do Something...");

                    }

                }, function (jqXHR, textStatus, errorThrown) {    //任何形式的验证失败，都触发重新上传
                    console.log(jqXHR);
                });

            }
            else {
                var data = JSON.parse(response);
            }
        });

        uploader.onError = function (code) {
            alert('Eroor: ' + code);
        };

        $upload.on('click', function () {
            if ($(this).hasClass('disabled')) {
                return false;
            }

            if (state === 'ready') {
                uploader.upload();
            } else if (state === 'paused') {
                uploader.upload();
            } else if (state === 'uploading') {
                uploader.stop(true);
            }
        });

        $info.on('click', '.retry', function () {
            uploader.retry();
        });

        $info.on('click', '.ignore', function () {
            alert('todo');
        });

        $upload.addClass('state-' + state);
        updateTotalProgress();
    });

})(jQuery);