/**
 * Created by GiangBeo on 5/23/16.
 */
/**
 * Created by tientm on 12/27/13.
 */
var NameSpace = Registry.get('namespace_delivery').toUpperCase();
(function (window, NameSpace, undefined) {
    var RESOURCE_WIDGET_DESK = 1006,
        RESOURCE_WIDGET_MOBI_APP = 1007,
        RESOURCE_WIDGET_MOBI_WEB = 1023,
        RESOURCE_BANNER_DESK_COM = 1008,
        RESOURCE_BANNER_DESK_UNCOM = 1009,
        RESOURCE_BANNER_MOBI_APP_COM = 1010,
        RESOURCE_BANNER_MOBI_APP_UNCOM = 1011,
        RESOURCE_BANNER_MOBI_WEB_COM = 1024,
        RESOURCE_BANNER_MOBI_WEB_UNCOM = 1025,
        RESOURCE_VIDEO_DESK_COM = 1012,
        RESOURCE_VIDEO_DESK_UNCOM = 1013,
        RESOURCE_VIDEO_MOBI_APP_COM = 1014,
        RESOURCE_VIDEO_MOBI_APP_UNCOM = 1015,
        RESOURCE_VIDEO_MOBI_WEB_COM = 1026,
        RESOURCE_VIDEO_MOBI_WEB_UNCOM = 1027,
        CREATIVE_FORMAT_WIDGET_PRICE = 1,
        CREATIVE_FORMAT_WIDGET_CONTEXTUAL = 2,
        CREATIVE_FORMAT_WIDGET_TEXT = 3,
        CREATIVE_FORMAT_WIDGET_INLINE_BOX = 4,
        CREATIVE_FORMAT_WIDGET_SPONSOR = 5,
        CREATIVE_FORMAT_EXTERNAL = 6,
        CREATIVE_FORMAT_FLASH = 7,
        CREATIVE_FORMAT_IMAGE = 8,
        CREATIVE_FORMAT_VIDEO = 9,
        CREATIVE_FORMAT_ADBUILDER = 15,
        CREATIVE_FORMAT_BRANDBUILDER = 16,
        CREATIVE_FORMAT_DYNAMIC = 17,
        CREATIVE_FORMAT_FILE = 18,
        CREATIVE_FORMAT_TEMPLATE = 20,
        CREATIVE_FORMAT_GOOGLE_EXCHANGE = 12,
        CREATIVE_FORMAT_LINEAR = 21,
        CREATIVE_FORMAT_OVERLAY = 22,
        CREATIVE_FORMAT_WRAPPER = 23,
        CREATIVE_FORMAT_HTML5 = 24,
        VIDEO_TYPE_PREROLL = 1,
        VIDEO_TYPE_MIDROLL = 2,
        VIDEO_TYPE_POSTROLL = 3,
        resource_video = [RESOURCE_VIDEO_DESK_COM,RESOURCE_VIDEO_DESK_UNCOM,RESOURCE_VIDEO_MOBI_APP_COM,RESOURCE_VIDEO_MOBI_APP_UNCOM,RESOURCE_VIDEO_MOBI_WEB_COM,RESOURCE_VIDEO_MOBI_WEB_UNCOM],
        btn_preview = '<a id="show-demo" style="font-size: 16px;position: absolute;left: -30px;top: -25px;z-index: 100;" href="javascript:;"><img style="width:80px" src="data:image/png;base64,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"/> Xem thá»±c táº¿ </span></a>'
        ;

    function preview(creativeOracle, params, selector) {
        var allow_size = [
            '980x90',
            '728x90',
            '300x250',
            '300x300',
            '300x600',
            '160x600',
            '120x600'
        ];

        try {
            var creative = transform(creativeOracle),
                creative_files = creativeOracle.files ? JSON.parse(creativeOracle.files) : {},
                creative_properties = creativeOracle.properties ? JSON.parse(creativeOracle.properties) : {},
                sizes = creative_properties.sizes,
                html = '',
                defaultParams = {format: 'classic', height: 125, width: 300};

            if (creative_properties['templates'] != undefined) {
                var template_id = creative_properties['templates'];
                allow_size.push('534-120');
                allow_size.push('468-250');
                allow_size.push('640-360');
                // if(template_id.match(/nguyen-kim|hoang-phuc|lazada|deca|baza|tiki|zanado|fpt|fpt-02|job-cb|cung-mua|ecom-beauty|ecom-baby/g) ||
                //     template_id.match(/thumb-showcase/g)){
                //     allow_size.push('534-120');
                //     allow_size.push('468-250');
                //     allow_size.push('640-360');
                // }
            }

            // overloading
            if (typeof params == 'string') {
                selector = params;
                params = defaultParams;
            }

            if (sizes) {
                width = sizes.split('x')[0];
                height = sizes.split('x')[1];
            }

            if (creative.isWidget == true) {
                html1 = window[NameSpace+'preview'](creative, params);
                html = html1.innerHTML ;

            } else {
                var swf_file = STATIC_URL + '/js/library/fptplayer.swf';
                switch (+creative.format) {
                    case CREATIVE_FORMAT_WIDGET_INLINE_BOX:
                        html = '<a target="_blank" href="' + creative.click_url + '"><img src="' + ST_URL_UPLOAD + '/' + creative_files.image[0].url + '"/></a>';
                        break;
                    case CREATIVE_FORMAT_WIDGET_SPONSOR:
                        html = '<a target="_blank" href="' + creative.click_url + '"><img src="' + ST_URL_UPLOAD + '/' + creative_files.image[0].url + '"/></a>';
                        break;
                    case CREATIVE_FORMAT_EXTERNAL:
                        break;
                    case CREATIVE_FORMAT_FLASH:
                        html = '<object width="'+ width +'" height="' + height + '" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0">' +
                            '<param name="SRC" value="' + ST_URL_UPLOAD + '/' + creative_files.flash[0].url + '?clickTAG='+ creative.click_url +'">' +
                            '<param name="allowScriptAccess" value="always">' +
                            '<param name="quality" value="high">' +
                            '<param name="bgcolor" value="#000000">' +
                            '<param name="wmode" value="transparent">' +
                            '<embed src="' + ST_URL_UPLOAD + '/' +  creative_files.flash[0].url + '?clickTAG='+ creative.click_url +'" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" play="true" loop="true" wmode="transparent" allowscriptaccess="always" width="'+ width +'" height="' + height + '"></embed>' +
                            '</object>';
                        break;
                    case CREATIVE_FORMAT_IMAGE:
                        html = '<a target="_blank" href="' + creative.click_url + '">' +
                            '<img src="' + ST_URL_UPLOAD + '/' + creative_files.image[0].url + '"/>' +
                            '</a>';
                        break;
                    case CREATIVE_FORMAT_VIDEO:
                        html = '<video controls width="'+ width +'" height="' + height + '">' +
                            '<source src="' + creative_files.video[0].url + '" type=video/mp4>' +
                            '</video>';
                        break;
                    case CREATIVE_FORMAT_ADBUILDER:
                        var value = Registry.get('adbuilderContent'),
                            config = JSON.parse(value.json[0]),
                            html = '<object width="' + config.creative.width + '" height="' + config.creative.height + '" type="application/x-shockwave-flash" data="' + Registry.get('site_url') + '/adbuilder/data/flash/BannerViewer.swf" style="visibility: visible;">\
                                    <param name="flashvars" value="data=' + encodeURIComponent(JSON.stringify(config)) + '">\
                                    <param name="quality" value="high"><param name="menu" value="false">\
                                    <param name="wmode" value="transparent">\
                                </object>';
                        break;
                    case CREATIVE_FORMAT_BRANDBUILDER:
                    case CREATIVE_FORMAT_DYNAMIC:
                        var value = Registry.get('adbuilderContent');
                        if(creative.adbuilder){
                            value = creative.adbuilder;
                            value = JSON.parse(value);
                        }
                        if(!value || JSON.stringify(value) == '{}' || JSON.stringify(value) == '{"json":[""]}' ||
                            JSON.stringify(value) == '' || !value.json[0].match(/\{/g)){
                            // truong hop JSON.parse(creative.properties)['templates'] = 'ad-thumb-ecom-baby' || 'ad-thumb-gallery' || 'ad-thumb-gallery-discountPrice'
                            var params = {
                                'website_id': creative.merchant_website_id,
                                'file_id': creative.merchant_file_id,
                                'category_id': creative.merchant_category_id,
                                'price_id': creative.merchant_price_id
                            };
                            $.ajax({
                                type: 'POST',
                                url: API_HOST + '/advertiser/dynamic-remarketing/get-product-by-condition',
                                data: params
                                ,
                                success: function(res){
                                    var template_id = JSON.parse(creative.properties)['templates'];
                                    if(!res.data || !res.data.product_list) {
                                        if(template_id.match(/ad-thumb-job-cb/g)){
                                            var static_upload_url = ST_URL_UPLOAD;
                                            var template_logo_file = JSON.parse(creative.properties)['template_logo_file'];
                                            var template_size = JSON.parse(creative.properties)['sizes'].replace('x', '-');
                                            var layoutFiles = '<div class="ad-dynamic '+template_id+' ad-'+template_size+'"> '+
                                                '<div class="ad-thumb-job-cb-logo"> '+
                                                '<img src="'+ static_upload_url + '/' + template_logo_file +'"> '+
                                                '</div> '+
                                                '<div class="ad-thumb-job-cb-content"> '+

                                                '</div> '+
                                                '</div>';
                                        }
                                        var childDiv = document.createElement('div');
                                        childDiv.innerHTML = layoutFiles;
                                        html = childDiv.cloneNode(true);
                                        nextFunc();
                                        return;
                                    }

                                    var productList = JSON.parse(res.data.product);

                                    var template_size = JSON.parse(creative.properties)['sizes'].replace('x', '-');
                                    var html_li = '';
                                    var className = '';
                                    var i=1;
                                    var static_upload_url = ST_URL_UPLOAD;
                                    var template_logo_file = JSON.parse(creative.properties)['template_logo_file'];
                                    var UPLOAD_URL = Registry.get('upload_url');


                                    var products = productList;
                                    var selectedIndex = '';
                                    var template = template_id;
                                    var creativeInfo = Registry.get('creativeInfo');
                                    if(Registry.get('creativeInfo_'+ creative.creative_id)){
                                        creativeInfo = Registry.get('creativeInfo_'+ creative.creative_id);
                                    }

                                    var properties = (creativeInfo.properties) ? JSON.parse(creativeInfo.properties) : {};
                                    var logoFile = (properties.template_logo_file) ? ST_URL_UPLOAD +'/'+ properties.template_logo_file : localStorage.ants_t_logo;
                                    var creative_button = properties.creative_button;
                                    var static_upload_url = ST_URL_UPLOAD;
                                    if(!creative_button) creative_button = 'MUA NGAY';
                                    if(!template){
                                        template = properties['templates'];
                                    }

                                    $.each(products, function(key, value){
                                        var index = key.match(/[0-9]{1,2}/g);
                                        if(index){
                                            index = index[0];
                                            if(res.status ==1 && (products['product'+index]['image'+index]['url'] && products['product'+index]['image'+index]['url'].indexOf(static_upload_url)==-1))
                                                products['product'+index]['image'+index]['url'] = static_upload_url +'/'+ products['product'+index]['image'+index]['url'];
                                        }
                                    })

                                    var params = {
                                        creative :{
                                            properties: {
                                                templates: template,
                                                template_logo_file: logoFile,
                                                creative_button: creative_button,
                                                event: (properties.event) ? properties.event : {}
                                            }
                                        },
                                        zone: {
                                            viewParams: {
                                                width: creativeInfo.width,
                                                height: creativeInfo.height
                                            }
                                        },
                                        products: products

                                    };


                                    setTimeout(function(params, self){
                                        $.ajax({
                                            url: Registry.get('DELIVERY_PREVIEW_DOMAIN') + '/delivery/preview/dynamic-remarketing',
                                            type: 'POST',
                                            data: params,
                                            success: function (resp) {
                                                var classStr = resp.match(/ad-dynamic ad-[a-z](.*)-[a-z](.*) ad-[0-9]{2,3}-[0-9]{2,3}/g);
                                                if(!classStr) return;
                                                var format = classStr[0].match(/[0-9]{2,3}-[0-9]{2,3}/g)[0];
                                                var width = format.split('-')[0];
                                                var height = format.split('-')[1];
                                                var iframe = document.createElement('iframe');
                                                iframe.style.width = width+"px";
                                                iframe.style.height = height+"px";
                                                iframe.setAttribute('frameBorder',"0");
                                                iframe.setAttribute('marginwidth',"0");
                                                iframe.setAttribute('marginheight',"0");
                                                iframe.setAttribute('vspace',"0");
                                                iframe.setAttribute('hspace',"0");
                                                iframe.setAttribute('allowtransparency',"true");
                                                iframe.setAttribute('scrolling',"no");
                                                iframe.setAttribute('allowfullscreen',"true");
                                                iframe.src = "";
                                                var previewEle = $('#preview-creative-'+creative.creative_id);
                                                if(previewEle.length == 0) previewEle = $('#preview-creative');
                                                previewEle.html(iframe);

                                                if(iframe.contentDocument) {
                                                    idocument = iframe.contentDocument;
                                                    idocument.open();
                                                    idocument.write("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\"   \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">");
                                                    idocument.write("<html>");
                                                    idocument.write('<head><meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" /><script type="text/javascript" src="//e.anthill.vn/library/js/jquery-1.10.2.min.js"><\/script></head>');
                                                    idocument.write("<body>"+resp+"</body>");
                                                    idocument.write("</html>");
                                                    idocument.close();
                                                } else {
                                                    var childDiv = document.createElement('div');
                                                    childDiv.innerHTML = resp;
                                                    html = childDiv.cloneNode(true);
                                                    $('body').append('<div id="preview-creative"></div>');
                                                    if($('#demo-page').length > 0){
                                                        $('#demo-page').find('.ads-active').html('').removeClass('ads-active');
                                                    }
                                                    setTimeout(function(){
                                                        nextFunc();
                                                    }, 1000);
                                                }
                                            }
                                        });
                                    }, 700, params, self);

                                }});
                            return;
                        }
                        if (value && value.json != "") {
                            var config = JSON.parse(value.json[0]);
                        } else {
                            var config = "";
                        }
                        var obj = $('body').find('#preview-creative');
                        if(obj.length == 0){
                            obj = $('body').find('#preview-creative-'+ creativeOracle.creative_id);
                        }
                        if(obj.length == 0) {
                            obj = $('body').find('#ads_'+ sizes);
                        }
                        if (config) {
                            var div = document.createElement('div'),
                                arr_template = creative_properties['templates'].split(';'),
                                selected_size = sizes.replace('x','_'),
                                selected_temp = arr_template[Math.floor(Math.random() * arr_template.length)],
                                json_file = JSON.parse(config[selected_temp+'_'+selected_size])['creative'];
                            div.id = selected_temp +'_'+selected_size;
                            div.className = 'ad ad_' +selected_temp +' ad_'+selected_size;

                            var formatSelected = JSON.parse(creative.properties)['templates'];
                            var adObj = {};
                            adObj[selected_temp+'_'+selected_size] = json_file;
                            var zonePreview = {
                                id: 1,
                                viewParams: {
                                    formatSelected: formatSelected,
                                    width: creative.width,
                                    height: creative.height
                                },
                                formatSelected: formatSelected,
                                width: creative.width,
                                height: creative.height,
                                files: JSON.stringify({'json': [adObj]})
                            }

                            var json = config[selected_temp+'_'+selected_size]
                            var creativePreview = {
                                id: creative.creative_id,
                                properties: {
                                    templates: JSON.parse(creative.properties)['templates']
                                },
                                files: config[selected_temp+'_'+selected_size],
                                formatDisplay: creative.format
                            }
                            var delivery_domain = Registry.get('DELIVERY_DOMAIN');
                            $.ajax({
                                type: 'POST',
                                url: Registry.get('DELIVERY_PREVIEW_DOMAIN') + '/delivery/preview-zone/'+creative.width+'/'+creative.height,
                                data: {json_file: json_file, creative: creativePreview, zone: zonePreview},
                                dataType: 'html',
                                success: function(res){
                                    res = JSON.parse(res);
                                    var iframe = document.createElement('iframe');
                                    iframe.style.width = res.width+"px";
                                    iframe.style.height = res.height+"px";
                                    iframe.setAttribute('frameBorder',"0");
                                    iframe.setAttribute('marginwidth',"0");
                                    iframe.setAttribute('marginheight',"0");
                                    iframe.setAttribute('vspace',"0");
                                    iframe.setAttribute('hspace',"0");
                                    iframe.setAttribute('allowtransparency',"true");
                                    iframe.setAttribute('scrolling',"no");
                                    iframe.setAttribute('allowfullscreen',"true");
                                    iframe.src = "";
                                    var previewEle = $('#preview-creative-'+creative.creative_id);
                                    if(previewEle.length == 0) previewEle = $('#preview-creative');
                                    previewEle.html(iframe);
                                    if(iframe.contentDocument) {
                                        idocument = iframe.contentDocument;
                                        idocument.open();
                                        idocument.write("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\"   \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">");
                                        idocument.write("<html>");
                                        idocument.write('<head><meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" /><script type="text/javascript" src="//e.anthill.vn/library/js/jquery-1.10.2.min.js"><\/script></head>');
                                        idocument.write("<body>"+res.layoutFiles+"</body>");
                                        idocument.write("</html>");
                                        idocument.close();
                                    } else {
                                        var childDiv = document.createElement('div');
                                        childDiv.innerHTML = res.layoutFiles;
                                        html = childDiv.cloneNode(true);
                                        $('body').append('<div id="preview-creative"></div>');
                                        if($('#demo-page').length > 0){
                                            $('#demo-page').find('.ads-active').html('').removeClass('ads-active');
                                        }
                                        setTimeout(function(){
                                            nextFunc();
                                        }, 1000);
                                    }
                                }
                            });
                        }
                        break;
                    case CREATIVE_FORMAT_FILE:
                        var file_url = Registry.get('static_upload_url') + '/' + creative_files.file[0].url;
                        if (creative_files.file[0].extension == 'swf') {
                            html = '<object width="'+ creative_files.file[0].dimensions.width +'" height="' + creative_files.file[0].dimensions.height + '" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0">' +
                                '<param name="SRC" value="' + file_url + '">' +
                                '<param name="allowScriptAccess" value="always">' +
                                '<param name="quality" value="high">' +
                                '<param name="bgcolor" value="#000000">' +
                                '<param name="wmode" value="transparent">' +
                                '<embed src="'  + file_url + '" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" play="true" loop="true" wmode="transparent" allowscriptaccess="always" width="'+ creative_files.file[0].dimensions.width +'" height="' + creative_files.file[0].dimensions.height + '"></embed>' +
                                '</object>';
                        }
                        else {
                            html = '<a target="_blank" href="' + creative.click_url + '">' +
                                '<img src="' + file_url + '"/>' +
                                '</a>';
                        }
                        width = creative_files.file[0].dimensions.width;
                        height = creative_files.file[0].dimensions.height;
                        break;
                    case CREATIVE_FORMAT_TEMPLATE:
                        var template_info = creative_properties['template_info'];
                        template_info = template_info.replace(/{{STATIC_URL}}/g,Registry.get('static_upload_url') + '/');

                        //--------------------------------------
                        var decodeEntities = (function () {
                            //create a new html document (doesn't execute script tags in child elements)
                            var doc = document.implementation.createHTMLDocument("");
                            var element = doc.createElement('div');

                            function getText(str) {
                                element.innerHTML = str;
                                str = element.textContent;
                                element.textContent = '';
                                return str;
                            }

                            function decodeHTMLEntities(str) {
                                if (str && typeof str === 'string') {
                                    var x = getText(str);
                                    while (str !== x) {
                                        str = x;
                                        x = getText(x);
                                    }
                                    return x;
                                }
                            }
                            return decodeHTMLEntities;
                        })();
                    function htmlEntities(str) {
                        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
                    }

                        var div = document.createElement('div');
                        div.innerHTML = template_info;
                        var tempHTML = $(div).find('.template-bg');
                        var w = tempHTML.width() + 2;
                        var h = tempHTML.height() + 2;
                        tempHTML.css({'width': w, 'height': h, 'box-sizing': 'content-box'});
                        template_info = tempHTML[0].outerHTML;
                        if($(selector).length ==0){
                            selector = '#preview-creative';
                        }
                        //--------------------------------------

                        html = '<a target="_blank" href="' + creative.click_url + '">' +
                            '' + $(template_info)[0].outerHTML + '' +
                            '</a>';
                        break;
                    case CREATIVE_FORMAT_GOOGLE_EXCHANGE:
                        var script = creative_properties['code'];
                        if ($('body').find('#demo-page').length > 0) {
                            $('body').find('#demo-page').remove();
                        }

                        var resp = $.ajax({type: "GET", url: STATIC_URL + '/images/demo.html', async: false}).responseText;
                        var $div = $('<div>', {'html' : resp , 'id' : 'demo-page', 'style' : 'display:none; position: absolute;top: 0px;z-index: 10000;margin: 0 auto;width: 100%;background: rgba(0, 0, 0, 0.5);padding-top:25px'} );
                        $('body').append($div);

                        var plc_sizes = creative.width+"x"+creative.height;

                        if(typeof(height) != "undefined" && height !== null) {
                            if ($.inArray(plc_sizes, allow_size) == -1) {
                                if (+creative.height <= 600) {
                                    plc_sizes = '300x600';
                                }

                                if (+creative.height <= 250) {
                                    plc_sizes = '300x300';
                                }

                                if (+creative.height <= 90) {
                                    plc_sizes = '980x90';
                                }
                            }
                        }

                        //Hiá»ƒn thá»‹ máº·c Ä‘á»‹nh vÃ¹ng 300x250 (KhÃ´ng get Ä‘Æ°á»£c kÃ­ch thÆ°á»›c Ä‘á»ƒ gÃ¡n vÃ o div phÃ¹ há»£p)
                        postscribe($('body').find("#ads_"+plc_sizes), script);

                        setTimeout(function () {
                            $('body').find('#demo-page').show();
                            if ($('body').find('#demo-page div.ads-active').length > 0) {
                                $('html, body').animate({
                                    scrollTop: ($('body').find("#ads_"+plc_sizes).offset().top - 50)
                                }, 500);
                            }
                        }, 500);

                        return false;
                        break;
                    case CREATIVE_FORMAT_LINEAR:
                        var type = +creative_properties.video_type,
                            source = creative_properties.code,
                            time_skip = creative_properties.time_skip ? creative_properties.time_skip : 5,
                            wrapper = creative_properties.wrapper ? creative_properties.wrapper : 0,
                            base64 = btoa(source);
                        switch (type) {
                            case VIDEO_TYPE_PREROLL:
                                type_name = 'preroll';
                                break;
                            case VIDEO_TYPE_MIDROLL:
                                type_name = 'midroll';
                                break;
                            case VIDEO_TYPE_POSTROLL:
                                type_name = 'postroll';
                                break;
                        }
                        setTimeout(function(params, self){
                            $.ajax({
                                url: Registry.get('DELIVERY_PREVIEW_DOMAIN') + '/delivery/preview/video?type=' + type_name + '&source=' + base64 + '&skip_offset='+ time_skip + '&wrapper=' + wrapper,
                                type: 'GET',
                                data: params,
                                success: function (resp) {
                                    var width = 390;
                                    var height = 360;
                                    var iframe = document.createElement('iframe');
                                    iframe.style.width = width+"px";
                                    iframe.style.height = height+"px";
                                    iframe.setAttribute('frameBorder',"0");
                                    iframe.setAttribute('marginwidth',"0");
                                    iframe.setAttribute('marginheight',"0");
                                    iframe.setAttribute('vspace',"0");
                                    iframe.setAttribute('hspace',"0");
                                    iframe.setAttribute('allowtransparency',"true");
                                    iframe.setAttribute('scrolling',"no");
                                    iframe.setAttribute('allowfullscreen',"true");
                                    iframe.src = "";
                                    var previewEle = $('#preview-creative-'+creative.creative_id);
                                    if(previewEle.length == 0) previewEle = $('#preview-creative');
                                    previewEle.html(iframe);
                                    if(iframe.contentDocument) {
                                        idocument = iframe.contentDocument;
                                        idocument.open();
                                        idocument.write("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\"   \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">");
                                        idocument.write("<html>");
                                        idocument.write('<head><meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" /><script type="text/javascript" src="//e.anthill.vn/library/js/jquery-1.10.2.min.js"><\/script></head>');
                                        idocument.write("<body>"+resp+"</body>");
                                        idocument.write("</html>");
                                        idocument.close();
                                    } else {
                                        var childDiv = document.createElement('div');
                                        childDiv.innerHTML = resp;
                                        html = childDiv.cloneNode(true);
                                        $('body').append('<div id="preview-creative"></div>');
                                        if($('#demo-page').length > 0){
                                            $('#demo-page').find('.ads-active').html('').removeClass('ads-active');
                                        }
                                        setTimeout(function(){
                                            nextFunc();
                                        }, 500);
                                    }
                                }
                            });
                        }, 1500, params, self);
                        break;
                    case CREATIVE_FORMAT_OVERLAY:
                        var file = Registry.get('static_upload_url') + '/' + creative_files.file[0].url,
                            time_skip = creative_properties.time_skip ? creative_properties.time_skip : 5,
                            base64 = btoa(file);
                        setTimeout(function(params, self){
                            $.ajax({
                                url: Registry.get('DELIVERY_PREVIEW_DOMAIN') + '/delivery/preview/video?type=overlay' + '&source=' + base64 + '&img_width=' + width + '&img_height=' + height + '&skip_offset='+time_skip,
                                type: 'GET',
                                data: params,
                                success: function (resp) {
                                    var width = 390;
                                    var height = 360;
                                    var iframe = document.createElement('iframe');
                                    iframe.style.width = width+"px";
                                    iframe.style.height = height+"px";
                                    iframe.setAttribute('frameBorder',"0");
                                    iframe.setAttribute('marginwidth',"0");
                                    iframe.setAttribute('marginheight',"0");
                                    iframe.setAttribute('vspace',"0");
                                    iframe.setAttribute('hspace',"0");
                                    iframe.setAttribute('allowtransparency',"true");
                                    iframe.setAttribute('scrolling',"no");
                                    iframe.setAttribute('allowfullscreen',"true");
                                    iframe.src = "";
                                    var previewEle = $('#preview-creative-'+creative.creative_id);
                                    if(previewEle.length == 0) previewEle = $('#preview-creative');
                                    previewEle.html(iframe);
                                    if(iframe.contentDocument) {
                                        idocument = iframe.contentDocument;
                                        idocument.open();
                                        idocument.write("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\"   \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">");
                                        idocument.write("<html>");
                                        idocument.write('<head><meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" /><script type="text/javascript" src="//e.anthill.vn/library/js/jquery-1.10.2.min.js"><\/script></head>');
                                        idocument.write("<body>"+resp+"</body>");
                                        idocument.write("</html>");
                                        idocument.close();
                                    } else {
                                        var childDiv = document.createElement('div');
                                        childDiv.innerHTML = resp;
                                        html = childDiv.cloneNode(true);
                                        $('body').append('<div id="preview-creative"></div>');
                                        if($('#demo-page').length > 0){
                                            $('#demo-page').find('.ads-active').html('').removeClass('ads-active');
                                        }
                                        setTimeout(function(){
                                            nextFunc();
                                        }, 500);
                                    }
                                }
                            });
                        }, 700, params, self);
                        break;
                    case CREATIVE_FORMAT_WRAPPER:
                        var source = creative_properties.code,
                            base64 = btoa(source)
                        setTimeout(function(params, self){
                            $.ajax({
                                url: Registry.get('DELIVERY_PREVIEW_DOMAIN') + '/delivery/preview/video?type=wrapper' + '&source=' + base64,
                                type: 'GET',
                                data: params,
                                success: function (resp) {
                                    var width = 390;
                                    var height = 360;
                                    var iframe = document.createElement('iframe');
                                    iframe.style.width = width+"px";
                                    iframe.style.height = height+"px";
                                    iframe.setAttribute('frameBorder',"0");
                                    iframe.setAttribute('marginwidth',"0");
                                    iframe.setAttribute('marginheight',"0");
                                    iframe.setAttribute('vspace',"0");
                                    iframe.setAttribute('hspace',"0");
                                    iframe.setAttribute('allowtransparency',"true");
                                    iframe.setAttribute('scrolling',"no");
                                    iframe.setAttribute('allowfullscreen',"true");
                                    iframe.src = "";
                                    var previewEle = $('#preview-creative-'+creative.creative_id);
                                    if(previewEle.length == 0) previewEle = $('#preview-creative');
                                    previewEle.html(iframe);
                                    if(iframe.contentDocument) {
                                        idocument = iframe.contentDocument;
                                        idocument.open();
                                        idocument.write("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\"   \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">");
                                        idocument.write("<html>");
                                        idocument.write('<head><meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" /><script type="text/javascript" src="//e.anthill.vn/library/js/jquery-1.10.2.min.js"><\/script></head>');
                                        idocument.write("<body>"+resp+"</body>");
                                        idocument.write("</html>");
                                        idocument.close();
                                    } else {
                                        var childDiv = document.createElement('div');
                                        childDiv.innerHTML = resp;
                                        html = childDiv.cloneNode(true);
                                        $('body').append('<div id="preview-creative"></div>');
                                        if($('#demo-page').length > 0){
                                            $('#demo-page').find('.ads-active').html('').removeClass('ads-active');
                                        }
                                        setTimeout(function(){
                                            nextFunc();
                                        }, 500);
                                    }
                                }
                            });
                        }, 700, params, self);
                        break;
                    case CREATIVE_FORMAT_HTML5:
                        var script = creative_properties['code'];
                        var iframe = document.createElement('iframe');
                        iframe.style.width = creative.width+"px";
                        iframe.style.height = creative.height+"px";
                        iframe.setAttribute('frameBorder',"0");
                        iframe.setAttribute('marginwidth',"0");
                        iframe.setAttribute('marginheight',"0");
                        iframe.setAttribute('vspace',"0");
                        iframe.setAttribute('hspace',"0");
                        iframe.setAttribute('allowtransparency',"true");
                        iframe.setAttribute('scrolling',"no");
                        iframe.setAttribute('allowfullscreen',"true");
                        iframe.src = script;
                        var previewEle = $('#preview-creative-'+creative.creative_id);
                        if(previewEle.length == 0) previewEle = $('#preview-creative');
                        previewEle.html(iframe);
                        break;
                }
            }
        } catch (e) {
            html = '<img class="img-responsive" src="' + STATIC_URL + '/img/images/no-banner.png' + '"/>';
        }

        if(+creative.format != CREATIVE_FORMAT_BRANDBUILDER && +creative.format != CREATIVE_FORMAT_DYNAMIC && +creative.format != CREATIVE_FORMAT_HTML5){
            nextFunc();
        }

        function nextFunc (){
            if (creative.isWidget == false) {
                var properties = JSON.parse(creative.properties),
                    sizes = properties.sizes,
                    is_balloon = properties.is_balloon || 0
                    ;
            } else {
                var sizes = '300x250';
            }

            if (sizes) {
                width = sizes.split('x')[0];
                height = sizes.split('x')[1];
            }

            if(typeof(height) != "undefined" && height !== null) {
                if ($.inArray(sizes, allow_size) == -1) {
                    if (+height <= 600) {
                        sizes = '300x600';
                    }

                    if (+height <= 250) {
                        sizes = '300x300';
                    }

                    if (+height <= 90) {
                        sizes = '980x90';
                    }
                }
            }

            $.get(STATIC_URL + '/images/demo.html',function (resp) {
                // if ($('body').find('#demo-page').length > 0 && $('body').find('#preview-creative').length == 0) {
                if ($('body').find('#demo-page').length > 0) {
                    $('body').find('#demo-page').remove();
                }
                if ($('body').find('#demo-page').length > 0) {
                    $('body').find('#demo-page').remove();
                }

                var $div = $('<div>', {'html' : resp , 'id' : 'demo-page', 'style' : 'display:none; position: absolute;top: 0px;z-index: 10000;margin: 0 auto;width: 100%;background: rgba(0, 0, 0, 0.5);padding-top:25px'} );
                // Creative ballon ads
                if (+is_balloon == 1) {
                    $div.find('#ads_ballon').css('clip','rect(0px '+width+'px '+height+'px 0px)');
                    $div.find('#ads_ballon').html(html);
                    $div.find('#ads_ballon').addClass('ads-active');
                }
                else {
                    if ($.inArray(+creative.resource_id, resource_video) !== -1) {
                        $div.find('#ads_video').html(html);
                    } else {
                        $div.find('#ads_' + sizes).html(html)
                        $div.find('#ads_' + sizes).addClass('ads-active');
                    }
                }
                // $('body').append($div);
                if (typeof selector == 'string') {
                    if (+creative.format != CREATIVE_FORMAT_BRANDBUILDER && +creative.format != CREATIVE_FORMAT_DYNAMIC) {
                        $('body').append($div);
                        if (+creative.format == CREATIVE_FORMAT_TEMPLATE) {
                            wrapper = document.getElementById(selector.replace('#',''));
                            wrapper.innerHTML="";
                            iframe = document.createElement('iframe');
                            iframe.style.width = width+"px";
                            iframe.style.height = height+"px";


                            iframe.setAttribute('frameborder',"0");
                            iframe.setAttribute('marginwidth',"0");
                            iframe.setAttribute('marginheight',"0");
                            iframe.setAttribute('vspace',"0");
                            iframe.setAttribute('hspace',"0");
                            iframe.setAttribute('allowtransparency',"true");
                            iframe.setAttribute('scrolling',"no");
                            iframe.setAttribute('allowfullscreen',"true");
                            iframe.src = "";
                            wrapper.appendChild(iframe);

                            idocument = iframe.contentWindow.document;
                            idocument.open();
                            idocument.write("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\"   \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">");
                            idocument.write("<html>");
                            idocument.write('<head><meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"><span style="display:none">&nbsp;</span><style type="text/css">body{padding:0;margin:0;overflow:hidden;} a{text-decoration:none}</style></head>');
                            idocument.write("<body>"+html+"</body>");
                            idocument.write("</html>");
                            idocument.close();
                            if(jQuery(selector).length>0)
                                jQuery(selector).html(btn_preview + '<br/><br/>' +html);
                            else
                                jQuery('#preview-creative').html(btn_preview + '<br/><br/>' +html);
                            return false;
                        }
                        if (+creative.format == CREATIVE_FORMAT_LINEAR) {
                            wrapper = document.getElementById(selector.replace('#',''));
                            wrapper.innerHTML="";
                            iframe = document.createElement('iframe');
                            iframe.style.width = width+"px";
                            iframe.style.height = height+"px";


                            iframe.setAttribute('frameborder',"0");
                            iframe.setAttribute('marginwidth',"0");
                            iframe.setAttribute('marginheight',"0");
                            iframe.setAttribute('vspace',"0");
                            iframe.setAttribute('hspace',"0");
                            iframe.setAttribute('allowtransparency',"true");
                            iframe.setAttribute('scrolling',"no");
                            iframe.setAttribute('allowfullscreen',"true");
                            iframe.src = "";
                            wrapper.appendChild(iframe);

                            idocument = iframe.contentWindow.document;
                            idocument.open();
                            idocument.write("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\"   \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">");
                            idocument.write("<html>");
                            idocument.write('<head><meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"><span style="display:none">&nbsp;</span><style type="text/css">body{padding:0;margin:0;overflow:hidden;} a{text-decoration:none}</style></head>');
                            idocument.write("<body>"+html+"</body>");
                            idocument.write("</html>");
                            idocument.close();
                            if(jQuery(selector).length>0)
                                jQuery(selector).html(btn_preview + '<br/><br/>' +html);
                            else
                                jQuery('#preview-creative').html(btn_preview + '<br/><br/>' +html);
                            return false;
                        }
                        if(jQuery(selector).length>0)
                            return jQuery(selector).html(btn_preview + '<br/><br/>' +html);
                        else
                            return jQuery('#preview-creative').html(btn_preview + '<br/><br/>' +html);
                    }
                    else {
                        if (html != "") {
                            wrapper = document.getElementById(selector.replace('#','')) || document.getElementById('preview-creative');
                            if($(wrapper).find('iframe').length >0){
                                return;
                            }
                            var iframe = document.createElement('iframe');
                            iframe.style.width = width+"px";
                            iframe.style.height = height+"px";
                            iframe.setAttribute('frameBorder',"0");
                            iframe.setAttribute('marginwidth',"0");
                            iframe.setAttribute('marginheight',"0");
                            iframe.setAttribute('vspace',"0");
                            iframe.setAttribute('hspace',"0");
                            iframe.setAttribute('allowtransparency',"true");
                            iframe.setAttribute('scrolling',"no");
                            iframe.setAttribute('allowfullscreen',"true");
                            iframe.src = "";

                            $(wrapper).html(iframe);
                            idocument = iframe.contentDocument;
                            idocument.open();
                            idocument.write("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\"   \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">");
                            idocument.write("<html>");
                            idocument.write('<head><meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" /><script type="text/javascript" src="//e.anthill.vn/library/js/jquery-1.10.2.min.js"><\/script></head>');
                            idocument.write("<body>"+html+"</body>");
                            idocument.write("</html>");
                            idocument.close();
                        }
                    }
                } else {
                    $('body').append($div);
                    if($('#demo-page').length > 0 && ($(html).find('.ad').length>0) || ($(html).find('.ad-dynamic').length>0)){
                        $('#demo-page').css('display', '');
                        var iframe = document.createElement('iframe');
                        iframe.style.width = width+"px";
                        iframe.style.height = height+"px";
                        iframe.setAttribute('frameBorder',"0");
                        iframe.setAttribute('marginwidth',"0");
                        iframe.setAttribute('marginheight',"0");
                        iframe.setAttribute('vspace',"0");
                        iframe.setAttribute('hspace',"0");
                        iframe.setAttribute('allowtransparency',"true");
                        iframe.setAttribute('scrolling',"no");
                        iframe.setAttribute('allowfullscreen',"true");
                        iframe.src = "";
                        $('#demo-page').find('.ads-active').html('');
                        $('#demo-page').find('.ads-active').append(iframe);
                        var idocument = iframe.contentDocument;
                        idocument.open();
                        idocument.write("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\"   \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">");
                        idocument.write("<html>");
                        idocument.write('<head><meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" /><script type="text/javascript" src="//e.anthill.vn/library/js/jquery-1.10.2.min.js"><\/script></head>');
                        idocument.write("<body>"+ $(html).prop('outerHTML') +"</body>");
                        idocument.write("</html>");
                        idocument.close();
                        $('html, body').animate({
                            scrollTop: $(".ads-active").offset().top
                        }, 2000);
                    } else {
                        $('#demo-page').css('display', '');
                        if($div.find('#ads_video').length > 0){
                            $('html, body').animate({
                                scrollTop: $("#ads_video").offset().top
                            }, 2000);
                        } else {
                            $('html, body').animate({
                                scrollTop: $(".ads-active").offset().top
                            }, 2000);
                        }
                        return html;

                    }
                }
            });
        }
    }

    function transform(creativeOracle) {
        var creative = {},
            creative_format = +creativeOracle.format,
            creative_properties = creativeOracle.properties ? JSON.parse(creativeOracle.properties) : {},
            creative_files = creativeOracle.files ? JSON.parse(creativeOracle.files) : {},
            creative_images = creative_files.image ? Registry.get('static_upload_url') + '/' + creative_files.image[0].url : STATIC_URL + '/img/images/no-banner.png',
            defaultWidgetPriceObj = {},
            defaultWidgetContextualObj = {},
            defaultWidgetPromotionObj = {};

        switch (creative_format) {
            case CREATIVE_FORMAT_WIDGET_PRICE:
                defaultWidgetPriceObj = {
                    bannerType: 14,
                    oldPrice: Adx.numberFormat(creative_properties.original_price) || '',
                    newPrice: Adx.numberFormat(creative_properties.promotion_price) || '',
                    title: creativeOracle.creative_name,
                    url: creativeOracle.click_url,
                    hostname: creativeOracle.display_url ? creativeOracle.display_url : creativeOracle.click_url,
                    image: creative_images,
                    isWidget: true
                };
                creative = defaultWidgetPriceObj;
                break;
            case CREATIVE_FORMAT_WIDGET_CONTEXTUAL:
                defaultWidgetContextualObj = {
                    bannerType: 16,
                    title: creativeOracle.creative_name,
                    content: creative_properties.content || '',
                    url: creativeOracle.click_url,
                    hostname: creativeOracle.display_url ? creativeOracle.display_url : creativeOracle.click_url,
                    image: creative_images,
                    isWidget: true
                };
                creative = defaultWidgetContextualObj;
                break;
            case CREATIVE_FORMAT_WIDGET_TEXT:
                defaultWidgetTextObj = {
                    bannerType: 17,
                    title: creativeOracle.creative_name,
                    content: creative_properties.content || '',
                    url: creativeOracle.click_url,
                    hostname: creativeOracle.display_url ? creativeOracle.display_url : creativeOracle.click_url,
                    image: creative_images,
                    isWidget: true
                };
                creative = defaultWidgetTextObj;
                break;
            case CREATIVE_FORMAT_LINEAR:
                creative = creativeOracle;
                //creative.format = 21;
                break;
            default:
                creative = creativeOracle;
                creative.isWidget = false;
                break;
        }

        return creative;
    }
    $('body').keyup(function(e) {
        if (e.keyCode == 27) {
            $('body').find('#demo-page').hide();
            $('body').find('#preview-creative').remove();
        }
    });

    $('body')
        .on('click', '#close-demo', function() {
            $('body').find('#demo-page').hide();
            $('body').find('#preview-creative').remove();
        })
        .on('click', '#show-demo', previewCreative)
    ;

    // exports
    window.creativePreview = preview;

    //preview creative
    function previewCreative(){
        var me = $(this),
            creative_id = me.parents('.preview-creative').data('creative-id'),
            param_id = '#' + me.parents('.preview-creative').attr('id'),
            object_creative = Registry.get('creativeInfo_' + creative_id);

        if(typeof object_creative === 'object'){
            window.creativePreview = preview(object_creative,param_id);
        }

        setTimeout(function () {
            $('body').find('#demo-page').show();
            if ($('body').find('#demo-page div.ads-active').length > 0) {
                $('html, body').animate({
                    scrollTop: ($('body').find('#demo-page div.ads-active').offset().top - 50)
                }, 500);
            }
        }, 500);
    }
})(window, NameSpace);
