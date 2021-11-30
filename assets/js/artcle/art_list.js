$(function(){
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    
    var q = {
        pagenum:2,
        pagesize:2,
        cate_id:'',
        state:''
    }
    template.defaults.imports.dataFormat = function(date){
        const dt = new Date(date)
        var y = dt.getFullYear();
        var m = dt.getMonth()+1;
        var d = dt.getDate();
        var hh = dt.getHours();
        var mm = dt.getMinutes();
        var ss = dt.getSeconds();
        return y+'-'+m+'-'+d+' '+hh+'-'+mm+'-'+ss;
    }
    getInitTable();
    getInitCate();
    function getInitTable(){
        $.ajax({
            method:'GET',
            url:'/my/article/list',
            data:q,
            success:function(res) {
                console.log(res.data+"art_list");
                if(res.status !==0){
                    return layer.msg('获取信息失败')
                }
                layer.msg('获取信息成功')
                var htmlStr = template('tpl-table',res);
                console.log(htmlStr);
                $('tbody').html(htmlStr);
                renderPage(res.total);
            }
        })
    }
    function getInitCate(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res){
                if(res.status !==0){
                    return layer.msg('获取信息失败')
                }
                var catStr = template('tpl-cate',res)
                $('[name=cate_id]').html(catStr);
                form.render();
            }
        })
    }
    $('#form-search').on('submit',function(e){
        e.preventDefault();
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        q.cate_id = cate_id;
        q.state = state;
        getInitTable();
    })
    function renderPage(total){
        laypage.render({
            elem:'pageBox',
            count:total,
            limit:q.pagesize,
            curr:q.pagenum,
            layout:['count','limit','prev','page','next','skip'],
            limits:[2,3,5,10],
            jump:function(obj,first){
                q.pagenum=obj.curr;
                q.pagesize=obj.limit;
                if(!first){
                    getInitTable();
                }
            }
        })
    }
    $('tbody').on('click','.btn-delete',function(){
        var len = $('.btn-delete').length;
        layer.confirm('确实删除?',{icon:3,title:'提示'},function(index){
            var id = $('.btn-delete').attr('data-id');
            $.ajax({
                method:'GET',
                url:'my/article/delete'+id,
                success:function(res){
                    if(res.status !== 0){
                        return layer.msg('删除失败');
                    }
                    layer.msg('删除成功');
                    if(len ===1){
                        q.pagenum === 1?1:q.pagnum-1;
                    }
                    getInitTable();
                }
            })
            layer.close(index);
        })
    })
})