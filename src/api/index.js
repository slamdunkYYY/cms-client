import ajax from './ajax'

const BASE = '/cms'
const weatherKey = '9a51f6f9ecd3f9a99189db0e8dc7c0b4'
const BASEWeather = 'http://api.openweathermap.org/data/2.5/weather'
const appid = weatherKey

export const reqLogin = (username, password) => ajax(BASE + '/login', {username, password}, 'POST')

export const reqAddUser = (user) => ajax(BASE + '/manage/user/add', user, 'POST')

export const reqCategories = (parentId) => ajax(BASE + '/manage/category/list', {parentId})

export const reqAddCategory = (categoryName, parentId) => ajax(BASE + '/manage/category/add', {categoryName,parentId}, 'POST')

export const reqUpdateCategory = ({categoryId,categoryName}) => ajax(BASE + '/manage/category/update', {categoryId,categoryName}, 'POST')

export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', {categoryId})

export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', {pageNum, pageSize})

export const reqSearchProducts = ({pageNum, pageSize, searchName, searchType}) => ajax(BASE + '/manage/product/search', {
	pageNum, pageSize, [searchType]:searchName 
})

export const reqUpdateStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', {productId, status}, 'POST')

export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' + ( product._id?'update':'add'), product, 'POST')

export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', {name}, 'POST')

export const reqLocation = (options) => {
	return new Promise((resolve, reject)=>{
   		navigator.geolocation.getCurrentPosition(resolve, reject, options);
	})
}

export const reqRoles = () => ajax(BASE + '/manage/role/list')

export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add', {roleName}, 'POST')

export const reqUpdateRole = (role) => ajax(BASE + '/manage/role/update', role, 'POST')

export const reqUsers = () => ajax(BASE + '/manage/user/list')

export const reqDeleteUser = (userId) => ajax(BASE + '/manage/user/delete', {userId}, 'POST')

export const reqAddOrUpdateUser = (user) => ajax(BASE + '/manage/user/'+(user._id ? 'update' : 'add'), user, 'POST')


export const reqWeather = (lat,lon) => ajax(BASEWeather, {lat,lon,appid})