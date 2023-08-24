const getters = {
    token: state => state.user.token,
    realname: state => state.user.info.realname,
    avatar: state => state.user.info.avatar,
    userId: state => state.user.info._id,
    isAdmin: state => state.user.info.isAdmin
}

export default getters;