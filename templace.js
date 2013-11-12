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
                var _regx = {
                    vars : '{{([A-z0-9\_]+)}}',
                    condicao : /(?:\{\{(.*?)\=(.*?)\}\}(.*)\{\{\/(?:\1)\}\})/gmi
                };
                var _conf = {
                        callback:'',
                        classAlpha:'alpha',
                        classOmega:'omega',
                        nthchild:0,
                        arrayCallback:'',
                        html:''
                    }, match,
                       condicao = template.match(_regx.condicao),
                       varTmpl = [];

                _conf = $.extend(_conf, conf);

                var data = data || {};
                
                function _condional(_c){
                    
                    var _condicao = _c || condicao;

                    for(var ic in _condicao){
                        
                        var _cond = _condicao[ic].match(/(?:\{\{(.*?)\=(.*?)\}\}(.*)\{\{\/(?:\1)\}\})/mi);

                        if(typeof _cond === 'object' && _cond.length === 4){
                            
                            var context = _cond[0], 
                                regTest = _cond[2], 
                                dataTest = _cond[1],
                                tmpl = _cond[3];
                            
                            var nova = tmpl.match(_regx.condicao);
                      
                            if(nova !== null && nova.length > 0){

                                _condional(nova);
                            }
                                                       
                            if(typeof data === 'object' && typeof data[dataTest] !== 'undefined'){
                                
                                dataTest = data[dataTest];
                            }else{
                                
                                dataTest = data;
                            }
                            
                            if((new RegExp(regTest)).test(dataTest) === true){
                                
                                template = template.replace(context, tmpl);
                            }else{
                                log('test-false', regTest, dataTest);
                                template = template.replace(context, '');
                            }
                        }

                        _cond = undefined;
                    }
                }
                
                function _parse(a, b){

                    var _html = a;
                    
                    for(var i in varTmpl){

                        var name = varTmpl[i].toString();

                        if(typeof(b[name]) === "undefined"){ b[name] = '';}

                        if(_conf.arrayCallback.call)_conf.arrayCallback.call(b[name]);

                        _html = _html.replace(new RegExp('{{'+ name +'}}',"gm"), b[name]);
                    }

                   return _html;
                }

                function _init(){
                    
                    //Verificar as condicionais
                    _condional();
                    
                    match = template.match(new RegExp(_regx.vars ,"gmi"));
                    
                    //Limpar as {{ }} das var's
                    for(var i in match){
                        varTmpl[i] = match[i].toString().replace(/\{\{(.*)\}\}/, "$1");
                    }
                    
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