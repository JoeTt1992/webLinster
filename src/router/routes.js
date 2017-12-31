import Login from '@/components/Login'
import Main from '@/components/Main'

import User from '@/components/user/UserList'
import UserAdd from '@/components/user/UserAdd'
import ChangePwd from '@/components/user/ChangePwd'

import InfoList from '@/components/InfoList'
import InfoResult from '@/components/InfoResult'
import InfoAdd from '@/components/InfoAdd'

import Log from '@/components/log/LogList'
import Notfound from '@/components/Notfound'
 
export default[
	{
        path: '/',
        component: Login
    },
    {
        path: '/main',
        name: 'Main',
        meta: {
            // 添加该字段，表示进入这个路由是需要登录的
            requireAuth: true
        },
        component: Main,
  	    children: [//页面子路由
            {
                path: '/main/user/list',
      		    meta: { requireAuth: true },
                component: User
            },{
                path: '/main/user/add',
                meta: { requireAuth: true },
                component: UserAdd
            },{
                path: '/main/user/pwd',
                meta: { requireAuth: true },
                component: ChangePwd
            },{
                path: '/main/key/list',
      		    meta: { requireAuth: true },
                component: InfoList
            },{
                path: '/main/key/result',
                meta: { requireAuth: true },
                component: InfoResult
            },{
                path: '/main/key/add',
                meta: { requireAuth: true },
                component: InfoAdd
            },{
                path: '/main/web/list',
                meta: { requireAuth: true },
                component: InfoList
            },{
                path: '/main/web/result',
                meta: { requireAuth: true },
                component: InfoResult
            },{
                path: '/main/web/add',
                meta: { requireAuth: true },
                component: InfoAdd,
                query: { entrance: 'web' }
            },{
                path: '/main/keyupdate/list',
                meta: { requireAuth: true },
                component: InfoList
            },{
                path: '/main/keyupdate/result',
                meta: { requireAuth: true },
                component: InfoResult
            },{
                path: '/main/keyupdate/add',
                meta: { requireAuth: true },
                component: InfoAdd,
                query: { entrance: 'keyupdate' }
            },{
                path: '/main/log/list',
                meta: { requireAuth: true },
                component: Log
            }
        ]
    },{ path: '*', component: Login }
]
