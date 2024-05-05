const ressionIdUserMap =new Map();

function setUser(id,user)
{
    ressionIdUserMap.set(id,user)
}
function getUser(id){
    return ressionIdUserMap.get(id);
}

module.exports =
{
    setUser,
    getUser,
}