$(function(){
    $('#link_reg').on('click',function(){
        $('.login-box').hide();
        $('.reg-box').show();
    })
    $('#link_login').on('click',function(){
        $('.reg-box').hide();
        $('.login-box').show();
    })
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pwd:[/^[\S]{6,12}$/,'密码必须6到12位不能出现空格'],
        repwd:function(value){
            var pwd = $('.reg-box [name=password]').val();
            if(pwd !== value){
                return '两次密码不一样';
            }
        }
    })
    $('#form_reg').on('submit',function(e){
        e.preventDefault();
        $.post('/api/reguser',{username:$('#form_reg [name=username]').val(),password:$('#form_reg [name=password]').val()},function(res){
            if(res.status !== 0){
                return layer.msg(res.message);
            }
            layer.msg(res.message);
            $('#link_login').click();
        })
    })
    $('#form_login').on('submit',function(e){
        e.preventDefault();
        $.ajax({
            url:'/api/login',
            method:'POST',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !==0){
                    return layer.msg('登录失败');
                }
                layer.msg('登录成功');
                location.href = '/index.html'
            }
        })
    })
})