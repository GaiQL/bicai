import {session} from './store'

export const token = {
    get(){
        return session.get('_MX_BICAI_TOKEN')
    },
    set(val){
        session.set('_MX_BICAI_TOKEN',val)
    },
    remove(){
        session.remove('_MX_BICAI_TOKEN')
    }
}
export const realNameStatus = {
    get(){
        session.get('_MX_AUTH_STATUS')
    },
    set(val){
        session.set('_MX_AUTH_STATUS',val)
    },
    remove(){
        session.remove('_MX_AUTH_STATUS')
    }
}
