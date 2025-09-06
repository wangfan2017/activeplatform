import Mock from 'mockjs';

Mock.mock(/\/user\/getYzm/,'post',{
    code:200,
    msg:'success',
    data:{code:Mock.Random.string('number',6)}
})

Mock.mock(/\/user\/login/,'post',{
    code:200,
    msg:'success',
    data:{resCode:1,data:{
        'token':'@string(32)',
        'name':'wf',
        'uid':'123'
        }}
})
Mock.mock(/\/user\/tempList/, 'post', () => {
    const list = [];
    for (let i = 0; i < 10; i++) {
        list.push({
            name: Mock.mock('@cword(2, 3)活动模板'),
            id: Mock.Random.guid(),
            time: Mock.Random.datetime('yyyy/MM/dd HH:mm'),
            typestr: Mock.Random.pick(['拉新人', '老骑手召回','早冲单']),
            status: Mock.Random.pick(['启用', '停用']),
            // region: Mock.Random.pick(['华北区', '华南区', '华中区', '华东区']),
            province: Mock.Random.pick(['河南大区', '广东省区', '河北省区']),
            city: Mock.Random.pick(['北京', '重庆', '上海', '天津', '武汉', '深圳', '广州']),
            contry: Mock.Random.county(false) // 注意 Mock.Random.county 有时命名不同，视版本而定
        });
    }

    return {
        code: 200,
        msg: 'success',
        data: {
            resCode: 1,
            data: { list }
        }
    };
});
Mock.mock(/\/user\/getOperator/, 'post', () => {
    const list = [];
    for (let i = 0; i < 10; i++) {
        list.push({
            id: Mock.Random.integer(1),
            account:Mock.Random.guid(),
            roleName:Mock.Random.pick(['活动运营', '大区经理', '片区经理']),
            belong: Mock.Random.pick(['河南省区', '广东省区','河北省区']),
            status: Mock.Random.pick([1, 2]),
            time: Mock.Random.datetime('yyyy/MM/dd HH:mm')
        });
    }

    return {
        code: 200,
        msg: 'success',
        data: {
            resCode: 1,
            data: { list }
        }
    };
});
Mock.mock(/\/user\/getRoleList/, 'post', () => {
    const list = [];
    var ary=['大区经理', '片区经理','活动运营'];
    for (let i = 0; i < 3; i++) {
        list.push({
            id: Mock.Random.id(1),
            name:ary[i],
        });
    }

    return {
        code: 200,
        msg: 'success',
        data: {
            resCode: 1,
            data: { list }
        }
    };
});

Mock.mock(/\/user\/getPermission/, 'post', () => {
    const list =[
        {
            id: 1,
            label: '活动管理',
            children: [
                {
                    id: 11,
                    label: '活动管理',
                    children: [],
                },
                {
                    id: 12,
                    label: '模版管理',
                    children: [],
                },
            ],
        },
        {
            id: 2,
            label: '系统管理',
            children: [
                {
                    id: 21,
                    label: '用户管理',
                },
                {
                    id: 22,
                    label: '角色管理',
                },
                {
                    id: 23,
                    label: '权限管理',
                },
            ],
        },
    ];

    return {
        code: 200,
        msg: 'success',
        data: {
            resCode: 1,
            data: { list }
        }
    };
});