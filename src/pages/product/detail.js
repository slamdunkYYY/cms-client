import React, {Component} from 'react'
import {
	Card,
	List,
	Icon
} from 'antd'
import {reqCategory} from '../../api'
import {BASE_IMG_URL} from '../../utils/constants'

const Item = List.Item

export default class ProductDetail extends Component {
	state={
		categoryName:'',
		parentCategoryName:''
	}
	async componentDidMount() {
		const {categoryId,pCategoryId} = this.props.location.state.product
		if (pCategoryId==="0") {
			const result= await reqCategory(categoryId)
			const categoryName = result.data.name
			this.setState({
				categoryName
			})
		}
		else {
			const results = await Promise.all([reqCategory(categoryId),reqCategory(pCategoryId)])
			const categoryName=results[0].data.name
			const parentCategoryName=results[1].data.name
			this.setState({
				categoryName,
				parentCategoryName
			})
		}
	}
	render() {
		const {name,price,desc,categoryId,pCategoryId,imgs,detail} = this.props.location.state.product
		console.log("detail",this.props.location.state.product)
		const {categoryName,parentCategoryName} = this.state
		const title = (
			<span>
			<Icon
            type='arrow-left'
            style={{marginRight: 10}}
            onClick={() => this.props.history.goBack()}
          />
          <span>Detail</span>
          </span>
          )
		return (
		<Card title={title} className="product-detail">
			<List>
				<Item>
					<span className="left">name:</span>{name}
				</Item>
				<Item>
					<span className="left">description:</span>{desc}
				</Item>
				<Item>
					<span className="left">price:</span>${price}
				</Item>
				<Item>
					<span className="left">category</span>
					{categoryName}
					{parentCategoryName?'-->'+parentCategoryName:null}
				</Item>
				<Item>
					<span className="left">images</span>{imgs.map((img,index)=><img key={index} className="product-img" src={BASE_IMG_URL+img} alt="img"/>)}
				</Item>
				<Item>
					<span className="left">detail</span><div dangerouslySetInnerHTML={{__html: detail}} />
				</Item>
			</List>
		</Card>
		)
	}
}