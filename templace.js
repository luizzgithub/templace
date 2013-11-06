/**
 * Templace v1
 * Mini plugin jquery para template
 * https://github.com/luizzgithub/templace
 *
 * Non-commercial use is licensed under the MIT License
 *
 * Copyright 2013 Luizz
 */
 
/**
* Templace
* @param string template
* @param string data
* @param function callback
*/
  jQuery.extend({templace : function(template, data, conf){
        
                conf = (typeof conf === 'function') ? {callback:conf}:conf;

                var _conf = {
                        callback:'',
                        classAlpha:'alpha',
                        classOmega:'omega',
                        nthchild:0,
                        arrayCallback:'',
                        html:''
                    }, match = template.match(new RegExp('{{([A-z0-9\_]+)}}',"gmi")), varTmpl = [];
                    
                //Limpar as {{ }} das var's
                for(var i in match){
                    varTmpl[i] = match[i].toString().replace(/\{\{(.*)\}\}/, "$1");
                }
                
                _conf = $.extend(_conf, conf);

                var data = data || {};

                function _parse(a, b){

                    var _html = a;
                    
                    for(var i in varTmpl){

                        var name = varTmpl[i].toString();

                        if(typeof(b[name]) !== "undefined"){ 

                            if(_conf.arrayCallback.call)_conf.arrayCallback.call(b[name]);

                            _html = _html.replace(new RegExp('{{'+ name +'}}',"gm"), b[name]);
                        }
                    }

                   return _html;
                }

                function _init(){

                    if($.isArray(data) === true){

                        for(var i in data){ 
                            _conf.html += _parse(template, data[i]);
                        }

                           _conf.html = $( _conf.html);

                          if(_conf.nthchild > 0){

                             _conf.html.filter('.item_tpl:nth-child('+_conf.nthchild+'n+0)').addClass(_conf.classOmega)
                                       .end()
                                       .filter('.item_tpl:nth-child('+_conf.nthchild+'n+1)').addClass(_conf.classAlpha);
                          }
                    }else{

                        _conf.html = _parse(template, data);
                    }

                    return (typeof _conf.callback === 'function') ? _conf.callback(_conf.html):_conf.html;
                }

                return _init();

                _conf = undefined;
  }});